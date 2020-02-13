import { Component,ViewChild,NgZone, OnInit } from '@angular/core';
import { Platform,NavController, AlertController,  ToastController, ModalController, IonSlides } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { ValueGlobal } from '../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';

@Component({
  selector: 'app-userreviews',
  templateUrl: 'userreviews.html',
  styleUrls: ['userreviews.scss'],
})

export class UserReviewsPage implements OnInit{
    userInfoData:any;
    CityName: string;
    CountryCode: string;
    public isShowConfirm = false;
    public arrHotelReviews = [];
    public numHotelReviews = 3;
    public intervalID;
    public coutslide = 0;
    public loaddatadone = false;
    @ViewChild('mySlider') slider: IonSlides;
    constructor(public platform: Platform,public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController,public modalCtrl: ModalController,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction){
        this.loadUserReviews()
      //google analytic
      gf.googleAnalytion('userreviews','load','');
    }

    ngOnInit(){

    }
    loadUserReviews(){
        var se = this;
            se.storage.get('auth_token').then(auth_token => {
                if (auth_token) {
                    var text = "Bearer " + auth_token;
                    var options = {
                    method: 'GET',
                    url: C.urls.baseUrl.urlMobile +'/api/Dashboard/GetUserReviews',
                    timeout: 10000, maxAttempts: 5, retryDelay: 2000,
                    headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json',
                        authorization: text
                    },
                    //body: JSON.stringify({file: this.photos})
                    };
                    request(options, function (error, response, body) {
                        se.loaddatadone = true;
                        if(response.statusCode != 200){
                            var objError ={
                                page: "userreviews",
                                func: "loadUserReviews",
                                message : response.statusMessage,
                                content : response.body,
                                type: "warning",
                                param:  JSON.stringify(options)
                              };
                            C.writeErrorLog(objError,response);
                        }
                        if (error) {
                            error.page = "userreviews";
                            error.func = "loadUserReviews";
                            error.param =  JSON.stringify(options);
                            C.writeErrorLog(error,response);
                        }else{
                            if(body){
                                var result = JSON.parse(body);
                                se.arrHotelReviews = [];
                                
                                if(result.data && result.data.length >0){
                                    se.zone.run(()=>{
                                        result.data.forEach(element => {
                                          if(element.images && element.images.length >0){
                                            element.images.forEach(img => {
                                                img.thumpUrl = img.thumpUrl.replace("84x84","150x150");
                                            });
                                          }
                                            se.arrHotelReviews.push(element);
                                        });
                                    })
                                }
                            }else if(response.statusCode == 401){
                                se.showConfirm();
                            }
                        }
                    })
                }
            }) 
    }

    public async showConfirm(){
        let alert = await this.alertCtrl.create({
          message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
          buttons: [
          {
            text: 'Để sau',
            handler: () => {
              this.storage.remove('auth_token');
              this.storage.remove('email');
              this.storage.remove('username');
              this.storage.remove('jti');
              this.storage.remove('userInfoData');
              this.storage.remove('userRewardData');
              this.storage.remove('point');
              this.navCtrl.back();
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
              //this.valueGlobal.logingoback = "MainPage";
              this.storage.remove('point');
              this.navCtrl.navigateForward('/login');
            }
          }
        ]
      });
      alert.present();

      alert.onDidDismiss().then((data)=>{
        this.storage.remove('auth_token');
        this.storage.remove('email');
        this.storage.remove('username');
        this.storage.remove('jti');
        this.storage.remove('userInfoData');
        this.storage.remove('userRewardData');
        this.storage.remove('point');
        this.navCtrl.navigateBack('/');
      })
    }

    goback(){
        var self = this;
        this.navCtrl.back();
    }

    async presentToast(msg) {
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 2000,
          position: 'top',
        });
        toast.present();
      }

    /***
     * Next trên slide
     */
    slideChange() {
        this.slider.getActiveIndex().then((currentIndex)=>{
            this.coutslide = currentIndex + 1;
        });
        
    }
}