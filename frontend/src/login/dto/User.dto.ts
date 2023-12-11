import { z } from 'zod';

export const UserDTO = z.object({
    userId: z.string(),
    username: z.string()
});
