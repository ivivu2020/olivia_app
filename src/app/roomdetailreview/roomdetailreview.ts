import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController } from '@ionic/angular';
import {Bookcombo, Booking, ValueGlobal, RoomInfo, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import * as request from 'requestretry';
import jwt_decode from 'jwt-decode';
import { OverlayEventDetail } from '@ionic/core';
import { AdddiscountPage } from './../adddiscount/adddiscount.page';
import * as $ from 'jquery';
/**
 * Generated class for the RoomdetailreviewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-roomdetailreview',
  templateUrl: 'roomdetailreview.html',
  styleUrls: ['roomdetailreview.scss'],
})
export class RoomdetailreviewPage implements OnInit {
  Avatar; Name; Address; cin; cout; dur; room; nameroom; jsonroom; arrchild; textage = ""; promocode; ischeckbtnpromo = false;
  roomnumber; adults; children; breakfast; PriceAvgPlusTAStr; ischeckpoint = false;ischeckpromo
  imgroom; roomtype; indexme; indexroom; cin1; cout1; point; price; ischeck = false; Pricepoint; Pricepointshow; roomcancel;ischeckpayment
  public intervalID;discountpromo;msg;ischecktext=3;ischeckerror=0;textpromotion="Nhập mã giảm giá";
  pointshow;titlecombo
  constructor(public searchhotel: SearchHotel, public platform: Platform, public valueGlobal: ValueGlobal, public navCtrl: NavController, private Roomif: RoomInfo, public zone: NgZone,
    public booking: Booking,public bookCombo: Bookcombo, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction,public loadingCtrl: LoadingController) {

    setTimeout(()=>{
      this.ischeckpayment=Roomif.ischeckpayment;
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
      this.value.flagreview = 1;
      this.titlecombo = this.bookCombo.ComboTitle;
      this.arrchild = this.searchhotel.arrchild;
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
      this.storage.get('point').then(point => {
        if (point) {
          //point=500;
          if (point > 0) {
            this.pointshow=point;
            //this.Roomif.point = point;
            this.point = point * 1000;
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepointshow = tempprice.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            let PricepointTemp = tempprice - this.point;
            // this.Pricepointshow = this.Pricepoint.toLocaleString();
             if (PricepointTemp <= 0) {
               this.ischeckpoint = true;
            //   this.Pricepointshow = 0;
             }
            
          }
        }
      });
    }, 350)  
    
    //google analytic
    //gf.googleAnalytion('roomdetailreview', 'add_to_cart', this.booking.code + '|' + this.booking.CheckInDate + '|' + this.booking.CheckOutDate + '|' + this.adults + '|' + this.children + '|' + this.roomnumber + '|' + this.PriceAvgPlusTAStr);
    
  }
  ngOnInit() {
  }
  roompaymentbreakdow() {
    // var value = { room: this.room, dur: this.dur, PriceAvgPlusTAStr: this.PriceAvgPlusTAStr, roomnumber: this.roomnumber, roomtype: this.roomtype, indexme: this.indexme, indexroom: this.indexroom };
    var dur = this.dur;
    var roomnumber = this.roomnumber;
    this.searchhotel.backPage = "roomdetailreview";
    this.navCtrl.navigateForward('/roompaymentbreakdown/' + dur + '/' + roomnumber);
  }
  async presentLoading() {
    let loader = await this.loadingCtrl.create({
      duration: 1500
    });
    loader.present();
  }
  next() {
    //this.presentLoading();
    this.Roomif.priceshow = "";
    this.Roomif.pricepoint = 0;
    this.Roomif.ischeckpoint = false;
    if (this.point > 0) {
      if (this.ischeck) {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.priceshow = this.Pricepointshow;
        if (this.ischeckpoint) {
          this.Roomif.pricepoint = this.roomtype.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
        } else {
          this.Roomif.pricepoint = this.point;
        }
      }
      else {
        this.Roomif.ischeckpoint = this.ischeck;
        this.Roomif.priceshow = this.PriceAvgPlusTAStr;
        this.Roomif.point = null;
      }
    }
    if (this.ischeckbtnpromo) {
      this.Roomif.promocode= this.promocode;
      this.Roomif.priceshow = this.Pricepointshow;
    }
    else
    {
      this.Roomif.promocode= "";
      this.promocode= "";
    }
    if (this.room[0].MealTypeRates[this.indexme].Supplier == 'Internal') {
      this.navCtrl.navigateForward('roomadddetails');
    } else {
      this.navCtrl.navigateForward('roomadddetails-ean');
    }
    this.gf.googleAnalytionCustom('add_to_cart',{item_category:'roomdetail' , item_name: this.booking.HotelName, item_id: this.booking.code, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate, value: Number(this.booking.cost.replace(/\./g, '').replace(/\,/g, '') ), currency: 'VND'});
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
                se.storage.set("point", data.point);
                se.storage.get('point').then(point => {
                  if (point) {
                    //point=500;
                    // if (point > 0) {
                    //   se.pointshow=point;
                    //   se.Roomif.point = point;
                    //   se.point = point * 1000;
                    //   se.price = se.point.toLocaleString();
                    //   var tempprice = se.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
                    //   se.Pricepoint = tempprice - se.point;
                    //   se.Pricepointshow = se.Pricepoint.toLocaleString();
                    //   if (se.Pricepoint <= 0) {
                    //     se.ischeckpoint = true;
                    //     se.Pricepointshow = 0;
                    //   }
                    // }
                      if (point > 0) {
                        se.pointshow=point;
                        se.price = se.point.toLocaleString();
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
  // ionViewWillLeave() {
  //   this.zone.run(() => {
  //     clearInterval(this.intervalID);
  //   })
  // }
  refreshToken() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/api/Account/reloadTokenClaims',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'cache-control': 'no-cache',
            'content-type': 'application/json-patch+json',
            authorization: text
          },
        }
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "userprofile",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (response.statusCode == 400 || response.statusCode == 401) {
            se.showConfirm();
          }
          if (error) {
            error.page = "userprofile";
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
              se.storage.get('point').then(point => {
                
                if (point) {
                  //point=500;
                  if (point > 0) {
                    se.pointshow=point;
                    se.Roomif.point = point;
                    se.point = point * 1000;
                    se.price = se.point.toLocaleString();
                    var tempprice = se.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
                    se.Pricepoint = tempprice - se.point;
                    //se.Pricepointshow = se.Pricepoint.toLocaleString();
                    if (se.Pricepoint <= 0) {
                      se.ischeckpoint = true;
                    }
                  }
                }
                se.GetUserInfo();
              });
            })
          }
        })
      }
    })
  }
  
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  public async showConfirm() {
    let alert = await this.alertCtrl.create({
      message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
      backdropDismiss:false,
      buttons: [
      {
        text: 'Để sau',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.navCtrl.navigateBack('/');
        }
      },
      {
        text: 'Đăng nhập',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          //this.valueGlobal.logingoback = "MainPage";
          this.navCtrl.navigateForward('/login');
        }
      },
      ]
    });
    alert.present();
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
            this.Pricepoint = tempprice - this.point-this.discountpromo;
            this.Pricepointshow = this.Pricepoint.toLocaleString();
          } else {
            this.price = this.point.toLocaleString();
            var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
            this.Pricepoint = tempprice - this.point;
            this.Pricepointshow = this.Pricepoint.toLocaleString();
          }
        
        }

      } else {
        if (this.ischeckpromo) {
          var tempprice = this.PriceAvgPlusTAStr.replace(/\./g, '').replace(/\,/g, '');
          this.Pricepointshow = tempprice -  this.discountpromo;
          this.Pricepointshow = this.Pricepointshow.toLocaleString();
          this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
        }
        else
        {
          this.PriceAvgPlusTAStr = this.roomtype.PriceAvgPlusTAStr;
        }
      }
    })
  }
  goback() {
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.booking.HotelId]);
    this.navCtrl.navigateBack('/hoteldetail/'+ this.booking.HotelId);
  }

  openRoomCancel() {
    this.gf.setParams(this.roomcancel, 'roomInfo');
    this.searchhotel.backPage = "roomdetailreview";
    this.navCtrl.navigateForward('/roomcancel');
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
              se.ischeckbtnpromo = true;
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
    this.ischecktext=3;
    this.msg="";
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
