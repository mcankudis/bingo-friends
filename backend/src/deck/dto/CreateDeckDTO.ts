import { createZodDto } from 'nestjs-zod';
import { z } from 'nestjs-zod/z';

export const CreateDeckSchema = z.object({
    name: z.string(),
    fields: z.array(z.string())
});

export class CreateDeckDTO extends createZodDto(CreateDeckSchema) {}
