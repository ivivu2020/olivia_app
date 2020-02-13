import { Component, NgZone } from '@angular/core';
import { NavController, Platform, ModalController, ToastController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { ComboPrice} from '../providers/comboPrice';
import { Bookcombo, SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import * as moment from 'moment';
import { ActivatedRoute } from '@angular/router';
import * as request from 'requestretry';

@Component({
  selector: 'app-departurecalendar',
  templateUrl: 'departurecalendar.html',
  styleUrls: ['departurecalendar.scss'],
})
export class DepartureCalendarPage {
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[] = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  public listPriceDate;
  public currentDay;
  public comboId;
  public region;
  public startdate;
  public enddate; arrBOD;ischeckBOD
  constructor(public platform: Platform, public navCtrl: NavController, public comboPrice: ComboPrice, public modalCtrl: ModalController,
    public bookCombo: Bookcombo, public searchhotel: SearchHotel, private activatedRoute: ActivatedRoute, public zone: NgZone,
    private gf: GlobalFunction, public toastCtrl: ToastController) {
    //Xử lý nút back của dt
    platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        // code that is executed when the user pressed the back button
        this.modalCtrl.dismiss('closeevent');
      })
    })
    var se = this;
    let params = se.gf.getParams('departure');
    se.comboId = params.comboId;
    se.region = params.fromPlace;
    se.startdate = params.comboStartDate;
    se.enddate = params.comboEndDate;
    this.ischeckBOD=this.searchhotel.ischeckBOD;
    if (se.comboId && se.region) {
      //var url = C.urls.baseUrl.urlMobile +"//get-min-price-calendar?comboId="+se.comboId+"&fromPlace="+ se.region;

      var options = {
        method: 'GET',
        url: C.urls.baseUrl.urlMobile + "//get-min-price-calendar?comboId=" + se.comboId + "&fromPlace=" + se.region,
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      }
      request(options, function (error, response, body) {
        if (response.statusCode != 200) {
          var objError = {
            page: "departurecalendar",
            func: "ngOnInit",
            message: response.statusMessage,
            content: response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
          C.writeErrorLog(objError,response);
        }
        if (error) {
          error.page = "departurecalendar";
          error.func = "ngOnInit";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        };

        var lstDate = JSON.parse(body);
        if (lstDate.length > 0) {
          se.listPriceDate = [];
          se.listPriceDate = lstDate;
          se.date = se.searchhotel.CheckInDate ? new Date(se.searchhotel.CheckInDate) : new Date();
          se.currentDay = se.date.getDate();
          se.zone.run(() => {
            se.getBOD();

          })

        }
      })

    }
    //google analytic
    gf.googleAnalytion('departurecalendar', 'load', '');
  }
  getBOD() {
    var se = this;
    var options = {
      method: 'GET',
      url: 'https://gate.ivivu.com/get-blackout-date',
      qs: { hotelId: this.searchhotel.hotelID, roomId: this.searchhotel.roomID },
      headers:
      {
        'postman-token': '86c67bdc-5fcd-0240-5549-f3ea2b31faf8',
        'cache-control': 'no-cache'
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      se.zone.run(() => {
        var BOD = JSON.parse(body);
        console.log(BOD);
        se.arrBOD = BOD.BlackOutDates;
        //  if (arrBOD.length>0) {
        //    for (let i = 0; i < se.listPriceDate.length; i++) {
        //      var date=moment(se.listPriceDate[i].comboDate).format('YYYY-MM-DD');
        //      se.listPriceDate[i].BOD=false;
        //      for (let j = 0; j < arrBOD.length; j++) {
        //        if (date==arrBOD[j]) {
        //          se.listPriceDate[i].BOD=true;
        //          break;
        //        }
        //      }
        //    }
        //  }
        // console.log(se.listPriceDate);
        se.getDaysOfMonth();

      })

    })
  }
  //ngOnInit(){
  // this.comboId =this.activatedRoute.snapshot.paramMap.get('comboId');
  // this.region =this.activatedRoute.snapshot.paramMap.get('region');
  // var se = this;
  //   let params = se.navParams.get('otherParameter');
  //   se.comboId = params.comboId;
  //   se.region = params.fromPlace;
  // if(se.comboId && se.region){
  //   var url = C.urls.baseUrl.urlMobile +"//get-min-price-calendar?comboId="+se.comboId+"&fromPlace="+ se.region;

  //   var options = { method: 'GET',
  //         url: C.urls.baseUrl.urlMobile +"//get-min-price-calendar?comboId="+se.comboId+"&fromPlace="+ se.region,
  //         timeout: 10000, maxAttempts: 5, retryDelay: 2000,
  //   }
  //         request(options, function (error, response, body) {
  //           if(response.statusCode != 200){
  //             var objError ={
  //                 page: "departurecalendar",
  //                 func: "ngOnInit",
  //                 message : response.statusMessage,
  //                 content : response.body,
  //                 type: "warning"
  //               };
  //             C.writeErrorLog(objError);
  //           }
  //           if (error) {
  //             error.page="departurecalendar";
  //             error.func="ngOnInit";
  //             C.writeErrorLog(error,response);
  //           };

  //           var lstDate = JSON.parse(body);
  //           if(lstDate.length >0){
  //             se.listPriceDate = [];
  //             se.listPriceDate = lstDate;
  //             se.date = new Date(se.searchhotel.CheckInDate) || new Date();
  //             se.currentDay = se.date.getDate();
  //             se.getDaysOfMonth();
  //           }
  //         })

  // }
  //}

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();
    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var curmonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getMonth();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      //var d = new Date(this.date.getFullYear(), (this.date.getMonth() === new Date().getMonth() ? curmonth : curmonth - 1), i);
      var d = new Date(this.date.getFullYear(), curmonth - 1, i);
      var obj = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d.toDateString());
      if (obj.length > 0) {
        obj.map((o: ComboPrice) => o.dateDisplay = d.getDate().toString());
        obj[0].addday=moment(d).format('YYYY-MM-DD');
        this.daysInLastMonth.push(obj[0]);
      } else {
        var newObj = {
          dateDisplay: i,
          day: moment(d).format('MM-DD-YYYY'),
          addday: moment(d).format('YYYY-MM-DD')
        }
        this.daysInLastMonth.push(newObj);
      }
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      var d1 = new Date(this.date.getFullYear(), curmonth, i + 1);
      var obj1 = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d1.toDateString());
      if (obj1.length > 0) {
        obj1.map((o: ComboPrice) => o.dateDisplay = d1.getDate().toString());
        obj1[0].addday=moment(d1).format('YYYY-MM-DD');
        this.daysInThisMonth.push(obj1[0]);
      }
      else {
        var newObj = {
          dateDisplay: i + 1,
          day: moment(d1).format('MM-DD-YYYY'),
          addday: moment(d1).format('YYYY-MM-DD')
        }
        this.daysInThisMonth.push(newObj);
      }
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
    for (var i = 0; i < (6 - lastDayThisMonth); i++) {
      var d2 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, i + 1);
      var obj1 = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d2.toDateString());
      if (obj1.length > 0) {
        obj1.map((o: ComboPrice) => o.dateDisplay = d2.getDate().toString());
        obj1[0].addday=moment(d2).format('YYYY-MM-DD');
        this.daysInNextMonth.push(obj1[0]);
      }
      else {
        var newObj = {
          dateDisplay: i + 1,
          day: moment(d2).format('MM-DD-YYYY'),
          addday: moment(d2).format('YYYY-MM-DD')
        }
        this.daysInNextMonth.push(newObj);
      }
      //this.daysInNextMonth.push(i+1);
    }
    var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        var d3 = new Date(this.date.getFullYear(), this.date.getMonth() + 1, i);
        var obj1 = this.listPriceDate.filter((cp: ComboPrice) => new Date(cp.day).toDateString() == d3.toDateString());
        if (obj1.length > 0) {
          obj1.map((o: ComboPrice) => o.dateDisplay = d3.getDate().toString());
          obj1[0].addday=moment(d3).format('YYYY-MM-DD');
          this.daysInNextMonth.push(obj1[0]);
        }
        else {
          var newObj = {
            dateDisplay: i,
            day: moment(d3).format('MM-DD-YYYY'),
            addday: moment(d3).format('YYYY-MM-DD')
          }
          this.daysInNextMonth.push(newObj);
        }
        //this.daysInNextMonth.push(i);
      }
    }
    if (this.daysInLastMonth[0].day=="07/30/2019") {
      this.daysInLastMonth=[];
      var newObj = {
        dateDisplay: 30,
        day: moment(d2).format('06-30-2019'),
        addday: moment(d2).format('2019-06-30')
      }
      this.daysInLastMonth.push(newObj);
    }
    if (this.arrBOD.length > 0) {
      if (this.daysInThisMonth.length > 0) {
        for (let i = 0; i < this.daysInThisMonth.length; i++) {
          var date = this.daysInThisMonth[i].addday
          this.daysInThisMonth[i].BOD = false;
          for (let j = 0; j < this.arrBOD.length; j++) {
            if (date == this.arrBOD[j]) {
              this.daysInThisMonth[i].BOD = true;
              break;
            }
          }
        }
      }
      if (this.daysInLastMonth.length > 0) {
        for (let i = 0; i < this.daysInLastMonth.length; i++) {
          var date = this.daysInLastMonth[i].addday
          this.daysInLastMonth[i].BOD = false;
          for (let j = 0; j < this.arrBOD.length; j++) {
            if (date == this.arrBOD[j]) {
              this.daysInLastMonth[i].BOD = true;
              break;
            }
          }
        }
      }
      if (this.daysInNextMonth.length > 0) {
        for (let i = 0; i < this.daysInNextMonth.length; i++) {
          var date = this.daysInNextMonth[i].addday
          this.daysInNextMonth[i].BOD = false;
          for (let j = 0; j < this.arrBOD.length; j++) {
            if (date == this.arrBOD[j]) {
              this.daysInNextMonth[i].BOD = true;
              break;
            }
          }
        }
      }
    }

  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }
  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

  changeDateCombo(dateObject) {
    //Thêm kiểm tra ngày chọn trên lịch không được nhỏ hơn ngày hiện tại
    if (dateObject.day && this.checkValidChoiceDate(dateObject.day)) {
      this.bookCombo.CheckInDate = dateObject.day;
      //fix lỗi đổi ngày checkin trên lịch khởi hành => đổi cả ngày checkout
      if (this.searchhotel.CheckInDate && this.searchhotel.CheckOutDate) {
        var numday = moment(this.searchhotel.CheckOutDate).diff(moment(this.searchhotel.CheckInDate), 'days');
        let arrdate = [];
        if(this.bookCombo.CheckInDate.indexOf('-') !=-1){
          arrdate = this.bookCombo.CheckInDate.split('-');
        }else if(this.bookCombo.CheckInDate.indexOf('/') !=-1){
          arrdate = this.bookCombo.CheckInDate.split('/');
        }
        
        let dcin = new Date( Number(arrdate[2]), Number(arrdate[0])-1, Number(arrdate[1]) );
        let dtemp = new Date( Number(arrdate[2]), Number(arrdate[0])-1, Number(arrdate[1]) );
        let res = dtemp.setTime(dtemp.getTime() + (numday * 24 * 60 * 60 * 1000));
        var dcout = new Date(res);
        this.bookCombo.CheckOutDate = moment(dcout).format('YYYY-MM-DD');
        this.searchhotel.CheckInDate = moment(dcin).format('YYYY-MM-DD');
        this.searchhotel.CheckOutDate = this.bookCombo.CheckOutDate;
      }
      this.searchhotel.ischeckBOD=false;
      if (this.arrBOD.length>0) {
        var checkcintemp = new Date(this.searchhotel.CheckInDate );
        var checkdatecout = new Date(this.searchhotel.CheckOutDate);
        var checkcin=moment(checkcintemp).format('YYYYMMDD');
        var checkcout=moment(checkdatecout).format('YYYYMMDD');
        for (let i = 0; i < this.arrBOD.length; i++) {
          var checkBODtemp = new Date(this.arrBOD[i]);
          var checkBOD=moment(checkBODtemp).format('YYYYMMDD');
          if (checkcin<=checkBOD&&checkBOD<checkcout) {
            this.searchhotel.ischeckBOD=true;
            break;
          }
        }
      }
      this.modalCtrl.dismiss();
    }
  }
  /**
   * Hàm kiểm tra ngày chọn trên lịch không được nhỏ hơn ngày hiện tại
   * @param selectedDate Ngày chọn trên lịch
   */
  checkValidChoiceDate(selectedDate) {
    let res = true;
    let today = new Date();
    let arr = this.startdate.split('-');
    let arr_ed = this.enddate.split('-');
    let sd = new Date(arr[2], arr[1] - 1, arr[0]);
    let ed = new Date(arr_ed[2], arr_ed[1] - 1, arr_ed[0]);
    if (moment(today).diff(selectedDate, 'days') > 0) {
      this.showToastr('Ngày khởi hành không được nhỏ hơn ngày hiện tại. Vui lòng chọn lại.');
      res = false;
      return false;
    }
    if (moment(selectedDate).diff(ed, 'days') > 0) {
      res = false;
      this.showToastr('Combo chỉ áp dụng trong khoảng ' + this.startdate + ' đến ' + this.enddate + '. Vui lòng chọn lại.');
      return false;
    }
    return res;
  }

  async showToastr(msg) {
    let toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    })
    toast.present();
  }
  close() {
    this.searchhotel.ischeckBOD=this.ischeckBOD;
    this.modalCtrl.dismiss('closeevent');
  }
}
