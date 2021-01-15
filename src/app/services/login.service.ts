import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: "root"
})

export class LoginService {
  loggedInUser: any;
  private serverUrl = environment.serverUrl;
  constructor(private http: HttpClient) {}

  validateLogin(details: any) {
    let auth = details.username + ':' + details.password
    console.log(auth);
   
    let headers = new HttpHeaders();
    console.log(headers);
    headers = headers.append("Authorization", "Basic " + btoa(auth));
    headers = headers.append("Content-Type", "application/x-www-form-urlencoded");

    return this.http.get(this.serverUrl + 'login', {headers: headers});
  }
}