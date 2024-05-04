import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { isAdmin } from 'src/modules/auth/decorators/is-admin.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CreateAdminDto } from 'src/modules/admin/dto/create-admin.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiBearerAuth()
  @isAdmin()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @isAdmin()
  async me(@CurrentUser() currentUser: UserFromJwt) {
    return this.adminService.findById(currentUser.id);
  }

  @Get('overview')
  @ApiBearerAuth()
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
