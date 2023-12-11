import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compare, genSalt, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/CreateUser.dto';
import { UserDAO } from './schema';
import { User } from './type/User';

// todo add rate limiting
@Injectable()
export class UserService {
    private readonly Logger = new Logger(UserService.name);
    constructor(
        @InjectModel(UserDAO.name)
        private readonly userDAO: Model<UserDAO>
    ) {}

    public async getUserData(userId: string) {
        this.Logger.log(`Getting user data for user ${userId}`);

        const user = await this.userDAO.findOne({
            userId
        });

        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        return {
            userId: user.userId,
            username: user.username
        };
    }

    public async createUser(createUserDto: CreateUserDTO) {
        this.Logger.log(`Creating user ${createUserDto.username}`);

        const salt = await genSalt(12);
        const hashedPassword = await hash(createUserDto.password, salt);

        const userToCreate: Partial<User> = {
            username: createUserDto.username,
            account: {
                password: hashedPassword
            }
        };

        const { username, userId } = await this.userDAO.create(userToCreate);

        this.Logger.log(`User created: ${username}, ${userId}`);

        return {
            userId,
            username
        };
    }

    public async authenticateUser(username: string, password: string) {
        this.Logger.log(`Authenticating user ${username}`);

        const user = await this.userDAO.findOne({
            username
        });

        if (!user) {
            // todo sleep for a bit to prevent timing attacks
            throw new HttpException('Username or password incorrect', HttpStatus.BAD_REQUEST);
        }

        const isPasswordCorrect = await compare(password, user.account.password);

        if (!isPasswordCorrect) {
            throw new HttpException('Username or password incorrect', HttpStatus.BAD_REQUEST);
        }

        return {
            userId: user.userId,
            username: user.username
        };
    }
}
