import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeModule } from './home/home.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PageLayoutModule } from './page-layout/page-layout.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PageLayoutModule,
    HomeModule,
    DashboardModule
  ]
})
export class ModulesModule { }
