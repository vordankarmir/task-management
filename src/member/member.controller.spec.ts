import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../schemas/member.schema';

describe('MemberController', () => {
  let controller: MemberController;
  let memberModel: Model<Member>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        MemberService,
        { provide: getModelToken(Member.name), useValue: memberModel },
      ],
    }).compile();

    controller = module.get<MemberController>(MemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
