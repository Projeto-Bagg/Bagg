import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { isAdmin } from 'src/modules/auth/decorators/is-admin.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from 'src/commons/entities/pagination';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { UserFromJwt } from 'src/modules/auth/models/UserFromJwt';
import { CreateAdminDto } from 'src/modules/admin/dto/create-admin.dto';
import { AdminDashboardDto } from 'src/modules/admin/dto/admin-dashboard';
import { AdminEntity } from 'src/modules/admin/entities/admin.entity';
import { TipReportDto } from 'src/modules/admin/dto/tip-report.dto';
import { TipCommentReportDto } from 'src/modules/admin/dto/tip-comment-report.dto';
import { DiaryPostReportDto } from 'src/modules/admin/dto/diary-post-report.dto';

@Controller('admin')
@ApiTags('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Admin criado com sucesso' })
  @isAdmin()
  async create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: AdminEntity })
  @isAdmin()
  async me(@CurrentUser() currentUser: UserFromJwt) {
    return this.adminService.findById(currentUser.id);
  }

  @Get('dashboard')
  @ApiResponse({ status: 200, type: AdminDashboardDto })
  @ApiBearerAuth()
  @isAdmin()
  dashboard() {
    return this.adminService.dashboard();
  }

  @Get('tip-reports')
  @isAdmin()
  @ApiResponse({ type: TipReportDto, isArray: true })
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
  @ApiResponse({ type: TipCommentReportDto, isArray: true })
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
  @ApiResponse({ type: DiaryPostReportDto, isArray: true })
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
