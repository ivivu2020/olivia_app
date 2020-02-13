import { audit } from 'rxjs/operators';
import { json } from 'body-parser';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform} from '@ionic/angular';
import * as request from 'requestretry';
import { AuthService } from '../providers/auth-service';
import * as moment from 'moment';
import { SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { NetworkProvider } from '../network-provider.service';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard/ngx';
/**
 * Generated class for the SearchhotelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-searchhotel',
  templateUrl: 'searchhotel.html',
  styleUrls: ['searchhotel.scss'],
})
export class SearchHotelPage implements OnInit{
  ngOnInit() {
  }
  @ViewChild('input') myInput ;
  json; input; child1 = 0; child = 0;
  fieldName1: any;
  adults1 = 2; adults = 2;
  arrchild1 = [];
  arrchild = [];
  showpopup = false;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  public room1 = 1; public room = 1; gbitem; gbmsg;
  items = []; ischecklist = false; isenabled = true;
  co = 0; recent; index
  setInter;ischecktext=false;isConnected;
  constructor(public platform: Platform,public navCtrl: NavController, public authService: AuthService, public zone: NgZone, public searchHotel: SearchHotel,
    public gf: GlobalFunction,private networkProvider: NetworkProvider,public storage: Storage, public keyboard: Keyboard) {
    this.recent = this.searchHotel.recent;
    //this.getdata();
    this.isConnected = this.networkProvider.isOnline();
      if (this.isConnected) {
        setTimeout(()=>{
          this.storage.get('listregion').then((data:any)=>{
            if(data){
              this.json = data;
            }else{
              this.getdata();
            }
          })
        },100)
      }else{
        this.gf.showWarning('Không có kết nối mạng','Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng','Đóng');
      }
    //clear local
    this.searchHotel.local0check = false;
    this.searchHotel.local1check = false;
    this.searchHotel.local2check = false;
    this.searchHotel.local3check = false;
    this.searchHotel.local4check = false;
    this.searchHotel.local5check = false;
    this.searchHotel.local6check = false;
    this.searchHotel.local7check = false;
    this.searchHotel.local8check = false;
    this.searchHotel.local9check = false;
    this.searchHotel.local10check = false;
    this.searchHotel.local11check = false;
    this.searchHotel.local12check = false;
    this.searchHotel.local13check = false;
    this.searchHotel.local14check = false;
    this.searchHotel.local15check = false;
    this.searchHotel.local16check = false;
    this.searchHotel.local17check = false;
    this.searchHotel.local18check = false;
    this.searchHotel.local19check = false;
    this.searchHotel.location = "";
    //google analytic
    this.gf.googleAnalytion('search-hotel','load','');
    //Xử lý nút back của dt
    this.platform.ready().then(() => {
      document.addEventListener("backbutton", async() => { 
        this.navCtrl.navigateBack('/app/tabs/tab1');
      })
    })
  }

  change() {
    // this.ischeck = true;
    this.showpopup = false;
    this.recent = this.searchHotel.recent;
  }
  getdata() {
    var se = this;
    var options = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile+ '/mobile/OliviaApis/Regions',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
    };
    request(options, function (error, response, body) {
      if (error) {
        error.page="searchhotel";
        error.func="getdata";
        error.param =  JSON.stringify(options);
        C.writeErrorLog(error,response);
        throw new Error(error)
      };
      se.json = JSON.parse(body);
      se.storage.set('listregion',se.json);
      //se.test();

    });
  }
  test()
  {
    this.setInter = setInterval(function () {
      document.getElementById("mytext").focus();
    },1500)

  }
  nextPopular(msg, i) {
    // this.gbmsg = msg;
    this.index = i;
    this.searchHotel.gbmsg = msg;
    this.searchHotel.input = msg.regionName;
    this.searchHotel.flag = 1;
    this.co = 1;
    this.searchHotel.recent = this.recent;
    // this.clearClonePage('page-main');
    // this.app.getActiveNav().push('MainPage');
    //this.app.getActiveNav().setRoot('MainPage');
    this.navCtrl.navigateBack('/app/tabs/tab1');
    //this.gf.hiddenHeader();
  }
  nextRecent(msg) {
    this.searchHotel.gbmsg = msg;
    // this.gbmsg = msg;
    if (msg.regionName) {
      this.searchHotel.input = msg.regionName;
    } else {
      this.searchHotel.input = msg.HotelName;
    }
    this.searchHotel.flag = 2;
    this.co = 2;
    // this.clearClonePage('page-main');
    // this.app.getActiveNav().push('MainPage');
    //this.app.getActiveNav().setRoot('MainPage');
    this.navCtrl.navigateBack('/app/tabs/tab1');
    //this.gf.hiddenHeader();
  }
  itemclick(item) {
    this.searchHotel.gbitem = item;
    // this.gbitem = item;
    if (item.HotelName) {
      this.searchHotel.input = item.HotelName;
    } else {
      this.searchHotel.input = item.RegionName;
    }
    this.searchHotel.flag = -0;
    this.co = 0;
    // this.clearClonePage('page-main');
    // this.app.getActiveNav().push('MainPage');
    //this.app.getActiveNav().setRoot('MainPage');
    this.navCtrl.navigateBack('/app/tabs/tab1');
    //this.gf.hiddenHeader();
  }
  getItems(ev: any) {
    // Reset items back to all of the items
    var se = this;
    // if (this.input) {
    //   const val = ev.target.value;
    if(ev.detail.value){
      const val = ev.detail.value;
      var options = {
        method: 'GET',
        url: 'https://www.ivivu.com/GListSuggestion',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        qs: { key: val },
        headers:
        {
        }
      };

      request(options, function (error, response, body) {
        if (error) {
          error.page = "searchhotel";
          error.func = "getItems";
          error.param =  JSON.stringify(options);
          C.writeErrorLog(error,response);
          throw new Error(error)
        };
        se.zone.run(() => {
          // se.items = JSON.parse(body);
          // if ( se.items.length>0 ) {
          //   se.ischecktext=false;
          //   if (val && val.trim() != '') {
          //     se.ischecklist = true;
             
          //   }
          //   else {
          //     se.ischecklist = false;
          //     se.items = [];
          //   }
          // }
          // else
          // {
          //   se.ischecktext=true;
          // }
          let lstitems = JSON.parse(body);
          
          if(lstitems.length && lstitems.length >0){
            se.ischecktext=false;
            se.ischecklist = true;
              if(se.items.length ==0){
                lstitems.forEach(element => {
                  element.show = true;
                })
                se.items.push(...lstitems);
              }else{
                se.items.forEach(e => {
                  e.show = false;
                })

                lstitems.forEach(element => {
                  let check = se.items.filter((i)=>{ return i.id == element.id });
                  if(check && check.length == 0)
                  {
                    element.show = true;
                    se.items.push(element);
                  }else{
                    check[0].show = true;
                  }
                })
              }
            
          }else{
            se.items.forEach(element => {
              element.show = false;
            });
            se.ischecktext=true;
          }
        });
      })
    }
    else {
      se.ischecklist = false;
      se.ischecktext=false;
      se.items.forEach(element => {
        element.show = false;
    });
    }
  }
  search() {
    var se = this;
    this.searchHotel.backPage = "";
    if (this.co == 1) {
      this.authService.region = this.gbmsg.regionName;
      this.authService.regionid = this.gbmsg.regionId;
      this.authService.regioncode = this.gbmsg.regionCode;
      
      if (this.recent) {
        var cocheck = 0;
        for (let i = 0; i < this.recent.length; i++) {
          if (this.recent[i].RegionId == this.gbmsg.regionId) {
            cocheck = 1;
            break;
          }
        }
        if (cocheck == 0) {
          var item1 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbmsg.regionId, RegionCode: this.gbmsg.regionCode, regionName: this.gbmsg.regionName, flag: "1", TotalHotels: this.gbmsg.totalHotel };
          se.searchHotel.recent = [];

          if (this.recent.length > 1) {
            se.searchHotel.recent.push(this.recent[1]);
          } else {
            se.searchHotel.recent.push(this.recent[0]);
          }
          se.searchHotel.recent.push(item1);
        }

      }
      else {
        var item1 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbmsg.regionId, RegionCode: this.gbmsg.regionCode, regionName: this.gbmsg.regionName, flag: "1", TotalHotels: this.gbmsg.totalHotel };
        se.searchHotel.recent = [];
        se.searchHotel.recent.push(item1);
      }
      this.navCtrl.navigateForward('/hotellist/false');
      //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
    }
    else if (this.co == 0) {
      if (this.gbitem.Type == 1) {
        var id1 = { root: "mainpage" };
        if (this.recent) {
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[i].HotelId == id1) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            var item2 = { Type: "1", HotelId: this.gbitem.HotelId, HotelName: this.gbitem.HotelName, RegionId: "", RegionCode: "", regionName: "", flag: "0", TotalHotels: '' };
            se.searchHotel.recent = [];

            if (this.recent.length > 1) {
              se.searchHotel.recent.push(this.recent[1]);
            } else {
              se.searchHotel.recent.push(this.recent[0]);
            }
            this.searchHotel.recent.push(item2)
          }
        }
        else {
          var item2 = { Type: "1", HotelId: this.gbitem.HotelId, HotelName: this.gbitem.HotelName, RegionId: "", RegionCode: "", regionName: "", flag: "0", TotalHotels: '' };
          se.searchHotel.recent = [];

          this.searchHotel.recent.push(item2)
        }
        this.searchHotel.hotelID = this.gbitem.HotelId;
        this.searchHotel.rootPage = "mainpage";
        this.navCtrl.navigateForward('/hoteldetail/'+this.searchHotel.hotelID);
        //this.navCtrl.navigateForward(['/app/tabs/hoteldetail/'+this.searchHotel.hotelID]);

      } else {
        if (this.recent) {
          for (let i = 0; i < this.recent.length; i++) {
            if (this.recent[this.index].RegionId == this.gbitem.RegionId) {
              cocheck = 1;
              break;
            }
          }
          if (cocheck == 0) {
            var item3 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbitem.RegionId, RegionCode: this.gbitem.RegionCode, regionName: this.gbitem.RegionName, flag: "0", TotalHotels: this.gbitem.TotalHotels };
            se.searchHotel.recent = [];

            if (this.recent.length > 1) {
              se.searchHotel.recent.push(this.recent[1]);
            } else {
              se.searchHotel.recent.push(this.recent[0]);
            }
            this.searchHotel.recent.push(item3)
          }

        }
        else {
          var item3 = { Type: "2", HotelId: "", HotelName: "", RegionId: this.gbitem.RegionId, RegionCode: this.gbitem.RegionCode, regionName: this.gbitem.RegionName, flag: "0", TotalHotels: this.gbitem.TotalHotels };
          se.searchHotel.recent = [];


          this.searchHotel.recent.push(item3)
        }

        this.authService.region = this.gbitem.RegionName;
        this.authService.regionid = this.gbitem.RegionId;
        this.authService.regioncode = this.gbitem.RegionCode;
        this.navCtrl.navigateForward('/hotellist/false');
        //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
      }
    }
    else if (this.co == 2) {
      if (this.gbmsg.Type == 1) {
        this.searchHotel.hotelID = this.gbitem.HotelId;
        this.searchHotel.rootPage = "mainpage";
        this.navCtrl.navigateForward('/hoteldetail/'+this.searchHotel.hotelID);
        //this.navCtrl.navigateForward(['/app/tabs/hoteldetail/'+this.searchHotel.hotelID]);
      } else {
        this.authService.region = this.gbmsg.regionName;
        this.authService.regionid = this.gbmsg.RegionId;
        this.authService.regioncode = this.gbmsg.RegionCode;
        this.navCtrl.navigateForward('/hotellist/false');
        //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
      }
    }
  }
  ionViewDidLoad() {
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
    //Xử lý nút back của dt
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        // code that is executed when the user pressed the back button
        this.navCtrl.navigateBack('/hotellist/false');
        //this.navCtrl.navigateForward(['/app/tabs/hotellist/false']);
      })
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
  goback() {
    this.navCtrl.back();
    //this.gf.hiddenHeader();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.myInput.setFocus();
    }, 150);
    this.keyboard.show();
  }


}
