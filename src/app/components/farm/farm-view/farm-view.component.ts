import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FarmService } from './../../../services/farm.service';

@Component({
  selector: 'app-farm-view',
  templateUrl: './farm-view.component.html',
  styleUrls: ['./farm-view.component.scss']
})
export class FarmViewComponent implements OnInit {

  farms: [];
  loading = true;
  displayedColumns: string[] = ['no', 'area', 'coordinates', 'kaek', 'action'];
  constructor(
    private router: Router,
    private farmService: FarmService,
  ) { }

  ngOnInit() {
    this.farms = [];
    this.getFarms(0);
  }

  getFarms(index) {
    if (localStorage.getItem('jwtsession') === '') {
      this.router.navigate(['/', 'login']);
      return;
    }

    this.farmService.getFarms().subscribe((res: any) => {
      this.farms = res.farms;
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

  edit(kaek) {
    this.router.navigate(['/pages/farm/edit/' + kaek]);
  }
}

