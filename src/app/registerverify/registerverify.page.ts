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
import { FCM } from '@ionic-native/fcm/ngx';
import jwt_decode from 'jwt-decode';

@Component({
  selector: 'app-registerverify',
  templateUrl: './registerverify.page.html',
  styleUrls: ['./registerverify.page.scss'],
})
export class RegisterverifyPage implements OnInit {

  @ViewChild('ipOTP1') ipOTP1;
  @ViewChild('ipOTP2') ipOTP2;
  @ViewChild('ipOTP3') ipOTP3;
  @ViewChild('ipOTP4') ipOTP4;
  @ViewChild('ipOTP5') ipOTP5;
  @ViewChild('ipOTP6') ipOTP6;
  checkreview;
  num1 = ""; num2 = ""; num3 = ""; num4 = ""; num5 = ""; num6 = ""; phone; obj; strwarning; public deviceToken;refreshTokenTimer;appversion
  constructor(public modalCtrl: ModalController,public appVersion:AppVersion,public searchhotel: SearchHotel,private fcm: FCM, public zone: NgZone, public navCtrl: NavController, public keyboard: Keyboard, public storage: Storage, public valueGlobal: ValueGlobal, public toastCtrl: ToastController, public gf: GlobalFunction) {
    this.phone = this.valueGlobal.phone;
    this.storage.get('checkreview').then(checkreview => {
      this.checkreview=checkreview;
    })
      //Lấy app version
    this.appVersion.getVersionNumber().then(version => {
      this.appversion=version;
    })
  }

  ngOnInit() {
  }
  goback() {
    this.navCtrl.back();
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
      se.obj = this.num1 + this.num2 + this.num3 + this.num4 + this.num5 + this.num6;
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile +'/api/account/OTPRegisterSMS',
        //url: 'http://192.168.10.121:3400/api/account/OTPRegisterSMS',
        headers:
        {
          'postman-token': 'aac9e726-944b-2180-2416-63d2b1031a7a',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        body: { PhoneNumber: this.phone, Token: se.obj },
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
            if (!se.checkreview) {
              se.storage.set("checkreview", 0);
            }
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
    }
    else {
      se.presentToast("Xin nhập đầy đủ mã OTP");
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
  async presentToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
  
  sendOTP() {
    var se = this;
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile + '/api/account/OTPLoginSMS',
        headers:
        {
          'postman-token': '0b9f3a80-3e35-1af7-058f-597d733e7cee',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        body: { PhoneNumber: this.phone },
        json: true
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if (!body.result) {
          alert(body.msg);
        }
      });
    }

}
