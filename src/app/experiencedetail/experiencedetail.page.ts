import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../providers/auth-service';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import * as $ from 'jquery';
import * as moment from 'moment';
import { NavController, ModalController, IonSlides, AlertController, IonContent } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
import { InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Map, tileLayer, marker, icon,latLng } from 'leaflet';
import * as L from 'leaflet';
//import 'leaflet-routing-machine';
import { map } from 'rxjs/operators';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { google } from 'google-maps';
import { ValueGlobal } from '../providers/book-service';
import { BlogModalPage } from '../blogmodal/blogmodal';
import { OverlayEventDetail } from '@ionic/core';
//import * as MarkerClusterer from "@google/markerclusterer"


@Component({
  selector: 'app-experiencedetail',
  templateUrl: './experiencedetail.page.html',
  styleUrls: ['./experiencedetail.page.scss'],
})
export class ExperienceDetailPage implements OnInit {
  @ViewChild('mapid') mapid: ElementRef;
  @ViewChild('scrollArea') content: IonContent;
  @ViewChild('mySlider') slider: IonSlides;
  item;
  slideData: any=[];
  lengthslide: any=0;
  coutslide: any=1;
  loaddatadone = true;
  name: any;
  linkGoogleMap: any;
  ishide: boolean= true;
  priceFrom: any=0;
  priceTo: any=0;
  map: any;
  markers: any=[];
  listDistanceNearBy: any=[];
  listSearchDetail: any;
  latitude: number;
  longitude: number;
  dataListLike: any;
  constructor(private storage: Storage, private zone: NgZone,
    private navCtrl: NavController,
    private gf: GlobalFunction,
    private modalCtrl: ModalController,
    private sanitizer: DomSanitizer,
    private iab : InAppBrowser,
    private alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    private valueGlobal: ValueGlobal,) { }

  ngOnInit() {
  }

  goback(){
    this.modalCtrl.dismiss();
    //this.navCtrl.pop();
  }

  ionViewWillEnter(){
    var se = this;
    if(se.gf.getParams('experienceItem')){
      se.item = se.gf.getParams('experienceItem');
      se.initData();
    }
    se.mapBlogId(se.item);
  }

