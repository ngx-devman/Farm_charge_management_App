import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { FarmElement, Coordinate } from './../../../models/farm.model';
import { FarmService } from '../../../services/farm.service';

@Component({
  selector: 'app-farm-edit',
  templateUrl: './farm-edit.component.html',
  styleUrls: ['./farm-edit.component.scss']
})

export class FarmEditComponent implements OnInit {
  createForm: FormGroup;
  creating = false;
  kaek: string;
  afm: string;
  dataSource: FarmElement;
  constructor(
    private formBuilder: FormBuilder,
    private farmService: FarmService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      area: ['', Validators.required],
      kaek: ['', Validators.required],
      coordinates: new FormArray([]),
    });
    this.kaek = this.route.snapshot.paramMap.get('kaek');
    this.getFarmByID();
  }

  getFarmByID() {
    this.farmService.getFarmByID(this.kaek).subscribe((res: any) => {
      this.dataSource = res as FarmElement;
      this.createForm.controls.area.setValue(res.area);
      this.createForm.controls.kaek.setValue(res.kaek);
      if (res.coordinates.length > 0) {
        const coordFGs = res.coordinates.map( coord => {
          return this.formBuilder.group({
            latitude: [coord.latitude, [Validators.required]],
            longitude: [coord.longitude]
          });
        });
        const coordFormArray: FormArray = this.formBuilder.array(coordFGs);
        this.createForm.setControl('coordinates', coordFormArray);
      }
    },
    (err) => {
      if (err.status === 401) {
        this.router.navigate(['/', 'login']);
      }
      this.toastr.error('Error while getting farm.');
    });
  }
  get f() { return this.createForm.controls; }

  get checkCoordinates() {
    const coords: Array<Coordinate> = this.createForm.value.coordinates;
    const length = coords.length;
    if (length === 0) { return true; }

    for (let i = 0; i < length; i++) {
      const coord = coords[i];
      if (coord.latitude === 0 || coord.longitude === 0) {
        return true;
      }

      for (let j = i + 1; j < length; j++) {
        if (
          coords[i].longitude === coords[j].longitude &&
          coords[i].latitude === coords[j].latitude
        ) {
          return true;
        }
      }
    }
    return false;
  }

  get coordArray() { return this.createForm.get('coordinates') as FormArray; }
  addNewCoordinate() {
    const control = this.createForm.controls.coordinates as FormArray;
    control.push(
      this.formBuilder.group({
        latitude: [0, [Validators.required]],
        longitude: [0, [Validators.required]],
      })
    );
  }

  deleteCoordinate(index) {
    const control = this.createForm.controls.coordinates as FormArray;
    control.removeAt(index);
    if (this.dataSource.coordinates[index] !== undefined) {
      this.dataSource.coordinates.splice(index, 1);
    }
  }

  onSave() {
    if (!this.creating) {
      const formValues = this.createForm.value;
      this.creating = true;
      this.submitForm(0);
    }
  }

  farmChargeView() {
    this.router.navigate([`/pages/farm/${this.kaek}/charges`]);

  }
  
  submitForm(index) {
    if (index < 5) {
      this.farmService.updateFarm(this.kaek, this.createForm.value).subscribe((res: any) => {
        this.creating = false;
        this.toastr.success('Farm has been updated successfully.');
        this.getFarmByID();
        return;
      },
        (err) => {
          if (err.status === 401) {
            this.router.navigate(['/', 'login']);
          }
          this.toastr.error('Error while posting');
          this.submitForm(index + 1);
        }
      );
    } else {
      this.creating = false;
      this.toastr.error('Cannot update farm.');
      return;
    }
  }
}
