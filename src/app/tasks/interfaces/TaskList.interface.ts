import { Task } from './task.interface';

export interface TaskList {
  listId: string;
  name: string;
  tasks: Task[];
}
