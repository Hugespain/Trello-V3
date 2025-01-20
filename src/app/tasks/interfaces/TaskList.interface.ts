import { Task } from './task.interface';

export interface TaskList {
  listId: string;
  id?: string;
  name: string;
  tasks: Task[];
}
