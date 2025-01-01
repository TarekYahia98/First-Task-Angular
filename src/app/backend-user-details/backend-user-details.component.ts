import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { IUser } from '../models/user';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-backend-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backend-user-details.component.html',
  styleUrls: ['./backend-user-details.component.css']
})
export class BackendUserDetailsComponent implements OnInit {
  userDetails: IUser | null = null;

  userService = inject(UserService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  location = inject(Location);
  dialogRef = inject(MatDialogRef<BackendUserDetailsComponent>);
  dialogData = inject(MAT_DIALOG_DATA); 

  ngOnInit(): void {
    this.userDetails = this.dialogData;
    if (!this.userDetails) {
      const userId = Number(this.route.snapshot.paramMap.get('id'));
      if (userId) {
        this.fetchUserDetailsFromBackend(userId);
      }
    }
  }

  fetchUserDetailsFromBackend(userId: number): void {
    this.userService.getUserDetailsById(userId).subscribe({
      next: (data: IUser) => {
        this.userDetails = data;
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}

