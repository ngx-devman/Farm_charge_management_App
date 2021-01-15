import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import {FarmService} from '../../../services/farm.service'

@Component({
  selector: 'app-farm-charge',
  templateUrl: './farm-charge.component.html',
  styleUrls: ['./farm-charge.component.scss']
})

export class FarmChargeComponent implements OnInit {
  afm: string;
  kaek: string;
  chargesFixed = [];
  chargesConsumption = [];
  loading = true;
  displayedColumns: string[] = ['no','kaek', 'chargeDate', 'amount'];
  constructor(
    private farmService: FarmService,
    private router: Router,
    private route: ActivatedRoute){}

  ngOnInit() {
    this.kaek = this.route.snapshot.paramMap.get('kaek');
    this.chargesFixed = [];
    this.chargesConsumption = [];
    this.getCharges(0);
  }

  getCharges(index) {
    this.farmService.getCharges(this.kaek).subscribe((res: any) => {
      var charges=res.charges;
      for(let i=0;i<charges.length;i++){
        if(charges[i].chargeType=='fixed'){
          this.chargesFixed.push(charges[i]);
        }else{
          this.chargesConsumption.push(charges[i]);
        }
      }
     this.loading = false;
    });
    if (index < 5) {
      this.farmService.getCharges(this.kaek).subscribe((res: any) => {
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
}
