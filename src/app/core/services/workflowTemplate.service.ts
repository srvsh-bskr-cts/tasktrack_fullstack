import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomJSONResponse } from '../../shared/models/user.model';
import { WorkflowDTO } from '../../shared/models/workflow.model';
import { environment } from '../../environments/environment';
import { NewWorkflow, WorkflowTemplate, workflowTemplateStepUpdate, workflowTemplateUpdate } from '../../shared/models/workflowTemplate.model';

@Injectable({
    providedIn: "root"
})
export class WorkflowTemplateService{

    private apiUrl = environment.apiUrl + "/workflow/template"

      constructor(private http: HttpClient) {}

getWorkflowTemplates(): Observable<CustomJSONResponse<WorkflowTemplate[]>> {
    return this.http.get<CustomJSONResponse<WorkflowTemplate[]>>(this.apiUrl + "/all")
}

updateWorkflowStep(workflowId: number, workflowStepId:number, update:workflowTemplateUpdate): Observable<void> {
    return this.http.patch<void>(this.apiUrl + "/" + workflowId + "/" + workflowStepId, update)
}

createNewTemplate(data:NewWorkflow): Observable<void> {
    return this.http.post<void>(this.apiUrl , data)
}
}