import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Platform } from '@ionic/angular';
import { C } from '../providers/constants';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { GlobalFunction } from '../providers/globalfunction';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { Bookcombo } from './../providers/book-service';
@Component({
  selector: 'app-combochoosebank',
  templateUrl: './combochoosebank.page.html',
  styleUrls: ['./combochoosebank.page.scss'],
})
export class CombochoosebankPage implements OnInit {

  ischeck; timestamp; public ischeckbox; listcars; id; book; priceshow; ischecktext
  public loader: any;hoten;phone;totalAdult;email
  constructor(public navCtrl: NavController, private toastCtrl: ToastController, public booking: Booking, private iab: InAppBrowser,
    public Roomif: RoomInfo, public storage: Storage, public zone: NgZone, public searchhotel: SearchHotel,
    public loadingCtrl: LoadingController, public platform: Platform, public gf: GlobalFunction,public bookCombo:Bookcombo,private safariViewController: SafariViewController) {
    this.searchhotel.rootPage = "combochoosebank";
    this.listcars = this.gf.getParams('carscombo');
    this.hoten=this.Roomif.hoten;
      this.phone=this.Roomif.phone
      this.totalAdult = bookCombo.totalAdult;
    this.priceshow=this.listcars.HotelBooking.TotalPrices.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    //google analytic
    gf.googleAnalytion('roomchoosebank', 'load', '');
  }
  ngOnInit() {
  }
  postapibook() {
    var se = this;
    se.presentLoading();
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/booking',
      headers:
      {
        apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
        apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
      },
      body:
      {
        departParams:
        {
          trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
          total_seats: this.totalAdult,
          total_price: this.bookCombo.pricedep,
          code: '',
          dropoff_place: "",
          pickup_place: ""
        },
        returnParams:
        {
          trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
          total_seats: this.totalAdult,
          total_price: this.bookCombo.priceret,
          code: '',
          pickup_place: '',
          dropoff_place: ''
        },
        customer_phone: se.phone,
        customer_name: se.hoten,
        customer_email: 'tc@ivivu.com',
        pay_status: 0
      },
      json: true
    };
    request(options, function (error, response, body) {
      if (body.status == 0) {
        var json = body.data;
        if (json.length > 0) {
          se.listcars.TransferBooking.departTransfer.ReservedTickets = JSON.stringify(json[0].data.reserve_Tickets);
          se.listcars.TransferBooking.returnTransfer.ReservedTickets = JSON.stringify(json[1].data.reserve_Tickets);
          var Seatsde = json[0].data.seats;
          var Seatsre = json[1].data.seats;
          var seatstextde = "";
          var seatstextre = "";
          for (let i = 0; i < Seatsde.length; i++) {
            if (i == Seatsde.length - 1) {
              seatstextde = seatstextde + Seatsde[i].seat_code;
            }
            else {
              seatstextde = seatstextde + Seatsde[i].seat_code + ',';
            }
          }
          for (let i = 0; i < Seatsre.length; i++) {
            if (i == Seatsre.length - 1) {
              seatstextre = seatstextre + Seatsre[i].seat_code;
            }
            else {
              seatstextre = seatstextre + Seatsre[i].seat_code + ',';
            }
          }
          se.listcars.TransferBooking.departTransfer.Seats = seatstextde;
          se.listcars.TransferBooking.returnTransfer.Seats = seatstextre;
          // se.listcars.TransferBooking.departTransfer.CancelPolicy = seatstextde;
          // se.listcars.TransferBooking.returnTransfer.CancelPolicy = seatstextre;
          var textfullname = se.hoten.split(' ')
          var FirstName;
          var LastName;
          if (textfullname.length > 2) {
            let name = '';
            for (let i = 1; i < textfullname.length; i++) {
              if (i == 1) {
                name += textfullname[i];
              } else {
                name += ' ' + textfullname[i];
              }
            }
            FirstName = textfullname[0];
            LastName = name;
          } else if (textfullname.length > 1) {
            FirstName = textfullname[0];
            LastName = textfullname[1];
          }
          else if (textfullname.length == 1) {
            FirstName = textfullname[0];
            LastName = "";
          }
          se.listcars.TransferBooking.passengerInfo.FirstName = FirstName;
          se.listcars.TransferBooking.passengerInfo.LastName = LastName;
          se.listcars.TransferBooking.passengerInfo.Email = se.email;
          se.listcars.TransferBooking.passengerInfo.MobileNumber = se.phone;
          se.listcars.HotelBooking.CPhone = se.phone;
          se.listcars.HotelBooking.LeadingName = se.hoten;
          se.listcars.HotelBooking.LeadingEmail = se.email;
          se.listcars.HotelBooking.LeadingPhone = se.phone;
          se.next();

        } else {
          se.loader.dismiss();
          alert("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
        }
      }
      else {
        se.loader.dismiss();
        alert("Không còn ghế xe, vui lòng chọn Nhà xe khác!");
      }

    });
  }
  next() {
    if (this.ischeck) {
      if (this.id) {
        //this.presentLoading()
        this.timestamp = Date.now();
        this.storage.get('auth_token').then(auth_token => {
          if (auth_token) {
            this.timestamp = Date.now();
            var se = this;
            var form = this.listcars;
            form.HotelBooking.PaymentMethod="0"
            var options = {
              method: 'POST',
              url: C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboTransferBooking',
              headers:
              {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              form
            };
            request(options, function (error, response, body) {
              var obj = JSON.parse(body);
              var options = {
                method: 'POST',
                url: C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDComboTransfer',
                headers:
                {
                  'Content-Type': 'application/x-www-form-urlencoded'
                },
                form:
                {
                  BookingCode: obj.Code,
                  DepartATCode: obj.TransferReserveCode.DepartReserveCode,
                  ReturnATCode: obj.TransferReserveCode.ReturnReserveCode,
                  FromPlaceCode: se.listcars.TransferBooking.fromPlaceCode
                }
              };
              request(options, function (error, response, body) {
                if (error) throw new Error(error);
                se.loader.dismiss();
                var json = JSON.parse(body);
                if (json.Error == 0) {
                  //se.navCtrl.navigateForward('/combodone/'+obj.Code);
                  se.book = {
                    code: obj.Code,
                    timestamp: se.timestamp,
                    cost: se.priceshow,
                    BanhkID: se.id,
                    paymentType: "1",
                    DepartATCode: obj.TransferReserveCode.DepartReserveCode,
                    ReturnATCode: obj.TransferReserveCode.ReturnReserveCode
                  }
                  var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppComboios?code="+obj.Code+"&timestamp="+se.timestamp+"&cost="+se.priceshow+"&DepartATCode="+obj.TransferReserveCode.DepartReserveCode+"&ReturnATCode="+obj.TransferReserveCode.ReturnReserveCode+"&BankID="+se.id+"&paymentType=1";
                  se.openWebpage(url);
                }
              });
            })
          }
        })

      } else {
        this.presentToast();
      }
    } else {
      this.ischecktext = false;
    }
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin chọn 1 ngân hàng",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  openWebpage1(url: string) {
    var se = this;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng'
    };
    const browser = this.iab.create(url, '_self', options);
    browser.on('exit').subscribe(() => {
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
            param: JSON.stringify(options)
          };
          C.writeErrorLog(objError, response);
        }
        if (error) {
          error.page = "roomchoosebank";
          error.func = "roomchoosebank-mCheckBooking";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error, response);
        };
        var rs = JSON.parse(body);
        if (rs.StatusBooking == 3) {
          var id = rs.BookingCode;
          var total = se.priceshow;
          se.Roomif.priceshowtt = se.priceshow;
          var ischeck = '0';
          se.loader.dismiss();
          se.navCtrl.navigateForward('/combodoneprepay/'+id+'/'+total+'/'+ischeck)
        }
        else {
          se.loader.dismiss();
          se.searchhotel.backPage = "roompaymentselect";
          //se.refreshToken();
          alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
          se.navCtrl.navigateBack('/hoteldetail/'+se.booking.HotelId);
          //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/' + se.booking.HotelId]);
        }
      });
    }, err => {
      console.error(err);
    });
    browser.show();

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
                    param: JSON.stringify(options)
                  };
                  C.writeErrorLog(objError, response);
                }
                if (error) {
                  error.page = "roomchoosebank";
                  error.func = "roomchoosebank-mCheckBooking";
                  error.param = JSON.stringify(options);
                  C.writeErrorLog(error, response);
                };
                var rs = JSON.parse(body);
                if (rs.StatusBooking == 3) {
                  var id = rs.BookingCode;
                  var total = se.priceshow;
                  se.Roomif.priceshowtt = se.priceshow;
                  var ischeck = '0';
                  se.loader.dismiss();
                  se.navCtrl.navigateForward('/combodoneprepay/'+id+'/'+total+'/'+ischeck)
                }
                else {
                  se.loader.dismiss();
                  se.searchhotel.backPage = "roompaymentselect";
                  //se.refreshToken();
                  alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
                  se.navCtrl.navigateBack('/hoteldetail/'+se.booking.HotelId);
                  //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/' + se.booking.HotelId]);
        
                }
              });
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
    this.zone.run(() => {
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
}
