
import { Booking } from '../providers/book-service';
import { Component,  NgZone, OnInit } from '@angular/core';
import {  NavController, ToastController,LoadingController,Platform } from '@ionic/angular';
import { RoomInfo,Bookcombo } from '../providers/book-service';
import { C } from '../providers/constants';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { Keyboard } from '@ionic-native/keyboard/ngx';
/**
 * Generated class for the RoomadddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roomadddetails',
  templateUrl: 'roomadddetails.html',
  styleUrls: ['roomadddetails.scss'],
  providers: [Keyboard]
})
export class RoomadddetailsPage implements OnInit {
  hoten;phone = ""; note; arr; roomnumber; room; ischeck: boolean; ishide;
  companyname; address; tax; addressorder; bed; bedchuoi; priceshow; ischeckpoint; ischeckbtn
  timestamp; paymentMethod; jsonroom; ischeckpayment;public loader:any
  _email: any;
  validemail = true;
  auth_token: any;
  isKeyboardHide = true;

  ngOnInit() {
  }
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone,public bookcombo:Bookcombo,
    private toastCtrl: ToastController, public Roomif: RoomInfo, public storage: Storage, public loadingCtrl: LoadingController,
    public booking: Booking, public gf: GlobalFunction,
    public keyboard: Keyboard) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.storage.get('email').then(email => {
      if(email){
        this._email = email;
      }else{
        this.validemail = false;
      }
      
      })
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        if (infocus.ho&&infocus.ten) {
          this.hoten = infocus.ho+' '+infocus.ten;
        } else {
          if (infocus.ho) {
            this.hoten=infocus.ho;
          }
          else if (infocus.ten) {
            this.hoten=infocus.ten;
          }
        }
        this.phone = infocus.phone;
      }
    })
    this.storage.get('order').then(order => {
      if (order) {
        this.companyname = order.companyname;
        this.address = order.address;
        this.tax = order.tax;
        this.addressorder = order.addressorder;
        this.ishide = true;
        this.ischeck = true;
      } else {
        this.ishide = false;
        this.ischeck = false;
      }
    })
    this.note = Roomif.notetotal;
    this.room = this.Roomif.arrroom;
    this.jsonroom = Roomif.jsonroom;
    this.ischeckpoint = this.Roomif.ischeckpoint;
    if (this.ischeckpoint == true) {
      if (this.Roomif.priceshow == "0") {
        this.priceshow = this.Roomif.priceshow;
      }
      else {
        this.priceshow = this.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
      }

    }
    else {
      this.ischeckbtn = true;
    }
    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    //google analytic
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
    this.keyboard.onKeyboardWillShow().subscribe(()=>{
      this.isKeyboardHide = false;
    })
    this.keyboard.onKeyboardWillHide().subscribe(()=>{
      this.isKeyboardHide = true;
    })
  }
  next() {
    this.Roomif.notetotal = "";
    this.gf.googleAnalytion('roomadddetails', 'add_payment_info', '');
    if (this.hoten) {
      this.hoten = this.hoten.trim();
    }
    else {
      this.presentToastHo();
      return;
    }
  
    this.clearClonePage('page-roompaymentselect');
    this.Roomif.order = "";
    if (this.ischeck) {
      if (this.phonenumber(this.phone)) {
        //validate mail
        if(!this.validateEmail(this._email) || !this._email){
          this.presentToastEmail();
          this.validemail = false;
          return;
        }
        this.booking.CEmail = this._email;
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
          this.addressorder = this.addressorder.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.Roomif.hoten = this.hoten;
          this.Roomif.phone = this.phone;
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this.addressorder;
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder }
          this.storage.set("order", order1);
          // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
          // this.storage.set("infocus", info);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          // if (this.arrbed.length > 1) {
          //   for (let i = 0; i < this.arrbed.length; i++) {
          //     if (this.arrbed[i].ischeck) {
          //       this.bedchuoi = this.arrbed[i].text;
          //     }
          //   }
          // }
          // this.Roomif.bed = this.bedchuoi;
          // if (this.note && this.bedchuoi) {
          //   this.Roomif.notetotal = this.note + "," + this.bedchuoi;
          // }
          // else {
          //   if (this.note) {
          //     this.Roomif.notetotal = this.note;
          //   }
          //   else if (this.bedchuoi) {
          //     this.Roomif.notetotal = this.bedchuoi;
          //   }
          // }
          this.Roomif.notetotal = this.note;
          this.Roomif.ischeck = this.ischeck;
          //this.Roomif.arrrbed = this.arrbed;
          //console.log(this.Roomif.notetotal);
          if (this.Roomif.payment == 'AL') {
            this.navCtrl.navigateForward("roompaymentselect");
          }
          else {
            this.paymentnotAL();
          }

        } else {
          this.presentToastOrder();
        }

      } else {
        this.presentToastPhone();
      }

    } else {
      if (this.phonenumber(this.phone)) {
        //validate mail
        if(!this.validateEmail(this._email) || !this._email){
          this.presentToastEmail();
          this.validemail = false;
          return;
        }
        this.booking.CEmail = this._email;
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        this.clearClonePage('page-roompaymentselect');
        this.Roomif.notetotal = this.note;
        //console.log(this.Roomif.notetotal);
        if (this.Roomif.payment == 'AL') {
          this.navCtrl.navigateForward("roompaymentselect");
        }
        else {
          this.paymentnotAL();
        }
      } else {
        this.presentToastPhone();
      }

    }
  }
  next1() {
    this.Roomif.notetotal = "";
    if (this.hoten) {
      this.hoten = this.hoten.trim();
    }
    else {
      this.presentToastHo();
      return;
    }
    this.Roomif.order = "";
    this.clearClonePage('page-roompaymentdoneean');
    if (this.ischeck) {
      if (this.phonenumber(this.phone)) {
        //validate mail
        if(!this.validateEmail(this._email) || !this._email){
          this.presentToastEmail();
          this.validemail = false;
          return;
        }
        this.booking.CEmail = this._email;
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
          this.addressorder = this.addressorder.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.Roomif.hoten = this.hoten;
          this.Roomif.phone = this.phone;
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this.addressorder;
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder }
          this.storage.set("order", order1);
          // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
          // this.storage.set("infocus", info);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          // if (this.arrbed.length > 1) {
          //   for (let i = 0; i < this.arrbed.length; i++) {
          //     if (this.arrbed[i].ischeck) {
          //       this.bedchuoi = this.arrbed[i].text;
          //     }
          //   }
          // }
          // this.Roomif.bed = this.bedchuoi;
          // if (this.note && this.bedchuoi) {
          //   this.Roomif.notetotal = this.note + "," + this.bedchuoi;
          // }
          // else {
          //   if (this.note) {
          //     this.Roomif.notetotal = this.note;
          //   }
          //   else if (this.bedchuoi) {
          //     this.Roomif.notetotal = this.bedchuoi;
          //   }
          // }
          this.Roomif.notetotal = this.note;
          this.Roomif.ischeck = this.ischeck;
          // this.Roomif.arrrbed = this.arrbed;
          //console.log(this.Roomif.notetotal);
          this.pushdata();
        } else {
          this.presentToastOrder();
        }

      } else {
        this.presentToastPhone();
      }
    } else {
      if (this.phonenumber(this.phone)) {
        // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
        // this.storage.set("infocus", info);
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        this.clearClonePage('page-roompaymentdoneean');
        // if (this.arrbed.length > 1) {
        //   for (let i = 0; i < this.arrbed.length; i++) {
        //     if (this.arrbed[i].ischeck) {
        //       this.bedchuoi = this.arrbed[i].text;
        //     }
        //   }
        // }
        // this.Roomif.bed = this.bedchuoi;
        // if (this.note && this.bedchuoi) {
        //   this.Roomif.notetotal = this.note + "," + this.bedchuoi;
        // }
        // else {
        //   if (this.note) {
        //     this.Roomif.notetotal = this.note;
        //   }
        //   else if (this.bedchuoi) {
        //     this.Roomif.notetotal = this.bedchuoi;
        //   }
        // }
        // this.Roomif.arrrbed = this.arrbed;
        this.Roomif.notetotal = this.note;
        //console.log(this.Roomif.notetotal);
        this.pushdata();

      } else {
        this.presentToastPhone();
      }
    }
  }
  pushdata() {
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
    this.jsonroom.RoomClasses = this.room;
    this.timestamp = Date.now();
    this.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
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
            RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
            CName: se.Roomif.hoten,
            CEmail: se.booking.CEmail,
            CPhone: se.Roomif.phone,
            timestamp: se.timestamp,
            HotelID: se.booking.HotelId,
            paymentMethod: "51",
            note: se.Roomif.notetotal,
            source: '6',
            MemberToken: auth_token,
            CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
            UsePointPrice: se.Roomif.pricepoint,
            NoteCorp: se.Roomif.order,
            Invoice: Invoice,
            UserPoints: se.Roomif.point,
            CheckInDate: se.jsonroom.CheckInDate,
            CheckOutDate: se.jsonroom.CheckOutDate,
            TotalNight: se.jsonroom.TotalNight,
            MealTypeIndex: se.booking.indexmealtype,
            CompanyName: se.Roomif.companyname,
            CompanyAddress: se.Roomif.address,
            CompanyTaxCode: se.Roomif.tax,
            BillingAddress: se.Roomif.addressorder,
            promotionCode:se.Roomif.promocode,
            comboid:se.bookcombo.ComboId
          },
          json: true
        };
        //console.log(JSON.stringify(options.body));
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roomadddetails",
              func: "next",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roomadddetails";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          if (body) {
            if (body.error == 0) {
              //console.log(body.code);
              // var value = { BookingCode: body.code, total: se.Roomif.pricepoint ,ischeck:'1'};
              //se.closeLoading();
              var id = body.code;
              var total = se.Roomif.pricepoint;
              var ischeck = '1'
              se.clearClonePage('page-roompaymentdoneean');
              se.loader.dismiss();
              se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
            }
            else {
              se.loader.dismiss();
              alert(body.Msg);
              se.refreshToken();
              //se.navCtrl.popToRoot();
              //se.app.getRootNav().getActiveChildNav().select(0);
            }
          }
          else{
            error.page = "roomadddetails";
            error.func = "pushdata";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
            se.loader.dismiss();
            alert("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
          
        });

      }
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
              page: "roompaymentdoneean",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentdoneean";
            error.func = "refreshToken";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            var au = JSON.parse(body);
            se.zone.run(() => {
              se.storage.remove('auth_token');
              se.storage.set('auth_token', au.auth_token);
              var decoded = jwt_decode(au.auth_token);
              se.storage.remove('point');
              se.storage.set('point', decoded.point);
              se.navCtrl.navigateForward('/hoteldetail/' + this.booking.HotelId);
            })
          }
        })
      }
    })
  }
  async presentToasterror() {
    let toast = await this.toastCtrl.create({
      message: "Số điểm không đủ để tạo booking",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  async presentToastHo() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập họ tên",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastTen() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập tên",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập số điện thoại",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastOrder() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập thông tin xuất hóa đơn",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  async presentToastEmail() {
    let toast = await this.toastCtrl.create({
      message: "Thông tin email không hợp lệ. Vui lòng nhập lại.",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  edit(co) {
    this.zone.run(() => {
      if (co == 0) {
        if (this.ischeck) {
          this.ishide = false;
        } else {
          this.ishide = true;
        }
      }
      else {
        this.ishide = false;
        this.ischeck = true;
      }
    })

  }
  ionViewDidLoad() {
    // this.navBar.backButtonClick = (e: UIEvent) => {
    //   // todo something
    //   //this.clearClonePage('page-roomdetailreview');
    //   //this.navCtrl.push("RoomdetailreviewPage");
    //   this.navCtrl.pop();
    // }
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
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  phonenumber(inputtxt) {
    if(inputtxt){
      var n = Number(inputtxt);
      if (n) {
        var test1 = inputtxt.length;
        if (inputtxt) {
          if (test1 == 10) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      }
      else {
        return false;
      }
    }else{
      return false;
    }
  }
  goback() {
    this.navCtrl.navigateBack('roomdetailreview');
  }
  paymentnotAL() {
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
    se.jsonroom.RoomClasses = se.room;
    se.timestamp = Date.now();
    //se.storage.get('auth_token').then(auth_token => {
      if (se.booking.CEmail) {
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
        }
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlPost + '/mInsertBooking',
          //url: 'http://192.168.10.103:24993/mInsertBooking',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'content-type': 'application/json'
          },
          body:
          {
            RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
            CName: se.Roomif.hoten,
            CEmail: se.booking.CEmail,
            CPhone: se.Roomif.phone,
            timestamp: se.timestamp,
            HotelID: se.booking.HotelId,
            paymentMethod: '51',
            note: se.Roomif.notetotal,
            source: '6',
            MemberToken: se.auth_token,
            CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
            UsePointPrice: se.Roomif.pricepoint,
            NoteCorp: se.Roomif.order,
            Invoice: Invoice,
            UserPoints: se.Roomif.point,
            CheckInDate: se.jsonroom.CheckInDate,
            CheckOutDate: se.jsonroom.CheckOutDate,
            TotalNight: se.jsonroom.TotalNight,
            MealTypeIndex: se.booking.indexmealtype,
            CompanyName: se.Roomif.companyname,
            CompanyAddress: se.Roomif.address,
            CompanyTaxCode: se.Roomif.tax,
            BillingAddress: se.Roomif.addressorder,
            promotionCode:se.Roomif.promocode,
            comboid:se.bookcombo.ComboId
          },
          json: true
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roomadddetails",
              func: "next",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roomadddetails";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          // var rs = JSON.parse(body);
          if (body.error == 0) {
            // console.log(body.code);
            var code = body.code;
            var stt = body.bookingStatus;
            se.navCtrl.navigateForward('/roompaymentdone/' + code + '/' + stt);
            se.loader.dismiss();
            //se.gf.googleAnalytion('paymentdirect', 'Purchases', 'hotelid:' + se.booking.cost + '/cin:' + se.jsonroom.CheckInDate + '/cout:' + se.jsonroom.CheckOutDate + '/adults:' + se.booking.Adults + '/child:' + se.booking.Child + '/price:' + se.booking.cost)
          }
          else {
            se.loader.dismiss();
            alert(body.Msg);
            //se.refreshToken();
            // se.navCtrl.popToRoot();
            // se.app.getRootNav().getActiveChildNav().select(0);
          }
        });

      }
    //})

  }
}
