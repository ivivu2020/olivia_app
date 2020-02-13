import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform, LoadingController } from '@ionic/angular';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import * as request from 'requestretry';
import * as moment from 'moment';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ValueGlobal, SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { NetworkProvider } from '../network-provider.service';
/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-topdeallist',
  templateUrl: 'topdeallist.html',
  styleUrls: ['topdeallist.scss'],
})
export class TopDealListPage implements OnInit {
  arrbloglike; istextblog = false; public isConnected: boolean = true; username; page = 1;
  _infiniteScroll: any; ischeckloadmore = false;
  regionnamesuggest: any="";
  memberid: any="";
    slideData= [];
    totalItem=0;
    showloadmore: boolean = true;
    pagesize: number=10;
    myloader: any;
    ischeck: boolean = false;
    sl: any=0;
    slideData1= [];
    listItems: any=[];
  intervalTrip: any;
  listRamdomSale = ['Ưu đãi bí mật', 'Giá tốt trong ngày'];
  listLikeItems: any=[];
  blogtripssk = [1,2,3,4,5];
  loaddatadone: boolean = false;
  constructor(public searchhotel:SearchHotel, public networkProvider: NetworkProvider, public valueGlobal: ValueGlobal, public storage: Storage, public platform: Platform, public navCtrl: NavController, public value: ValueGlobal, public gf: GlobalFunction, private activatedRoute: ActivatedRoute, public zone: NgZone, private socialSharing: SocialSharing,
    private loadingCtrl: LoadingController) {
     //Xóa cache blogtrip sau 1 ngày
     this.intervalTrip = setInterval(()=>{
      this.storage.remove('listtopdealdefault');
    }, 24*60*60*1000 );
  }

  ngOnInit() {

  }

  async presentLoading() {
    let loadder = await this.loadingCtrl.create({
      duration: 300
    });
    loadder.present();
  }

