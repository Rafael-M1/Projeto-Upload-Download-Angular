import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { SecondpageComponent } from './pages/secondpage/secondpage.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path: '',
    component: HomepageComponent,
  },
  {
    path: 'about',
    component: SecondpageComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
