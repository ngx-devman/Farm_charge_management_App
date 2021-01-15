import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {
  private serverUrl = environment.serverUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': this.serverUrl,
      Authorization: `Bearer ${localStorage.getItem('jwtsession')}`
    })
  };

  constructor(private http: HttpClient, private router: Router) {}

  public getCustomers() {
    const url = `${this.serverUrl}` + 'customers';
    return this.http.get(url, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public createCustomer(data) {
    const url = `${this.serverUrl}` + 'customers';
    return this.http.post(url, data, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public getCustomer(afm) {
    const url = `${this.serverUrl}` + 'customers/' + afm;
    return this.http.get(url, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public getCharges(afm) {
    const url = `${this.serverUrl}customers/${afm}/charges`;
      return this.http.get(url, this.httpOptions)
        .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public saveCharge(data) {
    const url = `${this.serverUrl}charges`;
    return this.http.post(url,data, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public editCustomer(afm, data) {
    const url = `${this.serverUrl}` + 'customers/' + afm;
    return this.http.put(url, data, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public getCustomerFiles(afm) {
    const url = `${this.serverUrl}customers/${afm}/files`;
    return this.http.get(url, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public getCustomerFileContent(afm, fileName) {
    const url = `${this.serverUrl}customers/${afm}/files/${fileName}`;
    const header = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtsession')}`,
      Accept: 'application/octet-stream'
    });
    return this.http.get(url, { headers: header, responseType: 'arraybuffer'});
  }

  uploadFile( afm, data: FormData) {
    const header = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtsession')}`,
    });

    return this.http.post(`${this.serverUrl}customers/${afm}/files`, data, {
      headers: header,
      reportProgress: true,
      observe: 'events'})
      .pipe(map((event) => {return event; })
    );
  }
}
