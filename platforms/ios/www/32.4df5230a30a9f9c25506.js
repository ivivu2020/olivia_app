(window.webpackJsonp=window.webpackJsonp||[]).push([[32],{"+nCP":function(l,n,e){"use strict";e.r(n);var t=e("8Y7J");class o{}var a=e("pMnS"),u=e("oBZk"),r=e("ZZ/e"),i=e("KGI4"),s=e("Tcs0"),d=e("D5/n");class c{constructor(l,n,e,t,o){this.platform=l,this.navCtrl=n,this.gf=e,this.activatedRoute=t,this.zone=o,this.urlpath=i.a.urls.baseUrl.urlPost,this.HotelID=this.activatedRoute.snapshot.paramMap.get("id"),this.Name=this.activatedRoute.snapshot.paramMap.get("name"),this.getdata(),this.platform.ready().then(()=>{this.platform.backButton.subscribe(()=>{this.navCtrl.navigateBack("/hoteldetail/"+this.HotelID)})}),e.googleAnalytion("description","load","")}ngOnInit(){}goback(){this.navCtrl.navigateBack("/hoteldetail/"+this.HotelID)}getdata(){var l=this,n={method:"POST",url:l.urlpath+"/mhoteldetail/"+l.HotelID,timeout:18e4,maxAttempts:5,retryDelay:2e3};d(n,function(e,t,o){if(200!=t.statusCode){var a={page:"description",func:"getdata",message:t.statusMessage,content:t.body,type:"warning",param:JSON.stringify(n)};i.a.writeErrorLog(a,t)}if(e&&(e.page="description",e.func="loaddata",e.param=JSON.stringify(n),i.a.writeErrorLog(a,t)),200==t.statusCode){let n=JSON.parse(o);l.zone.run(()=>{l.Name=n.Name,l.FullDescription=n.FullDescription})}})}}var p=e("iInd"),m=t["\u0275crt"]({encapsulation:0,styles:[[".text-title[_ngcontent-%COMP%]{font-size:18px;font-weight:700}"]],data:{}});function g(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,14,"ion-header",[],null,null,null,u.ib,u.n)),t["\u0275did"](1,49152,null,0,r.IonHeader,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](2,0,null,0,12,"ion-row",[["style","padding-top:11px"]],null,null,null,u.Ab,u.F)),t["\u0275did"](3,49152,null,0,r.IonRow,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](4,0,null,0,10,"ion-col",[["style","text-align: center"]],null,null,null,u.db,u.i)),t["\u0275did"](5,49152,null,0,r.IonCol,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](6,0,null,0,8,"div",[["style","align-self: center"]],null,null,null,null,null)),(l()(),t["\u0275eld"](7,0,null,null,1,"div",[["style","position: absolute;height: 48px;width: 48px;align-self: center;"]],null,[[null,"click"]],function(l,n,e){var t=!0;return"click"===n&&(t=!1!==l.component.goback()&&t),t},null,null)),(l()(),t["\u0275eld"](8,0,null,null,0,"img",[["class","header-img-twoline"],["src","./assets/imgs/ios-arrow-round-back.svg"]],null,null,null,null,null)),(l()(),t["\u0275eld"](9,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),t["\u0275eld"](10,0,null,null,1,"label",[["class","text-title"]],null,null,null,null,null)),(l()(),t["\u0275ted"](-1,null,["Th\xf4ng tin"])),(l()(),t["\u0275eld"](12,0,null,null,2,"div",[],null,null,null,null,null)),(l()(),t["\u0275eld"](13,0,null,null,1,"label",[["style","font-size: 11px;color: #828282"]],null,null,null,null,null)),(l()(),t["\u0275ted"](14,null,["",""])),(l()(),t["\u0275eld"](15,0,null,null,3,"ion-content",[],null,null,null,u.eb,u.j)),t["\u0275did"](16,49152,null,0,r.IonContent,[t.ChangeDetectorRef,t.ElementRef],null,null),(l()(),t["\u0275eld"](17,0,null,0,1,"div",[["style","padding: 16px"]],null,null,null,null,null)),(l()(),t["\u0275eld"](18,0,null,null,0,"label",[["text-wrap",""]],[[8,"innerHTML",1]],null,null,null,null))],null,function(l,n){var e=n.component;l(n,14,0,e.Name),l(n,18,0,e.FullDescription)})}function f(l){return t["\u0275vid"](0,[(l()(),t["\u0275eld"](0,0,null,null,1,"app-description",[],null,null,null,g,m)),t["\u0275did"](1,114688,null,0,c,[r.Platform,r.NavController,s.b,p.a,t.NgZone],null,null)],function(l,n){l(n,1,0)},null)}var h=t["\u0275ccf"]("app-description",c,f,{},{},[]),v=e("SVse"),C=e("s7LF");e.d(n,"DescriptionPageModuleNgFactory",function(){return _});var _=t["\u0275cmf"](o,[],function(l){return t["\u0275mod"]([t["\u0275mpd"](512,t.ComponentFactoryResolver,t["\u0275CodegenComponentFactoryResolver"],[[8,[a.a,h]],[3,t.ComponentFactoryResolver],t.NgModuleRef]),t["\u0275mpd"](4608,v.NgLocalization,v.NgLocaleLocalization,[t.LOCALE_ID,[2,v["\u0275angular_packages_common_common_a"]]]),t["\u0275mpd"](4608,C["\u0275angular_packages_forms_forms_j"],C["\u0275angular_packages_forms_forms_j"],[]),t["\u0275mpd"](4608,r.AngularDelegate,r.AngularDelegate,[t.NgZone,t.ApplicationRef]),t["\u0275mpd"](4608,r.ModalController,r.ModalController,[r.AngularDelegate,t.ComponentFactoryResolver,t.Injector,v.DOCUMENT]),t["\u0275mpd"](4608,r.PopoverController,r.PopoverController,[r.AngularDelegate,t.ComponentFactoryResolver,t.Injector,v.DOCUMENT]),t["\u0275mpd"](1073742336,v.CommonModule,v.CommonModule,[]),t["\u0275mpd"](1073742336,C["\u0275angular_packages_forms_forms_bc"],C["\u0275angular_packages_forms_forms_bc"],[]),t["\u0275mpd"](1073742336,C.FormsModule,C.FormsModule,[]),t["\u0275mpd"](1073742336,r.IonicModule,r.IonicModule,[]),t["\u0275mpd"](1073742336,p.p,p.p,[[2,p.v],[2,p.n]]),t["\u0275mpd"](1073742336,o,o,[]),t["\u0275mpd"](1024,p.l,function(){return[[{path:"",component:c}]]},[])])})}}]);