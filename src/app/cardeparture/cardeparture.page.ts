import { Bookcombo } from './../providers/book-service';
import { GlobalFunction } from './../providers/globalfunction';
import { OnInit, Component, NgZone } from '@angular/core';
import { ModalController,AlertController,LoadingController } from '@ionic/angular';
import { C } from './../providers/constants';
import * as request from 'requestretry';
@Component({
  selector: 'app-cardeparture',
  templateUrl: './cardeparture.page.html',
  styleUrls: ['./cardeparture.page.scss'],
})
export class CardeparturePage implements OnInit {
  isdepart = false; fromplace; daytitle: string; listcardisplay = []; listcar; departTicketSale; returnTicketSale; column: string;
  listcarname = []; titlepage; totalAdult;public loader: any; cars = [];diff_fee
  constructor(public modalCtrl: ModalController, private gf: GlobalFunction, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public bookCombo: Bookcombo, public zone: NgZone) {
    var params = this.gf.getParams('listcar');
    this.departTicketSale = this.bookCombo.ComboDetail.comboDetail.departTicketSale;
    this.returnTicketSale = this.bookCombo.ComboDetail.comboDetail.returnTicketSale;
    //console.log(params);
    if (params) {
      this.daytitle = params.title;
      if (params.isdepart) {
        this.titlepage = "Giờ xe chiều đi"
        this.isdepart = true;
        this.listcar = params.listdepart;
      } else {
        this.titlepage = "Giờ xe chiều về"
        this.isdepart = false;
        this.listcar = params.listreturn;
      }
      this.totalAdult = params.totalAdult;
      for (let i = 0; i < this.listcar.length; i++) {
        this.listcar[i].sortByTime = this.listcar[i].route.pickup_time
        this.listcar[i].cartime = this.listcar[i].route.pickup_time + ' → ' + this.listcar[i].route.arrival_time;
        this.listcar[i].companyname = this.listcar[i].company.name;
        this.listcar[i].id = this.listcar[i].company.id;
        this.listcar[i].priceorder = this.listcar[i].route.schedules[0].fare.price;
        this.listcar[i].trip_code = this.listcar[i].route.schedules[0].trip_code
        var price = this.listcar[i].route.schedules[0].fare.price - this.departTicketSale;
        if (price <= 0) {
          this.listcar[i].checkdiscountdepart = true;
          price = Math.abs(price);
        }
        else {
          this.listcar[i].checkdiscountdepart = false;
        }
        this.listcar[i].priceshow = price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.listcardisplay.push(this.listcar[i]);
      }

      for (let i = 0; i < this.listcardisplay.length; i++) {
        var ischeck = this.checkitem(this.listcardisplay[i].company.id);
        if (ischeck) {
          var item = { id: this.listcardisplay[i].company.id, name: this.listcardisplay[i].company.name }
          this.listcarname.push(item);
        }
      }
    }
  }

  ngOnInit() {
  }

