import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../providers/auth-service';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import * as $ from 'jquery';
import * as moment from 'moment';
import { ActionSheetController, NavController, ModalController, Platform, IonContent, AlertController, IonSlides, IonInfiniteScroll, ToastController, LoadingController } from '@ionic/angular';
import { ExperienceFilterPage } from '../experiencefilter/experiencefilter.page';
import { OverlayEventDetail } from '@ionic/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, icon,latLng } from 'leaflet';
import * as L from 'leaflet';
//import 'leaflet-routing-machine';
import { map } from 'rxjs/operators';
import { ExperienceDetailPage } from '../experiencedetail/experiencedetail.page';
import { SearchHotel, DeviceLocation, ValueGlobal } from '../providers/book-service';
import { DrawerState } from 'ion-bottom-drawer';
//import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { google } from 'google-maps';
import { IonRouterOutlet } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  Marker,
  GoogleMapsAnimation,
  MyLocation,
} from '@ionic-native/google-maps';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';
import { PopoverController } from '@ionic/angular';

declare const H;
declare var google;
declare var mc;
//var MarkerWithLabel = require('markerwithlabel')(google.maps);
var popup, Popup;

@Component({
  selector: 'app-experiencesearch',
  templateUrl: './experiencesearch.page.html',
  styleUrls: ['./experiencesearch.page.scss'],
})
export class ExperienceSearchPage implements OnInit {
  shouldBounce = true;
  dockedHeight = 300;
  distanceTop = 90;
  drawerState = DrawerState.Docked;
  states = DrawerState;
  minimumHeight = 72;
  dashScrollDisabled = false;

  slideOpts = {
    slidesPerView: 1.1,
    spaceBetween: 8,
    centeredSlides: true
  };

  @ViewChild('scrollArea') content: IonContent;
  @ViewChild('myFloatSlider') slider: IonSlides;
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild('mapContainer') mapContainer: ElementRef;
  herePlatform;
  region = 'phú quốc';
  linkMap:any;
  canLoadMore: boolean=true;
  pageCount=0;
  pageSize=500;
  totalPage=0;
  listBlog=[];
  showloadmoreblog: boolean= true;
  arrbloglike=[];
  blog=[];
  map:any;
  googleMap: any;
  latlng: any;
  geocoder:any;
  listEmpty = [1,2,3,4,5];
  
  listRestaurant = [{ id: 1, name: 'BoatHouse Restaurant, Khu đô thị An Phú, Thao Dien, District 2, Ho Chi Minh City',lat: 10.8092809, long: 106.7355885 },
    { id: 2, name: 'Khu Phan Xích Long (quận Phú Nhuận)',lat: 10.7992354, long: 106.6848483 },
    { id: 3, name: 'Khu phố Tây Bùi Viện (quận 1)',lat: 10.7679735, long: 106.6934983 },
    { id: 4, name: 'Khu Vĩnh Viễn (quận 10)',lat: 10.7634253, long: 106.6642136 },
    { id: 5, name: 'Khu Hà Tôn Quyền (quận 5)',lat: 10.7567114, long: 106.6517515 },
    { id: 6, name: 'Khu Hàng Xanh (quận Bình Thạnh)',lat: 10.8045888, long: 106.7054792 }
  ]
  textsearch: string='';
  curLat: number;
  curLng: number;
  markers: L.Marker<any>[] = [];
  markersSelected: L.Marker<any>[] = [];
  routings: L.Routing.Control [] = [];
  listSuggests: any=[];
  regionCode: any;
  listSearch: any=[];
  listSearchOriginal: any=[];
  listSearchDisplay: any=[];
  itemclick: boolean = false;
  sort=1;//1 - ascending; -1- descending
  filterHourOpen=1;//1 - filter; -1 clear filter
  regionId: any;
  markersOriginal: L.Marker<any>[];
  curType: any;
  locationCoords: any;
  devicePlatform: any;
  recent: any;
  countfilter = 0;
  requestGPS: boolean = false;
  actionSheet: any;
  dataListLike: any;
  username: string;
  _infiniteScroll: any;
  routesHidden: any=[];
  sortvalue: any;
  markerhaschange: boolean;
  slidehaschange: boolean;
  loaddatadone: boolean=false;
  showloadmore = true;
  url ='';
  styles = {
    default: null,
    hide: [
      {
        featureType: 'poi.business',
        stylers: [{visibility: 'off'}]
      },
      {
        featureType: 'transit',
        elementType: 'labels.icon',
        stylers: [{visibility: 'off'}]
      }
    ]
  };
  
  itemsearchfocus: any;

  subRegionLocation={
    latitude: null,
    longitude: null,
    regioncode: ''
  };
  dataafterfilter: any = [];
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  currentItemSelect:any;
  curZoom: any;
  currentScrollPosition: number = 0;
  allowSortByCurrentLocation: boolean = true;
  hasCreateMarkerIcon: boolean = false;
  hasCreateMarkerText: boolean = false;
  currentPopover: HTMLIonPopoverElement;
  hasSortPlaceByCurrentLocation: boolean = false;
  countShowNotice = 0;
  
  constructor(private storage: Storage, private zone: NgZone,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private gf: GlobalFunction,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private platform: Platform,
    private geolocation: Geolocation,
    public searchhotel: SearchHotel,
    //private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private nativeGeocoder: NativeGeocoder,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    private toastCtrl: ToastController,
    private routerOutlet: IonRouterOutlet,
    private openNativeSettings: OpenNativeSettings,
    public popoverController: PopoverController,
    private deviceLocation: DeviceLocation,
    public activityService: ActivityService,
    public valueGlobal: ValueGlobal
    ) { 
      this.locationCoords = {
        latitude: "",
        longitude: "",
        accuracy: "",
        timestamp: "",
        address:""
      }

      // this.platform.ready().then(()=>{
      //   if(cordova){
      //     this.devicePlatform = cordova.platformId;
      //   }
      // })
      storage.get('username').then(username => {
        this.username = username;
       });
    }

  ngOnInit() {
   
  }

  goback(){
    var se = this;
    if(se.actionSheet){
      se.actionSheet.dismiss();
    }
    $('.float-search-white-bar').addClass('float-disable');
    $('.item-filter-top').addClass('float-disable');
    $('.float-search-top').addClass('float-disable');
    $('.float-search').addClass('float-disable');
    //se.gf.hiddenHeader();
    if(se.valueGlobal.backValue == 'tab3'){
      se.navCtrl.navigateBack('/app/tabs/tab3');
      se.valueGlobal.backValue = '';
    }else{
      se.navCtrl.navigateBack('/app/tabs/tab1');
    }
    
  }

  ionViewWillEnter(){
    var se=this;
    se.countShowNotice = 0;
    se.routerOutlet.swipeGesture = false;
    // if(se.activityService.abortSearch){
    //   se.loaddatadone = true;
    //   se.activityService.abortSearch = false;
    //   se.getTagByTypeName();
    //   se.buildTextSearch();
    //   return;
    // }
    if(!se.searchhotel.inputExperienceItem){
      
      let sfilter='',tags='';
      se.searchhotel.ef_arrlocalnamecheck = [];
      se.searchhotel.ef_arrlocalcheck = [];
      // se.getTagByTypeName();
      // se.buildTextSearch();
      se.getLocationCoordinates();
      // se.textsearch = se.buildStringFilterName(sfilter);
      // if(se.searchhotel.inputExperienceText && se.textsearch && se.textsearch.length>0){
      //   se.textsearch += ' | '+ se.searchhotel.inputExperienceText;
      // }else{
      //   se.textsearch = se.searchhotel.inputExperienceText ? se.searchhotel.inputExperienceText : '';
      // }
    }else{

      se.loadDataAfterSearchItem();
    }
   
    se.countfilter= 0;
    se.zone.run(()=>{
      if(se.searchhotel.ef_arrlocalcheck && se.searchhotel.ef_arrlocalcheck.length >0){
        se.countfilter += se.searchhotel.ef_arrlocalcheck.length;
      }
      if(se.searchhotel.ef_arrhoteltypecheck && se.searchhotel.ef_arrhoteltypecheck.length >0){
        se.countfilter += se.searchhotel.ef_arrhoteltypecheck.length;
      }
      // if(se.searchhotel.ef_arrstylecheck && se.searchhotel.ef_arrstylecheck.length >0){
      //   se.countfilter += se.searchhotel.ef_arrstylecheck.length;
      // }
      if(se.searchhotel.ef_arrhouropencheck && se.searchhotel.ef_arrhouropencheck.length >0){
        se.countfilter += se.searchhotel.ef_arrhouropencheck.length;
      }
      if(se.searchhotel.ef_arrdistancecheck && se.searchhotel.ef_arrdistancecheck.length >0){
        se.countfilter += se.searchhotel.ef_arrdistancecheck.length;
      }

      // if(se.searchhotel.stringFilterName && se.searchhotel.stringFilterName.length >0){
      //   se.textsearch = se.searchhotel.stringFilterName;
      // }
      
      
    })
    
    //se.getLocationCoordinates();
  }

  buildStringFilterName(sfilterName){
    var se = this;
    if(se.searchhotel.ef_arrlocalnamecheck.length >0){
      for(let i =0; i<se.searchhotel.ef_arrlocalnamecheck.length; i++){
        if(i==0){
          sfilterName += se.searchhotel.ef_arrlocalnamecheck[i];
        }else{
          sfilterName += ", " + se.searchhotel.ef_arrlocalnamecheck[i];
        }
      }
    }

    if(se.searchhotel.ef_arrsubregionnamecheck.length >0){
      for(let i =0; i<se.searchhotel.ef_arrsubregionnamecheck.length; i++){
        if(i==0){
          sfilterName += se.searchhotel.ef_arrsubregionnamecheck[i];
        }else{
          sfilterName += ", " + se.searchhotel.ef_arrsubregionnamecheck[i];
        }
      }
    }

    if(se.searchhotel.ef_arrhoteltypenamecheck.length >0){
      for(let i =0; i<se.searchhotel.ef_arrhoteltypenamecheck.length; i++){
        if(i==0){
            if(sfilterName.length>0){
              sfilterName += ' | '+ se.searchhotel.ef_arrhoteltypenamecheck[i];
            }else{
              sfilterName += se.searchhotel.ef_arrhoteltypenamecheck[i];
            }
          }else{
            sfilterName += ", " + se.searchhotel.ef_arrhoteltypenamecheck[i];
          }
        }
      }

      if(se.searchhotel.ef_arrhouropennamecheck.length >0){
        for(let i =0; i<se.searchhotel.ef_arrhouropennamecheck.length; i++){
          if(i==0){
              if(sfilterName.length>0){
                sfilterName += ' | '+ se.searchhotel.ef_arrhouropennamecheck[i];
              }else{
                sfilterName += se.searchhotel.ef_arrhouropennamecheck[i];
              }
            }else{
              sfilterName += ", " + se.searchhotel.ef_arrhouropennamecheck[i];
            }
          }
        }

        if(se.searchhotel.ef_arrdistancenamecheck.length >0){
          for(let i =0; i<se.searchhotel.ef_arrdistancenamecheck.length; i++){
            if(i==0){
                if(sfilterName.length>0){
                  sfilterName += ' | '+ se.searchhotel.ef_arrdistancenamecheck[i];
                }else{
                  sfilterName += se.searchhotel.ef_arrdistancenamecheck[i];
                }
              }else{
                sfilterName += ", " + se.searchhotel.ef_arrdistancenamecheck[i];
              }
            }
          }

          if(se.searchhotel.ef_arrstylenamecheck.length >0){
            for(let i =0; i<se.searchhotel.ef_arrstylenamecheck.length; i++){
              if(i==0){
                  if(sfilterName.length>0){
                    sfilterName += ' | '+ se.searchhotel.ef_arrstylenamecheck[i];
                  }else{
                    sfilterName += se.searchhotel.ef_arrstylenamecheck[i];
                  }
                }else{
                  sfilterName += ", " + se.searchhotel.ef_arrstylenamecheck[i];
                }
              }
            }

    return sfilterName;
  }

