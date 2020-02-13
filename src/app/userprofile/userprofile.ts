import { Component, NgZone, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Platform, NavController, AlertController, ToastController, ActionSheetController,ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ValueGlobal } from '../providers/book-service';
import { DomSanitizer } from '@angular/platform-browser';
import { GlobalFunction } from './../providers/globalfunction';
import { File } from '@ionic-native/file/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { OverlayEventDetail } from '@ionic/core';
import { ConfirmotpPage} from 'src/app/confirmotp/confirmotp';
@Component({
    selector: 'app-userprofile',
    templateUrl: 'userprofile.html',
    styleUrls: ['userprofile.scss'],
})

export class UserProfilePage implements OnInit {
    userInfoData: any;
    public userProfileData: FormGroup;
    public changepass = false;
    public phone = "";
    public name = "";
    public mail = "";
    public changephone = false;
    public changename = false;
    public sentOTP = false;
    public haspassword = '';
    public photos: any;
    public strwarning = "";
    public isShowWarning = false;
    public strwarningoldpass = "";
    public intervalID;
    public base64Image: any;
    public htmlImageFromCamera: string;
    croppedImagefilename: any;
    fileType: any;
    croppedImagepath: any;
    changemail= false;;
    constructor(public navCtrl: NavController, public toastCtrl: ToastController,public modalCtrl: ModalController,
        public zone: NgZone, public storage: Storage, public alertCtrl: AlertController, public formBuilder: FormBuilder,
        public actionsheetCtrl: ActionSheetController, public platform: Platform, public camera: Camera, public valueGlobal: ValueGlobal,
        private DomSanitizer: DomSanitizer, public gf: GlobalFunction, private file: File, private crop: Crop) {
        let self = this;
        //self.loadUserInfo();
        //self.checkHasPassword();

        //google analytic
        gf.googleAnalytion('userprofile', 'load', '');
    }

