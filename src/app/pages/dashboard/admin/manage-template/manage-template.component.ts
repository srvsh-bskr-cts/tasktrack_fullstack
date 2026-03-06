import { Component, inject, signal } from '@angular/core';
import { HeaderComponent } from '../../../../shared/components/header/header';
import { BackButtonComponent } from '../../../../shared/components/back-button/back-button';
import { WorkflowTemplateService } from '../../../../core/services/workflowTemplate.service';
import { WorkflowStepTemplate, WorkflowTemplate, workflowTemplateUpdate } from '../../../../shared/models/workflowTemplate.model';
import { toast } from 'ngx-sonner';
import { DatePipe } from '@angular/common';
import { NewWorkflowTemplateStepDialog } from './component/newWorkflowTemplateStepDialog.component';
import { ChangeWorkflowTemplateStepDialog } from './component/changeWorkflowStepPosition.component';
import { ChangeWorkflowTemplateStepNameDialog } from './component/updateWorkflowTemplateStepName.component';
import { NewWorkflowTemplate } from './component/newWorkflowTemplate.component';

interface componentState  {
  loading:boolean;
  error: {
    state: boolean;
    message: string|null
  };
  
}

@Component({
  selector: 'app-user',
  imports: [HeaderComponent, BackButtonComponent, DatePipe,NewWorkflowTemplate,  NewWorkflowTemplateStepDialog, ChangeWorkflowTemplateStepDialog, ChangeWorkflowTemplateStepNameDialog],
  templateUrl: './manage-template.template.html',


})
export class ManageTemplate {

    isNewWorkFlowStepTemplateDialogOpen = signal(false)
selectedTemplate = signal<WorkflowTemplate | null>(null);
selectedTemplateStepId = signal<number | null> (null)
// Update this method to accept the template
type = signal<number>(0)

selectedTemplateSteps = signal<WorkflowStepTemplate[] |
null>(null)

    openDialogs(type:number, meta?:{template:WorkflowTemplate | any }) {
  console.log("I was cliecker ", type)
      switch(type) {
        case 1:
          this.selectedTemplate.set(meta?.template);
          this.isNewWorkFlowStepTemplateDialogOpen.set(true);
          break;
        case 2:
          this.selectedTemplate.set(meta?.template);
          this.selectedTemplateSteps.set(meta?.template.workflowSteps)
          this.isNewWorkFlowStepTemplateDialogOpen.set(true);
          break;
        case 3:
          this.selectedTemplate.set(meta?.template);
          this.selectedTemplateSteps.set(meta?.template.workflowSteps)
          this.isNewWorkFlowStepTemplateDialogOpen.set(true);
          break;
        case 4:
          this.isNewWorkFlowStepTemplateDialogOpen.set(true);
          break;

        }

          this.type.set(type)
    }

    handleDialogClose(success:boolean) {
      if(success) {

        this.getWorkflowTemplates()
      } 

        this.isNewWorkFlowStepTemplateDialogOpen.update(v => !v)
        this.selectedTemplate.set(null)
        this.selectedTemplateSteps.set(null)
        this.type.set(0)
    }


    workflowTemplateService = inject(WorkflowTemplateService);

    workflowTemplates!: WorkflowTemplate[];
    workflowTemplateUpdate?: workflowTemplateUpdate;

    
    compState = signal<componentState>({loading: true, error: {state:false, message: null}})

    private updateState(partialState: Partial<componentState>) {
    this.compState.update(state => ({ ...state, ...partialState }));
  }
  getWorkflowTemplates() {
  this.workflowTemplateService.getWorkflowTemplates().subscribe({
        next: (res) => {
          console.log(res.status)
          if(res.status == "OK") {
            
           this.workflowTemplates = res.data.map(template => {
  return {
    ...template,
    workflowSteps: [...template.workflowSteps].sort((a, b) => 
      a.workflowStepPosition - b.workflowStepPosition
    )
  };
});
            this.updateState({ loading: false });
          } else {
            toast.error(res.errors);
            this.updateState({loading: false,error: {
              message: res.errors,
              state: true
            }})
            
          }
        }, 
        error: (e) => {
    this.updateState({loading: false,error: {
              message: e,
              state: true
            }})
          toast.error(e)
        }
      }) 
  }
     ngOnInit(): void {
      this.getWorkflowTemplates()
    
    }



     ngOnDestroy(): void {

  }
}
