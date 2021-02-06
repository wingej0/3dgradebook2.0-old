import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard,  redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { HomeComponent } from './modules/home/home/home.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { CoursesComponent } from './modules/courses/courses/courses.component';
import { CanvasCoursesComponent } from './modules/courses/canvas-courses/canvas-courses.component';
import { StandardsComponent } from './modules/standards/standards/standards.component';
import { CanvasStandardsComponent } from './modules/standards/canvas-standards/canvas-standards.component';
import { StudentsComponent } from './modules/students/students/students.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([""]);

const routes: Routes = [
  { path : "", component : HomeComponent },
  { path : "dashboard", component : DashboardComponent, canActivate : [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin } },
  { path : "courses", component : CoursesComponent, canActivate : [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin } },
  { path : "canvas-courses", component : CanvasCoursesComponent, canActivate : [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin } },
  { path : "standards", component : StandardsComponent, canActivate : [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin } },
  { path : "canvas-standards", component : CanvasStandardsComponent, canActivate : [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin } },
  { path : "students", component : StudentsComponent, canActivate : [AngularFireAuthGuard], data : { authGuardPipe: redirectUnauthorizedToLogin } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
