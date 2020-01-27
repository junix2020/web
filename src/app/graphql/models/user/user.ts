export enum Role {
  DEVELOPER = 'dev',
  ADMIN = 'admin'
}

export class UserRole {
  userRoleID: string;
  userID: string;
  user: User;
  role: Role;
}

export class User {
  userID: string;
  name: string;
  roles: UserRole[];
}

export class UserInput {
  userID: string;
  username: string;
  password: string;
  roles: UserRole[];
}
