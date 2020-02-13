import { RoomInfo, Booking,Bookcombo } from '../providers/book-service';
import { Component, NgZone, OnInit } from '@angular/core';
import {  NavController, ToastController, LoadingController ,Platform} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import * as request from 'requestretry';
import { GlobalFunction } from '../providers/globalfunction';
import jwt_decode from 'jwt-decode';


/**
 * Generated class for the RoomadddetailsEanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roomadddetails-ean',
  templateUrl: 'roomadddetails-ean.html',
  styleUrls: ['roomadddetails-ean.scss'],
})
export class RoomadddetailsEanPage implements OnInit{
  hoten; phone = ""; note; arr = []; roomnumber; room; arr1 = []; BedType; priceshow; ischeckpoint; arrpush = [];
  ishide; companyname; address; tax; addressorder; bed; bedchuoi; arrbed = [];_email: any;
  validemail: boolean = true;
  auth_token: any;
; ischeck: boolean
  timestamp; paymentMethod; jsonroom; ischeckbtn; textbed; ischeckpayment;public loader:any
  constructor(public platform: Platform, public navCtrl: NavController, public Roomif: RoomInfo,
    private toastCtrl: ToastController, public booking: Booking,public bookcombo:Bookcombo, public zone: NgZone, public storage: Storage,
    public loadingCtrl: LoadingController, public gf: GlobalFunction) {
    this.ischeckpayment = Roomif.ischeckpayment;
    this.roomnumber = Roomif.roomnumber;
    this.note = Roomif.notetotal;
    this.room = this.Roomif.arrroom;
    this.jsonroom = Roomif.jsonroom;
    this.ischeckpoint = this.Roomif.ischeckpoint;
    this.storage.get('email').then(email => {
      if(email){
        this._email = email;
      }else{
        this.validemail = false;
      }
      
      })
    if (this.ischeckpoint == true) {
      if (this.Roomif.priceshow == "0") {
        this.priceshow = this.Roomif.priceshow;
      }
      else {
        this.priceshow = this.Roomif.priceshow.replace(/\./g, '').replace(/\,/g, '');
      }

    }
    else {
      this.ischeckbtn = true;
    }
    if (this.Roomif.arrrbed.length > 1) {
      // this.arrbed = this.Roomif.arrrbed;
      this.BedType = this.Roomif.arrrbed[0];
    }
    else if (this.Roomif.arrrbed.length == 1) {
      this.BedType = this.Roomif.arrrbed[0];
      this.textbed = this.Roomif.arrrbed[0];
      this.textbed = this.textbed.description;
    }

    if (Roomif.ischeck) {
      this.ischeck = Roomif.ischeck;
    }
    this.storage.get('infocus').then(infocus => {
      this.arrbed = [];
      this.bed = this.Roomif.arrrbed;
      if (this.roomnumber > 1) {
        var item1;
        if (infocus) {
          for (let i = 0; i < this.roomnumber; i++) {
            let number = i + 1;
            if (i == 0) {
              if (infocus.ho&&infocus.ten) {
                item1 = { text: "Khách nhận phòng " + number + "", hoten: infocus.ho + ' ' + infocus.ten, arrbed: this.arrbed, phone: infocus.phone }
              } else {
                if (infocus.ho) {
                  item1 = { text: "Khách nhận phòng " + number + "", hoten: infocus.ho, arrbed: this.arrbed, phone: infocus.phone }
                }
                else if (infocus.ten) {
                  item1 = { text: "Khách nhận phòng " + number + "", hoten: infocus.ten, arrbed: this.arrbed, phone: infocus.phone }
                }
                else{
                  item1 = { text: "Khách nhận phòng " + number + "", hoten: "", arrbed: this.arrbed, phone: infocus.phone ? infocus.phone : "" }
                }
              }
              
            }
            else {
              item1 = { text: "Khách nhận phòng " + number + "", hoten: "", arrbed: this.arrbed, phone: "" }
            }
            this.arr.push(item1);
            this.arrpush[i] = this.bed[0];
          }
        }
        else {
          for (let i = 0; i < this.roomnumber; i++) {
            let number = i + 1;
            item1 = { text: "Khách nhận phòng " + number + "", fristname: "", lastname: "", arrbed: this.arrbed, phone: "" }
            this.arr.push(item1);
            this.arrpush[i] = this.bed[0];
          }
        }
        if (this.bed) {
          if (this.bed.length > 1) {
            for (let i = 0; i < this.bed.length; i++) {
              var item;
              if (i == 0) {
                item = { text: this.bed[i], ischeck: true };
                this.bedchuoi = this.bed[i];
              }
              else {
                item = { text: this.bed[i], ischeck: false }
              }
              this.arrbed.push(item);
            }
          }
        }
      }
      else {
        if (infocus) {
          if (infocus.ho&&infocus.ten) {
            this.hoten = infocus.ho+' '+infocus.ten;
          } else {
            if (infocus.ho) {
              this.hoten=infocus.ho;
            }
            else if (infocus.ten) {
              this.hoten=infocus.ten;
            }
          }
          this.phone = infocus.phone;
        }
        this.room = this.Roomif.arrroom;
        if (this.Roomif.arrrbed.length > 1) {
          this.bed = this.Roomif.arrrbed
          for (let i = 0; i < this.bed.length; i++) {
            var item;
            if (i == 0) {
              item = { text: this.bed[i], ischeck: true };
              this.bedchuoi = this.bed[i];
            }
            else {
              item = { text: this.bed[i], ischeck: false }
            }
            this.arrbed.push(item);
          }
          this.arrpush[0] = this.bed[0];
        }
        else {
          this.bed = this.Roomif.arrrbed;
          if (this.bed) {
            if (this.bed.length > 1) {
              for (let i = 0; i < this.bed.length; i++) {
                var item;
                if (i == 0) {
                  item = { text: this.bed[i], ischeck: true };
                  this.bedchuoi = this.bed[i];
                }
                else {
                  item = { text: this.bed[i], ischeck: false }
                }
                this.arrbed.push(item);
              }
            }
            this.arrpush[0] = this.bed[0];
          }
        }
      }

    })
    this.storage.get('order').then(order => {
      if (order) {
        this.companyname = order.companyname;
        this.address = order.address;
        this.tax = order.tax;
        this.addressorder = order.addressorder;
        this.ishide = true;
        this.ischeck = true;
      } else {
        this.ishide = false;
        this.ischeck = false;
      }
    })

    //google analytic
    this.gf.googleAnalytion('roomadddetails-ean', 'add_payment_info', '');
  }
  ngOnInit() {
  }
  ionViewWillEnter(){
    this.storage.get('auth_token').then(auth_token => {
      this.auth_token = auth_token;
    })
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }
  next() {
    this.Roomif.notetotal = "";
    if (this.roomnumber == 1) {
      if (this.hoten) {
        this.hoten = this.hoten.trim();
        var checktext = this.hasWhiteSpace(this.hoten);
        if (!checktext) {
          this.presentToastName();
          return;
        }
      }
      else {
        this.presentToastName();
        return;
      }
      if (this.ischeck) {
        if (this.hoten) {
          this.hoten = this.hoten.trim();
          var checktext = this.hasWhiteSpace(this.hoten);
          if (!checktext) {
            this.presentToastName();
            return;
          } 
          if (this.phonenumber(this.phone)) {
            //validate mail
            if(!this.validateEmail(this._email) || !this._email){
              this.presentToastEmail();
              this.validemail = false;
              return;
            }
            if (this.companyname && this.address && this.tax && this.addressorder) {
              this.companyname = this.companyname.trim();
              this.address = this.address.trim();
              this.tax = this.tax.trim();
              this.addressorder = this.addressorder.trim();
            }
            else {
              this.presentToastOrder();
              return;
            }
            if (this.companyname && this.address && this.tax && this.addressorder) {
              this.Roomif.hoten = this.hoten;
              // this.Roomif.ten = this.ten;
              this.Roomif.notetotal = this.note;
              this.Roomif.phone = this.phone;
              // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
              // this.storage.set("infocus", info);
              var texthoten = this.hoten.split(' ');
              var item1;
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten;
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName:texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              } else if (this.hoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              else if (this.hoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              this.arr1 = [];
              this.arr1.push(item1);
              this.Roomif.arrcustomer = this.arr1;
              this.Roomif.companyname = this.companyname;
              this.Roomif.address = this.address;
              this.Roomif.tax = this.tax;
              this.Roomif.notetotal = this.note;
              this.Roomif.addressorder = this.addressorder;
              var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder }
              this.storage.set("order", order1);
              this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder;
              if (this.Roomif.payment == 'true') {
                this.paymentnotAL();
              } else {
                this.navCtrl.navigateForward("roompaymentselect-ean");
              }

            }
            else {
              this.presentToastOrder();
            }
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }

      } else {
        if (this.hoten) {
          this.hoten = this.hoten.trim();
          var checktext = this.hasWhiteSpace(this.hoten);
          if (!checktext) {
          this.presentToastName();
          return;
        }
          if (this.phonenumber(this.phone)) {
            //validate mail
            if(!this.validateEmail(this._email) || !this._email){
              this.presentToastEmail();
              this.validemail = false;
              return;
            }
            this.booking.CEmail = this._email;
            this.Roomif.hoten = this.hoten;
            this.Roomif.phone = this.phone;
            this.Roomif.notetotal = this.note;
            // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
            // this.storage.set("infocus", info);
            var texthoten = this.hoten.split(' ');
            if (texthoten.length > 2) {
              let name = '';
              for (let j = 1; j < texthoten.length; j++) {
                if (j == 1) {
                  name += texthoten[j];
                } else {
                  name += ' ' + texthoten[j];
                }
              }
              item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            } else if (texthoten.length > 1) {
              item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }
            else if (texthoten.length == 1) {
              item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }

            this.arr1 = [];
            this.arr1.push(item1);
            this.Roomif.arrcustomer = this.arr1;
            if (this.Roomif.payment == 'true') {
              this.paymentnotAL();
            } else {
              this.navCtrl.navigateForward("roompaymentselect-ean");
            }
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }
      }

    }
    else {
      if (this.ischeck) {
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
          this.addressorder = this.addressorder.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this.addressorder;
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder }
          this.storage.set("order", order1);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
          this.pushdata1();
        }
        else {
          this.presentToastOrder();
        }
      }
      else {
        this.pushdata1();
      }
    }
  }
  pushdata1() {
    var item1;
    var co = 0;
    for (let i = 0; i < this.arr.length; i++) {
      this.arr[i].hoten = this.arr[i].hoten.trim();
      if (i == 0) {
        if (this.arr[i].hoten) {
          var checktext = this.hasWhiteSpace(this.arr[i].hoten);
          if (!checktext) {
            co = 1;
            break;
          }
        }
        else
        {
          co = 1;
          break;
        }
        if (!this.arr[i].phone) {
          co = 2;
          break;
        }
      }
      else {
        if (this.arr[i].hoten) {
          var checktext = this.hasWhiteSpace(this.arr[i].hoten);
          if (!checktext) {
            co = 1;
            break;
          }
        }
        else
        {
          co = 1;
          break;
        }
      }
    }
    if (co == 0) {
      this.arr1 = [];
      //console.log(this.arr);
      if (this.arrbed.length > 1) {
        for (let i = 0; i < this.arr.length; i++) {
          var texthoten = this.arr[i].hoten.split(' ');
          if (texthoten.length > 2) {
            let name = '';
            for (let j = 1; j < texthoten.length; j++) {
              if (j == 1) {
                name += texthoten[j];
              } else {
                name += ' ' + texthoten[j];
              }
            }
            item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
          } else if (texthoten.length > 1) {
            item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
          }
          else if (texthoten.length == 1) {
            item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
          }
          this.arr1.push(item1);
        }
      }
      else {
        for (let i = 0; i < this.arr.length; i++) {
          var texthoten = this.arr[i].hoten.split(' ');
          if (texthoten.length > 2) {
            let name = '';
            for (let j = 1; j < texthoten.length; j++) {
              if (j == 1) {
                name += texthoten[j];
              } else {
                name += ' ' + texthoten[j];
              }
            }
            item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          } else if (texthoten.length > 1) {
            item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          }
          else if (texthoten.length == 1) {
            item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          }
          this.arr1.push(item1);
          // item1 = { Title: "MR", FirstName: this.arr[i].fristname, LastName: this.arr[i].lastname, Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
          // this.arr1.push(item1);
        }

      }

      this.Roomif.hoten = this.arr1[0].LastName + ' ' + this.arr1[0].FirstName;
      this.Roomif.phone = this.arr1[0].Phone;
      // var info = { ho: this.arr1[0].LastName, ten: this.arr1[0].FirstName, phone: this.arr1[0].Phone }
      // this.storage.set("infocus", info);
      this.Roomif.arrcustomer = this.arr1;
      this.Roomif.notetotal = this.note;
      if (this.Roomif.payment == 'true') {
        this.paymentnotAL();
      } else {
        this.navCtrl.navigateForward("roompaymentselect-ean");
      }
    } else {
      if (co==1) {
        this.presentToastName();
      } else if (co==2) {
        this.presentToastPhone();
      }
    }
  }
  next1() {
    this.Roomif.notetotal = "";
    if (this.roomnumber == 1) {
      if (this.hoten) {
        this.hoten = this.hoten.trim();
        var checktext = this.hasWhiteSpace(this.hoten);
        if (!checktext) {
          this.presentToastName();
          return;
        }
      }
      else {
        this.presentToastName();
        return;
      }
      if (this.ischeck) {
        if (this.hoten) {
          if (this.phonenumber(this.phone)) {
            if (this.companyname && this.address && this.tax && this.addressorder) {
              this.companyname = this.companyname.trim();
              this.address = this.address.trim();
              this.tax = this.tax.trim();
              this.addressorder = this.addressorder.trim();
            }
            else {
              this.presentToastOrder();
              return;
            }
            if (this.companyname && this.address && this.tax && this.addressorder) {
              this.Roomif.hoten = this.hoten;
              // this.Roomif.ten = this.ten;
              this.Roomif.phone = this.phone;
              // var info = { ho:  this.ho, ten:  this.ten, phone:  this.phone }
              // this.storage.set("infocus", info);
              var texthoten = this.hoten.split(' ');
              var item1;
              if (this.hoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              } else if (texthoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              else if (texthoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              this.arr1 = [];
              this.arr1.push(item1);
              this.Roomif.arrcustomer = this.arr1;
              this.Roomif.companyname = this.companyname;
              this.Roomif.address = this.address;
              this.Roomif.tax = this.tax;
              this.Roomif.notetotal = this.note;
              this.Roomif.addressorder = this.addressorder;
              var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder }
              this.storage.set("order", order1);
              this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder
              this.pushdata();
            }
            else {
              this.presentToastOrder();
            }
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }

      } else {
        if (this.hoten) {
          if (this.phonenumber(this.phone)) {
            this.Roomif.hoten = this.hoten;
            this.Roomif.phone = this.phone;
            // var info = { ho: this.ho, ten: this.ten, phone: this.phone }
            // this.storage.set("infocus", info);
            var texthoten = this.hoten.split(' ');
            var item1;
            if (this.hoten.length > 2) {
              let name = '';
              for (let j = 1; j < texthoten.length; j++) {
                if (j == 1) {
                  name += texthoten[j];
                } else {
                  name += ' ' + texthoten[j];
                }
              }
              item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            } else if (texthoten.length > 1) {
              item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }
            else if (texthoten.length == 1) {
              item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.phone, Email: this.booking.CEmail, BedType: this.BedType }
            }
            this.arr1 = [];
            this.arr1.push(item1);
            this.Roomif.arrcustomer = this.arr1;
            this.pushdata();
          }
          else {
            this.presentToastPhone();
          }
        }
        else {
          this.presentToastName();
        }
      }

    }
    else {
      if (this.ischeck) {
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.companyname = this.companyname.trim();
          this.address = this.address.trim();
          this.tax = this.tax.trim();
          this.addressorder = this.addressorder.trim();
        }
        else {
          this.presentToastOrder();
          return;
        }
        if (this.companyname && this.address && this.tax && this.addressorder) {
          this.Roomif.companyname = this.companyname;
          this.Roomif.address = this.address;
          this.Roomif.tax = this.tax;
          this.Roomif.notetotal = this.note;
          this.Roomif.addressorder = this.addressorder;
          var order1 = { companyname: this.companyname, address: this.address, tax: this.tax, addressorder: this.addressorder }
          this.storage.set("order", order1);
          this.Roomif.order = this.companyname + "," + this.address + "," + this.tax + "," + this.addressorder;

          var co = 0;
          for (let i = 0; i < this.arr.length; i++) {
            this.arr[i].hoten = this.arr[i].hoten.trim();
            if (i == 0) {
              if (this.arr[i].hoten) {
                var checktext = this.hasWhiteSpace(this.arr[i].hoten);
                if (!checktext) {
                  co = 1;
                  break;
                }
              }
              else
              {
                co = 1;
                break;
              }
              if (!this.arr[i].phone) {
                co = 2;
                break;
              }
            }
            else {
              if (!this.arr[i].hoten) {
                var checktext = this.hasWhiteSpace(this.arr[i].hoten);
                if (!checktext) {
                  co = 1;
                  break;
                }
              }
            }
          }
          if (co == 0) {
            this.arr1 = [];
            //console.log(this.arr);
            if (this.arrbed.length > 1) {
              for (let i = 0; i < this.arr.length; i++) {
                var texthoten = this.arr[i].hoten.split(' ');
                if (texthoten.length > 2) {
                  let name = '';
                  for (let j = 1; j < texthoten.length; j++) {
                    if (j == 1) {
                      name += texthoten[j];
                    } else {
                      name += ' ' + texthoten[j];
                    }
                  }
                  item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
                } else if (texthoten.length > 1) {
                  item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
                }
                else if (texthoten.length == 1) {
                  item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
                }
                this.arr1.push(item1);
              }
            }
            else {
              for (let i = 0; i < this.arr.length; i++) {
                var texthoten = this.arr[i].hoten.split(' ');
                if (texthoten > 2) {
                  let name = '';
                  for (let j = 1; j < texthoten.length; j++) {
                    if (j == 1) {
                      name += texthoten[j];
                    } else {
                      name += ' ' + texthoten[j];
                    }
                  }
                  item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                } else if (texthoten.length > 1) {
                  item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                }
                else if (texthoten.length == 1) {
                  item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                }
                this.arr1.push(item1);
                // item1 = { Title: "MR", FirstName: this.arr[i].fristname, LastName: this.arr[i].lastname, Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
                // this.arr1.push(item1);
              }

            }

            this.Roomif.hoten = this.arr1[0].LastName + ' ' + this.arr1[0].FirstName;
            this.Roomif.phone = this.arr1[0].Phone;
            // info = { ho: this.arr1[0].LastName, ten: this.arr1[0].FirstName, phone: this.arr1[0].Phone }
            // this.storage.set("infocus", info);
            this.Roomif.arrcustomer = this.arr1;
            this.Roomif.notetotal = this.note;
            this.pushdata();
          } else {
            if (co==1) {
              this.presentToastName();
            }
            else if(co==2)
            {
              this.presentToastPhone();
            }
          }
        }
        else {
          this.presentToastOrder();
        }
      }
      else {
        var co = 0;
        for (let i = 0; i < this.arr.length; i++) {
          this.arr[i].hoten = this.arr[i].hoten.trim();
          if (i == 0) {
            if (this.arr[i].hoten) {
              var checktext = this.hasWhiteSpace(this.arr[i].hoten);
              if (!checktext) {
                co = 1;
                break;
              }
            }
            else{
              co = 1;
              break;
            }
            if (!this.arr[i].phone) {
              co = 2;
              break;
            }
          }
          else {
            if (this.arr[i].hoten) {
              var checktext = this.hasWhiteSpace(this.arr[i].hoten);
              if (!checktext) {
                co = 1;
                break;
              }
            }
            else
            {
              co = 1;
              break;
            }
          }
        }
        if (co == 0) {
          this.arr1 = [];
          //console.log(this.arr);
          if (this.arrbed.length > 1) {
            for (let i = 0; i < this.arr.length; i++) {
              var texthoten = this.arr[i].hoten.split(' ');
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
              } else if (texthoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
              }
              else if (texthoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.arrpush[i] }
              }
              this.arr1.push(item1);
            }
          }
          else {
            for (let i = 0; i < this.arr.length; i++) {
              var texthoten = this.arr[i].hoten.split(' ');
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                item1 = { Title: "MR", FirstName: name, LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              } else if (texthoten.length > 1) {
                item1 = { Title: "MR", FirstName: texthoten[1], LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              else if (texthoten.length == 1) {
                item1 = { Title: "MR", FirstName: "", LastName: texthoten[0], Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              }
              this.arr1.push(item1);
              // item1 = { Title: "MR", FirstName: this.arr[i].fristname, LastName: this.arr[i].lastname, Phone: this.arr[0].phone, Email: this.booking.CEmail, BedType: this.BedType }
              // this.arr1.push(item1);
            }

          }

          this.Roomif.hoten = this.arr1[0].LastName + ' ' + this.arr1[0].FirstName;
          this.Roomif.phone = this.arr1[0].Phone;
          // info = { ho: this.arr1[0].LastName, ten: this.arr1[0].FirstName, phone: this.arr1[0].Phone }
          // this.storage.set("infocus", info);
          this.Roomif.arrcustomer = this.arr1;
          this.Roomif.notetotal = this.note;
          this.pushdata();
        } else {
          this.presentToastName();
        }
      }
    }
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập họ tên",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastOrder() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập thông tin xuất hóa đơn",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastName() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập đầy đủ họ tên",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập số điện thoại",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  pushdata() {
    this.presentLoading();
    var se = this;
    // var arrMealTypeRates = [];
    // var room1 = [];
    // arrMealTypeRates.push(this.room[0].MealTypeRates[this.booking.indexmealtype]);
    // var itemroom1 = {
    //   Penalty_Type: this.room[0].Rooms[0].Penalty_Type, RoomID: this.room[0].Rooms[0].RoomID, RoomPriceBreak: this.room[0].Rooms[0].RoomPriceBreak,
    //   SupplierRef: this.room[0].Rooms[0].SupplierRef, SalesTax: this.room[0].Rooms[0].SalesTax
    // }
    // room1.push(itemroom1);
    // this.jsonroom.RoomClasses = this.room;
    // this.jsonroom.RoomClasses[0].MealTypeRates = arrMealTypeRates;
    // this.jsonroom.RoomClasses[0].Rooms = room1;
    // this.jsonroom.RoomClassesHidden = [];
    // this.booking.Hotels = this.jsonroom
    this.jsonroom.RoomClasses = this.room;
    this.timestamp = Date.now();
    //this.storage.get('auth_token').then(auth_token => {
      if (se.booking.CEmail) {
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
        }
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlPost + '/mInsertBooking',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'content-type': 'application/json'
          },
          body:
          {
            RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
            CName: se.Roomif.hoten.trim(),
            CEmail: se.booking.CEmail,
            CPhone: se.Roomif.phone,
            timestamp: se.timestamp,
            HotelID: se.booking.HotelId,
            paymentMethod: "51",
            note: se.Roomif.notetotal,
            source: '6',
            MemberToken: se.auth_token,
            CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
            UsePointPrice: se.Roomif.pricepoint,
            NoteCorp: se.Roomif.order,
            Invoice: Invoice,
            UserPoints: se.Roomif.point,
            CheckInDate: se.jsonroom.CheckInDate,
            CheckOutDate: se.jsonroom.CheckOutDate,
            TotalNight: se.jsonroom.TotalNight,
            MealTypeIndex: se.booking.indexmealtype,
            CompanyName: se.Roomif.companyname,
            CompanyAddress: se.Roomif.address,
            CompanyTaxCode: se.Roomif.tax,
            BillingAddress: se.Roomif.addressorder,
            promotionCode:se.Roomif.promocode,
            comboid:se.bookcombo.ComboId
          },
          json: true
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roomadddetails",
              func: "next",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roomadddetails";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          if (body) {
            if (body.error == 0) {
              //console.log(body.code);
              // var value = { BookingCode: body.code, total: se.Roomif.pricepoint,ischeck:'1' };
              // //se.closeLoading();
              // se.clearClonePage('page-roompaymentdoneean');
              // se.navCtrl.navigateForward('RoompaymentdoneeanPage');
              var id = body.code;
              var total = se.Roomif.pricepoint;
              var ischeck = '1'
              se.clearClonePage('page-roompaymentdoneean');
              se.loader.dismiss();
              se.navCtrl.navigateForward('/roompaymentdoneean/' + id + '/' + total + '/' + ischeck);
            }
            else {
              se.loader.dismiss();
              alert(body.Msg);
            }
          }
          else{
            error.page = "roomadddetails-ean";
            error.func = "pushdata";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
            se.loader.dismiss();
            alert("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
          
        });

      }
    //})
  }
  async presentToasterror() {
    let toast = await this.toastCtrl.create({
      message: "Số điểm không đủ để tạo booking",
      duration: 3000,
      position: 'top'
    });
    toast.present();
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
  // async presentToastPhone() {
  //   let toast = await this.toastCtrl.create({
  //     message: "Xin vui lòng nhập số điện thoại",
  //     duration: 3000,
  //     position: 'top'
  //   });

  //   toast.present();
  // }
  // async presentToastName() {
  //   let toast = await this.toastCtrl.create({
  //     message: "Xin vui lòng nhập đầy đủ thông tin",
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }
  itemrd(item, itemindex) {
    if (this.arr.length == 0) {
      this.BedType = item;
    } else {
      this.zone.run(() => {
        this.arrpush[itemindex] = item;
        // if (this.arrpush) {
        //   for (let i = 0; i < this.arrpush.length; i++) {


        //   }
        // }
        // for (let i = 0; i < this.arr[itemindex].arrbed.length; i++) {
        //   if (this.arr[itemindex].arrbed[i].text.description == event.detail.value) {
        //     this.arr[itemindex].arrbed[i] =  event.detail;
        //   }
        //   else {
        //     this.arr[itemindex].arrbed[i].ischeck = false;
        //   }
        // }

      })
    }

  }
  edit(co) {
    this.zone.run(() => {
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
    })

  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }
  // closeLoading() { this.loader.dismiss(); }
  // async presentToast() {
  //   let toast =await this.toastCtrl.create({
  //     message: "Xin vui lòng nhập họ tên",
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }
  // async presentToastOrder() {
  //   let toast =await this.toastCtrl.create({
  //     message: "Xin vui lòng nhập thông tin xuất hóa đơn",
  //     duration: 3000,
  //     position: 'top'
  //   });
  //   toast.present();
  // }
  phonenumber(inputtxt) {
    if(inputtxt){
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
    }else{
      return false;
    }
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
              type: "warning"
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roompaymentdoneean";
            error.func = "refreshToken";
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
  goback() {
    this.navCtrl.navigateBack('roomdetailreview');
  }
  paymentnotAL() {
    this.presentLoading();
    var se = this;
    // var arrMealTypeRates = [];
    // var room1 = [];
    // arrMealTypeRates.push(this.room[0].MealTypeRates[this.booking.indexmealtype]);
    // var itemroom1 = {
    //   Penalty_Type: this.room[0].Rooms[0].Penalty_Type, RoomID: this.room[0].Rooms[0].RoomID, RoomPriceBreak: this.room[0].Rooms[0].RoomPriceBreak,
    //   SupplierRef: this.room[0].Rooms[0].SupplierRef, SalesTax: this.room[0].Rooms[0].SalesTax
    // }
    // room1.push(itemroom1);
    // this.jsonroom.RoomClasses = this.room;
    // this.jsonroom.RoomClasses[0].MealTypeRates = arrMealTypeRates;
    // this.jsonroom.RoomClasses[0].Rooms = room1;
    // this.jsonroom.RoomClassesHidden = [];
    // this.booking.Hotels = this.jsonroom
    se.jsonroom.RoomClasses = se.room;
    se.timestamp = Date.now();
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var Invoice = 0;
        if (se.Roomif.order) {
          Invoice = 1;
        }
        var options = {
          method: 'POST',
          url: C.urls.baseUrl.urlPost + '/mInsertBooking',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            'content-type': 'application/json'
          },
          body:
          {
            RoomClassObj: se.jsonroom.RoomClasses[0].ListObjRoomClass,
            CName: se.Roomif.hoten.trim(),
            CEmail: se.booking.CEmail,
            CPhone: se.Roomif.phone,
            timestamp: se.timestamp,
            HotelID: se.booking.HotelId,
            paymentMethod: "51",
            note: se.Roomif.notetotal,
            source: '6',
            MemberToken: auth_token,
            CustomersStr: JSON.stringify(se.Roomif.arrcustomer),
            UsePointPrice: se.Roomif.pricepoint,
            NoteCorp: se.Roomif.order,
            Invoice: Invoice,
            UserPoints: se.Roomif.point,
            CheckInDate: se.jsonroom.CheckInDate,
            CheckOutDate: se.jsonroom.CheckOutDate,
            TotalNight: se.jsonroom.TotalNight,
            MealTypeIndex: se.booking.indexmealtype,
            CompanyName: se.Roomif.companyname,
            CompanyAddress: se.Roomif.address,
            CompanyTaxCode: se.Roomif.tax,
            BillingAddress: se.Roomif.addressorder,
            promotionCode:se.Roomif.promocode,
            comboid:se.bookcombo.ComboId
          },
          json: true
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "roomadddetails",
              func: "next",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "roomadddetails";
            error.func = "next";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          if (body) {
            if (body.error == 0) {
              // console.log(body.code);
              var code = body.code;
              var stt = body.bookingStatus;
              se.navCtrl.navigateForward('/roompaymentdone/' + code + '/' + stt);
              se.loader.dismiss();
              //se.gf.googleAnalytion('paymentdirect', 'Purchases', 'hotelid:' + se.booking.cost + '/cin:' + se.jsonroom.CheckInDate + '/cout:' + se.jsonroom.CheckOutDate + '/adults:' + se.booking.Adults + '/child:' + se.booking.Child + '/price:' + se.booking.cost)
            }
            else {
              se.loader.dismiss();
              alert(body.Msg);
              //se.refreshToken();
              // se.navCtrl.popToRoot();
              // se.app.getRootNav().getActiveChildNav().select(0);
            }
          }else
          {
            error.page = "roomadddetails-ean";
            error.func = "paymentnotAL";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
            se.loader.dismiss();
            alert("Đã có sự cố xảy ra, vui lòng thử lại!");
          }
          
        });

      }
    })

  }

  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async presentToastEmail() {
    let toast = await this.toastCtrl.create({
      message: "Thông tin email không hợp lệ. Vui lòng nhập lại.",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
}
