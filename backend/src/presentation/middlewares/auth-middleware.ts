import { Context, Next } from 'hono';
import { JwtService } from '../../infrastructure/auth/jwt-service';
import { PrismaUserRepository } from '../../infrastructure/repositories/prisma-user-repository';

const jwtService = new JwtService();
const userRepository = new PrismaUserRepository();

export const authMiddleware = async (c: Context, next: Next) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json(
      {
        status: 401,
        message: 'Unauthorized: No token provided',
      },
      401
    );
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const payload = await jwtService.verifyToken(token);
    const user = await userRepository.findById(payload.sub);
    
    if (!user) {
      return c.json(
        {
          status: 401,
          message: 'Unauthorized: Invalid token',
        },
        401
      );
    }
    
    // Set user in context for use in controllers
    c.set('user', user);
    await next();
  } catch (error) {
    return c.json(
      {
        status: 401,
        message: 'Unauthorized: Invalid token',
      },
      401
    );
  }
};
