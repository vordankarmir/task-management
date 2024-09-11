import { ApiProperty } from '@nestjs/swagger';

export class Member {
  @ApiProperty({
    example: 'e2b5ea37-1c02-4bd1-b912-1b09cc08b52c',
  })
  _id: string;
}
