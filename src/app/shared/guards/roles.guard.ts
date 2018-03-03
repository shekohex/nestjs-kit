import { Reflector } from '@nestjs/core';
import { Guard, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JWTService } from '../services';
import { Role } from '../enums';

@Guard()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector, private readonly jwtService: JWTService) {}

  async canActivate(req, context: ExecutionContext): Promise<boolean> {
    // check if decorator is present with permissions
    const { parent, handler } = context;
    const roles = this.reflector.get<Role[]>('roles', handler);
    if (!roles) {
      // route without the @Role decorator, so no roles are required
      return true;
    } else {
      if (
        req.headers.authorization &&
        (req.headers.authorization as string).split(' ')[0] === 'Bearer'
      ) {
        try {
          // validate token
          const token = (req.headers.authorization as string).split(' ')[1];
          const decodedToken = await this.jwtService.verifyToken<any>(token);

          // get database user
          //TODO: const dbUser =  await this.jwtService.getUserByEmail(decodedToken.email);
          const dbUser = { roles: [] };

          // validate permissions
          const userHasRole = () =>
            !!dbUser.roles.find(role => !!roles.find(item => item === role));
          return userHasRole();
        } catch (err) {
          throw new UnauthorizedException();
        }
      }
    }
  }
}
