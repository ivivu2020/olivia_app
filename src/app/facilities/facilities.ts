import { Component, OnInit, NgZone } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import * as request from 'requestretry';
/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-facilities',
  templateUrl: 'facilities.html',
  styleUrls: ['facilities.scss'],
})
export class FacilitiesPage implements OnInit{
  Name;
  HotelFacilities;
  HotelID;
  urlpath = C.urls.baseUrl.urlPost;
  constructor(public platform: Platform,public navCtrl: NavController, private gf: GlobalFunction, private activatedRoute:ActivatedRoute,public zone: NgZone) {
    this.HotelID = this.activatedRoute.snapshot.paramMap.get('id');
    this.Name = this.activatedRoute.snapshot.paramMap.get('name');
    this.getdata();
    //Xử lý nút back của dt
    this.platform.ready().then(() => {
      this.platform.backButton.subscribe(() => {
        this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
      })
    })
    //google analytic
    gf.googleAnalytion('facilities','load','');
  }

  ngOnInit(){

  }

  goback(){
    this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.HotelID]);
  }
  getdata() {
    var se = this;
    var options = {
      method: 'POST',
      url: se.urlpath + "/mhoteldetail/" + se.HotelID,
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    };
    request(options, function (error, response, body) {
      if(response.statusCode != 200){
        var objError ={
            page: "facilities",
            func: "getdata",
            message : response.statusMessage,
            content : response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page="facilities";
        error.func="loaddata";
        error.param = JSON.stringify(options);
        C.writeErrorLog(objError,response);
      }
      if(response.statusCode== 200){
        let jsondata = JSON.parse(body);
        se.zone.run(()=>{
          se.Name = jsondata.Name;
          se.HotelFacilities = jsondata.HotelFacilities
        })
       
      }
    })
  }
}
