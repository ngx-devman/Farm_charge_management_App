import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../../services/customer.service';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.scss']
})
export class CustomerViewComponent implements OnInit {
  customers = [];
  loading = false;
  displayedColumns: string[] = ['no', 'afm', 'name', 'surname', 'fatherName', 'birthDate', 'edit'];
  constructor(private customerService: CustomerService, private router: Router) { }

  ngOnInit() {
    // this.customers = [];
    // this.getCustomers(0);
  }

  getCustomers(index) {
    if (localStorage.getItem('jwtsession') === '') {
      this.router.navigate(['/', 'login']);
      return;
    }
    this.customerService.getCustomers().subscribe((res: any) => {
      this.customers = res.customers;
      this.loading = false;
    });
    if (index < 5) {
      this.customerService.getCustomers().subscribe((res: any) => {
        this.customers = res.customers;
        this.loading = false;
        return;
      },
        (err) => {
          if (err.error.code === 401 && err.error.message === 'Invalid JWT') {
            this.router.navigate(['/', 'login']);
          } else {
            this.getCustomers(index + 1);
          }

        }
      );
    } else {
      this.loading = false;
      return;
    }
  }

  edit(afm) {
    this.router.navigate(['/pages/customer/edit/' + afm]);
  }
}
