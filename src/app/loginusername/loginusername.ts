import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../providers/auth-service';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
import * as request from 'requestretry';
import jwt_decode from 'jwt-decode';
import { ValueGlobal,SearchHotel } from '../providers/book-service';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { FCM } from '@ionic-native/fcm/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: 'app-loginusername',
  templateUrl: 'loginusername.html',
  styleUrls: ['loginusername.scss'],
})

export class LoginusernamePage implements OnInit {
  public loginData: FormGroup;
  @ViewChild('user') input;checkreview;emailorphone='';password=''
  deviceToken: any;
  appversion: string;ischeck;refreshTokenTimer
  constructor(public keyboard: Keyboard, public platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, public formBuilder: FormBuilder, public authService: AuthService, public storage: Storage,
    private toastCtrl: ToastController, public zone: NgZone, public gf: GlobalFunction,public searchhotel: SearchHotel, private fcm: FCM,private appVersion: AppVersion) {
      this.loginData = this.formBuilder.group({
        emailorphone: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
        ischeck: ['', Validators.compose([Validators.required])],
      });
      this.storage.get('checkreview').then(checkreview => {
        this.checkreview=checkreview;
      })
      this.storage.get('emailrmb').then(emailrmb => {
        this.emailorphone=emailrmb;
      })
      this.storage.get('password').then(password => {
        if (password) {
          this.password=password;
          this.ischeck=true;
        }
      })

  }
  ngOnInit() {
   
  }
  next()
  {
    if (this.loginData.value.emailorphone) {
      var checkmail = this.validateEmail(this.loginData.value.emailorphone);
      if (checkmail) {
        if (this.loginData.value.password) {
          var test = this.loginData.value.password.length;
          if (test >= 6) {
            this.logintk();
          } else {
            this.presentToast("Mật khẩu phải ít nhất 6 ký tự");
          }
        }
        else
        {
          this.presentToast("Vui lòng nhập mật khẩu");
        }
      }
      else{
        if(this.phonenumber(this.loginData.value.emailorphone))
        {
          this.logintk();
        }
        else{
          this.presentToast("Định dạng email không đúng hoặc số điện thoại không chính xác");
        } 
      }
     
    } else {
      this.presentToast("Vui lòng nhập email hoặc số điện thoại");
    }
  }
  logintk() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/api/Account/Login',
      //url:'http://192.168.10.121:3400/api/Account/Login',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        'cache-control': 'no-cache',
        'content-type': 'application/json'
      },
      body:
      {
        emailOrPhone: this.loginData.value.emailorphone,
        password: this.loginData.value.password,
        rememberMe: true
      },
      json: true
    };

    request(options, function (error, response, body) {
      if (error) {
        error.page = "loginusername";
        error.func = "logintk";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error,response);
      };
      // var result=JSON.parse(body);
      if (body.auth_token) {
        var decoded = jwt_decode(body.auth_token);
        se.refreshTokenTimer=decoded.refreshTokenTimer;
        se.storage.set("savepassword", se.loginData.value.password);
        se.storage.set("saveemail", decoded.email);
        se.zone.run(() => {
          se.storage.set("email", decoded.email);
          se.storage.set("auth_token", body.auth_token);
          se.storage.set("username", decoded.fullname);
          se.storage.set("phone", decoded.phone);
          se.storage.remove('deviceToken');
          se.fcm.getToken().then(token => {
            se.deviceToken = token;
            se.storage.set('deviceToken',token);
          });
          se.valueGlobal.countNotifi=0;
          // var checkfullname=se.hasWhiteSpace(decoded.fullname);
          var checkfullname = se.validateEmail(decoded.fullname);
          var info;
          if (!checkfullname) {
            var textfullname=decoded.fullname.split(' ')
            //info = { ho: textfullname[0], ten: textfullname[1], phone: decoded.phone}
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
            info = { ho: "", ten: "", phone: decoded.phone}
            se.storage.set("infocus", info);
          }
          if (Array.isArray(decoded.jti)) {
            se.storage.set("jti", decoded.jti[0]);
          }
          else {
            se.storage.set("jti", decoded.jti);
          }
          if (!se.checkreview) {
            se.storage.set("checkreview", 0);
          }
          se.storage.set("point", decoded.point);
          if (se.loginData.value.ischeck) {
            se.storage.remove("password");
            se.storage.remove("emailrmb");
            se.storage.set("password", se.loginData.value.password);
            se.storage.set("emailrmb", se.loginData.value.emailorphone);
          }
          else
          {
            se.storage.remove("password");
            se.storage.remove("emailrmb");
          }
          //PDANH 19/07/2019: Push memberid & devicetoken
          if(se.deviceToken){
            se.gf.pushTokenAndMemberID(body.auth_token, se.deviceToken, se.appversion);
          }
          se.storage.remove('blogtripdefault');
          se.storage.remove('regionnamesuggest');
          se.storage.remove('listtopdealdefault');
          se.gf.setParams(true,'resetBlogTrips');
          se.searchhotel.rootPage ='login';
          se.countdownRefreshToken();
          if (se.valueGlobal.logingoback) {
            se.navCtrl.navigateBack([se.valueGlobal.logingoback]);
          }
          else{
            se.navCtrl.navigateRoot('/');
          }
        }, 10)

      }
      else {
        se.presentToast(body.msg);
      }
    });

    // this.authService.login(this.loginData.value)
    //   .then(() => this.redirectToHome())
    //   .catch(e => console.log("login error", e));;

    //google analytic
    this.gf.googleAnalytion('loginusername', 'login', '');
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  } 
  redirectToHome() {
    this.storage.get('id_token').then(id_token => {
      if (id_token !== null) {
        // this.storage.get('user').then(user => {
        //   this.id = user.id,
        //     this.user = user.username
        // });
        // this.toUser = {
        //   UserId: this.id,
        //   UserName: this.user,
        // }
        //this.navCtrl.push('QuestionContactPage');
      }
      else {
        this.presentToast("Email hoặc mật khẩu không đúng.");
      }
    });
  }
  async presentToast(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  ionViewWillEnter(){
    //Test notification
      this.platform.ready().then(() => {
        this.fcm.getToken().then(token => {
          console.log(token);
          this.deviceToken = token;
      });
    })
    //Lấy app version
    this.appVersion.getVersionNumber().then(version => {
      this.appversion=version;
    })
  }
  countdownRefreshToken() {
    var timer = parseInt(this.refreshTokenTimer);
    //var timer = 10;
    this.countdownTimer(timer);
  }
  countdownTimer(timer: number) {
    if (timer >= 0) {
      clearInterval(this.valueGlobal.interval);
      this.valueGlobal.interval = setInterval(() => {
        timer--;
        // console.log(timer);
        if (timer < 0) {
          clearInterval(this.valueGlobal.interval);
          // Reload lại Token để lấy User Info mới nhất
          this.reloadToken()
            // .subscribe(
            //   result => {
            //     //console.log("Reload user info thành công !");
            //     // Tạo 1 vòng lặp refresh liên tục khi get Token mới
            //     this.userService.getUserInfo();
            //     var timer = parseInt(this.userInfo.refreshTokenTimer);
            //     this.countdownTimer(timer);

            //   },
            //   error => { });
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
// getToken() {
//   this.storage.get('auth_token').then(auth_token => {
//     if (auth_token) {
//     }
//   })
//   }
  ionViewDidEnter() {
    setTimeout(() => {
      this.input.setFocus();
    }, 150);
    this.keyboard.show();
    //Xử lý nút back của dt
    //   this.platform.ready().then(() => {
    //     this.platform.registerBackButtonAction(() => {
    //       if(this.navCtrl.canGoBack()){
    //         this.view.dismiss();
    //       }else{
    //         this.platform.exitApp();
    //       }
    //     })
    // })
  }

  goback() {
    this.navCtrl.back();
  }

  resetpassword(){
    this.navCtrl.navigateForward('/forgotpass');
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
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
