import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './core/about-us/about-us.component';
import { ForgotPasswordComponent } from './core/auth/forgot-password/forgot-password.component';
import { LoginComponent } from './core/auth/login/login.component';
import { RegisterComponent } from './core/auth/register/register.component';
import { HomepageComponent } from './core/homepage/homepage.component';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  {
    'path':'',
    'component':HomepageComponent,
  },
  {
    'path':'register',
    component:RegisterComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'aboutUs',
    component:AboutUsComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'forgotPassword',
    component:ForgotPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
