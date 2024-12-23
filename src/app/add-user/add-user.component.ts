import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('hidden', style({ opacity: 0, transform: 'scale(0.8)' })),
      state('visible', style({ opacity: 1, transform: 'scale(1)' })),
      transition('hidden <=> visible', [animate('300ms ease-in-out')])
    ])
  ]
})
export class AddUserComponent {
  user = {
    name: '',
    age: null,
    address: '',
    email: '',
    salary: null
  };

  popupState = 'hidden';
  popupMessage = '';
  popupColor = 'success';

  router = inject(Router);
  location = inject(Location);

  saveUser() {
    if (this.isFormEmpty()) {
      this.showPopup('Form must not be empty. Please fill out all fields.', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(this.user);
    localStorage.setItem('users', JSON.stringify(users));
    this.user = {
      name: '',
      age: null,
      address: '',
      email: '',
      salary: null
    };

    this.showPopup('User added successfully!', 'success');
  }

  isFormEmpty() {
    return (
      !this.user.name ||
      this.user.age === null ||
      !this.user.address ||
      !this.user.email ||
      this.user.salary === null
    );
  }

  showPopup(message: string, type: 'success' | 'error') {
    this.popupMessage = message;
    this.popupColor = type;
    this.popupState = 'visible';
    setTimeout(() => {
      this.popupState = 'hidden';
    }, 2000);
  }
}

