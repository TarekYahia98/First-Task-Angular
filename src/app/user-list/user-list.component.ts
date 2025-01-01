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
import { IUser } from '../models/user';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddNewUserComponent } from '../add-new-user/add-new-user.component';



@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule,FormsModule, MatPaginator, MatPaginatorModule, MatTableModule, MatSortModule, MatInputModule, MatIconModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit,OnDestroy {
  jsonApiUsers: User[] = [];
  backendUsers: IUser[] = [];
  localStorageUsers: User[] = [];

  private userSubscription: Subscription | null = null;
  subscription = new Subscription();
  private navigationSubscription: Subscription | null = null;

  filteredUsers: User[] = [];
  filteredLocalStorageUsers: User[] = [];
  filteredBackendUsers: User[] = [];


  jsonApiDataSource  = new MatTableDataSource<User>([]);
  localStorageDataSource = new MatTableDataSource<User>();
  backendDataSource = new MatTableDataSource<IUser>();
  
  searchTerm: string = '';

  // constructor(private userService: UserService, private router: Router, private location: Location) {}

  userService = inject(UserService);
  router = inject(Router);
  location = inject(Location);
  dialog = inject(MatDialog);
  snackBar = inject(MatSnackBar);



  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  ngOnInit(): void {
    this.fetchUsers();
    this.fetchLocalStorageUsers();
    this.fetchAllUsers();

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
      this.jsonApiUsers = data;
      this.jsonApiDataSource = new MatTableDataSource(this.jsonApiUsers);
      if (this.paginator) {
        this.jsonApiDataSource.paginator = this.paginator;
      }
    });
    this.subscription.add(userSub);
  }

  fetchAllUsers() {
    const userSub2 = this.userService.getAllUsers().subscribe((data: IUser[]) => {
        this.backendUsers = data;
        this.backendDataSource = new MatTableDataSource(this.backendUsers);
        if (this.paginator) {
            this.backendDataSource.paginator = this.paginator;
        }
    });
    this.subscription.add(userSub2);
}


  // filterUsers() {
  //   this.jsonApiDataSource.filter = this.searchTerm.trim().toLowerCase();
  //   if (this.paginator) {
  //     this.paginator.firstPage();
  //   }
  // }

  filterAllUsers() {
    this.backendDataSource.filter = this.searchTerm.trim().toLowerCase();
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  fetchLocalStorageUsers() {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    this.localStorageUsers = storedUsers;
    this.filteredLocalStorageUsers = [...this.localStorageUsers];
    if (this.paginator) {
      this.paginator.firstPage();
    }
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

  filterUsers(): void {
    const filterValue = this.searchTerm.trim().toLowerCase();
    this.jsonApiDataSource.filter = filterValue;
    this.backendDataSource.filter = filterValue;
    this.localStorageDataSource.filter = filterValue;
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.jsonApiDataSource.paginator = this.paginator;
      this.paginator._intl.itemsPerPageLabel = 'Users per page';
    }
  }

  openDeleteDialog(userId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '500px',
      data: { userId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteUser(userId);
      }
    });
  }

  openEditDialog(user: IUser): void {
    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '500px',
      data: user,
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result && user.id !== undefined) {
        this.updateUser(user.id, result);
      } else {
        console.error('User ID is missing or invalid');
      }
    });
  }
  

  openAddUserDialog(): void {
    const dialogRef = this.dialog.open(AddNewUserComponent, {
      width: '600px',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'userAdded') {
        this.refreshTable();
      }
    });
  }
  

  updateUser(id: number, userDetails: IUser): void {
    this.userService.updateUser(id, userDetails).subscribe({
      next: (updatedUser) => {
        this.refreshTable();
        this.snackBar.open('User updated successfully!', 'Close', { duration: 3000 });
      },
      error: (err) => {
        console.error('Error updating user:', err);
        this.snackBar.open('Failed to update user.', 'Close', { duration: 3000 });
      },
    });
  }
  
  refreshTable(): void {
    this.fetchAllUsers();
  }
  

  deleteUser(userId: number): void {
    const userSub3 = this.userService.deleteUser(userId).subscribe(
      () => {
        this.fetchUsers();
        this.fetchLocalStorageUsers();
        this.fetchAllUsers();
        
        this.router.navigate(['/users']);
      },
      (error) => {
        console.error('Error deleting user:', error);
      }
    );
    this.subscription.add(userSub3);

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


