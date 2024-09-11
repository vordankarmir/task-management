import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../../schemas/member.schema';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
  constructor(@InjectModel(Member.name) private memberModel: Model<Member>) {}

  async create() {
    const createdMember = new this.memberModel();

    return createdMember.save();
  }

  async findAll() {
    return this.memberModel.find().exec();
  }

  async findOne(id: string) {
    const member = await this.memberModel.findById(id);

    if (member == null) {
      throw new NotFoundException('Member not found');
    }

    return member;
  }
}
