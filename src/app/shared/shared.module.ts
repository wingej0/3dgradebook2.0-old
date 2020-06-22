import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemFilterPipe } from './pipes/item-filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ItemFilterPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ItemFilterPipe
  ]
})
export class SharedModule { }
