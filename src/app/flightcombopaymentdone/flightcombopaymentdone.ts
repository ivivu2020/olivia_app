import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController,Platform } from '@ionic/angular';
import { Booking, ValueGlobal, RoomInfo, Bookcombo } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import * as request from 'requestretry';
import jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import {FlightDeparturePage } from '../flightdeparture/flightdeparture';
import { OverlayEventDetail } from '@ionic/core';
import { ActivatedRoute } from '@angular/router';
import { LaunchReview } from '@ionic-native/launch-review/ngx';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcombopaymentdone',
  templateUrl: 'flightcombopaymentdone.html',
  styleUrls: ['flightcombopaymentdone.scss'],
})
export class FlightComboPaymentDonePage implements OnInit{
    code;status;priceshow;checkreview
    constructor(public platform: Platform,public valueGlobal: ValueGlobal, public navCtrl: NavController, private Roomif: RoomInfo, public zone: NgZone, private launchReview: LaunchReview,
        public booking: Booking, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction,
        public bookCombo: Bookcombo, private activatedRoute: ActivatedRoute) {

          this.storage.get('checkreview').then(checkreview => {
            if (checkreview==0) {
              this.checkreview=0;
            }else
            {
              this.checkreview=checkreview;
            }
            //this.refreshToken();
          })
            this.priceshow = this.bookCombo.totalprice;
            this.GetUserInfo();
            this.gf.googleAnalytionCustom('ecommerce_purchase',{item_category:'flightcombopayment' , item_name: this.bookCombo.ComboTitle, item_id: this.bookCombo.HotelCode, start_date: this.booking.CheckInDate, end_date: this.booking.CheckOutDate,number_of_rooms: (this.booking.roomNb ?this.booking.roomNb : 1),value: Number(this.priceshow.toString().replace(/\./g, '').replace(/\,/g, '') ) ,currency: "VND"});
          
        }

        ngOnInit(){
            this.code = this.activatedRoute.snapshot.paramMap.get('code');
            this.status = this.activatedRoute.snapshot.paramMap.get('stt');
        }

        next(){
          if (this.checkreview==0) {
            this.showConfirm();
         }
          let infant=0;
            this.booking.ChildAge.forEach(element => {
              if(element == "<1" || Number(element) < 2){
                infant +=1;
              }
            });
            this.navCtrl.navigateBack('/');
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
                   
                    })
                  }
                })
              }
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