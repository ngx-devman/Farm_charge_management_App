import {Component,OnInit} from '@angular/core';
import {FormBuilder,FormGroup,Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {Router,ActivatedRoute} from '@angular/router';
import {cities} from '../../../../cities';
import {cantons} from '../../../../cantons';
import {CustomerService} from '../../../services/customer.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss']
})
export class CustomerEditComponent implements OnInit {
  afm: string;
  editForm: FormGroup;
  editing = false;
  cityOptions = cities;
  cantonOptions = cantons;
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute){}

  ngOnInit() {
    this.editForm = this.formBuilder.group({
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
    this.afm = this.route.snapshot.paramMap.get("afm");
    this.customerService.getCustomer(this.afm).subscribe((res: any) => {
      if (res.name) this.editForm.controls['name'].setValue(res.name);
      if (res.surname) this.editForm.controls['surname'].setValue(res.surname);
      if (res.fatherName) this.editForm.controls['fatherName'].setValue(res.fatherName);
      if (res.wifeName) this.editForm.controls['wifeName'].setValue(res.wifeName);
      if (res.wifeFatherSurname) this.editForm.controls['wifeFatherSurname'].setValue(res.wifeFatherSurname);
      if (res.sex) this.editForm.controls['sex'].setValue(res.sex);
      if (res.birthDate) this.editForm.controls['birthDate'].setValue(res.birthDate);
      if (res.birthPlace) this.editForm.controls['birthPlace'].setValue(res.birthPlace);
      if (res.afm) this.editForm.controls['afm'].setValue(res.afm);
      if (res.identityNumber) this.editForm.controls['identityNumber'].setValue(res.identityNumber);
      if (res.doy) this.editForm.controls['doy'].setValue(res.doy);
      if (res.email) this.editForm.controls['email'].setValue(res.email);
      if (res.mobile) this.editForm.controls['mobile'].setValue(res.mobile);
      if (res.ibans) this.editForm.controls['ibans'].setValue(res.ibans[0]);
      if (res.profession) this.editForm.controls['profession'].setValue(res.profession);
      if (res.address) this.editForm.controls['address'].setValue(res.address);
      if (res.city) this.editForm.controls['city'].setValue(res.city);
      if (res.postCode) this.editForm.controls['postCode'].setValue(res.postCode);
      if (res.canton) this.editForm.controls['canton'].setValue(res.canton);
    })
  }
  get f() { return this.editForm.controls;}

  onEdit() {
    if (this.editForm.invalid) {
      return;
    }
    if (!this.editing) {
      let formValues = this.editForm.value;
      let dob = new Date(formValues.birthDate);
      let dob_m = dob.getMonth() < 10 ? '0' + (dob.getMonth() + 1) : dob.getMonth();
      let dob_d = dob.getDate() < 10 ? '0' + (dob.getDate() + 1) : dob.getDate();
      let formatedDate = dob.getFullYear() + '-' + dob_m + '-' + dob_d;
      this.editing = true;
      formValues.birthDate = formatedDate;
      formValues.ibans = [formValues.ibans];
      this.editFunc(formValues,0);
    }
  }

  editFunc(data: any, index: number) {
    if (index < 5) {
      this.customerService.editCustomer(this.afm, data).subscribe((res: any) => {
        this.editing = false;
        this.toastr.success("New customer has been updated successfully.")
        return;
      },
        (err) => {
          this.toastr.error("Error while putting")
          this.editFunc(data, index + 1);
        }
      )
    } else {
      this.editing = false;
      this.toastr.error("Cannot edit this customer.")
      return;
    }
  }

  manageFiles() {
    this.router.navigate([`/pages/customer/${this.afm}/files`]);
  }

  Charges() {
    this.router.navigate([`/pages/customer/${this.afm}/charges`]);
  }
}