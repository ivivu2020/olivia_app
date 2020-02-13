import { Component, NgZone,OnInit } from '@angular/core';
import { NavController, Events, Platform, ModalController, ToastController, LoadingController } from '@ionic/angular';
import * as request from 'request';
import { AuthService } from '../providers/auth-service';
import { HttpClientModule } from '@angular/common/http';
import { C } from './../providers/constants';
import { GlobalFunction, ActivityService } from './../providers/globalfunction';
import { SearchHotel } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import * as $ from 'jquery';
import * as L from 'leaflet';

@Component({
  selector: 'app-experiencefilter',
  templateUrl: './experiencefilter.page.html',
  styleUrls: ['./experiencefilter.page.scss'],
})
export class ExperienceFilterPage implements OnInit {
  dataLocal: any=[];
  dataFacility: any=[];
  dataStyle: any=[];
  dataHotelType: any=[];
  dataDistance:any=[{id: 1, name: '1 km', totalPlace: 0, distance: 1},
  {id: 2, name: '5 km', totalPlace: 0, distance: 5},
  {id: 3, name: '10 km', totalPlace: 0, distance: 10},
  {id: 4, name: '20 km', totalPlace: 0, distance: 20}];
  dataHourOpen:any=[
    {id: 1, name: 'Sáng | 5:00 - 12:00', fromTime: '05:00', toTime: '12:00'},
    {id: 2, name: 'Trưa | 10:00 - 14:00', fromTime: '10:00', toTime: '14:00'},
    {id: 3, name: 'Chiều | 12:00 - 23:00', fromTime: '12:00', toTime: '23:00'},
    {id: 4, name: 'Khuya | 17:00 - 24:00', fromTime: '17:00', toTime: '24:00'},
    //{id: 5, name: 'Nguyên ngày | 5:00 - 23:00', fromTime: '05:00', toTime: '23:00'},
    //{id: 6, name: '24/7', fromTime: '05:00', toTime: '24:00'}
  ]
  deviceLocation={
    latitude: null,
    longitude: null,
    regioncode: ''
  };

  locationCoords = {
    latitude: null,
    longitude: null,
    accuracy: "",
    timestamp: "",
    address:""
  }
  arrlocalcheck: any=[];
  arrstylecheck:any=[];
  strLocal: string;
  strStyle: string;
  strDistance:string='distance';
  objData: any;
  ischeckbtnreset: boolean = false;
  ischeckbtn: boolean = true;
  strHotelType: any;
  strHourOpen: any;
  //dataHourOpen: any=[];
  arrhoteltypecheck: any=[];
  arrhouropencheck: any=[];
  arrdistancecheck:any=[];
  checkfilterchange = false;
  arrlocalnamecheck: any=[];
  dataSubRegion: any=[];
  arrsubregioncheck: any=[];
  arrsubregionnamecheck: any=[];
  strSubRegion: string;
  datalistfilter: any = [];
  dataafterfilter:any = [];
  listmapdata: any=[];
  datalistoriginal: any = [];
  loader: HTMLIonLoadingElement;

  constructor(public zone: NgZone,
    private searchhotel: SearchHotel,
    private navCtrl: NavController,
    public gf: GlobalFunction,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    public activityService: ActivityService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    var se = this;
    var regionId = se.gf.getParams('experienceFilter_regionId');
    var regionCode = se.gf.getParams('experienceFilter_regionCode');
    var location = se.gf.getParams('experienceLocation');
    
    if(location){
      se.deviceLocation = location.deviceLocation;
      se.locationCoords = location.locationCoords;
      se.listmapdata = location.listData;
    }

    // se.storage.get('experienceFilter_regionId_'+regionId).then((data:any)=>{
    //   if(data){
    //     se.objData = data;
    //     se.bindData();
    //     se.storage.get('experienceFilter_regionCode_'+regionCode).then((dataregioncode:any)=>{
    //       if(dataregioncode){
    //         se.bindDataLocal(dataregioncode.childRegions);
    //       }else{
    //         //se.loadFilterData();
    //         var regionCode = se.gf.getParams('experienceFilter_regionCode');
    //         var strURL_subRegion = C.urls.baseUrl.urlMobile + '/api/data/GetChildRegionByRegion?code=' + regionCode;
    //         se.gf.RequestApi('GET',strURL_subRegion, {}, {}, "experienceFilter","GetChildRegionByRegion").then((data:any)=>{
    //           if(data && data.childRegions.length >0){
    //             se.storage.set('experienceFilter_regionCode_'+regionCode,data);
    //             se.bindDataLocal(data.childRegions);
    //           }
    //         })
    //       }
    //     })
    //   }else{
    //     se.loadFilterData();
    //   }
    // })

    // se.setTimeoutStorage();
    se.loadFilterData();
  }

  setTimeoutStorage(){
    var hours = 24; // Reset when storage is more than 24hours
    var now = new Date().getTime();
    var setupTime:any = this.storage.get('setupTime');
    if (setupTime == null) {
        this.storage.set('setupTime', now);
    } else {
        if(moment(now).diff(setupTime,'hours') > hours*60*60*1000) {
          var regionId = this.gf.getParams('experienceFilter_regionId');
          var regionCode = this.gf.getParams('experienceFilter_regionCode');
          this.storage.remove('experienceFilter_regionId_'+regionId);
          this.storage.remove('experienceFilter_regionCode_'+regionCode);
            //this.storage.set('setupTime', now);
        }
    }
  }

