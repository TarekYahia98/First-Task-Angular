import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../models/user.model';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit,OnDestroy {
  users: User[] = [];
  localStorageUsers: User[] = [];
  private userSubscription: Subscription | null = null;
  subscription = new Subscription();
  private navigationSubscription: Subscription | null = null;
  filteredUsers: User[] = [];
  filteredLocalStorageUsers: User[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService, private router: Router, private location: Location) {}


  ngOnInit(): void {
    this.fetchUsers();
    this.fetchLocalStorageUsers();

  const sub1 =  this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/users') {
        this.fetchUsers();
        this.fetchLocalStorageUsers();
      }
    });

    this.subscription.add(sub1);
  }

  fetchUsers() {
    this.userSubscription = this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = [...this.users];
    });
  }

  fetchLocalStorageUsers() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    this.localStorageUsers = storedUsers;
    this.filteredLocalStorageUsers = [...this.localStorageUsers];
  }

  viewUserDetails(userId: number) {
    this.router.navigate(['/user', userId]);
  }

  navigateToAddUser() {
    this.location.go('add-user');
    window.location.reload();
  }
  
  filterUsers() {
    if (this.searchTerm) {
      this.filteredUsers = this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredUsers = [...this.users];
    }
  }

  filterLocalStorageUsers() {
    if (this.searchTerm) {
      this.filteredLocalStorageUsers = this.localStorageUsers.filter(user =>
        user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredLocalStorageUsers = [...this.localStorageUsers];
    }
  }

  ngOnDestroy(): void {
    // if (this.userSubscription) {
    //   this.userSubscription.unsubscribe();
    // }
    // if (this.navigationSubscription) {
    //   this.navigationSubscription.unsubscribe();
    // }
    
    this.subscription.unsubscribe();
  }
}
