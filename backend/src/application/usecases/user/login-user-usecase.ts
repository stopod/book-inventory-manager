import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/models/user/user';
import { LoginUserDTO } from '../../dtos/user-dto';
import { PasswordService } from '../../../infrastructure/auth/bcrypt-password-service';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(loginData: LoginUserDTO): Promise<User> {
    // Find user by email
    console.log(`ユーザー検索: ${loginData.email}`);
    const user = await this.userRepository.findByEmail(loginData.email);
    if (!user) {
      console.log(`ユーザーが見つかりません: ${loginData.email}`);
      throw new Error('Invalid email or password');
    }

    console.log(`ユーザーが見つかりました: ${user.id}. パスワードを照合します...`);

    // Verify password
    const isPasswordValid = await this.passwordService.compare(
      loginData.password,
      user.password
    );
    console.log(`パスワード照合結果: ${isPasswordValid}`);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return user;
  }
}
