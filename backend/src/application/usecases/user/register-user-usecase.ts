import { UserRepository } from '../../../domain/repositories/user-repository';
import { User } from '../../../domain/models/user/user';
import { CreateUserDTO } from '../../dtos/user-dto';
import { PasswordService } from '../../../infrastructure/auth/bcrypt-password-service';

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService
  ) {}

  async execute(userData: CreateUserDTO): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.passwordService.hash(userData.password);

    // Create user
    const user = User.create({
      ...userData,
      password: hashedPassword,
    });

    // Save user
    return this.userRepository.save(user);
  }
}