  loadFilterData(){
    var se = this;
    var regionId = se.gf.getParams('experienceFilter_regionId');
    var strURL =  C.urls.baseUrl.urlMobile + '/api/erp/place/GetTagsByPlaceId?id=' + regionId;
    se.gf.RequestApi('GET',strURL, {}, {}, "experienceFilter","GetTagsByPlaceId").then((data:any)=>{
        se.objData = data;
        se.storage.set('experienceFilter_regionId_'+regionId,data);
        se.bindData();
    })

    //Load subregion
    var regionCode = se.gf.getParams('experienceFilter_regionCode');
    se.storage.get('experienceFilter_childregionCode_'+ regionCode).then((datachildregion) => {
      if(datachildregion){
        se.bindDataLocal(datachildregion.childRegions);
      }else{
        se.storage.get('experienceFilter_subregionCode_'+ regionCode).then((datasubregion) => {
          if(datasubregion){
            se.bindDataSubRegion(datasubregion.subRegions);
          }else{
            var strURL_subRegion = C.urls.baseUrl.urlMobile + '/api/data/GetChildRegionByRegion?code=' + regionCode;
            se.gf.RequestApi('GET',strURL_subRegion, {}, {}, "experienceFilter","GetChildRegionByRegion").then((datachildregion:any)=>{
              if(datachildregion && datachildregion.childRegions && datachildregion.childRegions.length >0){
                se.storage.set('experienceFilter_childregionCode_'+regionCode,datachildregion);
                se.bindDataLocal(datachildregion.childRegions);
              }else{
                var strURL_subRegion = C.urls.baseUrl.urlMobile + '/api/data/GetSubRegionByRegion?code=' + regionCode;
                se.gf.RequestApi('GET',strURL_subRegion, {}, {}, "experienceFilter","GetSubRegionByRegion").then((datasubregion:any)=>{
                  if(datasubregion && datachildregion.childRegions && datasubregion.subRegions.length >0){
                      se.storage.set('experienceFilter_subregionCode_'+regionCode,datasubregion);
                      se.bindDataSubRegion(datasubregion.subRegions);
                    }
                  })
              }
            })
          }
        })
      }
    })
    

    setTimeout(()=>{
      var strURL_CountFilter = C.urls.baseUrl.urlMobile + '/api/Data/CountFilterPlace?regionCodes=' + regionCode;
      se.gf.RequestApi('GET',strURL_CountFilter, {}, {}, "experienceFilter","CountFilterPlace").then((data:any)=>{
        if(data && data.data.length >0){
          //console.log(data);

          //map lat,long to list data
          let datalist = data.data;

            se.calculateDistanceMarker(datalist);
            se.datalistoriginal = [...datalist];
            se.datalistfilter = [...datalist];
            se.combineFilterAndCount();
          
        }
      })
    },150)
  }

  mapCodinateData(data){
    var se = this;
    if(data && data.length >0){
      data = data.map((item, row)=> {
        const found = se.listmapdata.find((el) => {return el.id == item.id });
        return {...item, ...found};
      })
      return data;
    }
  }

  recountFilter(data){
    var se = this;
    var datafilter = data.map(e => ({ ... e }));
    se.zone.run(()=>{
      //count theo khu vực
      if(se.dataLocal && se.dataLocal.length >0){
        se.dataLocal.forEach((element) => {
          element.totalPlace = datafilter.filter((el) => { return el.childRegionId == element.id}).length;
        })
      }
      //count theo khu vực
      if(se.dataSubRegion && se.dataSubRegion.length >0){
        se.dataSubRegion.forEach((element) => {
          element.totalPlace = datafilter.filter((el) => { return el.subRegionId == element.id}).length;
        })
      }
      //count theo loại hình
      if(se.dataHotelType && se.dataHotelType.length >0){
        se.dataHotelType.forEach((element) => {
          element.totalPlace = datafilter.filter((el) => { return el.tags.indexOf(element.placeTagId) != -1}).length;
        })
      }
      //count theo phong cách
      if(se.dataStyle && se.dataStyle.length >0){
        se.dataStyle.forEach((element) => {
          element.totalPlace = datafilter.filter((el) => { return el.tags.indexOf(element.placeTagId) != -1}).length;
        })
      }
      //count theo giờ hoạt động
      if(se.dataHourOpen && se.dataHourOpen.length >0){
        se.dataHourOpen.forEach((element) => {
          element.totalPlace = se.filterOpenHour(datafilter, element.id).length;
        })
      }
      //count theo km
      if(se.dataDistance && se.dataDistance.length>0){
        se.calculateDistanceMarker(datafilter).then(()=>{
          se.dataDistance.forEach((element) => {
            element.totalPlace = se.filterDistance(datafilter, element.id).length;
          })
        })
        
      }
    })
    
    if(se.loader){
      se.loader.dismiss();
    }
  }

  filterDistance(data, id){
    var se = this;
    return data.filter((item)=>{ return se.getWhereByDistance(item, id) })
  }

