export class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    role?: 'admin' | 'manager' | 'member';
  }
  
  export class UpdateUserDto {
    fullName?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'manager' | 'member';
  }
  