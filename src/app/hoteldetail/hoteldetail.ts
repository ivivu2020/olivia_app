import { RequestCombo1Page } from './../requestcombo1/requestcombo1';
import { Booking, Bookcombo, ValueGlobal, SearchHotel, RoomInfo } from './../providers/book-service';
import * as request from 'requestretry';
import * as moment from 'moment';
import { Component, ViewChild, NgZone, Renderer, ElementRef,OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { NavController, ModalController, ToastController, AlertController,LoadingController,Platform, IonSlides,IonRouterOutlet, ActionSheetController } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { AuthService } from '../providers/auth-service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import {RequestComboPage} from '../requestcombo/requestcombo';

import {
  CalendarModal,
  CalendarModalOptions,
  CalendarOptions,
  DayConfig,
  CalendarResult
} from 'ion2-calendar';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { DomSanitizer } from '@angular/platform-browser';
import { IonContent } from '@ionic/angular';
import { DepartureCalendarPage} from '../departurecalendar/departurecalendar';
import { OverlayEventDetail } from '@ionic/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { OccupancyPage } from 'src/app/occupancy/occupancy';
import * as util from 'util';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';
import { setTimeout } from 'timers';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network/ngx';
import { NetworkProvider } from '../network-provider.service';
import { Subscription } from 'rxjs/Subscription';
import { HotelreviewsimagePage } from './../hotelreviewsimage/hotelreviewsimage';
declare var google;
declare var infowindow;

@Component({
  selector: 'app-hoteldetail',
  templateUrl: 'hoteldetail.html',
  styleUrls: ['hoteldetail.scss'],
})
export class HotelDetailPage implements OnInit {
  @Input('myScrollVanish') scrollArea;
  @ViewChild('scrollArea') content: IonContent;
  @ViewChild('mySlider') slider: IonSlides;
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild(IonRouterOutlet) routerOutlets: IonRouterOutlet;
  private subscription: Subscription;
  mapGoogle: any;
  HotelIDLike = "";
  slideData = [];
  name;
  json;
  public jsonroom = [];
  jsonroom1;
  jsonroom2;
  AvgPoint;
  isAvgPoint = true;
  //map: GoogleMap;
  Combos;
  numHotelReviews;
  public cin;
  public cout;
  public cincombo;
  public coutcombo;
  public guest = 2;
  public room1 = 1;
  public room = 1;
  dd; mm;
  selectOptions;
  fcbcar = false;
  arrcombo; valueComboDetail = [];
  comboDetail:any;
  titlecombo;
  notecombo;
  Description;
  mon;
  arrroom = [];
  public isShown: boolean = false;
  isbtnseemore = true;
  isShow = false;
  HotelReviews;
  arrHotelReviews = [];
  HotelRelated;
  isheader = false;
  isheader1 = true;
  ischeckcombo;
  child1 = 0;
  child = 0;
  adults1 = 2;
  adults = 2;
  arrchild = [];
  arrchild1 = [];
  arrchild2 = [];
  numagesc1;
  numagesc2;
  numagesc3;
  numagesc4;
  numagesc5;
  HotelID = "377594";
  Longitude;
  Latitude;
  imgHotel;
  Address;
  duration;
  ischeckMaxAdults = true;
  RoomID;
  ComboDayNum; ischeckoutofroom; public ischeckbtnreset = false;
  public ischeckbtn = true;
  id1; showpopup = true;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false; ischeck = false;
  Chuoi; scrollTopvalue; indexroom; text; email; flag = 0; num = 0; roomvalue; HotelName; location; comboprice; cocombo = 0;
  lengthslide; coutslide = 1; datecin; datecout; cindisplay; coutdisplay;checkcombocar=0;cindisplayhr; coutdisplayhr;

  public comboDetailList = [];
  public hotelDetail = [];
  public objDetail:any;
  public hotelRoomClasses:any = [];
  public hotelRooms = [];
  public loginuser = null;
  public comboid;
  public hotelname; hotelurl; hotelimg;
  public dataListLike = []; itemlike = false;
  public ListHotelRelatedPrice = [];
  public sendRequest = true;
  public hasComboRoom = false;
  public changedate = false;
  public combopriceontitle = null;
  public penaltyItemSelected = -1;
  public hotelAvatar = null;
  public regionId = null;
  fs = false; fc = false; nm = false;
  public loadcomplete = false;
  public showroominfo = false;
  public loadpricecombodone = false;
  public warningMaxPax = '';
  public flashSaleEndDate: any;
  public dateRegex = /^\/Date\((d|-|.*)\)[\/|\\]$/;
  public loadmapdone = false;
  public isexit = false;
  public linkGoogleMap : any;
  public usermail = '';
  public formParam:any;
  public loader:any;
  private hidden:boolean = false;
  public hotelcode='';
  ischeckcbcar=false;
  ischeckcbcarhide=false;
  slideOpts = {
    zoom: false
  };

  allowbookcombofc = true;
  myCalendar:any;
  isConnected;ChildAgeTo;  ischeckBOD=false;
  checkBODdone: boolean = false;
  topsale24Total: any =0;
  seemoreroomdetaillist = [];
  mealtypegrouplist = [];
  hotelMealTypes: any[];
  hotelMealTypesHidden: any[];
  public itemsSk= [1,2];allowbookcombofx = true;totalAdult;
  includeInsurrance = 1;
  hasInsurrance:any;
  checkInsurranceFee;
  //InsurranceFee="77.000đ";
  InsurranceFee="";
  SpecialNote: any;
  objInsurranceFee: any;
  dateofcombo;
  objroomfsale: any = [];
  indexmeal;
  ListRoomClasses=[]
  ischeckcbfs
  constructor(public toastCtrl: ToastController, private alertCtrl: AlertController, public zone: NgZone, public modalCtrl: ModalController, public navCtrl: NavController,
    private http: HttpClientModule, public loadingCtrl: LoadingController, public Roomif: RoomInfo, public renderer: Renderer,
    public booking: Booking, public storage: Storage, public authService: AuthService, public platform: Platform, public bookCombo: Bookcombo, public value: ValueGlobal, public searchhotel: SearchHotel, public valueGlobal: ValueGlobal, private socialSharing: SocialSharing,
    public gf: GlobalFunction,private sanitizer: DomSanitizer,public router: Router,public actionsheetCtrl: ActionSheetController,private safariViewController: SafariViewController,
	  public network: Network,
    public networkProvider: NetworkProvider,
    private activeRoute: ActivatedRoute,
    public activityService: ActivityService) {
      this.loaddata();
    }

    public async ngOnInit(){
      var se = this;
      await se.onEnter();
      se.subscription = se.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd && (event.url === '/hoteldetail/'+se.HotelID) ) {
              se.onEnter();
          }
          if(event instanceof NavigationEnd && (event.url == '/app/tabs/hoteldetail' || event.url == '/' ) ){
            //Set activetab theo form cha
            if(se.searchhotel.rootPage == 'likepage'){
              se.gf.setActivatedTab(2);
            }else if(se.searchhotel.rootPage == 'combolist' || se.searchhotel.rootPage == 'MyTrip'){
              se.gf.setActivatedTab(3);
            }else{
              se.gf.setActivatedTab(1);
            }
          }
        });
      }
  
      public async onEnter(): Promise<void> {
        var se = this;
        se.storage.get('auth_token').then(auth_token => {
          se.loginuser = auth_token;
        });
        se.storage.get('email').then(email => {
          se.usermail = email;
        })
        if (se.searchhotel.rootPage == 'login') {
          if (se.HotelIDLike) {
            se.likeItem();
            
          }
          else{
            se.updateLikeStatus();
          }
          se.loaddata();
        }
        if (se.valueGlobal.backValue == 'popupinfobkg') {
          se.hotelRoomClasses=[];
          se.loadcomplete=false;
          se.valueGlobal.backValue = '';
          se.loaddata();
        }
        //se.loaddata();
        // do your on enter page stuff here
        if(se.valueGlobal.backValue == 'flightcombo'
        && ((se.searchhotel.CheckInDate && new Date(se.cin).toLocaleDateString() != new Date(se.searchhotel.CheckInDate).toLocaleDateString())
        || se.searchhotel.CheckOutDate && new Date(se.cout).toLocaleDateString() != new Date(se.searchhotel.CheckOutDate).toLocaleDateString()
        || se.searchhotel.adult != se.adults || se.searchhotel.child != se.child)
        ){
          se.loaddata();
          se.valueGlobal.backValue = '';
        }
        // if(se.valueGlobal.backValue == 'carcombo'){
        //   se.loaddata();
        //   se.valueGlobal.backValue = '';
        // }

        //Set activetab theo form cha
        if(se.searchhotel.rootPage == 'likepage'){
          se.gf.setActivatedTab(2);
        }else if(se.searchhotel.rootPage == 'combolist' || se.searchhotel.rootPage == 'MyTrip'){
          se.gf.setActivatedTab(3);
        }else{
          se.gf.setActivatedTab(1);
        }

      }

  loaddata(){
    //this.HotelID = this.bookCombo.Hotelid;
    this.storage.get('auth_token').then(auth_token => {
      this.loginuser = auth_token;
    });
    //this.value.logingoback = "HoteldetailPage";
    if (this.searchhotel.isRefreshDetail) {
      this.HotelID = this.searchhotel.hotelID ? this.searchhotel.hotelID : (this.searchhotel.gbitem ? this.searchhotel.gbitem.HotelId : this.searchhotel.hotelID);
    } else {
      if (this.searchhotel.rootPage == "listpage" || this.searchhotel.rootPage == "topdeal" || this.searchhotel.rootPage == "listmood" || this.searchhotel.rootPage == "likepage" || this.searchhotel.backPage == "roompaymentselect" || this.searchhotel.backPage == "roompaymentselect-ean" || this.searchhotel.rootPage == "MyTrip" || this.searchhotel.rootPage == "combolist" || this.searchhotel.rootPage == "topdeallist") {
        this.HotelID = this.searchhotel.hotelID;
      } else if (this.searchhotel.rootPage == "mainpage") {
        this.HotelID = (this.searchhotel.gbitem ? this.searchhotel.gbitem.HotelId : this.searchhotel.hotelID);
      }else if(this.activeRoute.snapshot.paramMap.get('id')){
        this.HotelID = this.activeRoute.snapshot.paramMap.get('id');
      }
    }
    this.checkBODdone = false;
    this.hasComboRoom = false;
    //this.ischeck = false;
    this.location = this.bookCombo.location;

    if (this.searchhotel.adult) {
      this.guest = this.searchhotel.adult + this.searchhotel.child;
      this.adults = this.searchhotel.adult;
    }
    if (this.searchhotel.child) {
      this.child = this.searchhotel.child;
    }
    if (this.searchhotel.roomnumber) {
      this.room = this.searchhotel.roomnumber;
    }
    if (this.searchhotel.arrchild) {
      this.arrchild = this.searchhotel.arrchild;
    }
    this.totalAdult=this.adults
    for (let i = 0; i < this.arrchild.length; i++) {
      if (this.arrchild[i].numage >= 4) {
        this.totalAdult++;
      }
    }
    if (this.searchhotel.CheckInDate) {
      this.cin = this.searchhotel.CheckInDate;
      this.cout = this.searchhotel.CheckOutDate;
      this.datecin = new Date(this.searchhotel.CheckInDate);
      this.datecout = new Date(this.searchhotel.CheckOutDate);
      this.cindisplay = moment(this.datecin).format('DD-MM-YYYY');
      this.coutdisplay = moment(this.datecout).format('DD-MM-YYYY');
      this.cindisplayhr = moment(this.datecin).format('DD/MM');
      this.coutdisplayhr = moment(this.datecout).format('DD/MM');
      this.bookCombo.CheckInDate = this.searchhotel.CheckInDate;
      this.bookCombo.CheckOutDate = this.searchhotel.CheckOutDate;
    }else{
      this.cin = new Date();
      var rescin = this.cin.setTime(this.cin.getTime() + (24 * 60 * 60 * 1000));
      var datein = new Date(rescin);
      this.cin = moment(datein).format('YYYY-MM-DD');
      this.cindisplay = moment(datein).format('DD-MM-YYYY');
      this.cindisplayhr = moment(datein).format('DD/MM');
      this.datecin = new Date(rescin);

      this.cout = new Date();
      var res = this.cout.setTime(this.cout.getTime() + (2 * 24 * 60 * 60 * 1000));
      var date = new Date(res);
      this.cout = moment(date).format('YYYY-MM-DD');
      this.coutdisplay = moment(date).format('DD-MM-YYYY');
      this.coutdisplayhr = moment(date).format('DD/MM');
      this.datecout = new Date(res);
      this.searchhotel.CheckInDate = this.cin;
      this.searchhotel.CheckOutDate = this.cout;
    }
    var date1 = new Date(this.cin);
    var date2 = new Date(this.cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.loadTopSale24h(null);
    this.presentLoading();
  }

  loadTopSale24h(id){
    var se = this;
    let url = C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/TopSale24hByHotel?hotelId='+(id ? id : se.HotelID) ;
    var options = {
      method: 'GET',
      url: url,
      headers: {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
      },
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    };
    request(options, function (error, response, body) {
      if (error) {
        error.page = "hoteldetail";
        error.func = "loaddata";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error,response);
      }
      if (response.statusCode == 200) {
        var res = JSON.parse(body);
        se.topsale24Total = res.total;
      }
    })
  }
  hidetopbar(){
    var se = this;
    let el = document.getElementsByClassName('div-statusbar-float');
      el[0].classList.remove('float-statusbar-enabled');
      el[0].classList.add('float-statusbar-disabled');
  }

  ionViewWillEnter() {
    //this.scrollToTop1();
    var se = this;
    //se.loaddata();
    se.hidetopbar();
    //se.presentLoadingDetail();
    se.storage.get('email').then(email => {
      se.usermail = email;
    })
    
    //bind lại cin,cout khi đóng popup requestcombo
      if((se.searchhotel.CheckInDate && moment(new Date(se.cin)).format('DD-MM-YYYY') != moment(new Date(se.searchhotel.CheckInDate)).format('DD-MM-YYYY'))
      || se.searchhotel.CheckOutDate && moment(new Date(se.cout)).format('DD-MM-YYYY') != moment(new Date(se.searchhotel.CheckOutDate)).format('DD-MM-YYYY') ){
        se.zone.run(() => {
          //this.getDetailCombo(null);
          se.cin = se.searchhotel.CheckInDate;
          se.cout = se.searchhotel.CheckOutDate;
          se.datecin = new Date(se.searchhotel.CheckInDate);
          se.datecout = new Date(se.searchhotel.CheckOutDate);
          se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
          se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');

          se.cindisplayhr = moment(se.datecin).format('DD/MM');
          se.coutdisplayhr = moment(se.datecout).format('DD/MM');
          se.bookCombo.CheckInDate = moment(se.datecin).format('YYYY-MM-DD');
          se.bookCombo.CheckOutDate = moment(se.datecout).format('YYYY-MM-DD');
          se.changedate = true;
          se.hasComboRoom = false;
          se.comboprice = se.combopriceontitle;
          se.showpopup = true;
          se.ischeck = true;
          se.guest = se.adults + se.child;
          var date1 = new Date(this.cin);
          var date2 = new Date(this.cout);
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
          //se.scrollToTopwithvalue1();
          if(se.comboid){
            se.getDetailCombo(se.comboid);
          }
          se.getdataroom();
          })
      }
      
  }

  ionViewDidLoad() {

    //this.loadMap();
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
    // //Xử lý nút back của dt
    // this.platform.ready().then(() => {
    //   this.platform.backButton.subscribe(() => {
    //     // code that is executed when the user pressed the back button
    //     if(this.showpopup==false){
    //       this.showpopup=true;
    //     }else{
    //       this.goback();// IF IT'S NOT THE ROOT, POP A PAGE.
    //     }
    //   })
    // })
  }
  closeModal() {
    //this.loadMap();
    var se = this;
    se.zone.run(() => {
      se.ischeck = true;
      se.showpopup = true;
      se.loadcomplete = true;
    });
    //se.content.scrollToTop(50);
  }
  public scrollFunction = (event: any) => {
    try{
      this.zone.run(() => {
        if (this.penaltyItemSelected != -1) {
          this.penaltyItemSelected = -1;
        }
      })
      let el = document.getElementsByClassName('div-float-arrow');
      let elheader = document.getElementsByClassName('cls-header');
      if (event.detail.currentY > 505) {
        elheader[0].classList.add('float-arrow-enabled');
        elheader[0].classList.remove('float-arrow-disabled');
      }
      else {
        elheader[0].classList.add('float-arrow-disabled');
        elheader[0].classList.remove('float-arrow-enabled');
      }
      //show hiển thị scrolltop
      if (event.detail.currentY > 1630) {

      }
      // if(el.length >0){
      //     if(event.detail.currentY === 0 && this.hidden){
      //       el[0].classList.add('float-arrow-enabled');
      //       el[0].classList.remove('float-arrow-disabled');
      //       this.hidden = false;
      //     }
      //     else if(!this.hidden && event.detail.deltaY > 1){
      //       el[0].classList.remove('float-arrow-enabled');
      //       el[0].classList.add('float-arrow-disabled');
      //       this.hidden = true;
      //     } else if(this.hidden && event.detail.deltaY < -1) {
      //       el[0].classList.add('float-arrow-enabled');
      //       el[0].classList.remove('float-arrow-disabled');
      //       this.hidden = false;
      //     }
      //     if(event.detail.currentY < 200){
      //       el[0].classList.remove('float-arrow-enabled');
      //       el[0].classList.add('float-arrow-disabled');
      //       this.hidden = true;
      //     }

      // }

      let elbar = document.getElementsByClassName('div-statusbar-float-detail');
      if(elbar.length > 0){
        if(event.detail.scrollTop > 100){
          elbar[0].classList.add('div-statusbar-float-detail-enabled');
          elbar[0].classList.remove('div-statusbar-float-detail-disabled');
        }else{
          elbar[0].classList.remove('div-statusbar-float-detail-enabled');
          elbar[0].classList.add('div-statusbar-float-detail-disabled');
        }
      }
    }catch(error){
      error.page="hoteldetail";
        error.func="scrollFunction";
        error.param = "";
        C.writeErrorLog(error,null);
    }
    
  }

  async openmnu() {
    // this.showpopup = false;
    if(!this.loadcomplete){
      this.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
    this.searchhotel.ChildAgeTo = this.ChildAgeTo;
    this.hotelRoomClasses = [];
    const modal: HTMLIonModalElement =
    await this.modalCtrl.create({
      component: OccupancyPage,

    });
    this.allowbookcombofc = true;
    this.allowbookcombofx = true;
    this.gf.setParams(true,'requestcombo');
    modal.present();
  //this.navCtrl.navigateForward('/requestcombo');;

  modal.onDidDismiss().then((data: OverlayEventDetail) => {
    var se = this;
    //this.presentLoadingnotime();
        se.zone.run(() => {
          se.hotelRoomClasses = [];
          se.loadpricecombodone = false;
          se.loadcomplete = false;
          se.isheader = false;
          se.isShown = false;
          if(se.searchhotel.adult){
            se.guest = se.searchhotel.adult + se.searchhotel.child;
            se.child = se.searchhotel.child;
            se.adults = se.searchhotel.adult;
            se.child = se.searchhotel.child;
          }else{
            se.guest = se.adults1 + se.child1;
            se.child = se.child1;
          }
          
          if(se.searchhotel.roomnumber || se.room){
            se.room = se.searchhotel.roomnumber ? se.searchhotel.roomnumber : se.room;
            se.room1 = se.room;
          }else{
            se.room == se.room1;
          }

          se.arrchild = [];
          if(se.searchhotel.arrchild && se.searchhotel.arrchild.length >0){
            
            //se.this.arrchild2 = 
            for (let i = 0; i < se.searchhotel.arrchild.length; i++) {
              se.arrchild.push(se.searchhotel.arrchild[i]);
            }
          }
          se.totalAdult=se.adults
          for (let i = 0; i < se.arrchild.length; i++) {
            if (se.arrchild[i].numage >= 4) {
              se.totalAdult++;
            }
          }
          if (se.comboid) {
            se.getDetailCombo(se.comboid);
          }
          //se.getdataroom();
          se.checkPriceHotelDetail().then((check)=>{
            if(check){
              se.getdataroom();
            }else{
              se.hotelRoomClasses = [];
              se.ischeckoutofroom = false;
              se.loadcomplete = true;
              se.ischeck = true;
              se.allowbookcombofc = false;
              se.allowbookcombofx = false;
            }
          });
        })
    })

  }
  done() {
    var se = this;
    se.room = se.room1;
    se.adults = se.adults1;
    se.child = se.child1
    se.arrchild = [];
    for (let i = 0; i < se.arrchild2.length; i++) {
      se.arrchild.push(se.arrchild2[i]);

    }
    se.searchhotel.adult = se.adults;
    se.searchhotel.child = se.child;
    se.searchhotel.roomnumber = se.room;
    se.searchhotel.arrchild = se.arrchild;

    se.zone.run(() => {
      se.ischeck = false;
      se.showpopup = true;
      se.isheader = false;
      se.guest = se.adults + se.child;
      se.scrollToTopwithvalue1();
    })


  }

  loadMap() {
    let posMaceio = { lat: this.Latitude, lng: this.Longitude }
    this.mapGoogle = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 12,
      center: posMaceio,
      mapTypeId: 'roadmap'
    });

    this.mapGoogle.setCenter(posMaceio);
    var latLng = new google.maps.LatLng(this.Latitude, this.Longitude);

    var marker = new google.maps.Marker({
      position: latLng,
      map: this.mapGoogle,
    });
    google.maps.event.addListener(marker, 'click', function () {
      infowindow.open(this.mapGoogle, marker);
    });
  }

  doInfinite(infiniteScroll) {

    this.isShown = true;
    infiniteScroll.complete();

  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }
  scrollToTopwithvalue() {
    this.zone.run(() => {
      this.isShown = false;
      this.content.scrollToTop(50);
      this.isheader = false;
    })
  }
  scrollToTopwithvalue1() {
    this.zone.run(() => {
      this.isShown = false;
      this.content.scrollToTop(50);
      this.isheader = false;
      this.presentLoading();
    })
  }
  scrollToTop1() {
    this.zone.run(() => {
      this.isShown = false;
      this.content.scrollToTop(50);
      this.isheader = false;
    })
  }
  strip_html_tags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }
  presentLoading() {
    //this.getdata();
    var se =this;
    se.storage.get('hoteldetail_'+this.HotelID).then((data) =>{
      if(data){
        //Lấy dữ liệu trong cache hiển thị trước
        se.loadHotelDetail(data, false);
        //Vẫn gọi lại getdata để refresh detail mới nhất
        setTimeout(()=>{
          se.getdataRefresh();
        }, 1000*60*60)
      }else{
        se.getdata(false);
      }
    })
  }
  
  async getdataRefresh(){
    var se = this;
    se.zone.run(()=>{
      se.getdata(true);
    })
    
  }
  async getdata(isloaddata) {
    let url = C.urls.baseUrl.urlPost + "/mhoteldetail/" + this.HotelID;//+ (se.memberid ? '&memberid='+se.memberid : '')
    var se = this;
    var options = {
      method: 'POST',
      url: url,
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "hoteldetail",
          func: "loaddata",
          message: response.statusMessage,
          content: response.body,
          type: "warning",
          param: JSON.stringify(options)
        };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page = "hoteldetail";
        error.func = "loaddata";
        error.param = JSON.stringify(options);
        C.writeErrorLog(objError,response);
      }
        if (response.statusCode == 200) {
          let jsondata = JSON.parse(body);
          //Có cache thì xóa đi load mới nhất
          se.storage.get('hoteldetail_'+ se.HotelID).then((data) => {
            if(data){
              se.storage.remove('hoteldetail_'+ se.HotelID).then((s)=>{
                se.storage.set('hoteldetail_'+ se.HotelID, jsondata);
              })
            }else{
              se.storage.set('hoteldetail_'+ se.HotelID, jsondata);
            }
          })
          //Gọi hàm load thông tin detail
          se.loadHotelDetail(jsondata, isloaddata);
        }else{
          if (se.loader) {
            se.loader.dismiss();
          }
        }
    })
  }

  loadHotelDetail(jsondata, isloaddata){
    var se = this;
          se.hotelcode = jsondata.Code;
          se.ChildAgeTo = jsondata.ChildAgeTo;
          //google analytic
          se.gf.googleAnalytion('hoteldetail', 'Search', jsondata.Code + '|' + se.cin + '|' + se.cout);
          se.updateLikeStatus();
          se.objDetail = jsondata;
          se.hotelDetail = [];
          se.hotelDetail.push(jsondata);
          se.hotelDetail = se.hotelDetail[0];
          se.hotelname = jsondata.Name;
          se.hotelurl = "https://www.ivivu.com" + jsondata.Url;
          let link = "https://maps.google.com/maps?q=" + se.hotelname + "&hl=es;z=16&amp&output=embed";
          se.linkGoogleMap = se.sanitizer.bypassSecurityTrustResourceUrl(link);
          //se.hotelAvatar = "https:" + jsondata.Avatar;
          se.hotelAvatar = (jsondata.Avatar.toLocaleString().trim().indexOf("http") != -1) ? jsondata.Avatar : 'https:' + jsondata.Avatar;
          se.regionId = jsondata.RegionId;
          se.bookCombo.HotelLink = se.hotelurl;
          se.bookCombo.Avatar = se.hotelAvatar;
          se.bookCombo.RegionId = se.regionId;
          se.bookCombo.HotelName = se.hotelname;
          se.bookCombo.Hotelid = se.HotelID;
          se.id1 = { id: se.HotelID };
          if(!isloaddata){
            if (jsondata.HotelImages.length > 0) {
              se.slideData = jsondata.HotelImages;
            }
            else {
              var item = { LinkImage: jsondata.Avatar }
              se.slideData.push(item);
            }
          }
         
          se.lengthslide = se.slideData.length;
          se.name = jsondata.Name;
          se.json = jsondata.Rating;
          se.AvgPoint = jsondata.AvgPoint;
          se.Latitude = jsondata.Latitude;
          se.Longitude = jsondata.Longitude;
          se.Address = jsondata.Address;
          se.ischeckcombo = false;
          //load map
          //se.loadMap();
          if ( (se.content && isloaddata) || se.searchhotel.isRefreshDetail) {
            se.content.scrollToTop(300);
            if(se.searchhotel.isRefreshDetail){
              se.searchhotel.isRefreshDetail = false;
            }
          }
          if (jsondata.Combos) {
            se.sendRequest = false;
            se.ischeckcombo = true;

          }
          if (jsondata.ComboPromtion || jsondata.Combos) {
            se.nm = (jsondata.ComboPromtion && jsondata.ComboPromtion.Description && jsondata.ComboPromtion.Title);
            se.sendRequest = false;
            se.cocombo = 1;
            se.titlecombo = jsondata.ComboPromtion && jsondata.ComboPromtion.Title ? jsondata.ComboPromtion.Title : (jsondata.Combos ? jsondata.Combos.Title : '');
            se.notecombo = jsondata.ComboPromtion && jsondata.ComboPromtion.Note ? (jsondata.ComboPromtion.Note || '') : (jsondata.Combos ? jsondata.Combos.Note : '');
            se.combopriceontitle = jsondata.ComboPromtion && jsondata.ComboPromtion.Description ? jsondata.ComboPromtion.Price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : (jsondata.Combos ? jsondata.Combos.Price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '');
            se.comboprice = jsondata.ComboPromtion && jsondata.ComboPromtion.Description ? jsondata.ComboPromtion.Price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : (jsondata.Combos ? jsondata.Combos.Price.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") : '');
            se.SpecialNote = jsondata.Combos.SpecialNote ? jsondata.Combos.SpecialNote.replace(/\r\n/g, "") : "";
            se.Description = jsondata.ComboPromtion && jsondata.ComboPromtion.Description ? jsondata.ComboPromtion.Description.replace(/\r\n/g, "<br/>") : (jsondata.Combos ? jsondata.Combos.Description.replace(/\r\n/g, "<br/>") : '');
            se.Description = se.Description.replace("Trọn gói bao gồm:", "");
            se.Description = se.Description.replace(/#r/g, "");
            se.Description = se.Description.replace(/r#/g, "");
            se.Description = se.Description.replace(/#m/g, "");
            se.Description = se.Description.replace(/m#/g, "");
            se.Description = se.Description.replace(/#n/g, "");
            se.Description = se.Description.replace(/n#/g, "");
            se.ischeckcombo = true;
            se.ComboDayNum = jsondata.Combos ? jsondata.Combos.ComboDayNum : 1;
            se.bookCombo.tolocation = jsondata.Combos ? jsondata.Combos.ArrivalCode : '';
            se.valueComboDetail = [];
            if (jsondata.ComboPromtion && jsondata.ComboPromtion.Id) {
              se.comboid = jsondata.ComboPromtion.Id;
            }
            if (jsondata.Combos && jsondata.Combos.ComboDetail) {
              se.comboid = jsondata.Combos.Id;
              se.getDetailCombo(jsondata.Combos.Id);
            }

          }
          //Không có description thì ẩn nội dung combo
          if ((jsondata.ComboPromtion && !jsondata.ComboPromtion.Description && !jsondata.Combos) || (!jsondata.ComboPromtion && jsondata.Combos && !jsondata.Combos.Description)) {
            se.ischeckcombo = false;
          }

          se.HotelReviews = jsondata.HotelReviews;
          se.HotelRelated = jsondata.HotelRelated;
          for (let index = 0; index < se.HotelRelated.length; index++) {
            //se.HotelRelated[index].Avatar = 'https:' + se.HotelRelated[index].Avatar;
            if (se.HotelRelated[index].Avatar) {
              se.HotelRelated[index].Avatar = (se.HotelRelated[index].Avatar.toLocaleString().trim().indexOf("http") != -1) ? se.HotelRelated[index].Avatar : 'https:' + se.HotelRelated[index].Avatar;
            }
            else {
              se.HotelRelated[index].Avatar = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-104x110.png";
            }

            switch (se.HotelRelated[index].Rating) {
              case 50:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_5.svg";
                break;
              case 45:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_4.5.svg";
                break;
              case 40:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_4.svg";
                break;
              case 35:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_3.5.svg";
                break;
              case 30:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_3.svg";
                break;
              case 25:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_2.5.svg";
                break;
              case 20:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_2.svg";
                break;
              case 15:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_1.5.svg";
                break;
              case 10:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_1.svg";
                break;
              case 5:
                se.HotelRelated[index].Rating = "./assets/star/ic_star_0.5.svg";
                break;
              default:
                break;
            }
            //Loại dấu ',' của sublocation
            if (se.HotelRelated[index].SubLocation) {
              se.HotelRelated[index].SubLocation = se.HotelRelated[index].SubLocation.substring(0, se.HotelRelated[index].SubLocation.length - 1);
            }

          }
          se.getPriceHotelRelated();
          se.numHotelReviews = jsondata.HotelReviews.length;
          se.arrHotelReviews = [];
          if (se.numHotelReviews > 0) {
            if (se.numHotelReviews < 3) {
              se.HotelReviews[0].DateStayed = moment(se.HotelReviews[0].DateStayed).format('DD-MM-YYYY');
              se.arrHotelReviews.push(se.HotelReviews[0]);
            }
            else {
              for (let index = 0; index < 3; index++) {
                if(moment(se.HotelReviews[index].DateStayed).format('DD-MM-YYYY') != "Invalid date"){
                  se.HotelReviews[index].DateStayed = moment(se.HotelReviews[index].DateStayed).format('DD-MM-YYYY');
                }else{
                  se.HotelReviews[index].DateStayed = se.HotelReviews[index].DateStayed;
                }
                
                se.HotelReviews[index].ReviewPoint = Math.round(se.HotelReviews[index].ReviewPoint * 100) / 100;
                se.arrHotelReviews.push(se.HotelReviews[index]);
              }
            }
          }

          if(!isloaddata){
            for (let index = 0; index < se.slideData.length; index++) {
              if (index == 0) {
                se.imgHotel = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") != -1) ? se.slideData[index].LinkImage : 'https:' + se.slideData[index].LinkImage;
              }
              se.slideData[index].LinkImage = (se.slideData[index].LinkImage.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + se.slideData[index].LinkImage : se.slideData[index].LinkImage;
            }
          }

          switch (se.json) {
            case 50:
              se.json = "./assets/star/ic_star_5.svg";
              break;
            case 45:
              se.json = "./assets/star/ic_star_4.5.svg";
              break;
            case 40:
              se.json = "./assets/star/ic_star_4.svg";
              break;
            case 35:
              se.json = "./assets/star/ic_star_3.5.svg";
              break;
            case 30:
              se.json = "./assets/star/ic_star_3.svg";
              break;
            case 25:
              se.json = "./assets/star/ic_star_2.5.svg";
              break;
            case 20:
              se.json = "./assets/star/ic_star_2.svg";
              break;
            case 15:
              se.json = "./assets/star/ic_star_1.5.svg";
              break;
            case 10:
              se.json = "./assets/star/ic_star_1.svg";
              break;
            case 5:
              se.json = "./assets/star/ic_star_0.5.svg";
              break;
            default:
              break;
          }
          setTimeout(() => {
            se.ischeck = true;
          }, 300);
          if (se.loader) {
            se.loader.dismiss();
          }
          if(!isloaddata){
            se.checkPriceHotelDetail().then((check) => {
              if (check) {
                se.getdataroom();
                se.zone.run(() => {
                  if (jsondata.Combos) {
                    se.fc = jsondata.Combos.ComboType == "Vé Máy Bay";
                    se.fs = jsondata.Combos.ComboType == "Flash Sale";
                    se.fcbcar =  jsondata.Combos.ComboType == "Combo Xe";
                    //se.nm = !jsondata.Combos.ComboType;
                  } else {
                    se.fs = false;
                    se.fc = false;
                  }
                }, 100)
              } else {
                se.hotelRoomClasses = [];
                se.ischeckoutofroom = false;
                se.loadcomplete = true;
                se.ischeck = true;
                se.allowbookcombofc = false;
                se.allowbookcombofx = false;
              }
            });
          }
  }

  checkPriceHotelDetail(): Promise<boolean>{
    var se = this;
    var result = true;
    
    return new Promise((resolve, reject) => {
        //resolve(result);
        var options;
        var form = {
          CheckInDate: se.cin,
          CheckOutDate: se.cout,
          CityID: '',
          CountryID: '',
          HotelID: se.HotelID,
          IsLeadingPrice: '1',
          IsPackageRate: 'false',
          NationalityID: '82',
          ReferenceClient: '',
          RoomNumber: se.room,
          'RoomsRequest[0].RoomIndex': '1',
          Supplier: 'IVIVU',
          dataKey: '',
          'RoomsRequest[0][Adults][value]': se.adults,
          'RoomsRequest[0][Child][value]': se.child,
          IsFenced: se.loginuser ? true : false
        };
        if (se.searchhotel.arrchild) {
          for (var i = 0; i < se.searchhotel.arrchild.length; i++) {
            form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + se.searchhotel.arrchild[i].numage;
          }
        }

        options = {
          method: 'POST',
          url: C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2',
          timeout: 180000, maxAttempts: 5, retryDelay: 2000,
          async: true,
          headers:
            {},
          form
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "hoteldetail",
              func: "checkPriceHotelDetail",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
            result = false;
          }
          if (error) {
            error.page = "hoteldetail";
            error.func = "checkPriceHotelDetail";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
            result = false;
          };
            let jsonhtprice1 = JSON.parse(body);
            let key = se.HotelID.toString() +"_"+se.cin.toString()+"_"+se.cout.toString()+"_"+se.adults.toString()+"_" +se.child.toString();
            se.activityService.HotelSearchReqContract = { id: key, value: JSON.parse(body)};
            if (jsonhtprice1.Hotels) {
              result =  true;
            }else{
              result = false;
              if(se.loader){
                se.loader.dismiss();
              }
            }
            resolve(result);
        })
    });
  }

  /***
   * Hàm load giá khách sạn liên quan
   * PDANH 15/02/2019
   */
  getPriceHotelRelated(): any {
    var se = this;
    let listhotels = "";
    let listhotelIdInternal = "";
    for (let i = 0; i < se.HotelRelated.length; i++) {
      if (i == se.HotelRelated.length - 1) {
        listhotels = listhotels+ se.HotelRelated[i].Id;
        listhotelIdInternal = listhotelIdInternal + se.HotelRelated[i].Id;
      } else {
        listhotels = listhotels+ se.HotelRelated[i].Id+ ",";
        listhotelIdInternal = listhotelIdInternal + se.HotelRelated[i].Id + ",";
      }
    }
    var options;
    var form = {
      RoomNumber: '1',
      IsLeadingPrice: '',
      ReferenceClient: '',
      Supplier: 'IVIVU',
      CheckInDate: se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin,
      CheckOutDate: se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout,
      CountryID: '',
      CityID: '',
      NationalityID: '',
      'RoomsRequest[0][RoomIndex]': '0',
      'RoomsRequest[0][Adults][value]': se.searchhotel.adult ? se.searchhotel.adult : se.adults,
      'RoomsRequest[0][Child][value]': se.searchhotel.child ? se.searchhotel.child : se.child,
      StatusMethod: '2',
      'CityCode': se.authService.region,
      CountryCode: 'VN',
      NoCache: 'false',
      SearchType: '2',
      HotelIds: listhotels,
      HotelIdInternal: listhotelIdInternal
    };
    if (this.searchhotel.arrchild) {
      for (var i = 0; i < this.searchhotel.arrchild.length; i++) {
        form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + this.searchhotel.arrchild[i].numage;
      }
    }

    options = {
      method: 'POST',
      url: C.urls.baseUrl.urlContracting + '/api/contracting/HotelsSearchPriceAjax',
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
      headers:
        {},
      form
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "hoteldetail",
          func: "getPriceHotelRelated",
          message: response.statusMessage,
          content: response.body,
          type: "warning",
          param: JSON.stringify(options)
        };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page = "hoteldetail";
        error.func = "getPriceHotelRelated";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error,response);
        throw new Error(error)
      };
      se.zone.run(() => {
        se.ListHotelRelatedPrice = [];
        let jsonhtprice1 = JSON.parse(body);
        if (jsonhtprice1.HotelListResponse) {
          jsonhtprice1 = jsonhtprice1.HotelListResponse.HotelList.HotelSummary;
          for (var i = 0; i < jsonhtprice1.length; i++) {
            se.ListHotelRelatedPrice.push(jsonhtprice1[i]);
          }
          //Bind giá vào list ks đã search
          setTimeout(() => {
            se.zone.run(() => se.fillDataPrice());
          }, 300);

        }
      })
    })
  }
  /**Bind lại giá nếu có giá OTA
     * PDANH 15/02/2018
     */
  fillDataPrice() {
    for (let index = 0; index < this.HotelRelated.length; index++) {
      for (let i = 0; i < this.ListHotelRelatedPrice.length; i++) {
        //Chỉ bind lại giá cho hotel, combo bỏ qua
        if (this.HotelRelated[index] && this.HotelRelated[index].Id == this.ListHotelRelatedPrice[i].HotelId) {
          this.HotelRelated[index].MinPriceOTAStr = this.ListHotelRelatedPrice[i].MinPriceOTAStr;
          this.HotelRelated[index].MinPriceTAStr = this.ListHotelRelatedPrice[i].MinPriceTAStr;
          this.HotelRelated[index].RoomNameSubString = this.ListHotelRelatedPrice[i].RoomNameSubString;
          this.HotelRelated[index].PromotionDescription = this.ListHotelRelatedPrice[i].PromotionDescription;
          this.HotelRelated[index].PromotionDescriptionSubstring = this.ListHotelRelatedPrice[i].PromotionDescriptionSubstring;
        }
      }
    }
  }
  /*
  * Hàm check item khách sạn đã tồn tại trong list json1 hay chưa: 1 = đã có; 0 - chưa có
  * @param item khách sạn cần check
  */
  checkExistsItem(id) {
    var co = 0;
    if (id) {
      for (let i = 0; i < this.HotelRelated.length; i++) {
        if (id == this.HotelRelated[i].HotelId) {
          co = 1;
          break;
        }
      }
    }

    return co;
  }



  convertWCFStringDate(strDate) {
    var matched = this.dateRegex.exec(strDate);
    if (matched) {
      var parts = matched[1].split(/[-+,.]/);
      return new Date(parts[0] ? +parts[0] : 0 - +parts[1]);
    }
  }
  /***
   * Hàm load thông tin combo khách sạn
   * PDANH 15/02/2019
   */
  getDetailCombo(comboid): any {
    var se = this;
    se.ischeckcbcarhide=false;
    var optionscombo = {
      method: 'GET',
      url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/ComboDetailList?comboId=' + (comboid ? comboid : se.comboid) + '&checkin=' + moment(this.cin).format('DD-MM-YYYY') + '&checkout=' + moment(this.cout).format('DD-MM-YYYY'),
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers: {
        apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
        apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
      }
    };
    request(optionscombo, function (error, response, body) {
      if (!error) {
        //se.objDetail.push(JSON.parse(body));
        var obj = JSON.parse(body);
        //Giờ xe
        if (obj.comboDetail) {          
        se.bookCombo.transportDepartTime=obj.comboDetail.transportDepartTime;
        se.bookCombo.transportReturnTime=obj.comboDetail.transportReturnTime;
        }else{
          se.allowbookcombofc = false;
          se.allowbookcombofx = false;
        }
        var item = obj.comboDetail;
        var itemList = obj.list;
        se.comboDetail = obj;
        se.dateofcombo = se.comboDetail.dateOfCombo;
        se.hasInsurrance = item ? item.isInsurance : false;
        se.zone.run(() => {
          se.changedate = false;
          se.comboDetailList = [];
          if (item) {
            se.fc = (item.comboType == "1");
            se.fs = (item.comboType == "2");
            se.fcbcar = item.comboType == "3";
            se.nm = (item.comboType == null);
            if (se.fs && item.availableTo) {
              let dateEnd = new Date(item.availableTo.toLocaleString());
              let dateNow = new Date(se.searchhotel.CheckInDate + " 00:00:00");
              if (moment(dateNow).diff(moment(dateEnd),'days') > 0 ) {
                se.flashSaleEndDate = moment(dateEnd).format('DD.MM.YYYY');
              }
            }
            if(se.fc && (item.availableTo || se.comboDetail.endDate)){
              var diffday = 1;
              if(se.comboDetail && se.comboDetail.endDate){
                //diffday = moment(new Date(se.searchhotel.CheckOutDate)).diff(moment(new Date(se.comboDetail.endDate)),'days');
                var arr = se.comboDetail.endDate.split('-');
                var newdate = new Date(arr[2],arr[1] -1,arr[0]);
                var d = moment(newdate).format('YYYY-MM-DD');
                se.allowbookcombofc = moment(se.searchhotel.CheckOutDate).diff(moment(d),'days') > 0 ? false : true;
                se.allowbookcombofx = moment(se.searchhotel.CheckOutDate).diff(moment(d),'days') > 0 ? false : true;
              }
            }
            if (item.roomId && item.price) {
              //se.getdataroom();
              se.checkPriceHotelDetail().then((check)=>{
              if(check){
                se.ischeckoutofroom = true;
                se.getdataroom();
              }else{
                se.hotelRoomClasses = [];
                se.ischeckoutofroom = false;
                se.loadcomplete = true;
                se.ischeck = true;
                se.allowbookcombofc = false;
                se.allowbookcombofx = false;
              }
            });
              se.zone.run(() => {
                setTimeout(() => {
                  if (se.loadcomplete) {
                    if (se.jsonroom1 && se.jsonroom1.length > 0) {
                      se.jsonroom1.forEach(element => {
                        element.MealTypeRates.forEach(elementMealtype => {
                          if (elementMealtype.RoomId == item.roomId && elementMealtype.IsFlashSale) {
                            se.hasComboRoom = true;
                            se.bookCombo.Hotelid = se.HotelID;
                            se.bookCombo.roomid = elementMealtype.RoomId;
                            se.bookCombo.roomNb = se.searchhotel.roomnumber;
                            se.bookCombo.Adults = se.searchhotel.adult;
                            se.bookCombo.Child = se.searchhotel.child;
                            se.bookCombo.ChildAge = se.searchhotel.arrchild;
                            se.bookCombo.ComboRoomPrice = elementMealtype.PriceAvgPlusTAStr;
                            se.comboprice = elementMealtype.PriceAvgPlusTAStr;
                            se.loadpricecombodone = true;
                            se.warningMaxPax = elementMealtype.MSG;
                          }
                        })
                      });
                    }
                  } else {
                    setTimeout(() => {
                      if (se.loadcomplete) {
                        if (se.jsonroom1 && se.jsonroom1.length > 0) {
                          se.jsonroom1.forEach(element => {
                            element.MealTypeRates.forEach(elementMealtype => {
                              if (elementMealtype.RoomId == item.roomId && elementMealtype.IsFlashSale) {
                                se.hasComboRoom = true;
                                se.bookCombo.Hotelid = se.HotelID;
                                se.bookCombo.roomid = elementMealtype.RoomId;
                                se.bookCombo.roomNb = se.searchhotel.roomnumber;
                                se.bookCombo.Adults = se.searchhotel.adult;
                                se.bookCombo.Child = se.searchhotel.child;
                                se.bookCombo.ChildAge = se.searchhotel.arrchild;
                                se.bookCombo.ComboRoomPrice = elementMealtype.PriceAvgPlusTAStr;
                                se.comboprice = elementMealtype.PriceAvgPlusTAStr;
                                se.loadpricecombodone = true;
                                se.warningMaxPax = elementMealtype.MSG;
                              }
                            })
                          });
                        }
                      }
                    }, 3000);
                  }

                }, 3000);
              });
            }
            se.changedate = false;
          }
          else{
            se.allowbookcombofc = false;
            se.allowbookcombofx = false;
          }
          if (itemList) {
            itemList.forEach(item => {
              if(item.details && item.details.length >0){
                item.details.forEach((itemdetail) => {
                  itemdetail.priceDisplay = itemdetail.totalPriceSale.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g, ".");
                })
              }
              se.comboDetailList.push(item);
            });
          }
        })
      } else if (error) {
        error.page = "hoteldetail";
        error.func = "getDetailCombo";
        error.param = JSON.stringify(optionscombo);
        C.writeErrorLog(error,response);
        throw new Error(error)
      };
      if (response.statusCode != 200) {
        var objError = {
          page: "hoteldetail",
          func: "getDetailCombo",
          message: response.statusMessage,
          content: response.body,
          type: "warning",
          param: JSON.stringify(optionscombo)
        };
        C.writeErrorLog(objError,response);
      }
      se.searchhotel.roomID=se.RoomID;
      if((item && item.roomId) || se.searchhotel.hotelID ) {
        se.getBOD( (item && item.roomId)? item.roomId : '' ) ;
      }else{
        se.zone.run(()=>{
          se.checkBODdone = true;
          })
      }
      se.getInsurranceFee(comboid).then((data)=>{
        //console.log(data);
        if(data.data){
          se.objInsurranceFee = data.data;
          if(data.data.priceTaTotal >0){
            se.InsurranceFee = data.data.priceTaTotal.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.").replace(/\,/g,'.');
          }else{
            se.InsurranceFee = "";
          }
          
        }
      })
    })
  }
  async getInsurranceFee(comboid): Promise<any>{
    var se = this;
    let days = moment(this.cout).diff(moment(this.cin),'days') + 1;
    return new Promise((resolve, reject) =>{
      var optionscombo = {
        method: 'GET',
        url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/ComboServiceFee?comboId=' + (comboid ? comboid : se.comboid) + '&days=' + days + '&pax=' + (se.adults + se.child),
        timeout: 10000, maxAttempts: 5, retryDelay: 2000,
        headers: {
          apisecret: '2Vg_RTAccmT1mb1NaiirtyY2Y3OHaqUfQ6zU_8gD8SU',
          apikey: '0HY9qKyvwty1hSzcTydn0AHAXPb0e2QzYQlMuQowS8U',
        }
      };
      request(optionscombo, function (error, response, body) {
        if (!error) {
          var result:any = JSON.parse(body);
          resolve(result);
        }
      })
      
    })
  }

  btnseemore() {
    this.HotelreviewsPage();
    //this.isbtnseemore = false;
    //this.isShow = true;

  }
  seedetail(id) {
    var self = this;
    this.arrroom = [];
    var coroom;
    for (let i = 0; i < self.jsonroom.length; i++) {
      if (id == self.jsonroom[i].value.Rooms[0].RoomID) {
        this.arrroom.push(self.jsonroom[i].value);
        coroom = self.jsonroom[i].co;
        break;
      }
    }
    var date1 = new Date(this.cin);
    var date2 = new Date(this.cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));

    var value = { Address: this.Address, Name: this.name, imghotel: this.imgHotel, cin: this.cin, cout: this.cout, dur: this.duration, room: this.arrroom, adults: this.adults, child: this.child, roomnumber: this.roomvalue, coroom: coroom, texttitle: this.text };
    this.navCtrl.navigateForward('/RoomdetailPage/'+ JSON.stringify(value));
    // alert(self.arrroom);
  }
  
  selectclick(event, text) {
    for (let i = 0; i < this.arrchild.length; i++) {
      if (this.arrchild[i].text == text) {
        this.arrchild[i].numage = event;
        break;
      }
    }
  }
  selectclickcin() {

    this.cout = new Date(this.cin);
    var datecin = new Date(this.cin);
    this.cincombo = moment(datecin).format('YYYYMMDD');
    var res = this.cout.setTime(this.cout.getTime() + (1 * 24 * 60 * 60 * 1000));
    var date = new Date(res);
    this.cout = moment(date).format('YYYY-MM-DD');
    if (this.room && this.guest) {
      //this.presentLoading5000();
      this.ischeck = false
      this.presentLoading();
    }
  }
  selectclickout() {

    var datecin = Date.parse(this.cin);
    var datecout = Date.parse(this.cout);

    if (datecin >= datecout) {
      this.presentToastwarming('Ngày check in không lớn hơn hoặc bằng ngày check out');
    }
    else {
      if (this.room && this.guest) {
        // this.presentLoading5000();
        this.ischeck = false
        this.presentLoading();
      }
    }
  }

  async presentToastwarming(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }

  /***
 * Hàm load thông tin phòng
 */
