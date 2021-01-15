import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';
import { CustomMaterialModule } from '../material.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    NgxFileDropModule,
  ],
  exports: [
    FormsModule,
    CustomMaterialModule,
    ReactiveFormsModule,
    NgxFileDropModule,
  ]
})
export class SharedModule {}
