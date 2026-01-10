export class UserInfo {
  contactEmail: string;
  name: string;
}

export class SigninResponseDto {
  message: string;
  user: UserInfo;
}

export class SignoutResponseDto {
  message: string;
}
