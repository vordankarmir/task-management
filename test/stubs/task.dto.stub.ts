import { TASK_STATUS } from '../../src/task/types';

export const dummyId = '23d33ca6-6239-4a10-9a87-755545957869';

export const taskMock = {
  title: 'Title',
  description: 'description',
  dueDate: 1726344000000,
  priority: false,
  status: TASK_STATUS.IN_PROGRESS,
  assignedMember: 'd840c0f8-835b-480c-b39c-259f6d5f788b',
};
