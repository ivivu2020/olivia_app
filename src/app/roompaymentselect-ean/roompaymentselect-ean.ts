import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, ModalController, LoadingController,Platform, ToastController } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel ,Bookcombo} from '../providers/book-service';
import { AuthService } from '../providers/auth-service';
import * as request from 'requestretry';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
/**
 * Generated class for the RoompaymentselectEanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roompaymentselect-ean',
  templateUrl: 'roompaymentselect-ean.html',
  styleUrls: ['roompaymentselect-ean.scss'],
})
export class RoompaymentselectEanPage implements OnInit{
  timestamp;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom;arrchild; textage = "";
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow; hotelid
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; roomcancel; pricetemp;loader:any;
  auth_token: any;
  constructor(public platform: Platform, public searchhotel: SearchHotel,public bookcombo:Bookcombo, public navCtrl: NavController, public Roomif: RoomInfo, public storage: Storage, private iab: InAppBrowser, public booking1: Booking, public booking: Booking, public authService: AuthService, public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, public zone: NgZone,private router: Router,private safariViewController: SafariViewController,private toastCtrl: ToastController) {
    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin = booking.CheckInDate;
    this.cout = booking.CheckOutDate;
    this.dur = Roomif.dur;
    this.roomnumber = Roomif.roomnumber;
    this.adults = booking.Adults;
    this.children = booking.Child;
    this.roomtype = Roomif.roomtype;
    this.indexme = booking.indexmealtype;
    this.indexroom = booking.indexroom;
    this.jsonroom = Roomif.jsonroom;
    this.room = Roomif.arrroom;
    var chuoicin = this.cin.split('-');
    var chuoicout = this.cout.split('-');
    this.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
    this.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    this.nameroom = this.room[0].ClassName;
    this.roomcancel = this.room[0].MealTypeRates[this.indexme];
    this.breakfast = this.room[0].MealTypeRates[this.indexme].Name;
    this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
    this.checkpayment = Roomif.payment;
    this.arrchild = this.searchhotel.arrchild;
    if(this.arrchild){
      for (let i = 0; i < this.arrchild.length; i++) {
        if (i == this.arrchild.length - 1) {
          this.textage = this.textage + this.arrchild[i].numage;
        } else {
          this.textage = this.textage + this.arrchild[i].numage + ",";
        }
      }
    }
    
    if (this.textage) {
      this.textage = "(" + this.textage + ")";
    }
    if (Roomif.priceshow) {
      this.priceshow = Roomif.priceshow;
    }
    else {
      this.priceshow = this.PriceAvgPlusTAStr;
    }
    this.searchhotel.backPage="roompaymentselect-ean";
    this.searchhotel.rootPage="roompaymentselect-ean";
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
    //google analytic
    gf.googleAnalytion('roompaymentselect-ean', 'load', '');
  }
  ngOnInit() {
  }
  roompaymentbank() {
    clearInterval(this.Roomif.setInter);
    this.clearClonePage('page-roompaymentbank');
    this.navCtrl.navigateForward("/roompaymentbank");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect-ean', 'roompaymentbankselect', '');
  }
  roompaymentlive() {
    clearInterval(this.Roomif.setInter);
    this.clearClonePage('page-roompaymentlive');
    this.navCtrl.navigateForward("/roompaymentlive");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect-ean', 'roompaymentliveselect', '');
  }
  roompaymentatm() {
    this.navCtrl.navigateForward("/roomchoosebank");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect-ean', 'roompaymentatmselect', '');
    // this.presentLoading();
    // this.timestamp = Date.now();
    // var se = this;
    // this.storage.get('jti').then(jti => {
    //   if (jti) {
    //     this.booking1 = {
    //       CheckInDate: this.booking.CheckInDate,
    //       CheckOutDate: this.booking.CheckOutDate,
    //       roomNb: this.booking.roomNb,
    //       Adults: this.booking.Adults,
    //       Child: this.booking.Child,
    //       CName: se.Roomif.ho + " " + se.Roomif.ten,
    //       CPhone: this.Roomif.phone,
    //       CEmail: this.booking.CEmail,
    //       cost: this.booking.cost,
    //       indexroom: this.booking.indexroom,
    //       indexmealtype: this.booking.indexmealtype,
    //       ChildAge: this.booking.ChildAge,
    //       HotelId: this.booking.HotelId,
    //       timestamp: this.timestamp,
    //       Hotels: '',
    //       HotelName: '',
    //       RoomName: '',
    //       note: this.Roomif.note,
    //       Customers: se.Roomif.arrcustomer,
    //       MemberId: jti
    //     }
    //     var setInter = setInterval(function () {
    //       //alert("test")
    //       var options = {
    //         method: 'GET',
    //         url: 'http://svc1-beta.ivivu.com/mCheckBooking',
    //         qs: { code: se.timestamp },
    //         headers:
    //         {
    //         }
    //       };
    //       request(options, function (error, response, body) {
    //         if (error) throw new Error(error);
    //         var rs = JSON.parse(body);
    //         if (rs.StatusBooking == 3) {
    //           var value = { BookingCode: rs.BookingCode, total: se.booking.cost };
    //           this.clearClonePage('page-roompaymentdone');
    //           se.navCtrl.push('RoompaymentdonePage', value);
    //           clearInterval(setInter);
    //         }
    //       });
    //     }, 2000)
    //     var url = "http://lamgio.com/webview/Home/PaymentApp?info=" + JSON.stringify(this.booking1) + "";
    //     this.openWebpage(url);
    //   }
    // })

    // var se = this;
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
    // this.timestamp = Date.now();
    // this.storage.get('jti').then(jti => {
    //   var Invoice=0;
    //     if (se.Roomif.order) {
    //       Invoice=1;
    //     }
    //   if (jti) {
    //     var options = {
    //       method: 'POST',
    //       url: C.urls.baseUrl.urlPost + '/mInsertBooking',
    //       timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    //       headers:
    //       {
    //         'content-type': 'application/json'
    //       },
    //       body:
    //       {
    //         RoomClassObj : se.booking.Hotels.RoomClasses[0].ListObjRoomClass,
    //         CName: se.Roomif.ho + " " + se.Roomif.ten,
    //         CEmail: se.booking.CEmail,
    //         CPhone: se.Roomif.phone,
    //         timestamp: se.timestamp,
    //         HotelID: se.booking.HotelId,
    //         paymentMethod: "1",
    //         note: se.Roomif.notetotal,
    //         source: '1',
    //         MemberId: jti,
    //         Customers: se.Roomif.arrcustomer,
    //         UsePointPrice:se.Roomif.pricepoint,
    //         NoteCorp:se.Roomif.order,
    //         Invoice:Invoice,
    //         UserPoints:se.Roomif.point,
    //         CheckInDate: se.booking.Hotels.CheckInDate,
    //         CheckOutDate: se.booking.Hotels.CheckOutDate,
    //         TotalNight: se.booking.Hotels.TotalNight,
    //         MealTypeIndex : this.booking.indexmealtype
    //       },
    //       json: true
    //     };
    //     console.log(JSON.stringify(options.body));
    //     request(options, function (error, response, body) {
    //       if(response.statusCode != 200){
    //         var objError ={
    //             page: "roompaymentselect-ean",
    //             func: "roompaymentatm",
    //             message : response.statusMessage,
    //             content : response.body,
    //             type: "warning"
    //           };
    //         C.writeErrorLog(objError,response);
    //       }
    //       if (error) {
    //         error.page = "roompaymentselect-ean";
    //         error.func = "roompaymentatm";
    //         C.writeErrorLog(error,response);
    //       };

    //       // var rs = JSON.parse(body);
    //       if (body.error == 0) {
    //         if (se.Roomif.ischeckpoint) {
    //           var pricetemp;
    //           pricetemp=se.booking.cost;
    //           var tempprice =se.booking.cost.replace(/\./g, '').replace(/\,/g, '');
    //           pricetemp=(Number(tempprice)-se.Roomif.pricepoint).toLocaleString();
    //         }
    //         se.book = {
    //           code: body.code,
    //           timestamp: se.timestamp,
    //           cost: pricetemp
    //         }
    //         se.Roomif.setInter = setInterval(function () {
    //           //alert("test")
    //           var options = {
    //             method: 'GET',
    //             url: C.urls.baseUrl.urlPost + '/mCheckBooking',
    //             qs: { code: se.timestamp },
    //             headers:
    //             {
    //             }
    //           };
    //           request(options, function (error, response, body) {
    //             if(response.statusCode != 200){
    //               var objError ={
    //                   page: "roompaymentselect-ean",
    //                   func: "roompaymentatm-mCheckBooking",
    //                   message : response.statusMessage,
    //                   content : response.body,
    //                   type: "warning"
    //                 };
    //               C.writeErrorLog(objError,response);
    //             }
    //             if (error) {
    //               error.page = "roompaymentselect-ean";
    //               error.func = "roompaymentatm-mCheckBooking";
    //               C.writeErrorLog(error,response);
    //             };
    //             var rs = JSON.parse(body);
    //             if (rs.StatusBooking == 3) {
    //               var value = { BookingCode: rs.BookingCode, total: pricetemp };
    //               se.clearClonePage('page-roompaymentdoneean');
    //               se.navCtrl.push('RoompaymentdoneeanPage', value);
    //               clearInterval(se.Roomif.setInter);
    //             }
    //           });
    //         }, 2000)
    //         se.closeLoading();
    //         var url = "http://lamgio.com/webview/Home/PaymentAppEan?info=" + JSON.stringify(se.book) + "";
    //         se.openWebpage(url);
    //       }
    //     });

    //   }
    // })

    // this.iab.create(url,'_self',{ toolbar: 'no'});
    // window.open("http://lamgio.com/webview/Home/PaymentApp?info=" + JSON.stringify(this.booking1) + "");

  }
  roompaymentvisa() {
    this.presentLoading()
    this.timestamp = Date.now();
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
            paymentMethod: "1",
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
        console.log(JSON.stringify(options.body));
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roompaymentselect-ean",
              func: "roompaymentatm",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param:  JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentselect-ean";
            error.func = "roompaymentatm";
            error.param =  JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          if (body) {
            if (body.error == 0) {
              // se.pricetemp = se.booking.cost;
              // if (se.Roomif.ischeckpoint) {
              //   var tempprice = se.booking.cost.replace(/\./g, '').replace(/\,/g, '');
              //   se.pricetemp = (Number(tempprice) - se.Roomif.pricepoint).toLocaleString();
              // }
              // se.book = {
              //   code: body.code,
              //   timestamp: se.timestamp,
              //   cost: se.pricetemp,
              //   paymentType: "0"
              // }
              // se.Roomif.setInter = setInterval(function () {
  
              // }, 2000)
              //se.closeLoading();
              se.book = {
                code: body.code,
                timestamp: se.timestamp,
                cost: se.priceshow,
                paymentType: "0"
              }
              var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppEanNew?code="+body.code+"&timestamp="+se.timestamp+"&cost="+se.priceshow+"&paymentType=0";
              console.log(url);
              se.openWebpage(url);
            }
            else {
              alert(body.Msg);
              se.searchhotel.backPage = "roompaymentselect";
              se.navCtrl.navigateBack('/hoteldetail/'+se.booking.HotelId);
              //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+se.booking.HotelId]);
              //se.refreshToken();
              
              // se.navCtrl.popToRoot();
              // se.app.getRootNav().getActiveChildNav().select(0);
            }
          }else
          {
            error.page = "roompaymentselect-ean";
            error.func = "roompaymentvisa";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
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
              page: "roompaymentselect-ean",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param:  JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentselect-ean";
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
  openWebpage(url: string) {
    var se=this;
    this.safariViewController.isAvailable()
  .then((available: boolean) => {
      if (available) {
        this.safariViewController.show({
          url: url,
          hidden: false,
          animated: false,
          transition: 'curl',
          enterReaderModeIfAvailable: true,
          tintColor: '#23BFD8'
        })
        .subscribe((result: any) => {
            if(result.event === 'opened') console.log('Opened');
            else if(result.event === 'loaded') console.log('Loaded');
            else if(result.event === 'closed') 
            {
              setTimeout(() => {
                var options = {
                  method: 'GET',
                  url: C.urls.baseUrl.urlPost + '/mCheckBooking',
                  qs: { code: se.book.code },
                  headers:
                  {
                  }
                };
                request(options, function (error, response, body) {
                  if (response.statusCode != 200) {
                    var objError = {
                      page: "roompaymentselect-ean",
                      func: "roompaymentatm-mCheckBooking",
                      message: response.statusMessage,
                      content: response.body,
                      type: "warning",
                      param:  JSON.stringify(options)
                    };
                    C.writeErrorLog(objError,response);
                  }
                  if (error) {
                    error.page = "roompaymentselect-ean";
                    error.func = "roompaymentatm-mCheckBooking";
                    error.param =  JSON.stringify(options);
                    C.writeErrorLog(error,response);
                  };
                  var rs = JSON.parse(body);
                  if (rs.StatusBooking == 3) {
                    // var value = { BookingCode: rs.BookingCode, total: se.pricetemp, ischeck: '0' };
                    // se.clearClonePage('page-roompaymentdoneean');
                    // se.navCtrl.navigateForward('RoompaymentdoneeanPage');
                    var id= rs.BookingCode;
                    var total= se.priceshow;
                    se.Roomif.priceshowtt=se.priceshow;
                    var ischeck='0' 
                     se.clearClonePage('page-roompaymentdone');
                     se.loader.dismiss();
                     se.navCtrl.navigateForward('/roompaymentdoneean/'+id+'/'+total+'/'+ischeck);
                    // se.navCtrl.push('HoteldetailPage', value);
                  }
                  else {
                    //se.router.navigateByUrl('/hoteldetail/'+se.booking.HotelId);
                    se.loader.dismiss();
                    //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+se.booking.HotelId]);
                    se.navCtrl.navigateBack('/hoteldetail/'+ se.booking.HotelId);
                    alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
                    se.searchhotel.backPage = "roompaymentselect";
                    //se.refreshToken();
                    //se.navCtrl.push("HoteldetailPage").then(()=>{se.view.dismiss()});
                  }
                });
              },30*1000);
              
            }
            
          },
          (error: any) => console.error(error)
        );

      } else {
        // use fallback browser, example InAppBrowser
      }
    }
  );
  }

    
  // openWebpage(url: string) {
  //   var se = this;
  //   const options: InAppBrowserOptions = {
  //     zoom: 'no',
  //     location: 'yes',
  //     toolbar: 'yes',
  //     hideurlbar: 'yes',
  //     closebuttoncaption: 'Đóng'
  //   };
  //   const browser = this.iab.create('https://beta-olivia.ivivu.com/payment/Home/PaymentAppEanNew?code=IVIVU6000049&timestamp=1557127592372&cost=2.332.000&paymentType=0', '_self', options);
  //   browser.on('exit').subscribe(() => {
  //     var options = {
  //       method: 'GET',
  //       url: C.urls.baseUrl.urlPost + '/mCheckBooking',
  //       qs: { code: se.timestamp },
  //       headers:
  //       {
  //       }
  //     };
  //     request(options, function (error, response, body) {
  //       if (response.statusCode != 200) {
  //         var objError = {
  //           page: "roompaymentselect-ean",
  //           func: "roompaymentatm-mCheckBooking",
  //           message: response.statusMessage,
  //           content: response.body,
  //           type: "warning",
  //           param:  JSON.stringify(options)
  //         };
  //         C.writeErrorLog(objError,response);
  //       }
  //       if (error) {
  //         error.page = "roompaymentselect-ean";
  //         error.func = "roompaymentatm-mCheckBooking";
  //         error.param =  JSON.stringify(options);
  //         C.writeErrorLog(error,response);
  //       };
  //       var rs = JSON.parse(body);
  //       if (rs.StatusBooking == 3) {
  //         // var value = { BookingCode: rs.BookingCode, total: se.pricetemp, ischeck: '0' };
  //         // se.clearClonePage('page-roompaymentdoneean');
  //         // se.navCtrl.navigateForward('RoompaymentdoneeanPage');
  //         var id= rs.BookingCode;
  //         var total= se.pricetemp;
  //         se.Roomif.priceshowtt=se.pricetemp;
  //         var ischeck='0' 
  //          se.clearClonePage('page-roompaymentdone');
  //          se.navCtrl.navigateForward('/roompaymentdoneean/'+id+'/'+total+'/'+ischeck);
  //         // se.navCtrl.push('HoteldetailPage', value);
  //       }
  //       else {
  //         se.router.navigateByUrl('/hoteldetail/'+se.booking.HotelId);
  //         alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
  //         se.searchhotel.backPage = "roompaymentselect";
  //         se.refreshToken();
  //         //se.navCtrl.push("HoteldetailPage").then(()=>{se.view.dismiss()});
  //       }
  //     });
  //   }, err => {
  //     console.error(err);
  //   });
  //   browser.show();
  // }

  roompaymentbreakdow() {
    var dur = this.dur;
    var roomnumber = this.roomnumber;
    this.clearClonePage("page-roompaymentbreakdown");
    this.navCtrl.navigateForward('/roompaymentbreakdown/' + dur + '/' + roomnumber);

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
  // openRoomCancel(){
  //   let modal = this.modalCtrl.create('RoomcanceldatPage',{roomInfo: this.roomcancel});
  //   modal.present();
  // }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback() {
    if (this.book) {
      if (this.book.code) {
        this.clearClonePage('page-hoteldetail');
        clearInterval(this.Roomif.setInter);
        this.searchhotel.backPage = "roompaymentselect-ean";
        // this.navCtrl.push("HoteldetailPage").then(()=>{this.view.dismiss()});
        //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.booking.HotelId]);
        this.navCtrl.navigateBack('/hoteldetail/'+ this.booking.HotelId);
      }
      else {
        this.navCtrl.back();
      }
    }
    else {
      this.navCtrl.back();
    }
  }
  openRoomCancel(){
    this.gf.setParams(this.roomcancel,'roomInfo');
    this.searchhotel.backPage = "roompaymentselect-ean";
    this.navCtrl.navigateForward('/roomcancel');
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
