(window.webpackJsonp=window.webpackJsonp||[]).push([[33],{ENxH:function(l,n,e){"use strict";e.r(n);var u=e("8Y7J");class t{}var o=e("pMnS"),i=e("oBZk"),a=e("ZZ/e"),d=e("SVse"),r=e("s7LF"),c=e("mrSG"),s=e("D5/n"),g=e("KGI4"),h=e("Tcs0");class p{constructor(l,n,e,u,t,o,i,a){this.platform=l,this.navCtrl=n,this.toastCtrl=e,this.zone=u,this.storage=t,this.alertCtrl=o,this.renderer=i,this.gf=a,this.optCheck=0,this.nameValidate=!0,this.mobileValidate=!0,this.addressValidate=!0;let d=this.gf.getParams("exchangegift");d&&d.userinfo&&this.loadData(d.record,d.userinfo),this.platform.ready().then(()=>{this.platform.backButton.subscribe(()=>{this.navCtrl.navigateBack("/showmore")})}),a.googleAnalytion("exchangegift","load","")}ngOnInit(){}loadData(l,n){this.record=l,this.userInfoData=n}close(){this.navCtrl.navigateBack("/showmore")}presentToast(l){return c.__awaiter(this,void 0,void 0,function*(){(yield this.toastCtrl.create({message:l,duration:2e3,position:"top"})).present()})}radioCheck(l){this.zone.run(()=>{this.optCheck=l;var n=document.getElementsByClassName("radio-icon");1==l?(n[0].classList.add("radio-checked"),n[1].classList.remove("radio-checked"),n[0].nextElementSibling.setAttribute("aria-checked","true"),n[1].nextElementSibling.setAttribute("aria-checked","false")):(n[1].classList.add("radio-checked"),n[0].classList.remove("radio-checked"),n[1].nextElementSibling.setAttribute("aria-checked","true"),n[0].nextElementSibling.setAttribute("aria-checked","false"))})}filterPhone(l){return new RegExp("0[9|8|1|7|3|5]([0-9]|s|-|.){8,12}").test(l)}exchange(){if(document.getElementById("ipName")&&!this.customerName)return this.nameValidate=!1,void this.setInputFocus("ipName");if(this.customerName&&(this.nameValidate=!0),document.getElementById("ipMobile")&&!this.filterPhone(this.customerMobile))return this.mobileValidate=!1,void this.setInputFocus("ipMobile");if(this.filterPhone(this.customerMobile)&&(this.mobileValidate=!0),document.getElementById("ipAddress")&&!this.customerAddress)return this.addressValidate=!1,void this.setInputFocus("ipAddress");if(this.customerAddress&&(this.addressValidate=!0),this.record){var l={redeemInfo:{itemId:this.record.id,itemType:this.record.rewardTypeId,pickupType:this.optCheck,point:this.record.unitPoint,fullname:2==this.optCheck?this.customerName:"",phone:2==this.optCheck?this.customerMobile:"",address:2==this.optCheck?this.customerAddress:""}},n=this;n.storage.get("auth_token").then(e=>{if(e){var u="Bearer "+e,t={method:"POST",url:g.a.urls.baseUrl.urlMobile+"/api/Dashboard/RedeemItem",timeout:1e4,maxAttempts:5,retryDelay:2e3,headers:{accept:"application/json","content-type":"application/json-patch+json",authorization:u},body:JSON.stringify(l)};s(t,function(l,e,o){if(l)throw l.page="exchangegift",l.func="exchange",l.param=JSON.stringify(t),g.a.writeErrorLog(l,e),new Error(l);200!=e.statusCode&&(JSON.stringify(t),g.a.writeErrorLog(l,e)),200==e.statusCode&&n.presentAlert("","<div class='ct-1'>Ch\xfac m\u1eebng qu\xfd kh\xe1ch Ph\u1ea1m \u0110\u1ee9c Anh \u0111\xe3 \u0111\u1ed5i qu\xe0 t\u1eb7ng th\xe0nh c\xf4ng.</div><div class='ct-2'>Th\u1eddi gian d\u1ef1 ki\u1ebfn nh\u1eadn \u0111\u01b0\u1ee3c qu\xe0 t\u1eeb 3 - 5 ng\xe0y l\xe0m vi\u1ec7c (tr\u1eeb th\u1ee9 7, ch\u1ee7 nh\u1eadt & l\u1ec5 T\u1ebft).</div><div class='ct-3'>N\u1ebfu c\u1ea7n s\u1ef1 h\u1ed7 tr\u1ee3 vui l\xf2ng li\xean h\u1ec7 v\u1edbi iVIVU.com qua email tc@ivivu.com ho\u1eb7c s\u1ed1 t\u1ed5ng \u0111\xe0i sau:</div><div class='ct-4'>H\u1ed3 Ch\xed Minh: 1900 1870</div><div class='ct-5'>H\xe0 N\u1ed9i: 1900 2045</div><div class='ct-6'>C\u1ea7n Th\u01a1: 1900 2087</div><div class='ct-7'>\u0110\xe0 N\u1eb5ng: (023) 6710 9566</div>",u)})}})}}setInputFocus(l){const n=document.getElementById(l);this.renderer.invokeElementMethod(n,"focus",[])}presentAlert(l,n,e){return c.__awaiter(this,void 0,void 0,function*(){const l=yield this.alertCtrl.create({message:n,buttons:["OK"]});yield l.present(),l.dismiss(()=>{var l={method:"POST",url:g.a.urls.baseUrl.urlMobile+"/api/account/reloadTokenClaims",timeout:1e4,maxAttempts:5,retryDelay:2e3,headers:{accept:"application/json","content-type":"application/json-patch+json",authorization:e},body:{}};s(l,function(n,e,u){n&&(n.page="reloadTokenClaims",n.func="exchange",n.param=JSON.stringify(l),g.a.writeErrorLog(n,e)),200!=e.statusCode&&(JSON.stringify(l),g.a.writeErrorLog(n,e))}),this.navCtrl.navigateBack("/showmore")})})}}var f=e("xgBC"),m=u["\u0275crt"]({encapsulation:0,styles:[[".exchangegift-content[_ngcontent-%COMP%]{padding:0;width:100%}.div-icon-close[_ngcontent-%COMP%]{float:right;opacity:.6;font-size:24px}.no-padding[_ngcontent-%COMP%]{padding:0}.radio-checked[_ngcontent-%COMP%]{border-color:#26bed6!important}.radio-inner[_ngcontent-%COMP%]{left:2px;top:2px;border-radius:50%;position:absolute;width:8px;height:8px;background-color:#26bed6!important}.radio-icon[_ngcontent-%COMP%]{top:3px!important}.item-title[_ngcontent-%COMP%]{font-size:16px;font-weight:500;color:#003c71}.list-location[_ngcontent-%COMP%]{width:100%}.office-brand[_ngcontent-%COMP%]{padding-top:16px}.title-band[_ngcontent-%COMP%]{padding:8px 0 0}.office-title[_ngcontent-%COMP%]{font-weight:500;font-style:italic}.time-office[_ngcontent-%COMP%]{padding-left:16px}.btn-cancel[_ngcontent-%COMP%], .btn-exchange[_ngcontent-%COMP%]{border-color:#f79221;color:#fff;background:#f79221;width:98%;height:44px;text-transform:none;font-size:17px;font-weight:400}.exchange-input[_ngcontent-%COMP%]{border:1px solid #cdcdcd;border-radius:5px}.input-label[_ngcontent-%COMP%]{align-self:center;color:#848484}.validate-error[_ngcontent-%COMP%]{border:1px solid red}"]],data:{}});function C(l){return u["\u0275vid"](0,[(l()(),u["\u0275eld"](0,0,null,null,39,"div",[["class","div-ivivu-office"]],null,null,null,null,null)),(l()(),u["\u0275eld"](1,0,null,null,38,"div",[["class","title-band"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Qu\xfd kh\xe1ch vui l\xf2ng \u0111\u1ebfn m\u1ed9t trong nh\u1eefng \u0111\u1ecba \u0111i\u1ec3m sau \u0111\u1ec3 nh\u1eadn qu\xe0: "])),(l()(),u["\u0275eld"](3,0,null,null,3,"div",[["class","office-brand"]],null,null,null,null,null)),(l()(),u["\u0275eld"](4,0,null,null,1,"span",[["class","office-title"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["V\u0103n ph\xf2ng t\u1ea1i Tp. H\u1ed3 Ch\xed Minh:"])),(l()(),u["\u0275ted"](-1,null,[" L\u1ea7u 2, t\xf2a nh\xe0 Anh \u0110\u0103ng, 215 Nam K\u1ef3 Kh\u1edfi Ngh\u0129a, Ph\u01b0\u1eddng 7, Qu\u1eadn 3. Tp.HCM."])),(l()(),u["\u0275eld"](7,0,null,null,1,"div",[],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1eddi gian l\xe0m vi\u1ec7c"])),(l()(),u["\u0275eld"](9,0,null,null,4,"div",[],null,null,null,null,null)),(l()(),u["\u0275eld"](10,0,null,null,1,"div",[["class","time-office"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1ee9 2 - Th\u1ee9 7: t\u1eeb 07h30 \u0111\u1ebfn 21h00"])),(l()(),u["\u0275eld"](12,0,null,null,1,"div",[["class","time-office"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["CN: t\u1eeb 07h30 \u0111\u1ebfn 20h00"])),(l()(),u["\u0275eld"](14,0,null,null,3,"div",[["class","office-brand"]],null,null,null,null,null)),(l()(),u["\u0275eld"](15,0,null,null,1,"span",[["class","office-title"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["V\u0103n ph\xf2ng t\u1ea1i Tp. H\xe0 N\u1ed9i:"])),(l()(),u["\u0275ted"](-1,null,[" T\u1ea7ng 12, 70-72 B\xe0 Tri\u1ec7u, Qu\u1eadn Ho\xe0ng Ki\u1ebfm, H\xe0 N\u1ed9i"])),(l()(),u["\u0275eld"](18,0,null,null,1,"div",[],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1eddi gian l\xe0m vi\u1ec7c"])),(l()(),u["\u0275eld"](20,0,null,null,1,"div",[["class","time-office"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1ee9 2 - Th\u1ee9 6: t\u1eeb 09h30 \u0111\u1ebfn 17h00"])),(l()(),u["\u0275eld"](22,0,null,null,3,"div",[["class","office-brand"]],null,null,null,null,null)),(l()(),u["\u0275eld"](23,0,null,null,1,"span",[["class","office-title"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["V\u0103n ph\xf2ng t\u1ea1i Tp. C\u1ea7n Th\u01a1:"])),(l()(),u["\u0275ted"](-1,null,[" 166B Tr\u1ea7n H\u01b0ng \u0110\u1ea1o, P. An Nghi\u1ec7p, Qu\u1eadn Ninh Ki\u1ec1u, Tp. C\u1ea7n Th\u01a1"])),(l()(),u["\u0275eld"](26,0,null,null,1,"div",[],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1eddi gian l\xe0m vi\u1ec7c"])),(l()(),u["\u0275eld"](28,0,null,null,4,"div",[],null,null,null,null,null)),(l()(),u["\u0275eld"](29,0,null,null,1,"div",[["class","time-office"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1ee9 2 - Th\u1ee9 7: t\u1eeb 07h30 \u0111\u1ebfn 21h00"])),(l()(),u["\u0275eld"](31,0,null,null,1,"div",[["class","time-office"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["CN: t\u1eeb 07h30 \u0111\u1ebfn 20h00"])),(l()(),u["\u0275eld"](33,0,null,null,3,"div",[["class","office-brand"]],null,null,null,null,null)),(l()(),u["\u0275eld"](34,0,null,null,1,"span",[["class","office-title"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["V\u0103n ph\xf2ng t\u1ea1i Tp. \u0110\xe0 N\u1eb5ng:"])),(l()(),u["\u0275ted"](-1,null,[" L\u1ea7u 2, PGT Tower, 220 Nguy\u1ec5n H\u1eefu Th\u1ecd, Qu\u1eadn H\u1ea3i Ch\xe2u, Tp. \u0110\xe0 N\u1eb5ng"])),(l()(),u["\u0275ted"](-1,null,[" Th\u1eddi gian l\xe0m vi\u1ec7c "])),(l()(),u["\u0275eld"](38,0,null,null,1,"div",[["class","time-office"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Th\u1ee9 2 - Th\u1ee9 6: t\u1eeb 08h00 \u0111\u1ebfn 17h00"]))],null,null)}function v(l){return u["\u0275vid"](0,[(l()(),u["\u0275eld"](0,0,null,null,45,"div",[["class","div-customer-address"]],null,null,null,null,null)),(l()(),u["\u0275eld"](1,0,null,null,14,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](2,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](3,0,null,0,2,"ion-col",[["class","input-label"],["col-3",""]],null,null,null,i.db,i.i)),u["\u0275did"](4,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275ted"](-1,0,["H\u1ecd t\xean"])),(l()(),u["\u0275eld"](6,0,null,0,9,"ion-col",[["col-9",""]],null,null,null,i.db,i.i)),u["\u0275did"](7,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](8,0,null,0,7,"ion-input",[["class","exchange-input"],["id","ipName"],["placeholder","Nh\u1eadp h\u1ecd t\xean..."]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],function(l,n,e){var t=!0,o=l.component;return"ionBlur"===n&&(t=!1!==u["\u0275nov"](l,10)._handleBlurEvent()&&t),"ionChange"===n&&(t=!1!==u["\u0275nov"](l,10)._handleInputEvent(e.target.value)&&t),"ngModelChange"===n&&(t=!1!==(o.customerName=e)&&t),t},i.mb,i.r)),u["\u0275did"](9,278528,null,0,d.NgClass,[u.IterableDiffers,u.KeyValueDiffers,u.ElementRef,u.Renderer2],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),u["\u0275did"](10,16384,null,0,a.TextValueAccessor,[u.ElementRef],null,null),u["\u0275prd"](1024,null,r.NG_VALUE_ACCESSOR,function(l){return[l]},[a.TextValueAccessor]),u["\u0275did"](12,671744,null,0,r.NgModel,[[8,null],[8,null],[8,null],[6,r.NG_VALUE_ACCESSOR]],{model:[0,"model"]},{update:"ngModelChange"}),u["\u0275prd"](2048,null,r.NgControl,null,[r.NgModel]),u["\u0275did"](14,16384,null,0,r.NgControlStatus,[[4,r.NgControl]],null,null),u["\u0275did"](15,49152,null,0,a.IonInput,[u.ChangeDetectorRef,u.ElementRef],{placeholder:[0,"placeholder"]},null),(l()(),u["\u0275eld"](16,0,null,null,14,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](17,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](18,0,null,0,2,"ion-col",[["class","input-label"],["col-3",""]],null,null,null,i.db,i.i)),u["\u0275did"](19,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275ted"](-1,0,["S\u1ed1 di \u0111\u1ed9ng"])),(l()(),u["\u0275eld"](21,0,null,0,9,"ion-col",[["col-9",""]],null,null,null,i.db,i.i)),u["\u0275did"](22,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](23,0,null,0,7,"ion-input",[["class","exchange-input"],["id","ipMobile"],["placeholder","Nh\u1eadp s\u1ed1 di \u0111\u1ed9ng..."]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],function(l,n,e){var t=!0,o=l.component;return"ionBlur"===n&&(t=!1!==u["\u0275nov"](l,25)._handleBlurEvent()&&t),"ionChange"===n&&(t=!1!==u["\u0275nov"](l,25)._handleInputEvent(e.target.value)&&t),"ngModelChange"===n&&(t=!1!==(o.customerMobile=e)&&t),t},i.mb,i.r)),u["\u0275did"](24,278528,null,0,d.NgClass,[u.IterableDiffers,u.KeyValueDiffers,u.ElementRef,u.Renderer2],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),u["\u0275did"](25,16384,null,0,a.TextValueAccessor,[u.ElementRef],null,null),u["\u0275prd"](1024,null,r.NG_VALUE_ACCESSOR,function(l){return[l]},[a.TextValueAccessor]),u["\u0275did"](27,671744,null,0,r.NgModel,[[8,null],[8,null],[8,null],[6,r.NG_VALUE_ACCESSOR]],{model:[0,"model"]},{update:"ngModelChange"}),u["\u0275prd"](2048,null,r.NgControl,null,[r.NgModel]),u["\u0275did"](29,16384,null,0,r.NgControlStatus,[[4,r.NgControl]],null,null),u["\u0275did"](30,49152,null,0,a.IonInput,[u.ChangeDetectorRef,u.ElementRef],{placeholder:[0,"placeholder"]},null),(l()(),u["\u0275eld"](31,0,null,null,14,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](32,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](33,0,null,0,2,"ion-col",[["class","input-label"],["col-3",""]],null,null,null,i.db,i.i)),u["\u0275did"](34,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275ted"](-1,0,["\u0110\u1ecba ch\u1ec9"])),(l()(),u["\u0275eld"](36,0,null,0,9,"ion-col",[["col-9",""]],null,null,null,i.db,i.i)),u["\u0275did"](37,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](38,0,null,0,7,"ion-textarea",[["class","exchange-input"],["id","ipAddress"],["placeholder","Nh\u1eadp \u0111\u1ecba ch\u1ec9..."]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],function(l,n,e){var t=!0,o=l.component;return"ionBlur"===n&&(t=!1!==u["\u0275nov"](l,40)._handleBlurEvent()&&t),"ionChange"===n&&(t=!1!==u["\u0275nov"](l,40)._handleInputEvent(e.target.value)&&t),"ngModelChange"===n&&(t=!1!==(o.customerAddress=e)&&t),t},i.Nb,i.S)),u["\u0275did"](39,278528,null,0,d.NgClass,[u.IterableDiffers,u.KeyValueDiffers,u.ElementRef,u.Renderer2],{klass:[0,"klass"],ngClass:[1,"ngClass"]},null),u["\u0275did"](40,16384,null,0,a.TextValueAccessor,[u.ElementRef],null,null),u["\u0275prd"](1024,null,r.NG_VALUE_ACCESSOR,function(l){return[l]},[a.TextValueAccessor]),u["\u0275did"](42,671744,null,0,r.NgModel,[[8,null],[8,null],[8,null],[6,r.NG_VALUE_ACCESSOR]],{model:[0,"model"]},{update:"ngModelChange"}),u["\u0275prd"](2048,null,r.NgControl,null,[r.NgModel]),u["\u0275did"](44,16384,null,0,r.NgControlStatus,[[4,r.NgControl]],null,null),u["\u0275did"](45,49152,null,0,a.IonTextarea,[u.ChangeDetectorRef,u.ElementRef],{placeholder:[0,"placeholder"]},null)],function(l,n){var e=n.component;l(n,9,0,"exchange-input",e.nameValidate?"":"validate-error"),l(n,12,0,e.customerName),l(n,15,0,"Nh\u1eadp h\u1ecd t\xean..."),l(n,24,0,"exchange-input",e.mobileValidate?"":"validate-error"),l(n,27,0,e.customerMobile),l(n,30,0,"Nh\u1eadp s\u1ed1 di \u0111\u1ed9ng..."),l(n,39,0,"exchange-input",e.addressValidate?"":"validate-error"),l(n,42,0,e.customerAddress),l(n,45,0,"Nh\u1eadp \u0111\u1ecba ch\u1ec9...")},function(l,n){l(n,8,0,u["\u0275nov"](n,14).ngClassUntouched,u["\u0275nov"](n,14).ngClassTouched,u["\u0275nov"](n,14).ngClassPristine,u["\u0275nov"](n,14).ngClassDirty,u["\u0275nov"](n,14).ngClassValid,u["\u0275nov"](n,14).ngClassInvalid,u["\u0275nov"](n,14).ngClassPending),l(n,23,0,u["\u0275nov"](n,29).ngClassUntouched,u["\u0275nov"](n,29).ngClassTouched,u["\u0275nov"](n,29).ngClassPristine,u["\u0275nov"](n,29).ngClassDirty,u["\u0275nov"](n,29).ngClassValid,u["\u0275nov"](n,29).ngClassInvalid,u["\u0275nov"](n,29).ngClassPending),l(n,38,0,u["\u0275nov"](n,44).ngClassUntouched,u["\u0275nov"](n,44).ngClassTouched,u["\u0275nov"](n,44).ngClassPristine,u["\u0275nov"](n,44).ngClassDirty,u["\u0275nov"](n,44).ngClassValid,u["\u0275nov"](n,44).ngClassInvalid,u["\u0275nov"](n,44).ngClassPending)})}function R(l){return u["\u0275vid"](0,[(l()(),u["\u0275eld"](0,0,null,null,42,"div",[["class","exchangegift-content"]],null,null,null,null,null)),(l()(),u["\u0275eld"](1,0,null,null,3,"div",[],null,null,null,null,null)),(l()(),u["\u0275eld"](2,0,null,null,2,"label",[["class","item-title"]],null,null,null,null,null)),(l()(),u["\u0275ted"](3,null,["\u0110\u1ed5i "," - "," \u0111i\u1ec3m"])),u["\u0275ppd"](4,2),(l()(),u["\u0275eld"](5,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),u["\u0275ted"](6,null,["Sau khi quy \u0111\u1ed5i, qu\xfd kh\xe1ch c\xf2n "," \u0111i\u1ec3m."])),u["\u0275ppd"](7,2),(l()(),u["\u0275eld"](8,0,null,null,34,"div",[],null,null,null,null,null)),(l()(),u["\u0275eld"](9,0,null,null,33,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](10,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](11,0,null,0,31,"ion-list",[["class","list-location"],["name","case"],["radio-group",""]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"]],function(l,n,e){var u=!0;return"ngModelChange"===n&&(u=!1!==(l.component.location=e)&&u),u},i.tb,i.y)),u["\u0275did"](12,671744,null,0,r.NgModel,[[8,null],[8,null],[8,null],[8,null]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),u["\u0275prd"](2048,null,r.NgControl,null,[r.NgModel]),u["\u0275did"](14,16384,null,0,r.NgControlStatus,[[4,r.NgControl]],null,null),u["\u0275did"](15,49152,null,0,a.IonList,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](16,0,null,0,11,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](17,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](18,0,null,0,9,"ion-col",[["class","no-padding"]],null,[[null,"click"]],function(l,n,e){var u=!0;return"click"===n&&(u=!1!==l.component.radioCheck(1)&&u),u},i.db,i.i)),u["\u0275did"](19,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](20,0,null,0,3,"ion-radio",[["class","rd-location"],["value","1"]],null,[[null,"click"],[null,"ionBlur"],[null,"ionSelect"]],function(l,n,e){var t=!0,o=l.component;return"ionBlur"===n&&(t=!1!==u["\u0275nov"](l,23)._handleBlurEvent()&&t),"ionSelect"===n&&(t=!1!==u["\u0275nov"](l,23)._handleIonSelect(e.target.checked)&&t),"click"===n&&(t=!1!==o.radioCheck(1)&&t),t},i.wb,i.A)),u["\u0275prd"](5120,null,r.NG_VALUE_ACCESSOR,function(l){return[l]},[a.RadioValueAccessor]),u["\u0275did"](22,49152,null,0,a.IonRadio,[u.ChangeDetectorRef,u.ElementRef],{value:[0,"value"]},null),u["\u0275did"](23,16384,null,0,a.RadioValueAccessor,[u.ElementRef],null,null),(l()(),u["\u0275eld"](24,0,null,0,1,"label",[["class","rd-text"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Nh\u1eadn t\u1ea1i v\u0103n ph\xf2ng iVIVU"])),(l()(),u["\u0275and"](16777216,null,0,1,null,C)),u["\u0275did"](27,16384,null,0,d.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),u["\u0275eld"](28,0,null,0,2,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](29,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](30,0,null,0,0,"hr",[["style","width:100%"]],null,null,null,null,null)),(l()(),u["\u0275eld"](31,0,null,0,11,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](32,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](33,0,null,0,9,"ion-col",[["class","no-padding"]],null,[[null,"click"]],function(l,n,e){var u=!0;return"click"===n&&(u=!1!==l.component.radioCheck(2)&&u),u},i.db,i.i)),u["\u0275did"](34,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](35,0,null,0,3,"ion-radio",[["class","rd-location"],["value","2"]],null,[[null,"click"],[null,"ionBlur"],[null,"ionSelect"]],function(l,n,e){var t=!0,o=l.component;return"ionBlur"===n&&(t=!1!==u["\u0275nov"](l,38)._handleBlurEvent()&&t),"ionSelect"===n&&(t=!1!==u["\u0275nov"](l,38)._handleIonSelect(e.target.checked)&&t),"click"===n&&(t=!1!==o.radioCheck(2)&&t),t},i.wb,i.A)),u["\u0275prd"](5120,null,r.NG_VALUE_ACCESSOR,function(l){return[l]},[a.RadioValueAccessor]),u["\u0275did"](37,49152,null,0,a.IonRadio,[u.ChangeDetectorRef,u.ElementRef],{value:[0,"value"]},null),u["\u0275did"](38,16384,null,0,a.RadioValueAccessor,[u.ElementRef],null,null),(l()(),u["\u0275eld"](39,0,null,0,1,"label",[["class","rd-text"]],null,null,null,null,null)),(l()(),u["\u0275ted"](-1,null,["Giao t\u1edbi \u0111\u1ecba ch\u1ec9 c\u1ee7a b\u1ea1n"])),(l()(),u["\u0275and"](16777216,null,0,1,null,v)),u["\u0275did"](42,16384,null,0,d.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null)],function(l,n){var e=n.component;l(n,12,0,"case",e.location),l(n,22,0,"1"),l(n,27,0,1==e.optCheck),l(n,37,0,"2"),l(n,42,0,2==e.optCheck)},function(l,n){var e=n.component,t=e.record.title,o=u["\u0275unv"](n,3,1,l(n,4,0,u["\u0275nov"](n.parent,0),e.record.unitPoint,"1.0"));l(n,3,0,t,o);var i=u["\u0275unv"](n,6,0,l(n,7,0,u["\u0275nov"](n.parent,0),e.userInfoData.point-e.record.unitPoint,"1.0"));l(n,6,0,i),l(n,11,0,u["\u0275nov"](n,14).ngClassUntouched,u["\u0275nov"](n,14).ngClassTouched,u["\u0275nov"](n,14).ngClassPristine,u["\u0275nov"](n,14).ngClassDirty,u["\u0275nov"](n,14).ngClassValid,u["\u0275nov"](n,14).ngClassInvalid,u["\u0275nov"](n,14).ngClassPending)})}function b(l){return u["\u0275vid"](0,[u["\u0275pid"](0,d.DecimalPipe,[u.LOCALE_ID]),(l()(),u["\u0275eld"](1,0,null,null,22,"ion-content",[["padding",""]],null,null,null,i.eb,i.j)),u["\u0275did"](2,49152,null,0,a.IonContent,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](3,0,null,0,6,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](4,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](5,0,null,0,4,"ion-col",[["class","no-padding"]],null,null,null,i.db,i.i)),u["\u0275did"](6,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](7,0,null,0,2,"div",[["class","div-icon-close"]],null,[[null,"click"]],function(l,n,e){var u=!0;return"click"===n&&(u=!1!==l.component.close()&&u),u},null,null)),(l()(),u["\u0275eld"](8,0,null,null,1,"ion-icon",[["name","close"]],null,null,null,i.jb,i.o)),u["\u0275did"](9,49152,null,0,a.IonIcon,[u.ChangeDetectorRef,u.ElementRef],{name:[0,"name"]},null),(l()(),u["\u0275eld"](10,0,null,0,3,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](11,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275and"](16777216,null,0,1,null,R)),u["\u0275did"](13,16384,null,0,d.NgIf,[u.ViewContainerRef,u.TemplateRef],{ngIf:[0,"ngIf"]},null),(l()(),u["\u0275eld"](14,0,null,0,9,"ion-row",[],null,null,null,i.Ab,i.F)),u["\u0275did"](15,49152,null,0,a.IonRow,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](16,0,null,0,3,"ion-col",[["class","no-padding"]],null,null,null,i.db,i.i)),u["\u0275did"](17,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](18,0,null,0,1,"button",[["class","button btn-cancel"],["ion-button",""],["outline",""],["round",""]],null,[[null,"click"]],function(l,n,e){var u=!0;return"click"===n&&(u=!1!==l.component.close()&&u),u},null,null)),(l()(),u["\u0275ted"](-1,null,["H\u1ee7y"])),(l()(),u["\u0275eld"](20,0,null,0,3,"ion-col",[["class","no-padding"]],null,null,null,i.db,i.i)),u["\u0275did"](21,49152,null,0,a.IonCol,[u.ChangeDetectorRef,u.ElementRef],null,null),(l()(),u["\u0275eld"](22,0,null,0,1,"button",[["class","button btn-exchange"],["ion-button",""],["outline",""],["round",""]],[[8,"disabled",0]],[[null,"click"]],function(l,n,e){var u=!0;return"click"===n&&(u=!1!==l.component.exchange()&&u),u},null,null)),(l()(),u["\u0275ted"](-1,null,["\u0110\u1ed5i qu\xe0 ngay"]))],function(l,n){var e=n.component;l(n,9,0,"close"),l(n,13,0,e.record&&e.userInfoData)},function(l,n){l(n,22,0,!n.component.optCheck)})}function E(l){return u["\u0275vid"](0,[(l()(),u["\u0275eld"](0,0,null,null,1,"app-exchangegift",[],null,null,null,b,m)),u["\u0275did"](1,114688,null,0,p,[a.Platform,a.NavController,a.ToastController,u.NgZone,f.b,a.AlertController,u.Renderer,h.b],null,null)],function(l,n){l(n,1,0)},null)}var N=u["\u0275ccf"]("app-exchangegift",p,E,{},{},[]),I=e("iInd");e.d(n,"ExchangeGiftPageModuleNgFactory",function(){return _});var _=u["\u0275cmf"](t,[],function(l){return u["\u0275mod"]([u["\u0275mpd"](512,u.ComponentFactoryResolver,u["\u0275CodegenComponentFactoryResolver"],[[8,[o.a,N]],[3,u.ComponentFactoryResolver],u.NgModuleRef]),u["\u0275mpd"](4608,d.NgLocalization,d.NgLocaleLocalization,[u.LOCALE_ID,[2,d["\u0275angular_packages_common_common_a"]]]),u["\u0275mpd"](4608,r["\u0275angular_packages_forms_forms_j"],r["\u0275angular_packages_forms_forms_j"],[]),u["\u0275mpd"](4608,a.AngularDelegate,a.AngularDelegate,[u.NgZone,u.ApplicationRef]),u["\u0275mpd"](4608,a.ModalController,a.ModalController,[a.AngularDelegate,u.ComponentFactoryResolver,u.Injector,d.DOCUMENT]),u["\u0275mpd"](4608,a.PopoverController,a.PopoverController,[a.AngularDelegate,u.ComponentFactoryResolver,u.Injector,d.DOCUMENT]),u["\u0275mpd"](1073742336,d.CommonModule,d.CommonModule,[]),u["\u0275mpd"](1073742336,r["\u0275angular_packages_forms_forms_bc"],r["\u0275angular_packages_forms_forms_bc"],[]),u["\u0275mpd"](1073742336,r.FormsModule,r.FormsModule,[]),u["\u0275mpd"](1073742336,a.IonicModule,a.IonicModule,[]),u["\u0275mpd"](1073742336,I.p,I.p,[[2,I.v],[2,I.n]]),u["\u0275mpd"](1073742336,t,t,[]),u["\u0275mpd"](1024,I.l,function(){return[[{path:"",component:p}]]},[])])})}}]);