    ngOnInit() {

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
                                se.userInfoData = data;
                                se.bindFormGroup(se.userInfoData);
                            })
                            se.storage.set('userInfoData', data);
                        }
                        else {
                            if (!se.isShowWarning) {
                                se.showConfirm();
                                se.isShowWarning = true;
                            }
                        }
                    }
                });
            } else {
                se.zone.run(() => {
                    se.bindFormGroup(null);
                })
            }
        })
    }

    ionViewWillEnter() {
        var se = this;
        setTimeout(() => {
            se.zone.run(() => {
                
                se.loadUserInfo();
                se.checkHasPassword();
                if(se.gf.getParams('userAvatar')){
                    se.croppedImagepath = se.gf.getParams('userAvatar');
                    se.gf.setParams('userAvatar', null);
                }
            })
        }, 100)
        //Set activetab theo form cha
        se.gf.setActivatedTab(5);
    }
    goback() {
        var self = this;
        self.sentOTP = false;
        self.navCtrl.back();
    }
    /**
     * Bind thông tin user + validate
     * @param data thông tin user
     */
    bindFormGroup(data) {
        var se = this;
        se.phone = data.phone;
        se.name = data.name;
        se.userProfileData = se.formBuilder.group({
            name: [data.fullname || '', Validators.compose([Validators.required])],
            phone: [data.phone || '', Validators.compose([Validators.required, Validators.pattern("0[9|8|1|7|3|5]([0-9]|\s|-|\.){8,12}")])],
            email: [data.email || '', Validators.compose([Validators.required])],
            oldpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            newpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            confirmnewpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            otp: ['', Validators.compose([Validators.required])],
        });
    }

    changePass() {
        this.zone.run(() => {
            this.changepass = !this.changepass;
        })
    }

    public async showConfirm() {
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
                        this.storage.remove('listblogtripdefault');
                        this.valueGlobal.countNotifi = 0;
                        this.navCtrl.navigateRoot('/tab5');
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
                        this.valueGlobal.countNotifi = 0;
                        //this.valueGlobal.logingoback = "MainPage";
                        this.navCtrl.navigateForward('/login');
                    }
                }
            ]
        });
        alert.present();

        //   alert.onDidDismiss().then((data)=>{
        //     this.storage.remove('auth_token');
        //     this.storage.remove('email');
        //     this.storage.remove('username');
        //     this.storage.remove('jti');
        //     this.storage.remove('userInfoData');
        //     this.storage.remove('userRewardData');
        //     this.storage.remove('point');
        //     this.navCtrl.navigateBack('/');
        //   })
    }

    public phoneChange(val) {
        var se = this;
        //user có số phone thì check thay đổi mới show
        se.zone.run(() => {
            if (se.phone) {
                se.changephone = se.phone != val.detail.value;
            } else {
                se.changephone = true;
                se.phone = val.detail.value;
            }
        })

    }

    cancel() {
        var self = this;
        self.sentOTP = false;
        self.navCtrl.back();
    }

    saveChange(val) {
        var se = this;
        var obj = {};
        //validate
        if (!se.userProfileData.value.name) {
            se.presentToast('Họ tên không được để trống');
            return;
        }
        // if (!se.userProfileData.value.email) {
        //     se.presentToast('Email không được để trống');
        //     return;
        // }
        if (se.changepass && !se.userProfileData.value.oldpassword) {
            se.presentToast('Mật khẩu cũ không được để trống');
            return;
        }
        if (se.changepass && !se.userProfileData.value.newpassword) {
            se.presentToast('Mật khẩu mới không được để trống');
            return;
        }
        if (se.changepass && !se.userProfileData.value.confirmnewpassword) {
            se.presentToast('Xác nhận mật khẩu mới không được để trống');
            return;
        }
        if ((se.changepass && se.userProfileData.value.oldpassword && se.userProfileData.value.oldpassword.length < 6)
            || (se.userProfileData.value.newpassword && se.userProfileData.value.newpassword.length < 6)
            || (se.userProfileData.value.confirmnewpassword && se.userProfileData.value.confirmnewpassword.length < 6)) {
            se.presentToast('Mật khẩu phải lớn hơn 6 ký tự');
            return;
        }
        if (se.changepass && se.userProfileData.value.newpassword != se.userProfileData.value.confirmnewpassword) {
            se.presentToast('Mật khẩu mới không trùng khớp');
            return;
        }
        if (!se.changepass) {
            obj = {
                "userInfo": {
                    "email": se.userProfileData.value.email,
                    "fullname": se.userProfileData.value.name,
                    //"avatar": "string",
                    "phone": se.userProfileData.value.phone,
                    "otpPhone": se.userProfileData.value.otp,
                    "passCheckbox": se.changepass,
                }
            }
        }
        else {
            obj = {
                "userInfo": {
                    "email": se.userProfileData.value.email,
                    "fullname": se.userProfileData.value.name,
                    //"avatar": "string",
                    "phone": se.userProfileData.value.phone,
                    "otpPhone": se.userProfileData.value.otp,
                    "passCheckbox": true,
                    "oldPassword": se.haspassword ? se.userProfileData.value.oldpassword : "",
                    "newPassword1": se.userProfileData.value.newpassword,
                    "newPassword2": se.userProfileData.value.confirmnewpassword
                }
            }
        }
        se.valueGlobal.objchangeinfo = obj;
        se.valueGlobal.phone = se.userProfileData.value.phone;
        se.valueGlobal.name = se.userProfileData.value.name;
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
                    body: JSON.stringify(obj)
                };
                request.timeout = 60000;
                request(options, function (error, response, body) {
                    if (response.statusCode == 400) {
                        var rs = JSON.parse(body);
                        if (se.changepass) {
                            se.strwarningoldpass = rs.msg;
                        } else {
                            se.strwarning = rs.msg;
                        }
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
                            var textfullname = se.userProfileData.value.name.split(' ')
                            if (textfullname.length > 2) {
                                let name = '';
                                for (let i = 1; i < textfullname.length; i++) {
                                    if (i == 1) {
                                        name += textfullname[i];
                                    } else {
                                        name += ' ' + textfullname[i];
                                    }
                                }
                                info = { ho: textfullname[0], ten: name, phone: se.userProfileData.value.phone }
                            } else if (textfullname.length > 1) {
                                info = { ho: textfullname[0], ten: textfullname[1], phone: se.userProfileData.value.phone }
                            }
                            else if (textfullname.length == 1) {
                                info = { ho: textfullname[0], ten: "", phone: se.userProfileData.value.phone }
                            }
                            se.storage.remove('infocus');
                            se.storage.remove('userInfoData');
                            se.storage.set("infocus", info);
                            if(se.userProfileData.value.email)
                            {
                                se.storage.set("email", se.userProfileData.value.email);
                            }
                            se.presentToast("Cập nhật hồ sơ thành công.");
                            
                            //se.refreshToken();
                            se.clearSessionOTP();
                            se.loadUserInfo();
                            
                        }
                        else{
                            alert(rs.msg);
                        }
                    }
                })
            }
        })
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
        se.sentOTP = true;
        var elphone = document.getElementById('ipOTP');
        var textphone = se.userProfileData.value.phone || "";

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
                    body: JSON.stringify({ "phoneNumber": textphone })
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
                        se.showpopup();
                        setTimeout(() => {
                            se.clearSessionOTP();
                        }, 180000);
                    }
                })
            }
        })

    }
    async showpopup()
    {
        var se=this;
        var obj = {};
        if (!se.changepass) {
            obj = {
                "userInfo": {
                    "email": se.userProfileData.value.email,
                    "fullname": se.userProfileData.value.name,
                    //"avatar": "string",
                    "phone": se.userProfileData.value.phone,
                    "otpPhone": se.userProfileData.value.otp,
                    "passCheckbox": se.changepass,
                }
            }
        }
        else {
            obj = {
                "userInfo": {
                    "email": se.userProfileData.value.email,
                    "fullname": se.userProfileData.value.name,
                    //"avatar": "string",
                    "phone": se.userProfileData.value.phone,
                    "otpPhone": se.userProfileData.value.otp,
                    "passCheckbox": true,
                    "oldPassword": se.haspassword ? se.userProfileData.value.oldpassword : "",
                    "newPassword1": se.userProfileData.value.newpassword,
                    "newPassword2": se.userProfileData.value.confirmnewpassword
                }
            }
        }
        se.valueGlobal.objchangeinfo = obj;
        se.valueGlobal.phone = se.userProfileData.value.phone;
        se.valueGlobal.name = se.userProfileData.value.name;
        const modal: HTMLIonModalElement =
        await this.modalCtrl.create({
          component: ConfirmotpPage,
  
        });
        modal.present();
        modal.onDidDismiss().then((data: OverlayEventDetail) => {
            se.clearSessionOTP();
            se.loadUserInfo();
        })
    }
    clearSessionOTP() {
        var se = this;
        se.zone.run(() => {
            se.sentOTP = false;
            se.changephone = false;
            se.changename = false;
            se.changepass = false;
            se.strwarning = "";
            se.strwarningoldpass = "";
        })
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
                            if (se.nameChange) {
                                se.storage.remove('username');
                                se.storage.set('username', se.userProfileData.value.name);
                            }
                        })
                    }
                })
            }
        })
    }

    checkHasPassword() {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                var options = {
                    method: 'GET',
                    url: C.urls.baseUrl.urlMobile + '/api/Dashboard/CheckHasPassword',
                    headers:
                    {
                        'cache-control': 'no-cache',
                        'content-type': 'application/json-patch+json',
                        authorization: text
                    }
                };
                request.timeout = 60000;
                request(options, function (error, response, body) {
                    if (response.statusCode != 200) {
                        var objError = {
                            page: "userprofile",
                            func: "checkHasPassword",
                            message: response.statusMessage,
                            content: response.body,
                            type: "warning",
                            param: JSON.stringify(options),
                        };
                        C.writeErrorLog(objError,response);
                    }
                    if (error) {
                        error.page = "userprofile";
                        error.func = "checkHasPassword";
                        error.param = JSON.stringify(options);
                        C.writeErrorLog(error,response);
                    } else if (body) {
                        var obj = JSON.parse(body);
                        se.zone.run(() => {
                            se.haspassword = obj.hasPassword;
                        })
                    }
                })
            }
        })
    }

    

    nameChange(val) {
        var se = this;
        //user có số phone thì check thay đổi mới show
        se.zone.run(() => {
            if (se.userProfileData.value.name) {
                se.changename = se.name != val.detail.value;
            }
        })
    }
    mailChange(val) {
        this.changemail=true;
    }
    changepassword() {
        this.navCtrl.navigateForward(['/app/tabs/userchangepassword']);
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
                se.gf.setParams(base64,'userAvatar');
            })
            const contentType ='image/'+imageType;
            let b64:any = base64.split(',')[1];
            //se.croppedImagepath = "data:image/jpeg;base64,"+base64;
            se.uploadAvatar(b64);
            })
            
          }
}