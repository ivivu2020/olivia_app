import { Component,NgZone ,OnInit} from '@angular/core';
import { Platform, NavController, AlertController,  ToastController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';

@Component({
  selector: 'app-userreward',
  templateUrl: 'userreward.html',
  styleUrls: ['userreward.scss'],
})

export class UserRewardPage implements OnInit{
    userRewardData:any;
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public intervalID;
    
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction){
        let self = this;
        //load userinfo
        
        self.loadUserInfo();
        self.fetuserRewardData();
       
        //Load userreward
        self.storage.get('userRewardData').then((data:any)=>{
            if(data){
                self.userRewardData = data;
            }else{
                self.fetuserRewardData();
            }
        })

        gf.googleAnalytion('userreward','load','');
    }

    ngOnInit(){

    }

    ionViewDidEnter(){
        this.GetUserInfo();
        // var se = this;
        // se.intervalID = setInterval(()=>{
        //     se.refreshToken();
        // },20000);

    }
GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roomdetailreview",
              func: "GetUserInfo",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roomdetailreview";
            error.func = "GetUserInfo";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            if (body) {
                se.zone.run(()=>{
                    se.loadUserInfo();
                })
            }

          }
        });
      }
    })
  }
    ionViewWillLeave(){
        this.zone.run(()=>{
            clearInterval(this.intervalID);
        })
    }

    loadUserInfo(){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                var options = {
                method: 'GET',
                url: C.urls.baseUrl.urlMobile +'/api/Dashboard/GetUserInfo',
                timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }
                };
                request(options, function (error, response, body) {
                    if(response.statusCode != 200){
                        var objError ={
                            page: "userreward",
                            func: "loadUserInfo",
                            message : response.statusMessage,
                            content : response.body,
                            type: "warning",
                            param:  JSON.stringify(options)
                          };
                        C.writeErrorLog(objError,response);
                      }
                if (error) {
                    error.page = "userreward";
                    error.func = "loadUserInfo";
                    error.param =  JSON.stringify(options);
                    C.writeErrorLog(error,response);
                    throw new Error(error)
                }else{
                    if(body){
                        var data = JSON.parse(body);
                        se.zone.run(()=>{
                            se.userInfoData = data;
                        });
                        //se.storage.set('userInfoData', data);
                    }else{
                        if(se.isShowConfirm) return;
                        se.showConfirm();
                        se.isShowConfirm = true;
                    }
                    
                }
                
                });
            }
        })
    }

    fetuserRewardData(){
          var se = this;
            se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                var options = {
                method: 'GET',
                url: C.urls.baseUrl.urlMobile +'/api/Dashboard/GetRewardItems',
                timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json',
                    authorization: text
                }
                };
                request(options, function (error, response, body) {
                    if(response.statusCode != 200){
                        var objError ={
                            page: "userreward",
                            func: "fetuserRewardData",
                            message : response.statusMessage,
                            content : response.body,
                            type: "warning",
                            param:  JSON.stringify(options)
                          };
                        C.writeErrorLog(objError,response);
                      }
                if (error) {
                    error.page = "userreward";
                    error.func = "fetuserRewardData";
                    error.param =  JSON.stringify(options);
                    C.writeErrorLog(error,response);
                    throw new Error(error)
                }else{
                    if(body){
                        var data = JSON.parse(body);
                        se.zone.run(()=>{
                            se.userRewardData = data;
                        })
                        se.storage.set('userRewardData', data);
                    }else{
                        if(se.isShowConfirm) return;
                        se.showConfirm();
                        se.isShowConfirm = true;
                    }
                    
                }
                
                });
            }
            });
    }

    goback(){
        var self = this;
        self.navCtrl.back();
    }

    public async showConfirm(){
        let alert = await this.alertCtrl.create({
          message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
          buttons: [{
            text: 'Đăng nhập',
            role: 'OK',
            handler: () => {
              this.storage.remove('auth_token');
              this.storage.remove('email');
              this.storage.remove('username');
              this.storage.remove('jti');
              this.storage.remove('userInfoData');
              this.storage.remove('userRewardData');
              //this.valueGlobal.logingoback = "MainPage";
              this.navCtrl.navigateForward('/login');
            }
          },
          {
            text: 'Để sau',
            handler: () => {
              this.storage.remove('auth_token');
              this.storage.remove('email');
              this.storage.remove('username');
              this.storage.remove('jti');
              this.storage.remove('userInfoData');
              this.storage.remove('userRewardData');
              this.navCtrl.back();
            }
          }
        ]
      });
      alert.present();
    }

    exchangeGift(item){
        var se = this;
        if(se.userInfoData){
            if(se.userInfoData.point >= item.unitPoint){
                // let modal = se.modalCtrl.create("ExchangeGiftPage", {record: item,userinfo: se.userInfoData});
                // modal.present();
                this.gf.setParams({record: item,userinfo: se.userInfoData}, 'exchangegift');
                this.navCtrl.navigateBack('/exchangegift');
            }else{
                se.presentToast('Rất tiếc, quý khách chưa đủ điểm để đổi quà tặng này!');
            }
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

      refreshToken(){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
            var text = "Bearer " + auth_token;
                    var options = {
                    method: 'GET',
                    url: C.urls.baseUrl.urlMobile +'/api/Account/reloadTokenClaims',
                    headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json-patch+json',
                        authorization: text
                    },
                }
                request(options, function (error, response, body) {
                    if(response.statusCode != 200){
                        var objError ={
                            page: "userprofile",
                            func: "refreshToken",
                            message : response.statusMessage,
                            content : response.body,
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
                    }else{
                        var au = JSON.parse(body);
                        se.zone.run(()=>{
                            se.storage.remove('auth_token');
                            se.storage.set('auth_token', au.auth_token);
                            se.loadUserInfo();
                        })
                    }
                    })
            }
        })
    }
}