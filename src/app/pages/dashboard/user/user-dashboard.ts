import { Component } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header';
import { BackButtonComponent } from '../../../shared/components/back-button/back-button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-user',
  imports: [HeaderComponent,BackButtonComponent,RouterLink],
  templateUrl: './user-dashboard.html',

})
export default class UserDashboard {}
