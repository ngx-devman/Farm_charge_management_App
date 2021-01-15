import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { cities } from '../../../../cities';
import { cantons } from '../../../../cantons';

@Component({
  selector: 'app-customer-create',
  templateUrl: './customer-create.component.html',
  styleUrls: ['./customer-create.component.scss']
})
export class CustomerCreateComponent implements OnInit {
  createForm: FormGroup;
  creating = false;
  cityOptions = cities;
  cantonOptions = cantons;
  constructor(private formBuilder: FormBuilder, private customerService: CustomerService, private toastr: ToastrService){}
  
  ngOnInit() {
    this.createForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      fatherName: [''],
      wifeName: [''],
      wifeFatherSurname: [''],
      sex: [''],
      birthDate: ['', Validators.required],
      birthPlace: ['', Validators.required],
      identityNumber: ['', Validators.pattern(/^-?(0|[1-9]\d*)?$/)],
      afm: ['', [Validators.required, Validators.pattern(/^[0-9]{9,9}$/)]],
      doy: [''],
      email: ['', Validators.email],
      mobile: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      ibans: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      profession: [''],
      address: ['', Validators.required],
      postCode: ['', [Validators.required, Validators.pattern(/^\d*$/)]],
      city: ['', Validators.required],
      canton: ['', Validators.required]
    });
  }

  get f() { return this.createForm.controls; }

  onCreate() {
    if (this.createForm.invalid) {
      return;
    }
    if (!this.creating) {
      let formValues = this.createForm.value;
      let dob = new Date();
      let dob_m = dob.getMonth() < 10 ? '0' + (dob.getMonth() + 1) : dob.getMonth();
      let dob_d = dob.getDate() < 10 ? '0' + (dob.getDate() + 1) : dob.getDate();
      let formatedDate = dob.getFullYear() + '-' + dob_m + '-' + dob_d;
      this.creating = true;
      formValues.birthDate = formatedDate;
      formValues.ibans = [formValues.ibans];
      this.createFunc(formValues, 0);
    }
  }
  
  createFunc(data:any, index:number) {
    if (index < 5) {
      this.customerService.createCustomer(data).subscribe((res: any) => {
        this.creating = false;
        this.toastr.success('New customer has been saved successfully.');
        return;
      },
        (err) => {
          this.toastr.error('Error while posting');
          this.createFunc(data, index + 1);
        }
      );
    } else {
      this.creating = false;
      this.toastr.error('Cannot create new customer.');
      return;
    }
  }
}