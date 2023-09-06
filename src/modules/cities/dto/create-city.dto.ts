import { ApiProperty } from "@nestjs/swagger";

export class CreateCityDto {
    @ApiProperty()
    name: string;
  
    @ApiProperty()
    regionId: number;
  
    @ApiProperty()
    message: string;
}
