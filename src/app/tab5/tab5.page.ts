import { ValueGlobal } from './../providers/book-service';
import { Component,NgZone,OnInit } from '@angular/core';
import { NavController,AlertController, ModalController,Platform,LoadingController, ActionSheetController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { Subscription } from 'rxjs/Subscription';
import { Router, NavigationEnd } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NetworkProvider } from '../network-provider.service';
import { CuspointsPage } from '../cuspoints/cuspoints';
import { UserTravelHobbyPage } from '../usertravelhobby/usertravelhobby';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { FCM } from '@ionic-native/fcm/ngx';

/**
 * Generated class for the TabPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

//@IonicPage()
@Component({
  selector: 'app-tab5',
  templateUrl: 'tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})

export class Tab5Page implements OnInit{
  loginuser = null;
  username = null;
  listSupport = [];
  isShowConfirm = false;
  subscription:Subscription;
  point=0;
  public isConnected;
  avatar: any;
  croppedImagepath:any;
  base64Image: any;
  croppedImagefilename: any;
  fileType: any;
  constructor(public platform: Platform,public navCtrl: NavController, public storage: Storage,public modalCtrl: ModalController,private router: Router,private callNumber: CallNumber,
    public valueGlobal:ValueGlobal,public zone : NgZone,public alertCtrl: AlertController,public gf: GlobalFunction,public loadingCtrl: LoadingController,
    public network: Network,
    public networkProvider: NetworkProvider,
    public actionsheetCtrl: ActionSheetController,
    private camera: Camera,
    private crop: Crop,
    private file: File,
    private fcm: FCM){
      this.point = 0;
    storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
     });
    //  storage.get('username').then(username => {
    //   this.username = username;
    //  });
    //  storage.get('point').then(point => {
    //   this.point = point;
    //  });
     this.handleSplashScreen();
     //Lấy danh sách nhân viên hỗ trợ
     //this.loadEmployeeSupport();

     setInterval(()=>{
      this.refreshUserName();
      this.refreshPoint();
    },20000);
    //google analytic
    gf.googleAnalytion('show-more','Search','');
    //Kiểm tra mạng on/off để hiển thị
    this.networkProvider.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (this.isConnected) {
        setTimeout(()=>{
          this.loadEmployeeSupport();
        },100)
      }else{
        this.gf.showWarning('Không có kết nối mạng','Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng','Đóng');
      }
    });
  }
  

  public async ngOnInit(){
    var se = this;
    await se.onRefreshAvatar();
    se.subscription = se.router.events.subscribe( (event) => {
      se.storage.get('auth_token').then(auth_token => {
        if(auth_token){
          se.zone.run(() => {
          se.loginuser = auth_token;
          
            se.refreshUserName();
            se.point = 0;
            se.storage.get('point').then(point => {
              se.point = point;
            });
          })

          if (event instanceof NavigationEnd && (event.url.indexOf("tab5") != -1) ) {
            se.onRefreshAvatar();
          }
        }
       });
      
      
    })
  }

   onRefreshAvatar(){
    var se = this;
    se.zone.run(()=>{
      //console.log(se.gf.getParams('userAvatar'));
      se.storage.get('userInfoData').then((data) => {
        if (data) {
          se.avatar = data.avatar;
        } else {
          se.loadUserInfo();
        }

      })
        if(se.gf.getParams('userAvatar')){
          se.croppedImagepath = se.gf.getParams('userAvatar');
        }
    })
    
  }

  refreshUserName(){
    this.storage.get('username').then(username => {
      this.username = username;
     });
  }

  refreshPoint(){
    this.storage.get('point').then(point => {
      this.point = point;
     });
  }

  loadEmployeeSupport(){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile+ '/mobile/OliviaApis/BookingMemberDetailByUser',
          timeout: 100000, maxAttempts: 5, retryDelay: 20000,
          headers:
          {
            //'postman-token': '89692e55-6555-1572-db28-4becc311f0ba',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          // if(response.statusCode != 200){
          //   var objError ={
          //       page: "show-more",
          //       func: "loadEmployeeSupport",
          //       message : response.statusMessage,
          //       content : response.body,
          //       type: "warning",
          //       param:  JSON.stringify(options)
          //     };
          //   C.writeErrorLog(objError);
          // }
          if (error) {
            error.page = "show-more";
            error.func = "loadEmployeeSupport";
            error.param =  JSON.stringify(options);
            C.writeErrorLog(error,response);
          }else{
            if(body){
              se.zone.run(() => {
                var listemployee = JSON.parse(body);
                listemployee.forEach(element => {
                  if(se.listSupport.length ==0){
                    se.listSupport.push(element);
                  }else if(!se.checkExistEmployee(se.listSupport, element)){
                    se.listSupport.push(element);
                  }
                });

             });
            }else{
              // if(response.statusCode == 400 || response.statusCode == 401){
              //   if(se.isShowConfirm) return;
              //   se.showConfirm("Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.");
              //   se.isShowConfirm = true;
              // }else{
              //   se.listSupport = [];
              // }

            }
            
          }
          
        });
      }
    });
  }

  checkExistEmployee(list, itemcheck){
    var se = this, res = false;
    var obj = list.filter((item)=>{ return item.name == itemcheck.name });
    if(obj && obj.length >0){
      res = true;
    }

    return res;
  }

  enabledTabbar(){
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'flex';
      });
    }
  }
  
  ionViewDidLoad() {
    this.enabledTabbar();
    //Xử lý nút back của dt
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        // code that is executed when the user pressed the back button
        this.navCtrl.navigateRoot('/');
      })
     })
  }
  ionViewWillEnter(){
    var se = this;
    se.point = 0;
    this.loginuser = null;
    se.storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
     });
    this.valueGlobal.logingoback='/app/tabs/tab5';
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
      setTimeout(()=>{
        this.loadEmployeeSupport();
        this.GetUserInfo();
      },100)
      this.loadUserInfo();
    }else{
      this.isConnected = false;
      this.gf.showWarning('Không có kết nối mạng','Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng','Đóng');
    }
        setTimeout(()=>{
          se.zone.run(()=>{
            se.storage.get('auth_token').then(auth_token => {
              se.loginuser = auth_token;
              se.storage.get('username').then(username => {
                se.username = username;
               });
               se.storage.get('point').then(point => {
                se.point = point;
               });
             });
          })
        },100)
        if(document.querySelector(".tabbar")){
          document.querySelector(".tabbar")['style'].display = 'flex';
        }
    }

    ionViewDidEnter(){
      var se = this;
      se.storage.get('username').then(username => {
        se.username = username;
       });
    }

  async handleSplashScreen(): Promise<void> {
    try {
      // wait for App to finish loading
      await this.platform.ready()
    } catch (error) {
      if (error) {
        error.page = "show-more";
        error.func = "handleSplashScreen";
        C.writeErrorLog(error,null);
        throw new Error(error)
      };
    }
    const splash = document.getElementById('splash-screen');
    if(splash){
      splash.style.opacity = '0';
      setTimeout(() => { splash.remove() }, 300);
    }
    
  }
  goToLogin(){
    //this.storage.get('auth_token').then(auth_token => {
      //if (!auth_token) {
        //this.valueGlobal.logingoback='TabPage';
        this.navCtrl.navigateForward('/login');
      //}
    //});
  }
  goToLogout(){
    this.storage.get('auth_token').then(id_token => {
      if (id_token !== null) {
        this.showConfirmLogout('Bạn có chắc chắn muốn đăng xuất?',id_token);
      }
    });
  }
  /***
     * Gọi tổng đài hỗ trợ
     * PDANH 26/02/2019
     */
    async makeCallSupport(value){
      try {
        let tel = "19001870";
        if(value == 1){
          tel = "19002045";
        }else if(value==2){
          tel = "19001870";
        }
        else if(value > 3){
          tel = value;
        }
        else{
          tel = "19002087";
        }
        setTimeout(() => {
          //window.open(`tel:${tel}`, '_system');
          this.callNumber.callNumber(tel, true);
        },100);
      }
      catch (error) {
        if (error) {
          error.page = "show-more";
          error.func = "makeCallSupport";
          C.writeErrorLog(error,null);
        };
      }
      //google analytic
    this.gf.googleAnalytion('show-more','callsupport','');
    }

    
    public async showConfirm(msg){
        let alert = await this.alertCtrl.create({
          message: msg,
          cssClass: "cls-alert-showmore",
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
              this.storage.remove('infocus');
              this.zone.run(()=>{
                this.point = 0;
                this.loginuser = null;
                this.username= "";
                this.valueGlobal.countNotifi = 0;
                this.isShowConfirm = false;
              })
              if(this.modalCtrl){
                this.modalCtrl.dismiss();
              }
              this.navCtrl.navigateBack('/');
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
              this.storage.remove('infocus');
              this.zone.run(()=>{
                this.point = 0;
                this.loginuser = null;
                this.username= "";
                this.valueGlobal.countNotifi = 0;
                this.isShowConfirm = false;
              })
              //this.valueGlobal.logingoback = "MainPage";
              if(this.modalCtrl){
                this.modalCtrl.dismiss();
              }
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
        this.storage.remove('infocus');
        this.zone.run(()=>{
          this.point = 0;
          this.loginuser = null;
          this.username= "";
          this.valueGlobal.countNotifi = 0;
          this.isShowConfirm = false;
        })
        this.navCtrl.navigateBack('/');
      })
    }

    public async showConfirmLogin(msg){
      let alert = await this.alertCtrl.create({
        message: msg,
        cssClass: "cls-alert-showmore",
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
            this.storage.remove('infocus');
            this.zone.run(()=>{
              this.point = 0;
              this.loginuser = null;
              this.username= "";
              this.valueGlobal.countNotifi = 0;
              this.isShowConfirm = false;
            })
            if(this.modalCtrl){
              this.modalCtrl.dismiss();
            }
            this.navCtrl.navigateBack('/');
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
            this.storage.remove('infocus');
           // this.valueGlobal.logingoback = "MainPage";
            this.zone.run(()=>{
              this.point = 0;
              this.loginuser = null;
              this.username= "";
              this.valueGlobal.countNotifi = 0;
              this.isShowConfirm = false;
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

    alert.onDidDismiss().then((data)=>{
      this.isShowConfirm = false;
    })
  }

    public async showConfirmLogout(msg,id_token){
      let alert = await this.alertCtrl.create({
        message: msg,
        cssClass: "cls-alert-showmore",
        buttons: [{
          text: 'Có',
          role: 'OK',
          handler: () => {
            this.storage.remove('auth_token');
                this.storage.remove('email');
                this.storage.remove('username');
                this.storage.remove('jti');
                this.storage.remove('userInfoData');
                this.storage.remove('userRewardData');
                this.storage.remove('weatherInfo');
                this.storage.remove('point');
                this.storage.remove('infocus');
                this.gf.setParams(true, 'resetBlogTrips');
                this.storage.remove('listblogtripdefault');
                this.storage.clear();
                this.croppedImagepath = null;
                this.avatar = null;
                this.valueGlobal.backValue = 'tab5';
                this.zone.run(()=>{
                  this.point = 0;
                  this.loginuser = null;
                  this.username= "";
                  this.valueGlobal.countNotifi = 0;
                  this.isShowConfirm = false;
                })
                //Xóa token device khi logout
                this.fcm.getToken().then(token => {
                this.gf.DeleteTokenOfUser(token, id_token, this.gf.getAppVersion());
            });
              this.navCtrl.navigateForward('/login');
          }
        },
        {
          text: 'Không',
          handler: () => {
            
          }
        }
      ]
    });
    alert.present();
  }

    showUserReward(){
      //this.presentLoadingnavi();
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          // let modal = this.modalCtrl.create("UserRewardPage");
          // modal.present();
          this.navCtrl.navigateForward('/userreward');
        }else{
          if(se.isShowConfirm) return;
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
          se.isShowConfirm = true;
        }
      });
      //google analytic
      se.gf.googleAnalytion('show-more','Search','userreward');
    }

    showUserProfile(){
      //this.presentLoadingnavi();
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          // let modal = se.modalCtrl.create("UserProfilePage");
          // modal.present();
          this.gf.setParams(se.croppedImagepath,'userAvatar');
          this.navCtrl.navigateForward(['/app/tabs/userprofile']);
        }else{
          if(se.isShowConfirm) return;
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
          se.isShowConfirm = true;
        }
      });
     //google analytic
     se.gf.googleAnalytion('show-more','Search','userprofile');
    }
    
    Point()
    {
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          //se.app.getActiveNav().push('CuspointsPage');
          //this.navCtrl.navigateForward('/cuspoints');
          this.presentModal(CuspointsPage);
        }else{
          if(se.isShowConfirm) return;
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
          se.isShowConfirm = true;
        }
      });
      //google analytic
      se.gf.googleAnalytion('show-more','Search','userpoint');
    }

    showUserReviews(){
      //this.presentLoadingnavi();
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          // let modal = se.modalCtrl.create("UserReviewsPage");
          // modal.present();
          this.navCtrl.navigateForward('/userreviews');
          
        }else{
          if(se.isShowConfirm) return;
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
          se.isShowConfirm = true;
        }
      });
      //google analytic
      se.gf.googleAnalytion('show-more','Search','userreviews');
    }
    
    async presentModal(comp) {
      const modal: HTMLIonModalElement =
          await this.modalCtrl.create({
            component: comp,
            componentProps: {
              aParameter: true,
            }
          });
        modal.present();
    }

    sendSMSSupport(){
      this.presentLoadingnavi();
      var se = this;
      // let modal =se.modalCtrl.create("SendSmsPage");
      // modal.present();
      this.navCtrl.navigateForward('/sendsms');
    }
    async presentLoadingnavi() {
      var loader = await this.loadingCtrl.create({
        message: "",
        duration: 1000
      });
      loader.present();
    }
    
    showUserTravelHobby(){
      var se = this;
      se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
          //se.navCtrl.navigateForward('/usertravelhobby');
          se.presentModal(UserTravelHobbyPage);
        }else{
          if(se.isShowConfirm) return;
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
          se.isShowConfirm = true;
        }
      });
    }

    /**
     * Load thông tin user
     */
    loadUserInfo() {
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
                            page: "userprofile",
                            func: "loadUserInfo",
                            message: response.statusMessage,
                            content: response.body,
                            type: "warning",
                            param: JSON.stringify(options)
                        };
                        C.writeErrorLog(objError,response);
                    }
                    if (error) {
                        error.page = "userprofile";
                        error.func = "loadUserInfo";
                        error.param = JSON.stringify(options);
                        C.writeErrorLog(error,response);
                    } else {
                        if (body) {
                            var data = JSON.parse(body);
                            se.zone.run(() => {
                                se.avatar = data.avatar;
                            })
                            se.storage.remove('userInfoData');
                            se.storage.set('userInfoData', data);
                        }
                    }
                });
            } 
        })
    }

    async changeAvatar(){
      let actionSheet = await this.actionsheetCtrl.create({
        cssClass: 'action-sheets-basic-page',
        buttons: [
          {
            text: 'Chụp ảnh',
            role: 'destructive',
            icon: 'camera',
            handler: () => {
              
              this.captureImage();
            }
          },
          {
            text: 'Chọn ảnh từ bộ sưu tập',
            icon: 'image',
            handler: () => {
              this.captureImageGallery();
            }
          },
        ]
      });
      actionSheet.present();
      }
      /**
       * Chọn từ bộ sưu tập
       * @param useAlbum 
       */
      async captureImageGallery() {
          var se = this;
          const options: CameraOptions = {
              quality: 76,
              sourceType: se.camera.PictureSourceType.SAVEDPHOTOALBUM,
              destinationType: se.camera.DestinationType.FILE_URI,
              encodingType: se.camera.EncodingType.JPEG,
              mediaType: se.camera.MediaType.PICTURE,
              saveToPhotoAlbum: true,
              correctOrientation: true,
            }

            se.camera.getPicture(options).then((imageData) => {    
              let filename,path;
              se.base64Image = imageData;
                  path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
                  filename = imageData.substring(imageData.lastIndexOf('/') + 1);
                  let index = filename.indexOf('?');     
                  if (index > -1) {
                    filename = filename.substring(0,index);
                  }      
                  se.croppedImagefilename = filename;
                  se.cropImage(imageData);
              })
      }

      /**
       * Chụp ảnh
       * @param useAlbum 
       */
      async captureImage() {
          var se = this;
          const options: CameraOptions = {
            quality: 76,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true,
          }
      
          this.zone.run(()=>{
              this.camera.getPicture(options).then((imageData) => {
                  let filename,path;
                  se.base64Image = imageData;
                  path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
                  filename = imageData.substring(imageData.lastIndexOf('/') + 1);
                  let index = filename.indexOf('?');     
                  if (index > -1) {
                    filename = filename.substring(0,index);
                  }      
                  se.croppedImagefilename = filename;
                  se.cropImage(imageData);

                 });
          })
      }

      uploadAvatar(image: any){
          var se = this;
          se.getFullImage(se.base64Image.split('?')[0]).then((data)=>{
              se.storage.get('auth_token').then(auth_token => {
                  if (auth_token) {
                      var text = "Bearer " + auth_token;
                      var options = {
                      method: 'POST',
                      url: C.urls.baseUrl.urlMobile + '/api/dashboard/UploadAvatarBase64',
                      headers:
                      {
                          Authorization: text,
                      },
                      body: {
                          "imgBase64Full": data,
                          "imgBase64Crop": image,
                          "fileExtension": se.fileType
                          },
                      json: true
                      };
                      
                      request(options, function (error, response, body) {
                          if (error) {
                              error.page = "userprofile";
                              error.func = "captureImage";
                              error.param = JSON.stringify(options);
                              C.writeErrorLog(error,response);
                          }else{
                              se.storage.remove('userInfoData');
                          }
                      })
                  }
              }) 

          });
      }

      cropImage(imgPath) {
          this.crop.crop(imgPath, { quality: 100 })
            .then(
              newPath => {
                this.showCroppedImage(newPath.split('?')[0]);
              },
              error => {
                throw error;
              }
              
            );
        }
        /**
         * Trả về dạng base64 của image full
         * @param ImagePath Đường dẫn image full
         */
        getFullImage(ImagePath): Promise < any >{
          return new Promise((resolve, reject) => {
              var copyPath = ImagePath;
              var splitPath = copyPath.split('/');
              var imageName = splitPath[splitPath.length-1];
              var filePath = ImagePath.split(imageName)[0];
              var splitType = imageName.split('.');
              var imageType = splitType[splitType.length -1];
              var se = this;
              se.file.readAsDataURL(filePath,imageName).then(base64=>{
               let b64:any = base64.split(',')[1];
              resolve(b64);
              })
          })
        }
          /**
         * Trả về dạng base64 của image đã scrop
         * @param ImagePath Đường dẫn image scrop
         */
        showCroppedImage(ImagePath){
          var copyPath = ImagePath;
          var splitPath = copyPath.split('/');
          var imageName = splitPath[splitPath.length-1];
          var filePath = ImagePath.split(imageName)[0];
          var splitType = imageName.split('.');
          var imageType = splitType[splitType.length -1];
          
          var se = this;
          se.fileType = imageType;
          se.file.readAsDataURL(filePath,imageName).then(base64=>{
          se.zone.run(()=>{
              se.croppedImagepath = base64;
          })
          const contentType ='image/'+imageType;
          let b64:any = base64.split(',')[1];
          //se.croppedImagepath = "data:image/jpeg;base64,"+base64;
          se.uploadAvatar(b64);
          })
         
        }

        doRefresh(event){
          var se = this;
          se.storage.get('auth_token').then(auth_token => {
            if(auth_token){
              se.loginuser = auth_token;
    
              se.zone.run(()=>{
                se.refreshUserName();
                se.storage.get('point').then(point => {
                 se.point = point;
                 });
               })
            }
           });
           setTimeout(()=>{
            event.target.complete();
           }, 500)
           
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
                  C.writeErrorLog(objError, response);
                }
                if (error) {
                  error.page = "roomdetailreview";
                  error.func = "GetUserInfo";
                  error.param = JSON.stringify(options);
                  C.writeErrorLog(error, response);
                } else {
                  if (body) {
                    var data = JSON.parse(body);
                    var info;
                    var checkfullname = se.validateEmail(data.fullname);
      
                    if (!checkfullname) {
                      var textfullname = data.fullname.split(' ')
                      //info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                      if (textfullname.length > 2) {
                        let name = '';
                        for (let i = 1; i < textfullname.length; i++) {
                          if (i == 1) {
                            name += textfullname[i];
                          } else {
                            name += ' ' + textfullname[i];
                          }
                        }
                        info = { ho: textfullname[0], ten: name, phone: data.phone }
                      } else {
                        info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                      }
                      se.storage.set("infocus", info);
                    } else {
                      info = { ho: "", ten: "", phone: data.phone }
                      se.storage.set("infocus", info);
                    }
                    se.storage.set("email", data.email);
                    se.storage.set("jti", data.memberId);
                    //se.storage.set("auth_token", body.auth_token);
                    se.storage.set("username", data.fullname);
                    se.storage.set("phone", data.phone);
                    se.storage.set("point", data.point);
                    se.storage.get('auth_token').then(auth_token => {
                      se.loginuser = auth_token;
                    });
                    se.storage.get('username').then(username => {
                      se.username = username;
                    });
                    se.storage.get('point').then(point => {
                      se.point = point;
                    });
                  }
      
                }
              });
            }
          })
        }
        validateEmail(email) {
          var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return re.test(String(email).toLowerCase());
        }
}