import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
// tslint:disable-next-line:max-line-length
import { MatButtonModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatToolbarModule, MatInputModule, MatDatepickerModule, MatProgressSpinnerModule, MatTableModule, MatCardModule, MatGridListModule, MatSnackBarModule } from '@angular/material';
@NgModule({
    imports: [CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatInputModule, MatDatepickerModule, MatProgressSpinnerModule, MatTableModule, MatCardModule,MatGridListModule, MatSnackBarModule],
    exports: [CommonModule, MatButtonModule, MatToolbarModule, MatNativeDateModule, MatIconModule, MatSidenavModule, MatListModule, MatInputModule, MatDatepickerModule, MatProgressSpinnerModule, MatTableModule, MatCardModule, MatGridListModule, MatSnackBarModule],
})
export class CustomMaterialModule {}
