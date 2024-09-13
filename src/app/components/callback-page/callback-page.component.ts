import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../../services/progress.service';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '@auth0/auth0-angular';
import { DataService } from '../../../services/data.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './callback-page.component.html',
  styleUrl: './callback-page.component.scss'
})
export class CallbackPageComponent implements OnInit {

  progress: number = 0;
  user!: User | null | undefined;

  constructor(private router: Router, private progressService: ProgressService, public auth: AuthService, private dataService: DataService, private http: HttpClient){
  }

  ngOnInit(){

    this.apiCall();


      // this.progressService.progress$.subscribe({
      //   next: (res) => {
      //     this.progress = res;
      //   }
      // })
  }

  apiCall(){
    if(this.auth.user$){
      this.auth.user$.subscribe(user => {
        this.user = user; // Assign the user information to the user property
        console.log(this.user);

        const email = this.user?.email
        const isEmailVerified = this.user?.email_verified;
        const profile = this.user?.picture;
        const fullname = this.user?.name;
        const authID = this.user?.sub;

        const payload = {
          email, isEmailVerified, profile, fullname, authID
        }


        this.dataService.addUser(payload).subscribe({
          next: (response: any) => {
            if(response.type === HttpEventType.DownloadProgress){
              this.progress = response.total ? Math.round((100 * response.loaded) / response.total) : 0;
            }else if (response.type === HttpEventType.Response) {
              // Handle the response when the call completes
              console.log('API call successful', response.body);
              console.log('User added successfully!', response);

              this.progress = 100; // Complete the progress bar
              this.router.navigate(['/cv-builder/editor']); // Redirect to the success page
            }
            // console.log('User added successfully!', response);
          },
          error: (err: any) => {
            // console.error('API call failed', err);
            console.log('Error adding user.', err);

          }
        })
        
      });
    }
  }
}
