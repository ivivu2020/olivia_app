import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GlobalFunction } from '../providers/globalfunction';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, MenuController,Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import * as request from 'requestretry';
import jwt_decode from 'jwt-decode';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { ValueGlobal } from './../providers/book-service';
@Component({
  selector: 'app-register',
  templateUrl: 'register.html',
  styleUrls: ['register.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('user') input;
  public regData: FormGroup; ischeck;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  appversion: string;
  deviceToken: any;

  constructor(public keyboard: Keyboard,
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public formBuilder: FormBuilder, private iab: InAppBrowser, public platform: Platform, private toastCtrl: ToastController, public storage: Storage, public gf: GlobalFunction, public zone: NgZone
    , private appVersion: AppVersion, public valueGlobal: ValueGlobal
    , private fcm: FCM) {

    this.regData = this.formBuilder.group({
      emailorphone: ['', Validators.required],
      password: ['', Validators.required],
      ischeck: ['', Validators.required],
    });
  }
  ngOnInit() {
  }
  hideShowPassword() {
    this.zone.run(() => {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    })
  }
  ionViewDidLoad() {
    //hide menu when on the login page, regardless of the screen resolution
    this.menuCtrl.enable(false);
  }

  register() {
    if (this.regData.value.emailorphone) {
      var checkmail = this.validateEmail(this.regData.value.emailorphone);
      if (checkmail) {
        if (this.regData.value.password) {
          var test = this.regData.value.password.length;
          if (test >= 6) {
            this.funcregister();
          } else {
            this.presentToast("Mật khẩu phải ít nhất 6 ký tự");
          }
        }
        else {
          this.presentToast("Vui lòng nhập mật khẩu");
        }
      }
      else {
        if (this.phonenumber(this.regData.value.emailorphone)) {
          var test = this.regData.value.password.length;
          if (test > 0) {
            if (test >= 6) {
              this.postapiRegisterByPhone();
            } else {
              this.presentToast("Mật khẩu phải ít nhất 6 ký tự");
            }
          }
          else {
            this.presentToast("Vui lòng nhập mật khẩu");
          }

        }
        else {
          this.presentToast("Định dạng email không đúng hoặc số điện thoại không chính xác");
        }
      }

    } else {
      this.presentToast("Vui lòng nhập email hoặc số điện thoại");
    }
  }
  postapiRegisterByPhone() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/api/Account/RegisterByPhone',
      //url: 'http://192.168.10.121:3400/api/Account/RegisterByPhone',
      headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body: { phoneNumber: this.regData.value.emailorphone, password: this.regData.value.password, password2: this.regData.value.password },
      json: true
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      if (body) {
        if (body.result) {
          se.valueGlobal.phone = se.regData.value.emailorphone
          se.navCtrl.navigateForward('registerverify')
        }
        else {
          alert(body.msg);
        }
      }
    });
  }
  // CheckPassword(inputtxt) {
  //   var passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
  //   if (inputtxt.match(passw)) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  funcregister() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/api/Account/Register',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body:
      {
        email: this.regData.value.emailorphone,
        password: this.regData.value.password,
        password2: this.regData.value.password
      },
      json: true
    };
    // console.log(JSON.stringify(options.body))
    request(options, function (error, response, body) {
      if (error) {
        error.page = "register";
        error.func = "funcregister";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error, response);
      };
      if (response.statusCode != 200) {
        var objError = {
          page: "register",
          func: "funcregister",
          message: response.statusMessage,
          content: response.body,
          type: "warning",
          param: JSON.stringify(options)
        };
        C.writeErrorLog(objError, response);
      }
      console.log(body.result)
      if (body.result) {
        alert(body.msg);
        se.logintk();
      }
      else {
        alert(body.msg);
      }

    });
  }
  logintk() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/api/Account/Login',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body:
      {
        emailOrPhone: this.regData.value.email,
        password: this.regData.value.password,
        rememberMe: true
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        error.page = "register";
        error.func = "logintk";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error, response);
      };
      // var result=JSON.parse(body);
      if (body.auth_token) {
        var decoded = jwt_decode(body.auth_token);
        // console.log(decoded);
        // se.storage.set("user", decoded.role);
        // se.storage.set("nameid", decoded.nameid);
        se.zone.run(() => {
          se.storage.set("email", decoded.email);
          se.storage.set("auth_token", body.auth_token);
          se.storage.set("username", decoded.fullname);
          if (Array.isArray(decoded.jti)) {
            se.storage.set("jti", decoded.jti[0]);
          }
          else {
            se.storage.set("jti", decoded.jti);
          }
          se.storage.set("point", decoded.point);
          //PDANH 19/07/2019: Push memberid & devicetoken
          if (se.deviceToken) {
            se.gf.pushTokenAndMemberID(body.auth_token, se.deviceToken, se.appversion);
          }
          se.navCtrl.navigateRoot('/');
        }, 10)
      }
    });
    //google analytic
    this.gf.googleAnalytion('loginusername', 'login', '');
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 150);
    this.keyboard.show();
  }

  goback() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    //Test notification
    this.platform.ready().then(() => {
      this.fcm.getToken().then(token => {
        console.log(token);
        this.deviceToken = token;
      });
    })
    //Lấy app version
    this.appVersion.getVersionNumber().then(version => {
      this.appversion = version;
    })
  }
  async presentToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  phonenumber(inputtxt) {
    var n = Number(inputtxt);
    if (n) {
      var test1 = inputtxt.length;
      if (inputtxt) {
        if (test1 == 10) {
          return true;
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }

}
