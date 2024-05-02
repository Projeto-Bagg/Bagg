import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { isAdmin } from 'src/modules/auth/decorators/is-admin.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @isAdmin()
  overview() {
    return this.adminService.overview();
  }

  @Get('tip-reports')
  @isAdmin()
  @ApiBearerAuth()
  async tipReports(@Query() query: PaginationDto) {
    return this.adminService.tipReports(query.page, query.count);
  }

  @Get('tip-comments-reports')
  @isAdmin()
  @ApiBearerAuth()
  async tipCommentReports(@Query() query: PaginationDto) {
    return this.adminService.tipCommentReports(query.page, query.count);
  }

  @Get('diary-post-reports')
  @isAdmin()
  @ApiBearerAuth()
  async diaryPostsReports(@Query() query: PaginationDto) {
    return this.adminService.diaryPostReports(query.page, query.count);
  }
}
