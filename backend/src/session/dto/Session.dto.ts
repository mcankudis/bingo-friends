import { z } from 'nestjs-zod/z';

export const SessionTokenDTO = z.string().uuid();
