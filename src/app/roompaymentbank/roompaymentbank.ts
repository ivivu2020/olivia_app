import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController ,LoadingController,Platform, ToastController} from '@ionic/angular';
import { Booking, RoomInfo,Bookcombo } from '../providers/book-service';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
/**
 * Generated class for the RoompaymentbankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roompaymentbank',
  templateUrl: 'roompaymentbank.html',
  styleUrls: ['roompaymentbank.scss'],
})
export class RoompaymentbankPage implements OnInit{
  ischeckvcbactive = true; ischeckvcb; ischeckacb; ischeckacbactive; ischeckvietin; ischeckvietinactive; ischecktechcom; ischecktechcomactive;
  ischeckdongaactive; ischeckdonga; ischeckagri; ischeckagriactive; ischeckbidv; ischeckbidvactive; ischecksacom; ischecksacomactive;
  text; ischecktext; ischecktextend; isenabled = true; input; ischeck; isenabledbtn; timestamp; paymentMethod; room; jsonroom;ischeckhdactive;ischeckhd;
  ischeckscbactive;ischeckscb;loader:any;
  auth_token: any;
  constructor(public platform: Platform,public Roomif: RoomInfo, public zone: NgZone, public storage: Storage, 
    public navCtrl: NavController, public booking: Booking, public loadingCtrl: LoadingController,
    public gf: GlobalFunction,private toastCtrl: ToastController,public bookcombo:Bookcombo) {
    this.ischeckvietin = true;
    this.ischeckacb = true;
    this.ischecktechcom = true;
    this.ischeckdonga = true;
    this.ischeckagri = true;
    this.ischeckbidv = true;
    this.ischecksacom = true;
    this.ischecktextend = false;
    this.ischecktext = true;
    this.ischeckscb=true;
    this.text = "";
    this.isenabledbtn = false;
    this.ischeckvcbactive = true;
    this.ischeckhd=true;
    this.paymentMethod = "42";
    this.text = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>007 1000 895 230</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b></li>";
    this.room = Roomif.arrroom;
    this.jsonroom = Roomif.jsonroom;
    //Xử lý nút back của dt
    // this.platform.ready().then(() => {
    //   document.addEventListener("backbutton", () => {
    //     this.navCtrl.back();
    //   })
    // })
    //google analytic
    gf.googleAnalytion('roompaymentbank','load','');
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })
  }
  acb() {
    this.zone.run(() => {
      this.ischeckacbactive = true;

      this.ischeckacb = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckvcbactive = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckvcb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.text = "Ngân hàng Á Châu (ACB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>190862589</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b></li>";
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "41";
    })

  }
  vcb() {
    this.zone.run(() => {
      this.ischeckvcbactive = true;

      this.ischeckvcb = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = false;
      this.ischecktext = true;
      this.text = "Ngân hàng Thương Mại Cổ Phần Ngoại Thương Việt Nam (VCB)<br>Chi nhánh Tp. Hồ Chí Minh<br>Số TK: <b>007 1000 895 230</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b></li>";
      this.isenabledbtn = false;
      this.paymentMethod = "42";
    })

  }
  vietin() {
    this.zone.run(() => {
      this.ischeckvietinactive = true;

      this.ischeckvcbactive = false;
      this.ischecktechcomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischeckvietin = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvcb = true;
      this.ischecktechcom = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.text = "NH VietinBank<br>Chi Nhánh 03, Tp.HCM<br>Số TK: <b>1110 0014 2852</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "45";
    })

  }
  techcom() {
    this.zone.run(() => {
      this.ischecktechcomactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischeckdongaactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischecktechcom = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischeckdonga = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.text = "NH TMCP Kỹ Thương Việt Nam (Techcombank)<br>Chi nhánh Trần Quang Diệu, Tp.HCM<br>Số TK: <b>19128840912016</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>"
      this.ischecktextend = false;
      this.ischecktext = true;
      this.isenabledbtn = false;
      this.paymentMethod = "44";
    })

  }

  donga() {
    this.zone.run(() => {
      this.ischeckdongaactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckagriactive = false;
      this.ischeckacbactive = false;
      this.ischeckdonga = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckagri = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH TMCP Đông Á (DongABank)<br>Chi nhánh Lê Văn Sỹ, Tp.HCM<br>Số TK: <b>0139 9166 0002</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "43";
    })

  }

  agri() {
    this.zone.run(() => {
      this.ischeckagriactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckbidvactive = false;
      this.ischecksacomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischeckagri = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckbidv = true;
      this.ischecksacom = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH Agribank<br>Chi Nhánh 03, Tp.HCM<br>Số TK: <b>160 2201 361 086</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "47";
    })

  }

  bidv() {
    this.zone.run(() => {
      this.ischeckbidvactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischecksacomactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischeckbidv = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;


      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischecksacom = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "NH TM CP Đầu Tư và Phát Triển Việt Nam (BIDV)<br>Chi Nhánh 02, Tp.HCM<br>Số TK: <b>130 1000 147 4890</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "48";
    })

  }

  sacom() {
    this.zone.run(() => {
      this.ischecksacomactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischecksacom = false;
      this.ischeckscbactive=false;
      this.ischeckhdactive=false;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischeckscb=true;
      this.ischeckhd=true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân Hàng TMCP Sài Gòn Thương Tín (Sacombank)<br>Chi nhánh Cao Thắng, Tp.HCM<br>Số TK: <b>060 0952 73354</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "46";
    })

  }
  hd() {
    this.zone.run(() => {
      this.ischeckhdactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischeckhd = false;
      this.ischecksacomactive = false;
      this.ischeckscbactive = false;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischecksacom = true;
      this.ischeckscb = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân hàng HDBANK<br>Chi nhánh Sài gòn<br>Số TK: <b>052704070018649</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "50";
    })

  }
  scb() {
    this.zone.run(() => {
      this.ischeckscbactive = true;

      this.ischeckvcbactive = false;
      this.ischeckvietinactive = false;
      this.ischecktechcomactive = false;
      this.ischeckagriactive = false;
      this.ischeckbidvactive = false;
      this.ischeckdongaactive = false;
      this.ischeckacbactive = false;
      this.ischecksacom = false;
      this.ischeckscb = false;
      this.ischecksacomactive = false;
      this.ischeckhdactive = false;

      this.ischeckvcb = true;
      this.ischeckvietin = true;
      this.ischecktechcom = true;
      this.ischeckagri = true;
      this.ischeckbidv = true;
      this.ischeckdonga = true;
      this.ischeckacb = true;
      this.ischecksacom = true;
      this.ischeckhd = true;
      this.ischecktextend = true;
      this.ischecktext = false;
      this.text = "Ngân Hàng Sài Gòn (SCB)<br>Chi nhánh Phú Đông<br>Số TK: <b>023 0109 7937 00001</b><br>Chủ TK: <b>Công ty Cổ Phần IVIVU.COM</b>";
      this.isenabledbtn = false;
      this.paymentMethod = "49";
    })

  }
  next() {
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
    this.presentLoading();
    // console.log(JSON.stringify(se.booking.Hotels));
    this.jsonroom.RoomClasses=this.room;
    this.timestamp = Date.now();
    //this.storage.get('auth_token').then(auth_token => {
      if (se.booking.CEmail) {
        var Invoice=0;
        if (se.Roomif.order) {
          Invoice=1;
        }
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlPost +'/mInsertBooking',
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
            paymentMethod: se.paymentMethod,
            note:se.Roomif.notetotal,
            source  :'6',
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
        // console.log(JSON.stringify(options.body));
        request(options, function (error, response, body) {
          if(response.statusCode != 200){
            var objError ={
                page: "roompaymentbank",
                func: "next",
                message : response.statusMessage,
                content : response.body,
                type: "warning",
                param:  JSON.stringify(options)
              };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentbank";
            error.func = "next";
            error.param =  JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          // var rs = JSON.parse(body);
          //alert(body.error);
          if (body) {
            if (body.error == 0) {
              // console.log(body.code);
              //var code = { BookingCode: body.code,bookingStatus: body.bookingStatus};
              var code=body.code;
              var stt=body.bookingStatus;
              se.clearClonePage('page-roompaymentdone');
              se.loader.dismiss();
              se.navCtrl.navigateForward('/roompaymentdone/'+code+'/'+stt);
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
            error.page = "roompaymentbank";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
            se.loader.dismiss();
            alert("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
          
        });
      }else{
        se.loader.dismiss();
        se.presentToastr('Email không hợp lệ. Vui lòng kiểm tra lại.');
      }
    //})
   
    // this.navCtrl.push('RoompaymentdonePage');
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
  select() {
    this.navCtrl.back();
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
