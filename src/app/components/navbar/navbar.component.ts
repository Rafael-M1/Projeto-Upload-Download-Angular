import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent implements OnDestroy {
  isAuthenticated = false;
  private isAuthenticatedSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.isAuthenticatedSubscription = this.loginService
      .isUserAuthenticated()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }
  ngOnDestroy(): void {
    this.isAuthenticatedSubscription.unsubscribe();
  }

  deslogar() {
    localStorage.removeItem('token');
    this.loginService.setIsAuthenticatedSubject(false);
    this.route.navigate(['login']);
    this.toastr.success('', 'Logout bem-sucedido.');
  }
}
