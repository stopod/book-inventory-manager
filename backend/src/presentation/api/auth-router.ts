import { Hono } from 'hono';
import { AuthController } from '../controllers/auth-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

export const authRouter = new Hono();
const authController = new AuthController();

// 認証不要なルート
authRouter.post('/register', (c) => authController.register(c));
authRouter.post('/login', (c) => authController.login(c));
authRouter.post('/refresh', (c) => authController.refreshToken(c));

// 認証必要なルート
authRouter.get('/me', authMiddleware, (c) => authController.getMe(c));
