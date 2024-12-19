import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AddUserComponent } from './add-user/add-user.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AddUserComponent, MatToolbarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'user-management-app';
}

