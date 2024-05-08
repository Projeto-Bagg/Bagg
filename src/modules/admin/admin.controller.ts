import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
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

  @Post('tip-reports/:id/reject')
  @isAdmin()
  @ApiBearerAuth()
  async rejectTipReport(@Param('id') id: number) {
    return this.adminService.rejectTipReport(id);
  }

  @Post('tip-reports/:id/accept')
  @isAdmin()
  @ApiBearerAuth()
  async acceptTipReport(@Param('id') id: number) {
    return this.adminService.acceptTipReport(id);
  }

  @Get('tip-comment-reports')
  @isAdmin()
  @ApiBearerAuth()
  async tipCommentReports(@Query() query: PaginationDto) {
    return this.adminService.tipCommentReports(query.page, query.count);
  }

  @Post('tip-comment-reports/:id/reject')
  @isAdmin()
  @ApiBearerAuth()
  async rejectTipCommentsReport(@Param('id') id: number) {
    return this.adminService.rejectTipCommentReport(id);
  }

  @Post('tip-comment-reports/:id/accept')
  @isAdmin()
  @ApiBearerAuth()
  async acceptTipCommentReport(@Param('id') id: number) {
    return this.adminService.acceptTipCommentReport(id);
  }

  @Get('diary-post-reports')
  @isAdmin()
  @ApiBearerAuth()
  async diaryPostsReports(@Query() query: PaginationDto) {
    return this.adminService.diaryPostReports(query.page, query.count);
  }

  @Post('diary-post-reports/:id/reject')
  @isAdmin()
  @ApiBearerAuth()
  async rejectDiaryPostReport(@Param('id') id: number) {
    return this.adminService.rejectDiaryPostReport(id);
  }

  @Post('diary-post-reports/:id/accept')
  @isAdmin()
  @ApiBearerAuth()
  async acceptDiaryPostReport(@Param('id') id: number) {
    return this.adminService.acceptDiaryPostReport(id);
  }
}
