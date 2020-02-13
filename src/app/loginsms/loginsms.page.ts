import { ValueGlobal } from './../providers/book-service';
import { json } from 'body-parser';
import { ToastController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
var request = require("request");
import { C } from '../providers/constants';
@Component({
  selector: 'app-loginsms',
  templateUrl: './loginsms.page.html',
  styleUrls: ['./loginsms.page.scss'],
})
export class LoginsmsPage implements OnInit {
  phone
  constructor(private toastCtrl: ToastController, public navCtrl: NavController, public valueGlobal: ValueGlobal) { }
  ngOnInit() {
  }
  goback() {
    this.navCtrl.back();
  }
  next() {
    if (this.phonenumber(this.phone)) {
      var se = this;
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile + '/api/account/OTPLoginSMS',
        headers:
        {
          'postman-token': '0b9f3a80-3e35-1af7-058f-597d733e7cee',
          'cache-control': 'no-cache',
          'content-type': 'application/json'
        },
        body: { PhoneNumber: this.phone },
        json: true
      };
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if (body.result) {
          se.valueGlobal.phone = se.phone
          se.navCtrl.navigateForward('loginsmsverify')
        }
        else {
          alert(body.msg);
        }
      });
    } else {
      this.presentToastPhone();
    }
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Số điện thoại không hợp lệ. Xin vui lòng nhập lại.",
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
}
