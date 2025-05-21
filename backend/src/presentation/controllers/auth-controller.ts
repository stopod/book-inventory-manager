import { Context } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { RegisterUserUseCase } from "../../application/usecases/user/register-user-usecase";
import { LoginUserUseCase } from "../../application/usecases/user/login-user-usecase";
import { JwtService } from "../../infrastructure/auth/jwt-service";
import { PrismaUserRepository } from "../../infrastructure/repositories/prisma-user-repository";
import { BcryptPasswordService } from "../../infrastructure/auth/bcrypt-password-service";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export class AuthController {
  private readonly userRepository: PrismaUserRepository;
  private readonly passwordService: BcryptPasswordService;
  private readonly jwtService: JwtService;

  constructor() {
    this.userRepository = new PrismaUserRepository();
    this.passwordService = new BcryptPasswordService();
    this.jwtService = new JwtService();
  }

  register = async (c: Context) => {
    try {
      // リクエストボディを簡単に受け取る
      const body = await c.req.json();

      const registerUseCase = new RegisterUserUseCase(
        this.userRepository,
        this.passwordService
      );

      try {
        const user = await registerUseCase.execute({
          email: body.email,
          password: body.password,
          name: body.name,
        });

        const { password, ...userWithoutPassword } = user;

        const accessToken = await this.jwtService.generateToken(user.id);
        const refreshToken = await this.jwtService.generateRefreshToken(
          user.id
        );

        return c.json(
          {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
          },
          201
        );
      } catch (error) {
        if (error instanceof Error) {
          return c.json(
            {
              status: 400,
              message: error.message,
            },
            400
          );
        }

        return c.json(
          {
            status: 500,
            message: "Internal Server Error",
          },
          500
        );
      }
    } catch (validationError) {
      return c.json(
        {
          status: 400,
          message: "Validation error",
          errors: validationError.message,
        },
        400
      );
    }
  };

  login = async (c: Context) => {
    try {
      const body = await c.req.json();

      console.log(`ログイン試行: ${body.email}`);

      // ユーザーをメールアドレスで直接検索 - 簡略化版
      const user = await this.userRepository.findByEmail(body.email);

      if (!user) {
        console.log(`ユーザーが見つかりません: ${body.email}`);
        return c.json(
          {
            status: 401,
            message: "Invalid email or password",
          },
          401
        );
      }

      console.log(`ユーザーが見つかりました ID: ${user.id}`);

      // パスワード照合
      const isPasswordValid = await this.passwordService.compare(
        body.password,
        user.password
      );

      console.log(`パスワード照合結果: ${isPasswordValid}`);

      if (!isPasswordValid) {
        return c.json(
          {
            status: 401,
            message: "Invalid email or password",
          },
          401
        );
      }

      // トークン生成
      const accessToken = await this.jwtService.generateToken(user.id);
      const refreshToken = await this.jwtService.generateRefreshToken(user.id);

      // パスワードを隠してユーザー情報を返す
      const { password, ...userWithoutPassword } = user.props as any;

      return c.json({
        user: { id: user.id, ...userWithoutPassword },
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof Error) {
        return c.json(
          {
            status: 401,
            message: error.message,
          },
          401
        );
      }

      return c.json(
        {
          status: 500,
          message: "Internal Server Error",
        },
        500
      );
    }
  };

  refreshToken = async (c: Context) => {
    try {
      const body = await c.req.json();
      const { refreshToken } = body;

      if (!refreshToken) {
        return c.json(
          {
            status: 400,
            message: "Refresh token is required",
          },
          400
        );
      }

      const payload = await this.jwtService.verifyRefreshToken(refreshToken);
      const accessToken = await this.jwtService.generateToken(payload.sub);

      return c.json({
        accessToken,
      });
    } catch (error) {
      return c.json(
        {
          status: 401,
          message: "Invalid refresh token",
        },
        401
      );
    }
  };
}