  getHoteldeal() {
    var se = this;
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopDeals?pageIndex=' + se.page + '&pageSize=200' + (se.memberid ? '&memberid='+se.memberid : ''),
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
      {

        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U'
      }
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "main",
          func: "getHoteldeal",
          message: response.statusMessage,
          content: response.body,
          param: JSON.stringify(options),
          type: "warning"
        };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page = "main";
        error.func = "getHoteldeal";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error,response);
      };
      se.slideData = JSON.parse(body);
      if(se.slideData && se.slideData.length >0){
        se.storage.set('listtopdealdefault', se.slideData);
      }
      if(se.slideData.length >0){
        se.totalItem = se.slideData.length;
      }
      
      se.showloadmore = se.slideData.length == se.totalItem ? false : true;
      var chuoi = "";
      se.zone.run(() => {
        for (let i = 0; i < se.pagesize; i++) {
          if (se.slideData && se.slideData[i].images[0]) {
            var res = se.slideData[i].images[0].url.substring(0, 4);
            if (res != "http") {
              se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
            }
            var minPrice = se.slideData[i].minPrice.toLocaleString();
            chuoi = "";
            var name = se.slideData[i].name.split('|');
            for (let x = 1; x < name.length; x++) {
              if (x == name.length - 1) {
                chuoi = chuoi + name[x];
              } else {
                chuoi = chuoi + name[x] + "|";
              }
            }
            switch (se.slideData[i].rating) {
                case 50:
                  se.slideData[i].rating = "./assets/star/ic_star_5.svg";
                  break;
                case 45:
                  se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
                  break;
                case 40:
                  se.slideData[i].rating = "./assets/star/ic_star_4.svg";
                  break;
                case 35:
                  se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
                  break;
                case 30:
                  se.slideData[i].rating = "./assets/star/ic_star_3.svg";
                  break;
                case 25:
                  se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
                  break;
                case 20:
                  se.slideData[i].rating = "./assets/star/ic_star_2.svg";
                  break;
                case 15:
                  se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
                  break;
                case 10:
                  se.slideData[i].rating = "./assets/star/ic_star.svg";
                  break;
                case 5:
                  se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
                  break;
                default:
                  break;
              }
            
            var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: se.slideData[i].minPrice/1000 >= 1000 ? (se.slideData[i].minPrice/1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',','.') : 0, topsale24Total: 0,Liked: false, url: se.slideData[i].url };
            se.slideData1.push(item);
          }

        }
        se.loadTopSale24h(se.slideData1);
        se.sl = se.slideData1.length;
        se.ischeck = true;
        if(se.myloader){
          se.myloader.dismiss();
        }
        se.loaddatadone = true;
        if(se._infiniteScroll){
          se._infiniteScroll.target.complete();
        }
      })
    });
  }
  /**
   * Hàm load topsale theo hotelid
   */
  loadTopSale24h(listData){
    var se = this;
    listData.forEach(element => {
      let strurl = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopSale24hByHotel?hotelId='+ element.id;
      var options = {
        method: 'GET',
        url: strurl,
        headers: {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
        },
        timeout: 180000, maxAttempts: 5, retryDelay: 2000,
      };
      request(options, function (error, response, body) {
        if (error) {
          error.page = "topdeallist";
          error.func = "loaddata";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        }
        if (response.statusCode == 200) {
          var res = JSON.parse(body);
          se.zone.run(()=>{
            element.topsale24Total = res.total;
            if(res.total < 2){
              var randomText = se.listRamdomSale[Math.floor(Math.random()*se.listRamdomSale.length)];
              element.textRandomSale = randomText;
            }
            
          })
        }
      })
    });
  }

  /**
   * Hàm load paging topdeal
   */
  getHotelDealPaging() {
    var se = this;
      se.showloadmore = se.slideData1.length == se.slideData.length ? false : true;
      let start = se.slideData1.length;
      var chuoi = "";
      var listLoadTopSale = [];
      se.zone.run(() => {
        for (let i = start ; i < start + se.pagesize; i++) {
          if (se.slideData[i] && se.slideData[i].images[0]) {
            var res = se.slideData[i].images[0].url.substring(0, 4);
            if (res != "http") {
              se.slideData[i].images[0].url = 'https:' + se.slideData[i].images[0].url;
            }
          
          var minPrice = se.slideData[i].minPrice ? se.slideData[i].minPrice.toLocaleString() : '';
            chuoi = "";
            var name = se.slideData[i].name.split('|');
            for (let x = 1; x < name.length; x++) {
              if (x == name.length - 1) {
                chuoi = chuoi + name[x];
              } else {
                chuoi = chuoi + name[x] + "|";
              }
            }
            switch (se.slideData[i].rating) {
                case 50:
                  se.slideData[i].rating = "./assets/star/ic_star_5.svg";
                  break;
                case 45:
                  se.slideData[i].rating = "./assets/star/ic_star_4.5.svg";
                  break;
                case 40:
                  se.slideData[i].rating = "./assets/star/ic_star_4.svg";
                  break;
                case 35:
                  se.slideData[i].rating = "./assets/star/ic_star_3.5.svg";
                  break;
                case 30:
                  se.slideData[i].rating = "./assets/star/ic_star_3.svg";
                  break;
                case 25:
                  se.slideData[i].rating = "./assets/star/ic_star_2.5.svg";
                  break;
                case 20:
                  se.slideData[i].rating = "./assets/star/ic_star_2.svg";
                  break;
                case 15:
                  se.slideData[i].rating = "./assets/star/ic_star_1.5.svg";
                  break;
                case 10:
                  se.slideData[i].rating = "./assets/star/ic_star.svg";
                  break;
                case 5:
                  se.slideData[i].rating = "./assets/star/ic_star_0.5.svg";
                  break;
                default:
                  break;
              }
          
          var item = { ischecked: 0, id: se.slideData[i].id, name: name[0], imageUrl: se.slideData[i].images[0].url, regionName: se.slideData[i].regionName, minPrice: minPrice, description: chuoi, rating: se.slideData[i].rating, priceshow: se.slideData[i].minPrice/1000 >= 1000 ? (se.slideData[i].minPrice/1000).toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(',','.') : 0, topsale24Total: 0,Liked: false, url: se.slideData[i].url };
          se.slideData1.push(item);
          listLoadTopSale.push(item);
        }

      }
        se.loadTopSale24h(listLoadTopSale);
        se.sl = se.slideData1.length;
        se.ischeck = true;
        setTimeout(()=>{
          if(se.myloader){
            se.myloader.dismiss();
          }
        },500)
    
          if(se._infiniteScroll){
            se._infiniteScroll.target.complete();
          }
      })
  }

  /**
   * 
   * @param arrays mảng kiểm tra trùng
   * @param item item kiểm tra
   * @param type loại 1 - topdeal, 2 - region, 3 - mood, 4 - blog
   */
  checkExistsItemInArray(arrays:any,item:any,type:any){
    var res = false;
    if(type==1 || type ==3 || type==2)//hoteldeal || mood
    {
      res = arrays.some(r => r.id == item.id);
    }
    if(type==4)//blog
    {
      res = arrays.some(r => r.Id == item.Id);
    }
    
    return res;
  }

  bindItemLike(listLike) {
    var se = this;
    se.listItems.forEach(element => {
      var itemlikemap = listLike.filter((item) => { return item.id == element.id });
      if (itemlikemap && itemlikemap.length > 0) {
        se.zone.run(() => {
          element.Like = true;
        })
      }
      else {
        se.zone.run(() => {
          element.Like = false;
        })
      }
    });

  }
  /*** Set like item
 * PDANH  29/01/2018
 */
