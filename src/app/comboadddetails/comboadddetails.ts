import { json } from 'body-parser';
import { Bookcombo } from './../providers/book-service';

import { Booking } from '../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import { NavController, ToastController, LoadingController, Platform } from '@ionic/angular';
import { RoomInfo } from '../providers/book-service';
import { C } from '../providers/constants';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
/**
 * Generated class for the RoomadddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-comboadddetails',
  templateUrl: 'comboadddetails.html',
  styleUrls: ['comboadddetails.scss'],
})
export class ComboadddetailsPage implements OnInit {
  hoten; phone = ""; note; arr; roomnumber; room; ischeck: boolean; ishide;
  companyname; address; tax; addressorder; bed; bedchuoi; priceshow; ischeckpoint; ischeckbtn
  timestamp; paymentMethod; jsonroom; ischeckpayment; public loader: any; listcars; email; totalAdult
  ngOnInit() {
  }
  constructor(public platform: Platform, public navCtrl: NavController, public zone: NgZone,
    private toastCtrl: ToastController, public Roomif: RoomInfo, public storage: Storage, public loadingCtrl: LoadingController,
    public booking: Booking, public gf: GlobalFunction, public Bookcombo: Bookcombo) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.totalAdult = Bookcombo.totalAdult;
    this.listcars = this.gf.getParams('carscombo');
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    this.storage.get('infocus').then(infocus => {
      if (infocus) {
        if (infocus.ho && infocus.ten) {
          this.hoten = infocus.ho + ' ' + infocus.ten;
        } else {
          if (infocus.ho) {
            this.hoten = infocus.ho;
          }
          else if (infocus.ten) {
            this.hoten = infocus.ten;
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
      if (this.listcars.HotelBooking.TotalPrices == "0") {
        this.priceshow = 0;
      }
      else {
        this.priceshow = 1;
      }

    }
    else {
      this.ischeckbtn = true;
      if (this.Roomif.promocode) {
        if (this.listcars.HotelBooking.TotalPrices == "0") {
          this.priceshow = 0;
          this.ischeckbtn = false;
        }
        else {
          this.priceshow = 1;
        }
      }
      else {
        this.priceshow = 1;
      }
    }
    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    //google analytic
  }
  insertbooking() {
    var se = this;
    var form = this.listcars;
    form.HotelBooking.PaymentMethod="51"
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboTransferBooking',
      headers:
      {
      },
      form
    };
    request(options, function (error, response, body) {
      var obj = JSON.parse(body);
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDComboTransfer',
        headers:
          {},
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
          var ischeck = '1';
          se.Roomif.priceshowtt = '0';
          var total = 0;
          se.loader.dismiss();
          if (se.Roomif.payment == "AL") {
            se.navCtrl.navigateForward('/combodoneprepay/' + obj.Code + '/' + total + '/' + ischeck);
          }
          else {
            se.navCtrl.navigateForward('/combodone/' + obj.Code);
          }
        }
      });
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
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          this.Roomif.notetotal = this.note;
          this.Roomif.ischeck = this.ischeck;
          this.listcars.HotelBooking.Note = this.note;
          this.listcars.HotelBooking.CompName = this.companyname;
          this.listcars.HotelBooking.CompAddress = this.address;
          this.listcars.HotelBooking.CompTaxCode = this.tax;
          this.listcars.HotelBooking.CAddress = this.addressorder;
          this.listcars.HotelBooking.IsInvoice = 1;
          //xử lý tiếp ở đây
          // this.postapibook();
          if (this.priceshow > 0) {
            //this.loader.dismiss();
            this.navCtrl.navigateForward("combopayment");
          } else {
            this.postapibook();
          }
        } else {
          this.presentToastOrder();
        }

      } else {
        this.presentToastPhone();
      }

    } else {
      if (this.phonenumber(this.phone)) {
        this.Roomif.hoten = this.hoten;
        this.Roomif.phone = this.phone;
        this.Roomif.notetotal = this.note;
        this.Roomif.ischeck = this.ischeck;
        this.clearClonePage('page-roompaymentselect');
        this.Roomif.notetotal = this.note;
        this.listcars.HotelBooking.Note = this.note;
        //this.postapibook();
        if (this.priceshow > 0) {
          //this.loader.dismiss();
          this.navCtrl.navigateForward("combopayment");
        } else {
          this.postapibook();
        }
        //this.navCtrl.navigateForward("combopayment");
      } else {
        this.presentToastPhone();
      }

    }
  }
  postapibook1() {
    var se = this;
    se.presentLoading();
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/reserve-transfer-seat',
      headers:
      {
        apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
        apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
      },
      body:
      {

        trip_code: this.listcars.TransferBooking.departTransfer.TransferNumber,
        seats: this.totalAdult,
        customer_phone: this.phone,
        customer_name: this.hoten,
        customer_email: 'tc@ivivu.com',
        coupon: "",
        pickup_id: this.listcars.TransferBooking.departTransfer.PickupPlaceCode,
        pickup: this.listcars.TransferBooking.departTransfer.PickupPlaceName,
        drop_off_id: this.listcars.TransferBooking.departTransfer.DropoffPlaceCode,
        drop_off: this.listcars.TransferBooking.departTransfer.DropoffPlaceName
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
          if (se.priceshow > 0) {
            se.loader.dismiss();
            se.navCtrl.navigateForward("combopayment");
          } else {
            se.insertbooking();
          }

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
          total_price: this.Bookcombo.pricedep,
          code: '',
          dropoff_place: "",
          pickup_place: ""
        },
        returnParams:
        {
          trip_code: this.listcars.TransferBooking.returnTransfer.TransferNumber,
          total_seats: this.totalAdult,
          total_price: this.Bookcombo.priceret,
          code: '',
          pickup_place: '',
          dropoff_place: ''
        },
        customer_phone: this.phone,
        customer_name: this.hoten,
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
          se.insertbooking();
          // if (se.priceshow > 0) {
          //   se.loader.dismiss();
          //   se.navCtrl.navigateForward("combopayment");
          // } else {
          //     se.insertbooking();
          // }

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
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          this.Roomif.notetotal = this.note;
          this.Roomif.ischeck = this.ischeck;
          this.listcars.HotelBooking.Note = this.note;
          this.listcars.HotelBooking.CompName = this.companyname;
          this.listcars.HotelBooking.CompAddress = this.address;
          this.listcars.HotelBooking.CompTaxCode = this.tax;
          this.listcars.HotelBooking.CAddress = this.addressorder;
          this.listcars.HotelBooking.IsInvoice = 1;
          // this.postapibook();
          if (this.priceshow > 0) {
            //this.loader.dismiss();
            this.navCtrl.navigateForward("combopayment");
          } else {
            this.postapibook();
          }
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
        this.Roomif.notetotal = this.note;
        this.listcars.HotelBooking.Note = this.note;
        //this.postapibook();
        if (this.priceshow > 0) {
          //this.loader.dismiss();
          this.navCtrl.navigateForward("combopayment");
        } else {
          this.postapibook();
        }
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
            source: '8',
            MemberToken: auth_token,
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
            promotionCode: se.Roomif.promocode

          },
          json: true
        };
        //console.log(JSON.stringify(options.body));
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "comboadddetails",
              func: "pushdata",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError, response);
          }
          if (error) {
            error.page = "comboadddetails";
            error.func = "pushdata";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
          };
          // var rs = JSON.parse(body);
          if (body.error == 0) {
            //console.log(body.code);
            // var value = { BookingCode: body.code, total: se.Roomif.pricepoint ,ischeck:'1'};
            //se.closeLoading();
            var id = body.code;
            var total = se.Roomif.pricepoint;
            var ischeck = '1'
            se.clearClonePage('page-comboadddetails');
            se.loader.dismiss();
            se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
          }
          else {
            se.loader.dismiss();
            alert(body.Msg);
            //se.refreshToken();
            //se.navCtrl.popToRoot();
            //se.app.getRootNav().getActiveChildNav().select(0);
          }
        });

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
      message: "Số điện thoại không hợp lệ. Xin vui lòng nhập lại.",
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

  phonenumber(inputtxt) {
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
  }
  goback() {
    this.navCtrl.back();
  }
  paymentnotAL() {
    this.presentLoading();
    var se = this;
    se.jsonroom.RoomClasses = se.room;
    se.timestamp = Date.now();
    se.storage.get('auth_token').then(auth_token => {
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
            source: '8',
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
            promotionCode: se.Roomif.promocode
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
            C.writeErrorLog(objError, response);
          }
          if (error) {
            error.page = "roomadddetails";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
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
    })

  }
}
