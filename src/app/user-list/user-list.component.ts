import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../models/user.model';
import { CommonModule, Location } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule, MatPaginator, MatPaginatorModule, MatTableModule, MatSortModule, MatInputModule],
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
  dataSource = new MatTableDataSource<User>([]);
  searchTerm: string = '';

  // constructor(private userService: UserService, private router: Router, private location: Location) {}

  userService = inject(UserService);
  router = inject(Router);
  location = inject(Location);

  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
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
    const userSub = this.userService.getUsers().subscribe((data) => {
      this.users = data;
      this.dataSource = new MatTableDataSource(this.users);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
    });
    this.subscription.add(userSub);
  }

  filterUsers() {
    this.dataSource.filter = this.searchTerm.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.firstPage();
    }
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
  
  // filterUsers() {
  //   if (this.searchTerm) {
  //     this.filteredUsers = this.users.filter(user => 
  //       user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //       user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     );
  //   } else {
  //     this.filteredUsers = [...this.users];
  //   }
  // }

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

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Users per page';
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
