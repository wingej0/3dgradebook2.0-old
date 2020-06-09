import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemFilterPipe } from './pipes/item-filter.pipe';



@NgModule({
  declarations: [ItemFilterPipe],
  imports: [
    CommonModule
  ],
  exports: [
    ItemFilterPipe
  ]
})
export class SharedModule { }
