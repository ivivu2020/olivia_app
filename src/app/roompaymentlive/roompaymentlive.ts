import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo } from '../providers/book-service';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
/**
 * Generated class for the RoompaymentlivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roompaymentlive',
  templateUrl: 'roompaymentlive.html',
  styleUrls: ['roompaymentlive.scss'],
})
export class RoompaymentlivePage implements OnInit{
  text; isenabled = true; ischeck; timestamp; paymentMethod;auth_token: any;
; room; jsonroom;loader:any;
  constructor(public platform: Platform,public bookcombo:Bookcombo,public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, public booking: Booking, public loadingCtrl: LoadingController,public gf: GlobalFunction, public zone: NgZone,private toastCtrl: ToastController) {
    this.text = "<b>Văn phòng tại TP. Hồ Chí Minh:</b> Lầu 2, tòa nhà Saigon Prime, 107-109-111 Nguyễn Đình Chiểu, Phường 6, Quận 3, Thành phố Hồ Chí Minh<br />Thời gian làm việc:<br /><ul><li>Thứ 2 - Thứ 7: từ 07h30 đến 21h00</li><li>Chủ Nhật: từ 07h30 đến 20h00</li></ul><br /><b>Văn phòng tại Hà Nội:</b> Lầu 9, 70-72 Bà Triệu, Quận Hoàn Kiếm<br />Thời gian làm việc:<br /><ul ><li>Thứ 2 - Thứ 6: từ 07h30 đến 17h30</li></ul>";
    this.room = Roomif.arrroom;
    this.jsonroom = Roomif.jsonroom;
    
    //google analytic
    gf.googleAnalytion('roompaymentlive','load','');
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })
  }
  next() {
    this.presentLoading();
    var se = this;
    // var arrMealTypeRates = [];
    // var room1 = [];
    // arrMealTypeRates.push(this.room[0].MealTypeRates[this.booking.indexmealtype]);
    // var itemroom1 = {
    //   Penalty_Type: this.room[0].Rooms[0].Penalty_Type, RoomID: this.room[0].Rooms[0].RoomID, RoomPriceBreak: this.room[0].Rooms[0].RoomPriceBreak,
    //   SupplierRef: this.room[0].Rooms[0].SupplierRef, SalesTax: this.room[0].Rooms[0].SalesTax
    // }
    // room1.push(itemroom1);
    // this.jsonroom.RoomClasses = this.room;
    // this.jsonroom.RoomClasses[0].MealTypeRates = arrMealTypeRates;
    // this.jsonroom.RoomClasses[0].Rooms = room1;
    // this.jsonroom.RoomClassesHidden = [];
    // this.booking.Hotels = this.jsonroom
    se.jsonroom.RoomClasses=se.room;
    se.timestamp = Date.now();
    //se.storage.get('auth_token').then(auth_token => {
      if (se.booking.CEmail) {
        var Invoice=0;
        if (se.Roomif.order) {
          Invoice=1;
        }
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlPost + '/mInsertBooking',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'content-type': 'application/json'
          },
          body:
          {
            RoomClassObj : se.jsonroom.RoomClasses[0].ListObjRoomClass,
            CName: se.Roomif.hoten,
            CEmail: se.booking.CEmail,
            CPhone: se.Roomif.phone,
            timestamp: se.timestamp,
            HotelID: se.booking.HotelId,
            paymentMethod: "51",
            note: se.Roomif.notetotal,
            source: '6',
            MemberToken: se.auth_token,
            CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
            UsePointPrice:se.Roomif.pricepoint,
            NoteCorp:se.Roomif.order,
            Invoice:Invoice,
            UserPoints:se.Roomif.point,
            CheckInDate: se.jsonroom.CheckInDate,
            CheckOutDate: se.jsonroom.CheckOutDate,
            TotalNight: se.jsonroom.TotalNight,
            MealTypeIndex : se.booking.indexmealtype,
            CompanyName:se.Roomif.companyname,
            CompanyAddress:se.Roomif.address,
            CompanyTaxCode:se.Roomif.tax,
            BillingAddress :se.Roomif.addressorder,
            promotionCode:se.Roomif.promocode,
            comboid:se.bookcombo.ComboId
          },
          json: true
        };
        request(options, function (error, response, body) {
          if(response.statusCode != 200){
            var objError ={
                page: "roompaymentlive",
                func: "next",
                message : response.statusMessage,
                content : response.body,
                type: "warning",
                param:  JSON.stringify(options)
              };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentlive";
            error.func = "next";
            error.param =  JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          if (body) {
            if (body.error == 0) {
              // console.log(body.code);
              var code=body.code;
              var stt=body.bookingStatus;
              se.clearClonePage('page-roompaymentdone');
              se.loader.dismiss();
              se.navCtrl.navigateForward('/roompaymentdone/'+code+'/'+stt);
              //se.gf.googleAnalytion('paymentdirect','Purchases','hotelid:'+se.booking.cost+'/cin:'+se.jsonroom.CheckInDate+'/cout:'+se.jsonroom.CheckOutDate+'/adults:'+se.booking.Adults+'/child:'+se.booking.Child+'/price:'+se.booking.cost)
            }
            else{
              se.loader.dismiss();
              alert(body.Msg);
              //se.refreshToken();
              // se.navCtrl.popToRoot();
              // se.app.getRootNav().getActiveChildNav().select(0);
            }
          }
          else{
            error.page = "roompaymentlive";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
            se.loader.dismiss();
            alert("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
          
        });

      }
      else{
        se.loader.dismiss();
        se.presentToastr('Email không hợp lệ. Vui lòng kiểm tra lại.');
      }
    //})

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
              page: "roompaymentdoneean",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param:  JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentdoneean";
            error.func = "refreshToken";
            error.param =  JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            var au = JSON.parse(body);
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
            })
          }
        })
      }
    })
  }
  clearClonePage(pagename) {
    //Xóa clone do push page
    let elements = [];
    elements = Array.from(document.querySelectorAll(pagename));
    if (elements != null && elements.length > 0) {
      elements.forEach(el => {
        if (el != null && el.length > 0) {
          el.remove();
        }
      });
    }
  }
  check() {
    if (this.ischeck) {
      this.isenabled = false;
    } else {
      this.isenabled = true;
    }
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback(){
    this.navCtrl.back();
  }

  async presentToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
}
