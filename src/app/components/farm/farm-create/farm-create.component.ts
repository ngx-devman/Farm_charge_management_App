import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Coordinate } from './../../../models/farm.model';
import { FarmService } from '../../../services/farm.service';

@Component({
  selector: 'app-farm-create',
  templateUrl: './farm-create.component.html',
  styleUrls: ['./farm-create.component.scss']
})

export class FarmCreateComponent implements OnInit {
  createForm: FormGroup;
  creating = false;
  constructor(
    private formBuilder: FormBuilder,
    private farmService: FarmService,
    private toastr: ToastrService) {}

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      area: ['', Validators.required],
      kaek: ['', Validators.required],
      coordinates: this.formBuilder.array([
        this.formBuilder.group({
          latitude: [0, Validators.required],
          longitude: [0, Validators.required]
        })
      ]),
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
  }

  onCreate() {
    if (!this.creating) {
      const formValues = this.createForm.value;
      this.creating = true;
      this.submitForm(0);
    }
  }
  
  submitForm(index) {
    if (index < 5) {
      this.farmService.createFarm(this.createForm.value).subscribe((res: any) => {
        this.creating = false;
        this.toastr.success('New farm has been created successfully.');
        return;
      },
        (err) => {
          this.toastr.error('Error while posting');
          this.submitForm(index + 1);
        }
      );
    } else {
      this.creating = false;
      this.toastr.error('Cannot create new farm.');
      return;
    }
  }
}

