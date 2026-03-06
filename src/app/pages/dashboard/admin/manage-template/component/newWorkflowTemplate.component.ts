import { Component, EventEmitter, Output, model, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormField, form, required, minLength, maxLength } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { WorkflowTemplateService } from '../../../../../core/services/workflowTemplate.service';
import { NewWorkflow, WorkflowStepTemplate } from '../../../../../shared/models/workflowTemplate.model';
import { toast } from 'ngx-sonner';

interface StepEntry {
  name: string;
  position: number;
}

interface TemplateUpdateData {
  workflowTemplateName: string;
  numberOfSteps: number | null;
  workflowTemplateSteps: StepEntry[] | null;
}

@Component({
  selector: 'app-new-workflow-template',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormField],
  template: `
    @if (isOpen()) {
    <div class="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl transition-opacity" (click)="onCancel()"></div>
    
    <div class="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
      <div class="bg-zinc-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-2xl w-full border border-zinc-800 pointer-events-auto transform transition-all animate-in overflow-hidden relative flex flex-col max-h-[90vh]">
        
        <div class="px-10 py-8 border-b border-zinc-800/60 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h2 class="text-2xl font-black text-white uppercase tracking-tighter">Create New workflow</h2>
          </div>
          <button (click)="onCancel()" class="p-3 rounded-2xl bg-zinc-800/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all active:scale-90">
             <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
               <path d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        <div class="overflow-y-auto custom-scrollbar p-10 space-y-10">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Template Name</label>
              <input type="text" [formField]="newWorkflowTemplateForm.workflowTemplateName" placeholder="e.g. CORE_ENGINE_V1"
                     class="w-full px-5 py-4 text-sm font-bold border border-zinc-800 rounded-2xl bg-zinc-950 text-white placeholder:text-zinc-700 focus:border-indigo-500 outline-none transition-all">
            </div>

            <div class="space-y-3">
              <label class="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Number of steps</label>
              <input type="number" [formField]="newWorkflowTemplateForm.numberOfSteps" (input)="generateSteps($event)"
                     class="w-full px-5 py-4 text-sm font-bold border border-zinc-800 rounded-2xl bg-zinc-950 text-white placeholder:text-zinc-700 focus:border-indigo-500 outline-none transition-all">
            </div>
          </div>

          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="h-px flex-1 bg-zinc-800"></div>
              <h3 class="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Step Data</h3>
              <div class="h-px flex-1 bg-zinc-800"></div>
            </div>

            @if (!workflowTemplateData().workflowTemplateSteps?.length) {
              <div class="py-12 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-[2rem] bg-zinc-950/30 text-center">
                <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-4 text-zinc-500">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p class="text-xs font-bold text-zinc-500 uppercase tracking-widest">Choose number of steps to continue</p>
              </div>
            } @else {
              <div class="grid gap-4">
                @for (step of workflowTemplateData().workflowTemplateSteps; track $index) {
                  <div class="group flex gap-4 p-4 bg-zinc-950 border border-zinc-800 rounded-2xl transition-all hover:border-zinc-700">
                    <div class="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-black text-indigo-500 tabular-nums">
                      {{ $index + 1 }}
                    </div>
                    <div class="flex-1">
                      <input type="text" [(ngModel)]="step.name" placeholder="Step Name"
                             class="w-full h-full bg-transparent border-none text-sm font-bold text-white placeholder:text-zinc-700 focus:ring-0 outline-none">
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>

        <div class="bg-zinc-900 px-10 py-8 flex gap-4 justify-end border-t border-zinc-800/60 sticky bottom-0 z-20">
          <button (click)="onCancel()" [disabled]="isLoading()" type="button" class="px-6 py-3 text-[11px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
            Discard
          </button>
          
          <button (click)="onConfirm()" [disabled]="isLoading() || !newWorkflowTemplateForm().valid()" type="submit"
                  class="px-10 py-4 text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all active:scale-95 flex items-center gap-3 uppercase tracking-widest disabled:opacity-30 disabled:grayscale">
            @if (isLoading()) {
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            } @else {
              Submit
            }
          </button>
        </div>
      </div>
    </div>
    }
  `,
  styles: [`
    .animate-in { animation: zoomIn 0.3s cubic-bezier(0, 0, 0.2, 1); }
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3f3f46; }
  `]
})
export class NewWorkflowTemplate {
  isOpen = model(false);
  @Output() cancel = new EventEmitter<boolean>();

  isLoading = signal(false);
  workflowTemplateData = signal<TemplateUpdateData>({
    workflowTemplateName: '',
    numberOfSteps: null,
    workflowTemplateSteps:null
  });

  newWorkflowTemplateForm = form(this.workflowTemplateData, (schemaPath) => {
    required(schemaPath.workflowTemplateName, { message: "Name required" });
    required(schemaPath.numberOfSteps, { message: "Quantity required" });

  });

  constructor(private workflowTemplateService: WorkflowTemplateService, private route: Router) {

  }

// 1. Update the function to handle null/undefined safely
generateSteps(e:Event) {
const element = e.target as HTMLInputElement;
    const count = parseInt(element.value)
  // Explicit check for null or zero to clear the node registry
  if (count === null || count === undefined || count <= 0) {
    this.workflowTemplateData.update(d => ({ 
      ...d, 
      workflowTemplateSteps: [] // Set to empty array rather than null for easier rendering
    }));
    return;
  }

  // Safety cap for system stability
  const safeCount = Math.min(count, 15);

  // Generate the node sequence
  const newSteps: StepEntry[] = Array.from({ length: safeCount }, (_, i) => ({
    name: '',
    position: i + 1
  }));

  this.workflowTemplateData.update(d => ({
    ...d,
    workflowTemplateSteps: newSteps
  }));


}
  private resetForm(): TemplateUpdateData {
    return {
      workflowTemplateName: '',
      numberOfSteps: null,
      workflowTemplateSteps: null
    };
  }

  onConfirm(): void {
    if (!this.newWorkflowTemplateForm().valid()) return;

    const steps = this.workflowTemplateData().workflowTemplateSteps;
    const hasEmptySteps = steps?.some(s => !s.name.trim());

    if (!steps || steps.length === 0 || hasEmptySteps) {
      toast.error("Please fill all step names");
      return;
    }

    this.isLoading.set(true);

    const payload: NewWorkflow = {
      workflowTemplateName: this.workflowTemplateData().workflowTemplateName,
      workflowSteps: steps.map(el => ({
        workflowStepName: el.name,
        workflowStepPosition: el.position
      }))
    };
console.log(payload)
    this.workflowTemplateService.createNewTemplate(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toastSuccess();
        this.cancel.emit(true)

      },
      error: () => {
        this.isLoading.set(false);
        toast.error("Deployment failed");
      }
    });
  }

  private toastSuccess() {
    toast.success("Workflow Template Created", {
      description: `Template ${this.workflowTemplateData().workflowTemplateName} is now active.`
    });
  }

  onCancel(): void {
    this.cancel.emit(false);
    this.workflowTemplateData.set(this.resetForm());
    this.newWorkflowTemplateForm().reset();
    this.isOpen.set(false);
  }
}