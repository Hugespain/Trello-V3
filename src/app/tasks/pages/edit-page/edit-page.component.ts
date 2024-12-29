import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TasksService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.css']
})
export class EditPageComponent implements OnInit {
  public task: Task | undefined;

  constructor(
    private route: ActivatedRoute,
    private taskService: TasksService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.taskService.getTaskById(+id).subscribe(task => {
        this.task = task;
      });
    }
  }
}
