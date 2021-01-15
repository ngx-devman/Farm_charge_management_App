import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmChargeComponent } from './farm-charge.component';

describe('FarmChargeComponent', () => {
  let component: FarmChargeComponent;
  let fixture: ComponentFixture<FarmChargeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FarmChargeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FarmChargeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
