import { Test, TestingModule } from '@nestjs/testing';
import { MemberService } from './member.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, Model, connect } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Member, MemberSchema } from '../../schemas/member.schema';
import { dummyId } from '../../test/stubs/task.dto.stub';
import { NotFoundException } from '@nestjs/common';

describe('MemberService', () => {
  let memberService: MemberService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let memberModel: Model<Member>;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    mongoConnection = (await connect(uri)).connection;
    memberModel = mongoConnection.model(Member.name, MemberSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberService,
        { provide: getModelToken(Member.name), useValue: memberModel },
      ],
    }).compile();

    memberService = module.get<MemberService>(MemberService);
  });

  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('create member', () => {
    it('should create member and return 200 response', async () => {
      const member = await memberService.create();

      expect(member).toHaveProperty('_id');
    });
  });

  describe('get member by id', () => {
    it('should get a member by id', async () => {
      const memberRepository = new memberModel();
      const createdMember = await memberRepository.save();

      const member = await memberService.findOne(createdMember._id);
      expect(member._id).toEqual(createdMember._id);
    });

    it('should throw 404 if member does not exist', async () => {
      try {
        await memberService.findOne(dummyId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('get all members', () => {
    it('should get all members', async () => {
      const memberRepository = new memberModel();
      await memberRepository.save();

      const members = await memberService.findAll();
      expect(members[0]).toHaveProperty('_id');
    });
  });
});
