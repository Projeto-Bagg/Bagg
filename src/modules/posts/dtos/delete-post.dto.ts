import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
  @ApiProperty()
  id: string;
}
