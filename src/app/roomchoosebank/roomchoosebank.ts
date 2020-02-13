import { Booking, RoomInfo, SearchHotel,Bookcombo } from '../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController,Platform } from '@ionic/angular';
import { C } from '../providers/constants';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
/**
 * Generated class for the RoomchoosebankPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roomchoosebank',
  templateUrl: 'roomchoosebank.html',
  styleUrls: ['roomchoosebank.scss'],
})
export class RoomchoosebankPage implements OnInit{ 
  ischeck; timestamp;public ischeckbox;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; ischecktext = true
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1; checkpayment; book; id; pricetemp; hotelid;loader:any
  auth_token: any;
  constructor(public navCtrl: NavController,public bookcombo:Bookcombo, private toastCtrl: ToastController, public booking: Booking, private iab: InAppBrowser,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController, public platform: Platform, public gf: GlobalFunction,private safariViewController: SafariViewController) {
    this.indexme = booking.indexmealtype;
    this.indexroom = booking.indexroom;
    this.jsonroom = Roomif.jsonroom;
    this.room = Roomif.arrroom;
    this.searchhotel.rootPage="roomchoosebank";
    //google analytic
    gf.googleAnalytion('roomchoosebank', 'load', '');
  }
  ngOnInit() {
  }
  
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
      })
  }
  next() {
    if (this.ischeck) {
      if (this.id) {
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
        this.jsonroom.RoomClasses=this.room;
        this.timestamp = Date.now();
        //this.storage.get('auth_token').then(auth_token => {
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
                paymentMethod: "0",
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
                MealTypeIndex: this.booking.indexmealtype,
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
                  page: "roompaymentselect",
                  func: "roompaymentatm",
                  message: response.statusMessage,
                  content: response.body,
                  type: "warning",
                  param:  JSON.stringify(options)
                };
                C.writeErrorLog(objError,response);
              }
              if (error) {
                error.page = "roompaymentselect";
                error.func = "roompaymentatm";
                error.param =  JSON.stringify(options);
                C.writeErrorLog(error,response);
              };
              if (body) {
                if (body.error == 0) {
                  se.priceshow = se.booking.cost;
                  if (se.Roomif.priceshow) {
                    se.priceshow=se.Roomif.priceshow;
                  }
                  se.book = {
                    code: body.code,
                    timestamp: se.timestamp,
                    cost: se.priceshow,
                    BanhkID: se.id,
                    paymentType: "1"
                  }
                  
                  var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppEanNew?code="+body.code+"&timestamp="+se.timestamp+"&cost="+se.priceshow+"&BankID="+se.id+"&paymentType=1";
                  se.openWebpage(url);
                }
                else {
                  se.loader.dismiss();
                  alert(body.Msg);
                }
              }
              else
              {
                error.page = "roomchoosebank";
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

      } else {
        this.presentToast();
      }
    } else {
      this.ischecktext = false;
    }


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
              se.navCtrl.navigateBack('/hoteldetail/' + se.booking.HotelId);
              //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+se.booking.HotelId]);
            })
          }
        })
      }
    })
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin chọn 1 ngân hàng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
  //   const browser = this.iab.create(url, '_self', options);
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
  //           page: "roomchoosebank",
  //           func: "roomchoosebank-mCheckBooking",
  //           message: response.statusMessage,
  //           content: response.body,
  //           type: "warning",
  //           param:  JSON.stringify(options)
  //         };
  //         C.writeErrorLog(objError,response);
  //       }
  //       if (error) {
  //         error.page = "roomchoosebank";
  //         error.func = "roomchoosebank-mCheckBooking";
  //         error.param =  JSON.stringify(options);
  //         C.writeErrorLog(error,response);
  //       };
  //       var rs = JSON.parse(body);
  //       if (rs.StatusBooking == 3) {
  //         var id = rs.BookingCode;
  //         var total = se.pricetemp;
  //         se.Roomif.priceshowtt=se.pricetemp;
  //         var ischeck = '0'
  //         se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
  //       }
  //       else {
  //         se.searchhotel.backPage = "roompaymentselect";
  //         se.refreshToken();
  //         se.navCtrl.navigateForward('/hoteldetail/'+se.booking.HotelId);
  //         alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
          
  //       }
  //     });
  //   }, err => {
  //     console.error(err);
  //   });
  //   browser.show();

  // }
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
                      page: "roomchoosebank",
                      func: "roomchoosebank-mCheckBooking",
                      message: response.statusMessage,
                      content: response.body,
                      type: "warning",
                      param:  JSON.stringify(options)
                    };
                    C.writeErrorLog(objError,response);
                  }
                  if (error) {
                    error.page = "roomchoosebank";
                    error.func = "roomchoosebank-mCheckBooking";
                    error.param =  JSON.stringify(options);
                    C.writeErrorLog(error,response);
                  };
                  if (body) {
                    var rs = JSON.parse(body);
                    if (rs.StatusBooking == 3) {
                      var id = rs.BookingCode;
                      var total = se.priceshow;
                      se.Roomif.priceshowtt=se.priceshow;
                      var ischeck = '0';

                      se.loader.dismiss();
                      se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
                    }
                    else {
                      alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
                      se.loader.dismiss();
                      se.searchhotel.backPage = "roompaymentselect";
                      //se.refreshToken();
                      se.navCtrl.navigateBack('/hoteldetail/'+se.booking.HotelId);
                      //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+se.booking.HotelId]);
                    }
                  }
                  else{
                    error.page = "roomchoosebank";
                    error.func = "next";
                    error.param = JSON.stringify(options);
                    C.writeErrorLog(error, response);
                    se.loader.dismiss();
                    alert("Đã có sự cố xảy ra, vui lòng thử lại!");
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

  clickitem(id) {
    this.zone.run(() => {
      this.id = id;
    })
  }
  ionViewDidLoad() {
    // this.navBar.backButtonClick = (e: UIEvent) => {
    //   // todo something
    //   //this.navCtrl.push("RoomadddetailsPage");
    //   if (this.book) {
    //     if (this.book.code) {
    //       this.clearClonePage('page-hoteldetail');
    //       clearInterval(this.Roomif.setInter);
    //       this.searchhotel.rootPage = "roompaymentselect";
    //       this.navCtrl.navigateForward("HoteldetailPage");
    //     }
    //     else {
    //       this.navCtrl.pop();
    //     }
    //   }
    //   else {
    //     this.navCtrl.pop();
    //   }
   
  }
  edit() {
    this.zone.run(()=>{
      if (this.ischeck) {
        this.ischecktext = true;
      } else {
        this.ischecktext = false;
      }
    })
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  goback() {
    this.navCtrl.back();
  }
  test()
  {
    this.safariViewController.isAvailable()
    .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: 'https://www.ivivu.com/dieu-kien-dieu-khoan#_ga=2.57476458.1764320674.1515981153-1221826856.1508314634&amp;_gac=1.220489260.1514193346.EAIaIQobChMIt66T4Omk2AIV0UQrCh1dIwosEAEYASAAEgI48PD_BwE',
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
  async presentLoadingDetail() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
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
