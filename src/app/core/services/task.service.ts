import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomJSONResponse } from '../../shared/models/user.model';
import { SubTaskCreateDTO, SubTaskDTO, WorkflowDTO, WorkflowStepStatus } from '../../shared/models/workflow.model';
import { environment } from '../../environments/environment';
import { NewTaskData } from '../../shared/models/newTask.model';
import { TaskData } from '../../shared/models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = environment.apiUrl + '/task';
  private subTaskUrl = environment.apiUrl + '/task/sub';

  constructor(private http: HttpClient) {}

  createNewTask(newTask: NewTaskData): Observable<CustomJSONResponse<TaskData>> {
    newTask.assignedToUserId = parseInt(newTask.assignedToUserId as any);
    newTask.dueDate = new Date(newTask.dueDate).toISOString();
    return this.http.post<CustomJSONResponse<TaskData>>(this.apiUrl + '/create', newTask);
  }

  getTaskById(id: number): Observable<CustomJSONResponse<TaskData>> {
    return this.http.get<CustomJSONResponse<TaskData>>(`${this.apiUrl}/id/${id}`);
  }
  getAllTasksOfUser(): Observable<CustomJSONResponse<TaskData[]>> {
    return this.http.get<CustomJSONResponse<TaskData[]>>(`${this.apiUrl}/my`);
  }
  createSubTask(subTask: SubTaskCreateDTO): Observable<CustomJSONResponse<SubTaskDTO>> {
    return this.http.post<CustomJSONResponse<SubTaskDTO>>(`${this.subTaskUrl}`, subTask);
  }

  getSubTasksByTaskId(taskId: number): Observable<CustomJSONResponse<any[]>> {
    return this.http.get<CustomJSONResponse<any[]>>(`${this.subTaskUrl}/tasks/${taskId}`);
  }

  updateSubTask(taskId: number, subTaskId: number, data: any): Observable<CustomJSONResponse<any>> {
    return this.http.put<CustomJSONResponse<any>>(
      `${this.subTaskUrl}/${taskId}/${subTaskId}`,
      data,
    );
  }

  deleteSubTask(taskId: number|null, subTaskId: number|null): Observable<void> {
    return this.http.delete<void>(`${this.subTaskUrl}/${taskId}/${subTaskId}`);
  }


  updateSubTaskStatus(taskId: number, subTaskId: number, status: string): Observable<void> {
    return this.http.patch<void>(`${this.subTaskUrl}/status/${taskId}/${subTaskId}`, { status });
  }

  deleteAllSubTasks(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.subTaskUrl}/${taskId}`);
  }
}