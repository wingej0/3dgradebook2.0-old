import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardsComponent } from './standards/standards.component';
import { PageLayoutModule } from '../page-layout/page-layout.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CanvasStandardsComponent } from './canvas-standards/canvas-standards.component';



@NgModule({
  declarations: [StandardsComponent, CanvasStandardsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageLayoutModule,
    SharedModule,
  ]
})
export class StandardsModule { }
