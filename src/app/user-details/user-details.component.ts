import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Location } from '@angular/common';
import { IUser } from '../models/user';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User | null = null;
  userDetails: IUser | null = null;
  

  // constructor(
  //   private userService: UserService,
  //   private route: ActivatedRoute,
  //   private router: Router,
  //   private location: Location
  // ) {}

userService = inject(UserService);
route = inject(ActivatedRoute);
router = inject(Router);
location = inject(Location);


  ngOnInit(): void {
    const userId = Number(this.route.snapshot.paramMap.get('id'));
    if (userId) {
       this.fetchUserDetails(userId);
       this.fetchUserDetailsFromBackend(userId);
    }
  }

  fetchUserDetails(userId: number) {
    this.userService.getUserById(userId).subscribe((data: User) => {
      this.user = data;
    });
  }

  fetchUserDetailsFromBackend(userId: number) {
    this.userService.getUserDetailsById(userId).subscribe((data: IUser) => {
      this.userDetails = data;
    });
  }

  // navigateToList(): void {
  //   debugger
  //   console.log('Navigating to users list...');
  //   this.router.navigate(['/']).then(success => {
  //     if (success) {
  //       console.log('Navigation successful.');
  //     } else {
  //       console.error('Navigation failed.');
  //     }
  //   }).catch(error => {
  //     console.error('Navigation error:', error);
  //   });
  // }


  goBack(){
    this.location.back();
  }
}