  /**
   * Load thông tin Loại hình/ Phong cách/ Giờ hoạt động thuộc vùng đang filter
   */
  bindData(){
    var se = this;
    se.arrstylecheck=[];
    se.arrhoteltypecheck=[];
    se.arrhouropencheck=[];

    se.zone.run(()=>{
      //Lấy dữ liệu loại hình, giờ hoạt động, phong cách theo từng vùng lưu vào biến tương ứng
      if(se.objData.tags && se.objData.tags.length >0){
        se.objData.tags.forEach(group => {
          if(group && group.length >0){
            group.forEach(filterGroup => {
              if(filterGroup.placeTagTypeId == 1 && filterGroup.placeTagId != 8)//Loại hình
              {
                se.strHotelType = 'hoteltype';
                se.dataHotelType.push(filterGroup);
              }
              // else if(filterGroup.placeTagTypeId == 2)//Giờ hoạt động
              // {
              //   se.strHourOpen = 'houropen';
              //   se.dataHourOpen.push(filterGroup);
              // }
              else if(filterGroup.placeTagTypeId == 4)//Phong cách
              {
                se.strStyle = 'style';
                se.dataStyle.push(filterGroup);
              }
            });
          }
        });
        //Lấy lại mục được check chọn lưu vào biến
        if(se.searchhotel.ef_arrhouropencheck){
          se.arrhouropencheck = se.searchhotel.ef_arrhouropencheck;
        }
        if(se.searchhotel.ef_arrhoteltypecheck){
          se.arrhoteltypecheck = se.searchhotel.ef_arrhoteltypecheck;
        }
        if(se.searchhotel.ef_arrstylecheck){
          se.arrstylecheck = se.searchhotel.ef_arrstylecheck;
        }
        if(se.searchhotel.ef_arrdistancecheck){
          se.arrdistancecheck = se.searchhotel.ef_arrdistancecheck;
        }
      }
        //Render lại style selected các item được check chọn
        setTimeout(()=>{
          //style
          if(se.dataStyle && se.dataStyle.length >0){
            se.dataStyle.forEach(item => {
              se.renderCssByType("style",(Number(item.placeTagId)).toString(), se.gf.checkExistsIndex(se.arrstylecheck,item.placeTagId) );
            });
          }
           //hoteltype
           if(se.dataHotelType && se.dataHotelType.length >0){
            se.dataHotelType.forEach(item => {
              se.renderCssByType("hoteltype",(Number(item.placeTagId)).toString(), se.gf.checkExistsIndex(se.arrhoteltypecheck,item.placeTagId) );
            });
          }
          //houropen
          if(se.dataHourOpen && se.dataHourOpen.length >0){
            se.dataHourOpen.forEach(item => {
              se.renderCssByType("houropen",(Number(item.id)).toString(), se.gf.checkExistsIndex(se.arrhouropencheck,item.id) );
            });
          }
          //distance
          if(se.dataDistance && se.dataDistance.length>0){
            se.dataDistance.forEach(item => {
              se.renderCssByType("distance",(Number(item.id)).toString(), se.gf.checkExistsIndex(se.arrdistancecheck,item.id) );
            });
          }
        })
          
      },10)
  }

  bindDataLocal(data){
    var se = this;
    se.zone.run(()=>{
      if(data && data.length >0){
        data.forEach(element => {
          se.strLocal = 'local';
          se.dataLocal.push(element);
        });
        if(se.searchhotel.ef_arrlocalcheck){
          se.arrlocalcheck = se.searchhotel.ef_arrlocalcheck;
        }
      }
        
        setTimeout(()=>{
          //Local
          if(se.dataLocal && se.dataLocal.length >0){
            se.dataLocal.forEach(item => {
              se.renderCssByType("local",(Number(item.id)).toString(), se.gf.checkExistsIndex(se.arrlocalcheck,item.id) );
            });
          }
        },10)
      })
  }

  bindDataSubRegion(data){
    var se = this;
    se.zone.run(()=>{
      if(data && data.length >0){
        data.forEach(element => {
          se.strSubRegion = 'subregion';
          se.dataSubRegion.push(element);
        });
        if(se.searchhotel.ef_arrsubregioncheck){
          se.arrsubregioncheck = se.searchhotel.ef_arrsubregioncheck;
        }
      }
        
        setTimeout(()=>{
          //Local
          if(se.dataSubRegion && se.dataSubRegion.length >0){
            se.dataSubRegion.forEach(item => {
              se.renderCssByType("subregion",(Number(item.id)).toString(), se.gf.checkExistsIndex(se.arrsubregioncheck,item.id) );
            });
          }
        },10)
      })
  }

  goback(){
    this.navCtrl.back();
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
    objLocal[0].classList.remove('style-check');
    objLocal[0].classList.remove('style-uncheck');
    objLocal[0].classList.remove('hoteltype-check');
    objLocal[0].classList.remove('hoteltype-uncheck');
    objLocal[0].classList.remove('houropen-check');
    objLocal[0].classList.remove('houropen-uncheck');
    objLocal[0].classList.remove('distance-check');
    objLocal[0].classList.remove('distance-uncheck');
    objLocal[0].classList.remove('subregion-check');
    objLocal[0].classList.remove('subregion-uncheck');
    if(strType == "local"){
      objLocal[0].classList.add(checked ? 'local-check' : 'local-uncheck');
      if(checked){
        if(!this.gf.checkExistsIndex(this.arrlocalcheck, strIndex)){
          this.arrlocalcheck.push(strIndex);
        }
      }else{
        this.gf.removeItem(this.arrlocalcheck,strIndex);
        this.gf.removeItem(this.searchhotel.ef_arrlocalcheck, strIndex);
      }
    }else if(strType == "subregion"){
      objLocal[0].classList.add(checked ? 'subregion-check' : 'subregion-uncheck');
      if(checked){
        if(!this.gf.checkExistsIndex(this.arrsubregioncheck, strIndex)){
          this.arrsubregioncheck.push(strIndex);
        }
      }else{
        this.gf.removeItem(this.arrsubregioncheck,strIndex);
        this.gf.removeItem(this.searchhotel.ef_arrsubregioncheck, strIndex);
      }
    }
    else if(strType == "style"){
      objLocal[0].classList.add(checked ? 'style-check' : 'style-uncheck');
      if(checked){
        if(!this.gf.checkExistsIndex(this.arrstylecheck, strIndex)){
          this.arrstylecheck.push(strIndex);
        }
      }else{
        this.gf.removeItem(this.arrstylecheck,strIndex);
        this.gf.removeItem(this.searchhotel.ef_arrstylecheck, strIndex);
      }
    }else if(strType == "facility"){
      objLocal[0].classList.add(checked ? 'facility-check' : 'facility-uncheck');
      
    }else if(strType == "hoteltype"){
      objLocal[0].classList.add(checked ? 'hoteltype-check' : 'hoteltype-uncheck');
      if(checked){
        if(!this.gf.checkExistsIndex(this.arrhoteltypecheck, strIndex)){
          this.arrhoteltypecheck.push(strIndex);
        }
      }else{
        this.gf.removeItem(this.arrhoteltypecheck,strIndex);
        this.gf.removeItem(this.searchhotel.ef_arrhoteltypecheck, strIndex);
        //Bỏ tích chọn loại hình mà thuộc loại item đang search thì gán = null
        if(this.searchhotel.inputExperienceItem && this.searchhotel.inputExperienceItem.tagsJson && this.searchhotel.inputExperienceItem.tagsJson.length >0 && this.searchhotel.inputExperienceItem.tagsJson[0].id.toString() == strIndex){
          this.searchhotel.inputExperienceItem = null;
          this.searchhotel.inputExperienceText = "";
        }
      }
    }else if(strType == "houropen"){
      objLocal[0].classList.add(checked ? 'houropen-check' : 'houropen-uncheck');
      if(checked){
        if(!this.gf.checkExistsIndex(this.arrhouropencheck, strIndex)){
          this.arrhouropencheck.push(strIndex);
        }
      }else {
        this.gf.removeItem(this.arrhouropencheck,strIndex);
        this.gf.removeItem(this.searchhotel.ef_arrhouropencheck, strIndex);
      }
    }else if(strType == "distance"){
      objLocal[0].classList.add(checked ? 'distance-check' : 'distance-uncheck');
      if(checked){
        if(!this.gf.checkExistsIndex(this.arrdistancecheck, strIndex)){
          this.arrdistancecheck.push(strIndex);
        }
      }else {
        this.gf.removeItem(this.arrdistancecheck,strIndex);
        this.gf.removeItem(this.searchhotel.ef_arrdistancecheck, strIndex);
      }
    }
  }
}
/***
 * Hàm click chọn item filter
 * PDANH 14/09/2019
 */
