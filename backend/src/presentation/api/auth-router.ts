import { Hono } from 'hono';
import { AuthController } from '../controllers/auth-controller';

export const authRouter = new Hono();
const authController = new AuthController();

authRouter.post('/register', (c) => authController.register(c));
authRouter.post('/login', (c) => authController.login(c));
authRouter.post('/refresh', (c) => authController.refreshToken(c));
