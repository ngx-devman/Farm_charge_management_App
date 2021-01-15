import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';
import { FarmService } from '../../../services/farm.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

export interface User {
  name: string;
}

@Component({
  selector: 'add-charge',
  templateUrl: './add-charge.component.html',
  styleUrls: ['./add-charge.component.scss']
})

export class AddChargeComponent implements OnInit {
  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  saveForm: FormGroup;
  saving = false;
  afm: string;
  farms: string;
  chargeType: string;
  loading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private customerService: CustomerService,
    private farmService: FarmService,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
      this.getFarms(0);
    }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    this.saveForm = this.formBuilder.group({
      chargeDate: ['', Validators.required],
      amount: ['', Validators.required],
    });
    
    this.afm = this.route.snapshot.paramMap.get('afm');
    this.chargeType = this.route.snapshot.paramMap.get('chargeType');
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  get f() { return this.saveForm.controls;}

  onSave() {
    if (this.saveForm.invalid) {
      return;
    }
    
    if (!this.saving) {
      const formValues = this.saveForm.value;
      formValues.afm = this.afm;
      formValues.chargeType = this.chargeType;
      formValues.kaek=this.myControl.value;
      this.saveFunc(formValues, 0);
    }
  }
  
  saveFunc(data: any, index: number) {
    if (index < 5) {
      this.customerService.saveCharge(this.saveForm.value).subscribe((res: any) => {
        this.saving = false;
        this.toastr.success("New Charge  has been saved successfully.")
        this.router.navigate([`/pages/customer/${this.afm}/charges`]);
        return;
      },
        (err) => {
          this.toastr.error("Error while saving!")
          this.saveFunc(data, index + 1);
        }
      )
    } else {
      this.saving = false;
      this.toastr.error("Cannot save this charge.")
      return;
    }
  }

  getFarms(index){
    if (localStorage.getItem('jwtsession') === '') {
      this.router.navigate(['/', 'login']);
      return;
    }
    this.farmService.getFarms().subscribe((res: any) => {
      this.farms = res.farms;
      for(let i=0;i< this.farms.length;i++){
        this.options.push(this.farms[i]['kaek']);
      }
      this.loading = false;
    });
    if (index < 5) {
      this.farmService.getFarms().subscribe((res: any) => {
        this.farms = res.farms;
        this.loading = false;
        return;
      },
        (err) => {
          if (err.error.code === 401 && err.error.message === 'Invalid JWT') {
            this.router.navigate(['/', 'login']);
          } else {
            this.getFarms(index + 1);
          }
        }
      );
    } else {
      this.loading = false;
      return;
    }
  }
}