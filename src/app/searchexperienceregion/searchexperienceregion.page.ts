import { audit } from 'rxjs/operators';
import { json } from 'body-parser';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, Platform, ToastController} from '@ionic/angular';
import * as request from 'requestretry';
import { AuthService } from '../providers/auth-service';
import * as moment from 'moment';
import { SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { Network } from '@ionic-native/network/ngx';
import { NetworkProvider } from './../network-provider.service';
import { Storage } from '@ionic/storage';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import * as $ from 'jquery';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, icon,latLng } from 'leaflet';
import * as L from 'leaflet';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

@Component({
  selector: 'app-searchexperienceregion',
  templateUrl: './searchexperienceregion.page.html',
  styleUrls: ['./searchexperienceregion.page.scss'],
})
export class SearchExperienceRegionPage implements OnInit {
  showpopup = false;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  public room1 = 1; public room = 1; gbitem; gbmsg;
  items = []; ischecklist = false; isenabled = true;
  listregion = [];
  co = 0; recent; index
  setInter;ischecktext=false;
  public isConnected:boolean;
  json: any;
  listFilterItem=[{id: 3, name: "Ăn gì"},{id: 22, name: "Uống gì"},{id: 6, name: "Xem gì"},{id: 7, name: "Chơi gì"},{id: 4, name: "Ở đâu"},{id: 9, name: "Sống ảo"}];
  @ViewChild('inputSearchbar') input;
  @ViewChild('inputSearchPlace') inputPlace;
  itemsDisplay: any=[];
  textSearchPlace: any;
  hasChoiceRegion: boolean = false;
  textSearchRegion: any;
  isSearchRegion: boolean = false;
  itemsRegion: any=[];
  hasload: boolean;
  constructor(public platform: Platform,
    public navCtrl: NavController, 
    public authService: AuthService, 
    public zone: NgZone, 
    public searchHotel: SearchHotel,
    public gf: GlobalFunction,
    public networkProvider: NetworkProvider,
    public storage: Storage,
    public keyboard: Keyboard,
    private geolocation: Geolocation,
    public activityService: ActivityService,
    public nativeGeocoder: NativeGeocoder,
    private toastCtrl: ToastController) { 
    this.isConnected = this.networkProvider.isOnline();
      if (this.isConnected) {
        setTimeout(()=>{
          this.loadListRegion();
        },100)
      }else{
        this.gf.showWarning('Không có kết nối mạng','Vui lòng kết nối mạng để sử dụng các tính năng của ứng dụng','Đóng');
      }
  }

  loadListRegion(){
    this.storage.get('listexeperienceregion').then((data:any)=>{
      if(data){
        this.zone.run(()=>{
          this.listregion.push(...data);
          this.items = data;
        })
      }else{
        this.getdata();
      }
    })
  }

  ngOnInit() {
  }

  ionViewDidEnter(){
    setTimeout(() => {
      //Nếu chưa nhập region thì focus vào ô nhập region
      if(!this.textSearchRegion){
        this.input.setFocus();
      }else{
        //Nếu có region thì focus vào ô nhập địa điểm
        this.inputPlace.setFocus();
      }
      
    }, 500);
    //this.keyboard.show();
  }

  ionViewWillEnter(){
    var se = this;
    //se.clearSearchValue();
    if(se.searchHotel.inputExperienceItem){
      se.textSearchRegion = !se.searchHotel.inputExperienceItem.regionName ? se.searchHotel.inputExperienceItem.name : (se.searchHotel.inputExperienceItem.hotelName ? se.searchHotel.inputExperienceItem.hotelName : se.searchHotel.inputExperienceItem.regionName );
      se.hasChoiceRegion = true;
      se.isSearchRegion = false;
    }
    else if(se.searchHotel.inputExperienceRegionName && se.searchHotel.deviceLocation.regioncode){
      se.textSearchRegion = se.searchHotel.inputExperienceRegionName ? se.searchHotel.inputExperienceRegionName : '';
      se.hasChoiceRegion = true;
      se.isSearchRegion = false;
    }
    if(se.searchHotel.ItemExperienceRegionRecent && se.searchHotel.ItemExperienceRegionRecent.length>0){
      se.recent = se.searchHotel.ItemExperienceRegionRecent;
      se.recent.forEach(element => {
        if(element.tagsJson && element.tagsJson.length>0){
          element.tag = element.tagsJson[0].id;
        }
        // if( (element.searchType == 1 && element.code && element.name) || (element.searchType ==2 && !element.placeId && element.name) ){
        //   se.textSearchRegion = element.name && !element.hotelName && !element.placeId ? element.name : element.hotelName;
        //   se.hasChoiceRegion = true;
        //   se.isSearchRegion = false;
        //   se.searchHotel.inputExperienceRegionCode= element.code ? element.code : element.regionCode;
        //   se.searchHotel.inputExperienceRegionName= element.name;
        //   se.searchHotel.inputExperienceText = element.name ? element.name : element.hotelName;
        //   se.searchHotel.inputExperienceItem = element;
        // }
        
      });
    }
    if(se.searchHotel.inputExperienceSearchPlaceText){
      se.textSearchPlace = se.searchHotel.inputExperienceSearchPlaceText;
    }
    se.hasload = false;
  }