itemClick(objEvent,type,placeTagId){
    var se = this;
    se.checkfilterchange = true;
    se.presentLoading();
    //let idx = objEvent.target.className.toLocaleString().split(' ')[1].split('-')[2];
    var obj = document.getElementsByClassName(objEvent.currentTarget.className.toLocaleString().split(' ')[1]);
    obj[0].classList.remove('local-check');
    obj[0].classList.remove('local-uncheck');
    obj[0].classList.remove('style-check');
    obj[0].classList.remove('style-uncheck');
    obj[0].classList.remove('houropen-check');
    obj[0].classList.remove('houropen-uncheck');
    obj[0].classList.remove('hoteltype-check');
    obj[0].classList.remove('hoteltype-uncheck');
    obj[0].classList.remove('distance-check');
    obj[0].classList.remove('distance-uncheck');
    obj[0].classList.remove('subregion-check');
    obj[0].classList.remove('subregion-uncheck');
    if(type=='local'){
      let check = !se.gf.checkExistsIndex(se.arrlocalcheck,obj[0].id);
      se.renderCssByType(type, placeTagId, check);
     
    }
    if(type=='subregion'){
      let check = !se.gf.checkExistsIndex(se.arrsubregioncheck,obj[0].id);
      se.renderCssByType(type, placeTagId, !se.gf.checkExistsIndex(se.arrsubregioncheck,obj[0].id));
      
    }

    if(type=='hoteltype'){
      let check = !se.gf.checkExistsIndex(se.arrhoteltypecheck,obj[0].id);
      se.renderCssByType(type, placeTagId, check);
      
    }
    
    if(type=='houropen'){
      se.renderCssByType(type, placeTagId, !se.gf.checkExistsIndex(se.arrhouropencheck,obj[0].id));
    }
    if(type=='style'){
      se.renderCssByType(type, placeTagId, !se.gf.checkExistsIndex(se.arrstylecheck,obj[0].id));
    }
    if(type=='distance'){
      se.renderCssByType(type, placeTagId, !se.gf.checkExistsIndex(se.arrdistancecheck,obj[0].id));
    }
    
    
    se.combineFilterAndCount();
}

