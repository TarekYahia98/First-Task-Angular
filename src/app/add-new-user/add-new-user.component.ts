import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatDialogRef } from '@angular/material/dialog';
import { IUser } from '../models/user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-new-user',
  standalone: true,
  imports: [[CommonModule, FormsModule]],
  templateUrl: './add-new-user.component.html',
  styleUrls: ['./add-new-user.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('hidden', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')])
    ])
  ]

})
export class AddNewUserComponent {

  popupState = 'hidden';
  popupMessage = '';
  popupColor = 'success';

  private userService = inject(UserService);
  dialogRef = inject(MatDialogRef<AddNewUserComponent>);
  router = inject(Router);
  location = inject(Location);

newUser : IUser = {
    name: '',
    username: '',
    email: '',
    age: null,
    salary: null,
    addressStreet: '',
    addressSuite: '',
    addressCity: '',
    addressZipcode: '',
    addressGeoLat: '',
    addressGeoLng: '',
    phone: '',
    website: '',
    companyName: '',
    companyCatchPhrase: '',
    companyBs: ''
  };
  saveBackendUser() {
    console.log(this.newUser);
    if (this.isFormInvalid()) {
      this.showPopup('Name, Username, and Email are required fields.', 'error');
      return;
    }
  
    this.userService.createUser(this.newUser).subscribe({
      next: () => {
        this.showPopup('User added successfully!', 'success');
        this.resetForm();
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.showPopup('Failed to add user. Please try again.', 'error');
      }
    });
  }
  
  isFormInvalid() {
    return !this.newUser.name || !this.newUser.username || !this.newUser.email;
  }

  resetForm() {
    this.newUser = {
      name: '',
      username: '',
      email: '',
      age: null,
      salary: null,
      addressStreet: '',
      addressSuite: '',
      addressCity: '',
      addressZipcode: '',
      addressGeoLat: '',
      addressGeoLng: '',
      phone: '',
      website: '',
      companyName: '',
      companyCatchPhrase: '',
      companyBs: ''
    };
  }

  showPopup(message: string, type: 'success' | 'error') {
    this.popupMessage = message;
    this.popupColor = type;
    this.popupState = 'visible';
    setTimeout(() => {
      this.popupState = 'hidden';
    }, 2000);
  }

  closeForm() {
    this.dialogRef.close();
  }
}
