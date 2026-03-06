import { ChangeDetectorRef, Component, EventEmitter, Input, model, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';


import { form, FormField, min, required } from '@angular/forms/signals';

import { Router } from '@angular/router';
import { WorkflowTemplateService } from '../../../../../core/services/workflowTemplate.service';
import { UpdateWorkflowStepOperationEnum, WorkflowStepTemplate, workflowTemplateStepUpdate } from '../../../../../shared/models/workflowTemplate.model';
import { toast } from 'ngx-sonner';
// Matches the wireframe's intent for a new task


@Component({
  selector: 'app-change-workflow-step-position',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormField],
  template:`@if (isOpen()) {
  <div class="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md transition-opacity" (click)="onCancel()"></div>
  
  <div class="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
    <div class="bg-zinc-900 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-lg w-full border border-zinc-800 pointer-events-auto transform transition-all animate-in overflow-hidden relative">
      
      <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-600/10 rounded-full blur-[60px] pointer-events-none"></div>

      <div class="px-8 py-6 border-b border-zinc-800/60 flex  justify-between items-center relative z-10">
        <div>
          <h2 class="text-xl font-black text-white uppercase tracking-tight">Change Step Position</h2>
          <p class="text-[10px] font-bold text-zinc-500 captilize tracking-[0.2em] mt-1">
           This action will change step position, running workflows will remain unaffected
          </p>
        </div>
        <button (click)="onCancel()" class="p-2 rounded-xl bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
           <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
      </div>

      <form novalidate class="relative z-10">
        <div class="p-8 space-y-6">

          <div class="space-y-3">
  <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
    Select Workflow Step
  </label>
  
  <div class="relative group">
    <select 
      [formField]="newWorkflowTemplateStepForm.stepId"
      class="w-full px-5 py-4 text-sm font-medium border border-zinc-800 rounded-2xl bg-zinc-950 text-white appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-inner cursor-pointer">
      
      <option value="" disabled selected>Choose a step...</option>
      
      @for (step of workflowTemplateSteps; track step) {
        <option [value]="step.workflowStepId" class="bg-zinc-900 text-white">
          {{ step.workflowStepName }}
        </option>
      }
    </select>

    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
        <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  </div>

  @if (newWorkflowTemplateStepForm.stepId().invalid() && newWorkflowTemplateStepForm.stepId().touched()) {
    <div class="space-y-1 mt-2 ml-1">
      @for (e of newWorkflowTemplateStepForm.stepId().errors(); track e) {
        <p class="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          {{ e.message }}
        </p>
      }
    </div>
  }
</div>

        <div class="space-y-3">
  <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
    Select Workflow Step to position after
  </label>
  
  <div class="relative group">
    <select 
      [formField]="newWorkflowTemplateStepForm.toPositionAfter"
      class="w-full px-5 py-4 text-sm font-medium border border-zinc-800 rounded-2xl bg-zinc-950 text-white appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-inner cursor-pointer">
      
      <option value="" disabled selected>Choose a step...</option>
      
      @for (step of workflowTemplateSteps; track step) {
        <option [value]="step.workflowStepId" class="bg-zinc-900 text-white">
          {{ step.workflowStepName }}
        </option>
      }
    </select>

    <div class="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 group-focus-within:text-indigo-500 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="3">
        <path d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      </svg>
    </div>
  </div>

  @if (newWorkflowTemplateStepForm.toPositionAfter().invalid() && newWorkflowTemplateStepForm.toPositionAfter().touched()) {
    <div class="space-y-1 mt-2 ml-1">
      @for (e of newWorkflowTemplateStepForm.toPositionAfter().errors(); track e) {
        <p class="text-[11px] font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
          <span class="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>
          {{ e.message }}
        </p>
      }
    </div>
  }
</div>
        </div>

        <div class="bg-zinc-900/50 px-8 py-6 flex gap-4 justify-end border-t border-zinc-800/60">
          <button (click)="onCancel()" 
                  [disabled]="isLoading()"
                  type="button"
                  class="px-5 py-2.5 text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
            Cancel
          </button>
          
          <button (click)="onConfirm()" 
                  [disabled]="isLoading()"
                  type="submit"
                  class="px-8 py-3 text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest disabled:opacity-50">
            @if (isLoading()) {
              <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            } @else {
              Submit
            }
          </button>
        </div>
      </form>
    </div>
  </div>
}`,
  styles: [`
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.98) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
    .animate-in { animation: zoomIn 0.2s cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class ChangeWorkflowTemplateStepDialog {
isOpen = model(false);
@Input() workflowTemplateStepId!:number;
  @Input() workflowTemplateId!: number;
@Input() workflowTemplateSteps!:WorkflowStepTemplate[]
  @Output() cancel = new EventEmitter<boolean>();



  isLoading = signal(false)
  constructor(private workflowTemplateService: WorkflowTemplateService, private route:Router){}
  workflowTemplateStepData= signal<{stepId: any, toPositionAfter: any}>({
    stepId: null,
    toPositionAfter: null
  });
  newWorkflowTemplateStepForm = form(this.workflowTemplateStepData, (schemaPath) => {
    required(schemaPath.stepId, {message: "Step Id is required"}),
     required(schemaPath.toPositionAfter, {message: "Step Id is required"})
   
   })

  private resetForm():{stepId: number| null, toPositionAfter: number|null}{
    return {
          stepId: null,
    toPositionAfter: null
  };
  }

  onConfirm(): void {
    
      this.isLoading.update(v => !v);
    if(!this.newWorkflowTemplateStepForm().valid()) {
        //todo add toast
        this.isLoading.update(v => !v);
        return
    }
      this.workflowTemplateService.updateWorkflowStep(this.workflowTemplateId, this.workflowTemplateStepData().stepId!, {stepUpdate: [{operation: UpdateWorkflowStepOperationEnum.CHANGEPOSITION,position: this.workflowTemplateStepData().toPositionAfter!}]})
      .subscribe(
        {
            next: () => {
                  this.isLoading.update(v => !v);
              
             this.cancel.emit(true)
                toast.success("Step position changed")
                 this.workflowTemplateStepData.set(this.resetForm())
                 this.newWorkflowTemplateStepForm().reset()
            },
            error: () => {
                  this.isLoading.update(v => !v);
               
                toast.error("Error while changing position")
            }
        }
      )

   

      // TODO sonnar error handling
 
  }

  onCancel(): void {
    this.cancel.emit(false);
    this.workflowTemplateStepData.set(this.resetForm())
    this.isOpen.set(false);
  }
 ngOnDestroy(): void {
 this.workflowTemplateStepData.set(this.resetForm())
  }
}



