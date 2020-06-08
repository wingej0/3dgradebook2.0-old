import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';
import { DashboardComponent } from './modules/dashboard/dashboard/dashboard.component';
import { CoursesComponent } from './modules/courses/courses/courses.component';
import { CanvasCoursesComponent } from './modules/courses/canvas-courses/canvas-courses.component';


const routes: Routes = [
  { path : "", component : HomeComponent },
  { path : "dashboard", component : DashboardComponent },
  { path : "courses", component : CoursesComponent },
  { path : "canvas-courses", component : CanvasCoursesComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
