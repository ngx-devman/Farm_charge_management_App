import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../shared/shared.module';
import { CustomerModule } from './customer/customer.module';
import { FarmModule } from './farm/farm.module';
import { PagesComponent } from './pages.component';

@NgModule({
  declarations: [
    PagesComponent
  ],
  imports: [
    CommonModule,
    CustomerModule,
    FarmModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'customer' },
      { path: 'customer', component: PagesComponent, loadChildren: './customer/customer.module#CustomerModule' },
      { path: 'farm', component: PagesComponent, loadChildren: './farm/farm.module#FarmModule' },
    ]
    ),
  ]
})
export class PagesModule {}
