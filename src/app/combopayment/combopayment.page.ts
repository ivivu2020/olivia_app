import { Bookcombo } from './../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, ModalController, LoadingController,Platform } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import { AuthService } from '../providers/auth-service';
import * as request from 'requestretry';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { C } from '../providers/constants';
import { Storage } from '@ionic/storage';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
@Component({
  selector: 'app-combopayment',
  templateUrl: './combopayment.page.html',
  styleUrls: ['./combopayment.page.scss'],
})
export class CombopaymentPage implements OnInit {
  departtime;
  timestamp;
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; textage = "";arrchild;
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr;priceshow
  imgroom; roomtype; indexme; indexroom; cin1; cout1;checkpayment;book;roomcancel;hotelid
  pricetemp;public loader:any;titlecombo;  departTicketSale; departTicketSaleshow; loadpricedone = false;
  returnTicketSale; returnTicketSaleshow; checkdiscountdepart; checkdiscountreturn; departObject; returnObject;
  departDateTimeStr: string;
  returnDateTimeStr: string;
  departTimeStr: string;
  returnTimeStr: string;
  departVehicleStr: any;
  returnVehicleStr: any;listcars;fromPlace;totalAdult;hoten;phone;email
  constructor(public platform: Platform,public searchhotel:SearchHotel,public navCtrl: NavController,
    public storage: Storage, public Roomif: RoomInfo, private iab: InAppBrowser, public booking1: Booking, 
    public booking: Booking, public authService: AuthService,public modalCtrl: ModalController, public loadingCtrl: LoadingController,
    public gf: GlobalFunction, public zone: NgZone,private router: Router,private bookCombo:Bookcombo,private safariViewController: SafariViewController) {
      this.listcars = this.gf.getParams('carscombo');
      
      this.priceshow=this.listcars.HotelBooking.TotalPrices.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      this.hoten=this.Roomif.hoten;
      this.phone=this.Roomif.phone
      this.totalAdult = bookCombo.totalAdult;
      this.Avatar = Roomif.imgHotel;
      this.Name = booking.HotelName;
      this.Address = Roomif.Address;
      this.cin = booking.CheckInDate;
      this.cout = booking.CheckOutDate;
      this.dur = moment(this.cout).diff(moment(this.cin), 'days');
      this.roomnumber = this.searchhotel.roomnumber;
      this.adults = booking.Adults;
      this.children = booking.Child;
      this.roomtype = Roomif.roomtype;
      this.jsonroom = Roomif.jsonroom;
      this.room = Roomif.arrroom;
      var chuoicin = this.cin.split('-');
      var chuoicout = this.cout.split('-');
      this.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
      this.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
      this.nameroom = this.room[0].ClassName;
      this.breakfast = (this.bookCombo.MealTypeCode == 'CUS' ? 'Ăn 3 bữa' : this.bookCombo.MealTypeName);
      this.titlecombo = this.bookCombo.ComboTitle;
      this.arrchild = this.searchhotel.arrchild;
      this.departObject=this.bookCombo.departObjectCar;
      this.returnObject=this.bookCombo.returnObjectCar;
      this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
      this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
      this.fromPlace=this.bookCombo.ComboDetail.comboDetail.departurePlace;
      if (this.arrchild) {
        for (let i = 0; i < this.arrchild.length; i++) {
          if (i == this.arrchild.length - 1) {
            this.textage = this.textage + this.arrchild[i].numage;
          } else {
            this.textage = this.textage + this.arrchild[i].numage + ",";
          
          }
        }
        if (this.textage) {
          this.textage = "(" + this.textage + ")";
        }
      }
    this.searchhotel.backPage="roompaymentselect";
    this.searchhotel.rootPage="roompaymentselect-ean";
    this.checkpayment=Roomif.payment;
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
        this.loadTransferInfo();
      }
    })
    //google analytic
    gf.googleAnalytion('roompaymentselect','load','');
    
  }
  ngOnInit() {
  }
  roompaymentbank() {
    clearInterval(this.Roomif.setInter);
    this.clearClonePage('page-roompaymentbank');
    this.navCtrl.navigateForward("/combocarbank");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect','roompaymentbankselect','');
  }
  roompaymentlive() {
    clearInterval(this.Roomif.setInter);
    this.clearClonePage('page-roompaymentlive');
    this.navCtrl.navigateForward("/combocarlive");
    //google analytic
    this.gf.googleAnalytion('roompaymentselect','roompaymentliveselect','');
  }
  roompaymentatm() {
    this.navCtrl.navigateForward("/combochoosebank")
    //google analytic
    this.gf.googleAnalytion('combopayment','combopayment','');
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
          se.roompaymentvisa();

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
  roompaymentvisa() {
    this.timestamp = Date.now();
    var se = this;
    var form = this.listcars;
    form.HotelBooking.PaymentMethod="0"
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateComboTransferBooking',
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
        url: C.urls.baseUrl.urlContracting+'/api/ToolsAPI/CreateTransactionIDComboTransfer',
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
        var json=JSON.parse(body);
        if (json.Error==0) {
          //se.navCtrl.navigateForward('/combodone/'+obj.Code);
          se.book = {
            code: obj.Code,
            timestamp: se.timestamp,
            cost: se.priceshow,
            paymentType:"0",
            DepartATCode:obj.TransferReserveCode.DepartReserveCode,
            ReturnATCode:obj.TransferReserveCode.ReturnReserveCode
          }
          var url = C.urls.baseUrl.urlPayment + "/Home/PaymentAppComboios?code="+obj.Code+"&timestamp="+se.timestamp+"&cost="+se.priceshow+"&DepartATCode="+obj.TransferReserveCode.DepartReserveCode+"&ReturnATCode="+obj.TransferReserveCode.ReturnReserveCode+"&paymentType=0";
           se.openWebpage(url);
        }
      });
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
              var options = {
                method: 'GET',
                url: C.urls.baseUrl.urlPost + '/mCheckBooking',
                qs: { code:  se.book.code },
                headers:
                {
                }
              };
              request(options, function (error, response, body) {
                if(response.statusCode != 200){
                  var objError ={
                      page: "roompaymentselect",
                      func: "roompaymentatm-mCheckBooking",
                      message : response.statusMessage,
                      content : response.body,
                      type: "warning",
                      para:  JSON.stringify(options)
                    };
                  C.writeErrorLog(objError,response);
                }
                if (error) {
                  error.page="roompaymentselect";
                  error.func="roompaymentatm-mCheckBooking";
                  error.param =  JSON.stringify(options);
                  C.writeErrorLog(error,response);
                };
                var rs = JSON.parse(body);
                if (rs.StatusBooking == 3) {
                 var  id= rs.BookingCode;
                 var total= se.priceshow;
                 se.Roomif.priceshowtt=se.priceshow;
                 var ischeck='0' ;
                  se.loader.dismiss();
                  se.navCtrl.navigateForward('/combodoneprepay/'+id+'/'+total+'/'+ischeck)
                }
                else
                {
                  se.loader.dismiss();
                  se.searchhotel.backPage = "roompaymentselect";
                  alert("Hiện tại, giao dịch của bạn hết hiệu lực, xin vui lòng quay lại trang Thông tin Khách Sạn!");
                  //se.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+se.booking.HotelId]);
                  se.navCtrl.navigateBack('/hoteldetail/'+ se.booking.HotelId);
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
  openWebpage1(url: string) {
    var se=this;
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng'
    };
    const browser = this.iab.create(url, '_self', options);
    browser.on('exit').subscribe(() => {
      
    })
   
    browser.show();
  }
  goback(){
    if (this.book) {
      if (this.book.code) {
        this.clearClonePage('page-hoteldetail');
        clearInterval(this.Roomif.setInter);
        this.searchhotel.backPage="roompaymentselect";
        // this.navCtrl.push("HoteldetailPage").then(()=>{this.view.dismiss()});
        //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.booking.HotelId]);
        this.navCtrl.navigateBack('/hoteldetail/'+ this.booking.HotelId);
      }
      else
      {
        this.navCtrl.back();
      }
    }
    else
    {
      this.navCtrl.back();
    }
  }

  
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
  openRoomCancel(){
    this.gf.setParams(this.roomcancel,'roomInfo')
    this.searchhotel.backPage ="roompaymentselect";
    this.navCtrl.navigateForward('/roomcancel');
  }
  loadTransferInfo() {
    var se = this;
    //bind thông tin chiều đi

      let de_date = this.departObject.route.departure_date;
      se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      se.departTimeStr = this.listcars.TransferBooking.departTransfer.DepartTime + ' → ' + this.listcars.TransferBooking.departTransfer.ArrivalTime ;
      se.departVehicleStr = this.departObject.company.name;
      this.departTicketSaleshow = this.departObject.route.schedules[0].fare.price - this.departTicketSale;
      if (this.departTicketSaleshow <= 0) {
        this.checkdiscountdepart = true;
        this.departTicketSaleshow = Math.abs(this.departTicketSaleshow);
      }
      else {
        this.checkdiscountdepart = false;
      }
      this.departTicketSaleshow = this.departTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    

    //bind thông tin chiều về

      let re_date = this.returnObject.route.departure_date;
      se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
      se.returnTimeStr = this.listcars.TransferBooking.returnTransfer.DepartTime + ' → ' + this.listcars.TransferBooking.returnTransfer.ArrivalTime ;
      se.returnVehicleStr = this.returnObject.company.name;
      this.returnTicketSaleshow = this.returnObject.route.schedules[0].fare.price - this.returnTicketSale;
      if (this.returnTicketSaleshow <= 0) {
        this.checkdiscountreturn = true;
        this.returnTicketSaleshow = Math.abs(this.returnTicketSaleshow);
      }
      else {
        this.checkdiscountreturn = false;
      }
      this.returnTicketSaleshow = this.returnTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    
  }
  getDayOfWeek(date): string {
    let coutthu = moment(date).format('dddd');
    switch (coutthu) {
      case "Monday":
        coutthu = "thứ 2"
        break;
      case "Tuesday":
        coutthu = "thứ 3"
        break;
      case "Wednesday":
        coutthu = "thứ 4"
        break;
      case "Thursday":
        coutthu = "thứ 5"
        break;
      case "Friday":
        coutthu = "thứ 6"
        break;
      case "Saturday":
        coutthu = "thứ 7"
        break;
      default:
        coutthu = "Chủ nhật"
        break;
    }
    return coutthu;
  }
}
