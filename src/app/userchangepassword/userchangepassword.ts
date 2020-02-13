import { Component,NgZone,OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup,ReactiveFormsModule  } from '@angular/forms';
import { Platform,NavController, AlertController, ToastController, ActionSheetController } from '@ionic/angular';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ValueGlobal } from '../providers/book-service';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import * as $ from 'jquery';

@Component({
  selector: 'app-userchangepassword',
  templateUrl: 'userchangepassword.html',
  styleUrls: ['userchangepassword.scss'],
})

export class UserChangePasswordPage implements OnInit{
    public userProfileData: FormGroup;
    haspassword='';
    intervalID;
    changepass = false;
    public strwarning = "";
    public strwarningoldpass = "";
    email: any;
    phone:any;
    inputtype = "password";
    inputtypenew = "password";
    name: any;
    constructor(public navCtrl: NavController,public toastCtrl: ToastController,
        public zone: NgZone,public storage: Storage,public alertCtrl: AlertController, public formBuilder: FormBuilder,
        public actionsheetCtrl: ActionSheetController, public platform: Platform,public valueGlobal: ValueGlobal,
        public gf: GlobalFunction,private activeRoute: ActivatedRoute){
    }
    
    ngOnInit(){
    }

    goback(){
        this.navCtrl.back();
    }
    ionViewWillEnter(){
        var se = this;
        se.storage.get('userInfoData').then((data:any)=>{
            if(data){
                se.zone.run(()=>{
                    se.bindFormGroup(data);
                })
            }
        })
        $('#oldpassword').children('button').click(e => se.clickedElement(e));
        //Set activetab theo form cha
        se.gf.setActivatedTab(5);
    }

    clickedElement(event){
        debugger
    }

    ionViewDidEnter(){
        var se = this;
        // se.intervalID =  setInterval(()=>{
        //     se.refreshToken();
        //     se.checkHasPassword();
        // },20000);
    }
    ionViewWillLeave() {
        this.zone.run(()=>{
            clearInterval(this.intervalID);
        })
    }

    checkHasPassword(){
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                var options = {
                method: 'GET',
                url: C.urls.baseUrl.urlMobile +'/api/Dashboard/CheckHasPassword',
                headers:
                {
                    'cache-control': 'no-cache',
                    'content-type': 'application/json-patch+json',
                    authorization: text
                }
                };
                request.timeout = 60000;
                request(options, function (error, response, body) {
                    if(response.statusCode != 200){
                        var objError ={
                            page: "userprofile",
                            func: "checkHasPassword",
                            message : response.statusMessage,
                            content : response.body,
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
                    }else if(body){
                        var obj = JSON.parse(body);
                        se.zone.run(()=>{
                            se.haspassword = obj.hasPassword;
                        })
                    }
                })
            }
        }) 
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
                        'content-type': 'application/json',
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
                            param:  JSON.stringify(options)
                        };
                        C.writeErrorLog(objError,response);
                    }
                    if (error) {
                        error.page = "userprofile";
                        error.func = "refreshToken";
                        error.param =  JSON.stringify(options);
                        C.writeErrorLog(error,response);
                    }else{
                        var au = JSON.parse(body);
                        se.zone.run(()=>{
                            se.storage.remove('auth_token');
                            se.storage.set('auth_token', au.auth_token);
                        })
                    }
                    })
            }
        })
    }

    /**
     * Bind thông tin user + validate
     * @param data thông tin user
     */
    bindFormGroup(data){
        var se = this;
        se.email = data.email;
        se.phone = data.phone;
        se.name = data.fullname;
            se.userProfileData = se.formBuilder.group({
                //email: data.email,
                oldpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
                newpassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
            });
    }


    saveChange(){
        var se = this;
        var obj = {};
        // if(!se.haspassword){
        //     se.presentToast('Mật khẩu cũ không tồn tại. Vui lòng liên hệ với iVIVU.');
        //     return;
        // }
        if(!se.userProfileData.value.oldpassword){
            se.presentToast('Mật khẩu cũ không được để trống');
            return;
        }
        if(!se.userProfileData.value.newpassword){
            se.presentToast('Mật khẩu mới không được để trống');
            return;
        }
        
        if( (se.userProfileData.value.oldpassword && se.userProfileData.value.oldpassword.length <6)
        ||(se.userProfileData.value.newpassword && se.userProfileData.value.newpassword.length <6)
        ) {
            se.presentToast('Mật khẩu phải lớn hơn 6 ký tự');
            return;
        }
       
        
            obj ={"userInfo": {
            "email": se.email ,
            "phone": se.phone,
            "fullname": se.name,
            "passCheckbox": true,
            "oldPassword": se.userProfileData.value.oldpassword,
            "newPassword1": se.userProfileData.value.newpassword,
            "newPassword2": se.userProfileData.value.newpassword
                }
            }
        
        se.storage.get('auth_token').then(auth_token => {
            if (auth_token) {
                var text = "Bearer " + auth_token;
                var options = {
                method: 'POST',
                url: C.urls.baseUrl.urlMobile +'/api/Dashboard/ChangeUserInfo',
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
                if(response.statusCode == 400){
                    var rs = JSON.parse(body);
                    if(se.changepass){
                        se.strwarning = rs.msg;
                    }else{
                        se.strwarning = rs.msg;
                    }
                    se.presentToast(se.strwarning);
                }
                if(response.statusCode != 200){
                    var objError ={
                        page: "userprofile",
                        func: "saveChange",
                        message : response.statusMessage,
                        content : response.body,
                        type: "warning",
                        param:  JSON.stringify(options)
                      };
                    C.writeErrorLog(objError,response);
                }
                if (error) {
                    error.page = "userprofile";
                    error.func = "saveChange";
                    error.param =  JSON.stringify(options);
                    C.writeErrorLog(error,response);
                }else{
                    var rs = JSON.parse(body);
                    if(rs.result){
                        se.presentToast("Đổi mật khẩu thành công.");
                        se.goback();
                        //se.refreshToken();
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

      changetype(value){
          //Set ẩn hiện oldpassword
          this.zone.run(()=>{
            if(value == 1){
                if(this.inputtype && this.inputtype == "password"){
                    this.inputtype = "text";
                }else{
                    this.inputtype = "password";
                }
            }
            else if(value == 2){
                if(this.inputtypenew && this.inputtypenew == "password"){
                    this.inputtypenew = "text";
                }else{
                    this.inputtypenew = "password";
                }
            }
          })
        
      }
}