async getdataroom() {
  var self = this;
  var se = this;
  var options;
  let key = se.HotelID.toString() +"_"+se.cin.toString()+"_"+se.cout.toString()+"_"+se.adults.toString()+"_" +se.child.toString();
  var form = {
    CheckInDate: self.cin,
    CheckOutDate: self.cout,
    CityID: '',
    CountryID: '',
    HotelID: self.HotelID,
    IsLeadingPrice: '1',
    IsPackageRate: 'false',
    NationalityID: '82',
    ReferenceClient: '',
    RoomNumber: self.room,
    'RoomsRequest[0].RoomIndex': '1',
    Supplier: 'IVIVU',
    dataKey: '',
    'RoomsRequest[0][Adults][value]': self.adults,
    'RoomsRequest[0][Child][value]': self.child,
    IsFenced: self.loginuser ? true : false
  };
  if (self.searchhotel.arrchild) {
    self.arrchild1 = [];
    for (var i = 0; i < self.searchhotel.arrchild.length; i++) {
      // form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + self.arrchild[i].numage;
      form["RoomsRequest[0][AgeChilds][" + i + "][value]"] = + self.searchhotel.arrchild[i].numage;
      self.arrchild1.push(self.searchhotel.arrchild[i].numage);
    }
  }
  self.formParam = form;

  if(se.activityService.HotelSearchReqContract && key == se.activityService.HotelSearchReqContract.id ){
    let result = se.activityService.HotelSearchReqContract.value;
    se.excuteLoadHotelRoom(result);
  }else{
    options = {
      method: 'POST',
      url: C.urls.baseUrl.urlContracting + '/api/contracting/HotelSearchReqContractAppV2',
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
      headers:
        {},
      form
    };
    request(options, function (error, response, body) {
      if (response.statusCode != 200) {
        var objError = {
          page: "hoteldetail",
          func: "getdataroom",
          message: response.statusMessage,
          content: response.body,
          type: "warning",
          param: JSON.stringify(options)
        };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page = "hoteldetail";
        error.func = "getdataroom";
        error.param = JSON.stringify(options);
        C.writeErrorLog(error,response);
      };
        var result = JSON.parse(body);
        se.excuteLoadHotelRoom(result);
    })
  }
}

