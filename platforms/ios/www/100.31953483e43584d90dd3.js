(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{xHWh:function(l,n,e){"use strict";e.r(n);var t=e("8Y7J");class o{}var a=e("pMnS"),u=e("oBZk"),r=e("ZZ/e"),i=e("SVse"),d=e("D5/n"),s=e("KGI4"),c=e("Tcs0");class p{constructor(l,n,e,t,o,a){this.platform=l,this.navCtrl=n,this.zone=e,this.storage=t,this.gf=o,this.ActivatedRoute=a,this.platform.ready().then(()=>{this.platform.backButton.subscribe(()=>{this.navCtrl.back()})}),o.googleAnalytion("wearther","load","")}ngOnInit(){this.CityName=this.ActivatedRoute.snapshot.paramMap.get("cityName"),this.storage.get("weatherInfo").then(l=>{l?this.weatherData=l:this.fetWeatherData()})}fetWeatherData(){let l=this;l.CountryCode="VN";var n={method:"GET",url:s.a.urls.baseUrl.urlMobile+"/api/Dashboard/GetWeatherByCityAndCountryCode?cityName="+l.CityName+"&countryCode="+l.CountryCode,timeout:1e4,maxAttempts:5,retryDelay:2e3,headers:{},json:!0};d(n,function(e,t,o){if(200!=t.statusCode){var a={page:"weather",func:"fetWeatherData",message:t.statusMessage,content:t.body,type:"warning",param:JSON.stringify(n)};s.a.writeErrorLog(a,t)}if(e)throw e.page="weather",e.func="fetWeatherData",e.param=JSON.stringify(n),s.a.writeErrorLog(e,t),new Error(e);l.zone.run(()=>{let n=o.data;l.weatherData=n,l.storage.set("weatherInfo",n)})})}goback(){this.navCtrl.back()}}var g=e("xgBC"),m=e("iInd"),f=t["\u0275crt"]({encapsulation:0,styles:[[".header-title[_ngcontent-%COMP%]{padding-top:10px;text-align:center;font-size:20px;font-weight:700;right:6%}.header-icon[_ngcontent-%COMP%]{width:48px;height:48px;padding-top:8px;text-align:center}.weather-content[_ngcontent-%COMP%]{padding:16px 16px 16px 11px}.weather-datestr[_ngcontent-%COMP%]{font-size:12px;color:#4f4f4f;padding:0}.weather-tempstr[_ngcontent-%COMP%]{font-size:36px}.weather-img[_ngcontent-%COMP%]{align-self:center;padding-top:12px}.list-md[_ngcontent-%COMP%]{margin:0}hr[_ngcontent-%COMP%]{border-bottom:1px solid #cdcdcd;margin-left:5px;opacity:.5}"]],data:{}});function h(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,13,"ion-list",[],null,null,null,u.tb,u.y)),t["\u0275did"](1,49152,null,0,r.IonList,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](2,0,null,0,10,"ion-row",[],null,null,null,u.Ab,u.F)),t["\u0275did"](3,49152,null,0,r.IonRow,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](4,0,null,0,5,"ion-col",[["size","10"]],null,null,null,u.db,u.i)),t["\u0275did"](5,49152,null,0,r.IonCol,[t.ChangeDetectorRef,t.ElementRef],{size:[0,"size"]},null),(l()(),t["\u0275eld"](6,0,null,0,1,"div",[["class","weather-datestr"]],null,null,null,null,null)),(l()(),t["\u0275ted"](7,null,["",""])),(l()(),t["\u0275eld"](8,0,null,0,1,"div",[["class","weather-tempstr"]],null,null,null,null,null)),(l()(),t["\u0275ted"](9,null,["",""])),(l()(),t["\u0275eld"](10,0,null,0,2,"ion-col",[["class","weather-img"],["size","2"]],null,null,null,u.db,u.i)),t["\u0275did"](11,49152,null,0,r.IonCol,[t.ChangeDetectorRef,t.ElementRef],{size:[0,"size"]},null),(l()(),t["\u0275eld"](12,0,null,0,0,"img",[],[[8,"src",4]],null,null,null,null)),(l()(),t["\u0275eld"](13,0,null,0,0,"hr",[],null,null,null,null,null))],function(l,n){l(n,5,0,"10"),l(n,11,0,"2")},function(l,n){l(n,7,0,n.context.$implicit.datetimeStr),l(n,9,0,n.context.$implicit.tempStr),l(n,12,0,t["\u0275inlineInterpolate"](1,"",n.context.$implicit.weather.iconUrl,""))})}function C(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,11,"ion-header",[],null,null,null,u.ib,u.n)),t["\u0275did"](1,49152,null,0,r.IonHeader,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](2,0,null,0,9,"ion-row",[],null,null,null,u.Ab,u.F)),t["\u0275did"](3,49152,null,0,r.IonRow,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](4,0,null,0,7,"ion-col",[["style","text-align: center;height: 48px;"]],null,null,null,u.db,u.i)),t["\u0275did"](5,49152,null,0,r.IonCol,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](6,0,null,0,5,"div",[["style","align-self: center"]],null,null,null,null,null)),(l()(),t["\u0275eld"](7,0,null,null,1,"div",[["style","position: absolute;height: 48px;width: 48px;align-self: center;"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.goback()&&t),t},null,null)),(l()(),t["\u0275eld"](8,0,null,null,0,"img",[["src","./assets/imgs/ios-arrow-round-back.svg"],["style","height: 48px; padding: 8px;margin-top: 0px;margin-left:-14px"]],null,null,null,null,null)),(l()(),t["\u0275eld"](9,0,null,null,2,"div",[["style","padding-top: 11px;font-size: 20px;font-weight: bold;"]],null,null,null,null,null)),(l()(),t["\u0275eld"](10,0,null,null,1,"label",[["class","text-title"]],null,null,null,null,null)),(l()(),t["\u0275ted"](11,null,["Th\u1eddi ti\u1ebft ",""])),(l()(),t["\u0275eld"](12,0,null,null,4,"ion-content",[],null,null,null,u.eb,u.j)),t["\u0275did"](13,49152,null,0,r.IonContent,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](14,0,null,0,2,"div",[["class","weather-content"]],null,null,null,null,null)),(l()(),t["\u0275and"](16777216,null,null,1,null,h)),t["\u0275did"](16,278528,null,0,i.NgForOf,[t.ViewContainerRef,t.TemplateRef,t.IterableDiffers],{ngForOf:[0,"ngForOf"]},null)],function(l,n){l(n,16,0,n.component.weatherData)},function(l,n){l(n,11,0,n.component.CityName)})}function w(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,1,"app-weather",[],null,null,null,C,f)),t["\u0275did"](1,114688,null,0,p,[r.Platform,r.NavController,t.NgZone,g.b,c.b,m.a],null,null)],function(l,n){l(n,1,0)},null)}var x=t["\u0275ccf"]("app-weather",p,w,{},{},[]),y=e("s7LF");e.d(n,"WeatherPageModuleNgFactory",function(){return b});var b=t["\u0275cmf"](o,[],function(l){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[a.a,x]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,i.NgLocalization,i.NgLocaleLocalization,[t.LOCALE_ID,[2,i["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,y["\u0275angular_packages_forms_forms_j"],y["\u0275angular_packages_forms_forms_j"],[]),t["\u0275mpd"](4608,r.AngularDelegate,r.AngularDelegate,[t.NgZone,t.ApplicationRef]),t["\u0275mpd"](4608,r.ModalController,r.ModalController,[r.AngularDelegate,t.ComponentFactoryResolver,t.Injector,i.DOCUMENT]),t["\u0275mpd"](4608,r.PopoverController,r.PopoverController,[r.AngularDelegate,t.ComponentFactoryResolver,t.Injector,i.DOCUMENT]),t["\u0275mpd"](1073742336,i.CommonModule,i.CommonModule,[]),t["\u0275mpd"](1073742336,y["\u0275angular_packages_forms_forms_bc"],y["\u0275angular_packages_forms_forms_bc"],[]),t["\u0275mpd"](1073742336,y.FormsModule,y.FormsModule,[]),t["\u0275mpd"](1073742336,r.IonicModule,r.IonicModule,[]),t["\u0275mpd"](1073742336,m.p,m.p,[[2,m.v],[2,m.n]]),t["\u0275mpd"](1073742336,o,o,[]),t["\u0275mpd"](1024,m.l,function(){return[[{path:"",component:p}]]},[])])})}}]);