import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { LoggerService } from '@shared/services';
import { JsonWebTokenError } from 'jsonwebtoken';
import { MessageCodeError } from '@shared/classes';
export class JWTService {
  private readonly logger: LoggerService = new LoggerService('JWTService');
  private _options: jwt.SignOptions = {
    algorithm: 'HS256',
    expiresIn: '2 days',
    jwtid: process.env.JWT_ID || '',
  };
  constructor() {
    config();
  }
  get options(): jwt.SignOptions {
    return this._options;
  }
  set options(value: jwt.SignOptions) {
    this._options = value;
  }
  public async verifyToken<T>(token: string): Promise<T> {
    try {
      return (await jwt.verify(token, process.env.JWT_KEY)) as T;
    } catch (error) {
      this.logger.error(error);
      throw new JsonWebTokenError('Bad Token');
    }
  }
  public async signToken<T>(payload: T): Promise<string> {
    try {
      return await jwt.sign(payload, process.env.JWT_KEY, this._options);
    } catch (error) {
      this.logger.error(error);
      throw new MessageCodeError('AUTH.TOKEN_ERROR');
    }
  }
}