excuteLoadHotelRoom(data){
  var self = this,
      se = this;
    self.zone.run(() => {
    if (self.loader) {
      self.loader.dismiss();
    }
    self.loadcomplete = true;
    self.ischeck = true;
    self.jsonroom = [];
    self.jsonroom2 = data;
    var result = data;
    if (result.Hotels) {
      self.jsonroom1 = result.Hotels[0];
      self.jsonroom1 = self.jsonroom1.RoomClasses
    }

    if (result.Hotels && self.jsonroom1) {
      for (let index = 0; index < self.jsonroom1.length; index++) {
        var str = self.jsonroom1[index].Rooms[0].Images;
        if(str){
          var res = str.substr(0, 4);
          if (res != "http") {
            //self.jsonroom1[index].Rooms[0].ImagesMaxWidth320 = 'https:' + self.jsonroom1[index].Rooms[0].ImagesMaxWidth320;
            self.jsonroom1[index].Rooms[0].ImagesMaxWidth320 = (self.jsonroom1[index].Rooms[0].ImagesMaxWidth320.toLocaleString().trim().indexOf("http") == -1) ? 'https:' + self.jsonroom1[index].Rooms[0].ImagesMaxWidth320 : self.jsonroom1[index].Rooms[0].ImagesMaxWidth320;
          }
          if (str.indexOf('noimage') != -1) {
            self.jsonroom1[index].Rooms[0].Images = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg";
          }
        }else{
          self.jsonroom1[index].Rooms[0].Images = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg";
        }
        
        self.num = Number(self.room) * Number(self.jsonroom1[index].Rooms[0].MaxAdults);
        var MaxChils = Number(self.room) * Number(self.jsonroom1[index].Rooms[0].MaxChils);
        var checkpax = Number(self.room) * Number(self.jsonroom1[index].Rooms[0].MaxPax);
        var total = self.adults + self.child;
        let tempnumtarget;
        var roomco = 0;
        let PriceAvgPlusTAStr;
        var copax = 0;
        var numtarget;
        if (self.num < self.adults || self.child > MaxChils) {
          roomco = 1;
          tempnumtarget = Number(self.adults) / Number(self.jsonroom1[index].Rooms[0].MaxAdults)
          numtarget = Math.ceil(tempnumtarget);
          for (let i = 0; i < self.jsonroom1[index].MealTypeRates.length; i++) {
            PriceAvgPlusTAStr = numtarget * self.jsonroom1[index].MealTypeRates[i].PriceAvgPlusTotalTA
            self.jsonroom1[index].MealTypeRates[i].PriceAvgPlusTAStr = PriceAvgPlusTAStr.toLocaleString();
          }
          copax = 1;
        }
        else if (copax == 0) {
          if (checkpax < total) {
            roomco = 1;
            tempnumtarget = Number(total) / Number(checkpax)
            numtarget = Math.ceil(tempnumtarget);
            for (let i = 0; i < self.jsonroom1[index].MealTypeRates.length; i++) {
              PriceAvgPlusTAStr = numtarget * self.jsonroom1[index].MealTypeRates[i].PriceAvgPlusTotalTA
              self.jsonroom1[index].MealTypeRates[i].PriceAvgPlusTAStr = PriceAvgPlusTAStr.toLocaleString();
            }
          }

        }
        var itemroom = { value: self.jsonroom1[index], co: roomco, numtarget: numtarget }
        self.jsonroom.push(itemroom);
      }
      //Load roomdetail
      var result = data;
      if (result.Hotels) {
        self.hotelRooms = [];
        self.hotelRoomClasses = [];
        self.hotelMealTypes = [];
        self.hotelMealTypesHidden = [];
        self.hotelRooms = result.Hotels[0];
       
        result.Hotels[0].RoomClasses.forEach((element, index) => {
          var groupMealType = 0;
          var indexMealTypeHidden = 0;
          element.hotelMealTypes = [];
          element.hotelMealTypesHidden = [];
          // if(element.MealTypeRates && element.MealTypeRates.length >0){
          //   self.room = element.MealTypeRates[0].TotalRoom;
          // }
          if (!element.Rooms[0].Images || element.Rooms[0].Images.indexOf('noimage') != -1) {
            element.Rooms[0].Images = "https://cdn1.ivivu.com/iVivu/2018/02/07/15/noimage-110x110.jpg";
          }
          for (let i = 0; i < element.MealTypeRates.length; i++) {
            var PriceAvgPlusTA=element.MealTypeRates[i].PriceAvgPlusTotalTA
            PriceAvgPlusTA=PriceAvgPlusTA/100000;
            PriceAvgPlusTA=Math.floor(PriceAvgPlusTA);
            element.MealTypeRates[i].point=PriceAvgPlusTA;

            if(element.hotelMealTypes.length == 0){
              groupMealType = groupMealType +1;
              element.MealTypeRates[i].displayMealType=true;
              element.MealTypeRates[i].groupMealType = index;
              element.hotelMealTypes.push(element.MealTypeRates[i]);
            }else{
              var mealTypeName = element.MealTypeRates[i].Name;
              //Trường hợp có thêm note thì filter theo name + note
              if(element.MealTypeRates[i].Notes && element.MealTypeRates[i].Notes.length >0){
                mealTypeName = element.MealTypeRates[i].Name + ", " +element.MealTypeRates[i].Notes.join(', ');
              }
              // + ( (element.MealTypeRates[i].Notes && element.MealTypeRates[i].Notes.length !=0)? element.MealTypeRates[i].Notes[0] : '' )
              //if(element.hotelMealTypes.filter(item =>item.Name == element.MealTypeRates[i].Name ).length ==0 ){
                if(element.hotelMealTypes.filter(item => item.Notes && item.Notes.length >0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) )) : item.Name == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) ) ).length==0) {
                groupMealType = groupMealType +1;
                element.MealTypeRates[i].displayMealType=true;
                element.MealTypeRates[i].groupMealType = index;
                element.hotelMealTypes.push(element.MealTypeRates[i]);
              }else{
                element.MealTypeRates[i].groupMealType = index;
                indexMealTypeHidden = indexMealTypeHidden+1;
                //Nếu nhiều hơn 2 item thì add vào list ẩn
                //Hiển thị item đầu tiên của list ẩn (hiển thị 2 item đầu của 1 mealtype của room)
                element.MealTypeRates[i].displayMealType = false;
                if(indexMealTypeHidden == element.MealTypeRates.length -1){
                  element.MealTypeRates[i].displaySecondItem = true;
                }
                element.hotelMealTypesHidden.push(element.MealTypeRates[i]);
              }
            }
          }
          element.countMealType = 0;
          for (let m =0; m < element.hotelMealTypes.length; m++){
            let mealTypeName = element.hotelMealTypes[m].Name;
            //Trường hợp có thêm note thì filter theo name + note
            if(element.hotelMealTypes[m].Notes && element.hotelMealTypes[m].Notes.length >0){
                mealTypeName = element.hotelMealTypes[m].Name + ", " +element.hotelMealTypes[m].Notes.join(', ');
            }
            let  count = element.MealTypeRates.filter(item => item.Notes && item.Notes.length >0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) )) : item.Name == mealTypeName && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) ) ).length;
            //let count = element.MealTypeRates.filter(item =>item.Name == element.hotelMealTypes[m].Name && (item.Supplier != 'HBED' || (item.Supplier=='HBED'&& item.Penaltys && item.Penaltys.length >0) )).length;
            element.hotelMealTypes[m].countMealType = count -1;
            //Nếu chỉ có 2 nhóm mealtype thì hiển thị 2 item đầu
            if(element.hotelMealTypes.length <= 1){
              var el = element.hotelMealTypesHidden.filter(item => item.displaySecondItem);
              if(el && el.length >0){
                el[0].displayMealType = true;
                element.hotelMealTypes[m].countMealType = count -2;
              }
            }
            //Nhiều hơn 2 nhóm mealtype => hiển thị giá gạch TA của item có giá cao nhất
            else{
              let lastElementMealTypeGroup = element.MealTypeRates.filter(item => item.Notes && item.Notes.length >0 ? (item.Name + ", " + item.Notes.join(', ') == mealTypeName) : item.Name == mealTypeName );
              let objMap = lastElementMealTypeGroup[lastElementMealTypeGroup.length - 1];
              if(objMap){
                lastElementMealTypeGroup[0].displayLastPriceAvgPlusOTA = true;
                lastElementMealTypeGroup[0].displayLastPriceAvgPlusOTAStr = objMap.PriceAvgPlusOTAStr;
              }
              
            }
          }
          element.countMealType = 0;
          for (let m =0; m < element.hotelMealTypes.length; m++){
            element.countMealType += element.hotelMealTypes[m].countMealType;
          }
         
          self.hotelRoomClasses.push(element);
        });
      } else {
        self.hotelRoomClasses = [];
      }
    }
    else {
      self.hotelRoomClasses = [];
      self.ischeckoutofroom = false;
      self.allowbookcombofc = false;
      self.allowbookcombofx = false;
    }
  });

    //check combo xe
    if (se.fcbcar) {
      se.ischeckcbcarhide=true;
    }
    if (se.loginuser) {
      if(se.hotelRoomClasses.length >0 && se.comboDetail){
        //Xét có room default trong combo và không bị quá số khách => trả về obj/ không có trả về null
        if(se.comboDetail.comboDetail)
        {
          se.checkRoomDefaultMaxPax(se.comboDetail.comboDetail.roomId, se.hotelRoomClasses).then((check)=>{
            if ((se.dateofcombo <= se.duration+1) &&se.loadcomplete && (!se.ischeckBOD && se.checkBODdone)&&se.comboDetailList.length>0 && se.hotelRoomClasses.length > 0 && se.totalAdult<=6&&se.hotelRoomClasses.length>0&&se.fcbcar&&se.allowbookcombofx && check) {
              se.ischeckcbcar=true;
            } else {
              se.ischeckcbcar=false;
            }
          })
        }
        else{
          se.ischeckcbcar=false;
        }
      }
      else{
        se.ischeckcbcar=false;
      }
    } else {
      se.ischeckcbcar=false;
    }
    if (se.fs) {
      se.ListRoomClasses=[];
      for (let i = 0; i < se.hotelRoomClasses.length; i++) {
        if (se.hotelRoomClasses[i].Rooms[0].RoomID==se.comboDetail.comboDetail.roomId) {
          se.ListRoomClasses.push(se.hotelRoomClasses[i]);
          break;
        }
      }
      se.checkRoomDefaultFsale(se.comboDetail.comboDetail.roomId, se.ListRoomClasses).then((check)=>{
        if (check) {
          if(se.objroomfsale[0].Status=='AL')
          {
            se.ischeckcbfs=true;
          }
          else{
            se.ischeckcbfs=false;
          }
        }
        else{
          se.ischeckcbfs=false;
        }
      })
    }
  }
  checkRoomDefaultFsale(roomId, roomClass): Promise<any> {
    var res = true;
    return new Promise((resolve, reject) => {
      roomClass.forEach((el) => {
        var objmap = el.MealTypeRates.filter((Meal) => {
          return Meal.RoomId == roomId && Meal.IsFlashSale == true && Meal.Supplier == 'Internal' && Meal.PromotionNote != '';
        })
        if (objmap && objmap.length > 0) {
          this.objroomfsale=objmap;
        }
      })
      res = ( this.objroomfsale &&  this.objroomfsale.length > 0);
      resolve(res);
    })

  }

  checkRoomDefaultMaxPax(roomId, roomClass) : Promise<any>{
    var se = this, res = true, listresult:any = [];
    return new Promise((resolve, reject) =>{
      roomClass.forEach((el)=>{
        var objmap = el.Rooms.filter((room)=>{
          return room.RoomID == roomId && !el.MSG;
        })

        if(objmap && objmap.length >0){
          listresult.push(objmap)
        }
      })

      res = (listresult && listresult.length > 0);
      resolve(res);
    })
    
  }

  DescriptionPage() {
    this.navCtrl.navigateForward('/hoteldescription/' + this.HotelID+'/'+this.hotelname);
  }
  HotelreviewsPage() {
    this.navCtrl.navigateForward('/hotelreviews/'+this.HotelID+'/'+this.hotelname);
  }
  FacilitiesPage() {
    this.navCtrl.navigateForward('/facilities/' +this.HotelID+'/'+this.hotelname);
  }
  PolicyPage() {
    this.navCtrl.navigateForward('/policy/'+this.HotelID+'/'+this.hotelname);
  }
  async presentAlertbook() {
    const alertController = document.querySelector('ion-alert-controller');
    await alertController.componentOnReady();

    let alert = await this.alertCtrl.create({
      message: 'Phòng cuối cùng vừa được đặt. Quý khách vui lòng chọn ngày khác.',
      buttons: ['Ok']
    });
    alert.present();
  }

  book(id, MealTypeRates, indexme, roomName, indexroom) {
    //this.presentLoadingNew();
    var self = this;
    //this.roomvalue = this.room;
    this.roomvalue = MealTypeRates.TotalRoom;
    this.arrroom = [];
    for (let i = 0; i < self.hotelRoomClasses.length; i++) {
      if (id == self.hotelRoomClasses[i].Rooms[0].RoomID) {
        this.arrroom.push(self.hotelRoomClasses[i]);
        this.indexroom = i;
        break;
      }
    }
    //console.log(this.arrroom);
    var date1 = new Date(this.cin);
    var date2 = new Date(this.cout);
    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
    this.storage.get('email').then(email => {
      if (email) {
        this.booking.CEmail = email;
      }
        this.booking.CheckInDate = this.cin;
        this.booking.CheckOutDate = this.cout,
          this.booking.roomNb = this.room,
          this.booking.Adults = this.adults,
          this.booking.Child = this.child,
          this.booking.CName = '',
          //this.booking.CEmail = email,
          this.booking.cost = MealTypeRates.PriceAvgPlusTAStr,
          this.booking.indexroom = this.indexroom,
          this.booking.indexmealtype = indexme,
          // this.booking.ChildAge = this.arrchild1,
          this.booking.HotelId = this.HotelID,
          this.Roomif.RoomId = id,
          this.booking.HotelName = self.name,
          this.booking.RoomName = roomName,
          this.Roomif.Address = this.Address,
          this.Roomif.dur = this.duration,
          this.Roomif.arrroom = this.arrroom,
          this.Roomif.roomnumber = MealTypeRates.TotalRoom,
          this.Roomif.roomtype = MealTypeRates,
          this.Roomif.jsonroom = this.jsonroom2.Hotels[0],
          this.Roomif.imgHotel = this.imgHotel;
          this.Roomif.objMealType = MealTypeRates;
          this.Roomif.HotelRoomHBedReservationRequest=JSON.stringify(this.arrroom[0].HotelRoomHBedReservationRequest);
        this.Roomif.arrrbed = [];
        this.Roomif.imgRoom = this.arrroom[0].Rooms[0].ImagesMaxWidth320;
        this.searchhotel.adult = this.adults;
        this.searchhotel.child = this.child;
        // this.searchhotel.arrchild = this.arrchild1;
        this.searchhotel.roomnumber = MealTypeRates.TotalRoom;
        this.searchhotel.CheckInDate = this.cin;
        this.searchhotel.CheckOutDate = this.cout;
        this.booking.code = this.hotelcode;
        this.bookCombo.ComboTitle="";
        this.bookCombo.ComboId=null;
        if (this.arrroom[0].MealTypeRates[indexme].Supplier == 'Internal') {
          var options = {
            method: 'GET',
            url: C.urls.baseUrl.urlContracting + '/api/toolsapi/CheckAllotment',
            qs:
            {
              token: '3b760e5dcf038878925b5613c32615ea3',
              hotelcode: this.booking.HotelId,
              roomcode: this.Roomif.RoomId,
              checkin: this.booking.CheckInDate,
              checkout: this.booking.CheckOutDate,
              totalroom: this.Roomif.roomnumber
            },
            headers:
              {}
          };
          request(options, function (error, response, body) {
            if (response.statusCode != 200) {
              var objError = {
                page: "hoteldetail",
                func: "book",
                message: response.statusMessage,
                content: response.body,
                type: "warning",
                param: JSON.stringify(options)
              };
              C.writeErrorLog(objError,response);
            }
            if (error) {
              error.page = "hoteldetail";
              error.func = "book";
              error.param = JSON.stringify(options);
              C.writeErrorLog(error,response);
              throw new Error(error)
            };
            var Hotelid={id:self.HotelID}
            var rs = JSON.parse(body);
            if (rs.Msg == "AL") {
              self.Roomif.payment = rs.Msg;
              self.Roomif.roomcancelhbed=0;
              // console.log(self.Roomif.payment);
              self.Roomif.ischeckpayment=true;
              //setTimeout(()=>{
                self.navCtrl.navigateForward('/roomdetailreview')
              //},250)
              
            } else if (rs.Msg == "RQ") {
              self.Roomif.payment = rs.Msg;
              // console.log(self.Roomif.payment);
              self.Roomif.roomcancelhbed=0;
              self.Roomif.ischeckpayment=false;
              //setTimeout(()=>{
                self.navCtrl.navigateForward('/roomdetailreview')
              //},250)
            }
            else {
              // console.log(self.Roomif.payment);
              self.presentAlertbook();
            }
          });
        }
        else if (MealTypeRates.Supplier == 'HBED') {
          if (MealTypeRates.Penaltys.length>0) {
            self.Roomif.payment = this.arrroom[0].MealTypeRates[indexme].Penaltys[0].IsPenaltyFree;
            self.Roomif.ischeckpayment = true;
            self.Roomif.roomcancelhbed=1;
            self.navCtrl.navigateForward('/roomdetailreview');
          }
          else
          {
            if (MealTypeRates.HotelRoomHBedReservationRequest.rooms[0].rateType=='RECHECK') {
              self.checkhbed(MealTypeRates);
            }
          }
        }
        else {
          // console.log(this.arrroom[0].Rooms[0].Penaltys[0].IsPenaltyFree);
          this.Roomif.arrrbed = this.arrroom[0].MealTypeRates[indexme].BedTypes;
          self.Roomif.payment = this.arrroom[0].MealTypeRates[indexme].Penaltys[0].IsPenaltyFree;
          self.Roomif.ischeckpayment=true;
          self.Roomif.roomcancelhbed=0;
          //setTimeout(()=>{
            self.navCtrl.navigateForward('/roomdetailreview');
          //},250)
        }
      //
    })
    
  }
  checkhbed(MealTypeRates) {
    var self=this;
    var form = {
      GrossProfitOnline: MealTypeRates.HotelRoomHBedReservationRequest.GrossProfitOnline,
      rooms: MealTypeRates.HotelRoomHBedReservationRequest.rooms,
      rateCommentId: MealTypeRates.HotelRoomHBedReservationRequest.rateCommentId
    }
    var options = {
      method: 'POST',
      url: C.urls.baseUrl.urlContracting + '/api/contracting/GetRateCommonHbedAjax',
      headers: {},
      form 
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var json=JSON.parse(body);
      if (json.cancelPolicy) {
        self.Roomif.payment = json.cancelPolicy[0].IsPenaltyFree;
        self.Roomif.ischeckpayment = true;
        var Penalty_Datetemp = json.cancelPolicy[0].Penalty_Date;
        var Penalty_Date1 = new Date(Penalty_Datetemp);;
        var Penalty_Date = Penalty_Date1.setTime(Penalty_Date1.getTime() - (1 * 24 * 60 * 60 * 1000));
        var Penalty_Date2 = moment(Penalty_Date).format('DD-MM-YYYY');
        var thu = moment(Penalty_Date).format('dddd');
        switch (thu) {
          case "Monday":
            thu = "Thứ 2"
            break;
          case "Tuesday":
            thu = "Thứ 3"
            break;
          case "Wednesday":
            thu = "Thứ 4"
            break;
          case "Thursday":
            thu = "Thứ 5"
            break;
          case "Friday":
            thu = "Thứ 6"
            break;
          case "Saturday":
            thu = "Thứ 7"
            break;
          default:
            thu = "Chủ nhật"
            break;
        }
        var a = json.cancelPolicy[0].Penalty_Val_OTA;
        var money=Math.ceil(a / 100) * 100;
        var money1=money.toLocaleString()
        //console.log(Math.ceil(a / 100) * 100);
        var text = "Sau 12:00 PM ngày " + thu + ", " + Penalty_Date2 + " sẽ bị tính phí là: "+money1+" VND";
        self.Roomif.objMealType = MealTypeRates;
        self.Roomif.textcancel=text;
        // self.storage.set(MealTypeRates.HotelRoomHBedReservationRequest.rooms[0].rateKey,json.cancelPolicy[0].IsPenaltyFree);
        // self.listkeyhdbed.push(MealTypeRates.HotelRoomHBedReservationRequest.rooms[0].rateKey);
        self.Roomif.roomcancelhbed=0;
        self.navCtrl.navigateForward('/roomdetailreview');
        //self.navCtrl.navigateForward('/roomdetailreview');
      }
      else
      {
        alert("Đã hết phòng, vui lòng chọn lại phòng khác!");
      }
     
      console.log(body);
    });
  }
