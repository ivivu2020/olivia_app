import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, Platform,AlertController } from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';
import * as request from 'request';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import jwt_decode from 'jwt-decode';
import { GlobalFunction } from '../providers/globalfunction';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
/**
 * Generated class for the RoompaymentdoneeanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roompaymentdoneean',
  templateUrl: 'roompaymentdoneean.html',
  styleUrls: ['roompaymentdoneean.scss'],
})
export class RoompaymentdoneeanPage implements OnInit {
  checkreview;
  ischeck: boolean; ishide; code; total; companyname; address; tax; addressorder; timeStamp; jti; cin; cout; ischeckshow; ischeckpayment
  constructor(public platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo, public activatedRoute: ActivatedRoute,
    public zone: NgZone, public booking: Booking, public authService: AuthService, public storage: Storage, public alertCtrl: AlertController, private launchReview: LaunchReview,
    public gf: GlobalFunction) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.Roomif.ischeckpoint = false;
    Roomif.priceshow = "";
    this.ishide = true;
    this.storage.get('checkreview').then(checkreview => {
      if (checkreview==0) {
        this.checkreview=0;
      }else
      {
        this.checkreview=checkreview;
      }
    })
    //this.gf.googleAnalytion('payment','ecommerce_purchase',this.booking.code+'|'+this.booking.CheckInDate+'|'+this.booking.CheckOutDate+'|'+this.booking.Adults+'|'+this.booking.Child+'|'+ this.booking.roomNb+ '|'+this.booking.cost);
    //this.gf.googleAnalytionCustom('ecommerce_purchase',{item_category:'roompayment-ean' , item_name: this.booking.HotelName, item_id: this.booking.code, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate,number_of_rooms: (this.booking.roomNb ?this.booking.roomNb : 1),value: this.booking.code+'|'+this.booking.CheckInDate+'|'+this.booking.CheckOutDate+'|'+this.booking.Adults+'|'+this.booking.Child+ '|'+this.booking.cost});
    var pricestring = this.Roomif.priceshowtt ? this.Roomif.priceshowtt : this.Roomif.pricepoint;
    this.GetUserInfo();
    this.gf.googleAnalytionCustom('ecommerce_purchase', { item_category: 'roompayment', item_name: this.booking.HotelName, item_id: this.booking.code, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate, number_of_rooms: (this.booking.roomNb ? this.booking.roomNb : 1), value: Number(pricestring.toString().replace(/\./g, '').replace(/\,/g, '')), currency: "VND" });
    // this.refreshToken();

  }
  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.ischeckshow = this.activatedRoute.snapshot.paramMap.get('ischeck');
    this.total = this.Roomif.priceshowtt;
  }
  next() {
    this.Roomif.priceshowtt = "";
    
    //google analytic
    //this.gf.googleAnalytion('payment','Purchases','hotelid:'+this.booking.code+'/cin:'+this.booking.CheckInDate+'/cout:'+this.booking.CheckOutDate+'/adults:'+this.booking.Adults+'/child:'+this.booking.Child+'/roomnumber:'+ this.booking.roomNb+ '/price:'+this.booking.cost);
    
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
              page: "roompaymentdoneean",
              func: "refreshToken",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentdoneean";
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
