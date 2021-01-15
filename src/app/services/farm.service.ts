import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FarmService {
  private serverUrl = environment.serverUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': this.serverUrl,
       Authorization: `Bearer ${localStorage.getItem('jwtsession')}`
    })
  };

  constructor(private http: HttpClient, private router: Router) { }

  public getFarms() {
    const url = `${this.serverUrl}` + 'farms';
    return this.http.get(url, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public getFarmByID(kaek) {
    const url = `${this.serverUrl}farms/${kaek}`;
    return this.http.get(url, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }

  public updateFarm(kaek, data) {
    const url = `${this.serverUrl}farms/${kaek}`;
    return this.http.put(url, data, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }
  
  public getCharges(kaek) {
    const url = `${this.serverUrl}farms/${kaek}/charges`;
    return this.http.get(url,this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }
  
  public createFarm(data) {
    const url = `${this.serverUrl}farms`; 
    return this.http.post(url, data, this.httpOptions)
      .pipe ( tap((res: any) => { return res;},(err: any) => {return err;})
      );
  }
}
