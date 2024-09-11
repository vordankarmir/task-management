import { Controller, Get, Post, Param } from '@nestjs/common';
import { MemberService } from './member.service';
import { JoiValidationPipe } from '../../pipes/validation.pipe';
import * as Joi from 'joi';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Member } from './entities/member.entity';

@ApiTags('members')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @ApiOperation({ summary: 'Create Member' })
  @ApiResponse({ status: 200, description: 'Created', type: Member })
  @Post()
  async create() {
    return this.memberService.create();
  }

  @ApiOperation({ summary: 'Get all members' })
  @ApiResponse({
    status: 200,
    description: 'Find all members',
    type: [Member],
  })
  @Get()
  async findAll() {
    return this.memberService.findAll();
  }

  @ApiOperation({ summary: 'Get member by id' })
  @ApiResponse({
    status: 200,
    description: 'Find member by id',
    type: Member,
  })
  @ApiResponse({
    status: 400,
    description: 'Member id is required',
  })
  @ApiResponse({
    status: 404,
    description: 'Member not found',
  })
  @Get(':id')
  async findOne(
    @Param('id', new JoiValidationPipe(Joi.string().uuid())) id: string,
  ) {
    return this.memberService.findOne(id);
  }
}
