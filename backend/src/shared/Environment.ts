import { z } from 'nestjs-zod/z';

export enum Environment {
    DEV = 'development',
    PROD = 'production'
}

export const EnvironmentSchema = z.enum([Environment.PROD, Environment.DEV]);
