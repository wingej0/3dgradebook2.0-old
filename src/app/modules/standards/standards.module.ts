import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardsComponent } from './standards/standards.component';
import { PageLayoutModule } from '../page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [StandardsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageLayoutModule
  ]
})
export class StandardsModule { }
