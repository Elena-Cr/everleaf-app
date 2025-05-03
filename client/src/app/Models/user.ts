// src/app/models/user.ts
export interface UserDTO {
    id: number;
    username: string;
    email: string;
  }
  
  export interface UserLoginDTO {
    username: string;
    passwordHash: string;
  }
  
  export interface UserRegisterDTO {
    username: string;
    passwordHash: string;
    email: string;
  }
  