async bookcombo() {
    this.storage.get('email').then(email => {
      if (email) {
        //Gọi popup gửi yêu cầu
        this.bookCombo.Email = email;
        this.bookCombo.Address = this.Address;
        // const modal: HTMLIonModalElement = await this.modalCtrl.create('RequestComboPage');
        // modal.present();
      }
    })
    //google analytic
    this.gf.googleAnalytion('hoteldetail','bookcombo','');
    // var item = { namecombo: this.titlecombo, ComboDayNum: this.ComboDayNum, cin: this.cin, imghotel: this.imgHotel, namehotel: this.name, Address: this.Address };
    // this.navCtrl.push('CombochoosedeparturetimePage', item);
  }
  btnclick() {
    this.ischeckbtn = false;
    this.ischeckbtnreset = true;
    this.navCtrl.back();
  }
  btnclick1() {
    this.ischeckbtn = true;
    this.ischeckbtnreset = false;

  }
  goback() {
    this.isexit = true;
    this.searchhotel.isRefreshDetail = false;
    this.searchhotel.showPopup = false;
    if (this.searchhotel.rootPage == "mainpage" || this.searchhotel.rootPage == "topdeal" ) {
      this.navCtrl.navigateBack('/app/tabs/tab1');
    }
    // else if(this.searchhotel.rootPage == "roompaymentselect")
    // {
    //   this.navCtrl.navigateForward('/');
    // }
    else {
      if(this.searchhotel.rootPage == "listpage"){
        //this.navCtrl.navigateBack('/hotellist/false');
        //this.navCtrl.navigateBack('/app/tabs/hotellist/false');
        this.navCtrl.navigateRoot('/hotellist/false');
      }
      else if(this.searchhotel.rootPage == "likepage"){
        this.navCtrl.navigateBack('/tabs/tab2');
      }
      else if(this.searchhotel.rootPage == "MyTrip"){
        this.navCtrl.navigateBack('app/tabs/tab3');
      }
      else if(this.searchhotel.rootPage == "combolist"){
        this.navCtrl.navigateBack('app/tabs/combolist');
      }
      else if(this.searchhotel.rootPage == "topdeallist"){
        this.navCtrl.navigateBack('/topdeallist');
      }
      else if(this.searchhotel.rootPage == "listmood"){
        let hotellistmoodparams = this.gf.getParams('hotellistmood')
        if(hotellistmoodparams){
          //this.router.navigateByUrl('/hotellistmood/'+hotellistmoodparams.moodid+'/'+hotellistmoodparams.title);
          this.navCtrl.navigateBack('/hotellistmood/'+ hotellistmoodparams.moodid + '/' + hotellistmoodparams.title);
        }else{
          this.navCtrl.back();
        }
        //this.navCtrl.navigateBack(['/app/tabs/hotellistmood/false']);
      }else{
        this.navCtrl.navigateBack('/app/tabs/tab1');
      }
    }
  }
  /***
   * Hàm click vào row khách sạn liên quan
   * PDANH 15/02/2019
   */
  itemHotelRelated(id) {
    var se = this;
    se.flag = 1;
    se.isheader1 = true;
    se.presentLoadingRelated(100);
    se.zone.run(() => {
      se.HotelID = id;
      se.searchhotel.isRefreshDetail = true;
      se.searchhotel.hotelID = id;
      se.presentLoading();
      se.loadTopSale24h(id);
          let el = document.getElementsByClassName('div-float-arrow');
          if(el.length >0){
              el[0].classList.remove('float-arrow-enabled');
              el[0].classList.add('float-arrow-disabled');
            }
    })
    //google analytic
    se.gf.googleAnalytion('hoteldetail','hotelrelatedclick','');
  }
  // add value KH
  plusadults() {
    this.adults1++;
    if (this.adults1 == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }
  }
  minusadults() {
    if (this.adults1 > 1) {
      this.adults1--;
    }
    if (this.adults1 == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }


  }
  pluschild() {
    this.child1++;
    var arr = { text: 'Trẻ em' + ' ' + this.child1, numage: "7" }
    this.arrchild2.push(arr);
    if (this.child1 == 0) {
      this.ischeckchild = false;
    }
    else {
      this.ischeckchild = true;
    }

  }
  minuschild() {
    if (this.child1 > 0) {
      this.child1--;
      this.arrchild2.splice(this.arrchild2.length - 1, 1);
    }
    if (this.child1 == 0) {
      this.ischeckchild = false;
    }
    else {
      this.ischeckchild = true;
    }
  }
  minusroom() {
    if (this.room1 > 1) {
      this.room1--;
    }
    if (this.room1 == 1) {
      this.ischeckroom = false;
    } else {
      this.ischeckroom = true;
    }
  }
  plusroom() {
    this.room1++;
    if (this.room1 == 1) {
      this.ischeckroom = false;
    } else {
      this.ischeckroom = true;
    }
  }
  async presentAlert(msg, PenaltyDateParseStr) {
    let alert = await this.alertCtrl.create({
      message: 'Yêu cầu hủy/thay đổi phòng nhận được từ: ' + msg + '',
      buttons: ['Ok']
    });
    alert.present();
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }
  /***
   * Next trên slide
   */
  test() {
    this.slider.getActiveIndex().then(index=>{
      this.hotelimg = this.slideData[index].LinkImage;
      this.coutslide = index + 1;
    });
    
    let elements = document.querySelectorAll(".grad1");
    if (elements != null) {
      // debugger
    }
  }

  /***
   * Mở page chọn lịch
   * PDANH 15/02/2019
   */
  openPickupCalendar() {
    this.zone.run(() => {
      this.loadcomplete = false;
      this.hotelRoomClasses = [];
    });
    this.searchhotel.CheckInDate = this.cin;
    this.searchhotel.CheckOutDate = this.cout;
    //Xóa clone page-searchhotel do push page
    //this.clearClonePage("page-pickup-calendar");
    //this.router.navigateByUrl('/pickup-calendar/true');
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
  /***
   * Share link hotel
   * PDANH 15/02/2019
   */
  share() {
    this.socialSharing.share(null, null, null, this.hotelurl).then(() => {
      // Success!
    }).catch(() => {
      // Error!
    });
  }
  /***
   * Cập nhật like của hotel
   * PDANH 15/02/2019
   */
  updateLikeStatus() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
        var text = "Bearer " + auth_token;
        var options = {
          method: 'GET',
          url: C.urls.baseUrl.urlMobile + '/mobile/OliviaApis/GetFavouriteHotelByUser',
          timeout: 10000, maxAttempts: 5, retryDelay: 2000,
          headers:
          {
            //'postman-token': '89692e55-6555-1572-db28-4becc311f0ba',
            'cache-control': 'no-cache',
            'content-type': 'application/json',
            authorization: text
          }
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "hoteldetail",
              func: "updateLikeStatus",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "hoteldetail";
            error.func = "updateLikeStatus";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          } else {
            if (body) {
              se.zone.run(() => {
                se.dataListLike = JSON.parse(body);
                let like = false;
                //Kiểm tra có trong list like không
                if (se.dataListLike.length > 0) {
                  like = se.checkItemLiked(se.HotelID) == 1 ? true : false;
                }
                se.itemlike = like;
              });
            } else {
              se.showConfirm();
            }
          }

        });
      }
      else{
        se.itemlike = false;
      }
    });

  }
  /***
   * Hàm check hotel like/unlike
   * PDANH 15/02/2019
   */
  checkItemLiked(id) {
    var co = 0;
    id=parseInt(id);
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
  /*** Set like item
   * PDANH  29/01/2018
   */
  likeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
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
          body: { hotelId: se.HotelID },
          json: true
        };
        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "hoteldetail",
              func: "likeItem",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "hoteldetail";
            error.func = "likeItem";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          se.HotelIDLike='';
          se.zone.run(() => {
            setTimeout(() => {
              se.itemlike = true;
            }, 10)
          })
        });
      }
      else {
        se.HotelIDLike=se.HotelID;
        //se.valueGlobal.backValue = 'carcombo';
        //se.valueGlobal.logingoback = 'TabPage';
        se.navCtrl.navigateForward('/login');
      }
    });
    //google analytic
    se.gf.googleAnalytion('hoteldetail','likeitem','');
  }
  /*** Set unlike item
   * PDANH  29/01/2018
   */
  unlikeItem() {
    var se = this;
    se.storage.get('auth_token').then(auth_token => {
      if (auth_token) {
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
          body: { hotelId: se.HotelID },
          json: true
        };

        request(options, function (error, response, body) {
          if (response.statusCode != 200) {
            var objError = {
              page: "hoteldetail",
              func: "likeItem",
              message: response.statusMessage,
              content: response.body,
              type: "warning",
              param: JSON.stringify(options)
            };
            C.writeErrorLog(objError,response);
          }
          if (error) {
            error.page = "hoteldetail";
            error.func = "unlikeItem";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error,response);
          };
          se.zone.run(() => {
            setTimeout(() => {
              se.itemlike = false;
            }, 10)
          })
        });
      }
      else {
        //se.valueGlobal.logingoback = 'TabPage';
        se.navCtrl.navigateForward('/login');
      }
    });
    //google analytic
    se.gf.googleAnalytion('hoteldetail','unlikeitem','');
  }
  /*** Show popup  chi tiết khách sạn
   * PDANH  18/02/2018
   */
  showRoomDetail(obj) {
    let param = {
      hoteldetail: obj
    };
    //this.searchhotel.showPopup = true;
    this.gf.setParams({ objroom: obj, jsonroom: this.jsonroom2.Hotels[0], imgHotel: this.imgHotel, address: this.Address }, 'hotelroomdetail');
    this.navCtrl.navigateForward('/hotelroomdetail/'+this.HotelID);
    // let modal = this.modalCtrl.create('HotelRoomDetailPage', param);
    // modal.present();
    //google analytic
    //this.gf.googleAnalytion('hoteldetail','showroomdetail','');
  }

