import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { LoginService } from "src/app/services/login.service";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  isLogin: boolean = true;
  message: string = "";
  showMessage: boolean = false;
  loginForm: FormGroup;
  alertType: string;
  loading: boolean = false;
  index: any = 0;

  constructor(
    public service: LoginService,
    public router: Router,
    public fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.createForm();
  }

  ngOnInit() {}

  createForm() {
    this.loginForm = this.fb.group({
      username: ['user1', [Validators.required]],
      password: ['pass1', [Validators.required]]
    });
  }

  validateData() {
    if (this.loginForm.get('username').value.trim().length == 0) {
      this.toastr.error('Please enter User Name');
      return false;
    }
    if (this.loginForm.get('password').value.trim().length == 0) {
      this.toastr.error('Please enter Password');
      return false;
    }
    return true;
  }

  login() {
    if (!this.validateData()) {
      return false;
    }
    this.loading = true;
    if (this.index < 5) {
      let loginvalue = this.loginForm.value;
      console.log(loginvalue);
      this.router.navigate(['/pages/customer']);

      // this.service.validateLogin(this.loginForm.value).subscribe(
      //   (data: any) => {
      //     console.log(data);
      //     // localStorage.setItem('jwtsession', data.jwt);
      //     // this.loading = false;
      //   },
      //   error => {
      //     if (error.error.code == 401) {
      //       this.loading = false;
      //       // this.setMessage(error["error"]["message"], "danger");
      //       this.toastr.error(error['error']['message']);
      //       this.loginForm.reset();
      //     } else {
      //       this.index += 1;
      //       this.login();
      //     }
      //   }
      // );
    }
  }
}
