import * as Joi from 'joi';

export class ReportQueryDto {
  memberId: string;
  startDate: string;
  endDate: string;
}

export const reportQueryParams = Joi.object({
  memberId: Joi.string().uuid(),
  startDate: Joi.string(),
  endDate: Joi.string(),
})
  .with('startDate', 'endDate')
  .with('endDate', 'startDate');