/**
   * Hàm xử lý sau khi chọn fromdate,todate thì đóng popup, tự xử lý ngày chọn fromdate,todate
   * @param e Sự kiện click chọn ngày fromdate,todate trên lịch
   */
  async clickedElement(e: any) {
    var obj:any = e.currentTarget;
    if($(obj.parentNode).hasClass('endSelection') || $(obj.parentNode).hasClass('startSelection')){
      if(this.modalCtrl){
        let fday:any;
        let tday:any;
        var monthenddate:any;
          var yearenddate:any;
          var monthstartdate:any;
          var yearstartdate:any;
          var objTextMonthEndDate: any;
          var objTextMonthStartDate: any;
          
          if ($(obj.parentNode).hasClass('endSelection')) {
            // fday = $('.on-selected')[0].textContent;
            // tday = $(obj)[0].textContent;
            if ( $('.days-btn.lunarcalendar.on-selected > p')[0]) {
              fday= $('.days-btn.lunarcalendar.on-selected > p')[0].innerText;
            } else {
              fday = $('.on-selected')[0].textContent;
            }
            if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
              tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText; 
            } else {
              tday = $(obj)[0].textContent;
            }
            objTextMonthStartDate = $('.on-selected').closest('.month-box').children()[0].textContent;
            objTextMonthEndDate = $(obj).closest('.month-box').children()[0].textContent;
          } else {
            if ($('.days-btn.lunarcalendar.on-selected > p')[0]) {
              fday =$('.days-btn.lunarcalendar.on-selected > p')[0].innerText
            }
            else{
              fday = $(obj)[0].textContent;
            }
            if ($('.days.endSelection .days-btn.lunarcalendar > p')[0]) {
              tday = $('.days.endSelection .days-btn.lunarcalendar > p')[0].innerText;
            }
            else{
              tday = $('.endSelection').children('.days-btn')[0].textContent;
            }
            objTextMonthStartDate = $(obj).closest('.month-box').children()[0].textContent;
            objTextMonthEndDate = $('.endSelection').closest('.month-box').children()[0].textContent;
          }
          
          
          if(objTextMonthEndDate && objTextMonthEndDate.length >0 && objTextMonthStartDate && objTextMonthStartDate.length >0){
            monthstartdate = objTextMonthStartDate.split('/')[0];
            yearstartdate = objTextMonthStartDate.split('/')[1];
            monthenddate = objTextMonthEndDate.split('/')[0];
            yearenddate = objTextMonthEndDate.split('/')[1];
            var fromdate = new Date(yearstartdate, monthstartdate - 1, fday);
            var todate = new Date(yearenddate, monthenddate - 1, tday);
          if(fromdate && todate && moment(todate).diff(fromdate,'days') > 0){
            setTimeout(()=>{
              this.modalCtrl.dismiss();
            },300)
            var se = this;
                se.searchhotel.CheckInDate = moment(fromdate).format('YYYY-MM-DD');
                se.searchhotel.CheckOutDate = moment(todate).format('YYYY-MM-DD');
                se.bookCombo.CheckInDate = se.searchhotel.CheckInDate
                se.bookCombo.CheckOutDate = se.searchhotel.CheckOutDate
                se.zone.run(()=>{
                  if(se.searchhotel.CheckInDate && se.searchhotel.CheckOutDate){
                    se.cin = se.searchhotel.CheckInDate;
                    se.cout = se.searchhotel.CheckOutDate;
                    se.datecin = new Date(se.searchhotel.CheckInDate);
                    se.datecout = new Date(se.searchhotel.CheckOutDate);
                    se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
                    se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
                    se.cindisplayhr = moment(se.datecin).format('DD/MM');
                    se.coutdisplayhr = moment(se.datecout).format('DD/MM');
                    se.loadcomplete = false;
                    var date1 = new Date(se.cin);
                    var date2 = new Date(se.cout);
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
                  }
                  
                  se.changedate = true;
                  se.hasComboRoom = false;
                  se.comboprice = se.combopriceontitle;
                  se.showpopup = true;
                  se.ischeck = true;
                  se.guest = se.adults + se.child;
                  se.hotelRoomClasses = [];
                  se.loadcomplete = false;
                  if (se.comboid) {
                    se.getDetailCombo(se.comboid);
                  }
                  se.checkPriceHotelDetail().then((check)=>{
                    if(check){
                      se.getdataroom();
                    }else{
                      se.hotelRoomClasses = [];
                      se.ischeckoutofroom = false;
                      se.loadcomplete = true;
                      se.ischeck = true;
                      se.allowbookcombofc = false;
                      se.allowbookcombofx = false;
                      
                    }
                  });
              })
          }
        }
      }
    }
  }
  
  /*** Xử lý refresh data khi người dùng đổi ngày checkin,checkout
   * PDANH  18/02/2018
   */
  async changeDate() {
    if(!this.loadcomplete){
      this.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
    this.zone.run(() => {
      this.loadpricecombodone = false;
      this.loadcomplete = false;
      this.hotelRoomClasses = [];
      this.flashSaleEndDate = null;
      this.allowbookcombofc = true;
      this.allowbookcombofx = true;
      this.searchhotel.ischeckBOD = false;
      this.ischeckBOD = false;
      this.checkBODdone = false;
      });
    //this.navCtrl.navigateForward('/pickup-calendar/true');
    let fromdate = new Date(this.searchhotel.CheckInDate ? this.searchhotel.CheckInDate : this.cin);
    let todate = new Date(this.searchhotel.CheckOutDate ? this.searchhotel.CheckOutDate : this.cout);
     //check âm lịch
     let _daysConfig: DayConfig[] = [];
     if(this.valueGlobal.listlunar){
      for (let j = 0; j < this.valueGlobal.listlunar.length; j++) {
        _daysConfig.push({
          date: this.valueGlobal.listlunar[j].date,
          subTitle: this.valueGlobal.listlunar[j].name,
          cssClass:'lunarcalendar'
        })
      }
     }
     
      const options: CalendarModalOptions = {
        pickMode: 'range',
        title: 'Chọn ngày',
        monthFormat: 'MM / YYYY', 
        weekdays:['CN','T2','T3','T4','T5','T6','T7'],
        closeLabel:'Thoát',
        doneLabel: '',
        step: 0,
        defaultScrollTo: fromdate,
        defaultDateRange: {from: fromdate, to: todate},
        daysConfig: _daysConfig
      };
  
       this.myCalendar = await this.modalCtrl.create({
        component: CalendarModal,
        componentProps: { options }

      });
  
      this.myCalendar.present().then(()=>{
        $('.days-btn').click(e => this.clickedElement(e));
      });
      let se = this;
      const event: any = await this.myCalendar.onDidDismiss();
      if(event.data){
        const date = event.data;
        const from: CalendarResult = date.from;
        const to: CalendarResult = date.to;
        
          se.searchhotel.CheckInDate = moment(from.dateObj).format('YYYY-MM-DD');
          se.searchhotel.CheckOutDate = moment(to.dateObj).format('YYYY-MM-DD');
          se.bookCombo.CheckInDate = se.searchhotel.CheckInDate
          se.bookCombo.CheckOutDate = se.searchhotel.CheckOutDate
      }
          se.zone.run(()=>{
            if(se.searchhotel.CheckInDate && se.searchhotel.CheckOutDate){
              se.cin = se.searchhotel.CheckInDate;
              se.cout = se.searchhotel.CheckOutDate;
              se.datecin = new Date(se.searchhotel.CheckInDate);
              se.datecout = new Date(se.searchhotel.CheckOutDate);
              se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
              se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');

              se.cindisplayhr = moment(se.datecin).format('DD/MM');
              se.coutdisplayhr = moment(se.datecout).format('DD/MM');
              var date1 = new Date(se.cin);
              var date2 = new Date(se.cout);
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
            
            se.changedate = true;
            se.hasComboRoom = false;
            se.comboprice = se.combopriceontitle;
            se.showpopup = true;
            se.ischeck = true;
            se.guest = se.adults + se.child;
            if (se.comboid) {
              se.getDetailCombo(se.comboid);
            }
            this.getdata(false);
            // se.checkPriceHotelDetail().then((check)=>{
            //   if(check){
            //     se.getdataroom();
            //   }else{
            //     se.hotelRoomClasses = [];
            //     se.ischeckoutofroom = false;
            //     se.loadcomplete = true;
            //     se.ischeck = true;
            //     se.allowbookcombofc = false;
            //   }
            // });
        })
      
    //google analytic
    se.gf.googleAnalytion('hoteldetail','changedate','');
  }

  changeHotel() {
    this.goback();
  }
  /*** Xử lý lấy detailcombo khi người dùng nhấn lấy giá combo
   * PDANH  18/02/2018
   */
  checkComboPrice() {
    this.getDetailCombo(null);
  }
  /*** Ẩn hiện popup chính sách phạt
   * PDANH  18/02/2018
   */
  penaltySelected(index) {
    if (this.penaltyItemSelected >= 0) {
      this.penaltyItemSelected = -1;
    } else {
      this.penaltyItemSelected = index;
    }
  }
  /*** Về trang login
   * PDANH  18/02/2018
   */
  goToLogin() {
    this.storage.get('auth_token').then(auth_token => {
      if (!auth_token) {
        //this.valueGlobal.logingoback = 'TabPage';
        this.valueGlobal.backValue = 'carcombo';
        this.navCtrl.navigateForward('/login');
      }
    });
  }
  /*** Xử lý yêu cầu đặt combo
   * PDANH  22/02/2018
   */
  async requestCombo(value) {
    // var co = 0;
    // for (let i = 0; i < this.arrchild.length; i++) {
    //   if (this.arrchild[i].numage >= 12) {
    //     co = 1;
    //     break;
    //   }
    // }
    // if (co==0) {
      this.searchhotel.showPopup = true;
      this.bookCombo.HotelCode = this.hotelcode;
      let titlecomboshort='';
        if(this.titlecombo && this.titlecombo.length >0){
          let arr = this.titlecombo.split('+');
          if(arr.length >1){
            let arr1 = arr[0].split(' ');
            if(arr1.length >1){
              titlecomboshort += arr1[1];
              titlecomboshort += "+Vé máy bay";
            }else{
              titlecomboshort += arr1[0];
              titlecomboshort += "+Vé máy bay";
            }
          }else{
            titlecomboshort = this.titlecombo;
          }
          this.bookCombo.titleComboShort = titlecomboshort;
        }
      //Gọi popup gửi yêu cầu
      this.bookCombo.Address = this.Address;
      this.bookCombo.ComboId = this.comboid;
      if (value == 1) {
        this.bookCombo.isFlightCombo = true;
        this.bookCombo.isFlashSale = false;
        this.bookCombo.isNormalCombo = false;
      }
      if (value == 2) {
        this.bookCombo.isFlashSale = true;
        this.bookCombo.isFlightCombo =false;
        this.bookCombo.isNormalCombo = false;
      }
      if (value == 3) {
        this.bookCombo.isNormalCombo = true;
        this.bookCombo.isFlashSale = false;
        this.bookCombo.isFlightCombo = false;
      }
      if (value == 4) {
        this.bookCombo.isFlashSale = true;
        this.bookCombo.isFlightCombo = false;
        this.bookCombo.isNormalCombo = false;
      }  
      if (value == 5) {
        this.bookCombo.isFlashSale = true;
        this.bookCombo.isFlightCombo = false;
        this.bookCombo.isNormalCombo = false;
      }
      // let modal = this.modalCtrl.create('RequestComboPage');
      // modal.present();
      var diffday = 1;
      var diffdaystart =1;
      if(this.comboDetail && this.comboDetail.endDate){
        //diffday = moment(new Date(this.searchhotel.CheckOutDate)).diff(moment(new Date(this.comboDetail.endDate)),'days');
        var arr = this.comboDetail.endDate.split('-');
        var newdate = new Date(arr[2],arr[1] -1,arr[0]);
        var d = moment(newdate).format('YYYY-MM-DD');
        diffday = moment(this.searchhotel.CheckOutDate).diff(moment(d),'days');
      }
      if(this.comboDetail && this.comboDetail.startDate){
        var arr = this.comboDetail.startDate.split('-');
        var newdatestart = new Date(arr[2],arr[1] -1,arr[0]);
        var dstart = moment(newdatestart).format('YYYY-MM-DD');
        diffdaystart = moment(this.searchhotel.CheckInDate).diff(moment(dstart),'days');
      }
      //Combo vé máy bay
      if(value == 1 && this.usermail && ( diffday <= 0) && (diffdaystart >=0) ){
        if(this.ischeckBOD){
          // this.presentWarning('Phòng cuối cùng trong giai đoạn này vừa đặt xong');
          return;
        }
        if(this.arrchild1.length >4){
          this.presentToastwarming('Số trẻ em không được lớn hơn số người lớn. Vui lòng chọn lại.');
          return;
        }
          if(this.comboDetail.list.length == 3){
            let actionSheet = await this.actionsheetCtrl.create({
              cssClass: 'action-sheets-basic-page',
              header: 'Quý khách khởi hành từ đâu?',
              buttons: [
                {
                  text: this.comboDetail.list[0].departureName,
                  handler: () => {
                    this.choiceFlightDeparture(this.comboDetail.list[0]);
                  }
                },
                {
                  text: this.comboDetail.list[1].departureName,
                  handler: () => {
                    this.choiceFlightDeparture(this.comboDetail.list[1]);
                  }
                },
                {
                  text: this.comboDetail.list[2].departureName,
                  handler: () => {
                    this.choiceFlightDeparture(this.comboDetail.list[2]);
                  }
                },
              ]
            });
            actionSheet.present();
          }
          else if(this.comboDetail.list.length == 2){
            let actionSheet = await this.actionsheetCtrl.create({
              cssClass: 'action-sheets-basic-page',
              header: 'Quý khách khởi hành từ đâu?',
              buttons: [
                {
                  text: this.comboDetail.list[0].departureName,
                  handler: () => {
                    this.choiceFlightDeparture(this.comboDetail.list[0]);
                  }
                },
                {
                  text: this.comboDetail.list[1].departureName,
                  handler: () => {
                    this.choiceFlightDeparture(this.comboDetail.list[1]);
                  }
                },
              ]
            });
            actionSheet.present();
          }else if(this.comboDetail.list.length == 1){
            let actionSheet = await this.actionsheetCtrl.create({
              cssClass: 'action-sheets-basic-page',
              header: 'Quý khách khởi hành từ đâu?',
              buttons: [
                {
                  text: this.comboDetail.list[0].departureName,
                  handler: () => {
                    this.choiceFlightDeparture(this.comboDetail.list[0]);
                  }
                }
              ]
            });
            actionSheet.present();
          }else{
            this.choiceFlightDeparture(this.comboDetail);
          }
        }
        else if(value==4)
        {
          this.searchhotel.roomnumber=this.searchhotel.roomnumber ? this.searchhotel.roomnumber : this.room;
          this.valueGlobal.checksendcb=false;
          const modal: HTMLIonModalElement =
          await this.modalCtrl.create({
            component: RequestCombo1Page,
            componentProps: {
              aParameter: true,
            }
          });
        modal.present();
        //this.navCtrl.navigateForward('/requestcombo');;
  
        modal.onDidDismiss().then((data: OverlayEventDetail) => {
          var se = this;
          if( (se.valueGlobal.checksendcb) ){
            se.zone.run(() => {
              //this.getDetailCombo(null);
                se.cin = se.searchhotel.CheckInDate? se.searchhotel.CheckInDate : se.cin;
                se.cout = se.searchhotel.CheckOutDate? se.searchhotel.CheckOutDate : se.cout;
                se.datecin = new Date(se.searchhotel.CheckInDate? se.searchhotel.CheckInDate : se.cin);
                se.datecout = new Date(se.searchhotel.CheckOutDate? se.searchhotel.CheckOutDate : se.cout);
                se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
                se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
                se.cindisplayhr = moment(se.datecin).format('DD/MM');
                se.coutdisplayhr = moment(se.datecout).format('DD/MM');
                se.changedate = true;
                se.hasComboRoom = false;
                se.comboprice = se.combopriceontitle;
                se.showpopup = true;
                se.ischeck = true;
                se.loadcomplete = false;
                se.hotelRoomClasses = [];
                se.guest = se.searchhotel.adult + se.searchhotel.child;
                se.room = se.searchhotel.roomnumber;
                se.child = se.searchhotel.child;
                se.adults = se.searchhotel.adult;
                var date1 = new Date(se.cin);
                var date2 = new Date(se.cout);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
                if (this.searchhotel.adult) {
                  this.guest = this.searchhotel.adult + this.searchhotel.child;
                  this.adults = this.searchhotel.adult;
                }
                if (this.searchhotel.child) {
                  this.child = this.searchhotel.child;
                }
                if (this.searchhotel.roomnumber) {
                  this.room = this.searchhotel.roomnumber;
                }
                this.arrchild=[];
                if (this.searchhotel.arrchild) {
                  this.arrchild = this.searchhotel.arrchild;
                }
                this.totalAdult = this.adults
                for (let i = 0; i < this.arrchild.length; i++) {
                  if (this.arrchild[i].numage >= 4) {
                    this.totalAdult++;
                  }
                }
              if(se.comboid){
                se.getDetailCombo(se.comboid);
              }
              //se.getdataroom();
                se.checkPriceHotelDetail().then((check)=>{
                  if(check){
                    se.getdataroom();
                  }else{
                    se.hotelRoomClasses = [];
                    se.ischeckoutofroom = false;
                    se.loadcomplete = true;
                    se.ischeck = true;
                    se.allowbookcombofc = false;
                    se.allowbookcombofx = false;
                  }
                });
              })
          }else{
            if(se.searchhotel.adult){
              se.guest = se.searchhotel.adult + se.searchhotel.child;
            }
            
            if(se.searchhotel.roomnumber){
              se.room = se.searchhotel.roomnumber;
            }
            if(se.searchhotel.CheckInDate){
              se.loadcomplete = true;
              var date1 = new Date(se.searchhotel.CheckInDate);
              var date2 = new Date(se.searchhotel.CheckOutDate);
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
          }
        })
        
    //     var strroomname = "";
    // var objMealTypeRates;
    // for (let i = 0; i < this.hotelRoomClasses.length; i++) {
    //   if (this.comboDetail.comboDetail.roomId == this.hotelRoomClasses[i].Rooms[0].RoomID) {
    //     this.arrroom.push(this.hotelRoomClasses[i]);
    //     this.indexroom = i;
    //     if(this.hotelRoomClasses[i].MealTypeRates && this.hotelRoomClasses[i].MealTypeRates.length >0){
    //       objMealTypeRates = this.hotelRoomClasses[i].MealTypeRates.filter((el)=>{ return el.Code == this.comboDetail.mealTypeCode});
    //     }
        
    //     strroomname = this.hotelRoomClasses[i].ClassName;
    //     break;
    //   }
    // }

    // var date1 = new Date(this.searchhotel.CheckInDate);
    // var date2 = new Date(this.searchhotel.CheckOutDate);
    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
    // this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // this.booking.CheckInDate = this.searchhotel.CheckInDate ? this.searchhotel.CheckInDate : this.cin;
    // this.booking.CheckOutDate = this.searchhotel.CheckOutDate ? this.searchhotel.CheckOutDate : this.cout;
    
    //   this.booking.roomNb = this.room;
    //   this.booking.Adults = this.adults;
    //   this.booking.Child = this.child;
    //   this.booking.CName = '';
    //   this.booking.CEmail = this.usermail;
    //   this.booking.indexroom = this.indexroom;
    //   this.booking.ChildAge = this.arrchild1;
    //   this.booking.HotelId = this.HotelID;
    //   this.Roomif.RoomId = this.bookCombo.roomid;
    //   this.booking.HotelName = this.name;
    //   this.booking.RoomName = strroomname;
    //   this.Roomif.Address = this.Address;
    //   this.Roomif.dur = this.duration;
    //   this.Roomif.arrroom = this.arrroom;
    //   this.Roomif.roomnumber = this.roomvalue;
    //   this.Roomif.roomtype = this.comboDetail.mealTypeName;
    //   this.Roomif.jsonroom = this.jsonroom2.Hotels[0];
    //   this.Roomif.imgHotel = this.imgHotel;
    //   this.Roomif.arrrbed = [];
    //   this.Roomif.imgRoom = this.arrroom ? this.arrroom[0].Rooms[0].ImagesMaxWidth320 : '';
    //   this.Roomif.objMealType = objMealTypeRates[0];
    //   this.searchhotel.adult = this.adults;
    //   this.searchhotel.child = this.child;
    //   this.searchhotel.roomnumber = this.room;
    //   this.searchhotel.CheckInDate = this.cin;
    //   this.searchhotel.CheckOutDate = this.cout;
    //   this.bookCombo.ComboDetail = this.comboDetail;
    //   this.bookCombo.ComboTitle = this.titlecombo;
    //   this.bookCombo.MealTypeName = this.comboDetail.mealTypeName;
    //   this.bookCombo.MealTypeCode = this.comboDetail.mealTypeCode;
    //   this.bookCombo.FormParam = this.formParam;
    //   this.bookCombo.ObjectHotelDetail = this.objDetail;
    //   this.bookCombo.ComboRoomPrice = this.comboDetail.comboDetail.totalPriceSale;
    //   this.navCtrl.navigateForward('/carcombo');
        }
        else if(value==2)
        {
          var self = this;
          var strroomname = "";
          this.arrroom = [];
          var objMealTypeRates;
 
      for (let i = 0; i < self.hotelRoomClasses.length; i++) {
        if (this.comboDetail.roomId == self.hotelRoomClasses[i].Rooms[0].RoomID) {
          self.arrroom.push(self.hotelRoomClasses[i]);
          self.indexroom = i;
          objMealTypeRates = self.hotelRoomClasses[i].MealTypeRates;
          strroomname = self.hotelRoomClasses[i].ClassName;
          break;
        }
      }
      //Kiểm tra ko map được room default thì lấy phòng đầu tiên trả về
      if (self.arrroom.length == 0 && self.hotelRoomClasses.length > 0) {
        self.arrroom.push(self.hotelRoomClasses[0]);
        self.indexroom = 0;
        objMealTypeRates = self.hotelRoomClasses[0].MealTypeRates;
        strroomname = self.hotelRoomClasses[0].ClassName;
      }
          if (objMealTypeRates) {
            var date1 = new Date(this.searchhotel.CheckInDate);
            var date2 = new Date(this.searchhotel.CheckOutDate);
            var timeDiff = Math.abs(date2.getTime() - date1.getTime());
            this.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            this.booking.CheckInDate = this.searchhotel.CheckInDate ? this.searchhotel.CheckInDate : this.cin;
            this.booking.CheckOutDate = this.searchhotel.CheckOutDate ? this.searchhotel.CheckOutDate : this.cout;
    
            this.booking.roomNb = objMealTypeRates[0].TotalRoom;
            this.booking.Adults = this.adults;
            this.booking.Child = this.child;
            this.booking.CName = '';
            this.booking.CEmail = this.usermail;
            this.booking.indexroom = this.indexroom;
            this.booking.ChildAge = this.arrchild1;
            this.booking.HotelId = this.HotelID;
            this.Roomif.RoomId = this.bookCombo.roomid;
            this.booking.HotelName = this.name;
            this.booking.RoomName = strroomname;
            this.Roomif.Address = this.Address;
            this.Roomif.dur = this.duration;
            this.Roomif.arrroom = this.arrroom;
            // this.Roomif.roomnumber = objMealTypeRates[0].TotalRoom;
            this.Roomif.roomtype = this.comboDetail.mealTypeName;
            this.Roomif.jsonroom = this.jsonroom2.Hotels[0];
            this.Roomif.imgHotel = this.imgHotel;
            this.Roomif.arrrbed = [];
            //this.Roomif.imgRoom = this.arrroom ? this.arrroom[0].Rooms[0].ImagesMaxWidth320 : '';
            this.Roomif.objMealType = objMealTypeRates[0];
            this.searchhotel.adult = this.adults;
            this.searchhotel.child = this.child;
            this.searchhotel.roomnumber = this.room
            this.searchhotel.CheckInDate = this.cin;
            this.searchhotel.CheckOutDate = this.cout;
            this.bookCombo.ComboDetail = this.comboDetail;
            this.bookCombo.ComboTitle = this.titlecombo;
            this.bookCombo.MealTypeName = this.comboDetail.mealTypeName;
            this.bookCombo.MealTypeCode = this.comboDetail.mealTypeCode;
            
            this.formParam.RoomNumber=this.room;
            this.bookCombo.FormParam = this.formParam;
            this.bookCombo.ObjectHotelDetail = this.objDetail;
            this.bookCombo.ComboRoomPrice = this.comboDetail.comboDetail.totalPriceSale;

            var options = {
              method: 'GET',
              url: C.urls.baseUrl.urlContracting + '/api/toolsapi/CheckAllotment',
              qs:
              {
                token: '3b760e5dcf038878925b5613c32615ea3',
                hotelcode: this.booking.HotelId,
                roomcode: this.bookCombo.ComboDetail.comboDetail.roomId,
                checkin: this.booking.CheckInDate,
                checkout: this.booking.CheckOutDate,
                totalroom: this.room
              },
              headers:
                {}
            };
            request(options, function (error, response, body) {
              var rs = JSON.parse(body);
              if (rs.Msg == "AL") {
                self.Roomif.payment = rs.Msg;
                self.Roomif.ischeckpayment = true;
              } else if (rs.Msg == "RQ") {
                self.Roomif.payment = rs.Msg;
                self.Roomif.ischeckpayment = false;
              }
              self.GetUserInfo();
              self.navCtrl.navigateForward('/combocarnew');
    
            });
          } else {
            self.navCtrl.navigateForward('/combocarnew');
          }
        }
        else if (value == 5 && this.usermail) {
          var self = this;
          var MealTypeRates=this.objroomfsale[0];
          var id=self.comboDetail.comboDetail.roomId;
          //Lấy số phòng theo số room từ api trả về
          this.roomvalue = MealTypeRates.TotalRoom;
      
          //this.roomvalue = this.room;
      
          this.arrroom = [];
          for (let i = 0; i < self.hotelRoomClasses.length; i++) {
            if (id == self.hotelRoomClasses[i].Rooms[0].RoomID) {
              this.arrroom.push(self.hotelRoomClasses[i]);
              this.indexroom = i;
              break;
            }
          }
          for (let i = 0; i < this.arrroom[0].MealTypeRates.length; i++) {
            var Meal=this.arrroom[0].MealTypeRates[i];
            if (Meal.IsFlashSale == true && Meal.Supplier == 'Internal' && Meal.PromotionNote != '') {
              this.indexmeal=i;
              break;
            }
          }
          var date1 = new Date(self.cin);
          var date2 = new Date(self.cout);
          var timeDiff = Math.abs(date2.getTime() - date1.getTime());
          self.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
      
          //if (email) {
          self.booking.CheckInDate = self.cin;
          self.booking.CheckOutDate = self.cout,
            self.booking.roomNb = self.room,
            self.booking.Adults = self.adults,
            self.booking.Child = self.child,
            self.booking.CName = '',
            self.booking.CEmail = self.usermail,
            self.booking.cost = MealTypeRates.PriceAvgPlusTAStr,
            self.booking.indexroom = self.indexroom,
            self.booking.indexmealtype = this.indexmeal,
            self.booking.HotelId = self.HotelID,
            self.Roomif.RoomId = id,
            self.booking.HotelName = self.name,
            self.booking.RoomName = "roomName",
            self.Roomif.Address = self.Address,
            self.Roomif.dur = self.duration,
            self.Roomif.arrroom = self.arrroom,
            self.Roomif.roomnumber = MealTypeRates.TotalRoom,
            self.Roomif.roomtype = MealTypeRates,
            self.Roomif.jsonroom = self.jsonroom2.Hotels[0],
            self.Roomif.imgHotel = self.imgHotel;
          self.Roomif.objMealType = MealTypeRates;
          self.Roomif.HotelRoomHBedReservationRequest = JSON.stringify(self.arrroom[0].HotelRoomHBedReservationRequest);
          self.Roomif.arrrbed = [];
          self.Roomif.imgRoom = self.arrroom[0].Rooms[0].ImagesMaxWidth320;
          self.searchhotel.adult = self.adults;
          self.searchhotel.child = self.child;
          self.searchhotel.roomnumber = self.room;
          self.searchhotel.CheckInDate = self.cin;
          self.searchhotel.CheckOutDate = self.cout;
          self.booking.code = self.hotelcode;     
          self.Roomif.payment = "AL";
          self.Roomif.ischeckpayment = true;
          self.Roomif.roomcancelhbed = 1;
          self.bookCombo.ComboTitle = this.titlecombo;
          this.bookCombo.ComboId = this.comboid?this.comboid:null;
          self.router.navigateByUrl('roomdetailreview')
        }
        else{
            if(this.searchhotel.CheckInDate && this.searchhotel.CheckOutDate){
              this.bookCombo.CheckInDate = this.searchhotel.CheckInDate;
              this.bookCombo.CheckOutDate = this.searchhotel.CheckOutDate;
            }else{
              this.bookCombo.CheckInDate = this.cin;
              this.bookCombo.CheckOutDate = this.cout;
            }
            this.bookCombo.ComboDetail = this.comboDetail;
            if (!this.ischeckBOD) {
              const modal: HTMLIonModalElement =
            await this.modalCtrl.create({
              component: RequestComboPage,
              componentProps: {
                aParameter: true,
              }
            });
          modal.present();
          //this.navCtrl.navigateForward('/requestcombo');;
  
          modal.onDidDismiss().then((data: OverlayEventDetail) => {
            var se = this;
            if( (se.searchhotel.CheckInDate && new Date(se.cin).toLocaleDateString() != new Date(se.searchhotel.CheckInDate).toLocaleDateString())
            ||  (se.searchhotel.CheckOutDate && new Date(se.cout).toLocaleDateString() != new Date(se.searchhotel.CheckOutDate).toLocaleDateString())
            || (se.searchhotel.adult && se.searchhotel.adult != se.adults) || (se.searchhotel.child && se.searchhotel.child != se.child) ){
              se.zone.run(() => {
                //this.getDetailCombo(null);
                se.cin = se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin;
                se.cout = se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout;
                se.datecin = new Date(se.searchhotel.CheckInDate? se.searchhotel.CheckInDate : se.cin);
                se.datecout = new Date(se.searchhotel.CheckOutDate? se.searchhotel.CheckOutDate : se.cout);
                se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
                se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');

                se.cindisplayhr = moment(se.datecin).format('DD/MM');
                se.coutdisplayhr = moment(se.datecout).format('DD/MM');
                if(se.searchhotel.child){
                  se.child = se.searchhotel.child;
                }
                se.changedate = true;
                se.hasComboRoom = false;
                se.comboprice = se.combopriceontitle;
                se.showpopup = true;
                se.ischeck = true;
                se.loadcomplete = false;
                se.hotelRoomClasses = [];
                se.guest = se.searchhotel.adult + se.searchhotel.child;
                se.room = se.searchhotel.roomnumber;
                se.child = se.searchhotel.child;
                se.adults = se.searchhotel.adult;
                var date1 = new Date(se.cin);
                var date2 = new Date(se.cout);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
                //se.scrollToTopwithvalue1();
                if(se.comboid){
                  se.getDetailCombo(se.comboid);
                }
                //se.getdataroom();
                se.checkPriceHotelDetail().then((check)=>{
                  if(check){
                    se.getdataroom();
                  }else{
                    se.hotelRoomClasses = [];
                    se.ischeckoutofroom = false;
                    se.loadcomplete = true;
                    se.ischeck = true;
                    se.allowbookcombofc = false;
                    se.allowbookcombofx = false;
                  }
                });
                })
            }else{
              if(se.searchhotel.adult){
                se.guest = se.searchhotel.adult + se.searchhotel.child;
              }
              
              if(se.searchhotel.roomnumber){
                se.room = se.searchhotel.roomnumber;
              }
              if(se.searchhotel.CheckInDate){
                se.loadcomplete = true;
                var date1 = new Date(se.searchhotel.CheckInDate);
                var date2 = new Date(se.searchhotel.CheckOutDate);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
              }
              
            }
          })
            }
            
      }
    // } else {
    //   alert("Bạn đang chọn tuổi trẻ em cao hơn quy định của Vé Máy Bay. Xin vui lòng chọn lại tuổi trẻ em dưới 12 tuổi!");
    // }
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
            C.writeErrorLog(objError, response);
          }
          if (error) {
            error.page = "roomdetailreview";
            error.func = "GetUserInfo";
            error.param = JSON.stringify(options);
            C.writeErrorLog(error, response);
          } else {
            if (body) {
              var data = JSON.parse(body);
              se.storage.set("email", data.email);
              se.storage.set("jti", data.memberId);
              se.storage.set("username", data.fullname);
              se.storage.set("phone", data.phone);
              se.storage.set("point", data.point);
            }

          }
        });
      }
    })
  }
  async presentWarning(msg) {
    let alert = await this.alertCtrl.create({
      message: msg,
      buttons: ['Ok']
    });
    alert.present();
  }

  async sendRequestCombo(){
    this.bookCombo.Address = this.Address;
    this.bookCombo.ComboId = this.comboid?this.comboid:null;
      this.bookCombo.isFlightCombo = true;
      this.bookCombo.isFlashSale = false;
      this.bookCombo.isNormalCombo = false; 
      this.bookCombo.ComboDetail = this.comboDetail;
      let obj:any = this.hotelDetail;
      this.bookCombo.HotelCode = this.hotelcode;
      let titlecomboshort='';
        if(this.titlecombo && this.titlecombo.length >0){
          let arr = this.titlecombo.split('+');
          if(arr.length >1){
            let arr1 = arr[0].split(' ');
            if(arr1.length >1){
              titlecomboshort += arr1[1];
              titlecomboshort += "+Vé máy bay";
            }else{
              titlecomboshort += arr1[0];
              titlecomboshort += "+Vé máy bay";
            }
          }else{
            titlecomboshort = this.titlecombo;
          }
          this.bookCombo.tileComboShort = titlecomboshort;
        }
        if (!this.ischeckBOD) {
          const modal: HTMLIonModalElement =
          await this.modalCtrl.create({
            component: RequestComboPage
          });
        modal.present();

        modal.onDidDismiss().then((data: OverlayEventDetail) => {
          var se = this;
          if( (se.searchhotel.CheckInDate && new Date(se.cin).toLocaleDateString() != new Date(se.searchhotel.CheckInDate).toLocaleDateString())
          ||  (se.searchhotel.CheckOutDate && new Date(se.cout).toLocaleDateString() != new Date(se.searchhotel.CheckOutDate).toLocaleDateString())
          || se.searchhotel.adult != se.adults || se.searchhotel.child != se.child){
            se.zone.run(() => {
              //this.getDetailCombo(null);
              se.cin = se.searchhotel.CheckInDate;
              se.cout = se.searchhotel.CheckOutDate;
              se.datecin = new Date(se.searchhotel.CheckInDate);
              se.datecout = new Date(se.searchhotel.CheckOutDate);
              se.cindisplay = moment(se.datecin).format('DD-MM-YYYY');
              se.coutdisplay = moment(se.datecout).format('DD-MM-YYYY');
              se.cindisplayhr = moment(se.datecin).format('DD/MM');
              se.coutdisplayhr = moment(se.datecout).format('DD/MM');
              if(se.searchhotel.child){
                se.child = se.searchhotel.child;
              }
              se.changedate = true;
              se.hasComboRoom = false;
              se.comboprice = se.combopriceontitle;
              se.showpopup = true;
              se.ischeck = true;
              se.loadcomplete = false;
              se.hotelRoomClasses = [];
              se.guest = se.searchhotel.adult + se.searchhotel.child;
              se.room = se.searchhotel.roomnumber ? se.searchhotel.roomnumber : se.room;
              se.child = se.searchhotel.child;
              se.adults = se.searchhotel.adult;
              if(se.searchhotel.CheckInDate){
                //let fdtemp = new Date(se.searchhotel.CheckInDate)
                var date1 = new Date(se.searchhotel.CheckInDate);
                var date2 = new Date(se.searchhotel.CheckOutDate);
                var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
              }
              //se.scrollToTopwithvalue1();
              if(se.comboid){
                se.getDetailCombo(se.comboid);
              }
              //se.getdataroom();
              se.checkPriceHotelDetail().then((check)=>{
                if(check){
                  se.getdataroom();
                }else{
                  se.hotelRoomClasses = [];
                  se.ischeckoutofroom = false;
                  se.loadcomplete = true;
                  se.ischeck = true;
                  se.allowbookcombofc = false;
                  se.allowbookcombofx = false;
                }
              });
              })
              
          }else{
            if(se.searchhotel.adult){
              se.guest = se.searchhotel.adult + se.searchhotel.child;
              se.adults = se.searchhotel.adult;
            }
            
            if(se.searchhotel.roomnumber){
              se.room = se.searchhotel.roomnumber;
            }
            if(se.searchhotel.CheckInDate){
              se.loadcomplete = true;
              var date1 = new Date(se.searchhotel.CheckInDate);
              var date2 = new Date(se.searchhotel.CheckOutDate);
              var timeDiff = Math.abs(date2.getTime() - date1.getTime());
              se.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
            }
          }
        })
        }
   
  }

  choiceFlightDeparture(combodetail: any): any {
    //this.presentLoadingNew();
      var self = this;
      //self.roomvalue = self.room;
      self.arrroom = [];
      var objMealTypeRates:any;
      var strroomname="";
      for (let i = 0; i < self.hotelRoomClasses.length; i++) {
        if (combodetail.details[0].roomId == self.hotelRoomClasses[i].Rooms[0].RoomID) {
          self.arrroom.push(self.hotelRoomClasses[i]);
          self.indexroom = i;
          objMealTypeRates = self.hotelRoomClasses[i].MealTypeRates;
          strroomname = self.hotelRoomClasses[i].ClassName;
          break;
        }
      }
      //Kiểm tra ko map được room default thì lấy phòng đầu tiên trả về
      if(self.arrroom.length ==0 && self.hotelRoomClasses.length >0){
        self.arrroom.push(self.hotelRoomClasses[0]);
          self.indexroom = 0;
          objMealTypeRates = self.hotelRoomClasses[0].MealTypeRates;
          strroomname = self.hotelRoomClasses[0].ClassName;
      }
      self.roomvalue = objMealTypeRates[0].TotalRoom;
      var date1 = new Date(self.searchhotel.CheckInDate);
      var date2 = new Date(self.searchhotel.CheckOutDate);
      var timeDiff = Math.abs(date2.getTime() - date1.getTime());
      self.duration = Math.ceil(timeDiff / (1000 * 3600 * 24));
          self.booking.CheckInDate = self.searchhotel.CheckInDate;
          self.booking.CheckOutDate = self.searchhotel.CheckOutDate,
            self.booking.roomNb = objMealTypeRates[0].TotalRoom,
            self.booking.Adults = self.adults,
            self.booking.Child = self.child,
            self.booking.CName = '',
            self.booking.CEmail = self.usermail,
            self.booking.cost = combodetail.details[0].totalPriceSale,
            self.booking.indexroom = self.indexroom,
            self.booking.ChildAge = self.arrchild1,
            self.booking.HotelId = self.HotelID,
            self.Roomif.RoomId = self.bookCombo.roomid,
            self.booking.HotelName = self.name,
            self.booking.RoomName = strroomname,
            self.Roomif.Address = self.Address,
            self.Roomif.dur = self.duration,
            self.Roomif.arrroom = self.arrroom,
            self.Roomif.roomnumber = objMealTypeRates[0].TotalRoom,
            self.Roomif.roomtype = self.comboDetail.mealTypeName,
            self.Roomif.jsonroom = self.jsonroom2.Hotels[0],
            self.Roomif.imgHotel = self.imgHotel;
            self.Roomif.arrrbed = [];
            self.Roomif.imgRoom = self.arrroom[0].Rooms[0].ImagesMaxWidth320;
            self.searchhotel.adult = self.adults;
            self.searchhotel.child = self.child;
            self.searchhotel.roomnumber = self.room;
            self.searchhotel.CheckInDate = self.cin;
            self.searchhotel.CheckOutDate = self.cout;
            self.bookCombo.ComboDetail = combodetail;
            self.bookCombo.arrivalCode = self.comboDetail.arrivalCode;
            self.bookCombo.ComboTitle = self.titlecombo;
            self.bookCombo.MealTypeName = self.comboDetail.mealTypeName;
            self.bookCombo.MealTypeCode = self.comboDetail.mealTypeCode;
            self.bookCombo.FormParam = self.formParam;
            self.bookCombo.HotelCode = self.hotelcode;
            self.bookCombo.arrPassengers=[];
            self.bookCombo.arrlugage=[];
            self.bookCombo.hasInsurrance = self.hasInsurrance ? true : false;
            self.bookCombo.checkInsurranceFee = self.checkInsurranceFee;
            self.bookCombo.objInsurranceFee = self.objInsurranceFee;
          self.navCtrl.navigateForward('/flightcomboreviews');
  }

  showRoomInfo() {
    this.showroominfo = !this.showroominfo;
  }

  async showDepartureCalendar(combolist) {
    var se = this;
    if(!se.loadcomplete){
      se.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
    se.loadcomplete = false;
    se.searchhotel.hotelID=se.HotelID;
    se.searchhotel.roomID=se.RoomID;
    se.searchhotel.ischeckBOD=se.ischeckBOD;
    const modal: HTMLIonModalElement =
      await se.modalCtrl.create({
        component: DepartureCalendarPage
      });
    se.gf.setParams({ comboId: se.comboid, fromPlace: combolist.departureCode, comboStartDate: se.comboDetail.startDate, comboEndDate: se.comboDetail.endDate }, 'departure')
    await modal.present();
  
    modal.onDidDismiss().then((data: OverlayEventDetail) => {
      if (!data.data !== null) {
        se.platform.ready().then(() => {
          se.platform.backButton.subscribe(() => {
            // code that is executed when the user pressed the back button
            se.goback();
          })
        })
  
        if (!data.data) {
          //se.storage.get('email').then(email => {
          //if (email) {
          se.ischeckBOD= se.searchhotel.ischeckBOD;
          se.bookCombo.Address = se.Address;
          se.bookCombo.ComboId = se.comboid;
          se.zone.run(() => {
            se.cin = se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin;
            se.cout = se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout;
            se.bookCombo.CheckInDate = se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin;
            se.bookCombo.CheckOutDate = se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout;
            se.cindisplay = moment(se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin).format('DD-MM-YYYY');
            se.coutdisplay = moment(se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout).format('DD-MM-YYYY');
            se.cindisplayhr = moment(se.searchhotel.CheckInDate ? se.searchhotel.CheckInDate : se.cin).format('DD/MM');
            se.coutdisplayhr = moment(se.searchhotel.CheckOutDate ? se.searchhotel.CheckOutDate : se.cout).format('DD/MM');
          })
          se.presentLoadingRelated(3000);
          se.loaddata();
  
          setTimeout(()=>{
            let val = 1;
            if (se.fc) {
              se.bookCombo.isFlightCombo = true;
              se.bookCombo.isFlashSale = false;
              se.bookCombo.isNormalCombo = false;
              val = 1;
            }
            if (se.fs) {
              se.bookCombo.isFlashSale = true;
              se.bookCombo.isFlightCombo = false;
              se.bookCombo.isNormalCombo = false;
              se.requestCombo(2);
              val = 2;
            }
            if (se.nm) {
              se.bookCombo.isNormalCombo = true;
              se.bookCombo.isFlashSale = false;
              se.bookCombo.isFlightCombo = false;
              se.requestCombo(3);
              val = 3;
            }
            se.requestCombo(val);
          },3500)  
          
          
        }
        else{
          se.loadcomplete = true;
        }
      }else{
        se.loadcomplete = true;
      }
      se.gf.googleAnalytion('hoteldetail', 'showdepaturecalendar', se.nm);
    });
  
  }

  async showConfirm() {
    let alert = await this.alertCtrl.create({
      message: "Phiên đăng nhập hết hạn. Xin vui lòng đăng nhập lại để sử dụng chức năng này.",
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
          this.navCtrl.navigateForward('/');
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
          this.navCtrl.navigateForward('/login');
        }
      }
      ]
    });
    alert.present();
  }
  async presentLoadingDetail() {
    this.loader = await this.loadingCtrl.create({
    });
    this.loader.present();
  }

  async presentLoadingNew() {
    var loader = await this.loadingCtrl.create({
      duration:250
    });
    loader.present();
  }

  async presentLoadingRelated(time) {
    var loader = await this.loadingCtrl.create({
      message: "",
      duration: time
    });
    loader.present();
  }
  async presentLoadingnotime() {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }
  openWebpage(url: string) {
    this.safariViewController.isAvailable()
  .then((available: boolean) => {
      if (available) {

        this.safariViewController.show({
          url: url,
          hidden: false,
          animated: true,
          transition: 'curl',
          enterReaderModeIfAvailable: true,
          tintColor: '#ff0000'
        })
        .subscribe((result: any) => {
            if(result.event === 'opened') console.log('Opened');
            else if(result.event === 'loaded') console.log('Loaded');
            else if(result.event === 'closed') console.log('Closed');
          },
          (error: any) => console.error(error)
        );

      } else {
        // use fallback browser, example InAppBrowser
      }
    }
  );
  }
  getBOD(roomid)
  {
    var se=this;
    this.ischeckBOD=false;
    var options = {
      method: 'GET',
      url: 'https://gate.ivivu.com/get-blackout-date',
      qs: { hotelId: se.HotelID ? se.HotelID : se.searchhotel.hotelID, roomId: roomid },
      headers:
      {
        'postman-token': '86c67bdc-5fcd-0240-5549-f3ea2b31faf8',
        'cache-control': 'no-cache'
      }
    };
    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      var BOD=JSON.parse(body);
      var arrBOD=BOD.BlackOutDates;
      if (arrBOD.length>0) {
        var checkcintemp = new Date(se.cin);
        var checkdatecout = new Date(se.cout);
        var checkcin=moment(checkcintemp).format('YYYYMMDD');
        var checkcout=moment(checkdatecout).format('YYYYMMDD');
        for (let i = 0; i < arrBOD.length; i++) {
          var checkBODtemp = new Date(arrBOD[i]);
          var checkBOD=moment(checkBODtemp).format('YYYYMMDD');
          if (checkcin<=checkBOD&&checkBOD<checkcout) {
            se.ischeckBOD=true;
            break;
          }
        }
      }
      se.checkBODdone = true;
    })
  }
  ionViewWillLeave(){
    this.searchhotel.isRefreshDetail = false;
  }
	
	seemoreroomdetail(value, groupId,mealtypegroupId){
    var se = this;
    if(value == 1){
      se.checkAddAndRemoveItem(1,groupId);
      //group mealtype
      var objmealtypes = $('.group-'+groupId +' .cls-hidden');
      if(objmealtypes && objmealtypes.length >0){
        for(let i = 0; i< objmealtypes.length; i++){
          $(objmealtypes[i]).removeClass('cls-hidden').addClass('cls-visible');
        }
      }
      se.crollToTopGroup(1,groupId);

    }else{
       se.checkAddAndRemoveItem(2,groupId);
      //group mealtype
      var objmealtypes = $('.group-'+groupId +' .cls-visible');
      if(objmealtypes && objmealtypes.length >0){
        for(let i = 0; i< objmealtypes.length; i++){
          $(objmealtypes[i]).removeClass('cls-visible').addClass('cls-hidden');
        }
      }

      se.crollToTopGroup(2,groupId);
    }
  }

  checkAddAndRemoveItem(type, groupId){
    var se = this;
    if(type==1){
      //mealtype group
      if(se.mealtypegrouplist && se.mealtypegrouplist.length >0){
        if(!se.gf.checkExistsIndex(se.mealtypegrouplist, groupId)){
          se.mealtypegrouplist.push(groupId);
        }
      }else{
        se.mealtypegrouplist.push(groupId);
      }
    }else{
      se.gf.removeItem(se.mealtypegrouplist,groupId);
    }
    
  }

  crollToTopGroup(value, groupId){
    //scroll to top of group
    setTimeout(()=>{
      var objHeight = value == 2 ? $('.div-show-'+groupId) : $('.div-hide-'+groupId);
      if(objHeight && objHeight.length >0){
        var h = 0;
        if(groupId == 0){
            h = objHeight.offsetParent()[0].offsetTop -50;
        }else{
          let idx= groupId-1;
          var groupHeight = 0;
         for(let i = 0; i < groupId; i++){
          groupHeight += $('.group-'+i).parent()[0].offsetHeight;
         }
          h = objHeight.offsetParent()[0].offsetTop -50 + groupHeight;
        }
        this.content.scrollToPoint(0,h,500);
      }
    },100)
  }
  async imgreview(arrimgreview, indeximgreview,CustomerName,DateStayed) {
    this.searchhotel.arrimgreview = arrimgreview;
    this.searchhotel.indexreviewimg = indeximgreview;
    this.searchhotel.cusnamereview = CustomerName;
    this.searchhotel.datereview = DateStayed;
    const modal: HTMLIonModalElement =
      await this.modalCtrl.create({
        component: HotelreviewsimagePage,
      });
    modal.present();
  }
  changeinfo() {
    if(!this.loadcomplete){
      this.presentToastwarming('Giá đang được cập nhật, xin vui lòng đợi trong giây lát!');
      return;
    }
    this.valueGlobal.backValue = 'popupinfobkg'
    this.navCtrl.navigateForward('/popupinfobkg');
  }
}
