import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClientJsonpModule, HttpClient } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomMaterialModule } from './material.module';
import { MatSelectModule } from '@angular/material/select';
import { CustomerService } from './services/customer.service';
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './components/extra-pages/pagenotfound/pagenotfound.component';
import { LoginComponent } from './components/extra-pages/login/login.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CustomMaterialModule,
    MatSelectModule,
    MatAutocompleteModule,
    RouterModule.forRoot([
      { path: '', component: LoginComponent},
      { path: 'login', component: LoginComponent},
      { path: 'pages', loadChildren: './components/pages.module#PagesModule' },
      {
        path: '**',
        component: PagenotfoundComponent
      },
    ],
      { useHash: true }
    ),
    ToastrModule.forRoot(),
  ],
  providers: [CustomerService],
  bootstrap: [AppComponent]
})
export class AppModule {}
