
import { Pipe, PipeTransform } from '@angular/core';
import { Task } from '../interfaces/task.interface';

@Pipe({
  name: 'taskCategoryFilter'
})

export class TaskCategoryPipe implements PipeTransform {
   public normalizeString(str: string): string {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    }

    transform(items: Task[], searchText: string): Task[] {
      if(!items) return [];
      if(!searchText) return items;

      searchText = this.normalizeString(searchText);

      return items.filter((item: Task) => {
        if (!item.categoria) return false;
        return item.categoria.some(categoria =>
      this.normalizeString(categoria).includes(searchText));
    });
  }
}