  loadDataAfterSearchItem(){
    var se = this;
      se.pageCount =0;
      se.totalPage = 0;
      se.textsearch='';
      se.listSearchOriginal=[];
      se.listSearch=[];
      se.listSearchDisplay=[];
      se.loaddatadone = false;
      se.sortvalue = null;
      se.filterHourOpen = 1;
      se.content.scrollToTop(50);
      //Chọn item region => fill lại data theo region code
      //chọn item place => fill data theo regionid
      //if(se.searchhotel.inputExperienceRegionCode){
        var tags ='';
        // if(se.searchhotel.experiencesearchTagsId){
        //   tags = se.searchhotel.experiencesearchTagsId;
        // }
        se.getTagByTypeName();
        tags += se.buildFilter();
        se.buildTextSearch();
        if(se.searchhotel.inputExperienceItem){
          if(se.searchhotel.inputExperienceItem.tagsJson && se.searchhotel.inputExperienceItem.tagsJson.length >0){
            let tag = se.searchhotel.inputExperienceItem.tagsJson[0].id;
            if(tags.indexOf(tag) == -1){
              se.searchhotel.ef_arrhoteltypecheck.push(tag);
              if(tags.length >0){
                tags+=','+tag;
              }else{
                tags+=tag;
              }
            }
          }
          if(se.searchhotel.inputExperienceItem.regionCode){
            se.regionCode = se.searchhotel.inputExperienceItem.regionCode;
          }
          else if(se.searchhotel.inputExperienceItem.code){
            se.regionCode = se.searchhotel.inputExperienceItem.code;
          }
          // if(!se.searchhotel.inputExperienceItem.placeId){
          //   se.regionCode = se.searchhotel.inputExperienceRegionCode;
          // }else{
          //   se.regionCode = se.searchhotel.inputExperienceItem.regionCode;
          // }

          let urlApi = '';
          
          if(se.regionCode){
            if(se.regionCode == 'ho-chi-minh' || se.regionCode == 'Thanh-Pho-Ho-Chi-Minh' || se.regionCode == 'Ho-Chi-Minh-City'){
              se.regionCode = 'ho-chi-minh';
            }
            if(se.regionCode == 'quang-nam'){
              se.regionCode = 'hoi-an';
            }
            if(se.regionCode == 'vinh-ha-long'){
              se.regionCode = 'ha-long';
            }
            se.replaceRegioncode();
            if(tags != '' && tags != ','){
              se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionCodes='+se.regionCode+'&Tags='+tags;
              urlApi = se.url +'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
            }else{
              se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionCodes='+se.regionCode;
              urlApi = se.url +'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
            }
            
          }else if(!se.loaddatadone){
            if(tags != '' && tags != ','){
              se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionId='+se.searchhotel.inputExperienceItem.regionId+'&Tags='+tags;
              urlApi = se.url +'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
            }else{
              se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionId='+se.searchhotel.inputExperienceItem.regionId;
              urlApi = se.url +'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
            }
          }

          //Tạm rem code phần map subregion vào filter
          // if(se.searchhotel.inputExperienceItem.subRegionId){
          //   urlApi = urlApi + '&subRegions='+se.searchhotel.inputExperienceItem.subRegionId;
          //   if((se.searchhotel.ef_arrsubregioncheck.length >0 && !se.gf.checkExistsIndex(se.searchhotel.ef_arrsubregioncheck,se.searchhotel.inputExperienceItem.subRegionId)
          //   || se.searchhotel.ef_arrsubregioncheck.length == 0)
          //   ){
            
          //   se.searchhotel.ef_arrsubregioncheck.push(se.searchhotel.inputExperienceItem.subRegionId);
          //   se.searchhotel.ef_arrsubregionnamecheck.push(se.searchhotel.inputExperienceItem.name);
          // }
          // }
            
            se.gf.RequestApi('GET',urlApi,{},{},'ExperienceSearch', 'loadDataAfterSearchItem').then((data:any)=>{
            if(data && data.data.length >0){
            se.combineDataPlace(se.regionCode,data.data).then((datacombine)=>{
              //data.data = datacombine;
              se.locationCoords.latitude = se.searchhotel.inputExperienceItem.latitude ? se.searchhotel.inputExperienceItem.latitude : data.data[0].latitude;
                se.locationCoords.longitude = se.searchhotel.inputExperienceItem.longitude ? se.searchhotel.inputExperienceItem.longitude: data.data[0].longitude;
                  se.calculateDistanceMapData(datacombine).then((data)=>{ 
                    data = se.combineFilterAndCount(data);
                    datacombine = data;
                    se.requestGPS = true;
                    if(data && data.length ==0){
                      se.loaddatadone = true;
                      se.clearMarkerAndRouting();
                      se.initEmptyMap();
                      se.reCountFilter();
                      se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
                      return;
                    }

                    //Thêm regionName nếu chưa có trên textsearch
                    let rn = data[0].regionName;
                    if(se.textsearch.indexOf(rn) == -1 && !se.searchhotel.inputExperienceRegionName){
                        if(data[0].address){
                          let arrAddress = data[0].address.split(',');
                          let rn = arrAddress[arrAddress.length -2];
                          if(se.textsearch.indexOf(rn) == -1 && !se.searchhotel.inputExperienceRegionName){
                            if(se.textsearch.length >0){
                              se.textsearch += ' | '+ rn.trimLeft();
                            }else{
                              se.textsearch += rn.trimLeft() + " (" +data.length+ ")";
                            }
                            
                        }
                      }
                    }

                    if( (se.textsearch.length >0 && !se.searchhotel.inputExperienceItem.latitude) || (se.textsearch.indexOf('(')== -1 )){
                      se.textsearch += " (" + datacombine.length + ")";
                    }
              
              //vào trang chi tiết nếu chọn 1 địa điểm ko phải vùng
              
              if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId){
                var itemmap = datacombine.filter((item:any)=>{
                  return item.id == se.searchhotel.inputExperienceItem.placeId;
                })
                if(itemmap && itemmap.length>0){
                  se.itemsearchfocus = itemmap[0];
                  
                  setTimeout(()=>{
                    if(se.itemsearchfocus){
                      var idx=-1;
                      idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == se.itemsearchfocus.id});
                        if(idx != -1 && idx != null){
                          se.slider.slideTo(idx);
                        }
                      se.itemsearchfocus = null;
                    }
                  },300)
                }
              }
              // else if(se.textsearch.length >0 && !se.searchhotel.inputExperienceItem.latitude){
              //     se.textsearch += " (" + datacombine.length + ")";
              // }
                se.dockedHeight = 300;
                se.loaddatadone = true;
                se.setDockState();
                se.zone.run(()=>{
                  se.totalPage = Math.round(datacombine.length/5);
                })
                
                se.storage.get('auth_token').then(auth_token => {
                  if (auth_token) {
                      var text = "Bearer " + auth_token;
                      let urlLike = C.urls.baseUrl.urlMobile + '/api/Data/GetPlaceUserLike';
                      se.gf.RequestApi('GET', urlLike, {authorization: text}, {}, 'ExperienceSearch','GetPlaceUserLike').then((datalike:any) =>{
                        if(datalike && datalike.length >0){
                          se.dataListLike = datalike;
                          datacombine.forEach(element => {
                            element.liked = se.checkItemLiked(element.id) ? true: false;
                          });
                          
                          se.loadDataMap(datacombine);
                        }else{
                          se.loadDataMap(datacombine);
                        }
                      })
                    }else{
                      se.loadDataMap(datacombine);
                    }
                })
              }) 
            });
            }else{
              if(se.regionCode == 'vinh-ha-long'){
                se.regionCode = 'ha-long';
              }
              if(!se.searchhotel.inputExperienceItem.latitude){
              //Nếu item search theo item place thì lấy theo vị trí place
              //Nếu search theo vùng thì lấy vị trí theo place đầu tiên của list place theo vùng
              $.get('https://nominatim.openstreetmap.org/search?format=json&q='+se.regionCode, function(data){
                  if(data && data.length>0){
                    if(se.regionCode == 'vinh-ha-long'){
                      se.locationCoords.latitude = data[1].lat;
                      se.locationCoords.longitude = data[1].lon;
                    }else{
                      se.locationCoords.latitude = data[0].lat;
                      se.locationCoords.longitude = data[0].lon;
                    }
                    se.clearMarkerAndRouting();
                    se.initEmptyMap();
                    if(se.deviceLocation.latitude && se.deviceLocation.longitude && se.deviceLocation.regioncode == se.regionCode){
                      se.bindGPSLocationMarker()
                    }else{
                      se.bindCurrentLocationMarker();
                    }
                    se.setBottomState();
                    se.loaddatadone = true;
                    se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
                  }
                })
              }else{
                se.locationCoords.latitude = se.searchhotel.inputExperienceItem.latitude ? se.searchhotel.inputExperienceItem.latitude : data[0].latitude;
                se.locationCoords.longitude = se.searchhotel.inputExperienceItem.longitude ? se.searchhotel.inputExperienceItem.longitude: data[0].longitude;
                se.clearMarkerAndRouting();
                se.initEmptyMap();
                if(se.deviceLocation.latitude && se.deviceLocation.longitude && se.deviceLocation.regioncode == se.regionCode){
                  se.bindGPSLocationMarker()
                }else{
                  se.bindCurrentLocationMarker();
                }
                se.setBottomState();
                se.loaddatadone = true;
                se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
              }

              se.reCountFilter();
            }
          })
        }else{
          se.getLocationCoordinates();
        }
  }

  //Get current coordinates of device
  getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude; 
      this.locationCoords.accuracy = resp.coords.accuracy; 

      this.deviceLocation.latitude = resp.coords.latitude;
      this.deviceLocation.longitude = resp.coords.longitude;
      
      this.getGeoencoder(resp.coords.latitude,resp.coords.longitude);
     }).catch((error) => {
       alert('Error getting location'+ JSON.stringify(error));
     });
  }

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, {
      useLocale: true,
      maxResults: 5
    })
    .then((result: any) => {
      this.locationCoords.address = this.generateAddress(result[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }

  //Return Comma saperated address
  generateAddress(addressObj){
      let obj = [];
      let address = "";
      for (let key in addressObj) {
        obj.push(addressObj[key]);
      }
      obj.reverse();
      for (let val in obj) {
        if(obj[val].length)
        address += obj[val]+', ';
      }
    return address.slice(0, -2);
  }

  ionViewWillLeave(){
    var se = this;
    se.textsearch = '';
    se.regionCode='';
    se.countfilter = 0;
    se.loaddatadone=false;
    se.dockedHeight=0;
    se.routerOutlet.swipeGesture = true;
    se.activityService.listExperienceSearch = [];
  }

  getListSuggestByRegionCode(regionCode,tags){
    var se = this,
    urlSuggest='';
    tags='';
    se.pageCount = 0;
    //se.content.scrollToTop(200);
    $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
    if(regionCode){
      tags += se.buildFilter();
      se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionCodes='+regionCode;
      urlSuggest =  se.url + (tags ? '&Tags='+tags : '')+'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
      se.gf.RequestApi('GET',urlSuggest,{},{},'ExperienceSearch', 'getListSuggestByRegionCode').then((data:any)=>{
        if(data && data.data.length >0){
          se.combineDataPlace(regionCode,data.data).then((datacombine)=>{
            if( !(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId) ){
              se.calculateDistanceMapData(datacombine).then((data)=>{
                if(data && data.length ==0){
                  se.loaddatadone = true;
                  se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
                  return;
                }
                 data = se.combineFilterAndCount(data);
                 datacombine = data;

                 se.textsearch += " (" + datacombine.length + ")";
                se.zone.run(()=>{
                  se.loaddatadone = true;
                  se.totalPage = Math.round(datacombine.length/5);
                })
                se.storage.get('auth_token').then(auth_token => {
                  if (auth_token) {
                      var text = "Bearer " + auth_token;
                      let urlLike = C.urls.baseUrl.urlMobile + '/api/Data/GetPlaceUserLike';
                      se.gf.RequestApi('GET', urlLike, {authorization: text}, {}, 'ExperienceSearch','GetPlaceUserLike').then((datalike:any) =>{
                        if(datalike && datalike.length >0){
                          se.dataListLike = datalike;
                          datacombine.forEach(element => {
                            element.liked = se.checkItemLiked(element.id) ? true: false;
                          });
                          se.bindDataListSuggest(datacombine, false);
                        }else{
                          se.bindDataListSuggest(datacombine, false);
                        }
                      })
                    }else{
                      se.bindDataListSuggest(datacombine, false);
                    }
                })
                });
            }
            
          
          }) 
          
        }else{
          se.loaddatadone = true;
          se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
        }
        
      })
    }
  }

  bindDataListSuggest(data, clearDisplayList){
    var se = this;
    se.listSearch = data;
    se.listSearchOriginal = data;
    //reset allowsortlocation
    se.allowSortByCurrentLocation = true;
    if(clearDisplayList){
      se.listSearchDisplay = [];
    }
    se.sortDataNearBy(data).then((data:any)=>{
      se.bindMarker(data,'');
    });
    
  }

  async sortDataNearBy(data){
    var se = this;
    return new Promise((resolve,reject)=>{
      let sortColumn = 'totalDistance';
      data.forEach(rest =>{
        se.calculateDistanceMarker(rest,sortColumn,'');
        se.bindShortAdress(rest);
      })
  
      setTimeout(()=>{
        if (data && data.length > 0) {
          se.zone.run(() => data.sort(function (a, b) {
            let direction = -1;
              if(a[sortColumn] && b[sortColumn] && a[sortColumn]*1 < b[sortColumn]*1){
                return 1 * direction;
              }else{
                return -1 * direction;
              }
          }));
        }
      },100)

      setTimeout(()=>{
        resolve(data);
      },300)
    })
  }

  initEmptyMap(){
    var se = this;
   
    var options = { 
      zoom: 13, 
      center: new google.maps.LatLng(se.locationCoords.latitude,se.locationCoords.longitude), 
      disableDefaultUI: true,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP 
      }; 
      
      // Creating the map 
      se.map = new google.maps.Map(se.mapContainer.nativeElement, options); 

      $('.gm-svpc').css('display', 'none');
      $('.gmnoprint').css('display', 'none');
      //hide default map element
      se.map.setOptions({styles: se.styles['hide']});
      se.clearRoute();
  }

  initMap(mapPosition){
    var se = this;

    var options = { 
      zoom: 13, 
      center: mapPosition ? new google.maps.LatLng(mapPosition.latitude,mapPosition.longitude) : new google.maps.LatLng(se.locationCoords.latitude,se.locationCoords.longitude), 
      disableDefaultUI: true,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP 
      }; 
      
      // Creating the map 
      se.map = new google.maps.Map(se.mapContainer.nativeElement, options); 
      se.curZoom = se.map.getZoom();
      $('.gm-svpc').css('display', 'none');
      $('.gmnoprint').css('display', 'none');
      //hide default map element
      se.map.setOptions({styles: se.styles['hide']});
      //xóa chỉ đường
      se.clearRoute();
      //Xóa place icon/place text khi render lại map
      se.clearMarkerAndRouting();
      if(se.deviceLocation.latitude && se.deviceLocation.longitude){
        se.bindGPSLocationMarker()
      }
      if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.latitude){
        se.bindCurrentLocationMarker(); 
      }
      

      google.maps.event.addListener(se.map, 'dragend', function() { 
        //se.handlerMapDraging(se.map.center.lat(),se.map.center.lng());
        if (se.map.getZoom() >= 16) {
          $('.div-zoom-text').css('display', 'none');
          }else{
            $('.div-zoom-text').css('display', 'block');
          }
          se.allowSortByCurrentLocation = true;
          se.hasSortPlaceByCurrentLocation = false;
      });
      //Bắt sự kiện zoom trên bản đồ để hiển thị place icon hoặc hiển thị place text
      se.map.addListener('zoom_changed', function() {
        //if(!(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId)){
          if(se.map.getZoom() >= 16){
            $('.div-zoom-text').css('display', 'none');
          }
          else{
            $('.div-zoom-text').css('display', 'block');
          }
          se.handlerMapDraging(se.map.center.lat(),se.map.center.lng());
          se.curZoom = se.map.getZoom();
        //}
        
      })
      se.countShowNotice = 0;
  }

  animateMap(isShow){
    if(isShow){
      $('.content-search').removeClass('cls-hidden').addClass('cls-visible');
      $('.list-search-item').css('display', 'none');
      $('.item-filter').css('display', 'none');
    }else{
      $('.content-search').removeClass('cls-visible').addClass('cls-hidden');
      
      $('.item-filter').css('display', 'block');
      $('.list-search-item').css('display', 'block');
    }
  }

  bindMarker(data,type){
    var se = this;
    se.zone.run(()=>{
      //se.listSearch = data;
      let index = 0;
      se.listSearch.forEach(element => {
          if(!se.gf.checkExistsItemInArray(se.listSearchDisplay, element, 'experiencesearch') && index < 5){
            if(element.workingHours.length >0){
              element.workingHoursDisplay = '';
              //element.workingHoursDisplay = element.workingHours[0].name + ' | '+ element.workingHours[0].timeFrom + '-'+ element.workingHours[0].timeTo;
              element.workingHours.forEach(elementsub => {
                if(!element.workingHoursDisplay){
                  element.workingHoursDisplay = elementsub.name + ' | '+ elementsub.timeFrom + '-'+ elementsub.timeTo;
                }else{
                  element.workingHoursDisplay += " , " + elementsub.name + ' | '+ elementsub.timeFrom + '-'+ elementsub.timeTo;
                }
              });
            }
              se.listSearchDisplay.push(element);
              //index++;
          }
        });

        se.listSearchDisplay.forEach(rest =>{
          se.calculateDistanceMarker(rest,'totalDistance', null);
          se.bindShortAdress(rest);
        })

        setTimeout(()=>{
          //se.loaddatadone = true;
          se.listSearchDisplay.forEach(element => {
            //se.addMarkersToMap(element);
            // if(se.map.getZoom() == 13 || se.map.getZoom() == 15){
            //   se.createMarkerIconOnly(element, se.listSearchDisplay[0]);
            // }else if(se.map.getZoom() >= 16){
            //   se.addMarkersToMap(element);
            // }
            if (se.curZoom < se.map.getZoom() &&  se.map.getZoom() == 16) {
              se.addMarkersToMap(element);
            }else if (se.map.getZoom() == 13 || (se.curZoom > se.map.getZoom() && se.map.getZoom() == 15 )){
              se.createMarkerIconOnly(element, se.listSearchDisplay[0]);
            }else if(se.map.getZoom() == se.curZoom){
              if(se.map.getZoom() >= 16){
                se.addMarkersToMap(element);
              }else{
                se.createMarkerIconOnly(element, se.listSearchDisplay[0]);
              }
            }
          })

          se.markerIconClick(se.listSearchDisplay[0], se.listSearchDisplay[0], se.map, false);
        },50)
    })
    if(se.sortvalue && se.sortvalue != 5){
      setTimeout(()=>{
        se.sortData(se.sortvalue, true);
      },150)
    }
    se.loaddatadone = true;
  }

  addMarkersToMap(item){
    var se = this;
    if(item && item.id){
      if($('#'+item.id).length >0){
        $('#'+item.id)[0]['style']['display']= 'block';
        $('#'+item.id).click((event)=>{
          var idx=-1;
          idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == item.id});
            if(idx != -1 && idx != null){
              se.slider.slideTo(idx);
            }

            // setTimeout(()=>{
            //   se.addDirectionToMap(item);
            // },100)
        })
      }
      
      Popup = se.createPopupClass();
      popup = new Popup(
          new google.maps.LatLng(item.latitude, item.longitude),
          document.getElementById(item.id));
      popup.setMap(se.map);
    }
    
  }

  addInfoWindow(marker, item) {
    var se = this;
    // google.maps.event.addListener(marker, 'click', () => {
    //   se.markerClick(marker, item, se.map, false);
    // });
    google.maps.event.addListener(marker, 'click', () => {
      se.markerIconClick(marker, item, se.map, false);
    });
  }

  bindMarkerPaging(data,type){
    var se = this;
    se.canLoadMore = true;
    
    if(se.sortvalue && type != 'clickdooropen'){
      se.sortvalue = null;
      se.zone.run(()=>{
        $('.col-item-search-2').removeClass('cls-sort-filter');
      })
    }
    if(!se.sortvalue){
      se.zone.run(()=>{
        $('.col-item-search-2').removeClass('cls-sort-filter');
      })
    }
    se.zone.run(()=>{
      data.forEach(item => {
        if(item.workingHours.length >0){
          item.workingHoursDisplay = '';
          item.workingHours.forEach(element => {
            if(!item.workingHoursDisplay){
              item.workingHoursDisplay = element.name + ' | '+ element.timeFrom + '-'+ element.timeTo;
            }else{
              item.workingHoursDisplay += " , " + element.name + ' | '+ element.timeFrom + '-'+ element.timeTo;
            }
          });
          
        }

        if(!se.gf.checkExistsItemInArray(se.listSearchDisplay,item,'experiencesearch')){
          se.listSearchDisplay.push(item);
        }
      });
      se.showloadmore =  false;
      se.listSearchDisplay.forEach(rest =>{
        se.calculateDistanceMarker(rest,'totalDistance', null);
        se.bindShortAdress(rest);
      })
      setTimeout(()=>{
        se.loaddatadone = true;
        se.listSearchDisplay.forEach(item => {
          
          //se.addMarkersToMap(item);
          if(se.map.getZoom() < 16){
            se.createMarkerIconOnly(item, se.listSearchDisplay[0]);
          }else if(se.map.getZoom() >= 16){
            se.addMarkersToMap(item);
          }
        });
      },50)

      // setTimeout(()=>{
      //   if(se.sortvalue){
      //     se.zone.run(()=>{
      //       se.sortData(se.sortvalue);
      //     })
      //   }
      // },150)
      
      if(se._infiniteScroll){
        se._infiniteScroll.target.complete();
      }
    })
  }
  bindShortAdress(item){
    var se = this;
    if(item.address && item.address.indexOf(',') != -1){
      var arrAdress = item.address.split(',');
      if(arrAdress.length >= 1){
        let shortAdress = arrAdress[0] + ', ' + arrAdress[1];
        item.shortAdress = shortAdress;
      }
    }
  }
  /**
   * Sắp xếp vị trí marker theo tên column sort, item làm mốc
   * @sortColumn: tên cột dữ liệu sort
   * @itemDest: item lấy làm mốc để sort
   */
  sortMarkerByDistance(sortColumn, itemDest){
    var se = this;
    se.listSearch.forEach(rest =>{
      se.calculateDistanceMarker(rest,sortColumn, itemDest);
      se.bindShortAdress(rest);
    })

    setTimeout(()=>{
      if (se.listSearchDisplay && se.listSearchDisplay.length > 0) {
        se.zone.run(() => se.listSearch.sort(function (a, b) {
          let direction = -1;
            if(a[sortColumn] && b[sortColumn] && a[sortColumn]*1 < b[sortColumn]*1){
              return 1 * direction;
            }else{
              return -1 * direction;
            }
        }));
      }
      //Xóa luôn route vẽ trên bản đồ vì chỉ để tính distance
      if(se.routesHidden && se.routesHidden.length >0){
        se.routesHidden.forEach( (element :any) => {
          se.map.removeControl(element);
        });
      }
    },100)
  }
  /**
   * Tính khoảng cách giữa các điểm so với vị trí hiện tại
   * @rest: item cần sort
   * @sortColumn: tên cột dữ liệu sort
   * @itemDest: item lấy làm mốc để sort
   */
  calculateDistanceMarker(rest:any, sortColumn, itemDest){
    var se = this;
    if(!rest.latitude || !rest.longitude){
      rest[sortColumn] =0;
    }else{
      if(sortColumn == 'totalDistance'){
        if(se.deviceLocation.latitude && se.deviceLocation.longitude && !se.searchhotel.inputExperienceItem){
          let distancekm = (Math.round(L.latLng(se.deviceLocation.latitude, se.deviceLocation.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000);
          if(distancekm < 50){
            rest[sortColumn] = (Math.round(L.latLng(se.deviceLocation.latitude, se.deviceLocation.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
          }else{
            rest[sortColumn] = (Math.round(L.latLng(se.locationCoords.latitude, se.locationCoords.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
          }
        }else{
          rest[sortColumn] = (Math.round(L.latLng(se.locationCoords.latitude, se.locationCoords.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
        }
        
      }else if(sortColumn == 'totalDistanceNearBy' && itemDest){
        if(itemDest.id == rest.id){
          rest[sortColumn] = 9999999;
        }else{
          rest[sortColumn] = (Math.round(L.latLng(itemDest.latitude, itemDest.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
        }
      }
    }
    
  }

  /**
   * Add marker vị trí hiện tại vào map
   */
  bindCurrentLocationMarker(){
    var se = this;
        var customMarkerIcon:any= {         
          //url: './assets/img_musttry/ic_pinmylocation.svg',
          url: './assets/img_musttry/placeholder_new.svg',
          scaledSize: new google.maps.Size(44, 44),
          labelOrigin: new google.maps.Point(12, 48)
        }
        const position = new google.maps.LatLng(se.locationCoords.latitude,se.locationCoords.longitude);
        //const marker = new google.maps.Marker({ position, icon: customMarkerIcon, zIndex: 888 });
        var marker;
        if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.type){
          marker = new google.maps.Marker({ position, icon: customMarkerIcon, zIndex: 888,label: { text: (se.searchhotel.inputExperienceItem.type == 1 || se.searchhotel.inputExperienceItem.type == 2) ? se.searchhotel.inputExperienceItem.name : se.searchhotel.inputExperienceItem.hotelName, fontSize: '12px',color: '#e52822' }, class: 'icon-placeholder'});
        }else{
          marker = new google.maps.Marker({ position, icon: customMarkerIcon, zIndex: 888 });
        }
        marker.setMap(se.map);
        if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId){
          se.markers.push(marker);
        }
  }

  /**
   * Add marker vị trí hiện tại vào map
   */
  bindGPSLocationMarker(){
    var se = this;
        var gpsMarker:any= {         
          url: './assets/img_musttry/ic_mylocation.svg',
          scaledSize: new google.maps.Size(44, 44)    
        }
        const position = new google.maps.LatLng(se.deviceLocation.latitude,se.deviceLocation.longitude);
        var marker;
        marker = new google.maps.Marker({ position, icon: gpsMarker, zIndex: 888 });
        // if(se.searchhotel.inputExperienceItem){
        //   marker = new google.maps.Marker({ position, icon: gpsMarker, zIndex: 888,label: { text: (se.searchhotel.inputExperienceItem.type == 1 || se.searchhotel.inputExperienceItem.type == 2)  ? se.searchhotel.inputExperienceItem.name : se.searchhotel.inputExperienceItem.hotelName, fontSize: '12px',color: '#848385' }, });
        // }else{
        //   marker = new google.maps.Marker({ position, icon: gpsMarker, zIndex: 888 });
        // }
        //const marker = new google.maps.Marker({ position, icon: gpsMarker, zIndex: 888,label: { text: 'A123' }, });
        marker.setMap(se.map);
  }

  markerIconClick(marker, rest, map, isslide){
    var se = this;
    se.currentItemSelect = rest;
    if(isslide){
      se.slidehaschange= true;
      se.markerhaschange= false;
    }else{
      se.slidehaschange= false;
      se.markerhaschange= true;
    }

    //Clear old marker 
    se.removeMarkerById(rest.id);
    //Create selected marker
    var markerNew:any = se.createNewMarkerById(marker, rest, isslide);

    if(se.currentScrollPosition >= 4 ){
      $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
    }else{
      $('.div-float-item-search').removeClass('float-disable').addClass('float-visible');
    }
    //Move slide theo marker được chọn
    if(isslide){
      se.content.scrollToTop(50);
      
    }
    
    var idx=-1;
    idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == rest.id});
      if(idx != -1 && idx != null && se.markerhaschange){
        se.slider.slideTo(idx);
    }
    

    //waypoints
    // if(!isslide){
    //   setTimeout(()=>{
    //     se.addDirectionToMap(rest);
    //   },100)
      
    // }
  }

  markerClick(marker, rest, map, isslide, allowscroll){
    var se = this;

    if(isslide){
      se.slidehaschange= true;
      se.markerhaschange= false;
    }else{
      se.slidehaschange= false;
      se.markerhaschange= true;
    }

    var position = new google.maps.LatLng(rest.latitude,rest.longitude);
    

    if($('.popup-selected').length >0 && $('.popup-selected').children().length >0){
      $('.popup-selected').children()[0].style.borderTop = 'solid 6px #003c71';
      $('.popup-selected').children()[0].style.marginTop = '3px';
      $('.popup-selected').parent()[0].style.borderTop = 'solid 6px #ffffff';
      
    }
    $('.popup-selected').removeClass('popup-selected');
   
    $('#'+marker.id).addClass('popup-selected');
      $('#'+marker.id).children()[0]['style']['display'] = 'block';
      $('#'+marker.id).children()[0].style.borderTop = 'solid 6px #ffffff';
      $('#'+marker.id).children()[0].style.marginTop = '1px';
      $('#'+marker.id).parent()[0].style.borderTop = 'solid 6px #003c71';
    
    if(se.currentScrollPosition >= 4 ){
      $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
    }else{
      $('.div-float-item-search').removeClass('float-disable').addClass('float-visible');
    }
    //Move slide theo marker được chọn
    
    if(isslide && allowscroll){
      se.map.setCenter(position);
      if(allowscroll){
        se.content.scrollToTop(50);
      }
      
      var idx=-1;
      idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == marker.id});
        if(idx != -1 && idx != null && se.markerhaschange){
          se.slider.slideTo(idx);
        }
      se.currentItemSelect = rest;
    }
    
    
    //waypoints
    //if(!isslide){
      // setTimeout(()=>{
      //   se.addDirectionToMap(rest);
      // },100)
    //}
    
  }

  /**
   * Tạo route chỉ đường giữa location của thiết bị/location điểm giữa của map với điểm được click trên bản đồ
   * @param itemDestination - item được click trên bản đồ
   */
  addDirectionToMap(itemDestination){
    var se = this;
    var first:any, second :any;
    let distancekm = 0;
    var shownotice = false;

    if(se.deviceLocation.latitude){
      distancekm = (Math.round(L.latLng(se.deviceLocation.latitude, se.deviceLocation.longitude).distanceTo(L.latLng(itemDestination.latitude, itemDestination.longitude)))/1000);
    }else{
      distancekm = (Math.round(L.latLng(se.locationCoords.latitude, se.locationCoords.longitude).distanceTo(L.latLng(itemDestination.latitude, itemDestination.longitude)))/1000);
    }
          //if(distancekm < 50){
    if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.latitude && !se.searchhotel.inputExperienceItem.placeId){
      let inputLat = Math.round(se.searchhotel.inputExperienceItem.latitude * 10000000)/10000000;
      if(distancekm < 50){
        if(se.deviceLocation.latitude && se.deviceLocation.longitude){
          se.geolocation.getCurrentPosition().then((resp) => {
            se.deviceLocation.latitude = resp.coords.latitude;
            se.deviceLocation.longitude = resp.coords.longitude;
            first = new google.maps.LatLng(se.deviceLocation.latitude, se.deviceLocation.longitude);
          })
          .catch(() =>{
            first = new google.maps.LatLng(se.deviceLocation.latitude, se.deviceLocation.longitude);
          })
          
        }else{
          if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.latitude){
            first = new google.maps.LatLng(se.searchhotel.inputExperienceItem.latitude, se.searchhotel.inputExperienceItem.longitude);
          }else{
            first = new google.maps.LatLng(se.map.center.lat(), se.map.center.lng());
            shownotice = true;
          }
          
          
        }
      }else{
        if(inputLat && itemDestination.latitude && inputLat != itemDestination.latitude){
          first = new google.maps.LatLng(se.locationCoords.latitude,se.locationCoords.longitude);
        }else{
          if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.latitude){
            first = new google.maps.LatLng(se.searchhotel.inputExperienceItem.latitude, se.searchhotel.inputExperienceItem.longitude);
          }else{
            first = new google.maps.LatLng(se.map.center.lat(), se.map.center.lng());
            shownotice = true;
          }
          
        }
      }
      
      
    }else{
      if(distancekm < 50){
        if(se.deviceLocation.latitude && se.deviceLocation.longitude){
          first = new google.maps.LatLng(se.deviceLocation.latitude, se.deviceLocation.longitude);
        }else{
          first = new google.maps.LatLng(se.map.center.lat(), se.map.center.lng());
          shownotice = true;
        }
        
      }else{
        first = new google.maps.LatLng(se.map.center.lat(), se.map.center.lng());
        shownotice = true;
      }
    }

    if(itemDestination && itemDestination.latitude && itemDestination.longitude){
      second = new google.maps.LatLng(itemDestination.latitude, itemDestination.longitude);
    }
    let d = (Math.round(L.latLng(first.lat(), first.lng()).distanceTo(L.latLng(itemDestination.latitude, itemDestination.longitude)))/100);
      if(d <1){
        se.showWarning('Vui lòng di chuyển bản đồ đến điểm bạn muốn xuất phát!');
        se.countShowNotice +=1;
      }
      
    var request = {
      origin: first,
      destination: second,
      waypoints: [{location: first, stopover: false},
          {location: second, stopover: false}],
      optimizeWaypoints: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    se.directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            se.directionsDisplay.setDirections(response);
            var route = response.routes[0];
            // var summaryPanel = document.getElementById("directions_panel");
            // summaryPanel.innerHTML = "";
            // For each route, display summary information.
            // for (var i = 0; i < route.legs.length; i++) {
            //     var routeSegment = i + 1;
            //     summaryPanel.innerHTML += "<b>Route Segment: " + routeSegment + "</b><br />";
            //     summaryPanel.innerHTML += route.legs[i].start_address + " to ";
            //     summaryPanel.innerHTML += route.legs[i].end_address + "<br />";
            //     summaryPanel.innerHTML += route.legs[i].distance.text + "<br /><br />";
            // }
        } else {
            alert("directions response " + status);
        }
    });
  }

  createMarkerIconOnly(item, firstItem){
    var se = this;
    var customMarkerIcon:any= {         
      url: se.getMarkerByItemTags(item.tags),
      scaledSize: new google.maps.Size(16, 20)    
    }
    const position = new google.maps.LatLng(item.latitude,item.longitude);
    const marker = new google.maps.Marker({ position, title: item.name, icon: customMarkerIcon, zIndex: 888, id: item.id });
    
    se.addInfoWindow(marker, item);
    marker.setMap(se.map);
    se.markers.push(marker);
  }

  /**
   * Thay icon marker được tap trên bản đồ thành icon marker selected
   * Todo: Clone marker được select
   * Tạo marker selected dựa trên marker clone, push vào mảng marker selected
   * Xóa marker cũ được select ở trên và add marker selected được tạo trên vào vị trí marker cũ
   * @param marker 
   * @param rest 
   */
  createNewMarkerById(marker, rest, isslide){
    var se  = this;
    var customMarkerIconNearest:any;
    
   if(se.markersSelected && se.markersSelected.length >0 ){
     let ms:any =se.markersSelected[0];
     if(ms.id == rest.id){
       return;
     }
   }
    if(se.curType){
      customMarkerIconNearest = {         
        url: se.getMarkerSelectedByTags(rest.tags),
        scaledSize: new google.maps.Size(44, 44),
        labelOrigin: new google.maps.Point(12, 48)
      }
    }else{
      customMarkerIconNearest = {         
        url: se.getMarkerSelectedByTags(marker.rest ? marker.rest.tags : rest.tags),
        scaledSize: new google.maps.Size(44, 44),
        labelOrigin: new google.maps.Point(12, 48)
      }
    }
    var position = new google.maps.LatLng(rest.latitude,rest.longitude);
    if(isslide){
      se.map.setCenter(position);
    }
    

    var optionSelected = { icon: customMarkerIconNearest, id: marker.id, type: marker.type, rest: rest};
    var position = marker.position ? new google.maps.LatLng(marker.position.lat(),marker.position.lng()) : new google.maps.LatLng(marker.latitude,marker.longitude);
    //se.map.setCenter(position);
    const markerNew = new google.maps.Marker({ position, title: rest.name, id: rest.id
      // ,label: {
      //         text: rest.name,
      //         color: "#e52822",
      //         fontSize: "13px",
      //         fontWeight: "bold",
      //         letterSpacing: "0.16px"
      //       } 
            , icon: customMarkerIconNearest, options: optionSelected, zIndex: 888 });
    markerNew.setMap(se.map);
    se.addInfoWindow(markerNew, rest);
    
    if(se.markersSelected != null && se.markersSelected.length >0){

      //Tạo marker mới theo marker cũ được selected
      var objMarkerSelected :any =se.markersSelected[0];
      const customMarkerIcon = {         
        url: se.getMarkerByItemTags(objMarkerSelected.rest.tags),
        scaledSize: new google.maps.Size(16, 20),
        labelOrigin: new google.maps.Point(12, 48)
      }
     
      var option = { icon: customMarkerIcon, id: objMarkerSelected.id, type: objMarkerSelected.type, rest: objMarkerSelected.rest};
      const position = objMarkerSelected.position ? new google.maps.LatLng(objMarkerSelected.position.lat(),objMarkerSelected.position.lng()) : new google.maps.LatLng(objMarkerSelected.latitude,objMarkerSelected.longitude);
      var markerSelectedNew = new google.maps.Marker({position, title: objMarkerSelected.rest.name,  id: rest.id
        // ,label: {
        //         text: objMarkerSelected.rest.name,
        //         color: "#000000",
        //         fontSize: "10px",
        //         //fontWeight: "bold",
        //         letterSpacing: "0.12px"
        //       }
        , icon: customMarkerIcon, options: option, zIndex: 888}
              );
      
      se.markers.push(markerSelectedNew);
      se.addInfoWindow(markerSelectedNew, objMarkerSelected.rest);
      se.removeMarkerById(objMarkerSelected.rest.id);
      markerSelectedNew.setMap(se.map);
      //Xóa mảng marker đang được selected
      se.markersSelected.forEach( (element:any) => {
        element.setMap(null);
      });
      se.markersSelected = [];
      se.markersSelected.push(markerNew);
    }else{
      se.markersSelected.push(markerNew);
    }
    return markerNew;
  }

  getImageByType(type){
    switch(type){
      case 1:
        return './assets/img_musttry/an_gi.svg';
        break;
      case 2:
        return './assets/img_musttry/xem_gi.svg';
        break;
      case 3:
        return './assets/img_musttry/choi_gi.svg';
        break;
      case 4:
        return './assets/img_musttry/o_dau.svg';
        break;
      case 5:
        return './assets/img_musttry/song_ao.svg';
        break;
      case 6:
        return './assets/img_musttry/phuong_tien.svg';
        break;
      case 22:
        return './assets/img_musttry/uong_gi.svg';
        break;
      default:
        return './assets/img_musttry/marker.svg';
        break;
    }
  }

  getImageByTagId(TagId, tags){
    switch(TagId){
      case 3:
        return './assets/img_musttry/an_gi.svg';
        break;
      case 6:
        return './assets/img_musttry/xem_gi.svg';
        break;
      case 7:
        return './assets/img_musttry/choi_gi.svg';
        break;
      case 4:
        return './assets/img_musttry/o_dau.svg';
        break;
      case 9:
        return './assets/img_musttry/song_ao.svg';
        break;
      case 8:
        return './assets/img_musttry/phuong_tien.svg';
        break;
      case 22:
        return './assets/img_musttry/uong_gi.svg';
        break;
      default:
        if(tags != null && tags.length >0){
          return this.getMarkerByItemTags(tags.toString());
        }else{
          return './assets/img_musttry/marker.svg';
        }
        break;
    }
  }
  
  getTagByType(type){
    switch(type){
      case 1:
        return 3;
        break;
      case 2:
        return 6;
        break;
      case 3:
        return 7;
        break;
      case 4:
        return 4;
        break;
      case 5:
        return 9;
        break;
      case 6:
        return 22;
        break;
    }
  }

  getTagByTypeName(){
    var se = this;
    if(se.searchhotel.ef_arrhoteltypenamecheck.length>0){
      se.searchhotel.ef_arrhoteltypenamecheck.forEach(element => {
        if(element == 'Ăn gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 3, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(3);
        }
        else if(element == 'Xem gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 6, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(6);
        }
        else if(element == 'Chơi gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 7, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(7);
        }
        else if(element == 'Ở đâu' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 4, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(4);
        }
        else if(element == 'Sống ảo' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 9, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(9);
        }
        else if(element == 'Uống gì' && !se.gf.checkExistsItemInArray(se.searchhotel.ef_arrhoteltypecheck, 22, 'filtername')){
          se.searchhotel.ef_arrhoteltypecheck.push(22);
        }
      });
    }
  }

  /**
   * Hàm lấy icon marker được chọn/ địa điểm gần nhất
   */
  getMarkerByItemTags(tags){
    var se = this;
    if(tags&& tags.length >0){
      if(tags.indexOf(3) != -1)
      {
        return './assets/img_musttry/an_gi.svg';
      }
      if(tags.indexOf(6) != -1)
      {
        return './assets/img_musttry/xem_gi.svg';
      }
      if(tags.indexOf(7) != -1)
      {
        return './assets/img_musttry/choi_gi.svg';
      }
      if(tags.indexOf(4) != -1)
      {
        return './assets/img_musttry/o_dau.svg';
      }
      if(tags.indexOf(9) != -1)
      {
        return './assets/img_musttry/song_ao.svg';
      }
      if(tags.indexOf(8) != -1)
      {
        return './assets/img_musttry/phuong_tien.svg';
      }
      if(tags.indexOf(22) != -1)
      {
        return './assets/img_musttry/uong_gi.svg';
      }
      else{
        return './assets/img_musttry/placeholder_new.svg';
      }
    }
  }

  /**
   * Hàm lấy icon marker được chọn/ địa điểm gần nhất
   * @param TagId id tag theo từng địa điểm
   */
  getMarkerSelectedByTagId(TagId){
    switch(TagId){
      case 3:
        return './assets/img_musttry/ic_food_selected.svg';
        break;
      case 6:
        return './assets/img_musttry/ic_eye_selected.svg';
        break;
      case 7:
        return './assets/img_musttry/ic_celebrate_selected.svg';
        break;
      case 4:
        return './assets/img_musttry/ic_home_selected.svg';
        break;
      case 9:
        return './assets/img_musttry/ic_camera_selected.svg';
        break;
      case 8:
        return './assets/img_musttry/ic_airplane_selected.svg';
        break;
      case 22:
        return './assets/img_musttry/ic_drink_selected.svg';
        break;
      default:
        return './assets/img_musttry/placeholder_new.svg';
        break;
    }
  }

  /**
   * Hàm lấy icon marker được chọn/ địa điểm gần nhất sau khi từ form lọc
   * @param TagId id tag theo từng địa điểm
   */
  getMarkerSelectedByTags(tags){
    if(tags&& tags.length >0){
      if(tags.indexOf(3) != -1)
      {
        return './assets/img_musttry/ic_food_selected.svg';
      }
      if(tags.indexOf(6) != -1)
      {
        return './assets/img_musttry/ic_eye_selected.svg';
      }
      if(tags.indexOf(7) != -1)
      {
        return './assets/img_musttry/ic_celebrate_selected.svg';
      }
      if(tags.indexOf(4) != -1)
      {
        return './assets/img_musttry/ic_home_selected.svg';
      }
      if(tags.indexOf(9) != -1)
      {
        return './assets/img_musttry/ic_camera_selected.svg';
      }
      if(tags.indexOf(8) != -1)
      {
        return './assets/img_musttry/ic_airplane_selected.svg';
      }
      if(tags.indexOf(22) != -1)
      {
        return './assets/img_musttry/ic_drink_selected.svg';
      }
      else{
        return './assets/img_musttry/ic_drink_selected.svg';
      }
    }else{
      return './assets/img_musttry/placeholder_new.svg';
    }
  }

  hideMapElement(){
    var se = this;
    var el = $("#mapDiv");
    if(el && el.length >0){
      var elgmno = $("#mapDiv").querySelector('.gmnoprint');
      if(elgmno && elgmno.length >0){
        elgmno.attributes.style.value = elgmno.attributes.style.value + "; display: none";
      }

      var elplacecard = $("#mapDiv").querySelector('.place-card');
      if(elplacecard && elplacecard.length >0){
        elplacecard.attributes.style.value = elplacecard.attributes.style.value + "; display: none";
      }

      var ellogincontrol = $("#mapDiv").querySelector('.login-control');
      if(ellogincontrol && ellogincontrol.length >0){
        ellogincontrol.attributes.style.value = ellogincontrol.attributes.style.value + "; display: none";
      }

      var elgminset = $("#mapDiv").querySelector('.gm-inset');
      if(elgminset && elgminset.length >0){
        elgminset.attributes.style.value = elgminset.attributes.style.value + "; display: none";
      }
      
    }
  }

  addTextSearch(type){
    var se = this;
    if(type==1){
      se.textsearch = "Ăn gì";
    }
    if(type==2){
      se.textsearch = "Xem gì";
    }
    if(type==3){
      se.textsearch = "Chơi gì";
    }
    if(type==4){
      se.textsearch = "Ở đâu";
    }
    if(type==5){
      se.textsearch = "Sống ảo";
    }
    if(type==6){
      se.textsearch = "Uống gì";
    }
    $('.input-search').addClass('searchbar-has-focus');
  }
  /**
   * Ẩn hiện div itemsearch/ listsearch khi chọn/xóa theo item
   */
  showHideItemSearch(show){
    if(show){
      $('.div-list-search-result').addClass('cls-show').removeClass('cls-hide');
      $('.div-item-search').removeClass('cls-show').addClass('cls-hide');
    }else{
      $('.div-item-search').addClass('cls-show').removeClass('cls-hide');
      $('.div-list-search-result').removeClass('cls-show').addClass('cls-hide');
    }
    
  }

  buildFilter(){
    var se = this, sfilter= '';
    if(se.searchhotel.ef_arrlocalcheck.length >0 ){
      sfilter += se.searchhotel.ef_arrlocalcheck.join(',');
    }

    if(se.searchhotel.ef_arrhoteltypecheck.length >0 ){
      if(sfilter && sfilter.length>0){
        sfilter += ','+ se.searchhotel.ef_arrhoteltypecheck.join(',');
      }else{
        sfilter += se.searchhotel.ef_arrhoteltypecheck.join(',');
      }
      
    }

    if(se.searchhotel.ef_arrstylecheck.length >0 ){
      if(sfilter && sfilter.length>0){
        sfilter += ','+ se.searchhotel.ef_arrstylecheck.join(',');
      }else{
        sfilter += se.searchhotel.ef_arrstylecheck.join(',');
      }
      
    }
  
    return sfilter;
  }
  /**
   * Sự kiện khi người dùng nhập vào ô text search
   */
  getItems(event){
    var se = this;
    se.loaddatadone=false;
    if(event.detail.value == "" || !se.searchhotel.inputExperienceItem){
      se.cancelInput();
    }
  }

  loadDataMap(data){
    var se = this;
    se.reCountFilter();
    if(se.searchhotel.ef_arrdistancecheck && se.searchhotel.ef_arrdistancecheck.length>0){
      data.forEach(element => {
        se.calculateDistanceMarker(element, 'totalDistance', null);
      });


      setTimeout(()=>{
        let d = se.getDistanceFilter();
        data = data.filter((item)=>{ return item.totalDistance <= d })

        if(data.length ==0){
          se.setBottomState();
          se.loaddatadone = true;
          se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
        }
      },50)
    }

    
    if(se.searchhotel.ef_arrhouropencheck && se.searchhotel.ef_arrhouropencheck.length>0){
      data = se.filterOpenHour(data);
    }

    if(data && data.length>0){
      se.zone.run(()=>{
        se.listSearch = data;
        se.listSearchOriginal = [];
        se.listSearchDisplay=[];
        se.loaddatadone = true;
        se.listSearchOriginal.push(...data);
        if(data && data[0] && data[0].regionId){
          se.regionId = data[0].regionId;
        }
       
      })
      //Nếu item search theo item place thì lấy theo vị trí place
      //Nếu search theo vùng thì lấy vị trí theo place đầu tiên của list place theo vùng
      

      if(se.searchhotel.inputExperienceItem.subRegionCode && se.searchhotel.inputExperienceItem.subRegionId){
        $.get('https://nominatim.openstreetmap.org/search?format=json&q='+se.searchhotel.inputExperienceItem.subRegionCode + ' ' + se.searchhotel.inputExperienceItem.regionCode, function(datasubregion){
            if(datasubregion && datasubregion.length>0){
              se.subRegionLocation.regioncode = se.searchhotel.inputExperienceItem.regionCode;
              //Tạm rem code phần map subregion vào filter
              // se.searchhotel.ef_arrsubregioncheck.push(se.searchhotel.inputExperienceItem.subRegionId);
              // se.searchhotel.ef_arrsubregionnamecheck = se.searchhotel.inputExperienceItem.name;
              if(se.searchhotel.inputExperienceItem.subRegionCode == 'long-hai'){
                se.locationCoords.latitude = datasubregion[1].lat;
                se.locationCoords.longitude = datasubregion[1].lon;
              }else{
                if(!se.searchhotel.inputExperienceItem.latitude && !se.searchhotel.inputExperienceItem.longitude){
                  se.locationCoords.latitude = datasubregion[0].lat;
                  se.locationCoords.longitude = datasubregion[0].lon;
                }else{
                  se.locationCoords.latitude = se.searchhotel.inputExperienceItem.latitude ? se.searchhotel.inputExperienceItem.latitude : data[0].latitude;
                  se.locationCoords.longitude = se.searchhotel.inputExperienceItem.longitude ? se.searchhotel.inputExperienceItem.longitude: data[0].longitude;
                }
                
              }
              
              se.clearMarkerAndRouting();
              se.initMap({latitude: datasubregion[0].lat,longitude: datasubregion[0].lon });
              $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
              se.bindMarker(data,se.searchhotel.experiencesearchTagsId);
            }else{
              se.locationCoords.latitude = se.searchhotel.inputExperienceItem.latitude ? se.searchhotel.inputExperienceItem.latitude : data[0].latitude;
              se.locationCoords.longitude = se.searchhotel.inputExperienceItem.longitude ? se.searchhotel.inputExperienceItem.longitude: data[0].longitude;

              se.clearMarkerAndRouting();
              se.initMap(null);
              $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
              se.bindMarker(data,se.searchhotel.experiencesearchTagsId);
            }
        })
      }else{
        se.locationCoords.latitude = se.searchhotel.inputExperienceItem.latitude ? se.searchhotel.inputExperienceItem.latitude : data[0].latitude;
        se.locationCoords.longitude = se.searchhotel.inputExperienceItem.longitude ? se.searchhotel.inputExperienceItem.longitude: data[0].longitude;

        se.clearMarkerAndRouting();
        se.initMap(null);
        $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
        se.bindMarker(data,se.searchhotel.experiencesearchTagsId);
      }
  
      
    }
    else{
      se.loaddatadone = true;
      se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
    }
    se.curType = '';
    //scroll to Top
    //se.content.scrollToTop(100);
  }

  clickSearch(){
    this.searchhotel.clearFilterExperience = false;
    this.recent = this.searchhotel.ItemExperienceRegionRecent;
    // this.searchhotel.inputExperienceRegionCode = null;
    // this.searchhotel.inputExperienceText = null;
    // this.searchhotel.inputExperienceItem = null;
    this.listSearchOriginal=[];
    this.listSearch=[];
    this.listSearchDisplay=[];
    this.dockedHeight = 0;
    this.textsearch='';
    this.searchhotel.ef_arrlocalcheck = [];
    this.searchhotel.ef_arrlocalnamecheck = [];
    this.searchhotel.ef_arrsubregioncheck = [];
    this.searchhotel.ef_arrsubregionnamecheck = [];
    this.searchhotel.deviceLocation = this.deviceLocation ? this.deviceLocation : this.locationCoords;
    //this.searchhotel.stringFilterName="";
    this.navCtrl.navigateForward('/searchexperienceregion');
  }

  /**
   * Nhấn xóa trên ô input/ xóa hết textsearch
   */
  cancelInput(){
    var se= this;
    se.itemclick = false;
    se.clearMarkerAndRouting();
    
  }
  /**
   * Xóa marker theo id
   */
  removeMarkerById(id){
    var se = this;
    if(se.markers && se.markers.length>0){
      se.markers.forEach( (element:any) => {
        if(element.id && element.id == id){
          element.setMap(null);
        }
        if(element.rest && element.rest.id == id){
          element.setMap(null);
        }
      });
    }
 
  }
  
  clearMarkerAndRouting(){
    var se = this;
    if(se.map){
      if($('.popup-container').length >0){
        for(let i =0; i<$('.popup-container').length; i++){
          $('.popup-container')[i]['style']['display']= 'none';
          //$('.popup-container')[i].remove();
        }
      }

      if($('.popup-bubble').length >0){
        for(let j=0; j< $('.popup-bubble').length; j++){
          $('.popup-bubble')[j]['style']['display']= 'none';
        }
      }

      if($('.popup-bubble-anchor').length >0){
        for(let k =0; k<$('.popup-bubble-anchor').length; k++){
          $('.popup-bubble-anchor')[k]['style']['border-top']= '4px solid transparent';
        }
      }

      //clear markerIcon
      if(se.markers && se.markers.length >0){
        se.markers.forEach( (element:any) => {
          element.setMap(null);
        });
      }
      //clear markerIcon
      // if(se.markersSelected && se.markersSelected.length >0){
      //   se.markersSelected.forEach( (element:any) => {
      //     element.setMap(null);
      //   });
      // }
      //reset allowsortlocation
      se.allowSortByCurrentLocation = true;
    }
  }

  clearMarkerSelected(){
    var se = this;
    if(se.map){
      if(se.markersSelected && se.markersSelected.length >0){
        se.markersSelected.forEach( (element:any) => {
          element.setMap(null);
        });
      }
      
    }
  }

  onScrollBlog(event){

  }
  /**
   * show popup lọc
   */
  async showFilter(){
    var se = this;
    se.loaddatadone=false;
    se.content.scrollToTop(50);
    if(se.actionSheet){
      se.actionSheet.dismiss();
    }
    
    se.curType='';
    se.searchhotel.stringFilterName = '';
    se.gf.setParams(se.regionId ? se.regionId : se.regionCode,'experienceFilter_regionId');
    se.gf.setParams(se.regionCode,'experienceFilter_regionCode');
    se.gf.setParams({ deviceLocation: se.deviceLocation, locationCoords: se.locationCoords, listData: se.activityService.listExperienceSearch ? se.activityService.listExperienceSearch : se.listSearch}, 'experienceLocation');
    se.storage.get('experienceFilter_childregionCode_'+ se.regionCode).then((experienceFilter_regionCode_data) => {
      if(!experienceFilter_regionCode_data){
        var strURL_subRegion = C.urls.baseUrl.urlMobile + '/api/data/GetChildRegionByRegion?code=' + se.regionCode;
        se.gf.RequestApi('GET',strURL_subRegion, {}, {}, "experienceFilter","GetChildRegionByRegion").then((datachildregion:any)=>{
          if(datachildregion && datachildregion.childRegions && datachildregion.childRegions.length >0){
            se.storage.set('experienceFilter_childregionCode_'+ se.regionCode,datachildregion);
          }else{
            se.storage.get('experienceFilter_subregionCode_'+ se.regionCode).then((datasubregion) => {
              if(!datasubregion){
                var strURL_subRegion = C.urls.baseUrl.urlMobile + '/api/data/GetSubRegionByRegion?code=' + se.regionCode;
                se.gf.RequestApi('GET',strURL_subRegion, {}, {}, "experienceFilter","GetSubRegionByRegion").then((data:any)=>{
                  if(data && data.subRegions && data.subRegions.length >0){
                      se.storage.set('experienceFilter_subregionCode_'+ se.regionCode,data);
                    }
                  })
              }
            })
            
          }
        })
      }
      // else{
      //   se.storage.get('experienceFilter_subregionCode_'+ se.regionCode).then((datasubregion) => {
      //     if(!datasubregion){
      //       var strURL_subRegion = C.urls.baseUrl.urlMobile + '/api/data/GetSubRegionByRegion?code=' + se.regionCode;
      //       se.gf.RequestApi('GET',strURL_subRegion, {}, {}, "experienceFilter","GetSubRegionByRegion").then((data:any)=>{
      //         if(data && data.subRegions.length >0){
      //             se.storage.set('experienceFilter_subregionCode_'+ se.regionCode,data);
      //           }
      //         })
      //     }
      //   })
      // }
    })
    
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: ExperienceFilterPage
    });
    modal.present();

    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      var strFilter = '';
      se.textsearch='';
      se.pageCount =0;
      se.totalPage =0;
      se.listSearchOriginal=[];
      se.listSearch=[];
      se.listSearchDisplay=[];
      let urlAPi='';
      se.filterHourOpen = 1;
      if (data.data || se.searchhotel.ef_arrdistancecheck.length >0) {
        se.zone.run(() => {
          strFilter = data.data.strFilter;
          se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionCodes='+se.regionCode+''+ (strFilter ? strFilter : '');
          urlAPi = se.url +'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
            se.reLoadDataAfterFilter(urlAPi, strFilter, data.data.dataFilter);
            se.buildTextSearch();
            se.reCountFilter();
            if(se.textsearch.length >0 && !(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId)){
              se.textsearch += " (" + data.data.dataFilter.length + ")";
            }
            if(se.searchhotel.inputExperienceRegionName && se.textsearch.indexOf(se.searchhotel.inputExperienceRegionName) == -1){
              se.textsearch += ' | ' + se.searchhotel.inputExperienceRegionName;
            }
        })
      }else{
        if(se.searchhotel.clearFilterExperience){
          se.countfilter = 0;
          se.textsearch = "";
          se.cancelInput();
          se.listSearchOriginal=[];
          se.listSearch=[];
          se.listSearchDisplay=[];
          
        }else{
          strFilter += se.buildFilter();

          se.url = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionCodes='+se.regionCode+'&Tags='+(strFilter ? strFilter : '');
          urlAPi = se.url +'&paging.pageNumber=0&paging.pageSize='+se.pageSize;
          se.reLoadDataAfterFilter(urlAPi, '', null);
          se.buildTextSearch();
          se.reCountFilter();
        }
      }
      
    
    })
  }
  buildTextSearch(){
    var se = this;
    // if(se.searchhotel.stringFilterName && se.searchhotel.stringFilterName.length >0){
    //   se.textsearch = se.searchhotel.stringFilterName;
    // }
    let sfilter='';
    se.textsearch = se.buildStringFilterName(sfilter);
    if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.tagsJson && se.searchhotel.inputExperienceItem.tagsJson.length >0){
      let sname = se.searchhotel.inputExperienceItem.tagsJson[0].name;
      if(se.textsearch.indexOf(sname) == -1 && se.searchhotel.inputExperienceText.indexOf(sname) == -1){
        se.searchhotel.ef_arrhoteltypenamecheck.push(sname);
        if(se.textsearch.length>0){
          se.textsearch+= ', ' + sname;
        }else{
          se.textsearch+= sname;
        }
      }
    }
    if(se.searchhotel.inputExperienceText && se.textsearch && se.textsearch.length>0){
      if(se.textsearch.indexOf(se.searchhotel.inputExperienceText) == -1){
        se.textsearch += ' | '+ se.searchhotel.inputExperienceText;
      }
    }else{
      if(se.textsearch.indexOf(se.searchhotel.inputExperienceText) == -1){
        se.textsearch += se.searchhotel.inputExperienceText ? se.searchhotel.inputExperienceText : '';
      }
    }

    
  }

  /**
   * Hàm load lại dữ liệu sau filter
   * @param url url gọi api
   * @param strFilter chuỗi filter
   */
  reLoadDataAfterFilter(url,strFilter, dataFilter){
    var se = this;
    se.gf.RequestApi('GET',url,{},{},'ExperienceSearch', 'reLoadDataAfterFilter').then((data:any)=>{
      se.loaddatadone = true;
      se.dockedHeight = 300;
      //clearRoute
      se.clearRoute();
      //dataFilter dữ liệu trả về sau khi lọc trên page filter
      if(dataFilter && dataFilter.length>0){
        //Lọc listdata theo list data đã filter
        let arr = dataFilter.map((e)=>{ return e.id});
        data.data = data.data.filter((item)=>{ return  arr.includes(item.id) });
      }else{
        data.data = [];
      }
        data.data.forEach(element => {
          se.calculateDistanceMarker(element, 'totalDistance', null);
        });
        if(se.searchhotel.ef_arrdistancecheck && se.searchhotel.ef_arrdistancecheck.length>0){
          setTimeout(()=>{
            let d = se.getDistanceFilter();
            data.data = data.data.filter((item)=>{ return item.totalDistance <= d })
            
          },50)
        }
        if(se.searchhotel.ef_arrhouropencheck && se.searchhotel.ef_arrhouropencheck.length>0){
            data.data = se.filterOpenHour(data.data);
        }
        if(data.data && data.data.length>0){
          //Thêm regionName nếu chưa có trên textsearch
          if(data.data[0].address){
            let arrAddress = data.data[0].address.split(',');
            let rn = arrAddress[arrAddress.length -2];
            if(se.textsearch.indexOf(rn) == -1 && !se.searchhotel.inputExperienceRegionName){
              if(se.textsearch.length >0){
                se.textsearch += ' | '+ rn.trimLeft();
              }else{
                se.textsearch += rn.trimLeft() + " (" +data.data.length+ ")";
              }
              
          }
          
          }
            setTimeout(()=>{
              se.storage.get('auth_token').then(auth_token => {
                if (auth_token) {
                    var text = "Bearer " + auth_token;
                    let urlLike = C.urls.baseUrl.urlMobile + '/api/Data/GetPlaceUserLike';
                    se.gf.RequestApi('GET', urlLike, {authorization: text}, {}, 'ExperienceSearch','GetPlaceUserLike').then((datalike:any) =>{
                      if(datalike && datalike.length >0){
                        se.dataListLike = datalike;
                        data.data.forEach(element => {
                          element.liked = se.checkItemLiked(element.id) ? true: false;
                        });
                        se.executeReloadData(data.data, strFilter);
                      }else{
                        se.executeReloadData(data.data, strFilter);
                      }
                    })
                  }else{
                    se.executeReloadData(data.data, strFilter);
                  }
              })
          },150)
        }else{
          se.loaddatadone = true;
          se.listSearch = [];
          se.listSearchDisplay =[];
          se.clearMarkerAndRouting();
          se.initEmptyMap();
          se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
          se.reCountFilter();
        }
      // }else{
      //   se.loaddatadone = true;
      //     se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
      // }
      
    })
  }

  filterOpenHour(data){
    var se = this;
    return data.filter((el)=>{
      //let timeFilter = se.getTimeFilter();
      if(el.workingHours.length >1){
        let wk0 = el.workingHours[0];
        let wk1 = el.workingHours[1];
        if(wk0){
          if(wk0.name.indexOf('24/24') != -1){
            return true;
          }if(wk0.name.indexOf('đêm') != -1){
            let fromTimeFirst = wk0.timeFrom.replace(':','');
            let toTimeFirst = '2400';
            let fromTimeSecond = '0000';
            let toTimeSecond = wk0.timeTo.replace(':','');
            return (se.getTimeFilter(fromTimeFirst, toTimeFirst) || se.getTimeFilter(fromTimeSecond, toTimeSecond) );
          }
          else{
            let fromTime = wk0.timeFrom.replace(':','');
            let toTime = wk0.timeTo.replace(':','');
            return se.getTimeFilter(fromTime, toTime);
          }
        }

        if(wk1){
          if(wk1.name.indexOf('24/24') != -1){
            return true;
          }if(wk1.name.indexOf('đêm') != -1){
            let fromTimeFirst = wk1.timeFrom.replace(':','');
            let toTimeFirst = '2400';
            let fromTimeSecond = '0000';
            let toTimeSecond = wk1.timeTo.replace(':','');
            return (se.getTimeFilter(fromTimeFirst, toTimeFirst) || se.getTimeFilter(fromTimeSecond, toTimeSecond) );
          }
          else{
            let fromTime = wk1.timeFrom.replace(':','');
            let toTime = wk1.timeTo.replace(':','');
            return se.getTimeFilter(fromTime, toTime);
          }
        }
        
      }else{
        if(el.workingHours[0].name.indexOf('24/24') != -1){
          return true;
        }if(el.workingHours[0].name.indexOf('đêm') != -1){
          let fromTimeFirst = el.workingHours[0].timeFrom.replace(':','');
          let toTimeFirst = '2400';
          let fromTimeSecond = '0000';
          let toTimeSecond = el.workingHours[0].timeTo.replace(':','');
          return (se.getTimeFilter(fromTimeFirst, toTimeFirst) || se.getTimeFilter(fromTimeSecond, toTimeSecond) );
        }
        else{
          let fromTime = el.workingHours[0].timeFrom.replace(':','');
          let toTime = el.workingHours[0].timeTo.replace(':','');
          return se.getTimeFilter(fromTime, toTime);
        }
      }
      
    })
  }

  getTimeFilter(fromTime, toTime){
    var se = this;
    let minFromTime ='';
    let maxToTime='';
    let maxHour = Math.max(...se.searchhotel.ef_arrhouropencheck);
    let minHour = Math.min(...se.searchhotel.ef_arrhouropencheck);
    minFromTime = se.getMinFromTime(minHour);
    maxToTime = se.getMaxToTime(maxHour);

    return  (minFromTime >= fromTime && minFromTime <= toTime && maxToTime >= fromTime && maxToTime <= toTime) || (fromTime >= minFromTime && fromTime <= maxToTime && toTime >= minFromTime && toTime <= maxToTime || (fromTime >= minFromTime && fromTime <= maxToTime && toTime > maxToTime) ||(toTime >= minFromTime && toTime <= maxToTime) );
  }

  getMinFromTime(hour){
    if(hour == 1 || hour == 5){
      return '0500';
    }
    if(hour == 2){
      return '1000';
    }
    if(hour == 3){
      return '1200';
    }
    if(hour == 4){
      return '1700';
    }
    if(hour == 6){
      return '0001';
    }
  }

  getMaxToTime(hour){
    if(hour == 1){
      return '1200';
    }
    if(hour == 2){
      return '1400';
    }
    if(hour == 3 || hour == 5){
      return '2300';
    }
    if(hour == 4|| hour == 6){
      return '2400';
    }
  }

  executeReloadData(data,strFilter){
    var se = this;
    if(data && data.length>0){
      $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
      se.zone.run(()=>{
        se.totalPage = Math.round(data.length/5);
      })

      //Move bản đồ đến location của vùng subregion filter nếu có chọn lọc theo subregion
      if(se.searchhotel.ef_arrsubregionnamecheck && se.searchhotel.ef_arrsubregionnamecheck.length >0){
        var subregioncode = se.convertFontVNI(se.searchhotel.ef_arrsubregionnamecheck[0]).replace(/ /g,'-');
        $.get('https://nominatim.openstreetmap.org/search?format=json&q='+subregioncode + ' ' + se.regionCode, function(datasubregion){
            if(datasubregion && datasubregion.length>0){
              var position = new google.maps.LatLng(datasubregion[0].lat, datasubregion[0].lon);
              se.map.setCenter(position);
            }
        })
      }

      se.combineDataPlace(se.regionCode,data).then((datacombine)=>{
        se.zone.run(()=>{
          se.loaddatadone = false;
          se.listSearchDisplay=[];
          se.listSearchOriginal=[];
          se.listSearch = datacombine;
          se.listSearchOriginal = datacombine;
          se.clearMarkerAndRouting();
          se.bindMarker(datacombine,strFilter);
        })
      })
      
    }else{
      se.clearMarkerAndRouting();
      se.setBottomState();
      se.loaddatadone = true;
      se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
    }
    
    se.reCountFilter();
    //se.content.scrollToTop(200);
  }

  getDistanceFilter(){
    var se = this, distance = 0;
      if(se.searchhotel.ef_arrdistancecheck && se.searchhotel.ef_arrdistancecheck.length>0)
      {
        let d = Math.max(...se.searchhotel.ef_arrdistancecheck);
        distance = d == 1 ? 1 : ( d==4 ? d *5 : ((d-1) * 5) );
      }   
    return distance;
  }
  /**
   * Hàm đếm lại số filter
   * */
  reCountFilter(){
    var se = this;
    se.countfilter = 0;
    se.zone.run(()=>{
      if(se.searchhotel.ef_arrhoteltypecheck && se.searchhotel.ef_arrhoteltypecheck.length >0){
        se.countfilter += se.searchhotel.ef_arrhoteltypecheck.length;
      }
      if(se.searchhotel.ef_arrstylecheck && se.searchhotel.ef_arrstylecheck.length >0){
        se.countfilter += se.searchhotel.ef_arrstylecheck.length;
      }
      if(se.searchhotel.ef_arrlocalcheck && se.searchhotel.ef_arrlocalcheck.length >0){
        se.countfilter += se.searchhotel.ef_arrlocalcheck.length;
      }
      if(se.searchhotel.ef_arrhouropencheck && se.searchhotel.ef_arrhouropencheck.length >0){
        se.countfilter += se.searchhotel.ef_arrhouropencheck.length;
      }
      if(se.searchhotel.ef_arrdistancecheck && se.searchhotel.ef_arrdistancecheck.length >0){
        se.countfilter += se.searchhotel.ef_arrdistancecheck.length;
      }
      if(se.searchhotel.ef_arrsubregioncheck && se.searchhotel.ef_arrsubregioncheck.length >0){
        se.countfilter += se.searchhotel.ef_arrsubregioncheck.length;
      }
    })
  }

  async itemListSearchClick(item, listsearchdisplay){
    var se = this;
    //return;
    if(se.actionSheet){
      se.actionSheet.dismiss();
    }

    se.gf.setParams(item,'experienceItem');
      let listdetail = (listsearchdisplay && listsearchdisplay.length >0) ? listsearchdisplay.map(e => ({ ... e })) : se.listSearchDisplay.map(e => ({ ... e }));
      se.gf.setParams(listdetail, 'listSearch_ExperienceDetail');
      const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: ExperienceDetailPage,
        id: 'ExperienceDetail'
      });
      modal.present();
  
      modal.onDidDismiss().then((data: OverlayEventDetail) => {
          if(!data.data){
            se.listSearchDisplay.forEach(element => {
              if(se.map.getZoom() < 16){
                se.createMarkerIconOnly(element, se.listSearchDisplay[0]);
              }else if(se.map.getZoom() >= 16){
                se.addMarkersToMap(element);
              }
              
            });
            
            // setTimeout(()=>{
            //   if(se.itemsearchfocus){
            //     var idx=-1;
            //     idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == se.itemsearchfocus.id});
            //       if(idx != -1 && idx != null){
            //         se.slider.slideTo(idx);
            //       }
            //     se.itemsearchfocus = null;
            //   }
            // },400)
            
            setTimeout(()=>{
              if(se.itemsearchfocus){
                var idx=-1;
                idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == item.id});
                  if(idx != -1 && idx != null){
                    se.slider.slideTo(idx);
                  }
                se.itemsearchfocus = null;
              }
            },300)
            
          }

          // if(se.valueGlobal.likePlaceCount){
          //   se.zone.run(()=>{
          //     item.totalLike += se.valueGlobal.likePlaceCount;
          //     se.valueGlobal.likePlaceCount = 0;
          //   })
          // }
      })
    
  }

  searchAndClickMarker(item){
    var se = this;
    se.markerhaschange = false;
    se.slidehaschange= true;
    if(se.markers && se.markers.length >0){
      se.markers.forEach( (element:any) => {
        if(element.id == item.id){
          se.markerClick(element, element.rest, se.map, true, true);
        }
      });
    }
  }
  /**
   * Sắp xếp theo lượt like nếu có lên trên; ko có like thì sắp xếp theo tên
   */
  async clickSort(event){
    var se = this;
      se.sortData(event.detail.value, true);
      //sort luôn list all data để không bị giật khi loadpaging
      //se.sortAllData(event.detail.value)
      se.sortvalue = event.detail.value;
  }

  sortData(sortValue, isRefreshMarker){
    var se = this;
    if (se.listSearchDisplay && se.listSearchDisplay.length > 0) {
      se.sort = se.sort*-1;
      se.zone.run(() => se.listSearchDisplay.sort(function (a, b) {
        let direction = -1;
          if(sortValue == 2){
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
            
          }
          else if(sortValue == 3){
            let direction =1;
            if (a['totalLike'] < b['totalLike']) {
              return 1 * direction;
            }
            else{
              return -1 * direction;
            }
          }else if(sortValue == 1){
            let a1='',b1='';
            a1 = a['name'];
            b1 = b['name'];

            a1 = se.convertFontVNI(a1);
            b1 = se.convertFontVNI(b1);

            if (a1 < b1) {
              return 1 * direction;
            }
            else if (a1 > b1) {
              return -1 * direction;
            }
          }
      }));
      if(isRefreshMarker){
        setTimeout(()=>{
          if(se.map.getZoom() <16){
            //se.clearMarkerAndRouting();
            se.listSearchDisplay.forEach(element => {
              se.createMarkerIconOnly(element, se.listSearchDisplay[0]);
            });
          }else if(se.map.getZoom() >= 16){
            se.clearMarkerAndRouting();
            se.listSearchDisplay.forEach(element => {
              se.addMarkersToMap(element);
            });
          }
        },100)
      }
      
    }
  }

  sortAllData(sortValue){
    var se = this;
    if (se.listSearch && se.listSearch.length > 0) {
      se.sort = se.sort*-1;
      se.zone.run(() => se.listSearch.sort(function (a, b) {
        let direction = -1;
          if(sortValue == 2){
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
            
          }
          else if(sortValue == 3){
            let direction =1;
            if (a['totalLike'] < b['totalLike']) {
              return 1 * direction;
            }
            else{
              return -1 * direction;
            }
          }else if(sortValue == 1){
            let a1='',b1='';
            a1 = a['name'];
            b1 = b['name'];

            a1 = se.convertFontVNI(a1);
            b1 = se.convertFontVNI(b1);

            if (a1 < b1) {
              return 1 * direction;
            }
            else if (a1 > b1) {
              return -1 * direction;
            }
          }
      }));
    }
  }
  /**
   * Chuyển ký tự font VNi vd: â - a ...
   */
  convertFontVNI(obj){
    if(obj.indexOf('đ') != -1 || obj.indexOf('Đ') != -1){
      obj = obj.replace('đ','d').replace('Đ','D');
    }
    if(obj.indexOf('ă') != -1 || obj.indexOf('Ă') != -1){
      obj = obj.replace('ă','a').replace('Ă','A');
    }
    if(obj.indexOf('â') != -1 || obj.indexOf('Â') != -1){
      obj = obj.replace('â','a').replace('Â','Â');
    }
    if(obj.indexOf('á') != -1 || obj.indexOf('Á') != -1){
      obj = obj.replace('á','a').replace('Á','A');
    }
    if(obj.indexOf('à') != -1 || obj.indexOf('À') != -1){
      obj = obj.replace('à','a').replace('À','A');
    }
    if(obj.indexOf('ấ') != -1 || obj.indexOf('Ấ') != -1){
      obj = obj.replace('ấ','a').replace('Ấ','A');
    }
    if(obj.indexOf('ầ') != -1 || obj.indexOf('Ầ') != -1){
      obj = obj.replace('ầ','a').replace('Ầ','A');
    }
    if(obj.indexOf('ẵ') != -1 || obj.indexOf('Ẵ') != -1){
      obj = obj.replace('ẵ','a').replace('Ẵ','A');
    }
    if(obj.indexOf('ặ') != -1 || obj.indexOf('Ặ') != -1){
      obj = obj.replace('ặ','a').replace('Ặ','A');
    }
    if(obj.indexOf('ậ') != -1 || obj.indexOf('Ậ') != -1){
      obj = obj.replace('ậ','a').replace('Ậ','A');
    }
    if(obj.indexOf('ạ') != -1 || obj.indexOf('Ạ') != -1){
      obj = obj.replace('ạ','a').replace('Ạ','A');
    }
    
    if(obj.indexOf('ê') != -1 || obj.indexOf('Ê') != -1){
      obj = obj.replace('ê','e').replace('Ê','Ê');
    }
    if(obj.indexOf('é') != -1 || obj.indexOf('É') != -1){
      obj = obj.replace('é','e').replace('É','E');
    }
    if(obj.indexOf('è') != -1 || obj.indexOf('È') != -1){
      obj = obj.replace('è','e').replace('È','E');
    }
    if(obj.indexOf('ẻ') != -1 || obj.indexOf('Ẻ') != -1){
      obj = obj.replace('ẻ','e').replace('Ẻ','E');
    }
    if(obj.indexOf('ẽ') != -1 || obj.indexOf('Ẽ') != -1){
      obj = obj.replace('ẽ','e').replace('Ẽ','E');
    }
    if(obj.indexOf('ệ') != -1 || obj.indexOf('Ệ') != -1){
      obj = obj.replace('ệ','e').replace('Ệ','E');
    }
    if(obj.indexOf('ễ') != -1 || obj.indexOf('Ễ') != -1){
      obj = obj.replace('ễ','e').replace('Ễ','E');
    }
    if(obj.indexOf('ẹ') != -1 || obj.indexOf('Ẹ') != -1){
      obj = obj.replace('ẹ','e').replace('Ẹ','E');
    }

    if(obj.indexOf('ô') != -1 || obj.indexOf('Ô') != -1){
      obj = obj.replace('ô','o').replace('Ô','O');
    }
    if(obj.indexOf('ồ') != -1 || obj.indexOf('Ồ') != -1){
      obj = obj.replace('ồ','o').replace('Ồ','O');
    }
    if(obj.indexOf('ố') != -1 || obj.indexOf('Ố') != -1){
      obj = obj.replace('ố','o').replace('Ố','O');
    }
    if(obj.indexOf('ổ') != -1 || obj.indexOf('Ổ') != -1){
      obj = obj.replace('ổ','o').replace('Ổ','O');
    }
    if(obj.indexOf('ộ') != -1 || obj.indexOf('Ộ') != -1){
      obj = obj.replace('ộ','o').replace('Ộ','O');
    }
    if(obj.indexOf('ỗ') != -1 || obj.indexOf('Ỗ') != -1){
      obj = obj.replace('ỗ','o').replace('Ỗ','O');
    }
    if(obj.indexOf('ọ') != -1 || obj.indexOf('Ọ') != -1){
      obj = obj.replace('ọ','o').replace('Ọ','O');
    }
    if(obj.indexOf('ò') != -1 || obj.indexOf('Ò') != -1){
      obj = obj.replace('ò','o').replace('Ò','O');
    }
    if(obj.indexOf('ơ') != -1 || obj.indexOf('Ơ') != -1){
      obj = obj.replace('ơ','o').replace('Ơ','O');
    }
    if(obj.indexOf('ờ') != -1 || obj.indexOf('Ờ') != -1){
      obj = obj.replace('ờ','o').replace('Ờ','O');
    }
    if(obj.indexOf('ớ') != -1 || obj.indexOf('Ớ') != -1){
      obj = obj.replace('ớ','o').replace('Ớ','O');
    }
    if(obj.indexOf('ở') != -1 || obj.indexOf('Ở') != -1){
      obj = obj.replace('ở','o').replace('Ở','O');
    }
    if(obj.indexOf('ợ') != -1 || obj.indexOf('Ợ') != -1){
      obj = obj.replace('ợ','o').replace('Ợ','O');
    }
    if(obj.indexOf('ỡ') != -1 || obj.indexOf('Ỡ') != -1){
      obj = obj.replace('ỡ','o').replace('Ỡ','O');
    }

    if(obj.indexOf('ú') != -1 || obj.indexOf('Ú') != -1){
      obj = obj.replace('ú','u').replace('Ú','U');
    }
    if(obj.indexOf('ù') != -1 || obj.indexOf('Ù') != -1){
      obj = obj.replace('ù','u').replace('Ù','U');
    }
    if(obj.indexOf('ủ') != -1 || obj.indexOf('Ủ') != -1){
      obj = obj.replace('ủ','u').replace('Ủ','U');
    }
    if(obj.indexOf('ũ') != -1 || obj.indexOf('Ũ') != -1){
      obj = obj.replace('ũ','u').replace('Ũ','U');
    }
    if(obj.indexOf('ụ') != -1 || obj.indexOf('Ụ') != -1){
      obj = obj.replace('ụ','u').replace('Ụ','U');
    }
    if(obj.indexOf('ư') != -1 || obj.indexOf('Ư') != -1){
      obj = obj.replace('ư','u').replace('Ư','U');
    }
    if(obj.indexOf('ừ') != -1 || obj.indexOf('Ừ') != -1){
      obj = obj.replace('ừ','u').replace('Ừ','U');
    }
    if(obj.indexOf('ứ') != -1 || obj.indexOf('Ứ') != -1){
      obj = obj.replace('ứ','u').replace('Ứ','U');
    }
    if(obj.indexOf('ử') != -1 || obj.indexOf('Ử') != -1){
      obj = obj.replace('ử','u').replace('Ử','U');
    }
    if(obj.indexOf('ự') != -1 || obj.indexOf('Ự') != -1){
      obj = obj.replace('ự','u').replace('Ự','U');
    }
    if(obj.indexOf('ữ') != -1 || obj.indexOf('Ữ') != -1){
      obj = obj.replace('ữ','u').replace('Ữ','U');
    }

    if(obj.indexOf('í') != -1 || obj.indexOf('Í') != -1){
      obj = obj.replace('í','i').replace('Í','I');
    }
    if(obj.indexOf('ì') != -1 || obj.indexOf('Ì') != -1){
      obj = obj.replace('ì','i').replace('Ì','I');
    }
    if(obj.indexOf('ỉ') != -1 || obj.indexOf('Ỉ') != -1){
      obj = obj.replace('ỉ','i').replace('Ỉ','I');
    }
    if(obj.indexOf('ĩ') != -1 || obj.indexOf('Ĩ') != -1){
      obj = obj.replace('ĩ','i').replace('Ĩ','I');
    }
    if(obj.indexOf('ị') != -1 || obj.indexOf('Ị') != -1){
      obj = obj.replace('ị','i').replace('Ị','I');
    }
    

    return obj;
  }
  /**
   * Lọc theo giờ mở cửa
   */
  clickDoorOpen(){
    var se = this;
    if(se.listSearchDisplay && se.listSearchDisplay.length >0){
      //Lọc lại list marker trên map 
      if(se.markers && se.markers.length >0){
        se.markersOriginal = se.markers;
      }
      se.filterHourOpen = se.filterHourOpen*-1;
      if(se.filterHourOpen == -1){
        se.zone.run(()=>{
          var curDate = new Date();
          var currentTime:any = moment(curDate).format("HHmm");
          //var currentTime=2100;
          se.listSearchDisplay = se.listSearchDisplay.filter((el)=>{
            return se.filterItemDoorOpen(el, currentTime);
          })
          se.listSearch = se.listSearch.filter((el1)=>{
            return se.filterItemDoorOpen(el1, currentTime);
          })

          se.clearMarkerAndRouting();
          se.bindMarkerPaging(se.listSearchDisplay,'clickdooropen');
        })
      }else{
        se.zone.run(()=>{
          //se.listSearchDisplay = [];
          se.listSearch = se.listSearchOriginal;
          se.clearMarkerAndRouting();
          se.bindMarker(se.listSearch,'clickdooropen');
        })
      }
      
    }else{
      se.filterHourOpen = se.filterHourOpen*-1;
      se.zone.run(()=>{
        se.listSearchDisplay = [];
        se.listSearch = se.listSearchOriginal;
        se.clearMarkerAndRouting();
        se.bindMarker(se.listSearch,se.curType);
      })
    }
  }

  filterItemDoorOpen(el, currentTime){
    if(el.workingHours.length >1){
      let wk0 = el.workingHours[0];
      let wk1 = el.workingHours[1];
      if(wk0){
        if(wk0.name.indexOf('24/24') != -1){
          return true;
        }if(wk0.name.indexOf('đêm') != -1){
          let fromTimeFirst:any = wk0.timeFrom.replace(':','');
          let toTimeFirst:any = '2400';
          let fromTimeSecond:any = '0000';
          let toTimeSecond:any = wk0.timeTo.replace(':','');
          return ( (currentTime*1 >= fromTimeFirst*1 && currentTime*1 <= toTimeFirst*1) || (currentTime*1 >= fromTimeSecond*1 && currentTime*1 <= toTimeSecond*1) );
        }
        else{
          let fromTime = wk0.timeFrom.replace(':','');
          let toTime = wk0.timeTo.replace(':','');
          return (currentTime*1 >= fromTime*1 && currentTime*1 <= toTime*1);
        }
      }

      if(wk1){
        if(wk1.name.indexOf('24/24') != -1){
          return true;
        }if(wk1.name.indexOf('đêm') != -1){
          let fromTimeFirst:any = wk1.timeFrom.replace(':','');
          let toTimeFirst:any = '2400';
          let fromTimeSecond:any = '0000';
          let toTimeSecond:any = wk1.timeTo.replace(':','');
          return ( (currentTime*1 >= fromTimeFirst*1 && currentTime*1 <= toTimeFirst*1) || (currentTime*1 >= fromTimeSecond*1 && currentTime*1 <= toTimeSecond*1) );
        }
        else{
          let fromTime = wk1.timeFrom.replace(':','');
          let toTime = wk1.timeTo.replace(':','');
          return (currentTime*1 >= fromTime*1 && currentTime*1 <= toTime*1);
        }
      }
      
    }else{
      if(el.workingHours[0].name.indexOf('24/24') != -1){
        return true;
      }if(el.workingHours[0].name.indexOf('đêm') != -1){
        let fromTimeFirst:any = el.workingHours[0].timeFrom.replace(':','');
        let toTimeFirst:any = '2400';
        let fromTimeSecond:any = '0000';
        let toTimeSecond:any = el.workingHours[0].timeTo.replace(':','');
        return ( (currentTime*1 >= fromTimeFirst*1 && currentTime*1 <= toTimeFirst*1) || (currentTime*1 >= fromTimeSecond*1 && currentTime*1 <= toTimeSecond*1) );
      }
      else{
        let fromTime = el.workingHours[0].timeFrom.replace(':','');
        let toTime = el.workingHours[0].timeTo.replace(':','');
        return (currentTime*1 >= fromTime*1 && currentTime*1 <= toTime*1);
      }
    }
  }

  //   this.locationAccuracy.canRequest().then((canRequest: boolean) => {
  //     if (canRequest) {
  //       this.getLocationCoordinates();
  //     } else {
  //       this.askToTurnOnGPS();
  //     }
  //   });
  // }

  askToTurnOnGPS() {
    var se = this;
    se.openNativeSettings.open('locations').then(()=>{
      se.requestGPS = true;
      se.loadDataAfterSearchItem();
    })
  }

  getLocationCoordinates() {
    this.requestGPS = true;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.locationCoords.latitude = resp.coords.latitude;
      this.locationCoords.longitude = resp.coords.longitude;
      this.locationCoords.accuracy = resp.coords.accuracy;
      this.locationCoords.timestamp = resp.timestamp;

      this.deviceLocation.latitude = resp.coords.latitude;
      this.deviceLocation.longitude = resp.coords.longitude;

      this.initMap(null);

      //if(!this.regionCode && this.listSearchDisplay.length == 0){
        this.getCityNameByLatLng(this.locationCoords.latitude,this.locationCoords.longitude);
      //}

      //this.getGeoencoder(this.locationCoords.latitude,this.locationCoords.longitude )

    }).catch((error) => {
      // alert('Xin vui lòng mở dịch vụ định vị để tiếp tục sử dụng tính năng này.');
      // setTimeout(()=>{
      //   this.navCtrl.back();
      // },2000)
      this.content.scrollToPoint(0, 324 ,500);
      this.showWarning('Xin vui lòng mở dịch vụ định vị để tiếp tục sử dụng tính năng này.');
      this.requestGPS = false;
      this.locationCoords.latitude = 10.7679735;
      this.locationCoords.longitude = 106.6934983;
      this.initEmptyMap();
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
        se.content.scrollToTop(50);
        var cityName = result[0].administrativeArea;
        se.searchhotel.inputExperienceRegionName = cityName;
        if(!se.searchhotel.deviceLocation){
          se.searchhotel.deviceLocation  = {};
        }
        se.searchhotel.deviceLocation.regionName = cityName;
        se.regionCode= se.convertFontVNI(cityName).replace(/ /g,'-');
        se.regionCode = se.regionCode.toLowerCase();
        se.regionCode = se.regionCode.replace('---','-');
        se.regionCode = se.regionCode.replace('-province','');
        se.regionCode = se.regionCode.replace('tinh-','');
        se.regionCode = se.regionCode.replace('-district','');
        if(se.regionCode){
          se.replaceRegioncode(); 
          se.deviceLocation.regioncode = se.regionCode;
          se.getListSuggestByRegionCode(se.regionCode,null);
          se.textsearch ='';
          se.getTagByTypeName();
          se.buildTextSearch();
          se.reCountFilter();
          // if(se.searchhotel.stringFilterName && se.searchhotel.stringFilterName.length >0){
          //   se.textsearch += se.searchhotel.stringFilterName;
          // }
          if(se.textsearch && se.textsearch.length >0){
            if(se.textsearch.indexOf(cityName) == -1){
              se.textsearch += ' | ' +cityName;
            }
          }else{
            se.textsearch += cityName;
          }
          

          //se.content.scrollToTop(100);
        }
      }
    )
    .catch((error: any) => 
    {
    //   $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&lon='+lng, function(data){
    //     if(data){
    //     se.content.scrollToTop(50);
    //     var cityName = data.address.state;
    //     se.searchhotel.inputExperienceRegionName = cityName;
    //     se.regionCode= se.convertFontVNI(cityName).replace(/ /g,'-');
    //       if(se.regionCode){
    //         if(se.regionCode == 'Quang-Nam'){
    //           se.regionCode = 'hoi-an';
    //         }
    //         if(se.regionCode == 'Ho-Chi-Minh' || se.regionCode == 'Thanh-Pho-Ho-Chi-Minh' || se.regionCode == 'Ho-Chi-Minh-City'){
    //           se.regionCode = 'ho-chi-minh';
    //         }
    //         if(se.regionCode == 'Lam-Dong'){
    //           se.regionCode = 'da-lat';
    //         }
    //         se.deviceLocation.regioncode = se.regionCode;
    //         se.getListSuggestByRegionCode(se.regionCode,null);
    //         se.textsearch ='';
    //         se.getTagByTypeName();
    //         se.buildTextSearch();
    //         se.textsearch += ' | ' + data.address.state;
    //       }
    //     }
    //   })
    });
    
  }



  replaceRegioncode(){
    var se = this;
    if(se.regionCode == 'quang-nam'){
      se.regionCode = 'hoi-an';
    }
    if(se.regionCode == 'ho-chi-minh' || se.regionCode == 'thanh-pho-ho-chi-minh' || se.regionCode == 'ho-chi-minh-city'){
      se.regionCode = 'ho-chi-minh';
    }
    if(se.regionCode == 'lam-dong'){
      se.regionCode = 'da-lat';
    }
    if(se.regionCode.indexOf('binh-thuan') != -1){
      se.regionCode = 'phan-thiet';
    }
    if(se.regionCode.indexOf('vung-tau') != -1 || se.regionCode.indexOf('ba-ria') != -1){
      se.regionCode = 'vung-tau';
    }
    if(se.regionCode.indexOf('hue') != -1){
      se.regionCode = 'hue';
    }
    if(se.regionCode.indexOf('binh-dinh') != -1){
      se.regionCode = 'quy-nhon';
    }
    if(se.regionCode.indexOf('khanh-hoa') != -1){
      se.regionCode = 'nha-trang';
    }
    if(se.regionCode == 'hanoi'){
      se.regionCode = 'ha-noi';
    }
    if(se.regionCode == 'quang-ninh'){
      se.regionCode = 'vinh-ha-long';
    }
    if(se.regionCode == 'kien-giang'){
      se.regionCode = 'phu-quoc';
    }
  }

  likePlace(item){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            se.bindPlaceLikeLocal(item, true, se.listSearch);
            se.bindPlaceLikeLocal(item, true, se.listSearchOriginal);
            se.zone.run(()=>{ item.totalLike +=1; })
            var text = "Bearer " + auth_token;
            var header ={ authorization: text};
            var body = item.id;
            let urlLikePlace = C.urls.baseUrl.urlMobile + '/api/Data/LikePlace';
            se.gf.RequestApi('POST',urlLikePlace,header,body,'ExperienceSearch', 'likePlace').then((data:any)=>{
              
            })
        }else{
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        }
      })
  }

  unlikePlace(item){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            se.bindPlaceLikeLocal(item, false, se.listSearch);
            se.bindPlaceLikeLocal(item, false, se.listSearchOriginal);
            se.zone.run(()=>{ item.totalLike -=1; })
            var text = "Bearer " + auth_token;
            var header = { authorization: text};
            var body = item.id;
            let urlLikePlace = C.urls.baseUrl.urlMobile + '/api/Data/UnLikePlace';
            se.gf.RequestApi('POST',urlLikePlace,header,body,'ExperienceSearch', 'unlikePlace').then((data:any)=>{
              
            })
        }else{
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        }
      })
  }

  bindPlaceLikeLocal(item, islike, listItem){
    var se = this;
    if(listItem && listItem.length>0){
      se.zone.run(()=>{
        listItem.forEach(element => {
          if(islike){
            if(element.id == item.id){
              element.liked = true;
            }
          }else{
            if(element.id == item.id){
              element.liked = false;
            }
          }
        });
      })
    }
  }

  sharePlace(item){
    this.socialSharing.share(null, null, null, item.shareUrl).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }

  checkItemLiked(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.dataListLike.length; i++) {
        if (this.dataListLike.indexOf(id) != -1) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }

  public async showConfirmLogin(msg){
    let alert = await this.alertCtrl.create({
      backdropDismiss: false,
      message: msg,
      cssClass: 'experience-search-confirm',
      buttons: [
      {
        text: 'Để sau',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('blogtripdefault');
          this.zone.run(()=>{
            this.username= "";
          })
          alert.dismiss();
        }
      },
      {
        text: 'Đăng nhập',
        role: 'OK',
        handler: () => {
          this.storage.remove('auth_token');
          this.storage.remove('email');
          this.storage.remove('username');
          this.storage.remove('jti');
          this.storage.remove('userInfoData');
          this.storage.remove('userRewardData');
          this.storage.remove('point');
          this.storage.remove('blogtripdefault');
          this.zone.run(()=>{
            this.username= "";
          })
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
    });
    alert.present();
    alert.onDidDismiss().then((data)=>{
    })
  }

  slidechange(){
    var se = this;
    se.markerhaschange = false;
    se.slidehaschange= true;
    se.allowSortByCurrentLocation = true;
    se.slider.getActiveIndex().then((currentIndex)=>{
      se.currentItemSelect = se.listSearchDisplay[currentIndex];
      if(se.currentItemSelect){
        if(se.map.getZoom() >= 16){
          se.markerClick(se.currentItemSelect,se.currentItemSelect,se.map, true, true);
        }else{
          se.markerIconClick(se.currentItemSelect,se.currentItemSelect,se.map, true);
        }
        
      }
    });
    se.clearRoute();
  }

  scrollFunction(ev){
    var se = this;
    if(ev.detail.scrollTop >= 4 ){
      $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
      if(!se.hasSortPlaceByCurrentLocation){
        se.sortPlaceByCurrentLocation();
      }
      
      se.hasSortPlaceByCurrentLocation = true;
    }else{
      se.hasSortPlaceByCurrentLocation = false;
      $('.div-float-item-search').removeClass('float-disable').addClass('float-visible');
    }
    if(ev.detail.event.target){
      let dh = ev.detail.event.target.clientHeight - ev.detail.scrollTop;
      se.currentScrollPosition = ev.detail.scrollTop;
      console.log(se.currentScrollPosition);
      //if(ev.detail.scrollTop >= 568 ){
      if(dh <= 150 ){
        $('.float-search-white-bar').removeClass('float-disable').addClass('float-visible');
        $('.float-search-top').removeClass('float-disable').addClass('float-visible');
        $('.float-search').removeClass('float-visible').addClass('float-disable');
        //$('.item-filter').removeClass('cls-show').addClass('cls-hide');
      }else{
        $('.float-search-white-bar').removeClass('float-visible').addClass('float-disable');
        $('.float-search-top').removeClass('float-visible').addClass('float-disable');
        $('.float-search').removeClass('float-disable').addClass('float-visible');
        //$('.item-filter').removeClass('cls-hide').addClass('cls-show');
      }
    }
    
    
  }

  doInfinite(infiniteScroll){
    var se = this;
    if(se.loaddatadone){
      se.zone.run(() => {
        se.pageCount = se.pageCount + 1;
        se._infiniteScroll = infiniteScroll;
        se.loadDataInfinite();
    })
    }else{
      if(se._infiniteScroll){
        se._infiniteScroll.target.complete();
      }
    }
    
  }

  loadDataInfinite(){
    var se = this,tags= '';
      se.totalPage = Math.round(se.listSearch.length /5);
      let count = se.listSearchDisplay.length;
      if(count >= se.listSearch.length){
        return;
      }
      let page = count + 5;
      if(page > se.listSearch.length)
      {
        page = se.listSearch.length;
        if(se._infiniteScroll){
          se._infiniteScroll.target.complete();
        }
      }
      var listdatapaging = [];
      for(let i = count; i < page; i ++){
        //if(!se.gf.checkExistsItemInArray(se.listSearchDisplay,se.listSearch[i], 'experiencesearch' )){
          //se.listSearchDisplay.push(se.listSearch[i]);
          listdatapaging.push(se.listSearch[i]);
        //}
      }
      se.loadDataPaging(listdatapaging);
  }

  loadDataPaging(data){
    var se = this;
      se.bindMarkerPaging(data,se.searchhotel.experiencesearchTagsId);
  }

  disableDashScroll(){
    var se = this;
    se.zone.run(()=>{
      se.dashScrollDisabled = true;
    })
  }
  enableDashScroll(){
    var se = this;
    se.zone.run(()=>{
      se.dashScrollDisabled = false;
    })
  }

  async showWarning(msg){
    var se = this;
    let toast = await se.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  createPopupClass() {
    /**
     * A customized popup on the map.
     * @param {!google.maps.LatLng} position
     * @param {!Element} content The bubble div.
     * @constructor
     * @extends {google.maps.OverlayView}
     */
    function Popup(position, content) {
      this.position = position;
  
      if(!content){
        return;
      }
      content.classList.add('popup-bubble');
  
      // This zero-height div is positioned at the bottom of the bubble.
      var bubbleAnchor = document.createElement('div');
      bubbleAnchor.classList.add('popup-bubble-anchor');

      var bubbleAnchorSub = document.createElement('div');
      bubbleAnchorSub.classList.add('popup-bubble-anchor-sub');
      bubbleAnchorSub.style.borderLeft= '4px solid transparent';
      bubbleAnchorSub.style.borderRight='4px solid transparent';
      bubbleAnchorSub.style.borderTop= '6px solid #003c71';
      bubbleAnchorSub.style.width='0';
      bubbleAnchorSub.style.height='0';
      bubbleAnchor.style.marginTop='-5px';
      bubbleAnchor.style.marginLeft='-4px';
      bubbleAnchorSub.style.marginTop='3px';
      bubbleAnchorSub.style.marginLeft='50.1%';
      //bubbleAnchorSub.style.display='none';

      //bubbleAnchor.appendChild(bubbleAnchorSub);

      bubbleAnchor.appendChild(content);
      $(content).children().remove();
      content.appendChild(bubbleAnchorSub);
      bubbleAnchor.style.borderLeft= '4px solid transparent';
      bubbleAnchor.style.borderRight='4px solid transparent';
      bubbleAnchor.style.borderTop= '6px solid #ffffff';
      bubbleAnchor.style.width='0';
      bubbleAnchor.style.height='0';
      bubbleAnchor.style.marginTop='-5px';
      bubbleAnchor.style.marginLeft='-4px';

      //var popupBubbleAnchor = document.getElementsByClassName('popup-bubble-anchor');
  
      // This zero-height div is positioned at the bottom of the tip.
      this.containerDiv = document.createElement('div');
      this.containerDiv.classList.add('popup-container');
      this.containerDiv.appendChild(bubbleAnchor);
  
      // Optionally stop clicks, etc., from bubbling up to the map.
      google.maps.OverlayView.preventMapHitsAndGesturesFrom(this.containerDiv);
    }
    
    // ES5 magic to extend google.maps.OverlayView.
    Popup.prototype = Object.create(google.maps.OverlayView.prototype);
  
    /** Called when the popup is added to the map. */
    Popup.prototype.onAdd = function() {
      if(this.containerDiv){
        this.getPanes().floatPane.appendChild(this.containerDiv);
      }
    };
  
    /** Called when the popup is removed from the map. */
    Popup.prototype.onRemove = function() {
      if (this.containerDiv && this.containerDiv.parentElement) {
        this.containerDiv.parentElement.removeChild(this.containerDiv);
      }
    };
    // var overlay = new google.maps.OverlayView();
    // overlay.draw = function() {};
    // overlay.setMap(this.map);
    /** Called each frame when the popup needs to draw itself. */
    Popup.prototype.draw = function() {
      var divPosition = this.getProjection().fromLatLngToDivPixel(this.position);
  
      // Hide the popup when it is far out of view.
      var display = 'block' ;
          // Math.abs(divPosition.x) < 4000000 && Math.abs(divPosition.y) < 4000000 ?
          // 'block' :
          // 'none';
      if(this.containerDiv){
        if (display === 'block') {
          this.containerDiv.style.left = divPosition.x + 'px';
          this.containerDiv.style.top = divPosition.y + 'px';
          this.containerDiv.style.position = 'absolute';
          this.containerDiv.style.width = '5px';
        }
        if (this.containerDiv.style.display !== display) {
          this.containerDiv.style.display = display;
        }
      }
      
    };
  
    return Popup;
  }
  
  changeState(){
    var se = this;
    if(se.drawerState == DrawerState.Docked){
      se.drawerState = DrawerState.Top;
      $('.content-container').removeClass('cls-state-docked').addClass('cls-state-top');
    }
    else if(se.drawerState == DrawerState.Top){
      se.drawerState = DrawerState.Bottom;
      $('.content-container').removeClass('cls-state-top').addClass('cls-state-bottom');
    }
    else if(se.drawerState == DrawerState.Bottom){
      se.drawerState = DrawerState.Docked;
      $('.content-container').removeClass('cls-state-bottom').addClass('cls-state-docked');
    }
    
  }

  setBottomState(){
    var se = this;
    se.drawerState = DrawerState.Bottom;
    $('.content-container').removeClass('cls-state-top').removeClass('cls-state-docked').addClass('cls-state-bottom');
  }

  setDockState(){
    var se = this;
    se.drawerState = DrawerState.Docked;
    $('.content-container').removeClass('cls-state-bottom').removeClass('cls-state-top').addClass('cls-state-docked');
  }

  bindHourOpenAndAdressAndDistance(item){
    var se = this;
    if(item.workingHours && item.workingHours.length >0){
      item.workingHoursDisplay = '';
      //item.workingHoursDisplay = item.workingHours[0].name + ' | '+ item.workingHours[0].timeFrom + '-'+ item.workingHours[0].timeTo;
      item.workingHours.forEach(element => {
        if(!item.workingHoursDisplay){
          item.workingHoursDisplay = element.name + ' | '+ element.timeFrom + '-'+ element.timeTo;
        }else{
          item.workingHoursDisplay += " , " + element.name + ' | '+ element.timeFrom + '-'+ element.timeTo;
        }
      });
    }
    se.bindShortAdress(item);
    se.calculateDistanceMarker(item,'totalDistance', null);
    if(!se.gf.checkExistsItemInArray(se.listSearchDisplay, item, 'experiencesearch')){
      se.listSearchDisplay.push(item);
    }
    
    se.itemsearchfocus = item;
    
    }
 
    setCurrentMarkerSelected(marker){
      var se = this;
      var position = new google.maps.LatLng(marker.latitude,marker.longitude);
      se.map.setCenter(position);

      
      if($('.popup-selected').length >0 && $('.popup-selected').children().length >0){
        $('.popup-selected').children()[0].style.borderTop = 'solid 6px #003c71';
        $('.popup-selected').children()[0].style.marginTop = '3px';
        $('.popup-selected').parent()[0].style.borderTop = 'solid 6px #ffffff';
        
      }
      $('.popup-selected').removeClass('popup-selected');
      
      $('#'+marker.id).addClass('popup-selected');
      if($('#'+marker.id).children().length>0){
        $('#'+marker.id).children()[0]['style']['display'] = 'block';
        $('#'+marker.id).children()[0].style.borderTop = 'solid 6px #ffffff';
        $('#'+marker.id).children()[0].style.marginTop = '1px';
        $('#'+marker.id).parent()[0].style.borderTop = 'solid 6px #003c71';
      }
      
      
    }

    /**
     * Filter lại place theo dk lọc
     */
    combineFilterAndCount(datalist){
      var se = this;
      let data = [...datalist];
        let databeforefilter = [...datalist];
        se.dataafterfilter = databeforefilter;
      if(databeforefilter && databeforefilter.length >0){
        if(se.searchhotel.ef_arrlocalcheck && se.searchhotel.ef_arrlocalcheck.length >0){
          let strlocalcheck = se.searchhotel.ef_arrlocalcheck.join(',');
          se.dataafterfilter = se.searchhotel.ef_arrlocalcheck.length >0 ? se.getFilterDataLocal(databeforefilter, se.searchhotel.ef_arrlocalcheck) : databeforefilter;
        }
        //countfilter theo khu vực con
        if(se.searchhotel.ef_arrsubregioncheck && se.searchhotel.ef_arrsubregioncheck.length >0){
          let strsubregioncheck = se.searchhotel.ef_arrsubregioncheck.join(',');
          se.dataafterfilter = se.searchhotel.ef_arrsubregioncheck.length >0 ? se.getFilterDataSubRegion(databeforefilter, se.searchhotel.ef_arrsubregioncheck) : databeforefilter;
        }
        //countfilter theo loại hình
          let strhoteltypecheck = se.searchhotel.ef_arrhoteltypecheck.join(',');
          if(se.dataafterfilter && se.dataafterfilter.length>0){
            se.dataafterfilter = se.searchhotel.ef_arrhoteltypecheck.length >0 ? se.getFilterDataHotelType(se.dataafterfilter, se.searchhotel.ef_arrhoteltypecheck) : se.dataafterfilter;
          }
          //countfilter theo giờ mở cửa
          if(se.dataafterfilter && se.dataafterfilter.length>0){
            se.dataafterfilter = se.searchhotel.ef_arrhouropencheck.length >0 ? se.getFilterDataByOpenHour(se.dataafterfilter, se.searchhotel.ef_arrhouropencheck) : se.dataafterfilter;
          }
          //countfilter theo khoảng cách
          if(se.dataafterfilter && se.dataafterfilter.length>0){
            se.dataafterfilter = se.searchhotel.ef_arrdistancecheck.length >0 ? se.getFilterDataByDistance(se.dataafterfilter, se.searchhotel.ef_arrdistancecheck) : se.dataafterfilter;
          }
          //countfilter theo phong cách
          let strstyle = se.searchhotel.ef_arrstylecheck.join(',');
          if(se.dataafterfilter && se.dataafterfilter.length>0){
            //let arrfilter = se.dataafterfilter.map((item) => { return item.tags})
            se.dataafterfilter = se.searchhotel.ef_arrstylecheck.length >0 ? se.dataafterfilter.filter((e:any) => { return se.searchhotel.ef_arrstylecheck.filter( it => { return e.tags.includes(it)}).length >0 }) : se.dataafterfilter;
          }
          
          if(se.activityService.listExperienceSearch && se.activityService.listExperienceSearch.length >0){
            se.dataafterfilter = se.dataafterfilter.filter((e:any) => { return se.activityService.listExperienceSearch.filter((item)=>{ return e.id == item.placeId }).length >0 })
          }
          //se.recountFilter(se.dataafterfilter);
          return se.dataafterfilter;
      }
    }

    combineDataPlace(regioncode, listmapdata) : Promise<any>{
      var se = this;
      return new Promise((resolve, reject) =>{
        //vào trang chi tiết nếu chọn 1 địa điểm ko phải vùng
        // if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId){
        //     return resolve(listmapdata);
        // }else{
            var strURL_CountFilter = C.urls.baseUrl.urlMobile + '/api/Data/CountFilterPlace?regionCodes=' + regioncode;
            se.gf.RequestApi('GET',strURL_CountFilter, {}, {}, "experienceFilter","CountFilterPlace").then((data:any)=>{
              if(data && data.data.length >0){
                    var datalist = listmapdata.map((item, row)=> {
                      const found:any = data.data.find((el) => {return el.id == item.id });
                      var newitem = { id: found.id, childRegionId :found.childRegionId, subRegionId: found.subRegionId,tags: found.tags};
                      return {...item,...newitem};
                    })
                return resolve(datalist);
              }
            })
          //}
        
      })
      
    }

    getFilterDataByDistance(listdata, arrdistance){
      var se = this;
      var listfilter = [...listdata];
      var listresult:any = [];
      arrdistance.forEach(d => {
        let list = listfilter.filter((e:any) => { return se.getWhereByDistance(e, d) });
        if(list && list.length>0 ){
          listresult.push(...list);
        }
      });
      return listresult;
    }
    
    getWhereByDistance(item, distance){
      if(distance == 1){
        return item.totalDistance >=0 && item.totalDistance < 1;
      }
      else if(distance == 2){
        return item.totalDistance >=1 && item.totalDistance < 5;
      }
      else if(distance == 3){
        return item.totalDistance >=5 && item.totalDistance < 10;
      }
      else if(distance == 4){
        return item.totalDistance >=10 && item.totalDistance < 20;
      }
    }

    getFilterDataByOpenHour(listdata, arropenhour){
      var se = this;
      var listfilter = [...listdata];
      var listresult:any = [];
      arropenhour.forEach(h => {
        let list = se.filterOpenHourWithworkinghoursId(listdata, h);
        if(list && list.length>0 ){
          if(listresult.length ==0){
            listresult.push(...list);
          }else {
            list.forEach(element => {
              if(!se.gf.checkExistsItemInArray(listresult, element, 'searchexperience')){
                listresult.push(element);
              }
            });
            
          }
          
        }
      });
      return listresult;
    }

    getFilterDataHotelType(listdata, arrhoteltype){
      var se = this;
      var listfilter = [...listdata];
      var listresult:any = [];
      arrhoteltype.forEach(ht => {
        let list = listfilter.filter((el)=>{ return el.tags.includes(ht)})
        if(list && list.length>0 ){
          if(listresult.length ==0){
            listresult.push(...list);
          }else {
            list.forEach(element => {
              if(!se.gf.checkExistsItemInArray(listresult, element, 'searchexperience')){
                listresult.push(element);
              }
            });
            
          }
          
        }
      });
      return listresult;
    }
    
    getFilterDataLocal(listdata, arrlocal){
      var se = this;
      var listfilter = [...listdata];
      var listresult:any = [];
      arrlocal.forEach(localid => {
        let list = listfilter.filter((el)=>{ return el.childRegionId == localid})
        if(list && list.length>0 ){
          if(listresult.length ==0){
            listresult.push(...list);
          }else {
            list.forEach(element => {
              if(!se.gf.checkExistsItemInArray(listresult, element, 'searchexperience')){
                listresult.push(element);
              }
            });
            
          }
          
        }
      });
      return listresult;
    }
    
    getFilterDataSubRegion(listdata, arrlocal){
      var se = this;
      var listfilter = [...listdata];
      var listresult:any = [];
      arrlocal.forEach(subregionid => {
        let list = listfilter.filter((el)=>{ return el.subRegionId == subregionid })
        if(list && list.length>0 ){
          if(listresult.length ==0){
            listresult.push(...list);
          }else {
            list.forEach(element => {
              if(!se.gf.checkExistsItemInArray(listresult, element, 'searchexperience')){
                listresult.push(element);
              }
            });
            
          }
          
        }
      });
      return listresult;
    }

    /**
   * Lọc list dữ liệu theo khung giờ hoạt động để đếm số địa điểm
   * @param data list dữ liệu
   */
  filterOpenHourWithworkinghoursId(data, workinghoursId){
    var se = this;
    return data.filter((el)=>{
      if(el.workingHours.length >1){
        let wk0 = el.workingHours[0];
        let wk1 = el.workingHours[1];
        if(wk0){
          if(wk0.name.indexOf('24/24') != -1){
            return true;
          }if(wk0.name.indexOf('đêm') != -1){
            let fromTimeFirst = wk0.timeFrom.replace(':','');
            let toTimeFirst = '2400';
            let fromTimeSecond = '0000';
            let toTimeSecond = wk0.timeTo.replace(':','');
            return (se.getTimeFilterWithworkinghoursId(fromTimeFirst, toTimeFirst, workinghoursId) || se.getTimeFilterWithworkinghoursId(fromTimeSecond, toTimeSecond, workinghoursId) );
          }
          else{
            let fromTime = wk0.timeFrom.replace(':','');
            let toTime = wk0.timeTo.replace(':','');
            return se.getTimeFilterWithworkinghoursId(fromTime, toTime, workinghoursId);
          }
        }

        if(wk1){
          if(wk1.name.indexOf('24/24') != -1){
            return true;
          }if(wk1.name.indexOf('đêm') != -1){
            let fromTimeFirst = wk1.timeFrom.replace(':','');
            let toTimeFirst = '2400';
            let fromTimeSecond = '0000';
            let toTimeSecond = wk1.timeTo.replace(':','');
            return (se.getTimeFilterWithworkinghoursId(fromTimeFirst, toTimeFirst, workinghoursId) || se.getTimeFilterWithworkinghoursId(fromTimeSecond, toTimeSecond, workinghoursId) );
          }
          else{
            let fromTime = wk1.timeFrom.replace(':','');
            let toTime = wk1.timeTo.replace(':','');
            return se.getTimeFilterWithworkinghoursId(fromTime, toTime, workinghoursId);
          }
        }
        
      }else{
        if(el.workingHours[0].name.indexOf('24/24') != -1){
          return true;
        }if(el.workingHours[0].name.indexOf('đêm') != -1){
          let fromTimeFirst = el.workingHours[0].timeFrom.replace(':','');
          let toTimeFirst = '2400';
          let fromTimeSecond = '0000';
          let toTimeSecond = el.workingHours[0].timeTo.replace(':','');
          return (se.getTimeFilterWithworkinghoursId(fromTimeFirst, toTimeFirst, workinghoursId) || se.getTimeFilterWithworkinghoursId(fromTimeSecond, toTimeSecond, workinghoursId) );
        }
        else{
          let fromTime = el.workingHours[0].timeFrom.replace(':','');
          let toTime = el.workingHours[0].timeTo.replace(':','');
          return se.getTimeFilterWithworkinghoursId(fromTime, toTime, workinghoursId);
        }
      }
      
    })
  }

  getTimeFilterWithworkinghoursId(fromTime, toTime,workinghoursId){
    var se = this;
    let minFromTime ='';
    let maxToTime='';
    minFromTime = se.getMinFromTime(workinghoursId);
    maxToTime = se.getMaxToTime(workinghoursId);

    return  (minFromTime >= fromTime && minFromTime <= toTime && maxToTime >= fromTime && maxToTime <= toTime) || (fromTime >= minFromTime && fromTime <= maxToTime && toTime >= minFromTime && toTime <= maxToTime || (fromTime >= minFromTime && fromTime <= maxToTime && toTime > maxToTime) ||(toTime >= minFromTime && toTime <= maxToTime) );
  }

  /**
   * Tính khoảng cách giữa các điểm so với vị trí hiện tại
   * @rest: item cần sort
   * @sortColumn: tên cột dữ liệu sort
   */
  calculateDistanceMapData(data) : Promise<any>{
    var se = this, sortColumn = 'totalDistance';
    return new Promise((resolve, reject) => {
      data.forEach(rest => {
          if(!rest.latitude || !rest.longitude){
            rest[sortColumn] =0;
          }else{
              if(se.deviceLocation.latitude && se.deviceLocation.longitude && !se.searchhotel.inputExperienceItem){
                let distancekm = (Math.round(L.latLng(se.deviceLocation.latitude, se.deviceLocation.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000);
                if(distancekm < 50){
                  rest[sortColumn] = (Math.round(L.latLng(se.deviceLocation.latitude, se.deviceLocation.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
                }else{
                  rest[sortColumn] = (Math.round(L.latLng(se.locationCoords.latitude, se.locationCoords.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
                }
              }else{
                rest[sortColumn] = (Math.round(L.latLng(se.locationCoords.latitude, se.locationCoords.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
              }
          }
        })
       setTimeout(()=>{
        resolve(data);
       },200) 
    });
  }

  /**
   * Tính khoảng cách giữa các điểm so với vị trí hiện tại
   * data: listsort theo location hiện tại
   */
  calculateDistanceMapByCurrentLocationData(data, location) : Promise<any>{
    var se = this, sortColumn = 'totalDistance';
    return new Promise((resolve, reject) => {
      se.zone.run(()=>{
        data.forEach(rest => {
          if(!rest.latitude || !rest.longitude){
            rest[sortColumn] =0;
          }else{
              if(location.latitude && location.longitude){
                rest[sortColumn] = (Math.round(L.latLng(location.latitude, location.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
              }
          }
        })
       setTimeout(()=>{
        se.sortData(2, se.map.getZoom() >= 16 ? true : false);
        resolve(data);
       },200) 
      })
    });
  }

  handlerMapDraging(lat, lng){
    var se = this;
      $.get('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&lon='+lng, function(data){
        if(data){
        se.content.scrollToTop(50);
        //var cityName = data.address.state;
        var curRegion = '';
        if(data.address.state){
          curRegion = se.convertFontVNI(data.address.state).replace(/ /g,'-').replace('-tinh','').replace('tinh-','').replace('city','');
        }
        else if(data.address.city){
          curRegion = se.convertFontVNI(data.address.city).replace(/ /g,'-').replace('-tinh','').replace('tinh-','').replace('city','');
        }
        else if(data.address.county){
          curRegion = se.convertFontVNI(data.address.county).replace(/ /g,'-').replace('-tinh','').replace('tinh-','').replace('city','');
        }
        curRegion = curRegion.toLowerCase();
        curRegion = curRegion.replace('---','-');
        curRegion = curRegion.replace('-province','');
        curRegion = curRegion.replace('tinh-','');
        curRegion = curRegion.replace('-district','');
        //console.log(curRegion);

        if(curRegion == 'quang-nam'){
          curRegion = 'hoi-an';
        }
        if(curRegion == 'ho-chi-minh' || curRegion == 'thanh-pho-ho-chi-minh' || curRegion == 'ho-chi-minh-city'){
          curRegion = 'ho-chi-minh';
        }
        if(curRegion == 'lam-dong'){
          curRegion = 'da-lat';
        }
        if(curRegion.indexOf('binh-thuan') != -1){
          curRegion = 'phan-thiet';
        }
        if(curRegion.indexOf('vung-tau') != -1 || curRegion.indexOf('ba-ria') != -1){
          curRegion = 'vung-tau';
        }
        if(curRegion.indexOf('hue') != -1){
          curRegion = 'hue';
        }
        if(curRegion.indexOf('binh-dinh') != -1){
          curRegion = 'quy-nhon';
        }
        if(curRegion.indexOf('khanh-hoa') != -1){
          curRegion = 'nha-trang';
        }
        if(curRegion == 'hanoi'){
          curRegion = 'ha-noi';
        }
        if(curRegion == 'quang-ninh'){
          curRegion = 'vinh-ha-long';
        }
        if(curRegion == 'kien-giang'){
          curRegion = 'phu-quoc';
        }
       //console.log(curRegion);
          if(curRegion && curRegion != se.regionCode){
            se.clearFilter();
            se.reCountFilter();
            se.regionCode = curRegion;
            se.searchhotel.inputExperienceRegionName = se.convertRegionCodeToRegionName(curRegion);
              if(curRegion){
                //se.deviceLocation.regioncode = curRegion;
                se.textsearch ='';
                se.textsearch = se.convertRegionCodeToRegionName(curRegion);
                se.getListDataByRegionCode(curRegion);
              }
          }else{//cùng region thì clear icon và show popup
            if(se.map.getZoom() <16 && !se.hasCreateMarkerIcon){
              se.hasCreateMarkerIcon = true;
              se.hasCreateMarkerText = false;
              se.clearMarkerAndRouting();
              se.listSearchDisplay.forEach(element => {
                se.createMarkerIconOnly(element, se.listSearchDisplay[0]);
              });
            }else if(se.map.getZoom() >= 16 && !se.hasCreateMarkerText){
              se.hasCreateMarkerText = true;
              se.hasCreateMarkerIcon = false;
              se.clearMarkerAndRouting();
              se.clearMarkerSelected();
              se.listSearchDisplay.forEach(element => {
                se.addMarkersToMap(element);
              });
            }
            
          }
        
        }
      })
  }

  getListDataByRegionCode(regionCode){
    var se = this,
    urlSuggest='';
    se.pageCount = 0;
    //se.content.scrollToTop(200);
    $('.div-float-item-search').removeClass('float-visible').addClass('float-disable');
    if(regionCode){
      urlSuggest = C.urls.baseUrl.urlMobile + '/api/Data/GetPlace?regionCodes='+regionCode +'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
      //urlSuggest =  se.url + (tags ? '&Tags='+tags : '')+'&paging.pageNumber='+se.pageCount+'&paging.pageSize='+se.pageSize;
      se.gf.RequestApi('GET',urlSuggest,{},{},'ExperienceSearch', 'getListSuggestByRegionCode').then((data:any)=>{
        if(data && data.data.length >0){
          se.combineDataPlace(regionCode,data.data).then((datacombine)=>{
            if( !(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.placeId) ){
              se.calculateDistanceMapData(datacombine).then((data)=>{
                if(data && data.length ==0){
                  se.loaddatadone = true;
                  //se.showWarning('Không có trải nghiệm theo điều kiện tìm kiếm của bạn. Xin vui lòng chọn bộ lọc khác.');
                  return;
                }
                 data = se.combineFilterAndCount(data);
                 datacombine = data;

                 se.textsearch += " (" + datacombine.length + ")";
                  se.zone.run(()=>{
                    se.loaddatadone = true;
                    se.requestGPS = true;
                    //se.totalPage = Math.round(datacombine.length/5);
                  })
                  se.storage.get('auth_token').then(auth_token => {
                    if (auth_token) {
                        var text = "Bearer " + auth_token;
                        let urlLike = C.urls.baseUrl.urlMobile + '/api/Data/GetPlaceUserLike';
                        se.gf.RequestApi('GET', urlLike, {authorization: text}, {}, 'ExperienceSearch','GetPlaceUserLike').then((datalike:any) =>{
                          if(datalike && datalike.length >0){
                            se.dataListLike = datalike;
                            datacombine.forEach(element => {
                              element.liked = se.checkItemLiked(element.id) ? true: false;
                            });
                            se.bindDataListSuggest(datacombine, true);
                          }else{
                            se.bindDataListSuggest(datacombine, true);
                          }
                        })
                      }else{
                        se.bindDataListSuggest(datacombine, true);
                      }
                  })
                });
            }
            
          
          }) 
          
        }
        
      })
    }
  }

  clearFilter(){
    var se = this;
    se.searchhotel.ef_arrdistancecheck = [];
    se.searchhotel.ef_arrhoteltypecheck = [];
    se.searchhotel.ef_arrstylecheck = [];
    se.searchhotel.ef_arrlocalcheck = [];
    se.searchhotel.ef_arrhouropencheck = [];
    se.searchhotel.ef_arrsubregioncheck=[];
    se.searchhotel.ef_arrsubregionnamecheck=[];
    se.searchhotel.ef_arrhoteltypenamecheck = []
    se.searchhotel.ef_arrdistancenamecheck = []
    se.searchhotel.ef_arrhouropennamecheck=[];
    se.searchhotel.ef_arrstylenamecheck=[];
    se.searchhotel.ef_arrlocalnamecheck=[];
    se.searchhotel.ef_location =null;
    se.searchhotel.ef_hoteltype=null;
    se.searchhotel.ef_houropen=null;
    se.searchhotel.ef_style=null;
    se.searchhotel.stringFilterName="";
    se.searchhotel.inputExperienceItem = null;
    se.searchhotel.inputExperienceText = "";
    se.searchhotel.inputExperienceRegionCode = "";
  }

  gotoMyLocation(){
    var se = this;
    if(se.map){
      var position = '';
      if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.latitude && se.searchhotel.inputExperienceItem.longitude){
        position = new google.maps.LatLng(se.searchhotel.inputExperienceItem.latitude,se.searchhotel.inputExperienceItem.longitude);
      } 
      else{
        position = new google.maps.LatLng(se.deviceLocation.latitude,se.deviceLocation.longitude);
      }
      se.map.setCenter(position);
      //Nếu khác region thì load trải nghiệm
      if(se.deviceLocation.regioncode != se.searchhotel.inputExperienceItem.regionCode){
        if(se.searchhotel.inputExperienceItem && se.searchhotel.inputExperienceItem.latitude && se.searchhotel.inputExperienceItem.longitude){
          se.handlerMapDraging(se.searchhotel.inputExperienceItem.latitude, se.searchhotel.inputExperienceItem.longitude);
        } 
        else{
          se.handlerMapDraging(se.deviceLocation.latitude,se.deviceLocation.longitude);
        }
      }
    }
  }

  convertRegionCodeToRegionName(regionCode){
    var se = this;
    if(regionCode.indexOf('ho-chi-minh') != -1){
      return 'Hồ Chí Minh';
    }
    if(regionCode.indexOf('ha-noi') != -1){
      return 'Hà Nội';
    }
    if(regionCode.indexOf('da-nang') != -1){
      return 'Đà Nẵng';
    }
    if(regionCode.indexOf('vung-tau') != -1){
      return 'Vũng Tàu';
    }
    if(regionCode.indexOf('phan-thiet') != -1){
      return 'Phan Thiết';
    }
    if(regionCode.indexOf('nha-trang') != -1){
      return 'Nha Trang';
    }
    if(regionCode.indexOf('hoi-an') != -1){
      return 'Hội An';
    }
    if(regionCode.indexOf('phu-quoc') != -1){
      return 'Phú Quốc';
    }
    if(regionCode.indexOf('quang-ngai') != -1){
      return 'Quảng Ngãi';
    }
    if(regionCode.indexOf('da-lat') != -1){
      return 'Đà Lạt';
    }
    if(regionCode.indexOf('qui-nhon') != -1 || regionCode.indexOf('quy-nhon') != -1){
      return 'Quy Nhơn';
    }
    if(regionCode.indexOf('hue') != -1){
      return 'Huế';
    }
    if(regionCode.indexOf('ha-long') != -1){
      return 'Vịnh Hạ Long';
    }
  }

  clearRoute(){
    var se = this;
    if(se.directionsDisplay != null){
      se.directionsDisplay.setMap(null);
      se.directionsDisplay = null;

      se.directionsDisplay = new google.maps.DirectionsRenderer;
      se.directionsDisplay.setMap(se.map);
    }
  }

  showDirection(){
    var se = this;
    if(se.currentItemSelect){
      se.map.setZoom(16);
      se.addDirectionToMap(se.currentItemSelect);
    }
  }
  /**
   * Sắp xếp lại trải nghiệm theo vị trí center của bản đồ hiện tại
   */
  sortPlaceByCurrentLocation(){
    var se = this;
    if(se.listSearchDisplay && se.listSearchDisplay.length>0 && se.allowSortByCurrentLocation){
      se.calculateDistanceMapByCurrentLocationData(se.listSearchDisplay, { latitude:se.map.center.lat(), longitude: se.map.center.lng() }).then((datasort)=>{
        setTimeout(()=>{
          if(datasort && datasort.length >0){
            let firstItem = se.itemsearchfocus ? se.itemsearchfocus : datasort[0];
            if(firstItem){
              se.currentItemSelect = firstItem;
              if(se.map.getZoom() >= 16){
                se.markerClick(firstItem,firstItem,se.map, false, false);
                // var idx=-1;
                // idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == firstItem.id});
                //   if(idx != -1 && idx != null && se.markerhaschange){
                //     se.slider.slideTo(idx);
                // }
              }else{
                se.markerIconClick(firstItem,firstItem,se.map, false);
              }
            }
          }
        },150)
        
      });
      se.allowSortByCurrentLocation = false;
    }
  }

  /**
   * Định vị lại trải nghiệm được chọn trên bản đồ
   */
  locateSpotOnMap(item){
    var se = this;
    if(item){
      if(se.actionSheet){
        se.actionSheet.dismiss();
      }
      se.content.scrollToTop(50);
        var idx=-1;
        idx = se.listSearchDisplay.findIndex((m:any)=>{ return m.id == item.id});
          if(idx != -1 && idx != null){
            se.slider.slideTo(idx);
          }
    }
  }

  zoomDetail(){
    var se = this;
    if(se.currentItemSelect){
      var position = new google.maps.LatLng(se.currentItemSelect.latitude,se.currentItemSelect.longitude);
      se.map.setCenter(position);
    }
    se.map.setZoom(16);
  }
}
