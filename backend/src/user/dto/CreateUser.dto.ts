import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

const CreateUserSchema = z.object({
    username: z.string().min(1).max(255),
    password: z.string().min(8).max(255)
});

export class CreateUserDTO extends createZodDto(CreateUserSchema) {}