likeItem(id) {
  var se = this;
  se.storage.get('auth_token').then(auth_token => {
    if (auth_token) {
       //set lại trạng thái trên local trước khi gọi api
      se.reloadDataLike(id);
      //Gọi api update lại trạng thái like của item
      var text = "Bearer " + auth_token;
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/AddFavouriteHotel',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        headers:
        {
          'postman-token': '9fd84263-7323-0848-1711-8022616e1815',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        },
        body: { hotelId: id },
        json: true
      };
      request(options, function (error, response, body) {
        if (response.statusCode != 200) {
          var objError = {
            page: "topdeallist",
            func: "likeItem",
            message: response.statusMessage,
            content: response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
          C.writeErrorLog(objError,response);
        }
        if (error) {
          error.page = "topdeallist";
          error.func = "likeItem";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        };
        if (se.valueGlobal.dealid) {
          se.getHotelLike();
          se.valueGlobal.dealid='';
        }
      });
    }
    else {
      se.valueGlobal.dealid=id;
      //se.valueGlobal.logingoback = 'TabPage';
      se.navCtrl.navigateForward('/login');
    }
  });
  //google analytic
  se.gf.googleAnalytion('hoteldetail', 'likeitem', '');
}
/*** Set unlike item
 * PDANH  29/01/2018
 */
