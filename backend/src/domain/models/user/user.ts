import { Entity } from '../shared/entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserProps {
  email: string;
  name?: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public static create(props: Partial<UserProps> & { email: string; password: string }, id?: string): User {
    const userProps: UserProps = {
      email: props.email,
      name: props.name,
      password: props.password,
      role: props.role || UserRole.USER,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date(),
    };

    return new User(userProps, id);
  }

  // Getters
  get email(): string {
    return this.props.email;
  }

  get name(): string | undefined {
    return this.props.name;
  }

  get password(): string {
    return this.props.password;
  }

  get role(): UserRole {
    return this.props.role;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // Methods
  public isAdmin(): boolean {
    return this.props.role === UserRole.ADMIN;
  }

  public updatePassword(password: string): void {
    this.props.password = password;
    this.props.updatedAt = new Date();
  }

  public updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  public updateEmail(email: string): void {
    this.props.email = email;
    this.props.updatedAt = new Date();
  }

  public updateRole(role: UserRole): void {
    this.props.role = role;
    this.props.updatedAt = new Date();
  }
}
