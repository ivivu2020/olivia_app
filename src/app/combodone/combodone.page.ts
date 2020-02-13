import { LaunchReview } from '@ionic-native/launch-review/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../providers/auth-service';
import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Booking, RoomInfo } from '../providers/book-service';
import * as request from 'request';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';

@Component({
  selector: 'app-combodone',
  templateUrl: './combodone.page.html',
  styleUrls: ['./combodone.page.scss'],
})
export class CombodonePage implements OnInit {
  code; priceshow; text; listcars; loccation; checkreview; status
  constructor(public platform: Platform, public Roomif: RoomInfo, public navCtrl: NavController, public zone: NgZone,
    public booking: Booking, public authService: AuthService, public activatedRoute: ActivatedRoute, public router: Router,
    public storage: Storage, public gf: GlobalFunction, public alertCtrl: AlertController, private launchReview: LaunchReview) {
    this.listcars = this.gf.getParams('carscombo');
    this.loccation = this.listcars.TransferBooking.toPlaceName;
    this.priceshow = this.listcars.HotelBooking.TotalPrices.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    var ti = new Date();
    var ho = ti.getHours();
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
    this.storage.get('checkreview').then(checkreview => {
      if (checkreview == 0) {
        this.checkreview = 0;
      } else {
        this.checkreview = checkreview;
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
          if (error) {
            error.page = "roomdetailreview";
            error.func = "GetUserInfo";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
          } else {
            if (body) {
              var data = JSON.parse(body);
              se.storage.set("email", data.email);
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
  ngOnInit() {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    this.status = this.Roomif.payment;
  }
  next() {
    var value = 1;
    this.gf.setParams(value, 'seemoreblog');
    if (this.checkreview == 0) {
      this.showConfirm();
    }
    this.gf.setParams(2, 'seemoreblog');
    this.navCtrl.navigateForward('/bloglist');
  }
  public async showConfirm() {
    this.storage.set("checkreview", 1);
    let alert = await this.alertCtrl.create({
      header: 'Bạn thích iVIVU.com?',
      message: 'Đánh giá ứng dụng trên App Store',
      mode: "ios",
      cssClass: 'done1-combo-css',
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
}