  goback() {
    // if (this.cars.length>0) {
    //   this.presentLoading(0);
    //   //this.modalCtrl.dismiss({ isdepart: this.isdepart, cars: this.cars, diff_fee: this.diff_fee,loader: this.loader });
    // }
    // else{
    //   this.modalCtrl.dismiss();
    // }
    this.listcardisplay=[];
    this.modalCtrl.dismiss();
    // this.presentLoadinggoback();
  }
  // changeFlightInfo(obj) {
  //   var se = this;
  //   let cars = [];
  //   cars.push(obj);
  //   se.modalCtrl.dismiss({ isdepart: se.isdepart, cars: cars });
  // }
  changeCarInfo(obj) {
    console.log('test');
    this.cars=[];
    this.cars.push(obj);
    this.getavailableseats();
  }
  getavailableseats() {
    var se = this;
    this.presentLoading(1);
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
          trip_code: this.cars[0].route.schedules[0].trip_code,
          total_seats: this.totalAdult,
          total_price: this.cars[0].route.schedules[0].fare.price * se.totalAdult,
        },
      },
      json: true
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      se.zone.run(() => {
        if (body.status == -1 || body.status == 2||body.status == 4) {
          for (let i = 0; i < se.listcardisplay.length; i++) {
            if (se.cars[0].route.schedules[0].trip_code == se.listcardisplay[i].trip_code) {
              se.listcardisplay.splice(i, 1);
              se.cars=[];
              break;
            }
          }
          if (se.loader) {
            se.loader.dismiss();
          }
          alert("Không đủ số ghế trống, vui lòng chọn nhà xe khác");
        }
        // if (body.status == 4) {
        //   se.diff_fee = body.data[0].diff_fee;
        //   se.showConfirm('Không đảm bảo ghế ngồi thoải mái, quý khách có muốn đổi nhà xe khác?');
        // }
        if (body.status == 1 || body.status == 3) {
          se.diff_fee = body.data[0].diff_fee;
          se.modalCtrl.dismiss({ isdepart: se.isdepart, cars: se.cars,diff_fee:se.diff_fee,loader: se.loader });
        }
      })

    })
  }
  async presentLoading(value) {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
    if (value==0) {
      this.modalCtrl.dismiss({ isdepart: this.isdepart, cars: this.cars, diff_fee: this.diff_fee,loader: this.loader });
    }
  }
  async presentLoadinggoback() {
    this.cars=[];
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();

    
  }
  sortAirline(event) {
    this.sort(event.detail.value);
  }
  public async showConfirm(msg) {
       if (this.loader) {
        this.loader.dismiss()
        }
    let alert = await this.alertCtrl.create({
      message: msg,
      cssClass: "request-combo-css",
      buttons: [{
        text: 'Có',
        role: 'OK',
        handler: () => {

        }
      },
      {
        text: 'Không',
        handler: () => {
          this.presentLoading(0);
          //this.modalCtrl.dismiss({ isdepart: this.isdepart, cars: this.cars, diff_fee: this.diff_fee,loader: this.loader });
        }
      }
      ]
    });
    alert.present();
  }
  /**Hàm sort list khách sạn theo giá, điểm trung bình 
     * PDANH 23/01/2018
     */
  sort(property) {
    var se = this;
    se.column = property;


    //se.sort('priceorder',se.listDepart[0]);

    se.zone.run(() => se.listcardisplay.sort(function (a, b) {
      let direction = -1;
      if (property == "priceup") {
        // if(!a[property] || !b[property]){
        //   if(a[property] && !b[property]){
        //     return -1;
        //   }
        //   if(!a[property] && b[property]){
        //     return 1;
        //   }
        //   if(!a[property] && !b[property]){
        //     return -1;
        //   }
        // }else{
        // if (a[property] * 1 < b[property] * 1) {
        //   return 1 * direction;
        // }
        // else if (a[property] * 1 > b[property] * 1) {
        //   return -1 * direction;
        // }
        //}
        let col = 'priceorder';
        if (a[col] * 1 < b[col] * 1) {
          return 1 * direction;
        }
        else if (a[col] * 1 > b[col] * 1) {
          return -1 * direction;
        }
      } else {
        let direction = (property == "sortByTimeDepartEarly" || property == "sortByTimeLandingEarly") ? -1 : 1;
        let columnname = "sortByTime";
        if (a[columnname] < b[columnname]) {
          return 1 * direction;
        }
        else if (a[columnname] > b[columnname]) {
          return -1 * direction;
        }
      }
    }));
  };

  checkitem(id) {
    for (let i = 0; i < this.listcarname.length; i++) {
      if (this.listcarname[i].id == id) {
        return false;
      }
    }
    return true;
  }
  filterAirline(event) {
    var se = this;
    if (event.detail.value && event.detail.value.length > 0) {
      let arrCar = event.detail.value;
      let strCar = "";
      arrCar.forEach(element => {
        strCar += (strCar != "") ? ("," + element) : element;
      });
      se.listcardisplay = [];
      se.zone.run(() => {
        se.listcar.forEach(f => {
          if (strCar.indexOf(f.id) != -1) {
            se.listcardisplay.push(f);
          }
        });
      })
    } else {
      se.listcardisplay = [];
      se.zone.run(() => {
        se.listcar.forEach(f => {
          se.listcardisplay.push(f);
        });
      })
    }
    if (se.column) {
      this.sort(se.column);
    }
  }
  ionViewDidEnter() {
    // ion-select customizing
    const ionSelects: any = document.querySelectorAll('ion-select');
    let img = null;
    ionSelects.forEach((ionSelect) => {
      const selectIconInner = ionSelect.shadowRoot.querySelector('.select-icon');
      if (selectIconInner) {
        selectIconInner.setAttribute('style', 'display:none !important');
      }
      // if(selectIconInner){
      //   selectIconInner.attributes.removeNamedItem("class");
      //   img = document.createElement("img");
      //   img.src = "./new-arrow-down-image.svg";
      //   img.style.width = "12px";
      //   img.style.paddingTop = "3px";
      //   img.style.paddingLeft = "4px";
      //   img.style.color = "black";
      //   img.style.opacity = "0.5";
      //   selectIconInner.appendChild(img);
      // }
    });
  }
} 