unlikeItem(id) {
  var se = this;
  se.storage.get('auth_token').then(auth_token => {
    if (auth_token) {
      //set lại trạng thái trên local trước khi gọi api
      se.reloadDataLike(id);
      //Gọi api update lại trạng thái like của item
      var text = "Bearer " + auth_token;
      var options = {
        method: 'POST',
        url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/RemoveFavouriteHotelByUser',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        headers:
        {
          'postman-token': 'a19ecc0a-cb83-4dd9-3fd5-71062937a931',
          'cache-control': 'no-cache',
          'content-type': 'application/json',
          authorization: text
        },
        body: { hotelId: id },
        json: true
      };

      request(options, function (error, response, body) {
        if (response.statusCode != 200) {
          var objError = {
            page: "topdeallist",
            func: "unlikeItem",
            message: response.statusMessage,
            content: response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
          C.writeErrorLog(objError,response);
        }
        if (error) {
          error.page = "topdeallist";
          error.func = "unlikeItem";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        };
      });
    }
    else {
      //se.valueGlobal.logingoback = 'TabPage';
      se.navCtrl.navigateForward('/login');
    }
  });
  //google analytic
  se.gf.googleAnalytion('hoteldetail', 'unlikeitem', '');
}

  share(url) {
    this.socialSharing.share(null, null, null, url).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  goback() {
    //this.gf.hiddenHeader();
    this.navCtrl.navigateBack('/app/tabs/tab1');
  }
  
  doInfinite(infiniteScroll) {
    this.zone.run(() => {
        if (this.ischeck == true) {
          this.page = this.page + 1;
          this._infiniteScroll = infiniteScroll;
          this.getHotelDealPaging();
        }
      })
  }

  ionViewDidEnter() {
    //this.presentLoading();
    this.searchhotel.backPage = "topdeallist";
    this.searchhotel.backPage = "topdeallist";
    this.storage.get('auth_token').then((data) => {
      if (data) {
        if (this.valueGlobal.dealid) {
          this.likeItem(this.valueGlobal.dealid);
        }
        else{
          this.getHotelLike();
        }
      }
    })
    this.storage.get('username').then(username => {
      this.username = username;
    });
    this.storage.get('jti').then((uid:any)=>{
      this.memberid = uid;
    })
    if (this.networkProvider.isOnline()) {
        this.isConnected = true;
        this.getHotelLike();
        this.storage.get('listtopdealdefault').then((data:any)=>{
        if(data && data.length >0){
          setTimeout(()=>{
            this.slideData = data;
            this.getHotelDealPaging();
            this.loaddatadone = true;
          },300)
        }else{
          this.getHoteldeal();
        }
        
      })
    } else {
      this.isConnected = false;
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
    }

  }

  getHotelLike(){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if(auth_token){
      var text="Bearer " + auth_token;
      var options = { method: 'GET',
      url: C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/GetFavouriteHotelByUser',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers: 
      { 'postman-token': '89692e55-6555-1572-db28-4becc311f0ba',
        'cache-control': 'no-cache',
        'content-type': 'application/json',
        authorization:text } 
      };
      request(options, function (error, response, body) {
        if(response.statusCode != 200){
          var objError ={
              page: "topdeallist",
              func: "getHotelLike",
              message : response.statusMessage,
              content : response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
          C.writeErrorLog(objError,response);
        }
        if (error) {
          error.page="topdeallist";
          error.func="getHotelLike";
          error.param = JSON.stringify(options);
          C.writeErrorLog(error,response);
        };
        se.zone.run(() => {
          var result = JSON.parse(body);
          if(!result.error){
            se.listLikeItems = JSON.parse(body);
            se.bindHotelLike();
          }
        });
      });
    }
  })
  }
  /*** Set trạng thái like
   * PDANH  29/07/2018
   */
  bindHotelLike(){
    var se = this;
    if(se.slideData1 && se.slideData1.length >0){
      se.slideData1.forEach(item => {
        //Nếu item đang like và list like trả về ko có id của item đang xét thì untick like
        if(se.listLikeItems.indexOf(item.id) != -1){
          item.Liked = true;
        }else{
          item.Liked = false;
        }
      });
    }
  }

  /*** Set lại trạng thái like
   * PDANH  29/07/2018
   */
  reloadDataLike(id){
    var se = this;
    if(se.slideData1 && se.slideData1.length >0){
      se.slideData1.forEach(item => {
        if(item.id == id){
          item.Liked = !item.Liked;
        }
      });
    }
  }

/**
 * Show hotel detail
 * @param item hotel được click
 */
  itemclickht(item) {
    if (!this.isConnected) {
      this.gf.showWarning('Không có kết nối mạng', 'Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng', 'Đóng');
      return;
    }
    this.searchhotel.hotelID = item.id;
    this.searchhotel.rootPage = "topdeallist";
    this.valueGlobal.logingoback='/hoteldetail/' + item.id;
    //this.navCtrl.navigateForward(['/app/tabs/hoteldetail/' + item.id]);
    this.navCtrl.navigateForward('/hoteldetail/'+ item.id);
  }
}
