(window.webpackJsonp=window.webpackJsonp||[]).push([[75],{"Wv/5":function(n,e,i){"use strict";i.r(e);var l=i("8Y7J");class t{}var c=i("pMnS"),s=i("oBZk"),h=i("ZZ/e"),o=i("SVse"),a=i("mrSG"),u=i("9Ap/"),r=i("D5/n"),d=i("KGI4"),k=i("Tcs0"),g=i("BOF4"),b=i.n(g);class m{constructor(n,e,i,l,t,c,s,h,o,a){this.platform=n,this.Roomif=e,this.zone=i,this.storage=l,this.navCtrl=t,this.booking=c,this.loadingCtrl=s,this.gf=h,this.toastCtrl=o,this.bookcombo=a,this.ischeckvcbactive=!0,this.isenabled=!0,this.ischeckvietin=!0,this.ischeckacb=!0,this.ischecktechcom=!0,this.ischeckdonga=!0,this.ischeckagri=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischecktextend=!1,this.ischecktext=!0,this.ischeckscb=!0,this.text="",this.isenabledbtn=!1,this.ischeckvcbactive=!0,this.ischeckhd=!0,this.paymentMethod="42",this.text="Ng\xe2n h\xe0ng Th\u01b0\u01a1ng M\u1ea1i C\u1ed5 Ph\u1ea7n Ngo\u1ea1i Th\u01b0\u01a1ng Vi\u1ec7t Nam (VCB)<br>Chi nh\xe1nh Tp. H\u1ed3 Ch\xed Minh<br>S\u1ed1 TK: <b>007 1000 895 230</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b></li>",this.room=e.arrroom,this.jsonroom=e.jsonroom,h.googleAnalytion("roompaymentbank","load","")}ngOnInit(){}ionViewWillEnter(){this.storage.get("auth_token").then(n=>{this.auth_token=n})}acb(){this.zone.run(()=>{this.ischeckacbactive=!0,this.ischeckacb=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckdongaactive=!1,this.ischeckbidvactive=!1,this.ischecksacomactive=!1,this.ischeckagriactive=!1,this.ischeckvcbactive=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckdonga=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischeckagri=!0,this.ischeckvcb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.text="Ng\xe2n h\xe0ng \xc1 Ch\xe2u (ACB)<br>Chi nh\xe1nh Tp. H\u1ed3 Ch\xed Minh<br>S\u1ed1 TK: <b>190862589</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b></li>",this.ischecktextend=!1,this.ischecktext=!0,this.isenabledbtn=!1,this.paymentMethod="41"})}vcb(){this.zone.run(()=>{this.ischeckvcbactive=!0,this.ischeckvcb=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckdongaactive=!1,this.ischeckbidvactive=!1,this.ischecksacomactive=!1,this.ischeckagriactive=!1,this.ischeckacbactive=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckdonga=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischeckagri=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.ischecktextend=!1,this.ischecktext=!0,this.text="Ng\xe2n h\xe0ng Th\u01b0\u01a1ng M\u1ea1i C\u1ed5 Ph\u1ea7n Ngo\u1ea1i Th\u01b0\u01a1ng Vi\u1ec7t Nam (VCB)<br>Chi nh\xe1nh Tp. H\u1ed3 Ch\xed Minh<br>S\u1ed1 TK: <b>007 1000 895 230</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b></li>",this.isenabledbtn=!1,this.paymentMethod="42"})}vietin(){this.zone.run(()=>{this.ischeckvietinactive=!0,this.ischeckvcbactive=!1,this.ischecktechcomactive=!1,this.ischeckdongaactive=!1,this.ischeckbidvactive=!1,this.ischecksacomactive=!1,this.ischeckagriactive=!1,this.ischeckacbactive=!1,this.ischeckvietin=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischecktechcom=!0,this.ischeckdonga=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischeckagri=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.text="NH VietinBank<br>Chi Nh\xe1nh 03, Tp.HCM<br>S\u1ed1 TK: <b>1110 0014 2852</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.ischecktextend=!1,this.ischecktext=!0,this.isenabledbtn=!1,this.paymentMethod="45"})}techcom(){this.zone.run(()=>{this.ischecktechcomactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischeckdongaactive=!1,this.ischeckbidvactive=!1,this.ischecksacomactive=!1,this.ischeckagriactive=!1,this.ischeckacbactive=!1,this.ischecktechcom=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischeckdonga=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischeckagri=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.text="NH TMCP K\u1ef9 Th\u01b0\u01a1ng Vi\u1ec7t Nam (Techcombank)<br>Chi nh\xe1nh Tr\u1ea7n Quang Di\u1ec7u, Tp.HCM<br>S\u1ed1 TK: <b>19128840912016</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.ischecktextend=!1,this.ischecktext=!0,this.isenabledbtn=!1,this.paymentMethod="44"})}donga(){this.zone.run(()=>{this.ischeckdongaactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckbidvactive=!1,this.ischecksacomactive=!1,this.ischeckagriactive=!1,this.ischeckacbactive=!1,this.ischeckdonga=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischeckagri=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.ischecktextend=!0,this.ischecktext=!1,this.text="NH TMCP \u0110\xf4ng \xc1 (DongABank)<br>Chi nh\xe1nh L\xea V\u0103n S\u1ef9, Tp.HCM<br>S\u1ed1 TK: <b>0139 9166 0002</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.isenabledbtn=!1,this.paymentMethod="43"})}agri(){this.zone.run(()=>{this.ischeckagriactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckbidvactive=!1,this.ischecksacomactive=!1,this.ischeckdongaactive=!1,this.ischeckacbactive=!1,this.ischeckagri=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckbidv=!0,this.ischecksacom=!0,this.ischeckdonga=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.ischecktextend=!0,this.ischecktext=!1,this.text="NH Agribank<br>Chi Nh\xe1nh 03, Tp.HCM<br>S\u1ed1 TK: <b>160 2201 361 086</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.isenabledbtn=!1,this.paymentMethod="47"})}bidv(){this.zone.run(()=>{this.ischeckbidvactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckagriactive=!1,this.ischecksacomactive=!1,this.ischeckdongaactive=!1,this.ischeckacbactive=!1,this.ischeckbidv=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckagri=!0,this.ischecksacom=!0,this.ischeckdonga=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.ischecktextend=!0,this.ischecktext=!1,this.text="NH TM CP \u0110\u1ea7u T\u01b0 v\xe0 Ph\xe1t Tri\u1ec3n Vi\u1ec7t Nam (BIDV)<br>Chi Nh\xe1nh 02, Tp.HCM<br>S\u1ed1 TK: <b>130 1000 147 4890</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.isenabledbtn=!1,this.paymentMethod="48"})}sacom(){this.zone.run(()=>{this.ischecksacomactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckagriactive=!1,this.ischeckbidvactive=!1,this.ischeckdongaactive=!1,this.ischeckacbactive=!1,this.ischecksacom=!1,this.ischeckscbactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckagri=!0,this.ischeckbidv=!0,this.ischeckdonga=!0,this.ischeckacb=!0,this.ischeckscb=!0,this.ischeckhd=!0,this.ischecktextend=!0,this.ischecktext=!1,this.text="Ng\xe2n H\xe0ng TMCP S\xe0i G\xf2n Th\u01b0\u01a1ng T\xedn (Sacombank)<br>Chi nh\xe1nh Cao Th\u1eafng, Tp.HCM<br>S\u1ed1 TK: <b>060 0952 73354</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.isenabledbtn=!1,this.paymentMethod="46"})}hd(){this.zone.run(()=>{this.ischeckhdactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckagriactive=!1,this.ischeckbidvactive=!1,this.ischeckdongaactive=!1,this.ischeckacbactive=!1,this.ischeckhd=!1,this.ischecksacomactive=!1,this.ischeckscbactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckagri=!0,this.ischeckbidv=!0,this.ischeckdonga=!0,this.ischeckacb=!0,this.ischecksacom=!0,this.ischeckscb=!0,this.ischecktextend=!0,this.ischecktext=!1,this.text="Ng\xe2n h\xe0ng HDBANK<br>Chi nh\xe1nh S\xe0i g\xf2n<br>S\u1ed1 TK: <b>052704070018649</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.isenabledbtn=!1,this.paymentMethod="50"})}scb(){this.zone.run(()=>{this.ischeckscbactive=!0,this.ischeckvcbactive=!1,this.ischeckvietinactive=!1,this.ischecktechcomactive=!1,this.ischeckagriactive=!1,this.ischeckbidvactive=!1,this.ischeckdongaactive=!1,this.ischeckacbactive=!1,this.ischecksacom=!1,this.ischeckscb=!1,this.ischecksacomactive=!1,this.ischeckhdactive=!1,this.ischeckvcb=!0,this.ischeckvietin=!0,this.ischecktechcom=!0,this.ischeckagri=!0,this.ischeckbidv=!0,this.ischeckdonga=!0,this.ischeckacb=!0,this.ischecksacom=!0,this.ischeckhd=!0,this.ischecktextend=!0,this.ischecktext=!1,this.text="Ng\xe2n H\xe0ng S\xe0i G\xf2n (SCB)<br>Chi nh\xe1nh Ph\xfa \u0110\xf4ng<br>S\u1ed1 TK: <b>023 0109 7937 00001</b><br>Ch\u1ee7 TK: <b>C\xf4ng ty C\u1ed5 Ph\u1ea7n IVIVU.COM</b>",this.isenabledbtn=!1,this.paymentMethod="49"})}next(){var n=this;if(this.presentLoading(),this.jsonroom.RoomClasses=this.room,this.timestamp=Date.now(),n.booking.CEmail){var e=0;n.Roomif.order&&(e=1);var i={method:"POST",url:d.a.urls.baseUrl.urlPost+"/mInsertBooking",timeout:1e4,maxAttempts:5,retryDelay:2e3,headers:{"content-type":"application/json"},body:{RoomClassObj:n.jsonroom.RoomClasses[0].ListObjRoomClass,CName:n.Roomif.hoten,CEmail:n.booking.CEmail,CPhone:n.Roomif.phone,timestamp:n.timestamp,HotelID:n.booking.HotelId,paymentMethod:n.paymentMethod,note:n.Roomif.notetotal,source:"6",MemberToken:n.auth_token,CustomersStr:JSON.stringify(n.Roomif.arrcustomer),UsePointPrice:n.Roomif.pricepoint,NoteCorp:n.Roomif.order,Invoice:e,UserPoints:n.Roomif.point,CheckInDate:n.jsonroom.CheckInDate,CheckOutDate:n.jsonroom.CheckOutDate,TotalNight:n.jsonroom.TotalNight,MealTypeIndex:n.booking.indexmealtype,CompanyName:n.Roomif.companyname,CompanyAddress:n.Roomif.address,CompanyTaxCode:n.Roomif.tax,BillingAddress:n.Roomif.addressorder,promotionCode:n.Roomif.promocode,comboid:n.bookcombo.ComboId},json:!0};r(i,function(e,l,t){if(200!=l.statusCode){var c={page:"roompaymentbank",func:"next",message:l.statusMessage,content:l.body,type:"warning",param:JSON.stringify(i)};d.a.writeErrorLog(c,l)}if(e&&(e.page="roompaymentbank",e.func="next",e.param=JSON.stringify(i),d.a.writeErrorLog(e,l)),t)if(0==t.error){var s=t.code,h=t.bookingStatus;n.clearClonePage("page-roompaymentdone"),n.loader.dismiss(),n.navCtrl.navigateForward("/roompaymentdone/"+s+"/"+h)}else n.loader.dismiss(),alert(t.Msg);else e.page="roompaymentbank",e.func="next",e.param=JSON.stringify(i),d.a.writeErrorLog(e,l),n.loader.dismiss(),alert("\u0110\xe3 c\xf3 s\u1ef1 c\u1ed1 x\u1ea3y ra, vui l\xf2ng th\u1eed l\u1ea1i!")})}else n.loader.dismiss(),n.presentToastr("Email kh\xf4ng h\u1ee3p l\u1ec7. Vui l\xf2ng ki\u1ec3m tra l\u1ea1i.")}refreshToken(){var n=this;n.storage.get("auth_token").then(e=>{if(e){var i={method:"GET",url:d.a.urls.baseUrl.urlMobile+"/api/Account/reloadTokenClaims",headers:{"cache-control":"no-cache","content-type":"application/json",authorization:"Bearer "+e}};r(i,function(e,l,t){if(200!=l.statusCode){var c={page:"roompaymentdoneean",func:"refreshToken",message:l.statusMessage,content:l.body,type:"warning",param:JSON.stringify(i)};d.a.writeErrorLog(c,l)}if(e)e.page="roompaymentdoneean",e.func="refreshToken",e.param=JSON.stringify(i),d.a.writeErrorLog(e,l);else{var s=JSON.parse(t);n.zone.run(()=>{n.storage.remove("auth_token"),n.storage.set("auth_token",s.auth_token);var e=b()(s.auth_token);n.storage.remove("point"),n.storage.set("point",e.point)})}})}})}clearClonePage(n){let e=[];null!=(e=Array.from(document.querySelectorAll(n)))&&e.length>0&&e.forEach(n=>{null!=n&&n.length>0&&n.remove()})}select(){this.navCtrl.back()}check(){this.isenabled=!this.ischeck}presentLoading(){return a.__awaiter(this,void 0,void 0,function*(){this.loader=yield this.loadingCtrl.create({}),this.loader.present()})}goback(){this.navCtrl.back()}presentToastr(n){return a.__awaiter(this,void 0,void 0,function*(){(yield this.toastCtrl.create({message:n,duration:3e3,position:"top"})).present()})}}var v=i("xgBC"),f=l["\u0275crt"]({encapsulation:0,styles:[[".checkbox-md-secondary[_ngcontent-%COMP%]   .checkbox-checked[_ngcontent-%COMP%]{border-color:#26bed6;background-color:#26bed6}.button2[_ngcontent-%COMP%]{background:#ff9500;color:#fff;border-color:#ff9500;width:90%}.button1[_ngcontent-%COMP%]{color:#ff9500;border-color:#ff9500;width:100%;font-size:12px}.div-btn[_ngcontent-%COMP%]{background-color:#fff;text-align:center;margin-top:20px}.toolbar-title-md[_ngcontent-%COMP%]{text-align:center;margin-right:70px}"]],data:{}});function p(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/iv_vcb_active.png"]],null,null,null,null,null))],null,null)}function C(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/iv_vcb.png"]],null,null,null,null,null))],null,null)}function I(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_acb_active.png"]],null,null,null,null,null))],null,null)}function R(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_acb.png"]],null,null,null,null,null))],null,null)}function T(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_vietin_active.png"]],null,null,null,null,null))],null,null)}function y(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_vietin.png"]],null,null,null,null,null))],null,null)}function x(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_techcom_active.png"]],null,null,null,null,null))],null,null)}function _(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_techcom.png"]],null,null,null,null,null))],null,null)}function M(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_donga_active.png"]],null,null,null,null,null))],null,null)}function N(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_donga.png"]],null,null,null,null,null))],null,null)}function w(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_agri_active.png"]],null,null,null,null,null))],null,null)}function V(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_agri.png"]],null,null,null,null,null))],null,null)}function z(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_bidv_active.png"]],null,null,null,null,null))],null,null)}function D(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_bidv.png"]],null,null,null,null,null))],null,null)}function E(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_sacom_active.png"]],null,null,null,null,null))],null,null)}function P(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_sacom.png"]],null,null,null,null,null))],null,null)}function O(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_hd_active.svg"]],null,null,null,null,null))],null,null)}function S(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_hd.svg"]],null,null,null,null,null))],null,null)}function K(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_scb_active.svg"]],null,null,null,null,null))],null,null)}function A(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,0,"img",[["src","./assets/ic_bank/ic_scb.svg"]],null,null,null,null,null))],null,null)}function H(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,11,"ion-header",[],null,null,null,s.ib,s.n)),l["\u0275did"](1,49152,null,0,h.IonHeader,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](2,0,null,0,9,"ion-row",[],null,null,null,s.Ab,s.F)),l["\u0275did"](3,49152,null,0,h.IonRow,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](4,0,null,0,7,"ion-col",[["style","text-align: center;height: 48px;"]],null,null,null,s.db,s.i)),l["\u0275did"](5,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](6,0,null,0,5,"div",[["style","align-self: center"]],null,null,null,null,null)),(n()(),l["\u0275eld"](7,0,null,null,1,"div",[["style","position: absolute;height: 48px;width: 48px;"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.goback()&&l),l},null,null)),(n()(),l["\u0275eld"](8,0,null,null,0,"img",[["src","./assets/imgs/ios-arrow-round-back.svg"],["style","height: 48px; padding: 8px;margin-top: 0px;margin-left:-8px"]],null,null,null,null,null)),(n()(),l["\u0275eld"](9,0,null,null,2,"div",[["style","padding-top: 11px;font-size: 20px;font-weight: bold;"]],null,null,null,null,null)),(n()(),l["\u0275eld"](10,0,null,null,1,"label",[["class","text-title"]],null,null,null,null,null)),(n()(),l["\u0275ted"](-1,null,["Thanh to\xe1n"])),(n()(),l["\u0275eld"](12,0,null,null,82,"ion-content",[["padding",""]],null,null,null,s.eb,s.j)),l["\u0275did"](13,49152,null,0,h.IonContent,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](14,0,null,0,1,"div",[["style","text-align: center"]],null,null,null,null,null)),(n()(),l["\u0275eld"](15,0,null,null,0,"img",[["src","./assets/step/step_3.svg"]],null,null,null,null,null)),(n()(),l["\u0275eld"](16,0,null,0,27,"ion-grid",[],null,null,null,s.hb,s.m)),l["\u0275did"](17,49152,null,0,h.IonGrid,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](18,0,null,0,25,"ion-row",[["style","margin-left: -10px"]],null,null,null,s.Ab,s.F)),l["\u0275did"](19,49152,null,0,h.IonRow,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](20,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.vcb()&&l),l},s.db,s.i)),l["\u0275did"](21,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,p)),l["\u0275did"](23,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,C)),l["\u0275did"](25,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](26,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.acb()&&l),l},s.db,s.i)),l["\u0275did"](27,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,I)),l["\u0275did"](29,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,R)),l["\u0275did"](31,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](32,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.vietin()&&l),l},s.db,s.i)),l["\u0275did"](33,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,T)),l["\u0275did"](35,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,y)),l["\u0275did"](37,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](38,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.techcom()&&l),l},s.db,s.i)),l["\u0275did"](39,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,x)),l["\u0275did"](41,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,_)),l["\u0275did"](43,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](44,0,null,0,27,"ion-grid",[],null,null,null,s.hb,s.m)),l["\u0275did"](45,49152,null,0,h.IonGrid,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](46,0,null,0,25,"ion-row",[["style","margin-left: -10px;margin-top: -20px"]],null,null,null,s.Ab,s.F)),l["\u0275did"](47,49152,null,0,h.IonRow,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](48,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.donga()&&l),l},s.db,s.i)),l["\u0275did"](49,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,M)),l["\u0275did"](51,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,N)),l["\u0275did"](53,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](54,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.agri()&&l),l},s.db,s.i)),l["\u0275did"](55,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,w)),l["\u0275did"](57,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,V)),l["\u0275did"](59,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](60,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.bidv()&&l),l},s.db,s.i)),l["\u0275did"](61,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,z)),l["\u0275did"](63,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,D)),l["\u0275did"](65,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](66,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.sacom()&&l),l},s.db,s.i)),l["\u0275did"](67,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,E)),l["\u0275did"](69,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,P)),l["\u0275did"](71,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](72,0,null,0,15,"ion-grid",[],null,null,null,s.hb,s.m)),l["\u0275did"](73,49152,null,0,h.IonGrid,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](74,0,null,0,13,"ion-row",[["style","margin-left: -10px;margin-top: -20px"]],null,null,null,s.Ab,s.F)),l["\u0275did"](75,49152,null,0,h.IonRow,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](76,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.hd()&&l),l},s.db,s.i)),l["\u0275did"](77,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,O)),l["\u0275did"](79,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,S)),l["\u0275did"](81,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](82,0,null,0,5,"ion-col",[["size","3"]],null,[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.scb()&&l),l},s.db,s.i)),l["\u0275did"](83,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],{size:[0,"size"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,K)),l["\u0275did"](85,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275and"](16777216,null,0,1,null,A)),l["\u0275did"](87,16384,null,0,o.NgIf,[l.ViewContainerRef,l.TemplateRef],{ngIf:[0,"ngIf"]},null),(n()(),l["\u0275eld"](88,0,null,0,6,"ion-grid",[],null,null,null,s.hb,s.m)),l["\u0275did"](89,49152,null,0,h.IonGrid,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](90,0,null,0,4,"ion-row",[["style","margin-left: -10px;margin-top: -30px"]],null,null,null,s.Ab,s.F)),l["\u0275did"](91,49152,null,0,h.IonRow,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](92,0,null,0,2,"ion-col",[["col-12",""]],null,null,null,s.db,s.i)),l["\u0275did"](93,49152,null,0,h.IonCol,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](94,0,null,0,0,"p",[["text-wrap",""]],[[8,"innerHTML",1]],null,null,null,null)),(n()(),l["\u0275eld"](95,0,null,null,4,"ion-footer",[],null,null,null,s.gb,s.l)),l["\u0275did"](96,49152,null,0,h.IonFooter,[l.ChangeDetectorRef,l.ElementRef],null,null),(n()(),l["\u0275eld"](97,0,null,0,2,"div",[["style","background-color: #ffffff; text-align: center"]],null,null,null,null,null)),(n()(),l["\u0275eld"](98,0,null,null,1,"button",[["class","button button2 button-footer"],["ion-button",""],["outline",""],["round",""]],[[8,"disabled",0]],[[null,"click"]],function(n,e,i){var l=!0;return"click"===e&&(l=!1!==n.component.next()&&l),l},null,null)),(n()(),l["\u0275ted"](-1,null,["Ti\u1ebfp t\u1ee5c"]))],function(n,e){var i=e.component;n(e,21,0,"3"),n(e,23,0,i.ischeckvcbactive),n(e,25,0,i.ischeckvcb),n(e,27,0,"3"),n(e,29,0,i.ischeckacbactive),n(e,31,0,i.ischeckacb),n(e,33,0,"3"),n(e,35,0,i.ischeckvietinactive),n(e,37,0,i.ischeckvietin),n(e,39,0,"3"),n(e,41,0,i.ischecktechcomactive),n(e,43,0,i.ischecktechcom),n(e,49,0,"3"),n(e,51,0,i.ischeckdongaactive),n(e,53,0,i.ischeckdonga),n(e,55,0,"3"),n(e,57,0,i.ischeckagriactive),n(e,59,0,i.ischeckagri),n(e,61,0,"3"),n(e,63,0,i.ischeckbidvactive),n(e,65,0,i.ischeckbidv),n(e,67,0,"3"),n(e,69,0,i.ischecksacomactive),n(e,71,0,i.ischecksacom),n(e,77,0,"3"),n(e,79,0,i.ischeckhdactive),n(e,81,0,i.ischeckhd),n(e,83,0,"3"),n(e,85,0,i.ischeckscbactive),n(e,87,0,i.ischeckscb)},function(n,e){var i=e.component;n(e,94,0,i.text),n(e,98,0,i.isenabledbtn)})}function U(n){return l["\u0275vid"](0,[(n()(),l["\u0275eld"](0,0,null,null,1,"app-roompaymentbank",[],null,null,null,H,f)),l["\u0275did"](1,114688,null,0,m,[h.Platform,u.d,l.NgZone,v.b,h.NavController,u.b,h.LoadingController,k.b,h.ToastController,u.a],null,null)],function(n,e){n(e,1,0)},null)}var L=l["\u0275ccf"]("app-roompaymentbank",m,U,{},{},[]),j=i("iInd");i.d(e,"RoompaymentbankPageModuleNgFactory",function(){return B});var B=l["\u0275cmf"](t,[],function(n){return l["\u0275mod"]([l["\u0275mpd"](512,l.ComponentFactoryResolver,l["\u0275CodegenComponentFactoryResolver"],[[8,[c.a,L]],[3,l.ComponentFactoryResolver],l.NgModuleRef]),l["\u0275mpd"](4608,o.NgLocalization,o.NgLocaleLocalization,[l.LOCALE_ID,[2,o["\u0275angular_packages_common_common_a"]]]),l["\u0275mpd"](4608,h.AngularDelegate,h.AngularDelegate,[l.NgZone,l.ApplicationRef]),l["\u0275mpd"](4608,h.ModalController,h.ModalController,[h.AngularDelegate,l.ComponentFactoryResolver,l.Injector,o.DOCUMENT]),l["\u0275mpd"](4608,h.PopoverController,h.PopoverController,[h.AngularDelegate,l.ComponentFactoryResolver,l.Injector,o.DOCUMENT]),l["\u0275mpd"](1073742336,o.CommonModule,o.CommonModule,[]),l["\u0275mpd"](1073742336,h.IonicModule,h.IonicModule,[]),l["\u0275mpd"](1073742336,j.p,j.p,[[2,j.v],[2,j.n]]),l["\u0275mpd"](1073742336,t,t,[]),l["\u0275mpd"](1024,j.l,function(){return[[{path:"",component:m}]]},[])])})}}]);