import { Body, Controller, Get, Logger, Post, Res, Session, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import { EnvVars, sessionCookieName } from '~config';
import { SessionData, SessionGuard, SessionService } from '~session';
import { Environment } from '~shared';
import { UserService } from './User.service';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { LoginDTO } from './dto/Login.dto';

@Controller('user')
export class UserController {
    private readonly Logger = new Logger(UserController.name);
    constructor(
        private readonly userService: UserService,
        private readonly sessionService: SessionService,
        private readonly configService: ConfigService<EnvVars>
    ) {}

    @Post()
    public async create(
        @Body() createUserDto: CreateUserDTO,
        @Res({ passthrough: true }) res: Response
    ) {
        const user = await this.userService.createUser(createUserDto);
        const session = await this.sessionService.createSession(user.userId);
        this.setSessionCookie(res, session.sessionId);

        return user;
    }

    @UseGuards(SessionGuard)
    @Get()
    public async get(@Session() session: SessionData) {
        return await this.userService.getUserData(session.userId);
    }

    @Post('login')
    public async login(@Body() loginDto: LoginDTO, @Res({ passthrough: true }) res: Response) {
        const user = await this.userService.authenticateUser(loginDto.username, loginDto.password);

        const session = await this.sessionService.createSession(user.userId);

        this.setSessionCookie(res, session.sessionId);

        return user;
    }

    @UseGuards(SessionGuard)
    @Post('logout')
    public async logout(
        @Session() session: SessionData,
        @Res({ passthrough: true }) res: Response
    ) {
        this.removeSessionCookie(res);

        await this.sessionService.deleteSession(session.sessionId);

        return { success: true };
    }

    private setSessionCookie(res: Response, sessionId: string) {
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const secure = this.configService.get('environment') === Environment.PROD;

        res.cookie(sessionCookieName, sessionId, {
            httpOnly: true,
            maxAge: THIRTY_DAYS,
            path: '/',
            secure
        });
    }

    private removeSessionCookie(res: Response) {
        res.clearCookie(sessionCookieName);
    }
}
