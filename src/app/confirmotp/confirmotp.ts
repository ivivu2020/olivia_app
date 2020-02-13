import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import * as request from 'requestretry';
import { C } from './../providers/constants';
@Component({
  selector: 'app-confirmotp',
  templateUrl: './confirmotp.html',
  styleUrls: ['./confirmotp.scss'],
})
export class ConfirmotpPage implements OnInit {
  @ViewChild('ipOTP1') ipOTP1;
  @ViewChild('ipOTP2') ipOTP2;
  @ViewChild('ipOTP3') ipOTP3;
  @ViewChild('ipOTP4') ipOTP4;
  @ViewChild('ipOTP5') ipOTP5;
  @ViewChild('ipOTP6') ipOTP6;
  num1 = ""; num2 = ""; num3 = ""; num4 = ""; num5 = ""; num6 = ""; phone; obj; strwarning
  constructor(public modalCtrl: ModalController, public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public value: ValueGlobal, public toastCtrl: ToastController) {
    this.phone = this.value.phone;
    this.obj = this.value.objchangeinfo;
  }

  ngOnInit() {
  }
  goback() {
    this.modalCtrl.dismiss();
  }
  ionViewDidEnter() {
    setTimeout(() => {
      this.ipOTP1.setFocus();
    }, 150);
    this.keyboard.show();
  }
  change1() {
    if (this.num1) {
      this.ipOTP2.setFocus();
      this.keyboard.show();
    }
  }
  change2() {
    if (this.num2) {
      this.ipOTP3.setFocus();
      this.keyboard.show();
    }
  }
  change3() {
    if (this.num3) {
      this.ipOTP4.setFocus();
      this.keyboard.show();
    }
  }
  change4() {
    if (this.num4) {
      this.ipOTP5.setFocus();
      this.keyboard.show();
    }
  }
  change5() {
    if (this.num5) {
      this.ipOTP6.setFocus();
      this.keyboard.show();
    }
  }
  confirm() {

    var se = this;
    if (this.num1 && this.num2 && this.num3 && this.num4 && this.num6) {
      se.obj.userInfo.otpPhone = this.num1 + this.num2 + this.num3 + this.num4 + this.num5 + this.num6;
      console.log(se.obj.userInfo.otpPhone);
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          var text = "Bearer " + auth_token;
          var options = {
            method: 'POST',
            url: C.urls.baseUrl.urlMobile + '/api/Dashboard/ChangeUserInfo',
            timeout: 10000, maxAttempts: 5, retryDelay: 2000,
            headers:
            {
              'cache-control': 'no-cache',
              'content-type': 'application/json-patch+json',
              authorization: text
            },
            body: JSON.stringify(se.obj)
          };
          request.timeout = 60000;
          request(options, function (error, response, body) {
            if (response.statusCode == 400) {
              var rs = JSON.parse(body);
              se.strwarning = rs.msg;
            }
            if (response.statusCode != 200) {
              var objError = {
                page: "userprofile",
                func: "saveChange",
                message: response.statusMessage,
                content: response.body,
                type: "warning",
                param: JSON.stringify(options)
              };
              C.writeErrorLog(objError,response);
            }
            if (error) {
              error.page = "userprofile";
              error.func = "saveChange";
              error.param = JSON.stringify(options);
              C.writeErrorLog(error,response);
            } else {
              var rs = JSON.parse(body);
              if (rs.result) {
                var info;
                var textfullname = se.value.name.split(' ')
                if (textfullname.length > 2) {
                  let name = '';
                  for (let i = 1; i < textfullname.length; i++) {
                    if (i == 1) {
                      name += textfullname[i];
                    } else {
                      name += ' ' + textfullname[i];
                    }
                  }
                  info = { ho: textfullname[0], ten: name, phone: se.value.phone }
                } else if (textfullname.length > 1) {
                  info = { ho: textfullname[0], ten: textfullname[1], phone: se.value.phone }
                }
                else if (textfullname.length == 1) {
                  info = { ho: textfullname[0], ten: "", phone: se.value.phone }
                }
                se.storage.remove('infocus');
                se.storage.remove('userInfoData');
                se.storage.set("infocus", info);
                se.presentToast("Cập nhật hồ sơ thành công.");
                //se.refreshToken();
                se.modalCtrl.dismiss();


              }
            }
          })
        }
      })
    }
    else {
      se.presentToast("XIn nhập đầy đủ mã OTP");
    }

  }
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          },
        }
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "userprofile",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "userprofile";
            error.func = "refreshToken";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            var au = JSON.parse(body);
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              se.storage.remove('username');
              se.storage.set('username', se.value.name);
            })
          }
        })
      }
    })
  }
  sendOTP() {
    var se=this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlMobile + '/api/Dashboard/OTPChangePhoneNumber',
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json-patch+json',
            authorization: text
          },
          body: JSON.stringify({ "phoneNumber": se.phone })
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "userprofile",
              func: "sentOTP",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "userprofile";
            error.func = "sentOTP";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            var rs = JSON.parse(body);
            // se.navCtrl.navigateForward(['/confirmotp']);
          }
        })
      }
    })
  }
}
