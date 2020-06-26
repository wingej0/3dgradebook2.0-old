import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PageLayoutModule } from './page-layout/page-layout.module';
import { CoursesModule } from './courses/courses.module';
import { SharedModule } from '../shared/shared.module';
import { StandardsModule } from './standards/standards.module';
import { StudentsModule } from './students/students.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PageLayoutModule,
    HomeModule,
    DashboardModule,
    CoursesModule,
    StandardsModule,
    StudentsModule,
    SharedModule
  ]
})
export class ModulesModule { }
