import {
    CanActivate,
    ExecutionContext,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common';

import { sessionCookieName } from '~config';
import { SessionService } from './Session.service';
import { SessionTokenDTO } from './dto/Session.dto';

@Injectable()
export class SessionGuard implements CanActivate {
    private readonly Logger = new Logger(SessionGuard.name);
    constructor(private sessionService: SessionService) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        try {
            const sessionTokenCookie = req.cookies[sessionCookieName];

            const sessionId = SessionTokenDTO.parse(sessionTokenCookie);

            const session = await this.sessionService.verifySession(sessionId);

            req.session = session;

            this.sessionService.updateSessionLastSeen(session.sessionId);

            return true;
        } catch (error) {
            this.Logger.error('Error veryfing session', error);
            throw new UnauthorizedException();
        }
    }
}
