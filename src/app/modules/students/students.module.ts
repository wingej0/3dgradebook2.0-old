import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentsComponent } from './students/students.component';
import { PageLayoutModule } from '../page-layout/page-layout.module';



@NgModule({
  declarations: [StudentsComponent],
  imports: [
    CommonModule,
    PageLayoutModule
  ]
})
export class StudentsModule { }
