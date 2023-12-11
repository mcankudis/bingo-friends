import { ZodError, ZodType } from 'zod';

/* Tagged Union identified by a boolean, since only two options will ever be possible */
export type ApiResponse<T> = SuccessfulApiResponse<T> | FailedApiResponse;
interface SuccessfulApiResponse<T> {
    success: true;
    data: T;
    status: number;
}

interface FailedApiResponse {
    success: false;
    errorMessage: string;
    status: number;
}

// Tagged Union identified by request method
export type HttpRequestOptions = BodyRequestOptions | NoBodyRequestOptions;

interface HttpRequestOptionsBase {
    headers?: Record<string, string>;
}

interface NoBodyRequestOptions extends HttpRequestOptionsBase {
    method: HttpMethods.GET;
}

interface BodyRequestOptions extends HttpRequestOptionsBase {
    method:
        | HttpMethods.POST
        | HttpMethods.PUT
        | HttpMethods.PATCH
        | HttpMethods.DELETE;
    body?: object;
}

export enum HttpMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

enum ResponseTypes {
    JSON = 'json',
    BLOB = 'blob',
    TEXT = 'text'
}

const defaultHeaders = {
    'Content-Type': 'application/json'
};

const defaultOptions: HttpRequestOptions = {
    method: HttpMethods.GET,
    headers: defaultHeaders
};

const isRequestWithBody = (
    arg: HttpRequestOptions
): arg is BodyRequestOptions => {
    return [
        HttpMethods.POST,
        HttpMethods.PUT,
        HttpMethods.PATCH,
        HttpMethods.DELETE
    ].includes(arg.method);
};

/**
 * The HttpService provides a wrapper around the native fetch function,
 * simplifying the api calls and further work with the response,
 * whilst also typing and optionally validating the response
 */
class HttpService {
    /**
     * Makes a GET request to a resource from our API, parses the response and optionally validates it
     * @param url Full URL to fetch from
     * @param validator (Optional) Zod validator to validate the response
     */
    public async get<T>(
        url: string,
        validator: ZodType<T> | undefined = undefined
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, validator);
    }

    /**
     * Makes a POST request to a resource from our API, parses the response and optionally validates it
     * @param url Full URL to fetch from
     * @param validator (Optional) Zod validator to validate the response
     */
    public async post<T>(
        url: string,
        body: object,
        validator: ZodType<T> | undefined = undefined
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, validator, {
            method: HttpMethods.POST,
            body
        });
    }

    /**
     * Makes a PATCH request to a resource from our API, parses the response and optionally validates it
     * @param url Full URL to fetch from
     * @param validator (Optional) Zod validator to validate the response
     */
    public async patch<T>(
        url: string,
        body: object,
        validator: ZodType<T> | undefined = undefined
    ): Promise<ApiResponse<T>> {
        return this.fetch<T>(url, validator, {
            method: HttpMethods.PATCH,
            body
        });
    }

    /**
     * Fetches a resource from our API, parses the response and optionally validates it
     * @param url Full URL to fetch from
     * @param options (Optional) Request options
     * @param validator (Optional) Zod validator to validate the response
     */
    public async fetch<T>(
        url: string,
        validator: ZodType<T> | undefined = undefined,
        options: HttpRequestOptions = defaultOptions
    ): Promise<ApiResponse<T>> {
        return this.fetchExternal<T>(
            `/api${url.startsWith('/') ? url : `/${url}`}`,
            validator,
            options
        );
    }

    /**
     * Fetches a resource, parses the response and optionally validates it
     * @param url Full URL to fetch from
     * @param options (Optional) Request options
     * @param validator (Optional) Zod validator to validate the response
     */
    public async fetchExternal<T>(
        url: string,
        validator: ZodType<T> | undefined = undefined,
        options: HttpRequestOptions = defaultOptions
    ): Promise<ApiResponse<T>> {
        if (!options.headers) {
            options.headers = defaultHeaders;
        }

        if (!options.headers['Content-Type']) {
            options.headers['Content-Type'] = 'application/json';
        }

        const requestOptions: {
            credentials: RequestCredentials;
            method: HttpMethods;
            headers: HeadersInit;
            body?: string;
        } = {
            credentials: 'same-origin',
            method: options.method,
            headers: options.headers
        };

        if (isRequestWithBody(options)) {
            requestOptions.body = JSON.stringify(options.body);
        }

        try {
            const res = await fetch(url, requestOptions);

            if (!res.ok) {
                if (res.status > 500) {
                    return this.handleError(res.statusText, res.status);
                }

                // todo define error response type
                const message = await res.text();

                return this.handleError(message, res.status);
            }

            const data: T = await this.parseResponse(res, validator);
            return { success: true, data, status: res.status };
        } catch (err: unknown) {
            console.error('Error fetching data', err);
            // todo log errors to server

            if (err instanceof ZodError) {
                // todo handle validation errors
                return this.handleError('Serwer zwrócił niepoprawne dane', 0);
            }

            if (err instanceof Error) {
                return this.handleError(err.message, 0);
            }

            if (typeof err === 'string') {
                return this.handleError(err, 0);
            }

            return this.handleError('Unknown error', 0);
        }
    }

    private handleError(
        errorMessage: string,
        status: number
    ): FailedApiResponse {
        return { success: false, errorMessage, status };
    }

    private async parseResponse<T>(
        res: Response,
        validator?: ZodType
    ): Promise<T> {
        const contentType = res.headers.get('content-type');

        const responseType = contentType?.includes('json')
            ? ResponseTypes.JSON
            : contentType?.includes('stream')
            ? ResponseTypes.BLOB
            : ResponseTypes.TEXT;

        const responsePayload =
            responseType === ResponseTypes.JSON
                ? await res.json()
                : responseType === ResponseTypes.BLOB
                ? await res.blob()
                : await res.text();

        if (validator) {
            return validator.parse(responsePayload);
        }

        return responsePayload;
    }
}

// export as singleton
export const api = new HttpService();
