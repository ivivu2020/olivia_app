import { FCM } from '@ionic-native/fcm/ngx';
import { SearchHotel } from 'src/app/providers/book-service';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { GlobalFunction } from './../providers/globalfunction';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NavController, ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ValueGlobal } from '../providers/book-service';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import jwt_decode from 'jwt-decode';
@Component({
  selector: 'app-forgotpasschange',
  templateUrl: './forgotpasschange.page.html',
  styleUrls: ['./forgotpasschange.page.scss'],
})
export class ForgotpasschangePage implements OnInit {
  passwordIcon: string = 'eye-off';
  passwordType: string = 'password';
  pass; public deviceToken;refreshTokenTimer;appversion
  constructor(public zone: NgZone,private fcm: FCM, public gf: GlobalFunction, public storage: Storage,public searchhotel:SearchHotel, public navCtrl: NavController, public valueGlobal: ValueGlobal, private toastCtrl: ToastController) { }

  ngOnInit() {
  }
  saveChange() {
    var se = this;
    if (this.pass) {
      if (this.pass.length >= 6) {
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlMobile + '/api/account/SetForgotPassMobile',
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json'
          },
          body:
          {
            EmailOrPhone: this.valueGlobal.phone,
            Token: se.valueGlobal.token,
            Password: this.pass,
            Password2: this.pass,
            ResetToken: this.valueGlobal.resettoken,
            UserId: this.valueGlobal.userid
          },
          json: true
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          if (body.result) {
            if (body.auth_token) {
              var decoded = jwt_decode(body.auth_token);
              se.refreshTokenTimer=decoded.refreshTokenTimer;
              se.storage.set("email", decoded.email);
              se.storage.set("auth_token", body.auth_token);
              se.storage.set("username", decoded.fullname);
              se.storage.set("phone", decoded.phone);
              var checkfullname=se.hasWhiteSpace(decoded.fullname);
              se.storage.remove('deviceToken');
              se.fcm.getToken().then(token => {
                se.deviceToken = token;
                se.storage.set('deviceToken',token);
              });
              var info;
              if (checkfullname) {
                var textfullname=decoded.fullname.trim();
                textfullname=decoded.fullname.split(' ');
                if(textfullname.length >2){
                  let name = '';
                  for(let i = 1; i < textfullname.length; i++){
                    if(i == 1){
                      name += textfullname[i];
                    }else{
                      name +=' ' +textfullname[i];
                    }
                  }
                  info = { ho: textfullname[0], ten: name , phone: decoded.phone}
                }else if(textfullname.length>1){
                  info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone}
                }
                else if(textfullname.length==1){
                  info = { ho: textfullname[0], ten: "", phone: decoded.phone}
                }
                se.storage.set("infocus", info);
              } else {
                info = { ho: "", ten: "", phone: decoded.phone,fullname:""}
                se.storage.set("infocus", info);
              }
              if (Array.isArray(decoded.jti)) {
                se.storage.set("jti", decoded.jti[0]);
              }
              else {
                se.storage.set("jti", decoded.jti);
              }
              if(se.deviceToken){
                se.gf.pushTokenAndMemberID(body.auth_token, se.deviceToken, se.appversion);
              }
              se.storage.remove('blogtripdefault');
              se.storage.remove('regionnamesuggest');
              se.storage.remove('listtopdealdefault');
              
              se.valueGlobal.countNotifi = 0;
              se.gf.setParams(true,'resetBlogTrips');
              se.storage.set("point", decoded.point);
              se.searchhotel.rootPage ='login';
              se.countdownRefreshToken();
              if (se.valueGlobal.logingoback) {
                se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
              }
              else{
                se.navCtrl.navigateRoot('/');
              }
            }
          } else {
            alert(body.msg);
          }
        });
      } else {
        this.presentToastpass();
      }
    }
    else
    {
      alert("Mật khẩu không được để trống");
    }
  }
  countdownRefreshToken() {
    var timer = parseInt(this.refreshTokenTimer);
    this.countdownTimer(timer);
  }
  countdownTimer(timer: number) {
    if (timer >= 0) {
      this.valueGlobal.interval = setInterval(() => {
        //console.log(timer);
        timer--;

        if (timer < 0) {
          clearInterval(this.valueGlobal.interval);
          this.reloadToken()
        }
      }, 1000);

    }
  }
  reloadToken() {
    this.refreshToken(); 
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
              page: "roompaymentdoneean",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentdoneean";
            error.func = "refreshToken";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            var json=JSON.parse(body);
            if (json.auth_token) {
              se.storage.remove('auth_token');
              se.storage.set("auth_token", json.auth_token);
              se.countdownRefreshToken();
            }
          }
        })
      }
    })
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  } 
  async presentToastpass() {
    let toast = await this.toastCtrl.create({
      message: "Mật khẩu phải ít nhất 6 ký tự",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  goback() {
    this.navCtrl.back();
  }
  hideShowPassword() {
    this.zone.run(() => {
      this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
      this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
    })
  }
}
