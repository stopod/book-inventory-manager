import { PrismaClient } from '@prisma/client';
import { User, UserProps, UserRole } from '../../domain/models/user/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return User.create(
      {
        email: user.email,
        password: user.password,
        name: user.name || undefined,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    console.log(`findByEmail: ${email} を検索中...`);
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log(`findByEmail: ${email} は見つかりませんでした`);
      return null;
    }

    console.log(`findByEmail: ${email} が見つかりました! ID: ${user.id}`);

    return User.create(
      {
        email: user.email,
        password: user.password,
        name: user.name || undefined,
        role: user.role as UserRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      user.id
    );
  }

  async save(user: User): Promise<User> {
    const userProps = user.props as UserProps;

    const createdUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: userProps.email,
        password: userProps.password,
        name: userProps.name,
        role: userProps.role,
        createdAt: userProps.createdAt,
        updatedAt: userProps.updatedAt,
      },
    });

    return User.create(
      {
        email: createdUser.email,
        password: createdUser.password,
        name: createdUser.name || undefined,
        role: createdUser.role as UserRole,
        createdAt: createdUser.createdAt,
        updatedAt: createdUser.updatedAt,
      },
      createdUser.id
    );
  }

  async update(user: User): Promise<User> {
    const userProps = user.props as UserProps;

    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        email: userProps.email,
        password: userProps.password,
        name: userProps.name,
        role: userProps.role,
        updatedAt: userProps.updatedAt,
      },
    });

    return User.create(
      {
        email: updatedUser.email,
        password: updatedUser.password,
        name: updatedUser.name || undefined,
        role: updatedUser.role as UserRole,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      updatedUser.id
    );
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