  initData(){
    var se = this;
    se.zone.run(()=>{
        se.name = se.item.name;
        se.latitude = se.item.latitude;
        se.longitude = se.item.longitude;
        se.initMap();
        if(se.item.images && se.item.images.length>0){
          se.slideData =[];
          se.item.images.forEach(element => {
            var el = { LinkImage: element};
            se.slideData.push(el);
          });
          se.lengthslide = se.item.images.length;
        }
        if(se.item.image){
          se.slideData =[];
            var el = { LinkImage: se.item.image};
            se.slideData.push(el);
          se.lengthslide = se.slideData.length;
        }

        if(se.item.priceFrom && se.item.priceTo){
          se.priceFrom = se.item.priceFrom.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          se.priceTo = se.item.priceTo.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
          
      
      if(se.gf.getParams('listSearch_ExperienceDetail')){
        se.listSearchDetail = se.gf.getParams('listSearch_ExperienceDetail');
        se.sortMarkerByDistanceDetail('totalDistanceNearBy', se.item);
        se.listSearchDetail.forEach((element,index) => {
          if(element.id == se.item.id){
            se.listSearchDetail.slice(index,1);
          }
        });
        setTimeout(async ()=>{
          let i = 0;
          se.listDistanceNearBy = [];
          se.listSearchDetail.forEach(element => {
            se.bindShortAdress(element);
            se.calculateDistanceMarker(element,'totalDistance');
            if(element.id != se.item.id && i < 3){
              se.listDistanceNearBy.push(element);
              i++;
            }
          });
          //se.listDistanceNearBy = se.listSearchDetail.slice(0,3);
        },100)
      }
    })
  }

  bindShortAdress(item){
    var se = this;
    var arrAdress = item.address.split(',');
    //bind adress
    if(arrAdress.length >= 1){
      let shortAdress = arrAdress[0] + ', ' + arrAdress[1];
      item.shortAdress = shortAdress;
    }
    //bind workinghours
    if(item.workingHours && item.workingHours.length >0 && !item.workingHoursDisplay){
      item.workingHoursDisplay = '';
      item.workingHours.forEach(element => {
        if(!item.workingHoursDisplay){
          item.workingHoursDisplay = element.name + ' | '+ element.timeFrom + '-'+ element.timeTo;
        }else{
          item.workingHoursDisplay += " , " + element.name + ' | '+ element.timeFrom + '-'+ element.timeTo;
        }
      });
    }
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
      rest[sortColumn] =0;
    }else{
      if(sortColumn == 'totalDistance'){
        rest[sortColumn] = (Math.round(L.latLng(se.latitude, se.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude)))/1000).toFixed(1);
      }
    }
    
  }

  mapBlogId(item){
    var se = this;
    //Tạm test trên beta
    //Khi release bỏ đoạn replace www
    var options = {
      method: 'GET',
      url: 'https://svc3.ivivu.com/GetBlogByUrl',
      qs: { url: item.blogReference },
      headers:
      {
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
        se.zone.run(()=>{
          var data = JSON.parse(body);
          item.blogId = data.post.ID;
        })
      })

  }

  initMap(){
    var se = this;
    let link = "https://maps.google.com/maps?q=" + se.item.name + " " + se.item.address + "&hl=es;z=18&amp&output=embed";
    se.linkGoogleMap = se.sanitizer.bypassSecurityTrustResourceUrl(link);
  }

  /**
   * Add marker vị trí hiện tại vào map
   */
  bindCurrentLocationMarker(){
    var se = this;
    var customMarkerIcon:any= {         
      url: se.getMarkerSelectedByTagId_ed(),
      scaledSize: new google.maps.Size(44, 44)    
    }
    const position = new google.maps.LatLng(se.item.latitude,se.item.longitude);
    const marker = new google.maps.Marker({ position, icon: customMarkerIcon, title: se.item.name });
    marker.setMap(se.map);
  }

  clearMarker(){
    var se = this;
    if(se.map){
        if(se.markers && se.markers.length >0){
          se.markers.forEach( (element :any) => {
            element.setMap(null);
          });
        }
    }
  }

  /**
   * Hàm lấy icon marker được chọn/ địa điểm gần nhất
   */
  getMarkerSelectedByTagId_ed(){
    var se = this;
    if(se.item.tags&& se.item.tags.length >0){
      if(se.item.tags.indexOf(3) != -1)
      {
        return './assets/img_musttry/ic_food_selected.svg';
      }
      if(se.item.tags.indexOf(6) != -1)
      {
        return './assets/img_musttry/ic_eye_selected.svg';
      }
      if(se.item.tags.indexOf(7) != -1)
      {
        return './assets/img_musttry/ic_celebrate_selected.svg';
      }
      if(se.item.tags.indexOf(4) != -1)
      {
        return './assets/img_musttry/ic_home_selected.svg';
      }
      if(se.item.tags.indexOf(9) != -1)
      {
        return './assets/img_musttry/ic_camera_selected.svg';
      }
      if(se.item.tags.indexOf(8) != -1)
      {
        return './assets/img_musttry/ic_airplane_selected.svg';
      }else{
        return './assets/img_musttry/marker.svg';
      }
    }else{
      return './assets/img_musttry/marker.svg';
    }
  }

  ionViewDidEnter(){
    var se = this;
    if($('.text-address') && $('.text-address').length >0){
      let h = $('.text-address')[0].offsetTop + $('.text-address')[0].offsetHeight + 6;
      if(h < 318){
        $('.div-over').addClass('height-'+h);
      }
    }
  }

  slidechange(){
    this.slider.getActiveIndex().then((currentIndex)=>{
      //this.hotelimg = this.slideData[currentIndex].LinkImage;
      this.coutslide = currentIndex + 1;
    });
  }

  showMap(ishow){
    var se = this;
    if(ishow){
      se.ishide = false;
      $('.div-over').removeClass('cls-hide').addClass('cls-show');
    }else{
      se.ishide = true;
      let h = $('.text-address')[0].offsetTop + $('.text-address')[0].offsetHeight + 6;
      $('.div-over').removeClass('cls-show').addClass('cls-hide').addClass('height-'+h);
    }
    
  }

  async clickBlogReference(item) {
    var se = this;
      if(item.blogId){
          //se.valueGlobal.urlblog = item.blogReference;
          // se.modalCtrl.dismiss();
          // se.navCtrl.navigateForward('/blog/' + item.blogId);
          se.gf.setParams(item.blogId,'blogid');
          const modal: HTMLIonModalElement =
          await se.modalCtrl.create({
            component: BlogModalPage
          });
          modal.present();

          modal.onDidDismiss().then((data) => {
            se.gf.setParams(null,'blogid');
            if(data.data == 'dismissall'){
              se.closeModal();
            }
          })
      }
      // else{
      //   se.openWebpage(item.blogReference);
      // }
   // this.openWebpage(url);
  }
  closeModal(){
    var se = this;
    setTimeout(()=>{
      se.modalCtrl.dismiss('dismissall');
      se.navCtrl.navigateForward('/login');
    },10)
   
  }
  openWebpage(url: string) {
    const options: InAppBrowserOptions = {
      zoom: 'no',
      location: 'yes',
      toolbar: 'yes',
      hideurlbar: 'yes',
      closebuttoncaption: 'Đóng'
    };
    const browser = this.iab.create(url, '_self', options);
    browser.show();
  }

  itemListSearchClick(item){
    var se = this;
    se.zone.run(()=>{
      se.item = item;
        se.initData();
    })
    se.mapBlogId(se.item);
    //scroll to Top
    se.content.scrollToTop(500);
  }

  /**
   * Sắp xếp vị trí marker theo tên column sort, item làm mốc
   * @sortColumn: tên cột dữ liệu sort
   * @itemDest: item lấy làm mốc để sort
   */
  sortMarkerByDistanceDetail(sortColumn, itemDest){
    var se = this;
    se.listSearchDetail.forEach(rest =>{
      se.calculateDistanceMarkerDetail(rest,sortColumn, itemDest);
    })

    setTimeout(()=>{
      if (se.listSearchDetail && se.listSearchDetail.length > 0) {
        se.zone.run(() => se.listSearchDetail.sort(function (a, b) {
          let direction = -1;
            if(a[sortColumn] && b[sortColumn] && a[sortColumn] < b[sortColumn]){
              return 1 * direction;
            }else{
              return -1 * direction;
            }
        }));
      }
    },100)
  }
  /**
   * Tính khoảng cách giữa các điểm so với vị trí hiện tại
   * @rest: item cần sort
   * @sortColumn: tên cột dữ liệu sort
   * @itemDest: item lấy làm mốc để sort
   */
  calculateDistanceMarkerDetail(rest:any, sortColumn, itemDest){
    var se = this;
    var lat,lng;
    var dist = 0;
    if(sortColumn == 'totalDistance'){
      dist = L.latLng(se.latitude, se.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude));
    }else if(sortColumn == 'totalDistanceNearBy' && itemDest){
      if(itemDest.id == rest.id){
        dist = 999999;
      }else{
        dist = L.latLng(itemDest.latitude, itemDest.longitude).distanceTo(L.latLng(rest.latitude, rest.longitude));
      }
    }
    
    rest[sortColumn] =  (Math.round(dist)/1000).toFixed(1);
  }

  likePlace(item, isItemNearBy){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            se.bindPlaceLikeLocal(item, true, isItemNearBy);
            var text = "Bearer " + auth_token;
            var header ={ authorization: text, 'Access-Control-Allow-Origin': '*'};
            var body = item.id;
            let urlLikePlace = C.urls.baseUrl.urlMobile + '/api/Data/LikePlace';
            se.gf.RequestApi('POST',urlLikePlace,header,body,'ExperienceSearch', 'likePlace').then((data:any)=>{
              if(item.blogId){
                let urlLikeBlog= C.urls.baseUrl.urlMobile +'/mobile/OliviaApis/AddFavouriteBlog';
                se.gf.RequestApi('POST', urlLikeBlog,{authorization: text},{ postId: item.blogId }, 'experiencedetail', 'likePlace');
              }  
            })
        }else{
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        }
      })
  }

  unlikePlace(item, isItemNearBy){
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
        if (auth_token) {
            se.bindPlaceLikeLocal(item, false, isItemNearBy);
            var text = "Bearer " + auth_token;
            var header = { authorization: text, 'Access-Control-Allow-Origin': '*'};
            var body = item.id;
            let urlLikePlace = C.urls.baseUrl.urlMobile + '/api/Data/UnLikePlace';
            se.gf.RequestApi('POST',urlLikePlace,header,body,'ExperienceSearch', 'unlikePlace').then((data:any)=>{
              
            })
        }else{
          se.showConfirmLogin("Bạn cần đăng nhập để sử dụng chức năng này.");
        }
      })
  }

  bindPlaceLikeLocal(item, islike, isItemNearBy){
    var se = this;
    se.zone.run(()=>{
      item.liked = islike;
      se.valueGlobal.likePlaceCount = islike ? 1 : -1 ;
      item.totalLike += islike ? 1 : -1 ;
    })
  }

  sharePlace(){
    this.socialSharing.share(null, null, null, this.item.shareUrl).then(() => {
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
          })
          this.modalCtrl.dismiss();
          this.navCtrl.navigateForward('/login');
        }
      }
    ]
    });
    alert.present();
    alert.onDidDismiss().then((data)=>{
    })
  }
}
