import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { FarmCreateComponent } from './farm-create/farm-create.component';
import { FarmEditComponent } from './farm-edit/farm-edit.component';
import { FarmViewComponent } from './farm-view/farm-view.component';
import { FarmChargeComponent } from './farm-charge/farm-charge.component';

@NgModule({
  declarations: [FarmCreateComponent, FarmEditComponent, FarmViewComponent, FarmChargeComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: FarmViewComponent
      },
      {
        path: 'farms',
        component: FarmViewComponent
      },
      {
        path: 'create',
        component: FarmCreateComponent
      },
      {
        path: 'edit/:kaek',
        component: FarmEditComponent
      },
      {
        path:':kaek/charges',
        component: FarmChargeComponent
      }

    ])
  ]
})
export class FarmModule {}
