import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router'
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'customer-view-charge',
  templateUrl: './customer-view-charge.component.html',
  styleUrls: ['./customer-view-charge.component.scss']
})

export class CustomerViewChargeComponent implements OnInit {
  afm: string;
  chargesFixed = [];
  chargesConsumption=[];
  loading = true;
  displayedColumns: string[] = ['no','kaek', 'chargeDate', 'amount'];
  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute){}

  ngOnInit() {
    this.afm = this.route.snapshot.paramMap.get('afm');
    this.chargesFixed = [];
    this.chargesConsumption = [];
    this.getCharges(0);
  }

  getCharges(index) {
    this.customerService.getCharges(this.afm).subscribe((res: any) => {
      var charges = res.charges;
      for(let i= 0;i < charges.length;i++){
        if(charges[i].chargeType == 'fixed'){
          this.chargesFixed.push(charges[i]);
        }else{
          this.chargesConsumption.push(charges[i]);
        }
      }
     this.loading = false;
    });

    if (index < 5) {
      this.customerService.getCharges(this.afm).subscribe((res: any) => {
        var charges=res.charges;
        for(let i=0;i<charges.length;i++){
          if(charges[i].chargeType=='fixed'){
            this.chargesFixed.push(charges[i]);
          }else{
            this.chargesConsumption.push(charges[i]);
          }
        }
        return;
      },
        (err) => {
          if (err.error.code === 401 && err.error.message === 'Invalid JWT') {
            this.router.navigate(['/', 'login']);
          } else {
            this.getCharges(index + 1);
          }

        }
      );
    } else {
      this.loading = false;
      return;
    }
  }

  addCharge(chargeType) {
    this.router.navigate([`/pages/customer/${this.afm}/addcharge/${chargeType}`]);
  }
}



