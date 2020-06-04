import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses/courses.component';
import { PageLayoutModule } from '../page-layout/page-layout.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';



@NgModule({
  declarations: [CoursesComponent],
  imports: [
    CommonModule,
    PageLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CoursesModule { }
