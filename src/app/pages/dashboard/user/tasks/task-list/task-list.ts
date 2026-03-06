import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../../../../core/services/auth.service';
import { AdminService } from '../../../../../core/services/admin.service';
import { HeaderComponent } from '../../../../../shared/components/header/header';
import { BackButtonComponent } from '../../../../../shared/components/back-button/back-button';
import { PriorityConfig, TaskDTO, TaskStatusConfig } from '../../../../../shared/models/workflow.model';
import { TaskService } from '../../../../../core/services/task.service';
import { TaskData } from '../../../../../shared/models/task.model';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [HeaderComponent, BackButtonComponent, RouterLink,CommonModule],
  templateUrl: './task-list.html',
  styleUrl: './task-list.css',
})
export default class TaskList {

  private taskService = inject(TaskService);
  private userService = inject(AdminService);
  priorityConfig = PriorityConfig;
    taskStatusConfig = TaskStatusConfig;

  taskList = signal<TaskData[]|null>(null);

  ngOnInit() : void{
    this.getTasksofUser();
  }

  getTasksofUser() : void{
    this.taskService.getAllTasksOfUser().subscribe({
      next:(res)=>{
        this.taskList.set(res.data)
      }
    })
    
  }


}
