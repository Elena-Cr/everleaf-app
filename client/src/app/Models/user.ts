export interface UserDTO {
  id: number;
  username: string;
  email: string;
}

export interface UserLoginDTO {
  username: string;
  password: string;
}

export interface UserRegisterDTO {
  username: string;
  password: string;
  email: string;
}
