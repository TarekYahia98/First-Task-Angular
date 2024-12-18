import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
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
  private userSubscription: Subscription | null = null;
  Subscription = new Subscription();
  private navigationSubscription: Subscription | null = null;
  filteredUsers: User[] = [];
  searchTerm: string = '';

  constructor(private userService: UserService, private router: Router) {}


  ngOnInit(): void {
    this.fetchUsers();

  const sub1 =  this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/users') {
        this.fetchUsers();
      }
    });
  
  const sub2 =  this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/users') {
        this.fetchUsers();
      }
    });
  
  const sub3 =  this.navigationSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/users') {
        this.fetchUsers();
      }
    });



    this.Subscription.add(sub1);
    this.Subscription.add(sub2);
    this.Subscription.add(sub3);
  }

  fetchUsers() {
    this.userSubscription = this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.filteredUsers = [...this.users];
    });
  }


  viewUserDetails(userId: number) {
    this.router.navigate(['/user', userId]);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }


    this.Subscription.unsubscribe();
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
}
