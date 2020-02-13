import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, AlertController, Platform, LoadingController, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
/**
 * Generated class for the CuspointsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-cuspoints',
  templateUrl: 'cuspoints.html',
  styleUrls: ['cuspoints.scss'],
})
export class CuspointsPage implements OnInit{
  point;actionHistory;  isShowConfirm = false;
  loader:any;
  constructor(public platform: Platform,public navCtrl: NavController, public storage: Storage,public loadingCtrl: LoadingController,private modalCtrl: ModalController,
    public alertCtrl: AlertController,public zone: NgZone,private gf: GlobalFunction, public valueGlobal: ValueGlobal) {

    //google analytic
    gf.googleAnalytion('cuspoints','load','');
  }

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "",
      duration: 1000
    });
    this.loader.present();
  }

  ngOnInit(){

  }
  goback(){
    //this.navCtrl.back();
    this.modalCtrl.dismiss();
  }

  ionViewWillEnter(){
    this.storage.get('point').then(point => {
      this.point = point;
    });
    this.presentLoading();
    this.getPoint();
  }

  getPoint() {
    var se=this;
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetActionHistory',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'content-type': 'application/json',
            authorization: text
          }
        };

        request(options, function (error, response, body) {
          if (error) {
            error.page= "cuspoints";
            error.func= "getPoint";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          }
          else{
            if(body){
              var item=JSON.parse(body);
              se.zone.run(()=>{
                se.actionHistory=item.actionHistory;
              })
              if(se.loader){
                se.loader.dismiss();
              }
            }else{
              if(response.statusCode == 400 || response.statusCode == 401){
                if(se.isShowConfirm) return;
                se.showConfirm("Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.");

              }else{
                se.actionHistory = [];
              }

            }
          }
          if(response.statusCode != 200){
            var objError ={
                page: "cuspoints",
                func: "getPoint",
                message : response.statusMessage,
                content : response.body,
                type: "warning",
                param: JSON.stringify(options)
              };
            C.writeErrorLog(objError,response);
          }
        
         // console.log(body);
        });
      }
    });
  }
  public async showConfirm(msg){
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: [
      {
        text: 'Để sau',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('point');
          this.zone.run(()=>{
            this.point = 0;
            this.valueGlobal.countNotifi = 0;
            })
          
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('listblogtripdefault');
         
          if(this.modalCtrl){
            this.modalCtrl.dismiss();
          }
          this.navCtrl.navigateRoot('/')
        }
      },
      {
        text: 'Đăng nhập',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('listblogtripdefault');
          this.zone.run(()=>{
            this.point = 0;
            this.valueGlobal.countNotifi = 0;
            })
          if(this.modalCtrl){
            this.modalCtrl.dismiss();
          }
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
  });
  alert.present();

  // alert.onDidDismiss().then((data)=>{
  //   this.storage.remove('auth_token');
  //   this.storage.remove('email');
  //   this.storage.remove('username');
  //   this.storage.remove('jti');
  //   this.storage.remove('userInfoData');
  //   this.storage.remove('userRewardData');
  //   this.storage.remove('point');
  //   this.point = 0;
  //   this.navCtrl.navigateBack('/');
  // })
  }
}