  goback(){
    //this.activityService.abortSearch = true;
    this.navCtrl.back();
  }

  cancelInput(){
    var se = this;
    se.ischecklist = false;
    se.ischecktext=false;
    se.searchHotel.inputExperienceText = "";
    if(se.listregion.length >0){
      se.items = se.listregion;
      se.items = se.items.filter(function(item:any){
        return se.gf.checkExistsItemInArray(se.listregion, item, 'experiencesearch');
      });
    }else{
      se.loadListRegion();
    }
    
  }

  getItemsRegion(ev:any){
    var se = this;
    //if(ev.detail.value){
      if(ev.target.value){
      //const val = ev.detail.value;
      const val = ev.target.value;
      var options = {
        method: 'GET',
        url: C.urls.baseUrl.urlMobile + '/api/Data/TypeaheadPlace?search='+val,
        //url: 'https://www.ivivu.com/GListSuggestion',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        qs: { key: val },
        headers:
        {
        }
      };

      request(options, function (error, response, body) {
        if (error) {
          error.page = "searchexperiencehotel";
          error.func = "getItemsRegion";
          error.param =  JSON.stringify(options);
          C.writeErrorLog(error,response);
          throw new Error(error)
        };
        se.zone.run(() => {
          let data = JSON.parse(body);
          se.ischecklist= true;
          se.isSearchRegion = true;
          if(se.hasload){
            se.hasChoiceRegion = false;
          }
          
          //se.textSearchRegion = "";
              if(se.itemsRegion.length ==0){
                data.forEach(element => {
                  element.show = element.regionCode && !element.placeId ? true : false;
                  element.searchType= element.placeId ? 1 : 2;// 1 - place
                })
                se.itemsRegion.push(...data);
              }else{
                se.itemsRegion.forEach(e => {
                  se.zone.run(() => {
                    e.show = false;
                  })
                })

                data.forEach(element => {
                  element.searchType = element.placeId ? 1 : 2;//1 - place
                  element.show = element.regionCode && !element.placeId ?true : false;
                  se.itemsRegion.push(element);
                })
              }
              se.hasload = true;
        });
      })
    }
    else {
      se.ischecklist = false;
      se.ischecktext=false;
      se.itemsRegion.forEach(element => {
          element.show = false;
      });
    }
  }
  cancelInputRegion(){
    var se = this;
    se.ischecklist = false;
    se.ischecktext=false;
    se.hasChoiceRegion = false;
    se.textSearchPlace = "";
  }
  getItems(ev: any) {
    var se = this;
    if(ev.detail.value){
      se.isSearchRegion = false;
      const val = ev.detail.value;
      setTimeout(()=>{
          //let url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?Name='+val+'&SubRegions=0&paging.pageNumber=0&paging.pageSize=200';
          var textregion = se.textSearchRegion ? se.textSearchRegion : "";
          if(se.searchHotel.inputExperienceItem  && se.searchHotel.inputExperienceItem.regionName){
            textregion = se.searchHotel.inputExperienceItem.regionName;
          }else{
            textregion = se.replaceTextRegion(textregion);
          }
      let url = C.urls.baseUrl.urlMobile + '/api/Data/TypeaheadPlace?search=' + textregion + " " +val ;
      se.gf.RequestApi('GET',url,{},{},'SearchExperienceRegionPage', 'getItems').then((data:any)=>{
        if(data && data.length>0){
          se.ischecklist= true;
          if(se.items.length ==0){
            data.forEach(element => {
              element.show = ((element.type == 1 || (element.type==2 && element.hotelName) ) && element.placeId) ? true : false;//Chỉ lấy quán ăn hoặc homestay, bỏ item vùng;
              element.searchType= element.placeId ? 1 : 2;// 1 - place
              //se.calculateDistanceMarker(element, 'totalDistance');
              if(!se.checkItemRegion(textregion, element)){
                element.show = false;
              }
            })
            
            se.items.push(...data);
          }else{
            se.items.forEach(e => {
              e.show = false;
            })

            data.forEach(element => {
              let check = se.items.filter((i)=>{ return i.id == element.id });
              element.searchType = element.placeId ? 1 : 2;//place
              element.show = ((element.type == 1 || (element.type==2 && element.hotelName) ) && element.placeId) ? true : false;
              if(se.checkItemRegion(textregion, element)){
                se.items.push(element);
              }
              
             
            })
          }
        }else{
          se.items = [];
        }
      })
      },300)
      
    }else{
      se.ischecklist = false;
      se.ischecktext=false;
      // se.items.forEach(element => {
      //     element.show = false;
      // });
      se.items = se.items.filter(function(item:any){
        return se.gf.checkExistsItemInArray(se.listregion, item, 'experiencesearch');
      });
    }
  }

