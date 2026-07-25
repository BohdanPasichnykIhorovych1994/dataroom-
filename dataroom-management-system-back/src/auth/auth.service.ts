import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import {
  BCRYPT_SALT_ROUNDS,
  EMAIL_ALREADY_SIGNED_UP_MESSAGE,
  INVALID_CREDENTIALS_MESSAGE,
  USER_NOT_FOUND_MESSAGE,
} from './constants';
import { LoginDto, SignUpDto } from './dto';
import { UserDocument, UserEntity } from './schemas/user.schema';
import { AuthResponse, AuthUser, JwtPayload } from './types';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserEntity.name)
    private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signUp(dto: SignUpDto): Promise<AuthResponse> {
    const existing = await this.userModel
      .findOne({ email: dto.email })
      .select('_id')
      .lean()
      .exec();

    if (existing) {
      throw new ConflictException(EMAIL_ALREADY_SIGNED_UP_MESSAGE);
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const created = await this.userModel.create({
      email: dto.email,
      passwordHash,
      createdAt: Date.now(),
    });

    return this.issueTokens(
      { id: created._id.toString(), email: created.email },
      dto.rememberMe === true,
    );
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+passwordHash')
      .exec();

    if (!user) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    const matches = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException(INVALID_CREDENTIALS_MESSAGE);
    }

    return this.issueTokens(
      { id: user._id.toString(), email: user.email },
      dto.rememberMe === true,
    );
  }

  async me(userId: string): Promise<AuthUser> {
    const user = await this.userModel
      .findById(userId)
      .select('_id email')
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundException(USER_NOT_FOUND_MESSAGE);
    }

    return { id: user._id.toString(), email: user.email };
  }

  private issueTokens(user: AuthUser, rememberMe: boolean): AuthResponse {
    const expiresIn = rememberMe
      ? this.config.get<string>('JWT_EXPIRES_REMEMBER', '7d')
      : this.config.get<string>('JWT_EXPIRES_DEFAULT', '1d');

    const payload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: expiresIn as `${number}d`,
    });

    return { accessToken, expiresIn, user };
  }
}
