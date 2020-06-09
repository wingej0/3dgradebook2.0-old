import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PageLayoutModule } from './page-layout/page-layout.module';
import { CoursesModule } from './courses/courses.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PageLayoutModule,
    HomeModule,
    DashboardModule,
    CoursesModule,
    SharedModule
  ]
})
export class ModulesModule { }
