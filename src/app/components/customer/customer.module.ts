import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { MatSelectModule } from '@angular/material/select';
import { CustomerCreateComponent } from './customer-create/customer-create.component';
import { CustomerEditComponent } from './customer-edit/customer-edit.component';
import { CustomerViewChargeComponent } from './customer-view-charge/customer-view-charge.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerFilesComponent } from './customer-files/customer-files.component';
import { FileUploadComponent } from '../extra-pages/file-upload/file-upload.component';
import { AddChargeComponent } from "./add-charge/add-charge.component";
import {MatAutocompleteModule} from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    CustomerCreateComponent,
    CustomerEditComponent,
    CustomerViewComponent,
    CustomerFilesComponent,
    FileUploadComponent,
    CustomerViewChargeComponent,
    AddChargeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MatSelectModule,
    FormsModule,
    MatAutocompleteModule,
    RouterModule.forChild([
      {
        path: '',
        component: CustomerViewComponent
      },
      {
        path: 'customers',
        component: CustomerViewComponent
      },
      {
        path: 'create',
        component: CustomerCreateComponent
      },
      {
        path: 'edit/:afm',
        component: CustomerEditComponent
      },
      {
        path:':afm/charges',
        component: CustomerViewChargeComponent
      },
      {
        path:':afm/addcharge/:chargeType',
        component: AddChargeComponent
      },
      {
        path: ':afm/files',
        component: CustomerFilesComponent
      },
      {
        path: 'upload',
        component: FileUploadComponent
      }
    ])
  ],
  entryComponents: [FileUploadComponent]
})
export class CustomerModule {}
