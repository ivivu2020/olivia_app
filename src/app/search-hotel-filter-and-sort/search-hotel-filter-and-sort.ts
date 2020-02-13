import { SearchHotel } from './../providers/book-service';
import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Events, Platform, ModalController } from '@ionic/angular';
import * as request from 'request';
import { AuthService } from '../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
/**
 * Generated class for the SearchHotelFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-hotel-filter-and-sort',
  templateUrl: 'search-hotel-filter-and-sort.html',
  styleUrls: ['search-hotel-filter-and-sort.scss'],
})
export class SearchHotelFilterAndSortPage implements OnInit{
  
  structure: any = { lower: 100000, upper: 15000000 }; review; minprice; maxprice;
  star_1 = true; star_1active = false; star_2 = true; star_2active = false; star_3 = true; star_3active = false;
  star_4 = true; star_4active = false; star_5 = true; star_5active = false;
  chuoi= "";
  itemOrder;
  hasfilter = false;
  meal1check = false;
  meal2check = false;
  meal3check = false;
  arrlocalcheck = [];
  
  public dataFilter; dataLocal = [];dataFacility=[];dataStyle=[];dataHotelType=[];
  strLocal="";
  strFacility="";
  strStyle="";
  strHotelType="";
  public ischeckbtnreset = false;
  public ischeckbtn = true;
  arrfacilitycheck: any=[];
  arrstylecheck: any=[];
  arrhoteltypecheck: any=[];
  constructor(public platform: Platform,public navCtrl: NavController, public zone: NgZone, public searchhotel: SearchHotel, public authService: AuthService, private http: HttpClientModule, public events:Events,
    public gf: GlobalFunction, public modalCtrl: ModalController) {
    if(searchhotel.chuoi){
      this.hasfilter = true;
    }
    if(searchhotel.sortOrder){
      this.itemOrder = searchhotel.sortOrder;
    }

    if (searchhotel.minprice && this.searchhotel.maxprice) {
      //PDANH 09/01/2018: Fix lỗi không lấy được minprice,maxprice do lỗi định dạng thập phân ','
      this.structure.lower = searchhotel.minprice.replace(/\./g, '').replace(/\,/g, '');
      this.structure.upper = searchhotel.maxprice.replace(/\./g, '').replace(/\,/g, '');
      this.minprice = searchhotel.minprice;
      this.maxprice = searchhotel.maxprice; 
    }
    else {
      this.minprice = this.structure.lower.toLocaleString();
      this.maxprice = this.structure.upper.toLocaleString()
    }

    if (searchhotel.review) {
      this.review = searchhotel.review
    }
    if (searchhotel.star) {
      for (let i = 0; i < searchhotel.star.length; i++) {
        if (searchhotel.star[i] == 1) {
          this.star_1active = true;
          this.star_1 = false;
        }
        else if (searchhotel.star[i] == 2) {
          this.star_2active = true;
          this.star_2 = false;
        }
        else if (searchhotel.star[i] == 3) {
          this.star_3active = true;
          this.star_3 = false;
        }
        else if (searchhotel.star[i] == 4) {
          this.star_4active = true;
          this.star_4 = false;
        }
        else if (searchhotel.star[i] == 5) {
          this.star_5active = true;
          this.star_5 = false;
        }
      }
    
    //google analytic
    gf.googleAnalytion('search-hotel-filter-and-sort','load','');

    this.platform.ready().then(() => {
      document.addEventListener("backbutton", async() => { 
        this.navCtrl.navigateBack('/hotelist/false');
      })
    })

    }

    //console.log(authService.regioncode);
    
    var se = this;
    var code = se.searchhotel.gbmsg ?  (se.searchhotel.gbmsg.regionCode ? se.searchhotel.gbmsg.regionCode : se.searchhotel.gbmsg.RegionCode) : authService.regioncode;
    var options = {
      method: 'POST',
      //url: 'https://beta-olivia.ivivu.com/mobile/OliviaApis/AddFavouriteHotel',
      url: C.urls.baseUrl.urlPost + '/mGetListParamForFilter?region=' + code,
      timeout: 10000, maxAttempts: 5, retryDelay: 2000,
    };

    request(options, function (error, response, body) {
      if(response.statusCode != 200){
        var objError ={
            page: "search-hotel-filter-and-sort-list",
            func: "likeItem",
            message : response.statusMessage,
            content : response.body,
            type: "warning",
            param:  JSON.stringify(options)
          };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page="search-hotel-filter-and-sort-list";
        error.func="likeItem";
        error.param =  JSON.stringify(options);
        C.writeErrorLog(error,response);
      };
      // if (se.json1.length > 0) {
      //   se.zone.run(() => se.setItemLikeStatus(id));
      // }
    
    // this.http.get(C.urls.baseUrl.urlPost + '/mGetListParamForFilter?region=' + (authService.regioncode || this.searchhotel.gbmsg.regionCode))
    //     .toPromise()
    //     .then(data => {
      zone.run(()=>{
          var lstData = JSON.parse(body);
          se.dataLocal = lstData.Locas;
          // lstData.Locas.forEach((item)=>{
          //   se.dataLocal.push(item);
          // })
          se.dataFacility = lstData.FacilityFilter;
          // lstData.FacilityFilter.forEach((item)=>{
          //   se.dataFacility.push(item);
          // })
          se.dataStyle = lstData.Style;
          // lstData.Style.forEach((item)=>{
          //   se.dataStyle.push(item);
          // })
          se.dataHotelType = lstData.HotelType;
          // lstData.HotelType.forEach((item)=>{
          //   se.dataHotelType.push(item);
          // })
          setTimeout(()=>{
              se.meal1check = searchhotel.meal1check;
              se.renderCssByType("meal","1", se.meal1check);
              se.meal2check = searchhotel.meal2check;
              se.renderCssByType("meal","2", se.meal2check);
              se.meal3check = searchhotel.meal3check;
              se.renderCssByType("meal","3", se.meal3check);
            //local
            
              //if(se.searchhotel.arrlocalcheck && se.searchhotel.arrlocalcheck.length >0){
                se.arrlocalcheck = se.searchhotel.arrlocalcheck;
                se.dataLocal.forEach(item => {
                  se.renderCssByType("local",item.Id, se.gf.checkExistsIndex(se.arrlocalcheck,item.Id) );
                });
              //}

              //if(se.searchhotel.arrfacilitycheck && se.searchhotel.arrfacilitycheck.length >0){
                se.arrfacilitycheck = se.searchhotel.arrfacilitycheck;
                se.dataFacility.forEach(item => {
                  se.renderCssByType("facility",item.Id, se.gf.checkExistsIndex(se.arrfacilitycheck,item.Id) );
                });
              //}

              //if(se.searchhotel.arrstylecheck && se.searchhotel.arrstylecheck.length >0){
                se.arrstylecheck = se.searchhotel.arrstylecheck;
                se.dataStyle.forEach(item => {
                  se.renderCssByType("style",item.Id, se.gf.checkExistsIndex(se.arrstylecheck,item.Id) );
                });
              //}

              //if(se.searchhotel.arrhoteltypecheck && se.searchhotel.arrhoteltypecheck.length >0){
                se.arrhoteltypecheck = se.searchhotel.arrhoteltypecheck;
                se.dataHotelType.forEach(item => {
                  se.renderCssByType("hoteltype",item.Id, se.gf.checkExistsIndex(se.arrhoteltypecheck,item.Id) );
                });
              //}
          })
            
        },10)
      })
          // }).catch(error =>{
          //   if (error) {
          //     error.page = "search-hotel-filter-and-sort";
          //     error.func = "load";
          //     C.writeErrorLog(error,response);
          //   };
          // });
  }

  
  ngOnInit() {
    
  }

  /***
   * Hàm set style mục chọn filter được check(màu xanh)/uncheck (ko màu)
   * PDANH 28/01/2019
   */
  renderCssByType(strType: string, strIndex: string,checked: boolean){
    var objLocal = document.getElementsByClassName(strType + '-item-'+ strIndex);
    if(objLocal[0]){
      objLocal[0].classList.remove('local-check');
      objLocal[0].classList.remove('local-uncheck');
      if(strType == "local"){
        objLocal[0].classList.add(checked ? 'local-check' : 'local-uncheck');
      }else if(strType == "style"){
        objLocal[0].classList.add(checked ? 'style-check' : 'style-uncheck');
      }else if(strType == "facility"){
        objLocal[0].classList.add(checked ? 'facility-check' : 'facility-uncheck');
      }else if(strType == "hoteltype"){
        objLocal[0].classList.add(checked ? 'hoteltype-check' : 'hoteltype-uncheck');
      }
    }
  }

  close() {
    
    this.modalCtrl.dismiss('close');
  }
  test() {
    this.minprice = this.structure.lower.toLocaleString()
    this.maxprice = this.structure.upper.toLocaleString()

  }
  star1() {
    if (this.star_1 == true) {
      this.star_1 = false;
      this.star_1active = true;
    }
    else {
      this.star_1 = true;
      this.star_1active = false;
    }
  }
  star2() {
    if (this.star_2 == true) {
      this.star_2 = false;
      this.star_2active = true;
    }
    else {
      this.star_2 = true;
      this.star_2active = false;
    }
  }
  star3() {
    if (this.star_3 == true) {
      this.star_3 = false;
      this.star_3active = true;
    }
    else {
      this.star_3 = true;
      this.star_3active = false;
    }
  }
  star4() {
    if (this.star_4 == true) {
      this.star_4 = false;
      this.star_4active = true;
    }
    else {
      this.star_4 = true;
      this.star_4active = false;
    }
  }
  star5() {
    if (this.star_5 == true) {
      this.star_5 = false;
      this.star_5active = true;
    }
    else {
      this.star_5 = true;
      this.star_5active = false;
    }
  }
  reviewchange() {

  }

  /***
   * Hàm reset style mục chọn
   * PDANH 28/01/2019
   */
  clickCancel() {
      // Reset giá
      this.ischeckbtnreset=true;
      this.ischeckbtn=false;
      this.structure = { lower: 100000, upper: 15000000 };
      // Reset *
      this.star_1=true;
      this.star_2=true;
      this.star_3=true;
      this.star_4=true;
      this.star_5=true;
      this.star_1active=false;
      this.star_2active=false;
      this.star_3active=false;
      this.star_4active=false;
      this.star_5active=false;
      // Reset review
      this.review=0;
      //Reset other filter
      
      this.arrlocalcheck = [];
      this.arrhoteltypecheck = [];
      this.arrfacilitycheck = [];
      this.arrhoteltypecheck = [];
      this.arrstylecheck = [];
      
      this.searchhotel.sortOrder = null;
      this.itemOrder = null;

      let listMeal = document.getElementsByClassName("meal-check");
      if(listMeal.length >0){
        for(let i =listMeal.length-1; i>=0; i--){
          listMeal[i].classList.remove('meal-check');
        }
      }
      let listLocal = document.getElementsByClassName("local-check");
      if(listLocal.length >0){
        for(let i =listLocal.length-1; i>=0; i--){
          listLocal[i].classList.remove('local-check');
        }
      }
      let listStyle = document.getElementsByClassName("style-check");
      if(listStyle.length >0){
        for(let i =listStyle.length-1; i>=0; i--){
          listStyle[i].classList.remove('style-check');
        }
      }
      let listFacility = document.getElementsByClassName("facility-check");
      if(listFacility.length >0){
        for(let i =listFacility.length-1; i>=0; i--){
          listFacility[i].classList.remove('facility-check');
        }
      }
      let listHotelType = document.getElementsByClassName("hoteltype-check");
      if(listHotelType.length >0){
        for(let i =listHotelType.length-1; i >=0; i--){
          listHotelType[i].classList.remove('hoteltype-check');
        }
      }
      this.strLocal="";
      this.strStyle="";
      this.strFacility="";
      this.strHotelType="";
  }
  clickOk() {
    this.ischeckbtnreset=false;
    this.ischeckbtn=true;
    this.searchhotel.sortOrder = this.itemOrder;
    this.searchhotel.chuoi = "";
    this.searchhotel.star = [];
    if (this.star_1active == true) {
      this.searchhotel.star.push(1);
    }
    if (this.star_2active == true) {
      this.searchhotel.star.push(2);
    }
    if (this.star_3active == true) {
      this.searchhotel.star.push(3);
    }
    if (this.star_4active == true) {
      this.searchhotel.star.push(4);
    }
    if (this.star_5active == true) {
      this.searchhotel.star.push(5);
    }
    //PDANH 09/01/2018: Fix lỗi không lấy được minprice,maxprice do lỗi định dạng thập phân ','
    var minprice1 = this.minprice.replace(/\./g, '').replace(/\,/g, '');
    var maxprice1 = this.maxprice.replace(/\./g, '').replace(/\,/g, '');
    if (minprice1*1 > 100000 || maxprice1*1 < 15000000) {
      this.searchhotel.minprice = this.minprice;
      this.searchhotel.maxprice = this.maxprice;
    }else{//Nếu chọn = biên thì reset lại minprice = null
      this.searchhotel.minprice = null;
      this.searchhotel.maxprice = null;
    }
    if (this.review >= 0) {
      this.searchhotel.review = this.review;
    }

    //Build chuỗi filter
    if (!this.searchhotel.chuoi) {
      if (this.searchhotel.star) {
        for (let i = 0; i < this.searchhotel.star.length; i++) {
          if (i == 0) {
            if (i == this.searchhotel.star.length - 1) {
              this.chuoi = "* " + this.searchhotel.star[i];
            } else {
              this.chuoi = "* " + this.searchhotel.star[i] + ",";
            }

          }
          else if (i != 0) {
            if (i != this.searchhotel.star.length - 1) {
              this.chuoi = this.chuoi + this.searchhotel.star[i] + ",";
            } else {
              this.chuoi = this.chuoi + this.searchhotel.star[i];
            }
          }
        }
      }
      if (this.searchhotel.minprice) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "đ " + this.searchhotel.minprice.toLocaleString() + " -" + " " + this.searchhotel.maxprice.toLocaleString();
        } else {
          this.chuoi = "đ " + this.searchhotel.minprice.toLocaleString() + " -" + " " + this.searchhotel.maxprice.toLocaleString();
        }
      }
      if (this.searchhotel.review > 0) {
        if (this.chuoi) {
          this.chuoi = this.chuoi + " | " + "Nhận xét " + this.searchhotel.review + "+";
        } else {
          this.chuoi = "Nhận xét " + this.searchhotel.review + "+";
        }
      }
      this.searchhotel.chuoi = this.chuoi;
    }

    if (this.searchhotel.gbmsg && this.searchhotel.gbmsg.Type == 1) {
      var id1 = { id: this.searchhotel.gbmsg.HotelId };
      this.navCtrl.navigateForward('/hoteldetail:'+this.searchhotel.gbmsg.HotelId);
      //this.navCtrl.navigateForward(['/app/tabs/hoteldetail/'+this.searchhotel.gbmsg.HotelId]);
    } else {
      this.authService.region = this.searchhotel.gbmsg.regionName;
      this.authService.regionid = this.searchhotel.gbmsg.regionId;
      this.authService.regioncode = this.searchhotel.gbmsg.regionCode;
      var sortOnly = (this.searchhotel.chuoi == "" && this.itemOrder);
      var id2 = {filteragain: true, sortOnly: sortOnly};
      //Build other filter
      //Meal

      //Local
      let listLocal = document.getElementsByClassName("local-check");
      this.searchhotel.location = "";
      if(listLocal.length >0){
        for(let i =0; i<listLocal.length; i++){
          if(i==0){
            this.strLocal += listLocal[i].getAttribute("id");
          }else{
            this.strLocal += "," + listLocal[i].getAttribute("id");
          }

          if(!this.gf.checkExistsIndex(this.searchhotel.arrlocalcheck, listLocal[i].getAttribute("id"))){
            this.searchhotel.arrlocalcheck.push(listLocal[i].getAttribute("id"));
          }
        }
        this.searchhotel.location = this.strLocal;
      }
      //Facility
      let listFacility = document.getElementsByClassName("facility-check");
      this.searchhotel.facsearch ="";
      if(listFacility.length >0){
        for(let i =0; i<listFacility.length; i++){
          if(i==0){
            this.strFacility += listFacility[i].getAttribute("id");
          }else{
            this.strFacility += "," + listFacility[i].getAttribute("id");
          }
          if(!this.gf.checkExistsIndex(this.searchhotel.arrfacilitycheck, listFacility[i].getAttribute("id"))){
            this.searchhotel.arrfacilitycheck.push(listFacility[i].getAttribute("id"));
          }
        }
        this.searchhotel.facsearch = this.strFacility;
      }
      //Style
      let listStyle = document.getElementsByClassName("style-check");
      this.searchhotel.tagIds = "";
      if(listStyle.length >0){
        for(let i =0; i<listStyle.length; i++){
          if(i==0){
            this.strStyle += listStyle[i].getAttribute("id");
          }else{
            this.strStyle += "," + listStyle[i].getAttribute("id");
          }
          if(!this.gf.checkExistsIndex(this.searchhotel.arrstylecheck, listStyle[i].getAttribute("id"))){
            this.searchhotel.arrstylecheck.push(listStyle[i].getAttribute("id"));
          }
        }
        this.searchhotel.tagIds = this.strStyle;
      }
      //HotelType
      let listHotelType = document.getElementsByClassName("hoteltype-check");
      this.searchhotel.classIds = "";
      if(listHotelType.length >0){
        for(let i =0; i<listHotelType.length; i++){
          if(i==0){
            this.strHotelType += listHotelType[i].getAttribute("id");
          }else{
            this.strHotelType += "," + listHotelType[i].getAttribute("id");
          }
          if(!this.gf.checkExistsIndex(this.searchhotel.arrhoteltypecheck, listHotelType[i].getAttribute("id"))){
            this.searchhotel.arrhoteltypecheck.push(listHotelType[i].getAttribute("id"));
          }
        }
        this.searchhotel.classIds = this.strHotelType;
      }
      
      //Xóa clone page-hotel-list do push page
      let elements = Array.from(document.querySelectorAll("page-hotel-list")); 
      if(elements.length > 0){
        elements.forEach(el => {
          el.remove();
        });
      }
      this.modalCtrl.dismiss();
      //this.navCtrl.navigateBack('/hotellist/true');
      //google analytic
      this.gf.googleAnalytion('filterandsort','Search',this.chuoi + '|' + this.strLocal+'|'+this.strFacility+'|'+this.strStyle+'|'+this.strHotelType);
    }
    //this.view.dismiss();
  }

  meal1Click(){
    this.meal1check = !this.meal1check;
    this.searchhotel.meal1check = this.meal1check;
  }
  meal2Click(){
    this.meal2check = !this.meal2check;
    this.searchhotel.meal2check = this.meal2check;
  }
  meal3Click(){
    this.meal3check = !this.meal3check;
    this.searchhotel.meal3check = this.meal3check;
  }
  /***
   * Hàm set style check/uncheck theo option được chọn
   * PDANH 28/01/2019
   */
  localClick(objEvent, name){
    let idx = objEvent.target.className.toLocaleString().split(' ')[1].split('-')[2];
    var obj = document.getElementsByClassName(objEvent.target.className.toLocaleString().split(' ')[1]);
    obj[0].classList.remove('local-check');
    obj[0].classList.remove('local-uncheck');
    obj[0].classList.remove('style-check');
    obj[0].classList.remove('style-uncheck');
    obj[0].classList.remove('facility-check');
    obj[0].classList.remove('facility-uncheck');
    obj[0].classList.remove('hoteltype-check');
    obj[0].classList.remove('hoteltype-uncheck');

          if(name == "local"){
            if(this.gf.checkExistsIndex(this.arrlocalcheck,idx)){
              this.gf.removeItem(this.arrlocalcheck,idx);
            }else{
              this.arrlocalcheck.push(idx);
            }
            obj[0].classList.add(this.gf.checkExistsIndex(this.arrlocalcheck,idx) ? 'local-check' : 'local-uncheck');
          }

          if(name == "style"){
            if(this.gf.checkExistsIndex(this.arrstylecheck,idx)){
              this.gf.removeItem(this.arrstylecheck,idx);
            }else{
              this.arrstylecheck.push(idx);
            }
            obj[0].classList.add(this.gf.checkExistsIndex(this.arrstylecheck,idx) ? 'style-check' : 'style-uncheck');
          }

          if(name == "facility"){
            if(this.gf.checkExistsIndex(this.arrfacilitycheck,idx)){
              this.gf.removeItem(this.arrfacilitycheck,idx);
            }else{
              this.arrfacilitycheck.push(idx);
            }
            obj[0].classList.add(this.gf.checkExistsIndex(this.arrfacilitycheck,idx) ? 'style-check' : 'style-uncheck');
          }

          if(name == "hoteltype"){
            if(this.gf.checkExistsIndex(this.arrhoteltypecheck,idx)){
              this.gf.removeItem(this.arrhoteltypecheck,idx);
            }else{
              this.arrhoteltypecheck.push(idx);
            }
            obj[0].classList.add(this.gf.checkExistsIndex(this.arrhoteltypecheck,idx) ? 'hoteltype-check' : 'hoteltype-uncheck');
          }
    
  }


  closeModal() {
    this.modalCtrl.dismiss();
  }
  ionViewDidLoad() {
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }
}
