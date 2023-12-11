import { Component, createSignal } from 'solid-js';
import toast from 'solid-toast';
import { Button } from '~components/Button';
import { TextInput } from '~components/TextInput';
import { UserDTO } from '~login/dto/User.dto';
import { api } from '~utils';

export const RegisterPage: Component = () => {
    const [username, setUsername] = createSignal('');
    const [password, setPassword] = createSignal('');
    const [confirmPassword, setConfirmPassword] = createSignal('');

    const register = async (e: Event) => {
        e.preventDefault();

        if (!username() || !password() || !confirmPassword())
            return toast.error('Please fill in all fields', { duration: 1000 });

        if (password() !== confirmPassword())
            return toast.error('Passwords do not match', { duration: 1000 });

        try {
            toast('Registering...', { duration: 1000 });

            const response = await api.post(
                '/user',
                {
                    username: username(),
                    password: password(),
                    confirmPassword: confirmPassword()
                },
                UserDTO
            );

            console.log('response', response);

            if (response.success) {
                toast.success('Registered!', { duration: 1000 });
            } else {
                toast.error(response.errorMessage, { duration: 1000 });
            }
        } catch (error) {
            // todo send errors to server/logger/sentry
            console.log('error', error);

            if (error instanceof Error) {
                toast.error(error.message, { duration: 1000 });
                ``;
            } else {
                toast.error('Unknown error', { duration: 1000 });
            }
        }
    };

    return (
        <div>
            <h1>Register</h1>

            {/* tailwind form with max width clamp(320px, 50%, 720px) */}

            <form class="max-w-md mx-auto flex flex-col gap-1" onSubmit={register}>
                <TextInput value={username()} placeholder="Username" onChange={setUsername} />
                <TextInput
                    type="password"
                    value={password()}
                    placeholder="Password"
                    onChange={setPassword}
                />
                <TextInput
                    type="password"
                    value={confirmPassword()}
                    placeholder="Confirm Password"
                    onChange={setConfirmPassword}
                />

                <Button variant="success" type="submit">
                    Register
                </Button>
            </form>
        </div>
    );
};
