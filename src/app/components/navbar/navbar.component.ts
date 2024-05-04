import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  showButton: boolean = false;

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Current URL:', event.url);
        // Check the current URL and set the showButton variable accordingly
        this.showButton = event.url.includes('/cv-builder/editor');
      }
    });
  }
}
