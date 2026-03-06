export interface WorkflowStepTemplate {
  workflowStepName: string;
  workflowStepPosition: number;
  workflowStepId: number;
}

export interface WorkflowTemplate {
  workflowTemplateId: number;
  workflowTemplateName: string;
  createdBy: string,
  createdAt: string,
  workflowSteps: WorkflowStepTemplate[];
}
export const UpdateWorkflowStepOperationEnum = Object.freeze({
  NEW: "NEW",
  CHANGEPOSITION: "CHANGEPOSITION",
  NAME: "NAME"
});
export interface workflowTemplateUpdate {
  name?: string;
  stepUpdate: workflowTemplateStepUpdate[]
}

export interface workflowTemplateStepNewStep {
  workflowStepName: string;
}
export interface workflowTemplateStepUpdate {
  operation: typeof UpdateWorkflowStepOperationEnum[keyof typeof UpdateWorkflowStepOperationEnum];
  position?: number;
  name?:string;
  newStep?: workflowTemplateStepNewStep
}
/**
 * A generic API response wrapper to be reused across the app
 */
export interface ApiResponse<T> {
  message: string;
  error: string | null;
  status: 'OK' | 'ERROR' | string;
  timestamp: number;
  data: T;
}

// Specifically for this response:
export type WorkflowTemplateResponse = ApiResponse<WorkflowTemplate[]>;

export interface NewWorkflow {
  workflowTemplateName: string;
  workflowSteps: {workflowStepName: string, workflowStepPosition: number}[]
}