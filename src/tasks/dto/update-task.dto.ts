import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDescDto {
  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateTaskTitleDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