  checkItemRegion(textRegion, item){
    var res = true;
    textRegion = this.replaceTextRegion(textRegion);
    if(textRegion){
      if(textRegion.indexOf('Ho Chi Minh') != -1 || textRegion.indexOf('ho chi minh') != -1 || textRegion.indexOf('Thành Phố Hồ Chí Minh') != -1){
        res = true;
      }
      else if(item.address && this.gf.convertFontVNI(item.address).indexOf( this.gf.convertFontVNI(textRegion.trim())) == -1){
        res = false;
      }
    }
    return res;
  }

  replaceTextRegion(text){
    if(text.indexOf('City') != -1){
      text = text.replace('City', '');
    }
    if(text.indexOf('city') != -1){
      text = text.replace('city', '');
    }
    if(text.indexOf('TP.') != -1){
      text = text.replace('TP.', '');
    }
    if(text.toLowerCase().indexOf('saigon') != -1 || text.indexOf('sai gon') != -1){
      text = text.replace('saigon', 'hồ chí minh');
      text = text.replace('sai gon', 'hồ chí minh');
      text = text.replace('Saigon', 'hồ chí minh');
      text = text.replace('Sai gon', 'hồ chí minh');
    }
    return text;
  }

  loadDataHotel(val){
    var se = this;
      var options = {
        method: 'GET',
        url: C.urls.baseUrl.urlGet + '/GListSuggestion',
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        qs: { key: val },
        headers:
        {
        }
      };

      request(options, function (error, response, body) {
        if (error) {
          error.page = "SearchExperienceRegionPage";
          error.func = "loadDataHotel";
          error.param =  JSON.stringify(options);
          C.writeErrorLog(error,response);
        };
        se.zone.run(() => {
          let lstitems = JSON.parse(body);
          
          if(lstitems.length && lstitems.length >0){
            se.ischecklist= true;
              se.itemsDisplay = [];

              if(se.items.length ==0){
                lstitems.forEach(element => {
                  element.show = true;
                  element.searchType=2;//hotel, region
                  se.bindItemName(element);
                })
                se.items.push(...lstitems);
              }else{
                se.items.forEach(e => {
                  e.show = false;
                })

                lstitems.forEach(element => {
                  element.searchType=2;//hotel, region
                  se.bindItemName(element);
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
          }
          else{
            se.items.forEach(element => {
              element.show = false;
            });
            se.itemsDisplay.forEach(element => {
              element.show = false;
            });
            se.ischecktext=true;
          }
        });
      })
  }

  bindItemName(item){
    var se = this;
    se.zone.run(()=>{
      if(item.searchType == 2 && item.Type ==1){
        item.name = item.HotelName;
        item.id = item.HotelId;
        let arr = item.HotelUrl.split('/');
        item.searchHotelName = arr[arr.length - 1].toString().replace('khach-san-','');
        item.searchRegionCode = arr[arr.length - 2].toString().replace('khach-san-','');
        item.latitude = item.Latitude;
        item.longitude = item.Longitude;
      }else if(item.searchType == 2 && item.Type ==2){
        item.name = item.RegionName;
        item.code = item.RegionCode;
        item.id = item.RegionId;
        item.latitude = item.Latitude;
        item.longitude = item.Longitude;
      }
    })
    return item;
  }

  getdata(){
    var se = this;
    let url = C.urls.baseUrl.urlMobile + '/api/Data/GetRegionSearch';
    se.gf.RequestApi('GET',url, {}, {}, 'SearchExperienceRegionPage', 'GetRegionSearch').then((data:any)=>{
      let lstitems = data.listRegion;
          if(lstitems && lstitems.length >0){
            se.storage.set('listexeperienceregion',lstitems);
            se.ischecktext=false;
            se.ischecklist = false;
            
              if(se.items.length ==0){
                lstitems.forEach(element => {
                  element.show = true;
                  element.searchType =1;
                })
                se.items.push(...lstitems);
              }else{
                se.items.forEach(e => {
                  e.show = false;
                })

                lstitems.forEach(element => {
                  element.searchType =1;
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
        //});
    })
  }

  nextRecent(item){
    var se = this;
    if(!item.placeId){
      se.searchHotel.inputExperienceRegionCode= item.regionCode ? item.regionCode : item.code;
      //se.textSearchRegion = item.name ? item.name : item.regionName;
      se.textSearchRegion = item.name && !item.hotelName && !item.placeId ? item.name : item.hotelName;
      se.zone.run(()=>{
        se.hasChoiceRegion = true;
      })
      
    }
    else{
      se.textSearchPlace = item.name;
    }
    if(item.regionName){
      se.searchHotel.inputExperienceRegionName = item.regionName;
    }else{
      se.searchHotel.inputExperienceRegionName = "";
    }
    //se.searchHotel.inputExperienceRegionName= (item.regionCode || item.code) ? item.name : se.searchHotel.inputExperienceRegionName;
    se.searchHotel.inputExperienceText = item.placeId ? item.name : (item.hotelName  ? item.hotelName: item.name) ;
    se.searchHotel.inputExperienceItem = item;
    if(se.searchHotel.inputExperienceRegionName && !item.placeId && se.searchHotel.inputExperienceText.indexOf(se.searchHotel.inputExperienceRegionName) == -1){
      se.searchHotel.inputExperienceText += " | " + se.searchHotel.inputExperienceRegionName;
    }
    
    //this.navCtrl.back();
  }

  nextPopular(item, index){
    var se = this;
    se.searchHotel.inputExperienceRegionCode= item.code;
    se.searchHotel.inputExperienceRegionName= item.name;
    se.searchHotel.inputExperienceText = item.name ? item.name : item.hotelName;
    se.searchHotel.inputExperienceItem = item;
    if(se.searchHotel.ItemExperienceRegionRecent && se.searchHotel.ItemExperienceRegionRecent.length >0){
      //Check khác id thì clear localcheckfilter
      var len = se.searchHotel.ItemExperienceRegionRecent.length;
      var itemRecentPrevious =  se.searchHotel.ItemExperienceRegionRecent[len -1];
      if(itemRecentPrevious && itemRecentPrevious.id != item.id){
        se.searchHotel.ef_arrlocalnamecheck =[];
      }
      if(!se.gf.checkExistsItemInArray(se.searchHotel.ItemExperienceRegionRecent,item,'experiencesearch')){
        //Trên 3 item thì lấy 2 item gần nhất và push thêm item được click
        if(se.searchHotel.ItemExperienceRegionRecent.length >2){
          se.searchHotel.ItemExperienceRegionRecent = se.searchHotel.ItemExperienceRegionRecent.slice(1,3);
          se.searchHotel.ItemExperienceRegionRecent.push(item);
        }else{//Nếu chưa quá 3 item thì push vào mảng
          se.searchHotel.ItemExperienceRegionRecent.push(item);
        }
      }else{
        //Xóa và push lại để được index của item vừa chọn lên đầu
        se.gf.removeItemInArray(se.searchHotel.ItemExperienceRegionRecent, item);
        se.searchHotel.ItemExperienceRegionRecent.push(item);
      }
      
    }else{//Chưa có item nào thì push vào mảng
      se.searchHotel.ItemExperienceRegionRecent.push(item);
    }
    se.hasChoiceRegion = true;
    let textsearch = item.name;
    if(textsearch.indexOf("TP.")){
      textsearch = textsearch.replace("TP.",'').trim();
    }
    se.textSearchRegion = textsearch;
    //se.hasload = false;
    //se.navCtrl.back();
  }

  selectRegion(item){
    var se = this;
    se.searchHotel.inputExperienceRegionCode= item.regionCode;
    se.searchHotel.inputExperienceRegionName= item.regionName;
    se.searchHotel.inputExperienceText = item.name && !item.hotelName && !item.placeId ? item.name : item.hotelName;
    se.searchHotel.inputExperienceItem = item;
    if(se.searchHotel.ItemExperienceRegionRecent && se.searchHotel.ItemExperienceRegionRecent.length >0){
      //Check khác id thì clear localcheckfilter
      var len = se.searchHotel.ItemExperienceRegionRecent.length;
      var itemRecentPrevious =  se.searchHotel.ItemExperienceRegionRecent[len -1];
      if(itemRecentPrevious && itemRecentPrevious.id != item.id){
        se.searchHotel.ef_arrlocalnamecheck =[];
      }
      if(!se.gf.checkExistsItemInArray(se.searchHotel.ItemExperienceRegionRecent,item,'experiencesearch')){
        //Trên 3 item thì lấy 2 item gần nhất và push thêm item được click
        if(se.searchHotel.ItemExperienceRegionRecent.length >2){
          se.searchHotel.ItemExperienceRegionRecent = se.searchHotel.ItemExperienceRegionRecent.slice(1,3);
          se.searchHotel.ItemExperienceRegionRecent.push(item);
        }else{//Nếu chưa quá 3 item thì push vào mảng
          se.searchHotel.ItemExperienceRegionRecent.push(item);
        }
      }else{
        //Xóa và push lại để được index của item vừa chọn lên đầu
        se.gf.removeItemInArray(se.searchHotel.ItemExperienceRegionRecent, item);
        se.searchHotel.ItemExperienceRegionRecent.push(item);
      }
      
    }else{//Chưa có item nào thì push vào mảng
      se.searchHotel.ItemExperienceRegionRecent.push(item);
    }
    se.hasChoiceRegion = true;
    let textsearch = item.name && !item.hotelName && !item.placeId ? item.name : item.hotelName;
    if(textsearch.indexOf("TP.")){
      textsearch = textsearch.replace("TP.",'').trim();
    }
    se.textSearchRegion = textsearch;
  }

  itemclick(item) {
    var se = this;
    if(!item.placeId){
      se.searchHotel.inputExperienceRegionCode=  item.regionCode ;
    }
    if(item.regionName){
      se.searchHotel.inputExperienceRegionName = item.regionName;
    }else{
      se.searchHotel.inputExperienceRegionName = "";
    }
   
    se.searchHotel.inputExperienceText = item.placeId ? item.name : (item.hotelName ? item.hotelName : item.name);
    if(se.searchHotel.inputExperienceRegionName && !item.placeId && se.searchHotel.inputExperienceText.indexOf(se.searchHotel.inputExperienceRegionName) == -1){
      se.searchHotel.inputExperienceText += " | " + se.searchHotel.inputExperienceRegionName;
    }
    
    se.searchHotel.inputExperienceItem = item;
    if(se.searchHotel.ItemExperienceRegionRecent && se.searchHotel.ItemExperienceRegionRecent.length >0){
      //Check khác id thì clear localcheckfilter
      var len = se.searchHotel.ItemExperienceRegionRecent.length;
      var itemRecentPrevious =  se.searchHotel.ItemExperienceRegionRecent[len-1];
      if(itemRecentPrevious && itemRecentPrevious.id != item.id){
        se.searchHotel.ef_arrlocalnamecheck =[];
      }
      if(!se.gf.checkExistsItemInArray(se.searchHotel.ItemExperienceRegionRecent,item,'experiencesearch')){
        //Trên 3 item thì lấy 2 item gần nhất và push thêm item được click
        if(se.searchHotel.ItemExperienceRegionRecent.length >2){
          se.searchHotel.ItemExperienceRegionRecent = se.searchHotel.ItemExperienceRegionRecent.slice(1,3);
          se.searchHotel.ItemExperienceRegionRecent.push(item);
        }else{//Nếu chưa quá 3 item thì push vào mảng
          se.searchHotel.ItemExperienceRegionRecent.push(item);
        }
      }
      else{
        //Xóa và push lại để được index của item vừa chọn lên đầu
        se.gf.removeItemInArray(se.searchHotel.ItemExperienceRegionRecent, item);
        se.searchHotel.ItemExperienceRegionRecent.push(item);
      }
    }else{//Chưa có item nào thì push vào mảng
      se.searchHotel.ItemExperienceRegionRecent.push(item);
    }
    se.textSearchPlace = item.name;
    se.navCtrl.back();
  }

  getDeviceLocation(){
    var se = this;
    se.searchHotel.inputExperienceItem = null;
    if(se.searchHotel.deviceLocation.regionName && se.searchHotel.deviceLocation.regioncode){
      se.textSearchRegion = se.searchHotel.inputExperienceRegionName ? se.searchHotel.inputExperienceRegionName : '';
      se.hasChoiceRegion = true;
      se.inputPlace.setFocus();
    }else{
      se.getLocationCoordinates();
    }
    //se.navCtrl.back();
  }

  getLocationCoordinates() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.getCityNameByLatLng(resp.coords.latitude,resp.coords.longitude);
    }).catch((error) => {
    })
  }

  getCityNameByLatLng(lat, lng) {
    var se = this;
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lat, lng, options)
    .then(
      (result: NativeGeocoderResult[]) => {
        var cityName = result[0].administrativeArea;
        se.textSearchRegion = cityName;
        se.hasChoiceRegion = true;
        se.inputPlace.setFocus();
      }
    )
    .catch((error: any) => 
    {
    });
    
  }

  /**
   * Tính khoảng cách giữa các điểm so với vị trí hiện tại
   * @rest: item cần sort
   * @sortColumn: tên cột dữ liệu sort
   * @itemDest: item lấy làm mốc để sort
   */
  calculateDistanceMarker(rest:any, sortColumn){
    var se = this;
    if(!rest.latitude || !rest.longitude){
      rest[sortColumn] = 99999;
    }else{
      if(sortColumn == 'totalDistance'){
        if(se.searchHotel.deviceLocation.latitude){
          rest[sortColumn] = (Math.round(L.latLng(se.searchHotel.deviceLocation.latitude, se.searchHotel.deviceLocation.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
        }else{
          rest[sortColumn] = 0;
        }
        
      }
    }
    
  }

  sortData(){
    var se = this;
    if (se.items && se.items.length > 0) {
      se.zone.run(() => se.items.sort(function (a, b) {
        let direction = -1;
        if(a.searchType <= b.searchType){
          if(!a['totalDistance']){
            return 1 * direction;
          }else if(!b['totalDistance']){
            return -1 * direction;
          }
          else{
            let a1 = a['totalDistance'].toString().replace('.','')*1;
            let b1 = b['totalDistance'].toString().replace('.','')*1;
            if (a1 < b1) {
              return 1 * direction;
            }
            else{
              return -1 * direction;
            }
          }
        }else{
          return 1 * direction;
        }
          
            
      }));
    }
  }

  orderByPlace(){
    var se = this;
    if(se.items && se.items.length>0){
      se.items.forEach(element => {
        if(element.show && !se.gf.checkExistsItemInArray(se.itemsDisplay, element, 'experiencesearch')){
          se.itemsDisplay.push(element);
        }
      });

      if(se.itemsDisplay && se.itemsDisplay.length>0){
        se.zone.run(() => se.itemsDisplay.sort(function (a, b) {
          let direction = -1;
          if(a.show || b.show){
            if(a.type < b.type){
              return 99 * direction;
            }else if(b.type < a.type){
              return 1 * direction;
            }
            else{
              let a1 = a['totalDistance'].toString().replace('.','')*1;
              let b1 = b['totalDistance'].toString().replace('.','')*1;
              if (a1 < b1) {
                return 1 * direction;
              }
              else{
                return -1 * direction;
              }
            }
          }
        })
        )
      }
    }
  }
  filterItemClick(id, name){
    var se = this;
    if(id && name){
      se.textSearchPlace = name;
        se.searchHotel.ef_arrhoteltypecheck = [];
        se.searchHotel.ef_arrhoteltypenamecheck= [];
        se.searchHotel.ef_arrhoteltypecheck.push(id);
        se.searchHotel.stringFilterName = name;
        se.searchHotel.ef_arrhoteltypenamecheck.push(name);
        if(!se.searchHotel.inputExperienceText){
          se.searchHotel.inputExperienceText = se.textSearchRegion;
        }
      se.navCtrl.back();
    }
  }

  search(isAbort){
    if(isAbort){
      this.navCtrl.back();
      return;
    }
    let listfilter = this.items.filter((item)=>{ return item.show && item.placeId });
    this.activityService.listExperienceSearch = listfilter;
    if(this.textSearchPlace){
      this.searchHotel.inputExperienceText = "";
      this.searchHotel.ef_arrdistancecheck = [];
      this.searchHotel.ef_arrhoteltypecheck = [];
      this.searchHotel.ef_arrstylecheck = [];
      this.searchHotel.ef_arrlocalcheck = [];
      this.searchHotel.ef_arrhouropencheck = [];
      this.searchHotel.ef_arrsubregioncheck=[];
      this.searchHotel.ef_arrsubregionnamecheck=[];
      this.searchHotel.ef_arrhoteltypenamecheck = []
      this.searchHotel.ef_arrdistancenamecheck = []
      this.searchHotel.ef_arrhouropennamecheck=[];
      this.searchHotel.ef_arrstylenamecheck=[];
      this.searchHotel.ef_arrlocalnamecheck=[];
      this.searchHotel.inputExperienceSearchPlaceText = this.textSearchPlace;
    }
    this.searchHotel.inputExperienceText = this.textSearchPlace ? this.textSearchPlace + (this.textSearchRegion ? ' | ' + this.textSearchRegion : '') : this.textSearchRegion;
    if(this.itemsRegion.length >0 || (this.itemsRegion.length ==0 && this.textSearchPlace) ){
      let itemR = this.itemsRegion.filter((itemRegion) =>{ return itemRegion.show});
      let itemP = this.items.filter((item) =>{ return item.show});
      if(itemR.length <=0 && this.searchHotel.deviceLocation.regionCode && !this.searchHotel.inputExperienceItem){
        this.searchHotel.inputExperienceRegionCode= this.searchHotel.deviceLocation.regionCode;
        this.searchHotel.inputExperienceRegionName= this.searchHotel.deviceLocation.regionName;
        this.searchHotel.inputExperienceItem = 1;
      }
      else if(itemP.length <=0 && this.textSearchPlace){
        this.showWarning('Không có trải nghiệm, vui lòng tìm kiếm trải nghiệm khác');
        return;
      }
    }
    if(!this.textSearchRegion && !this.textSearchPlace){
      this.showWarning('Không có trải nghiệm, vui lòng chọn địa điểm trải nghiệm.');
        return;
    }
    
    this.navCtrl.back();
  }
  public async showWarning(msg) { 

    let toast = await this.toastCtrl.create({
        message: msg,
        duration: 3000,
        position: "top"
    });
    
    toast.present();
  }

  clearSearchValue(){
    var se = this;
    se.searchHotel.arrhoteltypecheck = [];
    se.searchHotel.ef_arrhoteltypenamecheck = [];
    se.searchHotel.inputExperienceText = "";
    se.activityService.listExperienceSearch = null;
  }

  maptItemsRegion(event){
    var se = this;
    setTimeout(()=>{
      if( ( (event.currentTarget && event.currentTarget.value) || (event.target && event.target.value) ) && !se.hasChoiceRegion){
        let item = se.itemsRegion.filter((itemRegion) =>{ return itemRegion.show});
        if(item && item.length >0){
          se.nextPopular(item[0], 0);
        }
      }
      if(se.textSearchRegion){
        se.hasChoiceRegion = true;
        se.isSearchRegion = false;
      }
    },500)
    
  }
}
