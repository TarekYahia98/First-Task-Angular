import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  user = {
    name: '',
    age: null,
    address: '',
    email: '',
    salary: null
  };

  constructor(private router: Router, private location: Location) {}

  // router = inject(Router);
  // location = inject(Location);

  saveUser() {
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

    alert('User added successfully!');
    this.location.back();
    // this.router.navigate(['/users']);
  }
}
