import { ApiProperty } from '@nestjs/swagger';

export class AdminDashboardDto {
  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  totalPosts: number;

  @ApiProperty()
  totalReports: number;
}