combineFilterAndCount(){
  var se = this;
  let data = [...se.datalistfilter];
    let databeforefilter = [...data];
    //let dataafterfilter:any = [];
    se.dataafterfilter = databeforefilter;
  if(databeforefilter && databeforefilter.length >0){
    //countfilter theo khu vực
    if(se.arrlocalcheck && se.arrlocalcheck.length >0){
      se.dataafterfilter = se.arrlocalcheck.length >0 ? se.getFilterDataLocal(databeforefilter, se.arrlocalcheck) : databeforefilter;
    }
    //countfilter theo khu vực con
    if(se.arrsubregioncheck && se.arrsubregioncheck.length >0){
      se.dataafterfilter = se.arrsubregioncheck.length >0 ? se.getFilterDataSubRegion(databeforefilter, se.arrsubregioncheck) : databeforefilter;
    }
    //countfilter theo loại hình
      //let strhoteltypecheck = se.arrhoteltypecheck.join(',');
      if(se.dataafterfilter && se.dataafterfilter.length>0){
        se.dataafterfilter = se.arrhoteltypecheck.length >0 ? se.getFilterDataHotelType(se.dataafterfilter, se.arrhoteltypecheck) : se.dataafterfilter;
      }
      // else{
      //   se.dataafterfilter = se.arrhoteltypecheck.length >0 ? databeforefilter.filter((e:any) => { return e.tags.join(',').indexOf(strhoteltypecheck) != -1 }) : databeforefilter;
      // }
      //countfilter theo giờ mở cửa
      if(se.dataafterfilter && se.dataafterfilter.length>0){
        se.dataafterfilter = se.arrhouropencheck.length >0 ? se.getFilterDataByOpenHour(se.dataafterfilter, se.arrhouropencheck) : se.dataafterfilter;
      }
      // else{
      //   se.dataafterfilter = se.arrhouropencheck.length >0 ? databeforefilter.filter((e:any) => { return e.tags.join(',').indexOf(strhouropen) != -1 }) : databeforefilter;
      // }
      //countfilter theo khoảng cách
      //let strdistance = se.arrdistancecheck.join(',');
      if(se.dataafterfilter && se.dataafterfilter.length>0){
        se.dataafterfilter = se.arrdistancecheck.length >0 ? se.getFilterDataByDistance(se.dataafterfilter, se.arrdistancecheck) : se.dataafterfilter;
      }
      // else{
      //   se.dataafterfilter = se.arrdistancecheck.length >0 ? se.getFilterDataByDistance(se.dataafterfilter, se.arrdistancecheck): databeforefilter;
      // }
      //countfilter theo phong cách
      let strstyle = se.arrstylecheck.join(',');
      if(se.dataafterfilter && se.dataafterfilter.length>0){
        //let arrfilter = se.dataafterfilter.map((item) => { return item.tags})
        se.dataafterfilter = se.arrstylecheck.length >0 ? se.dataafterfilter.filter((e:any) => { return se.arrstylecheck.filter( it => { return e.tags.includes(it)}).length >0 }) : se.dataafterfilter;
      }
      // else{
      //   se.dataafterfilter = se.arrstylecheck.length >0 ? databeforefilter.filter((e:any) => { return e.tags.join(',').indexOf(strstyle) != -1 }) : databeforefilter;
      // }
      if(se.activityService.listExperienceSearch && se.activityService.listExperienceSearch.length >0){
        se.dataafterfilter = se.dataafterfilter.filter((e:any) => { return se.activityService.listExperienceSearch.filter((item)=>{ return e.id == item.placeId }).length >0 })
      }
      setTimeout(()=>{
        se.recountFilter(se.dataafterfilter);
      },100)
  }
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
    let list = se.filterOpenHour(listfilter, h);
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

close() {
  
  // if(this.dataafterfilter && this.dataafterfilter.length ==0){
  //   this.showWarning();
  //   return;
  // }
  //var strHotelTypeCheck ='',strStyleCheck='',strHourOpenCheck='',strLocalCheck='',strFilter='',strFilterName='';
  this.searchhotel.clearFilterExperience = false;
  var paramsFilter ={strLocalCheck:'', strHotelTypeCheck:'', strHourOpenCheck:'',strFilter:'', strFilterName:'',strStyleCheck:'', strSubRegion: ''}
  
  this.buildStringFilter(paramsFilter);

  if(paramsFilter.strFilterName && paramsFilter.strFilterName.length >0){
    this.searchhotel.stringFilterName = paramsFilter.strFilterName;
  }
  this.searchhotel.clearFilterExperience = false;
  this.modalCtrl.dismiss({strFilter: paramsFilter.strFilter , dataFilter : this.dataafterfilter});
  //this.buildStringFilter(paramsFilter);

  // if(paramsFilter.strFilterName && paramsFilter.strFilterName.length >0){
  //   this.searchhotel.stringFilterName = paramsFilter.strFilterName;
  // }
  // this.searchhotel.clearFilterExperience = false;
  // this.modalCtrl.dismiss({strFilter: paramsFilter.strFilter , dataFilter : this.dataafterfilter});

  //if( (paramsFilter.strFilter && paramsFilter.strFilter.length >0) || this.searchhotel.ef_arrdistancecheck.length >0){
    // if(this.searchhotel.ef_arrhoteltypecheck.length ==0){
    //   this.bindHotelTypeDefault(paramsFilter);
    // }else{
    //   this.searchhotel.clearFilterExperience = false;
    //   this.modalCtrl.dismiss(paramsFilter.strFilter);
    // }
  //}
  // else{
  //   this.bindHotelTypeDefault(paramsFilter);
  // }
  //this.modalCtrl.dismiss();
}

/***
 * Hàm reset style mục chọn
 * PDANH 28/01/2019
 */
clickCancel() {
    this.ischeckbtnreset = true;
    this.ischeckbtn = false;
    //Reset other filter
    //this.arrlocalcheck = [];
    
    this.searchhotel.clearFilterExperience = true;

    let listMeal = document.getElementsByClassName("meal-check");
    if(listMeal.length >0){
      for(let i =listMeal.length-1; i>=0; i--){
        listMeal[i].classList.remove('meal-check');
      }
    }
    let listLocal = document.getElementsByClassName("local-check");
    if(listLocal.length >0){
      for(let i =listLocal.length-1; i>=0; i--){
        $('.local-item-'+listLocal[i].id).addClass('local-uncheck');
        listLocal[i].classList.remove('local-check');
      }
    }
    let listSubRegion = document.getElementsByClassName("subregion-check");
    if(listSubRegion.length >0){
      for(let i =listSubRegion.length-1; i>=0; i--){
        $('.subregion-item-'+listSubRegion[i].id).addClass('subregion-uncheck');
        listSubRegion[i].classList.remove('subregion-check');
      }
    }
    let listStyle = document.getElementsByClassName("style-check");
    if(listStyle.length >0){
      for(let i =listStyle.length-1; i>=0; i--){
        $('.style-item-'+listStyle[i].id).addClass('style-uncheck');
        listStyle[i].classList.remove('style-check');
        
      }
    }
    let listHourOpen = document.getElementsByClassName("houropen-check");
    if(listHourOpen.length >0){
      for(let i =listHourOpen.length-1; i>=0; i--){
        $('.houropen-item-'+listHourOpen[i].id).addClass('houropen-uncheck');
        listHourOpen[i].classList.remove('houropen-check');
      }
    }
    let listHotelType = document.getElementsByClassName("hoteltype-check");
    if(listHotelType.length >0){
      for(let i =listHotelType.length-1; i >=0; i--){
        $('.hoteltype-item-'+listHotelType[i].id).addClass('hoteltype-uncheck');
        listHotelType[i].classList.remove('hoteltype-check');
      }
    }

    let listDistance = document.getElementsByClassName("distance-check");
    if(listDistance.length >0){
      for(let i =listDistance.length-1; i >=0; i--){
        $('.distance-item-'+listDistance[i].id).addClass('distance-uncheck');
        listDistance[i].classList.remove('distance-check');

      }
    }
    
    this.strLocal="";
    this.strStyle="";
    this.strHourOpen="";
    this.strHotelType="";
    this.strSubRegion = "";
    this.arrhoteltypecheck=[];
    this.arrlocalcheck=[];
    this.arrhouropencheck=[];
    this.arrstylecheck=[];
    this.arrdistancecheck=[];
    this.arrsubregioncheck=[];
    this.searchhotel.ef_arrlocalcheck = [];
    this.searchhotel.ef_arrhouropencheck = [];
    this.searchhotel.ef_arrstylecheck=[];
    this.searchhotel.ef_arrstylenamecheck=[];
    this.searchhotel.ef_arrhoteltypecheck=[];
    this.searchhotel.ef_arrdistancecheck=[];
    this.searchhotel.ef_arrdistancenamecheck=[];
    this.searchhotel.ef_arrhoteltypenamecheck=[];
    this.searchhotel.ef_arrhouropennamecheck=[];
    this.searchhotel.ef_arrlocalnamecheck=[];
    this.searchhotel.ef_arrsubregioncheck=[];
    this.searchhotel.ef_arrsubregionnamecheck=[];
    this.searchhotel.inputExperienceItem = null;
    this.searchhotel.inputExperienceRegionCode = '';
    this.searchhotel.inputExperienceRegionName = '';
    //this.searchhotel.inputExperienceText = '';
    if(this.searchhotel.inputExperienceRegionName){
      this.searchhotel.inputExperienceText = this.searchhotel.inputExperienceRegionName;
    }else{
      this.searchhotel.inputExperienceText = "";
    }

    let data = [...this.datalistoriginal];
    this.zone.run(()=>{
      this.dataafterfilter = [];
      this.datalistfilter = [];
      this.datalistfilter = [...data];
      this.dataafterfilter = [...data];
      this.recountFilter(data);
    })
    

}

clickOk() {
  this.ischeckbtn = true;
  this.ischeckbtnreset = false;
  if(this.dataafterfilter && this.dataafterfilter.length ==0){
    this.showWarning();
    return;
  }
  //var strHotelTypeCheck ='',strStyleCheck='',strHourOpenCheck='',strLocalCheck='',strFilter='',strFilterName='';
  this.searchhotel.clearFilterExperience = false;
  var paramsFilter ={strLocalCheck:'', strHotelTypeCheck:'', strHourOpenCheck:'',strFilter:'', strFilterName:'',strStyleCheck:'', strSubRegion: ''}
  
  this.buildStringFilter(paramsFilter);

  if(paramsFilter.strFilterName && paramsFilter.strFilterName.length >0){
    this.searchhotel.stringFilterName = paramsFilter.strFilterName;
  }
  this.searchhotel.clearFilterExperience = false;
  this.modalCtrl.dismiss({strFilter: paramsFilter.strFilter , dataFilter : this.dataafterfilter});
  //if( (paramsFilter.strFilter && paramsFilter.strFilter.length >0) || this.searchhotel.ef_arrdistancecheck.length >0){
    // if(this.searchhotel.ef_arrhoteltypecheck.length ==0){
    //   this.bindHotelTypeDefault(paramsFilter);
    // }else{
    //   this.searchhotel.clearFilterExperience = false;
    //   this.modalCtrl.dismiss(paramsFilter.strFilter);
    // }
  ///}
  // else{
  //   this.bindHotelTypeDefault(paramsFilter);
  // }
  
  }

  buildStringFilter(paramsFilter){
    //Local
    let listLocal = document.getElementsByClassName("local-check");
    this.searchhotel.ef_location = "";
    this.searchhotel.ef_arrlocalnamecheck=[];
    if(listLocal.length >0){
      for(let i =0; i<listLocal.length; i++){
        if(i==0){
          paramsFilter.strLocalCheck += listLocal[i].getAttribute("id");
          paramsFilter.strFilterName += listLocal[i].getAttribute("name");
        }else{
          paramsFilter.strLocalCheck += "," + listLocal[i].getAttribute("id");
          paramsFilter.strFilterName += ", " + listLocal[i].getAttribute("name");
        }
        if(this.searchhotel.ef_arrlocalnamecheck && this.searchhotel.ef_arrlocalnamecheck.length >0 && !this.gf.checkExistsItemInArray(this.searchhotel.ef_arrlocalnamecheck,listLocal[i].getAttribute("name"),'filtername')){
          this.searchhotel.ef_arrlocalnamecheck.push(listLocal[i].getAttribute("name"));
        }else if(this.searchhotel.ef_arrlocalnamecheck.length == 0){
          this.searchhotel.ef_arrlocalnamecheck.push(listLocal[i].getAttribute("name"));
        }
   
      }
      if(paramsFilter.strLocalCheck.length >0){
        this.searchhotel.ef_location = paramsFilter.strLocalCheck;
        this.searchhotel.ef_arrlocalcheck = this.arrlocalcheck;
        paramsFilter.strFilter +=  "&childRegions=" + paramsFilter.strLocalCheck;
      }
      
    }else{
      this.searchhotel.ef_arrlocalnamecheck=[];
    }
    //SubRegion
    let listSubRegion = document.getElementsByClassName("subregion-check");
    this.searchhotel.ef_arrsubregionnamecheck=[];
    if(listSubRegion.length >0){
      for(let i =0; i<listSubRegion.length; i++){
        if(i==0){
          paramsFilter.strSubRegion += listSubRegion[i].getAttribute("id");
          paramsFilter.strFilterName += listSubRegion[i].getAttribute("name");
        }else{
          paramsFilter.strSubRegion += "," + listSubRegion[i].getAttribute("id");
          paramsFilter.strFilterName += ", " + listSubRegion[i].getAttribute("name");
        }
        if(this.searchhotel.ef_arrsubregionnamecheck && this.searchhotel.ef_arrsubregionnamecheck.length >0 && !this.gf.checkExistsItemInArray(this.searchhotel.ef_arrsubregionnamecheck,listSubRegion[i].getAttribute("name"),'filtername')){
          this.searchhotel.ef_arrsubregionnamecheck.push(listSubRegion[i].getAttribute("name"));
        }else if(this.searchhotel.ef_arrsubregionnamecheck.length == 0){
          this.searchhotel.ef_arrsubregionnamecheck.push(listSubRegion[i].getAttribute("name"));
        }

      }
      if(paramsFilter.strSubRegion.length >0){
        this.searchhotel.ef_arrsubregioncheck = this.arrsubregioncheck;
        paramsFilter.strFilter +=  "&subRegions=" + paramsFilter.strSubRegion;
      }
      
    }else{
      this.searchhotel.ef_arrsubregionnamecheck=[];
    }
    //HotelType
    let listHotelType = document.getElementsByClassName("hoteltype-check");
    this.searchhotel.ef_hoteltype = "";
    this.searchhotel.ef_arrhoteltypenamecheck=[];
    if(listHotelType.length >0){
      for(let i =0; i<listHotelType.length; i++){
        if(i==0){
          paramsFilter.strHotelTypeCheck += listHotelType[i].getAttribute("id");
          if(paramsFilter.strFilterName && paramsFilter.strFilterName.length>0){
            paramsFilter.strFilterName += ' | '+ listHotelType[i].getAttribute("name");
          }else{
            paramsFilter.strFilterName += listHotelType[i].getAttribute("name");
          }
          
        }else{
          paramsFilter.strHotelTypeCheck += "," + listHotelType[i].getAttribute("id");
          paramsFilter.strFilterName += ", " + listHotelType[i].getAttribute("name");
        }
        if(this.searchhotel.ef_arrhoteltypenamecheck && this.searchhotel.ef_arrhoteltypenamecheck.length >0 && !this.gf.checkExistsItemInArray(this.searchhotel.ef_arrhoteltypenamecheck,listHotelType[i].getAttribute("name"),'filtername')){
          this.searchhotel.ef_arrhoteltypenamecheck.push(listHotelType[i].getAttribute("name"));
        }else if(this.searchhotel.ef_arrhoteltypenamecheck.length == 0){
          this.searchhotel.ef_arrhoteltypenamecheck.push(listHotelType[i].getAttribute("name"));
        }
      }
      this.searchhotel.ef_hoteltype = paramsFilter.strHotelTypeCheck;
      this.searchhotel.ef_arrhoteltypecheck = this.arrhoteltypecheck;
      if(paramsFilter.strHotelTypeCheck.length >0){
        paramsFilter.strFilter +=  "&Tags=" + paramsFilter.strHotelTypeCheck;
      }
      
    }else{
      this.searchhotel.ef_arrhoteltypenamecheck=[];
    }

    //Style
    let listStyle = document.getElementsByClassName("style-check");
    this.searchhotel.ef_style = "";
    this.searchhotel.ef_arrstylenamecheck=[];
    if(listStyle.length >0){
      for(let i =0; i<listStyle.length; i++){
        if(i==0){
          paramsFilter.strStyleCheck += listStyle[i].getAttribute("id");
          if(paramsFilter.strFilterName && paramsFilter.strFilterName.length>0){
            paramsFilter.strFilterName += ' | '+ listStyle[i].getAttribute("name");
          }else{
            paramsFilter.strFilterName += listStyle[i].getAttribute("name");
          }
          
        }else{
          paramsFilter.strStyleCheck += "," + listStyle[i].getAttribute("id");
          paramsFilter.strFilterName += ", " + listStyle[i].getAttribute("name");
        }
        if(this.searchhotel.ef_arrstylenamecheck && this.searchhotel.ef_arrstylenamecheck.length >0 && !this.gf.checkExistsItemInArray(this.searchhotel.ef_arrstylenamecheck,listStyle[i].getAttribute("name"),'filtername')){
          this.searchhotel.ef_arrstylenamecheck.push(listStyle[i].getAttribute("name"));
        }else if(this.searchhotel.ef_arrstylenamecheck.length == 0){
          this.searchhotel.ef_arrstylenamecheck.push(listStyle[i].getAttribute("name"));
        }
      }
      this.searchhotel.ef_style = paramsFilter.strStyleCheck;
      this.searchhotel.ef_arrstylecheck = this.arrstylecheck;
      if(paramsFilter.strStyleCheck.length >0){
        if(paramsFilter.strHotelTypeCheck.length >0){
          paramsFilter.strFilter +=  "," + paramsFilter.strStyleCheck;
        }else{
          paramsFilter.strFilter +=  "&Tags=" + paramsFilter.strStyleCheck;
        }
      }
      
    }else{
      this.searchhotel.ef_arrstylenamecheck=[];
    }

    //houropen
    let listHourOpen = document.getElementsByClassName("houropen-check");
    this.searchhotel.ef_houropen = "";
    this.searchhotel.ef_arrhouropennamecheck=[];
    if(listHourOpen.length >0){
      for(let i =0; i<listHourOpen.length; i++){
        if(i==0){
          paramsFilter.strHourOpenCheck += listHourOpen[i].getAttribute("id");
          if(paramsFilter.strFilterName && paramsFilter.strFilterName.length>0){
            paramsFilter.strFilterName += ' | '+ listHourOpen[i].getAttribute("name");
          }else{
            paramsFilter.strFilterName += listHourOpen[i].getAttribute("name");
          }
        }else{
          paramsFilter.strHourOpenCheck += "," + listHourOpen[i].getAttribute("id");
          paramsFilter.strFilterName +=  ", " + listHourOpen[i].getAttribute("name");
        }
        if(this.searchhotel.ef_arrhouropennamecheck && this.searchhotel.ef_arrhouropennamecheck.length >0 && !this.gf.checkExistsItemInArray(this.searchhotel.ef_arrhouropennamecheck,listHourOpen[i].getAttribute("name"),'filtername')){
          this.searchhotel.ef_arrhouropennamecheck.push(listHourOpen[i].getAttribute("name"));
        }else if(this.searchhotel.ef_arrhouropennamecheck.length == 0){
          this.searchhotel.ef_arrhouropennamecheck.push(listHourOpen[i].getAttribute("name"));
        }
        //this.searchhotel.ef_arrhouropennamecheck.push(listHourOpen[i].getAttribute("name"));
      }
      this.searchhotel.ef_houropen = paramsFilter.strHourOpenCheck;
      this.searchhotel.ef_arrhouropencheck = this.arrhouropencheck;
      // if(paramsFilter.strFilter.length >0){
      //   paramsFilter.strFilter += ',' + paramsFilter.strHourOpenCheck;
      // }else{
      //   paramsFilter.strFilter += "&Tags=" + paramsFilter.strHourOpenCheck;
      // }
      
    }else{
      this.searchhotel.ef_arrhouropennamecheck=[];
    }
    //Distance
    let listDistance = document.getElementsByClassName("distance-check");
    this.searchhotel.ef_arrdistancenamecheck=[];
    if(listDistance.length >0){
      for(let i =0; i<listDistance.length; i++){
        if(i==0){
          if(paramsFilter.strFilterName && paramsFilter.strFilterName.length>0){
            paramsFilter.strFilterName += ' | '+ listDistance[i].getAttribute("name");
          }else{
            paramsFilter.strFilterName += listDistance[i].getAttribute("name");
          }
        }else{
          paramsFilter.strFilterName +=  ", " + listDistance[i].getAttribute("name");
        }
        if(this.searchhotel.ef_arrdistancenamecheck && this.searchhotel.ef_arrdistancenamecheck.length >0 && !this.gf.checkExistsItemInArray(this.searchhotel.ef_arrdistancenamecheck,listDistance[i].getAttribute("name"),'filtername')){
          this.searchhotel.ef_arrdistancenamecheck.push(listDistance[i].getAttribute("name"));
        }else if(this.searchhotel.ef_arrdistancenamecheck.length == 0){
          this.searchhotel.ef_arrdistancenamecheck.push(listDistance[i].getAttribute("name"));
        }
        //this.searchhotel.ef_arrdistancenamecheck.push(listDistance[i].getAttribute("name"));
      }
      this.searchhotel.ef_arrdistancecheck = this.arrdistancecheck;
    }else{
      this.searchhotel.ef_arrdistancenamecheck=[];
    }

    

    return paramsFilter;
  }

  async showWarning(){
    var se = this;
    let toast = await se.toastCtrl.create({
      message: 'Không có trải nghiệm nào thỏa mãn điều kiện lọc. Vui lòng chọn lại.',
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }

  bindHotelTypeDefault(paramsFilter){
    var se = this;
    se.searchhotel.ef_arrhoteltypecheck = [];
    se.searchhotel.ef_arrhoteltypenamecheck = [];
    //var paramsFilter ={strLocalCheck:'', strHotelTypeCheck:'', strHourOpenCheck:'',strFilter:'', strFilterName:''}
    se.dataHotelType.forEach(item => {
      //se.renderCssByType("hoteltype",(Number(item.placeTagId)).toString(), se.gf.checkExistsIndex(se.arrhoteltypecheck,item.placeTagId) );
      se.searchhotel.ef_arrhoteltypecheck.push(item.placeTagId);
      se.searchhotel.ef_arrhoteltypenamecheck.push(item.name);
    });

    setTimeout(()=>{
      //se.buildStringFilter(paramsFilter);
      se.dataHotelType.forEach(item => {
        if(paramsFilter.strHotelTypeCheck){
          paramsFilter.strHotelTypeCheck += "," + item.placeTagId;
        }else{
          paramsFilter.strHotelTypeCheck += item.placeTagId;
        }
        
        if(paramsFilter.strFilterName && paramsFilter.strFilterName.length>0){
          paramsFilter.strFilterName += ' | '+ item.name;
        }else{
          paramsFilter.strFilterName += item.name;
        }

      });
      if(paramsFilter.strHotelTypeCheck.length >0){
        paramsFilter.strFilter +=  "&Tags=" + paramsFilter.strHotelTypeCheck;
      }
      if(paramsFilter.strFilterName && paramsFilter.strFilterName.length >0){
        se.searchhotel.stringFilterName = paramsFilter.strFilterName;
      }
      se.modalCtrl.dismiss({strFilter: paramsFilter.strFilter , dataFilter : this.dataafterfilter});
    },50)
    
  }

  /**
   * Lọc list dữ liệu theo khung giờ hoạt động để đếm số địa điểm
   * @param data list dữ liệu
   */
  filterOpenHour(data, workinghoursId){
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
            return (se.getTimeFilter(fromTimeFirst, toTimeFirst, workinghoursId) || se.getTimeFilter(fromTimeSecond, toTimeSecond, workinghoursId) );
          }
          else{
            let fromTime = wk0.timeFrom.replace(':','');
            let toTime = wk0.timeTo.replace(':','');
            return se.getTimeFilter(fromTime, toTime, workinghoursId);
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
            return (se.getTimeFilter(fromTimeFirst, toTimeFirst, workinghoursId) || se.getTimeFilter(fromTimeSecond, toTimeSecond, workinghoursId) );
          }
          else{
            let fromTime = wk1.timeFrom.replace(':','');
            let toTime = wk1.timeTo.replace(':','');
            return se.getTimeFilter(fromTime, toTime, workinghoursId);
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
          return (se.getTimeFilter(fromTimeFirst, toTimeFirst, workinghoursId) || se.getTimeFilter(fromTimeSecond, toTimeSecond, workinghoursId) );
        }
        else{
          let fromTime = el.workingHours[0].timeFrom.replace(':','');
          let toTime = el.workingHours[0].timeTo.replace(':','');
          return se.getTimeFilter(fromTime, toTime, workinghoursId);
        }
      }
      
    })
  }

  getTimeFilter(fromTime, toTime,workinghoursId){
    var se = this;
    let minFromTime ='';
    let maxToTime='';
    minFromTime = se.getMinFromTime(workinghoursId);
    maxToTime = se.getMaxToTime(workinghoursId);

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

  /**
   * Tính khoảng cách giữa các điểm so với vị trí hiện tại
   * @rest: item cần sort
   * @sortColumn: tên cột dữ liệu sort
   */
  calculateDistanceMarker(data) : Promise<any>{
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

  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      duration:1000
    });
    this.loader.present();
  }

}
