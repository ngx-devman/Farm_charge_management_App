import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerViewChargeComponent } from './customer-view-charge.component';

describe('CustomerViewChargeComponent', () => {
  let component: CustomerViewChargeComponent;
  let fixture: ComponentFixture<CustomerViewChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerViewChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerViewChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
