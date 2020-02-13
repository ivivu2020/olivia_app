import { CombocarchangeplacePage } from './../combocarchangeplace/combocarchangeplace.page';
import { ValueGlobal } from './../providers/book-service';
import { RequestCombo1Page } from './../requestcombo1/requestcombo1';
import { CardeparturePage } from './../cardeparture/cardeparture.page';
import { Component, OnInit, NgZone } from '@angular/core';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { NavController, ActionSheetController, AlertController, ModalController, LoadingController } from '@ionic/angular';
import { Bookcombo, Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import * as moment from 'moment';
import { OverlayEventDetail } from '@ionic/core';
import { NetworkProvider } from './../network-provider.service';
import { AdddiscountPage } from './../adddiscount/adddiscount.page';
import * as $ from 'jquery';
@Component({
  selector: 'app-combocarnew',
  templateUrl: './combocarnew.page.html',
  styleUrls: ['./combocarnew.page.scss'],
})
export class CombocarnewPage implements OnInit {
  username: any; public loader: any;
  email: any;
  infant: number;
  Avatar: string;
  Name: string;
  Address: string;
  cin: string;
  cout: string;
  cinshow: string;
  coutshow: string;
  duration: any;
  TotalNight: any;
  dur: string;
  roomnumber: number;
  adults: any;
  totalAdult: any;
  children: any = 0;
  totalChild: any;
  roomtype: any;
  jsonroom;
  room: any;
  nameroom: any;
  breakfast: string;
  titlecombo: string;
  totalInfant: number = 0;
  arrchild: any;
  childrendisplay: any;
  adulsdisplay: any;
  textage = "";
  textagepost = "";
  paxtitle: string;
  fromPlace = 'Hồ Chí Minh';
  titlecomboprice: any;
  PriceAvgPlusTAStr: any;
  comboId: any;
  fromId: number;
  toId: number;
  listDepartTransfers: any = [];
  listReturnTransfers: any = [];
  intervalID: NodeJS.Timeout;
  listkeys: any = [];
  departTime: any[];//giờ đón tốt nhất
  returnTime: any[];//giờ trả tốt nhất
  departDateTimeStr: string;
  returnDateTimeStr: string;
  departTimeStrd: string;
  departTimeStrt: string;
  returnTimeStrd: string;
  returnTimeStrt: string;
  departVehicleStr: any;
  returnVehicleStr: any;
  departTicketSale; departTicketSaleshow; loadpricedone = false; pricedepart = 0; pricereturn = 0;
  returnTicketSale; returnTicketSaleshow; checkdiscountdepart; checkdiscountreturn; departObject; returnObject; AdultCombo = 0;
  adultCombo = 2; Commission; totalExtraBedAndGalaDinerListTA
  daydeparttitle; dayreturntitle; current; total; elementMealtype; PriceAvgPlusTA; TravPaxPrices; transferdetailreturn; transferdetaildepart
  totalAdultExtrabed = 0;
  ChildOtherFeeTotal = 0;
  ChildOtherFee = 0;
  AdultOtherFee = 0;
  roomPriceSale = 0;
  PriceDiffUnit = 0;
  adultFlightNumber = 0;
  indexdep = 0;
  indexret = 0;
  JsonSurchargeFee =
    {
      RoomDifferenceFee: 0,
      AdultUnit: 0,
      TransportPriceSale: 0,
      DepartTicketDifferenceFee: 0,
      ReturnTicketDifferenceFee: 0,
      ExtraTicketDifferenceFee: 0,
      AllExtraTicketDifference: {},
      BaggageDepart: 0,
      BaggageReturn: 0,
      SurchargeWeekendFee: 0,
      SurchargeFee: [],
      TotalAll: 0,
      ComboData: {},
      AllExtraPointsFee: {
      }
    };
  point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel; ischeckpoint = false; roomcboId; pickup_pointsdepartt; pickup_pointsdepartd; addressdepartd; addressdepartt;
  pickup_pointsreturnt; pickup_pointsreturnd; addressreturnd; addressreturnt; id_pickup_pointsreturnd; id_pickup_pointsreturnt; id_pickup_pointsdepartd; id_pickup_pointsdepartt;
  discountpromo; msgwrn; msg; ischecktext = 0; ischeckerror = 0; ischeckbtnpromo = false; ischeckpromo = false; promocode; loadcarspricedone = false;
  pickup_pointsdep = []; drop_off_points_at_arrivedep = []; pickup_pointsret = []; drop_off_points_at_arriveret = []; diff_feedep; diff_feeret
  public isConnected: boolean = true;pointshow
  surchargedepd; surchargedept; surchargeretd; surchargerett;textpromotion="Nhập mã giảm giá";
  constructor(private storage: Storage, private zone: NgZone, public valueGlobal: ValueGlobal,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private gf: GlobalFunction,
    public bookCombo: Bookcombo,
    public booking: Booking,
    public Roomif: RoomInfo,
    public searchhotel: SearchHotel, public alertCtrl: AlertController, public networkProvider: NetworkProvider, public modalCtrl: ModalController, public loadingCtrl: LoadingController) {
    this.storage.get('username').then(name => {
      if (name !== null) {
        this.username = name;
      }
    })
    this.storage.get('email').then(e => {
      if (e !== null) {
        this.email = e;
      }
    })
    this.storage.get('point').then(point => {
      if (point) {
        if (point > 0) {
          this.pointshow=point;
          this.Roomif.point = point;
          this.point = point * 1000;
          this.price = this.point.toLocaleString();
        }
      }
    });
    this.booking.ChildAge.forEach(element => {
      if (element == "<1" || Number(element) < 2) {
        this.infant += 1;
      }
    });
    this.Avatar = Roomif.imgHotel;
    this.Name = booking.HotelName;
    this.Address = Roomif.Address;
    this.cin = booking.CheckInDate;
    this.cout = booking.CheckOutDate;
    this.duration = moment(this.cout).diff(moment(this.cin), 'days');
    this.TotalNight = this.duration;
    this.dur = Roomif.dur;
    this.roomnumber = this.searchhotel.roomnumber;
    this.adults = booking.Adults;
    this.totalAdult = booking.Adults;
    this.children = booking.Child;
    this.totalChild = booking.Child;
    this.roomtype = Roomif.roomtype;
    this.jsonroom = Roomif.jsonroom;
    this.room = Roomif.arrroom;
    var chuoicin = this.cin.split('-');
    var chuoicout = this.cout.split('-');
    this.cinshow = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
    this.coutshow = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
    this.nameroom = this.room[0].ClassName;
    this.breakfast = (this.bookCombo.MealTypeCode == 'CUS' ? 'Ăn 3 bữa' : this.bookCombo.MealTypeName);
    this.titlecombo = this.bookCombo.ComboTitle;
    this.titlecomboprice = this.bookCombo.ComboRoomPrice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.totalInfant = this.infant;
    this.totalChild = this.children - this.infant;
    this.arrchild = this.searchhotel.arrchild;
    this.childrendisplay = this.children;
    this.adulsdisplay = this.booking.Adults;
    this.fromPlace = this.bookCombo.ComboDetail.comboDetail.departurePlace;
    //this.PriceAvgPlusTAStr = this.Roomif.objMealType.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.comboId = this.bookCombo.ComboDetail.comboDetail.comboId;
    this.roomcboId = this.bookCombo.ComboDetail.comboDetail.roomId;
    this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
    this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
    if (this.arrchild) {
      for (let i = 0; i < this.arrchild.length; i++) {
        if (i == this.arrchild.length - 1) {
          this.textage = this.textage + this.arrchild[i].numage;
          this.textagepost = this.textagepost + this.arrchild[i].numage;
        } else {
          this.textage = this.textage + this.arrchild[i].numage + ",";
          this.textagepost = this.textagepost + this.arrchild[i].numage + ",";
        }
        //PDANH 10/06/2019: Check tuổi trẻ em >=4 tuổi tính giá vé = người lớn
        if (this.arrchild[i].numage >= 4) {
          // this.children--;
          // this.totalChild--;
          // this.adults++;
          this.totalAdult++;
        }
      }
      if (this.textage) {
        this.textage = "(" + this.textage + ")";
      }
    }
    if (this.adulsdisplay > 0) {
      this.paxtitle += this.adulsdisplay + ' người lớn'
    }
    if (this.childrendisplay > 0) {
      this.paxtitle += ', ' + this.childrendisplay + ' trẻ em'
    }
    var se = this;
    // se.getTransferData(true);
    // se.getTransferData(false);
    if (this.networkProvider.isOnline()) {
      this.isConnected = true;
      this.getHotelContractPrice(this.bookCombo.FormParam);
    } else {
      this.isConnected = false;
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    }
  }

  ngOnInit() {
    //clear cache sau 15p
    this.intervalID = setInterval(() => {
      if (this.listkeys.length > 0) {
        this.listkeys.forEach(key => {
          this.storage.remove(key);
        });
      }
    }, 60000 * 15);
  }
  getHotelContractPrice(data) {
    var se = this;
    if (data) {
      data.IsPackageRateInternal = true;
      data.IsPackageRate = true;
      var form = data;
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        headers:
          {},
        form
      };
      request(options, function (error, response, body) {
        if (response.statusCode != 200) {
          var objError = {
            page: "carcombo",
            func: "getHotelContractPrice",
            message: response.statusMessage,
            content: response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
          C.writeErrorLog(objError, response);
        }
        if (error) {
          error.page = "carcombo";
          error.func = "getHotelContractPrice";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error, response);
        };
        se.zone.run(() => {
          var result = JSON.parse(body);

          if (result.Hotels) {
            se.jsonroom = result.Hotels[0].RoomClasses;
            var element = se.checkElement(se.jsonroom);
            if (element) {
              se.nameroom = element.ClassName;
              se.PriceAvgPlusTA = element.MealTypeRates[0].PriceAvgPlusTotalTA;
              se.elementMealtype = element.MealTypeRates[0];
              se.TravPaxPrices = element.MealTypeRates[0].PriceAvgPlusNet * se.roomnumber * se.TotalNight;
              se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
              se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;
              se.getTransferData(true);
              // se.storage.get('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost).then((data) => {
              //   if (data) {
              //     se.listDepartTransfers = data.data;
              //     se.getBestTransfer(data, 1);
              //     se.storage.get('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost).then((data) => {
              //       if (data) {
              //         se.listReturnTransfers = data.data;
              //         se.getBestTransfer(data, 0);
              //         se.loadTransferInfo(se.departTime, se.returnTime);
              //       } else {
              //         //Chưa có list xe về thì mới gọi lại api lấy
              //         if (!se.listReturnTransfers || se.listReturnTransfers.length <= 0)
              //           se.getTransferData(false);
              //       }
              //     })
              //   } else {
              //     se.getTransferData(true);
              //   }
              // })
            } else {
              se.departDateTimeStr = "không có vé";
              se.msgwrn = "Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
              se.loadpricedone = true
            }
          }
          else {
            se.departDateTimeStr = "không có vé";
            se.msgwrn = "Hiện tại không có phòng thoả điều kiện của quy khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
            se.loadpricedone = true;
          }
        })
      })
    }
  }
  checkElement(object) {
    var el: any = null;
    var se = this;
    object.forEach(element => {
      if (element && element.MealTypeRates[0].RoomId == this.roomcboId && !element.MSGCode) {
        el = element;
      }
    })

    if (!el) {
      var arr = object.filter(function (e) { return !e.MSGCode })
      if (arr && arr.length > 0) {
        el = arr[0];
      }
    }
    return el;
  }
  goback() {
    this.bookCombo.idpointdepd = '';
    this.bookCombo.idpointdept = '';
    this.bookCombo.idpointretd = '';
    this.bookCombo.idpointrett = '';
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/' + this.booking.HotelId]);
    this.navCtrl.navigateBack('/hoteldetail/'+ this.booking.HotelId);
  }


  loadTransferInfo(departTransfer, returnTransfer, indexdep, indexret) {
    var se = this;
    //bind thông tin chiều đi
    if (departTransfer && departTransfer.length > 0) {
      this.departObject = departTransfer[indexdep];
      let de_date = this.departObject.route.departure_date;
      se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      // se.departTimeStrd = this.departObject.route.pickup_time
      // se.departTimeStrt = this.departObject.route.arrival_time
      se.departVehicleStr = this.departObject.company.name;
      this.departTicketSaleshow = this.departObject.route.schedules[0].fare.price - this.departTicketSale;
      this.pricedepart = this.departObject.route.schedules[0].fare.price;
      se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      if (this.departTicketSaleshow <= 0) {
        this.checkdiscountdepart = true;
        this.departTicketSaleshow = Math.abs(this.departTicketSaleshow);
      }
      else {
        this.checkdiscountdepart = false;
      }
      this.departTicketSaleshow = this.departTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }

    //bind thông tin chiều về
    if (returnTransfer && returnTransfer.length > 0) {
      this.returnObject = returnTransfer[indexret];
      let re_date = this.returnObject.route.departure_date;
      se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
      // se.returnTimeStrd = this.returnObject.route.pickup_time;
      // se.returnTimeStrt = this.returnObject.route.arrival_time
      se.returnVehicleStr = this.returnObject.company.name;
      this.returnTicketSaleshow = this.returnObject.route.schedules[0].fare.price - this.returnTicketSale;
      se.dayreturntitle = se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
      this.pricereturn = this.returnObject.route.schedules[0].fare.price;
      if (this.returnTicketSaleshow <= 0) {
        this.checkdiscountreturn = true;
        this.returnTicketSaleshow = Math.abs(this.returnTicketSaleshow);
      }
      else {
        this.checkdiscountreturn = false;
      }
      this.returnTicketSaleshow = this.returnTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      this.PriceAvgPlusTAStr = 0;
      this.postcardetaildepart(0);
      // this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.adults + this.pricereturn * this.adults;
      // this.total = this.PriceAvgPlusTAStr;
      // this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }

  }
  // Hàm kiểm tra điểm
  funccheckpoint() {
    var se = this;
    if (se.point > 0) {
      se.Pricepoint = this.total - se.point;
      se.Pricepointshow = se.Pricepoint.toLocaleString();
      if (se.Pricepoint <= 0) {
        se.ischeckpoint = true;
        se.Pricepointshow = 0;
      }
      else {
        se.ischeckpoint = false;
      }
      //se.PriceAvgPlusTAStr = se.Pricepoint.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
    if (se.ischeckbtnpromo) {
      var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      if (se.ischeck) {
        total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      se.Pricepointshow = total - se.discountpromo;
      if (se.Pricepointshow > 0) {
        se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        se.ischeckbtnpromo = true;
        se.ischeckpromo = true;
      }
      else {
        se.Pricepointshow = 0;
      }
      se.ischecktext = 0;
      se.ischeckerror = 0;
    }
    se.loadcarspricedone = true;
  }
  async getTransferData(isDepart) {
    var se = this;

    if (se.comboId) {
      // se.comboId = se.bookCombo.ComboDetail.comboId;
      if (isDepart) {
        se.fromId = se.bookCombo.ComboDetail.comboDetail.departureCode;
        se.toId = se.bookCombo.ComboDetail.arrivalCode;

        //Lấy danh sách chuyến xe chiều đi
        var url = C.urls.baseUrl.urlMobile + '/get-transfer-data?cid=' + se.comboId + '&from=' + se.fromId + '&to=' + se.toId + '&date=' + se.cin + '&an=' + se.adults + '&cn=' + se.children + '&cas=' + se.textagepost;
        se.gf.RequestApi('GET', url, {}, {}, 'carcombo', 'get-transfer-data').then((data: any) => {
          if (data.data.length > 0) {
            var listDeparttemp = data.data;
            for (let i = 0; i < listDeparttemp.length; i++) {
              if (listDeparttemp[i].route.schedules[0].available_seats >= se.totalAdult) {
                se.listDepartTransfers.push(listDeparttemp[i]);
              }
            }
            // se.storage.set('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost, data);
            // se.listkeys.push('listDepartTransfers_' + se.comboId + '_' + se.cin + '_' + se.adults + '_' + se.children + '_' + se.textagepost);
            se.getBestTransfer(data, 1);
            se.getTransferData(false);
            // se.storage.get('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost).then((data) => {
            //   if (data) {
            //     se.listReturnTransfers = data.data;
            //     se.getBestTransfer(data, 0);
            //     se.loadTransferInfo(se.departTime, se.returnTime);
            //   } else {
            //     //Chưa có list xe về thì mới gọi lại api lấy
            //     if (!se.listReturnTransfers || se.listReturnTransfers.length <= 0)
            //       se.getTransferData(false);
            //   }
            // })
          }
          else {
            se.loadpricedone = true;
            se.departDateTimeStr = "không có vé";
            se.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }

        });
      } else {
        se.fromId = se.bookCombo.ComboDetail.comboDetail.departureCode;
        se.toId = se.bookCombo.ComboDetail.arrivalCode;

        //Lấy danh sách chuyến xe chiều về
        var url = C.urls.baseUrl.urlMobile + '/get-transfer-data?cid=' + se.comboId + '&from=' + se.toId + '&to=' + se.fromId + '&date=' + se.cout + '&an=' + se.adults + '&cn=' + se.children + '&cas=' + se.textagepost;
        se.gf.RequestApi('GET', url, {}, {}, 'carcombo', 'get-transfer-data').then((data: any) => {
          if (data.data.length > 0) {
            var listReturntemp = data.data;
            for (let i = 0; i < listReturntemp.length; i++) {
              if (listReturntemp[i].route.schedules[0].available_seats >= se.totalAdult) {
                se.listReturnTransfers.push(listReturntemp[i]);
              }
            }
            // se.storage.set('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost, data);
            // se.listkeys.push('listReturnTransfers_' + se.comboId + '_' + se.cout + '_' + se.adults + '_' + se.children + '_' + se.textagepost);
            se.getBestTransfer(data, 0);
            this.loadTransferInfo(this.departTime, this.returnTime, 0, 0);
          }
          else {
            se.loadpricedone = true;
            se.departDateTimeStr = "không có vé";
            se.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        });
      }

    }
  }

  /**
   * Hàm check transfer giá tốt nhất trong khung giờ chấp nhận được
   * @param list - Danh sách chuyến xe
   * @param isDepart - biến xác định chiều đi/về (=1 là chiều đi/ =0 là chiều về)
   */
  getBestTransfer(list, isDepart) {
    // var Hour; var Minute; var kq;
    // var good = [];
    var home = [];
    var away = [];
    var other = [];
    for (let i = 0; i < list.data.length; i++) {
      var Hour; var Minute; var kq;
      var time = list.data[i].route.pickup_time;
      Hour = time.toString().split(':')[0];
      Minute = time.toString().split(':')[1];
      kq = Hour * 60 + Number(Minute);
      if (isDepart == 1) {
        if (kq >= 480 && kq <= 840) {
          if (list.data[i].sort_order != 999) {
            home.push(list.data[i]);
          }
          else {
            away.push(list.data[i]);
          }
        }
        other.push(list.data[i]);
      }
      else {
        if (kq >= 600 && kq <= 1080) {
          if (list.data[i].sort_order != 999) {
            home.push(list.data[i]);
          }
          else {
            away.push(list.data[i]);
          }
        }
        other.push(list.data[i]);
      }
    }
    if (isDepart == 1) {
      if (home.length > 0) {
        this.departTime = home;
      } else if (away.length > 0) {
        this.departTime = away;
      }
      else if (other.length > 0) {
        this.departTime = other;
      }
    } else {
      if (home.length > 0) {
        this.returnTime = home;
      } else if (away.length > 0) {
        this.returnTime = away;
      }
      else if (other.length > 0) {
        this.returnTime = other;
      }
    }
    //this.loadTransferInfo(this.departTime, this.returnTime);
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
  next() {
    var self = this;
    //this.presentLoading();
    if (this.point > 0) {
      if (this.ischeck) {
        this.Roomif.ischeckpoint = this.ischeck;
      }
      else {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.point = null;
      }
    }
    self.bookCombo.departObjectCar = self.departObject;
    self.bookCombo.returnObjectCar = self.returnObject;
    self.Commission = (self.elementMealtype.PriceAvgPlusOTA * self.roomnumber * self.TotalNight) - (self.elementMealtype.PriceAvgPlusNet * self.roomnumber * self.TotalNight);
    // JsonSurchargeFee.RoomDifferenceFee=self.bookCombo.ComboRoomPrice-self.jsonroom[0].MealTypeRates[0].PriceAvgDefaultTA/2;
    self.MathGaladinnerAdExtrabed();
    self.JsonSurchargeFee.DepartTicketDifferenceFee = (self.departTicketSale - self.pricedepart) * (-1) * self.totalAdult;
    self.JsonSurchargeFee.ReturnTicketDifferenceFee = (self.returnTicketSale - self.pricereturn) * (-1) * self.totalAdult;
    self.JsonSurchargeFee.TotalAll = self.total;
    self.JsonSurchargeFee.ComboData = {
      ComboId: self.bookCombo.ComboId,
      MealTypeCode: self.bookCombo.MealTypeCode,
      AdultCombo: self.adultCombo
    }
    // JsonSurchargeFee.AdultUnit=self.AdultUnit;
    var pointprice = 0;
    var total = self.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
    if (self.ischeck) {
      pointprice = self.point;
      if (self.ischeckpoint) {
        pointprice = self.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      total = self.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
    }
    if (self.ischeckbtnpromo) {
      total = self.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      self.bookCombo.ischeckbtnpromo = self.ischeckbtnpromo;
      self.bookCombo.discountpromo = self.discountpromo;
      self.Roomif.promocode = self.promocode;
    }
    else {
      self.bookCombo.ischeckbtnpromo = self.ischeckbtnpromo;
      self.bookCombo.discountpromo = 0;
      self.promocode = "";
      self.Roomif.promocode = self.promocode;
    }
    var objtest:any = {};
    if (self.surchargedepd > 0) {
      objtest.departPickup = self.surchargedepd + '/vé';
    }
    if (self.surchargedept >  0) {
      objtest.departDropoff = self.surchargedept + '/vé';
    }
    if (self.surchargeretd > 0) {
      // self.JsonSurchargeFee.AllExtraPointsFee.returnPickup = self.surchargeretd + '/vé';
      objtest.returnPickup = self.surchargeretd + '/vé';
    }
    if (self.surchargerett > 0) {
      // self.JsonSurchargeFee.AllExtraPointsFee.returnDropoff = self.surchargerett + '/vé';
      objtest.returnDropoff = self.surchargerett + '/vé';
    }
    self.JsonSurchargeFee.AllExtraPointsFee = objtest;
    self.storage.get('jti').then(jti => {
      if (jti) {
        var objectCar = {
          TransferBooking: {
            fromPlaceCode: self.bookCombo.ComboDetail.comboDetail.departureCode,
            toPlaceCode: self.bookCombo.ComboDetail.arrivalCode,
            fromPlaceName: self.bookCombo.ComboDetail.comboDetail.departurePlace,
            toPlaceName: self.bookCombo.ComboDetail.arrivalName,
            adult: self.adults,
            child: self.children,
            infant: self.totalInfant,
            departTransfer: {
              CompanyCode: self.departObject.company.id,
              CompanyName: self.departObject.company.name,
              TransferNumber: self.departObject.route.schedules[0].trip_code,
              VehicleType: self.departObject.route.schedules[0].vehicle_type,
              RouteNumber: self.departObject.route.id,
              PickupPlaceCode: self.id_pickup_pointsdepartd,
              PickupPlaceName: self.pickup_pointsdepartd,
              DropoffPlaceCode: self.id_pickup_pointsdepartt,
              DropoffPlaceName: self.pickup_pointsdepartt,
              DepartDate: self.departObject.route.pickup_date,
              DepartTime: self.departTimeStrd,
              ArrivalDate: self.departObject.route.arrival_date,
              ArrivalTime: self.departTimeStrt,
              Duration: self.departObject.route.duration,
              FareOrigins: self.departObject.route.schedules[0].fare.price,
              FareNet: self.departObject.route.schedules[0].fare.price,
              TotalPrice: (self.pricedepart * self.totalAdult) + self.diff_feedep + (self.surchargedepd + self.surchargedept) * self.totalAdult,
              CancelPolicy: self.transferdetaildepart.data.policyData.join('\r\n')
            },
            returnTransfer: {
              CompanyCode: self.returnObject.company.id,
              CompanyName: self.returnObject.company.name,
              TransferNumber: self.returnObject.route.schedules[0].trip_code,
              VehicleType: self.returnObject.route.schedules[0].vehicle_type,
              RouteNumber: self.returnObject.route.id,
              PickupPlaceCode: self.id_pickup_pointsreturnd,
              PickupPlaceName: self.pickup_pointsreturnd,
              DropoffPlaceCode: self.id_pickup_pointsreturnt,
              DropoffPlaceName: self.pickup_pointsreturnt,
              DepartDate: self.returnObject.route.pickup_date,
              DepartTime: self.returnTimeStrd,
              ArrivalDate: self.returnObject.route.arrival_date,
              ArrivalTime: self.returnTimeStrt,
              Duration: self.returnObject.route.duration,
              FareOrigins: self.returnObject.route.schedules[0].fare.price,
              FareNet: self.returnObject.route.schedules[0].fare.price,
              TotalPrice: (self.pricereturn * self.totalAdult) + self.diff_feeret + (self.surchargeretd + self.surchargerett) * self.totalAdult,
              CancelPolicy: self.transferdetailreturn.data.policyData.join('\r\n')
            },
            passengerInfo: {
              FirstName: "",
              LastName: "",
              Email: "",
              MobileNumber: ""
            }
          },
          HotelBooking: {
            HotelId: self.booking.HotelId.toString(),
            CheckIn: moment(self.booking.CheckInDate).format('YYYY-MM-DD'),
            CheckOut: moment(self.booking.CheckOutDate).format('YYYY-MM-DD'),
            TotalRoom: self.roomnumber,
            TotalPrices: total,
            RoomStatus: self.elementMealtype.Status,
            BreakfastInclude: self.bookCombo.MealTypeCode,
            BreakfastIncludeName: self.bookCombo.MealTypeName,
            PaymentMethod: "2",
            CName: self.username,
            CEmail: self.email,
            CAddress: "",
            CPhone: "",
            CTitle: "Mr",
            LeadingName: "",
            LeadingEmail: "",
            LeadingPhone: "",
            LeadingNationality: "",
            IsInvoice: 0,
            Note: "",
            BookingStatus: "0",
            Adult: self.adults,
            AdultCombo: self.adultCombo,
            Child: self.children,
            TravPaxPrices: self.TravPaxPrices,
            Office: "",
            FromPlaceCode: self.bookCombo.ComboDetail.departureCode,
            RoomName: self.elementMealtype.RoomName,
            RoomPrices: self.elementMealtype.PriceAvgPlusTA,
            RoomId: self.elementMealtype.RoomId,
            MealTypeNote: (self.elementMealtype.PromotionInclusions.length > 0 ? self.elementMealtype.PromotionInclusions.join(' \r\n') : "") + (self.elementMealtype.Notes != null && self.elementMealtype.Notes.length > 0 ? self.elementMealtype.Notes.join('\r\n,') : ""),
            PromotionNote: self.elementMealtype.PromotionNote,
            PersonIncharge: "",
            DiscountAmount: "0",
            SupplierRef: null,
            ChildAges: self.booking.ChildAge,
            PenaltyDescription: null,
            CompName: "",
            CompAddress: "",
            CompTaxCode: "",
            JsonSurchargeFee: JSON.stringify(self.JsonSurchargeFee),
            Commission: self.Commission,
            Source: '8',
            Supplier: (self.elementMealtype.IsHoliday ? "Holiday" : (self.elementMealtype.IsVoucher ? "Voucher" : self.elementMealtype.Supplier)),
            MemberId: jti,
            UsePointPrice: pointprice,
            promotionCode: self.promocode
          },
        }
        self.bookCombo.totalAdult = self.totalAdult;
        self.bookCombo.pricedep = (self.pricedepart * self.totalAdult) + self.diff_feedep;
        self.bookCombo.priceret = (self.pricereturn * self.totalAdult) + self.diff_feeret;
        self.gf.setParams(objectCar, 'carscombo');
        self.navCtrl.navigateForward("comboadddetails");
      }
    })
  }
  postcardetaildepartload(value) {
    var self = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/get-transfer-detail',
      qs: { trip_code: this.departObject.route.schedules[0].trip_code },
      headers:
      {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      self.transferdetaildepart = JSON.parse(body);
      self.zone.run(() => {
        //thời gian đón đưa
        self.departTimeStrd = self.transferdetaildepart.data.pickup_points[0].pickup_time;
        self.departTimeStrt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].dropoff_time;

        self.pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].name;
        self.id_pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].id;
        self.addressdepartd = self.transferdetaildepart.data.pickup_points[0].address;
        self.id_pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].id;
        self.pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].name;
        self.addressdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].address;
        self.pickup_pointsdep = self.transferdetaildepart.data.pickup_points;
        self.drop_off_points_at_arrivedep = self.transferdetaildepart.data.drop_off_points_at_arrive;
        self.bookCombo.arrplacedepd = self.pickup_pointsdep;
        self.bookCombo.arrplacedept = self.drop_off_points_at_arrivedep;
        //phụ thu điểm đón
        self.surchargedepd = self.transferdetaildepart.data.pickup_points[0].surcharge;
        self.surchargedept = self.transferdetaildepart.data.drop_off_points_at_arrive[0].surcharge;
        //tính giá
        self.PriceAvgPlusTAStr = (self.PriceAvgPlusTA + self.pricedepart * self.totalAdult + self.pricereturn * self.totalAdult) + self.diff_feedep + self.diff_feeret + (self.surchargedepd + self.surchargedept + self.surchargeretd + self.surchargerett) * self.totalAdult;
        self.total = self.PriceAvgPlusTAStr;
        self.PriceAvgPlusTAStr = self.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        // if (self.loader) {
        //   self.loader.dismiss()
        // }
        if (value == 0) {
          self.funccheckpoint();
        } else {
          self.edit();
        }
      })

    });
  }
  postcardetaildepart(value) {
    var self = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/get-transfer-detail',
      qs: { trip_code: this.departObject.route.schedules[0].trip_code },
      headers:
      {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var transferdetaildep = JSON.parse(body);

      self.zone.run(() => {
        //thời gian đón đưa
        if (transferdetaildep.data.total_available_seats >= self.totalAdult) {
          self.transferdetaildepart = JSON.parse(body);
          self.departTimeStrd = self.transferdetaildepart.data.pickup_points[0].pickup_time;
          self.departTimeStrt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].dropoff_time;

          self.pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].name;
          self.id_pickup_pointsdepartd = self.transferdetaildepart.data.pickup_points[0].id;
          self.addressdepartd = self.transferdetaildepart.data.pickup_points[0].address;
          self.id_pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].id;
          self.pickup_pointsdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].name;
          self.addressdepartt = self.transferdetaildepart.data.drop_off_points_at_arrive[0].address;
          self.pickup_pointsdep = self.transferdetaildepart.data.pickup_points;
          self.drop_off_points_at_arrivedep = self.transferdetaildepart.data.drop_off_points_at_arrive;
          self.bookCombo.arrplacedepd = self.pickup_pointsdep;
          self.bookCombo.arrplacedept = self.drop_off_points_at_arrivedep;
          //phụ thu điểm đón
          self.surchargedepd = self.transferdetaildepart.data.pickup_points[0].surcharge;
          self.surchargedept = self.transferdetaildepart.data.drop_off_points_at_arrive[0].surcharge;
          self.postcardetailreturn(value);
        }
        else {
          self.indexdep++;
          if (self.indexdep < self.departTime.length) {
            self.loadTransferInfo(self.departTime, self.returnTime, self.indexdep, self.indexret);
          }
          else {
            self.loadpricedone = true;
            self.departDateTimeStr = "không có vé";
            self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        }

      })

    });
  }
  MathGaladinnerAdExtrabed() {
    var se = this;
    if (se.elementMealtype == undefined) return false;
    se.totalExtraBedAndGalaDinerListTA = 0;
    se.JsonSurchargeFee.SurchargeFee = [];
    if (se.elementMealtype.ExtraBedAndGalaDinerList.length > 0) {
      for (var i = 0; i < se.elementMealtype.ExtraBedAndGalaDinerList.length; i++) {
        if (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Night" || se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Bed" || se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeType == "Per Meal WithoutNo") {
          se.totalExtraBedAndGalaDinerListTA += se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight;
          var priceItem2 = { Code: se.elementMealtype.ExtraBedAndGalaDinerList[i].Code, type: 'room', PassengerType: (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeOn == 'Per Adult' ? 0 : 1), PriceType: 0, Text: se.elementMealtype.ExtraBedAndGalaDinerList[i].NameDisplay, Quantity: se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value, Price: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight), PriceFormat: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA * se.TotalNight).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
          se.JsonSurchargeFee.SurchargeFee.push(priceItem2);

        }
        else {
          se.totalExtraBedAndGalaDinerListTA += se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA;
          var priceItem2 = { Code: se.elementMealtype.ExtraBedAndGalaDinerList[i].Code, type: 'room', PassengerType: (se.elementMealtype.ExtraBedAndGalaDinerList[i].ChargeOn == 'Per Adult' ? 0 : 1), PriceType: 0, Text: se.elementMealtype.ExtraBedAndGalaDinerList[i].NameDisplay, Quantity: se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value, Price: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA), PriceFormat: (se.elementMealtype.ExtraBedAndGalaDinerList[i].Quantity.value * se.elementMealtype.ExtraBedAndGalaDinerList[i].PriceOTA).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
          se.JsonSurchargeFee.SurchargeFee.push(priceItem2);
        }
      }
    }

    //AdultOtherFee
    se.AdultOtherFee = 0;
    se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
      if (e.ChargeOn == 'Per Adult' && e.Code != 'EXBA') {
        se.AdultOtherFee += e.PriceOTA;
      }
    });
    //ChildOtherFee
    se.ChildOtherFee = 0;
    se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
      if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
        se.ChildOtherFee += e.PriceOTA;
      }
    });
    //ChildOtherFeeTotal
    se.ChildOtherFeeTotal = 0;
    se.elementMealtype.ExtraBedAndGalaDinerList.forEach(e => {
      if (e.ChargeOn == 'Per Child' && e.Code != 'CWE' && e.Code != 'EXBC') {
        se.ChildOtherFeeTotal += e.PriceOTA * e.Quantity.value;
      }
    });
    se.AdultOtherFee = se.AdultOtherFee * (se.jsonroom[0].Rooms[0].IncludeAdults * se.roomnumber) / se.AdultCombo;
    se.PriceDiffUnit = se.AdultOtherFee + ((se.elementMealtype.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / se.AdultCombo) - se.roomPriceSale;

    //se.ComboPriceDiff.RoomDiff.Total = se.elementMealtype.PriceAvgPlusTotalTA - (se.roomPriceSale * se.AdultCombo) //- totalExtraBedAndGalaDinerListTA;
    se.JsonSurchargeFee.AdultUnit = se.PriceDiffUnit;

    se.JsonSurchargeFee.RoomDifferenceFee = se.PriceDiffUnit * se.AdultCombo + (se.totalAdult - se.AdultCombo) * se.AdultOtherFee + se.ChildOtherFeeTotal;
  }
  //get data chiều về
  postcardetailreturnload(value) {
    var self = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/get-transfer-detail',
      qs: { trip_code: this.returnObject.route.schedules[0].trip_code },
      headers:
      {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      self.transferdetailreturn = JSON.parse(body);
      self.zone.run(() => {

        self.returnTimeStrd = self.transferdetailreturn.data.pickup_points[0].pickup_time;
        self.returnTimeStrt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].dropoff_time;

        self.id_pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].id;
        self.pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].name;
        self.addressreturnd = self.transferdetailreturn.data.pickup_points[0].address;

        self.id_pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].id;
        self.pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].name;
        self.addressreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].address;

        self.pickup_pointsret = self.transferdetailreturn.data.pickup_points;
        self.drop_off_points_at_arriveret = self.transferdetailreturn.data.drop_off_points_at_arrive;

        self.bookCombo.arrplaceretd = self.transferdetailreturn.data.pickup_points;
        self.bookCombo.arrplacerett = self.transferdetailreturn.data.drop_off_points_at_arrive;

        //phụ thu điểm trả
        self.surchargeretd = self.transferdetailreturn.data.pickup_points[0].surcharge;
        self.surchargerett = self.transferdetailreturn.data.drop_off_points_at_arrive[0].surcharge;
        //tính giá
        self.PriceAvgPlusTAStr = (self.PriceAvgPlusTA + self.pricedepart * self.totalAdult + self.pricereturn * self.totalAdult) + self.diff_feedep + self.diff_feeret + (self.surchargedepd + self.surchargedept + self.surchargeretd + self.surchargerett) * self.totalAdult;
        self.total = self.PriceAvgPlusTAStr;
        self.PriceAvgPlusTAStr = self.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        if (self.loader) {
          self.loader.dismiss()
        }
        if (value == 0) {
          self.funccheckpoint();
        } else {
          self.edit();
        }
      })
    });
  }
  postcardetailreturn(value) {
    var self = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/get-transfer-detail',
      qs: { trip_code: this.returnObject.route.schedules[0].trip_code },
      headers:
      {
        'cache-control': 'no-cache',
        Connection: 'keep-alive',
        'Accept-Encoding': 'gzip, deflate',
        Host: C.urls.baseUrl.urlMobile,
        'Cache-Control': 'no-cache',
        Accept: '*/*',
        'User-Agent': 'PostmanRuntime/7.17.1'
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var transferdetailret = JSON.parse(body);
      if (transferdetailret.data.total_available_seats >= self.totalAdult) {
        self.zone.run(() => {
          self.transferdetailreturn = JSON.parse(body);
          self.returnTimeStrd = self.transferdetailreturn.data.pickup_points[0].pickup_time;
          self.returnTimeStrt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].dropoff_time;

          self.id_pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].id;
          self.pickup_pointsreturnd = self.transferdetailreturn.data.pickup_points[0].name;
          self.addressreturnd = self.transferdetailreturn.data.pickup_points[0].address;

          self.id_pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].id;
          self.pickup_pointsreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].name;
          self.addressreturnt = self.transferdetailreturn.data.drop_off_points_at_arrive[0].address;

          self.pickup_pointsret = self.transferdetailreturn.data.pickup_points;
          self.drop_off_points_at_arriveret = self.transferdetailreturn.data.drop_off_points_at_arrive;

          self.bookCombo.arrplaceretd = self.transferdetailreturn.data.pickup_points;
          self.bookCombo.arrplacerett = self.transferdetailreturn.data.drop_off_points_at_arrive;
          //phụ thu điểm trả
          self.surchargeretd = self.transferdetailreturn.data.pickup_points[0].surcharge;
          self.surchargerett = self.transferdetailreturn.data.drop_off_points_at_arrive[0].surcharge;
          self.getavailableseats(value)
        })
      }
      else {
        self.indexret++;
        if (self.indexret < self.returnTime.length) {
          self.loadTransferInfo(self.departTime, self.returnTime, self.indexdep, self.indexret);
        }
        else {
          self.loadpricedone = true;
          self.departDateTimeStr = "không có vé";
          self.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
        }
      }

    });
  }
  getavailableseats(value) {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/get-available-seats',
      headers:
      {
        apikey: 'sx25k7TABO6W4ULFjfxoJJaLjQr0wUGxYCph1TQiTBM',
        apisecret: 'wZH8vCalp5-ZsUzJiP1IP6V2beWUm0ej8G_25gzg2xg'
      },
      body:
      {
        departParams:
        {
          trip_code: this.departObject.route.schedules[0].trip_code,
          total_seats: this.totalAdult,
          total_price: this.departObject.route.schedules[0].fare.price * se.totalAdult,
        },
        returnParams:
        {
          trip_code: this.returnObject.route.schedules[0].trip_code,
          total_seats: this.totalAdult,
          total_price: this.returnObject.route.schedules[0].fare.price * se.totalAdult,
        },
      },
      json: true
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      se.zone.run(() => {
        if (body.status == 1 || body.status == 3) {
          se.diff_feedep = body.data[0].diff_fee;
          se.diff_feeret = body.data[1].diff_fee;
          se.PriceAvgPlusTAStr = (se.PriceAvgPlusTA + se.pricedepart * se.totalAdult + se.pricereturn * se.totalAdult) + se.diff_feedep + se.diff_feeret + (se.surchargedepd + se.surchargedept + se.surchargeretd + se.surchargerett) * se.totalAdult;
          se.total = se.PriceAvgPlusTAStr;
          se.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          if (value == 0) {
            se.funccheckpoint();
          } else {
            se.edit();
          }
        }
        else {
          se.indexdep++;
          se.indexret++;
          if (se.indexdep < se.departTime.length && se.indexret < se.returnTime.length) {
            se.loadTransferInfo(se.departTime, se.returnTime, se.indexdep, se.indexret);
          }
          else {
            se.loadpricedone = true;
            se.departDateTimeStr = "không có vé";
            se.msgwrn = "Hiện tại không có vé xe thoả điều kiện của quý khách, xin vui lòng gửi yêu cầu bên dưới để được nhân viên tư vấn chi tiết!"
          }
        }

      })
    })
  }
  async showPenalty() {
    let alert = await this.alertCtrl.create({
      header: "Giá rẻ (không hoàn tiền)",
      message: "Đây là giá đặc biệt thấp hơn giá thông thường, không thể hủy hoặc thay đổi. Trong trường hợp không thể sử dụng combo sẽ không hoàn lại tiền. <p style='text-align:center;font-style:italic;margin-bottom:0'>Nếu bạn đã có kế hoạch chắc chắn thì hãy chớp lấy cơ hội này.</p>",
      cssClass: "cls-alert-carcombo",
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          alert.dismiss();
        }
      }
      ]
    });
    alert.present();
  }
  async showListCar(index) {
    var se = this;
    this.gf.setParams({ listdepart: this.listDepartTransfers, listreturn: this.listReturnTransfers, totalAdult: this.totalAdult, title: index == 0 ? this.daydeparttitle : this.dayreturntitle, isdepart: index == 0 ? true : false }, 'listcar');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: CardeparturePage
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      //this.presentLoading();
      if (data.data) {
        se.zone.run(() => {
          if (data.data.isdepart) {
            this.bookCombo.idpointdepd = '';
            this.bookCombo.idpointdept = '';
            this.diff_feedep = data.data.diff_fee
            se.current = data.data.cars;
            se.loadData(se.current, data.data.isdepart);
          } else {
            this.bookCombo.idpointretd = '';
            this.bookCombo.idpointrett = '';
            this.diff_feeret = data.data.diff_fee
            se.current = data.data.cars;
            se.loadData(se.current, data.data.isdepart);
          }
          if (data.data.loader) {
            data.data.loader.dismiss();
          }
        })
      }
    })
  }
  //load lại data
  loadData(Transfer, ischeck) {
    var se = this;
    if (ischeck) {
      //bind thông tin chiều đi
      if (Transfer && Transfer.length > 0) {
        this.departObject = Transfer[0];
        let de_date = this.departObject.route.departure_date;
        se.departDateTimeStr = 'Đi ' + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
        se.departTimeStrd = this.departObject.route.pickup_time;
        se.departTimeStrt = this.departObject.route.arrival_time;
        se.departVehicleStr = this.departObject.company.name;
        this.departTicketSaleshow = this.departObject.route.schedules[0].fare.price - this.departTicketSale;
        se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
        this.pricedepart = this.departObject.route.schedules[0].fare.price;
        if (this.departTicketSaleshow <= 0) {
          this.checkdiscountdepart = true;
          this.departTicketSaleshow = Math.abs(this.departTicketSaleshow);
        }
        else {
          this.checkdiscountdepart = false;
        }
        this.departTicketSaleshow = this.departTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTAStr = 0;
        this.postcardetaildepartload(1);
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.adults + this.pricereturn * this.adults;
        // this.total = this.PriceAvgPlusTAStr;
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

      }
    } else {
      //bind thông tin chiều về
      if (Transfer && Transfer.length > 0) {
        this.returnObject = Transfer[0];
        let re_date = this.returnObject.route.departure_date;
        se.returnDateTimeStr = 'Về ' + se.getDayOfWeek(re_date) + ', ' + moment(re_date).format('DD-MM-YYYY');
        se.returnTimeStrd = this.returnObject.route.pickup_time;
        se.returnTimeStrt = this.returnObject.route.arrival_time;
        se.returnVehicleStr = this.returnObject.company.name;
        this.returnTicketSaleshow = this.returnObject.route.schedules[0].fare.price - this.returnTicketSale;
        this.pricereturn = this.returnObject.route.schedules[0].fare.price;
        if (this.returnTicketSaleshow <= 0) {
          this.checkdiscountreturn = true;
          this.returnTicketSaleshow = Math.abs(this.returnTicketSaleshow);
        }
        else {
          this.checkdiscountreturn = false;
        }
        this.returnTicketSaleshow = this.returnTicketSaleshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTAStr = 0;
        this.postcardetailreturnload(1);
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTA + this.pricedepart * this.adults + this.pricereturn * this.adults;
        // this.total = this.PriceAvgPlusTAStr;
        // this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    }


  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }
  textchange() {
    this.ischeckbtnpromo = false;
    this.discountpromo = 0;
    this.ischeckerror = 0;
    this.msg = "";
    if (this.ischeck) {
      if (this.ischeckpoint) {
        this.Pricepointshow = 0;
      }
      else {
        this.price = this.point.toLocaleString();
        var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
        this.Pricepoint = tempprice - this.point;
        this.Pricepointshow = this.Pricepoint.toLocaleString();
      }
    }
  }
  click() {
    this.ischecktext = 3
  }
  promofunc() {
    var se = this;
    if (se.promocode) {
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile + '/api/data/validpromocode',
        headers:
        {
          'postman-token': '37a7a641-c2dd-9fc6-178b-6a5eed1bc611',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        body: { code: se.promocode, totalAmount: se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') },
        json: true
      };

      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        se.zone.run(() => {
          var json = body;
          if (json.error == 0) {
            var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
            if (se.ischeck) {
              total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
            }
            se.discountpromo = json.data.discount;
            se.Pricepointshow = total - se.discountpromo;
            if (se.Pricepointshow > 0) {
              se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
              se.ischeckbtnpromo = true;
              se.ischeckpromo = true;
            }
            else {
              se.Pricepointshow = 0;
            }
            se.msg = json.msg;
            se.ischecktext = 0;
            se.ischeckerror = 0;
          }
          else if (json.error == 1) {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 1;
            se.ischeckerror = 1;
          }
          else if (json.error == 2) {
            se.ischeckbtnpromo = false;
            se.msg = json.msg;
            se.discountpromo = 0;
            se.ischecktext = 2;
            se.ischeckerror = 1;
          }
        })
      });
    }
  }
  edit() {
    this.zone.run(() => {
      if (this.ischeck) {
        if (this.ischeckpoint) {
          this.Pricepointshow = 0;
        }
        else {
          if (this.ischeckpromo) {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point - this.discountpromo;
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          } else {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point;
            this.Pricepointshow = this.Pricepoint.toLocaleString();
            this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          }
        }

      } else {
        if (this.ischeckpromo) {
          this.PriceAvgPlusTAStr = this.total.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
          this.Pricepointshow = tempprice - this.discountpromo;
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
        }
        else {
          this.PriceAvgPlusTAStr = this.total.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.bookCombo.totalprice = this.PriceAvgPlusTAStr;
        }

      }
      if (this.loader) {
        this.loader.dismiss();
      }
    })
  }
  ionViewDidEnter() {
    this.GetUserInfo();
  }
  GetUserInfo() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/Dashboard/GetUserInfo',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roomdetailreview",
              func: "GetUserInfo",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError, response);
          }
          if (error) {
            error.page = "roomdetailreview";
            error.func = "GetUserInfo";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
          } else {
            if (body) {
              var data = JSON.parse(body);
              se.storage.set("email", data.email);
              se.storage.set("jti", data.memberId);
              se.storage.set("username", data.fullname);
              se.storage.set("phone", data.phone);
              se.storage.set("point", data.point);
            }

          }
        });
      }
    })
  }
  async sendRequestCombo() {
    this.bookCombo.Address = this.Address;
    this.bookCombo.isFlightCombo = false;
    this.bookCombo.isFlashSale = true;
    this.bookCombo.isNormalCombo = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: RequestCombo1Page
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      this.valueGlobal.backValue = 'carcombo';
      //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/' + this.booking.HotelId]);
      this.navCtrl.navigateBack('/hoteldetail/'+ this.booking.HotelId);
    })
  }
  async changeplace(value) {
    var self = this;
    this.bookCombo.isDepart = value;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: CombocarchangeplacePage
      });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      self.zone.run(() => {
        if (data.data) {
          if (data.data.isdepart == '0') {
            if (data.data.placed.length > 0) {
              self.departTimeStrd = data.data.placed[0].pickup_time;
              self.pickup_pointsdepartd = data.data.placed[0].name;
              self.id_pickup_pointsdepartd = data.data.placed[0].id;
              self.addressdepartd = data.data.placed[0].address;
              self.bookCombo.idpointdepd = self.id_pickup_pointsdepartd;
              self.surchargedepd = data.data.placed[0].surcharge;
            }
            if (data.data.placet.length > 0) {
              self.id_pickup_pointsdepartt = data.data.placet[0].id;
              self.pickup_pointsdepartt = data.data.placet[0].name;
              self.addressdepartt = data.data.placet[0].address;
              self.departTimeStrt = data.data.placet[0].dropoff_time;
              self.bookCombo.idpointdept = self.id_pickup_pointsdepartt;
              self.surchargedept = data.data.placet[0].surcharge;
            }
          } else {
            if (data.data.placed.length > 0) {
              self.returnTimeStrd = data.data.placed[0].pickup_time;
              self.pickup_pointsreturnd = data.data.placed[0].name;
              self.id_pickup_pointsreturnd = data.data.placed[0].id;
              self.addressreturnd = data.data.placed[0].address;
              self.bookCombo.idpointretd = self.id_pickup_pointsreturnd;
              self.surchargeretd = data.data.placed[0].surcharge;
            }
            if (data.data.placet.length > 0) {
              self.id_pickup_pointsreturnt = data.data.placet[0].id;
              self.pickup_pointsreturnt = data.data.placet[0].name;
              self.addressreturnt = data.data.placet[0].address;
              self.returnTimeStrt = data.data.placet[0].dropoff_time;
              self.bookCombo.idpointrett = self.id_pickup_pointsreturnt;
              self.surchargerett = data.data.placet[0].surcharge;
            }
          }
          // console.log(data.data);
          self.PriceAvgPlusTAStr = 0;
          self.PriceAvgPlusTAStr = (self.PriceAvgPlusTA + self.pricedepart * self.totalAdult + self.pricereturn * self.totalAdult) + self.diff_feedep + self.diff_feeret + (self.surchargedepd + self.surchargedept + self.surchargeretd + self.surchargerett) * self.totalAdult;
          self.total = self.PriceAvgPlusTAStr;
          self.PriceAvgPlusTAStr = self.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
      })

    })
  }
  showmsg(msg) {
    alert(msg);
  }
  async showdiscount(){
    if (!this.ischeck) {
      $('.div-point').removeClass('div-disabled');
    this.valueGlobal.PriceAvgPlusTAStr=this.PriceAvgPlusTAStr;
    this.textpromotion="Nhập mã giảm giá";
    this.promocode="";
    this.ischeckbtnpromo=false;
    this.ischeckpromo=false;
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: AdddiscountPage,
    });
    modal.present();
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        this.zone.run(() => {
          if (data.data.promocode) {
            $('.div-point').addClass('div-disabled');
            this.promocode=data.data.promocode;
            this.textpromotion=data.data.promocode;
            this.promofunc();
          }
        })
      }
    })
    }
  }
}
