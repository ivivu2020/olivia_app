(window.webpackJsonp=window.webpackJsonp||[]).push([[68],{qq66:function(n,l,e){"use strict";e.r(l);var t=e("8Y7J");class o{}var r=e("pMnS"),a=e("oBZk"),i=e("ZZ/e"),u=e("s7LF"),s=e("mrSG"),d=e("9B/o"),g=e("Tcs0"),c=e("KGI4"),p=e("D5/n"),m=e("BOF4"),h=e.n(m),f=e("Zr1d"),C=e("8riC"),v=e("YCZo"),b=e("9Ap/");class k{constructor(n,l,e,t,o,r,a,i,s,d,g,c,p){this.keyboard=n,this.navCtrl=l,this.menuCtrl=e,this.formBuilder=t,this.iab=o,this.platform=r,this.toastCtrl=a,this.storage=i,this.gf=s,this.zone=d,this.appVersion=g,this.valueGlobal=c,this.fcm=p,this.passwordType="password",this.passwordIcon="eye-off",this.regData=this.formBuilder.group({emailorphone:["",u.Validators.required],password:["",u.Validators.required],ischeck:["",u.Validators.required]})}ngOnInit(){}hideShowPassword(){this.zone.run(()=>{this.passwordType="text"===this.passwordType?"password":"text",this.passwordIcon="eye-off"===this.passwordIcon?"eye":"eye-off"})}ionViewDidLoad(){this.menuCtrl.enable(!1)}register(){var n;this.regData.value.emailorphone?this.validateEmail(this.regData.value.emailorphone)?this.regData.value.password?(n=this.regData.value.password.length)>=6?this.funcregister():this.presentToast("M\u1eadt kh\u1ea9u ph\u1ea3i \xedt nh\u1ea5t 6 k\xfd t\u1ef1"):this.presentToast("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u"):this.phonenumber(this.regData.value.emailorphone)?(n=this.regData.value.password.length)>0?n>=6?this.postapiRegisterByPhone():this.presentToast("M\u1eadt kh\u1ea9u ph\u1ea3i \xedt nh\u1ea5t 6 k\xfd t\u1ef1"):this.presentToast("Vui l\xf2ng nh\u1eadp m\u1eadt kh\u1ea9u"):this.presentToast("\u0110\u1ecbnh d\u1ea1ng email kh\xf4ng \u0111\xfang ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i kh\xf4ng ch\xednh x\xe1c"):this.presentToast("Vui l\xf2ng nh\u1eadp email ho\u1eb7c s\u1ed1 \u0111i\u1ec7n tho\u1ea1i")}postapiRegisterByPhone(){var n=this;p({method:"POST",url:c.a.urls.baseUrl.urlMobile+"/api/Account/RegisterByPhone",headers:{"cache-control":"no-cache","content-type":"application/json"},body:{phoneNumber:this.regData.value.emailorphone,password:this.regData.value.password,password2:this.regData.value.password},json:!0},function(l,e,t){if(l)throw new Error(l);t&&(t.result?(n.valueGlobal.phone=n.regData.value.emailorphone,n.navCtrl.navigateForward("registerverify")):alert(t.msg))})}validateEmail(n){return/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(n).toLowerCase())}funcregister(){var n=this,l={method:"POST",url:c.a.urls.baseUrl.urlMobile+"/api/Account/Register",timeout:1e4,maxAttempts:5,retryDelay:2e3,headers:{"cache-control":"no-cache","content-type":"application/json"},body:{email:this.regData.value.emailorphone,password:this.regData.value.password,password2:this.regData.value.password},json:!0};p(l,function(e,t,o){if(e&&(e.page="register",e.func="funcregister",e.param=JSON.stringify(l),c.a.writeErrorLog(e,t)),200!=t.statusCode){var r={page:"register",func:"funcregister",message:t.statusMessage,content:t.body,type:"warning",param:JSON.stringify(l)};c.a.writeErrorLog(r,t)}console.log(o.result),o.result?(alert(o.msg),n.logintk()):alert(o.msg)})}logintk(){var n=this,l={method:"POST",url:c.a.urls.baseUrl.urlMobile+"/api/Account/Login",timeout:1e4,maxAttempts:5,retryDelay:2e3,headers:{"cache-control":"no-cache","content-type":"application/json"},body:{emailOrPhone:this.regData.value.email,password:this.regData.value.password,rememberMe:!0},json:!0};p(l,function(e,t,o){if(e&&(e.page="register",e.func="logintk",e.param=JSON.stringify(l),c.a.writeErrorLog(e,t)),o.auth_token){var r=h()(o.auth_token);n.zone.run(()=>{n.storage.set("email",r.email),n.storage.set("auth_token",o.auth_token),n.storage.set("username",r.fullname),Array.isArray(r.jti)?n.storage.set("jti",r.jti[0]):n.storage.set("jti",r.jti),n.storage.set("point",r.point),n.deviceToken&&n.gf.pushTokenAndMemberID(o.auth_token,n.deviceToken,n.appversion),n.navCtrl.navigateRoot("/")},10)}}),this.gf.googleAnalytion("loginusername","login","")}ionViewDidEnter(){setTimeout(()=>{this.input.setFocus()},150),this.keyboard.show()}goback(){this.navCtrl.back()}ionViewWillEnter(){this.platform.ready().then(()=>{this.fcm.getToken().then(n=>{console.log(n),this.deviceToken=n})}),this.appVersion.getVersionNumber().then(n=>{this.appversion=n})}presentToast(n){return s.__awaiter(this,void 0,void 0,function*(){(yield this.toastCtrl.create({message:n,duration:3e3,position:"top"})).present()})}phonenumber(n){return!!Number(n)&&!!n&&10==n.length}}var _=e("xgBC"),w=t["\u0275crt"]({encapsulation:0,styles:[["ion-item.item-ios[_ngcontent-%COMP%]{padding-left:0}.passwordIcon[_ngcontent-%COMP%]{font-size:2rem!important;position:relative!important;top:15px!important;margin:0 auto!important}.center[_ngcontent-%COMP%]{padding:57px 0 0;text-align:center;height:100%;background-image:url(backgroundnew.6a4f60938350633e5b43.png)}ion-item[_ngcontent-%COMP%]{--background:initial;--border-color:#fff}.text-button[_ngcontent-%COMP%]{text-align:center;width:50%;font-size:16px;color:#fff}.button-outline[_ngcontent-%COMP%]{--border-color:#ffffff;--border-width:1px;--border-style:solid}.div-go-back[_ngcontent-%COMP%]{position:absolute;top:16px;color:#fff;width:48px;height:48px}.text-color[_ngcontent-%COMP%]{color:#fff}.passwordIcon[_ngcontent-c0][_ngcontent-%COMP%]{font-size:2rem!important;position:relative!important;top:10px!important;margin:0 auto!important}.ion-item[_ngcontent-%COMP%]{--padding-start:0px;--inner-border-width:0 0 0px 0;width:108%;margin-top:5px}"]],data:{}});function y(n){return t["\u0275vid"](0,[t["\u0275qud"](402653184,1,{input:0}),(n()(),t["\u0275eld"](1,0,null,null,65,"div",[["class","center"]],null,null,null,null,null)),(n()(),t["\u0275eld"](2,0,null,null,5,"div",[["style","margin-top: -20px"]],null,null,null,null,null)),(n()(),t["\u0275eld"](3,0,null,null,2,"ion-card-title",[["style","text-align: center"]],null,null,null,a.Z,a.f)),t["\u0275did"](4,49152,null,0,i.IonCardTitle,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](5,0,null,0,0,"img",[["src","./assets/logo/logo.svg"],["style","height: 90px;"]],null,null,null,null,null)),(n()(),t["\u0275eld"](6,0,null,null,1,"div",[["class","div-go-back"]],null,[[null,"click"]],function(n,l,e){var t=!0;return"click"===l&&(t=!1!==n.component.goback()&&t),t},null,null)),(n()(),t["\u0275eld"](7,0,null,null,0,"img",[["src","./assets/imgs/ios-arrow-round-back-white.svg"],["style","margin-top: 6px;height: 36px;"]],null,null,null,null,null)),(n()(),t["\u0275eld"](8,0,null,null,58,"ion-grid",[["style","margin-top: -20px"]],null,null,null,a.hb,a.m)),t["\u0275did"](9,49152,null,0,i.IonGrid,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](10,0,null,0,56,"ion-row",[["justify-content-around",""]],null,null,null,a.Ab,a.F)),t["\u0275did"](11,49152,null,0,i.IonRow,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](12,0,null,0,54,"ion-col",[["align-self-center",""],["col-lg-4",""],["col-md-6",""],["col-sm-6",""],["col-xl-3",""]],null,null,null,a.db,a.i)),t["\u0275did"](13,49152,null,0,i.IonCol,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](14,0,null,0,48,"form",[["novalidate",""],["padding","true"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngSubmit"],[null,"submit"],[null,"reset"]],function(n,l,e){var o=!0,r=n.component;return"submit"===l&&(o=!1!==t["\u0275nov"](n,16).onSubmit(e)&&o),"reset"===l&&(o=!1!==t["\u0275nov"](n,16).onReset()&&o),"ngSubmit"===l&&(o=!1!==r.register()&&o),o},null,null)),t["\u0275did"](15,16384,null,0,u["\u0275angular_packages_forms_forms_bh"],[],null,null),t["\u0275did"](16,540672,null,0,u.FormGroupDirective,[[8,null],[8,null]],{form:[0,"form"]},{ngSubmit:"ngSubmit"}),t["\u0275prd"](2048,null,u.ControlContainer,null,[u.FormGroupDirective]),t["\u0275did"](18,16384,null,0,u.NgControlStatusGroup,[[4,u.ControlContainer]],null,null),(n()(),t["\u0275eld"](19,0,null,null,11,"ion-item",[["style","--padding-start: 0px"]],null,null,null,a.rb,a.s)),t["\u0275did"](20,49152,null,0,i.IonItem,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](21,0,null,0,2,"ion-label",[["position","stacked"],["style","color: white"]],null,null,null,a.sb,a.x)),t["\u0275did"](22,49152,null,0,i.IonLabel,[t.ChangeDetectorRef,t.ElementRef],{position:[0,"position"]},null),(n()(),t["\u0275ted"](-1,0,["Email/ S\u1ed1 di \u0111\u1ed9ng"])),(n()(),t["\u0275eld"](24,0,null,0,6,"ion-input",[["class","text-color"],["clearInput",""],["formControlName","emailorphone"],["type","text"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ionBlur"],[null,"ionChange"]],function(n,l,e){var o=!0;return"ionBlur"===l&&(o=!1!==t["\u0275nov"](n,25)._handleBlurEvent()&&o),"ionChange"===l&&(o=!1!==t["\u0275nov"](n,25)._handleInputEvent(e.target.value)&&o),o},a.mb,a.r)),t["\u0275did"](25,16384,null,0,i.TextValueAccessor,[t.ElementRef],null,null),t["\u0275prd"](1024,null,u.NG_VALUE_ACCESSOR,function(n){return[n]},[i.TextValueAccessor]),t["\u0275did"](27,671744,null,0,u.FormControlName,[[3,u.ControlContainer],[8,null],[8,null],[6,u.NG_VALUE_ACCESSOR],[2,u["\u0275angular_packages_forms_forms_k"]]],{name:[0,"name"]},null),t["\u0275prd"](2048,null,u.NgControl,null,[u.FormControlName]),t["\u0275did"](29,16384,null,0,u.NgControlStatus,[[4,u.NgControl]],null,null),t["\u0275did"](30,49152,[[1,4],["user",4]],0,i.IonInput,[t.ChangeDetectorRef,t.ElementRef],{clearInput:[0,"clearInput"],type:[1,"type"]},null),(n()(),t["\u0275eld"](31,0,null,null,13,"ion-item",[["style","--padding-start: 0px"]],null,null,null,a.rb,a.s)),t["\u0275did"](32,49152,null,0,i.IonItem,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](33,0,null,0,2,"ion-label",[["position","stacked"],["style","color: white"]],null,null,null,a.sb,a.x)),t["\u0275did"](34,49152,null,0,i.IonLabel,[t.ChangeDetectorRef,t.ElementRef],{position:[0,"position"]},null),(n()(),t["\u0275ted"](-1,0,["M\u1eadt kh\u1ea9u"])),(n()(),t["\u0275eld"](36,0,null,0,6,"ion-input",[["class","text-color"],["clearOnEdit","false"],["formControlName","password"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ionBlur"],[null,"ionChange"]],function(n,l,e){var o=!0;return"ionBlur"===l&&(o=!1!==t["\u0275nov"](n,37)._handleBlurEvent()&&o),"ionChange"===l&&(o=!1!==t["\u0275nov"](n,37)._handleInputEvent(e.target.value)&&o),o},a.mb,a.r)),t["\u0275did"](37,16384,null,0,i.TextValueAccessor,[t.ElementRef],null,null),t["\u0275prd"](1024,null,u.NG_VALUE_ACCESSOR,function(n){return[n]},[i.TextValueAccessor]),t["\u0275did"](39,671744,null,0,u.FormControlName,[[3,u.ControlContainer],[8,null],[8,null],[6,u.NG_VALUE_ACCESSOR],[2,u["\u0275angular_packages_forms_forms_k"]]],{name:[0,"name"]},null),t["\u0275prd"](2048,null,u.NgControl,null,[u.FormControlName]),t["\u0275did"](41,16384,null,0,u.NgControlStatus,[[4,u.NgControl]],null,null),t["\u0275did"](42,49152,null,0,i.IonInput,[t.ChangeDetectorRef,t.ElementRef],{clearOnEdit:[0,"clearOnEdit"],type:[1,"type"]},null),(n()(),t["\u0275eld"](43,0,null,0,1,"ion-icon",[["class","passwordIcon"],["slot","end"],["style","color: whitesmoke"]],null,[[null,"click"]],function(n,l,e){var t=!0;return"click"===l&&(t=!1!==n.component.hideShowPassword()&&t),t},a.jb,a.o)),t["\u0275did"](44,49152,null,0,i.IonIcon,[t.ChangeDetectorRef,t.ElementRef],{name:[0,"name"]},null),(n()(),t["\u0275eld"](45,0,null,null,17,"ion-row",[],null,null,null,a.Ab,a.F)),t["\u0275did"](46,49152,null,0,i.IonRow,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275eld"](47,0,null,0,8,"ion-col",[["size","1"]],null,null,null,a.db,a.i)),t["\u0275did"](48,49152,null,0,i.IonCol,[t.ChangeDetectorRef,t.ElementRef],{size:[0,"size"]},null),(n()(),t["\u0275eld"](49,0,null,0,6,"ion-checkbox",[["color","secondary"],["formControlName","ischeck"],["style","margin-top: 2px"]],[[2,"ng-untouched",null],[2,"ng-touched",null],[2,"ng-pristine",null],[2,"ng-dirty",null],[2,"ng-valid",null],[2,"ng-invalid",null],[2,"ng-pending",null]],[[null,"ngModelChange"],[null,"ionBlur"],[null,"ionChange"]],function(n,l,e){var o=!0,r=n.component;return"ionBlur"===l&&(o=!1!==t["\u0275nov"](n,50)._handleBlurEvent()&&o),"ionChange"===l&&(o=!1!==t["\u0275nov"](n,50)._handleIonChange(e.target.checked)&&o),"ngModelChange"===l&&(o=!1!==(r.ischeck=e)&&o),o},a.bb,a.g)),t["\u0275did"](50,16384,null,0,i.BooleanValueAccessor,[t.ElementRef],null,null),t["\u0275prd"](1024,null,u.NG_VALUE_ACCESSOR,function(n){return[n]},[i.BooleanValueAccessor]),t["\u0275did"](52,671744,null,0,u.FormControlName,[[3,u.ControlContainer],[8,null],[8,null],[6,u.NG_VALUE_ACCESSOR],[2,u["\u0275angular_packages_forms_forms_k"]]],{name:[0,"name"],model:[1,"model"]},{update:"ngModelChange"}),t["\u0275prd"](2048,null,u.NgControl,null,[u.FormControlName]),t["\u0275did"](54,16384,null,0,u.NgControlStatus,[[4,u.NgControl]],null,null),t["\u0275did"](55,49152,null,0,i.IonCheckbox,[t.ChangeDetectorRef,t.ElementRef],{color:[0,"color"]},null),(n()(),t["\u0275eld"](56,0,null,0,6,"ion-col",[["size","11"]],null,null,null,a.db,a.i)),t["\u0275did"](57,49152,null,0,i.IonCol,[t.ChangeDetectorRef,t.ElementRef],{size:[0,"size"]},null),(n()(),t["\u0275eld"](58,0,null,0,4,"ion-label",[["style","color: white;margin: 1px 10px 0px 5px"],["text-wrap",""]],null,null,null,a.sb,a.x)),t["\u0275did"](59,49152,null,0,i.IonLabel,[t.ChangeDetectorRef,t.ElementRef],null,null),(n()(),t["\u0275ted"](-1,0,["B\u1eb1ng vi\u1ec7c tham gia iVIVU, t\xf4i \u0111\u1ed3ng \xfd t\u1ea5t c\u1ea3 "])),(n()(),t["\u0275eld"](61,0,null,0,1,"a",[["href","https://www.ivivu.com/dieu-kien-dieu-khoan#_ga=2.57476458.1764320674.1515981153-1221826856.1508314634&_gac=1.220489260.1514193346.EAIaIQobChMIt66T4Omk2AIV0UQrCh1dIwosEAEYASAAEgI48PD_BwE"],["style","color: #26bed6"],["target","_blank"]],null,null,null,null,null)),(n()(),t["\u0275ted"](-1,null,["\u0111i\u1ec1u ki\u1ec7n & \u0111i\u1ec1u kho\u1ea3n"])),(n()(),t["\u0275eld"](63,0,null,0,3,"div",[["style","text-align:center;margin-top: -10px;"]],null,null,null,null,null)),(n()(),t["\u0275eld"](64,0,null,null,2,"ion-button",[["class","button text-button"],["fill","outline"],["shape","round"],["style","text-transform: none;font-weight: 400"]],null,[[null,"click"]],function(n,l,e){var t=!0,o=n.component;return"click"===l&&(t=!1!==o.register()&&t),"click"===l&&(t=!1!==o.logintk()&&t),t},a.X,a.c)),t["\u0275did"](65,49152,null,0,i.IonButton,[t.ChangeDetectorRef,t.ElementRef],{disabled:[0,"disabled"],fill:[1,"fill"],shape:[2,"shape"]},null),(n()(),t["\u0275ted"](-1,0,["\u0110\u0103ng k\xfd"]))],function(n,l){var e=l.component;n(l,16,0,e.regData),n(l,22,0,"stacked"),n(l,27,0,"emailorphone"),n(l,30,0,"","text"),n(l,34,0,"stacked"),n(l,39,0,"password"),n(l,42,0,"false",e.passwordType),n(l,44,0,e.passwordIcon),n(l,48,0,"1"),n(l,52,0,"ischeck",e.ischeck),n(l,55,0,"secondary"),n(l,57,0,"11"),n(l,65,0,!e.ischeck,"outline","round")},function(n,l){n(l,14,0,t["\u0275nov"](l,18).ngClassUntouched,t["\u0275nov"](l,18).ngClassTouched,t["\u0275nov"](l,18).ngClassPristine,t["\u0275nov"](l,18).ngClassDirty,t["\u0275nov"](l,18).ngClassValid,t["\u0275nov"](l,18).ngClassInvalid,t["\u0275nov"](l,18).ngClassPending),n(l,24,0,t["\u0275nov"](l,29).ngClassUntouched,t["\u0275nov"](l,29).ngClassTouched,t["\u0275nov"](l,29).ngClassPristine,t["\u0275nov"](l,29).ngClassDirty,t["\u0275nov"](l,29).ngClassValid,t["\u0275nov"](l,29).ngClassInvalid,t["\u0275nov"](l,29).ngClassPending),n(l,36,0,t["\u0275nov"](l,41).ngClassUntouched,t["\u0275nov"](l,41).ngClassTouched,t["\u0275nov"](l,41).ngClassPristine,t["\u0275nov"](l,41).ngClassDirty,t["\u0275nov"](l,41).ngClassValid,t["\u0275nov"](l,41).ngClassInvalid,t["\u0275nov"](l,41).ngClassPending),n(l,49,0,t["\u0275nov"](l,54).ngClassUntouched,t["\u0275nov"](l,54).ngClassTouched,t["\u0275nov"](l,54).ngClassPristine,t["\u0275nov"](l,54).ngClassDirty,t["\u0275nov"](l,54).ngClassValid,t["\u0275nov"](l,54).ngClassInvalid,t["\u0275nov"](l,54).ngClassPending)})}function R(n){return t["\u0275vid"](0,[(n()(),t["\u0275eld"](0,0,null,null,1,"app-register",[],null,null,null,y,w)),t["\u0275did"](1,114688,null,0,k,[f.a,i.NavController,i.MenuController,u.FormBuilder,d.a,i.Platform,i.ToastController,_.b,g.b,t.NgZone,C.a,b.f,v.a],null,null)],function(n,l){n(l,1,0)},null)}var E=t["\u0275ccf"]("app-register",k,R,{},{},[]),I=e("SVse"),D=e("iInd");e.d(l,"RegisterPageModuleNgFactory",function(){return x});var x=t["\u0275cmf"](o,[],function(n){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[r.a,E]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,I.NgLocalization,I.NgLocaleLocalization,[t.LOCALE_ID,[2,I["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,u["\u0275angular_packages_forms_forms_j"],u["\u0275angular_packages_forms_forms_j"],[]),t["\u0275mpd"](4608,i.AngularDelegate,i.AngularDelegate,[t.NgZone,t.ApplicationRef]),t["\u0275mpd"](4608,i.ModalController,i.ModalController,[i.AngularDelegate,t.ComponentFactoryResolver,t.Injector,I.DOCUMENT]),t["\u0275mpd"](4608,i.PopoverController,i.PopoverController,[i.AngularDelegate,t.ComponentFactoryResolver,t.Injector,I.DOCUMENT]),t["\u0275mpd"](4608,u.FormBuilder,u.FormBuilder,[]),t["\u0275mpd"](1073742336,I.CommonModule,I.CommonModule,[]),t["\u0275mpd"](1073742336,u["\u0275angular_packages_forms_forms_bc"],u["\u0275angular_packages_forms_forms_bc"],[]),t["\u0275mpd"](1073742336,u.FormsModule,u.FormsModule,[]),t["\u0275mpd"](1073742336,i.IonicModule,i.IonicModule,[]),t["\u0275mpd"](1073742336,u.ReactiveFormsModule,u.ReactiveFormsModule,[]),t["\u0275mpd"](1073742336,D.p,D.p,[[2,D.v],[2,D.n]]),t["\u0275mpd"](1073742336,o,o,[]),t["\u0275mpd"](1024,D.l,function(){return[[{path:"",component:k}]]},[])])})}}]);