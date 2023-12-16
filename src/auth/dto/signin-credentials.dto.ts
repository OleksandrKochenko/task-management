import { IsString, Matches, MinLength } from 'class-validator';

export class SignInCredentialsDto {
  @IsString()
  @MinLength(4)
  @Matches(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, {
    message: 'invalid email format',
  })
  email: string;

  @IsString()
  password: string;
}
