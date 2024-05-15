import { ApiProperty } from '@nestjs/swagger';
import { ReportReasonDto } from 'src/modules/admin/dto/report-reason.dto';
import { TipCommentEntity } from 'src/modules/tip-comments/entities/tip-comment.entity';

export class TipCommentReportDto extends TipCommentEntity {
  @ApiProperty({ type: ReportReasonDto, isArray: true })
  reasons: ReportReasonDto[];
}
