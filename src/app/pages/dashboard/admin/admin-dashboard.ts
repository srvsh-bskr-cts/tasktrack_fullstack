import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../../shared/components/header/header';
import { AuthService } from '../../../core/services/auth.service';
import { NewWorkflowTemplate } from './manage-template/component/newWorkflowTemplate.component';
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  // HeaderComponent must be here to use <app-header> in the HTML
  imports: [CommonModule, RouterModule, HeaderComponent, NewWorkflowTemplate],
  templateUrl: './admin-dashboard.html'
})
export class AdminDashboardComponent implements OnInit {
  adminName: string = 'Admin';
  createNewDialogOpen = false

  handleCreateNewDialogOpen() {
    this.createNewDialogOpen = !this.createNewDialogOpen

  }
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('Admin Dashboard Initialized');
  }
}