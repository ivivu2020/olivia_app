import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController,Platform, LoadingController } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo, Bookcombo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import * as request from 'requestretry';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import {FlightDeparturePage } from '../flightdeparture/flightdeparture';
import { OverlayEventDetail } from '@ionic/core';
import { element } from 'protractor';
import {RequestComboPage} from '../requestcombo/requestcombo';
import { AdddiscountPage } from './../adddiscount/adddiscount.page';
import * as $ from 'jquery';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcomboreviews',
  templateUrl: 'flightcomboreviews.html',
  styleUrls: ['flightcomboreviews.scss'],
})
export class FlightComboReviewsPage implements OnInit{
 
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; textage = ""; arrchild
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr: any = 0; ischeckpoint = false;
  imgroom; roomtype; indexme; indexroom; cin1; cout1; point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel;
  titlecombo; TravPaxPrices;
  listDeparture = [];
  //listReturn =[];
  listDepart: any;
  listReturn: any;
  de_departtime; de_departdatestr;
  ar_departtime; ar_departdatestr;
  de_flightpricetitle; ar_flightpricetitle;
  de_departpriceincrease = false;
  de_returnpriceincrease = false;
  ar_departpriceincrease = false;
  ar_returnpriceincrease = false;
  loadflightpricedone = false;
  paxtitle = '';
  daydeparttitle;
  dayreturntitle;
  currentDepartFlight: any;
  currentReturnFlight: any;
  objhoteldetail: any;
  roomclass: any;
  basepricesale;
  duration;
  loadpricedone = false;
  adultCombo = 2;
  elementMealtype;
  username;
  email;
  adultUnit = 0;
  commissionAdult = 0;
  adultUnitExb = 0;
  childUnit = 0;
  infantUnit = 0;
  departTicketSale = 0;
  returnTicketSale = 0;
  transportPriceSale = 0;
  transportPriceNet = 0;
  transportPriceSaleForChild = 0;
  transportPriceNetForChild = 0;
  totalPriceSale = 0;
  totalSurchargeWeekendFee = 0;
  totalTransportPriceSale = 0;
  TotalPriceCombo = 0;
  totalAirLineLuggage = 0;
  totalPriceForEXBA = 0;
  totalPriceForChildCWE = 0;
  totalPriceForChildEXBC = 0;
  totalPriceInfant = 0;
  totalPriceForOtherFee = 0;
  totalGetSubPriceForAdultExtrabed = 0;
  totalGetSubPriceForChild = 0;
  totalQuantityChildCWEAndEXBC = 0;
  totalQuantityFlightForChildAndInfant = 0;
  totalQuantityFlightForChild = 0;
  totalPriceChild = 0;
  ChildOtherFeeTotal = 0;
  ChildOtherFee = 0;
  FlightDepartSelected: any;
  FlightReturnSelected: any;
  totalChild = 0;
  totalAdult = 0;
  totalInfant = 0;
  totalFlightDepart = 0;
  totalFlightReturn = 0;
  commissionFlight = 0;
  commissionDepart = 0;
  Commission = 0;
  AdultCombo = 0;
  totalAdultExtrabed = 0;
  totalExtraBedAndGalaDinerListTA = 0;
  AdultOtherFee = 0;
  roomPriceSale = 0;
  TotalNight = 0;
  PriceDiffUnit = 0;
  adultFlightNumber = 0;
  JsonSurchargeFee =
    {
      RoomDifferenceFee: 0,
      AdultUnit: 0,
      DepartTicketDifferenceFee: 0,
      TransportPriceSale: 0,
      ReturnTicketDifferenceFee: 0,
      BaggageDepart: 0,
      BaggageReturn: 0,
      SurchargeWeekendFee: 0,
      SurchargeFee: [],
      TotalAll: 0,
      ComboData: {}
    };
  ComboPriceDiff = {
    RoomDiff: { AdultUnit: 0, ChildUnit: 0, Total: 0 },
    DepartFlightDiff: { AdultUnit: 0, AdultUnitExb: 0, ChildUnit: 0, InfantUnit: 0, Total: 0, CommissionAdult: 0 },
    ReturnFlightDiff: { AdultUnit: 0, AdultUnitExb: 0, ChildUnit: 0, InfantUnit: 0, Total: 0, CommissionAdult: 0 },
  };
  infant = 0; intervalID; listkeys = []; flightdeparttitle; bookcombodetail; fromPlace = ""; toPlace = "";
  departfi = []; returnfi = [];titlecomboshort;hotelcode;
  adultsdisplay: number;
  childrendisplay: number;
  loaddatafromcache: boolean = false;
  discountpromo;msg;ischecktext=3;ischeckerror=0; ischeckbtnpromo = false;ischeckpromo;  promocode;
  objInsurranceFee: any;
  hasInsurrance:any;
  showInsurranceText: any;
  textpromotion="Nhập mã giảm giá";
  pointshow;
  constructor(public platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, private Roomif: RoomInfo, public zone: NgZone,private loadingCtrl: LoadingController,
    public booking: Booking, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction,
    public bookCombo: Bookcombo, public searchhotel: SearchHotel) {
    

    setTimeout(()=>{
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
      this.booking.ChildAge.forEach(element => {
        if (element == "<1" || Number(element) < 2) {
          this.infant += 1;
        }
      });
      this.arrchild = this.searchhotel.arrchild;
     
      this.Avatar = Roomif.imgHotel;
      this.Name = booking.HotelName;
      this.Address = Roomif.Address;
      this.cin = booking.CheckInDate;
      this.cout = booking.CheckOutDate;
      this.duration = moment(this.cout).diff(moment(this.cin), 'days');
      this.TotalNight = this.duration;
      this.dur = Roomif.dur;
      this.roomnumber = Roomif.roomnumber;
      this.adults = booking.Adults;
      this.totalAdult = booking.Adults;
      this.children = booking.Child;
      this.totalChild = booking.Child;
      this.roomtype = Roomif.roomtype;
      //this.indexme = booking.indexmealtype;
      //this.indexroom = booking.indexroom;
      this.jsonroom = Roomif.jsonroom;
      this.room = Roomif.arrroom;
      var chuoicin = this.cin.split('-');
      var chuoicout = this.cout.split('-');
      this.cin = chuoicin[2] + "-" + chuoicin[1] + "-" + chuoicin[0];
      this.cout = chuoicout[2] + "-" + chuoicout[1] + "-" + chuoicout[0];
      this.nameroom = this.room[0].ClassName;
      //this.roomcancel = this.room[0].MealTypeRates[this.indexme];
      this.breakfast = this.bookCombo.MealTypeName;
      //this.PriceAvgPlusTAStr = this.booking.cost.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      this.value.flagreview = 1;
      this.titlecombo = this.bookCombo.ComboTitle;
      this.hotelcode = this.bookCombo.HotelCode;
      this.objInsurranceFee = this.bookCombo.objInsurranceFee;
      this.hasInsurrance = this.bookCombo.hasInsurrance;
      this.showInsurranceText = this.hasInsurrance ? this.hasInsurrance : (this.bookCombo.checkInsurranceFee ? true : false);
      if(this.bookCombo.ComboTitle.length >0){
        let arr = this.bookCombo.ComboTitle.split('+');
        this.titlecomboshort='';
        if(arr.length >1){
          let arr1 = arr[0].split(' ');
          if(arr1.length >1){
            this.titlecomboshort += arr1[1];
            this.titlecomboshort += "+Vé máy bay";
          }else{
            this.titlecomboshort += arr1[0];
            this.titlecomboshort += "+Vé máy bay";
          }
        }else{
          this.titlecomboshort = this.titlecombo;
        }
      }
      this.bookCombo.tileComboShort = this.titlecomboshort;
      var cb;
      if (this.bookCombo.ComboDetail.details.length == 1) {
        cb = this.bookCombo.ComboDetail.details[0];
        this.bookcombodetail = cb;
      } else {
        this.bookCombo.ComboDetail.details.forEach(element => {
          let df = moment(element.stayFrom).format('YYYY-MM-DD');
          let dt = moment(element.stayTo).format('YYYY-MM-DD');
          if (moment(this.booking.CheckInDate).diff(moment(df), 'days') >= 0 && moment(dt).diff(moment(this.booking.CheckInDate), 'days') >= 0
            && moment(this.booking.CheckOutDate).diff(moment(df), 'days') >= 0 && moment(dt).diff(moment(this.booking.CheckOutDate), 'days') >= 0) {
            cb = element;
            this.bookcombodetail = element;
          }
        });
        if(!cb){
          cb= this.bookCombo.ComboDetail.details[0];
            this.bookcombodetail = cb;
        }
      }
      this.totalPriceSale = cb.totalPriceSale;
      this.departTicketSale = cb.departTicketSale;
      this.returnTicketSale = cb.returnTicketSale;
      this.basepricesale = cb.totalPriceSale - cb.departTicketSale - cb.returnTicketSale;
      this.roomPriceSale = this.basepricesale;
      this.totalInfant = this.infant;
      this.totalChild = this.children - this.infant;
      this.childrendisplay = this.children;
      
      this.adultsdisplay = this.booking.Adults;
      //PDANH 10/06/2019: Check tuổi trẻ em >=12 tuổi tính giá vé = người lớn
      if (this.arrchild) {
        for (let i = 0; i < this.arrchild.length; i++) {
          if (i == this.arrchild.length - 1) {
            this.textage = this.textage + this.arrchild[i].numage;
          } else {
            this.textage = this.textage + this.arrchild[i].numage + ",";
          }
          //PDANH 10/06/2019: Check tuổi trẻ em >=12 tuổi tính giá vé = người lớn
          if(this.arrchild[i].numage >=12){
            this.children--;
            this.totalChild--;
            this.adults++;
            this.totalAdult++;
          }
        }
        if (this.textage) {
          this.textage = "(" + this.textage + ")";
        }
      }
      if (this.adultsdisplay > 0) {
        this.paxtitle += this.adultsdisplay + ' người lớn';
      }
      if (this.childrendisplay > 0) {
        this.paxtitle += ', ' + this.childrendisplay + ' trẻ em';
      }
      
      this.getHotelContractPrice(this.bookCombo.FormParam);
      // this.GetUserInfo();
      this.storage.get('point').then(point => {
        if (point) {
          //point=500;
          if (point > 0) {
            this.pointshow=point;
            this.Roomif.point = point;
            this.point = point * 1000;
            this.price = this.point.toLocaleString();
          }
        }
      });
    }, 350)
    //Bỏ cache khi tích hợp api jetstar
    //clear cache sau 15p
    // this.intervalID = setInterval(() => {
    //   if (this.listkeys.length > 0) {
    //     this.listkeys.forEach(key => {
    //       this.storage.remove(key);
    //     });
    //   }
    // }, 60000 * 15);
    
  }
  ionViewDidEnter() {
    var se = this;
    se.GetUserInfo();
  }
  ngOnInit() {
    var se = this;
    //let key = 'listflight_' + se.booking.HotelId + '_' + se.booking.CheckInDate + '_' + se.booking.CheckOutDate + '_' + se.bookCombo.ComboDetail.departureCode + '_' + se.bookCombo.arrivalCode + '_' + se.adults + '_' + se.children + '_' + se.infant;
    //Bỏ cache vmb
    // se.listkeys.push(key);
    // se.storage.get(key).then((jsondata:any)=>{
    //   if(jsondata){
    //     se.loaddatafromcache = true;
    //     se.listDepart = jsondata.depart;
    //     se.listReturn = jsondata.return;

    //     if(se.listDepart && se.listDepart[0].flights.length >0){
    //       se.listDepart[0].flights.forEach(element => {
    //         var priceFlightAdult = 0;
    //         element.priceSummaries.forEach(e => {
    //           if (e.passengerType == 0) {
    //             priceFlightAdult += e.price;
    //           }
    //         });
    //         element.priceorder = priceFlightAdult;
    //       });
    //       se.sort('priceorder', se.listDepart[0]);
    //       se.checkvalueDepart(se.listDepart[0]);
    //       se.currentDepartFlight = se.departfi;
    //     }

    //     if(se.listDepart && se.listDepart[0].flights.length >0){
    //       se.listReturn[0].flights.forEach(element => {
    //         var priceFlightAdult = 0;
    //         element.priceSummaries.forEach(e => {
    //           if (e.passengerType == 0) {
    //             priceFlightAdult += e.price;
    //           }
    //         });
    //         element.priceorder = priceFlightAdult;
    //       });
    //       se.sort('priceorder', se.listReturn[0]);
    //       se.checkReturnList(se.listReturn[0]);
    //       se.currentReturnFlight = se.returnfi;
    //     }
    //     se.loadFlightData(se.departfi, se.returnfi);
    //   } else {
    //     se.getdata();
    //   }
    // })
    setTimeout(()=> {
      se.getdata();
    }, 400)
    
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  //Lấy số điểm
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
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roomdetailreview";
            error.func = "GetUserInfo";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            if (body) {
              var data = JSON.parse(body);
              se.zone.run(() => {
                var info;
                var checkfullname = se.validateEmail(data.fullname);
                
                if (!checkfullname) {
                  var textfullname = data.fullname.split(' ')
                  //info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                  if (textfullname.length > 2) {
                    let name = '';
                    for (let i = 1; i < textfullname.length; i++) {
                      if (i == 1) {
                        name += textfullname[i];
                      } else {
                        name += ' ' + textfullname[i];
                      }
                    }
                    info = { ho: textfullname[0], ten: name, phone: data.phone }
                  } else {
                    info = { ho: textfullname[0], ten: textfullname[1], phone: data.phone }
                  }
                  se.storage.set("infocus", info);
                } else {
                  info = { ho: "", ten: "", phone: data.phone }
                  se.storage.set("infocus", info);
                }
                se.storage.remove('point');
                se.storage.set('point', data.point);
                se.storage.get('point').then(point => {
                  if (point) {
                    if (point > 0) {
                      se.pointshow=point;
                      se.Roomif.point = point;
                      se.point = point * 1000;
                      se.price = se.point.toLocaleString();
                    }
                  }
                });
              })
              //se.storage.set('userInfoData', data);
            }

          }
        });
      }
    })
  }
  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
  sort(property, listsort) {
    var se = this;
    if (listsort && listsort.flights.length > 0) {
      se.zone.run(() => listsort.flights.sort(function (a, b) {
        let direction = -1;
        if (property == "priceorder") {
          if (a[property] * 1 < b[property] * 1) {
            return 1 * direction;
          }
          else if (a[property] * 1 > b[property] * 1) {
            return -1 * direction;
          }
        }
      }));
    }
  };
  /**
   * Load giá phòng của combo 
   * @param data - data giá phòng (Nếu không có dữ liệu = ko có phòng trống)
   */
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
            page: "flightcomboreviews",
            func: "getHotelContractPrice",
            message: response.statusMessage,
            content: response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
          C.writeErrorLog(objError,response);
        }
        if (error) {
          error.page = "flightcomboreviews";
          error.func = "getHotelContractPrice";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        };
        se.zone.run(() => {
          var result = JSON.parse(body);

          if (result.Hotels) {
            se.jsonroom = result.Hotels[0].RoomClasses;
            let cbp = se.bookcombodetail;
            var element = se.checkElement(se.jsonroom);
            if (element) {
              se.nameroom = element.ClassName;
              se.callSummaryPrice(element);
            } else {
              se.loadpricedone = true;
            }
          } else {
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
      if (element && element.MealTypeRates[0].RoomId == se.bookcombodetail.roomId && !element.MSGCode) {
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
  /**
   * Tính tổng tiền combo
   */
  callSummaryPrice(element) {
    var se = this;
    if (element && !element.MSGCode) {
      // Giá nhà cung cấp
      se.TravPaxPrices = element.MealTypeRates[0].PriceAvgPlusNet * se.roomnumber * se.TotalNight;

      se.roomclass = element;
      se.elementMealtype = element.MealTypeRates[0];

      se.AdultCombo = element.Rooms[0].IncludeAdults * se.elementMealtype.TotalRoom;
      se.AdultCombo = se.AdultCombo > se.totalAdult ? se.totalAdult : se.AdultCombo;

      se.transportPriceSale = se.transportPriceSale * (se.totalAdult - se.AdultCombo);
      se.transportPriceNet = se.transportPriceNet * (se.totalAdult - se.AdultCombo);

      se.TotalPriceCombo = se.totalPriceSale * se.AdultCombo;
      se.totalAdultExtrabed = se.totalAdult - se.AdultCombo;
      se.MathGaladinnerAdExtrabed();
      if (se.currentDepartFlight != undefined) {
        se.SaveFlightDepartSelected();
      }
      if (se.currentDepartFlight != undefined) {
        se.SaveFlightReturnSelected();
      }
      se.MathPriceAll();
    }
  }
  /**
   * Hàm tính lại giá vé máy bay
   * PDANH 27/04/2019
   */
  getFlightPriceSale(departFlight, returnFlight): number {
    var se = this;
    var flightprice = 0;
    if (departFlight && departFlight.flights[0].priceSummaries) {
      flightprice += departFlight.flights[0].totalPrice;
      se.daydeparttitle = se.getDayOfWeek(new Date(departFlight.flights[0].departTime)) + ', ' + moment(new Date(departFlight.flights[0].departTime)).format('DD-MM-YYYY');
    } if (returnFlight && returnFlight.flights[0].priceSummaries) {
      flightprice += returnFlight.flights[0].totalPrice;
      se.dayreturntitle = se.getDayOfWeek(new Date(returnFlight.flights[0].departTime)) + ', ' + moment(new Date(returnFlight.flights[0].departTime)).format('DD-MM-YYYY');
    }
    if (!departFlight && !returnFlight) {
      let cb = se.bookcombodetail;
      flightprice = (cb.departTicketSale + cb.returnTicketSale) * se.adults;
    }
    return flightprice;
  }

  goback() {
    this.navCtrl.navigateBack('/hoteldetail/' + this.booking.HotelId);
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.booking.HotelId]);
  }
  /**
   * Hàm lấy thông tin chuyến bay
   * PDANH 27/04/2019
   */
  getdata() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + "/get-flight-for-olivia?apiToken=3b760e5dcf038878925b5613c32615ea3&departDate=" + se.booking.CheckInDate + '&returnDate=' + se.booking.CheckOutDate + '&departCode=' + se.bookCombo.ComboDetail.departureCode + '&arrivalCode=' + se.bookCombo.arrivalCode + '&adult=' + se.adults + '&child=' + (se.children - se.infant) + '&infant=' + se.infant + '&FlagInt=false',
          timeout: 180000, maxAttempts: 5, retryDelay: 2000,
          headers: {
            apiToken: '3b760e5dcf038878925b5613c32615ea3',
          }
        };
        request(options, function (error, response, body) {
          se.loadpricedone = true;
          if (response.statusCode != 200) {
            var objError = {
              page: "flightcomboreviews",
              func: "getdata",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "flightcomboreviews";
            error.func = "loaddata";
            error.param = JSON.stringify(options);
            C.writeErrorLog(objError,response);
          }
          if (response.statusCode == 200) {
            let jsondata = JSON.parse(body);
            se.storage.set('listflight_' + se.booking.HotelId + '_' + se.booking.CheckInDate + '_' + se.booking.CheckOutDate + '_' + se.bookCombo.ComboDetail.departureCode + '_' + se.bookCombo.arrivalCode + '_' + se.adults + '_' + se.children + '_' + se.infant, jsondata);
            se.zone.run(() => {
              se.listDepart = jsondata.depart;
              se.listReturn = jsondata.return;

              if(se.listDepart && se.listDepart[0].flights.length >0){
                se.listDepart[0].flights.forEach(element => {
                  var priceFlightAdult = 0;
                  element.priceSummaries.forEach(e => {
                    if (e.passengerType == 0) {
                      priceFlightAdult += e.price;
                    }
                  });
                  element.priceorder = priceFlightAdult;
                });
                se.sort('priceorder', se.listDepart[0]);
                se.checkvalueDepart(se.listDepart[0]);
                se.currentDepartFlight = se.departfi;
              }
              
              if(se.listReturn && se.listReturn[0].flights.length >0){
                se.listReturn[0].flights.forEach(element => {
                  var priceFlightAdult = 0;
                  element.priceSummaries.forEach(e => {
                    if (e.passengerType == 0) {
                      priceFlightAdult += e.price;
                    }
                  });
                  element.priceorder = priceFlightAdult;
                });
                se.sort('priceorder', se.listReturn[0]);
                se.checkReturnList(se.listReturn[0]);
                se.currentReturnFlight = se.returnfi;
              }

                se.loadFlightData(se.departfi, se.returnfi);
            })
            if(se.listDepart[0].flights.length == 0 || se.listReturn[0].flights.length == 0){
              se.PriceAvgPlusTAStr =0;
            }
          }
        })
      }
    })

  }
  //Hàm check VMB giá thấp nhất trong khung giờ chấp nhận được
  checkvalueDepart(list) {
    var Hour; var Minute; var kq;
    var good = [];
    var medium = [];
    var other = [];
    
      for (let i = 0; i < list.flights.length; i++) {
        // var dateTime = new Date(list.flights[i].departTime);
        // Hour = moment(dateTime).format("HH");
        // Minute = moment(dateTime).format("mm");
        let ar_time = list.flights[i].departTime.toString().split('T')[1];
        Hour = ar_time.toString().split(':')[0];
        Minute = ar_time.toString().split(':')[1];
        kq = Hour * 60 + Number(Minute);

        if (kq >= 360 && kq <= 960) {
          if (kq >= 480 && kq <= 660) {
            good.push(list.flights[i]);
          }
          else {
            medium.push(list.flights[i]);
          }
        }
        else {
          other.push(list.flights[i]);
        }
      }
      // if (medium.length > 0) {
      //   this.departfi = medium;
      // }
      // else if(good.length>0)
      // {
      //   this.departfi = good;
      // }
      // else if(other.length>0)
      // {
      //   this.departfi = other;
      // }
      if (medium.length > 0) {
        this.departfi = medium;
      }else{
       if(good.length>0)
        {
          this.departfi = good;
        }
        
      }
      if(this.departfi.length ==0){
        this.departfi = other;
      }
  }

  checkReturnList(list){
    var Hour; var Minute; var kq;
    var good = [];
    var medium = [];
    var other = [];
      for (let i = 0; i < list.flights.length; i++) {
        // var dateTime = new Date(list.flights[i].departTime);
        // Hour = moment(dateTime).format("HH");
        // Minute = moment(dateTime).format("mm");
        let ar_time = list.flights[i].departTime.toString().split('T')[1];
        Hour = ar_time.toString().split(':')[0];
        Minute = ar_time.toString().split(':')[1];
        kq = Hour * 60 + Number(Minute);

        if (kq >= 600 && kq < 1440) {
          if (kq >= 840 && kq <= 1020) {
            good.push(list.flights[i]);
          }
          else {
            medium.push(list.flights[i]);
          }
        }
        else {
          other.push(list.flights[i]);
        }
      }
      if (medium.length > 0) {
        this.returnfi = medium;
      }else{
       if(good.length>0)
        {
          this.returnfi = good;
        }
        
      }
      if(this.returnfi.length ==0){
        this.returnfi = other;
      }
  }

  /**
   * Hàm bind lại thông tin chuyến bay + tiền vé khi thay đổi chuyến
   * PDANH 27/04/2019
   */
  loadFlightData(departFlight, returnFlight) {
    var se = this;
    se.listDeparture = [];
    if (departFlight && departFlight.length > 0) {
      se.listDeparture.push(departFlight[0]);
      let de_date = new Date(departFlight[0].departTime);
      let de_date_landing = new Date(departFlight[0].landingTime);
      let de_hour = moment(de_date).format("HH");
      let de_minute = moment(de_date).format("mm");
      let de_hour_landing = moment(de_date_landing).format("HH");
      let de_minute_landing = moment(de_date_landing).format("mm");
      if (departFlight[0].departTime.toString().indexOf('T')) {
        de_date = new Date(departFlight[0].departTime.toString().split('T')[0]);
        de_date_landing = new Date(departFlight[0].landingTime.toString().split('T')[0]);
        let de_time = departFlight[0].departTime.toString().split('T')[1];
        de_hour = de_time.toString().split(':')[0];
        de_minute = de_time.toString().split(':')[1];
        let ar_time_landing = departFlight[0].landingTime.toString().split('T')[1];
        de_hour_landing = ar_time_landing.toString().split(':')[0];
        de_minute_landing = ar_time_landing.toString().split(':')[1];
      }

      se.de_departtime = de_hour + ':' + de_minute + ' → ' + de_hour_landing + ':' + de_minute_landing;
      se.de_departdatestr = "Đi " + se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');
      se.daydeparttitle = se.getDayOfWeek(de_date) + ', ' + moment(de_date).format('DD-MM-YYYY');

      let priceFlightAdult = 0;
      departFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 0) {
          priceFlightAdult += e.price;
        }
      });
      if (se.bookcombodetail.departTicketSale > priceFlightAdult) {

        let pricesdepartstr = se.bookcombodetail.departTicketSale - priceFlightAdult;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') - pricesdepartstr;
        //se.de_flightpricetitle = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.de_departpriceincrease = false;

      }
      if (se.bookcombodetail.departTicketSale <= priceFlightAdult) {

        let pricesdepartstr = priceFlightAdult - se.bookcombodetail.departTicketSale;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') + pricesdepartstr;
        //se.de_flightpricetitle = pricesdepartstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.de_departpriceincrease = true
      }
      //Gán giá vé máy bay chênh
      se.JsonSurchargeFee.DepartTicketDifferenceFee = priceFlightAdult - se.bookcombodetail.departTicketSale;

    }

    if (returnFlight && returnFlight.length > 0) {
      se.listDeparture.push(returnFlight[0]);
      let ar_date = new Date(returnFlight[0].departTime);
      let ar_date_landing = new Date(returnFlight[0].landingTime);
      let ar_hour = moment(ar_date).format("HH");
      let ar_minute = moment(ar_date).format("mm");
      let ar_hour_landing = moment(ar_date_landing).format("HH");
      let ar_minute_landing = moment(ar_date_landing).format("mm");
      if (returnFlight[0].departTime.toString().indexOf('T')) {
        ar_date = new Date(returnFlight[0].departTime.toString().split('T')[0]);
        ar_date_landing = new Date(returnFlight[0].landingTime.toString().split('T')[0]);
        let ar_time = returnFlight[0].departTime.toString().split('T')[1];
        ar_hour = ar_time.toString().split(':')[0];
        ar_minute = ar_time.toString().split(':')[1];
        let ar_time_landing = returnFlight[0].landingTime.toString().split('T')[1];
        ar_hour_landing = ar_time_landing.toString().split(':')[0];
        ar_minute_landing = ar_time_landing.toString().split(':')[1];
      }

      se.ar_departtime = ar_hour + ':' + ar_minute + ' → ' + ar_hour_landing + ':' + ar_minute_landing;
      se.ar_departdatestr = "Về " + se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD-MM-YYYY');
      se.dayreturntitle = se.getDayOfWeek(ar_date) + ', ' + moment(ar_date).format('DD-MM-YYYY');

      let priceFlightAdult = 0;
      returnFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 0) {
          priceFlightAdult += e.price;
        }
      });
      if (se.bookcombodetail.returnTicketSale > priceFlightAdult) {
        let pricesreturnstr = se.bookcombodetail.returnTicketSale - priceFlightAdult;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') - pricesreturnstr;
        //se.ar_flightpricetitle = pricesreturnstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.ar_departpriceincrease = false
      }
      if (se.bookcombodetail.returnTicketSale <= priceFlightAdult) {
        let pricesreturnstr = priceFlightAdult - se.bookcombodetail.returnTicketSale;
        se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '') + pricesreturnstr;
        //se.ar_flightpricetitle = pricesreturnstr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
        se.ar_departpriceincrease = true
      }
      //Gán giá vé máy bay chênh
      se.JsonSurchargeFee.ReturnTicketDifferenceFee = priceFlightAdult - se.bookcombodetail.returnTicketSale;
    }
    if(se.currentDepartFlight){
      se.flightdeparttitle = 'Từ ' + se.currentDepartFlight[0].fromPlace + ' đi ' + se.currentDepartFlight[0].toPlace;
      se.fromPlace = se.currentDepartFlight[0].fromPlace;
      se.toPlace = se.currentDepartFlight[0].toPlace;
      se.callSummaryPrice(se.roomclass);
    }
    
    se.loadflightpricedone = true;
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
  changeDate() {

  }
  next() {
    //build object flight json
    if(!this.loadflightpricedone){
      return;
    }
    if(!this.currentDepartFlight || !this.currentReturnFlight){
      if(!this.currentDepartFlight){
        this.gf.showToastWarning('Không lấy được thông tin chuyến bay đi, mong quý khách thông cảm! Vui lòng chọn lại lịch bay.');
      }else{
        this.gf.showToastWarning('Không lấy được thông tin chuyến bay về, mong quý khách thông cảm! Vui lòng chọn lại lịch bay.');
      }
      this.zone.run(()=>{
        this.PriceAvgPlusTAStr = 0;
      })
      
      return;
    }
    //this.presentLoading();
    var pointprice = 0;
    var total = this.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
    if (this.ischeck) {
      pointprice = this.point;
      if (this.ischeckpoint) {
        pointprice = this.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      total = this.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
    }
    if (this.ischeckbtnpromo) {
      total = this.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      this.bookCombo.ischeckbtnpromo=this.ischeckbtnpromo;
      this.bookCombo.discountpromo=this.discountpromo;
    }
    else
    {
      this.bookCombo.ischeckbtnpromo=this.ischeckbtnpromo;
      this.bookCombo.discountpromo=0;
      this.promocode= "";
    }
    var officestr = "";
    if(this.bookCombo.ComboDetail.departureCode){
      officestr = this.bookCombo.ComboDetail.departureCode == "SGN" ? "HCM" : (this.bookCombo.ComboDetail.departureCode == "HAN" ? "HN" : (this.bookCombo.ComboDetail.departureCode == "VCA" ? "CT" : "") );
    }
    this.storage.get('jti').then(jti => {
      if (jti) {
        this.JsonSurchargeFee.ComboData = {
          ComboId: this.bookCombo.ComboId,
          MealTypeCode: this.bookCombo.MealTypeCode,
          AdultCombo: this.adultCombo
        }
        var objectFlight = {
          FlightBooking: {
            fromPlaceCode: this.bookCombo.ComboDetail.departureCode,
            toPlaceCode: this.bookCombo.arrivalCode,
            flightType: "2",
            adult: this.adults,
            child: this.children - this.infant,
            infant: this.infant,
            departFlight: {
              AirlineCode: this.currentDepartFlight[0].details[0].airlineCode,
              FlightNumber: this.currentDepartFlight[0].details[0].flightNumber,
              DepartTime: this.currentDepartFlight[0].details[0].departTime,
              FareBasis: this.currentDepartFlight[0].fareBasis,
              FlightDuration: this.currentDepartFlight[0].details[0].flightDuration,
              LandingTime: this.currentDepartFlight[0].details[0].landingTime,
              Stops: 0,
              TicketType: this.currentDepartFlight[0].ticketType,
              PriceSummaries: this.currentDepartFlight[0].priceSummaries
            },
            returnFlight: {
              AirlineCode: this.currentReturnFlight[0].details[0].airlineCode,
              FlightNumber: this.currentReturnFlight[0].details[0].flightNumber,
              DepartTime: this.currentReturnFlight[0].details[0].departTime,
              FareBasis: this.currentReturnFlight[0].fareBasis,
              FlightDuration: this.currentReturnFlight[0].details[0].flightDuration,
              LandingTime: this.currentReturnFlight[0].details[0].landingTime,
              Stops: 0,
              TicketType: this.currentReturnFlight[0].ticketType,
              PriceSummaries: this.currentReturnFlight[0].priceSummaries
            }
    
          },
          HotelBooking: {
            HotelId: this.booking.HotelId.toString(),
            CheckIn: moment(this.booking.CheckInDate).format('YYYY-MM-DD'),
            CheckOut: moment(this.booking.CheckOutDate).format('YYYY-MM-DD'),
            TotalRoom: this.roomnumber,
            TotalPrices: total,
            //TotalPrices : this.bookCombo.totalprice,
            RoomStatus: this.elementMealtype.Status,
            BreakfastInclude: this.bookCombo.MealTypeCode,
            BreakfastIncludeName: this.bookCombo.MealTypeName,
            PaymentMethod: "2",
            CName: this.username,
            CEmail: this.email,
            CAddress: "",
            CPhone: "",
            CTitle: "",
            LeadingName: "",
            LeadingEmail: "",
            LeadingPhone: "",
            LeadingNationality: "",
            IsInvoice: 0,
            Note: "",
            BookingStatus: "0",
            Adult: this.adults,
            AdultCombo: this.adultCombo,
            Child: this.children,
            TravPaxPrices: this.TravPaxPrices,
            Office: officestr,//Gán văn phòng khi tạo bkg
            FromPlaceCode: this.bookCombo.ComboDetail.departureCode,
            RoomName: this.elementMealtype.RoomName,
            RoomPrices: this.elementMealtype.PriceAvgPlusTA,
            RoomId: this.elementMealtype.RoomId,
            MealTypeNote: (this.elementMealtype.PromotionInclusions.length > 0 ? this.elementMealtype.PromotionInclusions.join(' \r\n') : "") + (this.elementMealtype.Notes != null && this.elementMealtype.Notes.length > 0 ? this.elementMealtype.Notes.join('\r\n,') : ""),
            PromotionNote: this.elementMealtype.PromotionNote,
            PersonIncharge: "",
            DiscountAmount: "0",
            SupplierRef: null,
            ChildAges: this.booking.ChildAge,
            PenaltyDescription: null,
            CompName: "",
            CompAddress: "",
            CompTaxCode: "",
            JsonSurchargeFee: JSON.stringify(this.JsonSurchargeFee),
            Commission: this.Commission,
            Source: '6',//Update key bkg cho ios
            Supplier: (this.elementMealtype.IsHoliday ? "Holiday" : (this.elementMealtype.IsVoucher ? "Voucher" : this.elementMealtype.Supplier)),
            MemberId:jti,
            UsePointPrice:pointprice,
            promotionCode:this.promocode,
            //hasInsurrance = true: đã bao gồm bảo hiểm trong giá combo
            //hasInsurrance = false: chưa bao gồm bảo hiểm
            //checkInsurranceFee = true: Người dùng có tích chọn gói bảo hiểm
            //checkInsurranceFee = false: Người dùng không chọn gói bảo hiểm
            Insurance: this.hasInsurrance ? this.hasInsurrance : (this.bookCombo.checkInsurranceFee ? true : false),
            SurchargeFee: this.objInsurranceFee ? JSON.stringify({
              type: "Insurance",
              PassengerType: 0,
              PriceType: 1,
              Text: this.objInsurranceFee.name,
              Quantity: this.adults + this.children,
              Price: this.hasInsurrance ? 0 : this.objInsurranceFee.priceNetTotal,
              PriceFormat: this.objInsurranceFee.priceNetTotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."),
              "$$hashKey": "object:473"
            }) : 0,
          },
          airLineLuggageDepart: this.currentDepartFlight[0].airLineLuggage,
          airLineLuggageReturn: this.currentReturnFlight[0].airLineLuggage,
        }
        this.gf.googleAnalytionCustom('add_to_cart',{item_category:'flightcombo' , item_name: this.bookCombo.ComboTitle, item_id: this.bookCombo.HotelCode, start_date: this.cin, end_date: this.cout, origin: this.bookCombo.ComboDetail.departureCode, destination: this.bookCombo.arrivalCode, value: Number(this.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '')),currency: "VND" });
        this.gf.setParams(objectFlight, 'flightcombo');
        //thêm id chuyến bay để giữ chỗ
        this.bookCombo.iddepart=this.currentDepartFlight[0].id;
        this.bookCombo.idreturn=this.currentReturnFlight[0].id;
        this.navCtrl.navigateForward('/flightcomboadddetails');
      }
    })
    
  }

  changedate() {
    this.navCtrl.navigateForward('/hoteldetail/' + this.booking.HotelId);
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.booking.HotelId]);
  }

  async presentLoading() {
    let loader = await this.loadingCtrl.create({
      duration: 1000
    });
    loader.present();
  }


  async showListFlight(index) {
    var se = this;
    se.gf.setParams({ listdepart: se.listDepart, listreturn: se.listReturn, title: index == 0 ? se.daydeparttitle : se.dayreturntitle, isdepart: index == 0 ? true : false, flightdeparttitle: se.flightdeparttitle }, 'listflight');
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: FlightDeparturePage
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (data.data) {
        se.zone.run(() => {
          let objDepart = se.listDepart[0];
          let objReturn = se.listReturn[0];
          if (!se.currentDepartFlight) {
            se.currentDepartFlight = objDepart;
          }

          if (!se.currentReturnFlight) {
            se.currentReturnFlight = objReturn;
          }

          if (data.data.isdepart) {
            se.currentDepartFlight = data.data.flights.flights;
            se.loadFlightData(se.currentDepartFlight, se.currentReturnFlight);
          } else {
            se.currentReturnFlight = data.data.flights.flights;
            se.loadFlightData(se.currentDepartFlight, se.currentReturnFlight);
          }

        })
      }
    })
  }


  ////////////////////////////////////
  /**
   * Hàm tính lại tổng tiền + phụ phí
   * PDANH 27/04/2019
   */
  MathPriceAll() {
    var se = this;
    var surchargePlus = se.JsonSurchargeFee.SurchargeFee.reduce(function (acc, val) { return acc + val.Price; }, 0);
    let adultFlightNumber = se.adults;
    se.JsonSurchargeFee.TransportPriceSale = se.transportPriceSale + se.transportPriceSaleForChild;
    se.totalTransportPriceSale = se.JsonSurchargeFee.TransportPriceSale;
    se.totalSurchargeWeekendFee = 0;

    se.JsonSurchargeFee.TotalAll = se.TotalPriceCombo +
      se.JsonSurchargeFee.RoomDifferenceFee
      + se.JsonSurchargeFee.DepartTicketDifferenceFee
      + se.JsonSurchargeFee.ReturnTicketDifferenceFee
      + se.totalSurchargeWeekendFee
      + se.totalTransportPriceSale
      + surchargePlus
      + se.totalAirLineLuggage;
    let GetSubPriceForAdultExtrabed = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.PassengerType == 0 && (e.Code == 'EXBA' || e.type == 'flightDepart' || e.type == 'flightReturn') });
    se.totalPriceForEXBA = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'EXBA' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);//= GetSubPriceForAdultExtrabed.reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);

    let GetSubPriceForChild = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1 || e.PassengerType == 2) && (e.Code == 'CWE' || e.Code == 'EXBC' || e.type == 'flightDepart' || e.type == 'flightReturn') });
    se.totalPriceForChildCWE = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'CWE' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);
    se.totalPriceForChildEXBC = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'EXBC' }).reduce(function (acc, val) { return acc + val.Price / val.Quantity; }, 0);
    se.totalPriceInfant = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.PassengerType == 2 }).reduce(function (acc, val) { return acc + val.Price; }, 0);

    let GetSubPriceForOtherFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code != 'EXBA' && e.Code != 'CWE' && e.Code != 'EXBC' && e.type != 'flightDepart' && e.type != 'flightReturn' });

    se.totalPriceForOtherFee = GetSubPriceForOtherFee.reduce(function (acc, val) { return acc + val.Price; }, 0);
    se.JsonSurchargeFee.TotalAll = se.JsonSurchargeFee.TotalAll - se.totalPriceForOtherFee;
    se.JsonSurchargeFee.AdultUnit = se.ComboPriceDiff.RoomDiff.AdultUnit;


    se.totalGetSubPriceForAdultExtrabed = GetSubPriceForAdultExtrabed.reduce(function (acc, val) { return acc + val.Price; }, 0);
    se.totalGetSubPriceForChild = GetSubPriceForChild.reduce(function (acc, val) { return acc + val.Price; }, 0);

    se.totalQuantityChildCWEAndEXBC = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.Code == 'CWE' || e.Code == 'EXBC' }).reduce(function (acc, val) { return acc + val.Quantity; }, 0);
    se.totalQuantityFlightForChildAndInfant = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1 || e.PassengerType == 2) && (e.type == 'flightDepart' || e.type == 'flightReturn') }).reduce(function (acc, val) { return acc + val.Quantity; }, 0) / 2;
    se.totalQuantityFlightForChild = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return (e.PassengerType == 1) && (e.type == 'flightDepart' || e.type == 'flightReturn') }).reduce(function (acc, val) { return acc + val.Quantity; }, 0) / 2 - adultFlightNumber;

    se.totalPriceChild = 0;
    if (se.totalPriceForChildCWE > 0 && se.totalPriceForChildEXBC > 0) {
      se.totalPriceChild == 0
    }
    else if (se.totalQuantityChildCWEAndEXBC < (se.totalQuantityFlightForChildAndInfant) && se.currentDepartFlight != undefined && se.currentReturnFlight != undefined) {
      se.totalPriceChild = (se.totalQuantityFlightForChild - se.totalQuantityChildCWEAndEXBC) * (se.ComboPriceDiff.DepartFlightDiff.ChildUnit + se.ComboPriceDiff.ReturnFlightDiff.ChildUnit) + (se.ChildOtherFeeTotal - se.ChildOtherFee * se.totalQuantityChildCWEAndEXBC);  //$.grep(se.JsonSurchargeFee.SurchargeFee, function (e) { return e.PassengerType == 1 }).reduce(function (acc, val) { return acc + val.Price; }, 0);
    }

    if (adultFlightNumber > 0) {

      se.totalPriceChild += (se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb + se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb) * adultFlightNumber;
    }

    if (se.totalChild > 0) {
      se.ComboPriceDiff.RoomDiff.ChildUnit = se.totalGetSubPriceForChild / se.totalChild;

    }
    se.totalFlightDepart = se.currentDepartFlight == undefined ? 0 : se.currentDepartFlight[0].priceSummaries.reduce(function (acc, val) { return acc + val.total; }, 0);
    se.totalFlightReturn = se.currentReturnFlight == undefined ? 0 : se.currentReturnFlight[0].priceSummaries.reduce(function (acc, val) { return acc + val.total; }, 0);
    se.commissionFlight = se.ComboPriceDiff.DepartFlightDiff.CommissionAdult * se.AdultCombo + se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult * se.AdultCombo;
    se.commissionDepart = se.ComboPriceDiff.DepartFlightDiff.CommissionAdult * se.AdultCombo;
    if (se.commissionFlight < 0) {
      se.commissionFlight = 0;
    }
    se.Commission = (se.elementMealtype == undefined ? 0 : se.JsonSurchargeFee.TotalAll - (se.totalFlightDepart + se.totalFlightReturn + (se.transportPriceNet * se.totalAdult + se.transportPriceNetForChild * (se.totalInfant + se.totalChild) + se.elementMealtype.PriceAvgPlusNet * se.elementMealtype.TotalRoom * se.TotalNight) + se.JsonSurchargeFee.BaggageDepart + se.JsonSurchargeFee.BaggageReturn));

    let pricetotal = se.JsonSurchargeFee.TotalAll;
    //Tính thêm tiền bảo hiểm nếu có tích chọn mua bảo hiểm đi kèm combo
    if(!se.hasInsurrance && se.bookCombo.checkInsurranceFee){
      pricetotal += se.objInsurranceFee.priceTaTotal;
    }
    se.PriceAvgPlusTAStr = pricetotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

    var tempprice = se.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
    
    if (se.point > 0) {
      se.Pricepoint = tempprice - se.point;
      se.Pricepointshow = se.Pricepoint.toLocaleString();
      if (se.Pricepoint <= 0) {
        se.ischeckpoint = true;
        se.Pricepointshow = 0;
      }
      else{
        se.ischeckpoint = false;
      }
      //se.PriceAvgPlusTAStr = se.Pricepoint.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    }
    if (se.ischeckbtnpromo) {
      var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
      if (se.ischeck) {
        total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
      }
      se.Pricepointshow = total -  se.discountpromo;
      if (se.Pricepointshow>0) {
        se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        se.ischeckbtnpromo = true;
        se.ischeckpromo=true;
      }
      else
      {
        se.Pricepointshow=0;
      }
      se.ischecktext=0;
      se.ischeckerror=0;
    }
    se.bookCombo.totalprice = se.Pricepointshow ? se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : se.PriceAvgPlusTAStr;
    se.bookCombo.pricePointShow = se.Pricepointshow;
    se.bookCombo.PriceAvgPlusTAStr = se.PriceAvgPlusTAStr;
    se.bookCombo.point = se.point;
    if((!se.departfi || !se.returnfi) && se.loaddatafromcache){
      se.zone.run(()=>{
        se.PriceAvgPlusTAStr = 0;
        se.loadpricedone = true;
        se.loadflightpricedone = true;
      })
    }
  }

  edit() {
    this.zone.run(() => {
      //Tính thêm tiền bảo hiểm nếu có tích chọn mua bảo hiểm đi kèm combo
      var pricetotal = this.JsonSurchargeFee.TotalAll;
      if(!this.hasInsurrance && this.bookCombo.checkInsurranceFee){
        pricetotal += this.objInsurranceFee.priceTaTotal;
        this.PriceAvgPlusTAStr = pricetotal;
      }
      if (this.ischeck) {
        if (this.ischeckpoint) {
          this.Pricepointshow = 0;
        }
        // else {
        //   this.price = this.point.toLocaleString();
        //   var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
        //   this.Pricepoint = tempprice - this.point;
        //   this.Pricepointshow = this.Pricepoint.toLocaleString();
        //   this.bookCombo.totalprice = this.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        // }
        else
        {
          if (this.ischeckpromo) {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point-this.discountpromo;
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
          this.PriceAvgPlusTAStr = this.JsonSurchargeFee.TotalAll.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          var tempprice =   this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
          this.Pricepointshow = tempprice -  this.discountpromo;
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
        }
        else
        {
          this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.bookCombo.totalprice = this.PriceAvgPlusTAStr;
        }

      }
    })
  }
  /**
   * Hàm tính lại phụ phí của phòng
   * PDANH 27/04/2019
   */
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

    se.AdultOtherFee = se.AdultOtherFee * (se.roomclass.Rooms[0].IncludeAdults * se.roomnumber) / se.AdultCombo;
    se.PriceDiffUnit = se.AdultOtherFee + ((se.elementMealtype.PriceAvgDefaultTA * se.roomnumber) * se.TotalNight / se.AdultCombo) - se.roomPriceSale;

    se.ComboPriceDiff.RoomDiff.Total = se.elementMealtype.PriceAvgPlusTotalTA - (se.roomPriceSale * se.AdultCombo) //- totalExtraBedAndGalaDinerListTA;
    se.ComboPriceDiff.RoomDiff.AdultUnit = se.PriceDiffUnit;

    se.JsonSurchargeFee.RoomDifferenceFee = se.PriceDiffUnit * se.AdultCombo + (se.totalAdult - se.AdultCombo) * se.AdultOtherFee + se.ChildOtherFeeTotal;

  }
  /**
   * Tính lại giá + phụ phí khi đổi vé máy bay chiều đi
   * PDANH 27/04/2019
   */
  SaveFlightDepartSelected() {
    var se = this;
    if (!se.currentDepartFlight) return;
    se.JsonSurchargeFee.SurchargeFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.type != 'flightDepart'; });
    var priceFlightAdult = 0;
    se.currentDepartFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        priceFlightAdult += e.price;
      }
    });

    se.ComboPriceDiff.DepartFlightDiff.AdultUnit = priceFlightAdult - se.departTicketSale;
    var tempDiff = se.ComboPriceDiff.DepartFlightDiff.AdultUnit;
    se.ComboPriceDiff.DepartFlightDiff.CommissionAdult = Math.ceil((se.ComboPriceDiff.DepartFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.DepartFlightDiff.AdultUnit * 0.3) : -tempDiff) / 1000) * 1000;
    //Hiển thị giá tăng/giảm chiều đi
    se.de_flightpricetitle = Math.ceil((se.ComboPriceDiff.DepartFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.DepartFlightDiff.AdultUnit * 0.7) : tempDiff) / 1000) * 1000;
    se.de_flightpricetitle = se.de_flightpricetitle.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
    se.de_departpriceincrease = tempDiff > 0 ? true : false;
    se.ComboPriceDiff.DepartFlightDiff.AdultUnit = se.ComboPriceDiff.DepartFlightDiff.AdultUnit + (se.ComboPriceDiff.DepartFlightDiff.CommissionAdult > 0 ? se.ComboPriceDiff.DepartFlightDiff.CommissionAdult : 0);
    se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb = 0;
    se.currentDepartFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        se.ComboPriceDiff.DepartFlightDiff.AdultUnitExb += e.price;
      }
    });

    se.ComboPriceDiff.DepartFlightDiff.ChildUnit = 0;
    if (se.totalChild > 0) {
      se.ComboPriceDiff.DepartFlightDiff.ChildUnit = 0;
      se.currentDepartFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 1) {
          se.ComboPriceDiff.DepartFlightDiff.ChildUnit += e.price;
        }
      });

    }

    se.ComboPriceDiff.DepartFlightDiff.InfantUnit = 0;
    if (se.totalInfant > 0) {
      se.currentDepartFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 2) {
          se.ComboPriceDiff.DepartFlightDiff.InfantUnit += e.price;
        }
      });
    }

    se.JsonSurchargeFee.DepartTicketDifferenceFee = se.ComboPriceDiff.DepartFlightDiff.AdultUnit * se.AdultCombo;
    if (se.totalChild > 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 1, Quantity: (se.totalChild), PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (se.ComboPriceDiff.DepartFlightDiff.ChildUnit * (se.totalChild)), PriceFormat: (se.ComboPriceDiff.DepartFlightDiff.ChildUnit * (se.totalChild)).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalInfant > 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 2, Quantity: (se.totalInfant), PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (se.ComboPriceDiff.DepartFlightDiff.InfantUnit * se.totalInfant), PriceFormat: (se.ComboPriceDiff.DepartFlightDiff.InfantUnit * se.totalInfant).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalAdultExtrabed > 0 && se.adultFlightNumber == 0) {
      var priceItem = { type: 'flightDepart', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    } else if (se.adultFlightNumber > 0) {
      if (se.totalAdultExtrabed > 0) {
        var priceItem = { type: 'flightDepart', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem);
      }

      var priceItem1 = { type: 'flightDepart', PassengerType: 1, childAsAdult: true, Quantity: se.adultFlightNumber, PriceType: 1, Text: 'Vé máy bay chiều đi', Price: (priceFlightAdult * se.adultFlightNumber), PriceFormat: (priceFlightAdult * se.adultFlightNumber).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem1);

    }

    se.MathPriceAll();
  }
  /**
   * Tính lại giá + phụ phí khi đổi vé máy bay chiều về
   * PDANH 27/04/2019
   */
  SaveFlightReturnSelected() {
    var se = this;
    if (!se.currentReturnFlight) return;
    se.JsonSurchargeFee.SurchargeFee = se.JsonSurchargeFee.SurchargeFee.filter(function (e) { return e.type != 'flightReturn'; });
    //var priceFlightAdult = $.grep(se.FlightReturnSelected.priceSummaries, function (e) { return e.passengerType == 0; }).reduce(function (acc, val) { return acc + val.price; }, 0);
    var priceFlightAdult = 0;
    se.currentReturnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        priceFlightAdult += e.price;
      }
    });
    se.ComboPriceDiff.ReturnFlightDiff.AdultUnit = priceFlightAdult - se.returnTicketSale;
    var tempDiff = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit;
    se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult = Math.ceil((se.ComboPriceDiff.ReturnFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * 0.3) : -tempDiff) / 1000) * 1000;
    //Hiển thị giá tăng/giảm chiều về
    se.ar_flightpricetitle = Math.ceil((se.ComboPriceDiff.ReturnFlightDiff.AdultUnit < 0 ? Math.abs(se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * 0.7) : tempDiff) / 1000) * 1000;
    se.ar_flightpricetitle = se.ar_flightpricetitle.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") + 'đ';
    se.ar_returnpriceincrease = tempDiff > 0 ? true : false;
    se.ComboPriceDiff.ReturnFlightDiff.AdultUnit = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit + (se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult > 0 ? se.ComboPriceDiff.ReturnFlightDiff.CommissionAdult : 0);
    //se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb = $.grep(se.FlightReturnSelected.priceSummaries, function (e) { return e.passengerType == 0 }).reduce(function (acc, val) { return acc + val.price; }, 0);
    se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb = 0;
    se.currentReturnFlight[0].priceSummaries.forEach(e => {
      if (e.passengerType == 0) {
        se.ComboPriceDiff.ReturnFlightDiff.AdultUnitExb += e.price;
      }
    });

    se.ComboPriceDiff.ReturnFlightDiff.ChildUnit = 0;
    if (se.totalChild > 0) {
      se.ComboPriceDiff.ReturnFlightDiff.ChildUnit = 0;
      se.currentReturnFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 1) {
          se.ComboPriceDiff.ReturnFlightDiff.ChildUnit += e.price;
        }
      });

    }

    se.ComboPriceDiff.ReturnFlightDiff.InfantUnit = 0;
    if (se.totalInfant > 0) {
      se.currentReturnFlight[0].priceSummaries.forEach(e => {
        if (e.passengerType == 2) {
          se.ComboPriceDiff.ReturnFlightDiff.InfantUnit += e.price;
        }
      });
    }

    se.JsonSurchargeFee.ReturnTicketDifferenceFee = se.ComboPriceDiff.ReturnFlightDiff.AdultUnit * se.AdultCombo;
    if (se.totalChild > 0) {
      var priceItem = { type: 'flightReturn', PassengerType: 1, Quantity: (se.totalChild), PriceType: 1, Text: 'Vé máy bay chiều về', Price: (se.ComboPriceDiff.ReturnFlightDiff.ChildUnit * (se.totalChild)), PriceFormat: (se.ComboPriceDiff.ReturnFlightDiff.ChildUnit * (se.totalChild)).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalInfant > 0) {
      var priceItem = { type: 'flightReturn', PassengerType: 2, Quantity: (se.totalInfant), PriceType: 1, Text: 'Vé máy bay chiều về', Price: (se.ComboPriceDiff.ReturnFlightDiff.InfantUnit * se.totalInfant), PriceFormat: (se.ComboPriceDiff.ReturnFlightDiff.InfantUnit * se.totalInfant).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    if (se.totalAdultExtrabed > 0 && se.adultFlightNumber == 0) {
      var priceItem = { type: 'flightReturn', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều về', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
      se.JsonSurchargeFee.SurchargeFee.push(priceItem);
    }
    else
      if (se.adultFlightNumber > 0) {
        if (se.totalAdultExtrabed > 0) {
          var priceItem = { type: 'flightReturn', PassengerType: 0, Quantity: se.totalAdultExtrabed, PriceType: 1, Text: 'Vé máy bay chiều về', Price: priceFlightAdult * se.totalAdultExtrabed, PriceFormat: (priceFlightAdult * se.totalAdultExtrabed).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
          se.JsonSurchargeFee.SurchargeFee.push(priceItem);
        }
        var priceItem1 = { type: 'flightReturn', PassengerType: 1, childAsAdult: true, Quantity: se.adultFlightNumber, PriceType: 1, Text: 'Vé máy bay chiều về', Price: (priceFlightAdult * se.adultFlightNumber), PriceFormat: (priceFlightAdult * se.adultFlightNumber).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") };
        se.JsonSurchargeFee.SurchargeFee.push(priceItem1);
      }

    se.MathPriceAll();
  }

  async showPenalty() {
    let alert = await this.alertCtrl.create({
      header: "Giá rẻ (không hoàn tiền)",
      message: "Đây là giá đặc biệt thấp hơn giá thông thường, không thể hủy hoặc thay đổi. Trong trường hợp không thể sử dụng combo sẽ không hoàn lại tiền. <p style='text-align:center !important;font-style:italic;margin-bottom:0'>Nếu bạn đã có kế hoạch chắc chắn thì hãy chớp lấy cơ hội này.</p>",
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

  async sendRequestCombo() {
    this.bookCombo.Address = this.Address;
    this.bookCombo.ComboId = this.bookcombodetail.comboId;
    this.bookCombo.isFlightCombo = true;
    this.bookCombo.isFlashSale = false;
    this.bookCombo.isNormalCombo = false;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: RequestComboPage
      });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      this.valueGlobal.backValue = 'flightcombo';
      //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.booking.HotelId]);
      this.navCtrl.navigateBack('/hoteldetail/'+ this.booking.HotelId);
    })
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
          if (json.error==0) {
            var total = se.PriceAvgPlusTAStr.toString().replace(/\./g, '').replace(/\,/g, '');
            if (se.ischeck) {
              total = se.Pricepointshow.toString().replace(/\./g, '').replace(/\,/g, '');
            }
            se.discountpromo=json.data.discount;
            se.Pricepointshow = total -  se.discountpromo;
            if (se.Pricepointshow>0) {
              se.Pricepointshow = se.Pricepointshow.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
              se.ischeckbtnpromo = true;
              se.ischeckpromo=true;
            }
            else
            {
              se.Pricepointshow=0;
            }
            se.msg=json.msg;
            se.ischecktext=0;
            se.ischeckerror=0;
          }
          else if(json.error==1)
          {
            se.ischeckbtnpromo = false;
            se.msg=json.msg;
            se.discountpromo=0;
            se.ischecktext=1;
            se.ischeckerror=1;
          }
          else if(json.error==2)
          {
            se.ischeckbtnpromo = false;
            se.msg=json.msg;
            se.discountpromo=0;
            se.ischecktext=2;
            se.ischeckerror=1;
          }
        })
      });
    }
  }
  textchange() {
    this.ischeckbtnpromo = false;
    this.discountpromo=0;
    this.ischeckerror=0;
    this.msg="";
    this.ischecktext=3;
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
  click()
  {
    this.ischecktext=3
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
