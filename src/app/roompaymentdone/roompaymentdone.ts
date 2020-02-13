import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import {  NavController,Platform,AlertController } from '@ionic/angular';
import { Booking, RoomInfo, SearchHotel } from '../providers/book-service';
import * as request from 'request';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import jwt_decode from 'jwt-decode';
import { GlobalFunction } from '../providers/globalfunction';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
import * as moment from "moment";
import { InAppReview } from '@ionic-native/in-app-review/ngx';
/**
 * Generated class for the RoompaymentdonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roompaymentdone',
  templateUrl: 'roompaymentdone.html',
  styleUrls: ['roompaymentdone.scss'],
})
export class RoompaymentdonePage implements OnInit {
  ischeck: boolean; ishide; code; total; companyname; address; tax; addressorder; timeStamp; jti; cin; cout; priceshow; text; status; ischeckpayment
  checkreview;
  constructor(public platform: Platform, public Roomif: RoomInfo, public navCtrl: NavController, public zone: NgZone,
    public booking: Booking, public authService: AuthService, public activatedRoute: ActivatedRoute, public router: Router,
    public storage: Storage, public gf: GlobalFunction, public alertCtrl: AlertController, private launchReview: LaunchReview,
    private inAppReview: InAppReview) {
      this.storage.get('checkreview').then(checkreview => {
        if (checkreview==0) {
          this.checkreview=0;
        }else
        {
          this.checkreview=checkreview;
        }
      })
    // this.storage.get('jti').then(jti => {
    //   if (jti) {
    //     this.jti=jti;
    //     this.ishide = true;
    //     this.code = navParams.get('BookingCode');
    //     this.total = booking.cost;
    //     var chuoicin=this.booking.CheckInDate.split('-');
    //     this.cin= chuoicin[2]+"/"+chuoicin[1]+"/"+chuoicin[0];
    //     var chuoicout=this.booking.CheckOutDate.split('-');
    //     this.cout= chuoicout[2]+"/"+chuoicout[1]+"/"+chuoicout[0];
    //   }
    // })

    this.ischeckpayment = Roomif.ischeckpayment;
    this.Roomif.ischeckpoint = false;
    var ti = new Date();
    var ho = ti.getHours();
    var addhours = moment(ti).add(1, 'hours').format('HH:mm');
    this.text = addhours+' cùng ngày';
    if (this.Roomif.payment) {
      if(this.Roomif.payment=='AL' || this.Roomif.payment=='RQ')
      {
        if (ho > 0 && ho < 6) {
          this.text = '11 am cùng ngày';
        }
        else if (ho >= 6 && ho < 12) {
          this.text = '17h cùng ngày'
        }
        else if (ho >= 12 && ho < 20) {
          this.text = '20h30 cùng ngày'
        }
        else {
          this.text = '11 am hôm sau';
        }
      }
    }
    this.ishide = true;

    // this.total = booking.cost;
    if (Roomif.priceshow) {
      this.priceshow = Roomif.priceshow;
    }
    else {
      this.priceshow = booking.cost;
    }
    Roomif.priceshow = "";
    //google analytic
    var pricestring = this.Roomif.priceshow ? this.Roomif.priceshow : this.Roomif.pricepoint;
    this.GetUserInfo();
    this.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'roompayment', item_name: this.booking.HotelName, item_id: this.booking.code, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate, number_of_rooms: (this.booking.roomNb ? this.booking.roomNb : 1), value: Number(pricestring.toString().replace(/\./g, '').replace(/\,/g, '')), currency: "VND" });

   

  }
  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.status = this.activatedRoute.snapshot.paramMap.get('stt');
  }
  next() {
    //google analytic
    //this.gf.googleAnalytion('payment','Purchases','hotelid:'+this.booking.code+'|'+this.booking.CheckInDate+'|'+this.booking.CheckOutDate+'/adults:'+this.booking.Adults+'/child:'+this.booking.Child+'/roomnumber:'+ this.booking.roomNb+ '/price:'+this.booking.cost);
    // this.showConfirm();
    if (this.checkreview==0) {
       this.showConfirm();
    }
   this.navCtrl.navigateBack('/');
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
              page: "userprofile",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "userprofile";
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

            })
          }
        })
      }
    })
  }
  edit(co) {
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
  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên App Store',
      mode: "ios",
      cssClass: 'cls-reivewapp',
      buttons: [
        {
          text: 'Hủy',
          handler: () => {
          }
        },
        {
          text: 'Đánh giá',
          role: 'OK',
          handler: () => {
            this.launchReview.launch()
              .then(() => console.log('Successfully launched store app'));
          }
        }
      ]
    });
    alert.present();
    alert.onDidDismiss().then((data) => {
    })
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
                se.storage.set("email", data.email);
                se.storage.set("jti", data.memberId);
                //se.storage.set("auth_token", body.auth_token);
                se.storage.set("username", data.fullname);
                se.storage.set("phone", data.phone);
                se.storage.set("point", data.point);
            }

          }
        });
      }
    })
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
}
