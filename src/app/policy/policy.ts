import { Component,OnInit, NgZone } from '@angular/core';
import { NavController,Platform } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import * as request from 'requestretry';
/**
 * Generated class for the PolicyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-policy',
  templateUrl: 'policy.html',
  styleUrls: ['policy.scss'],
})
export class PolicyPage implements OnInit{
  Name;
  cin; cout;
  HotelPolicies;
  HotelID;
  constructor(public platform: Platform,public navCtrl: NavController, public gf: GlobalFunction,private activatedRoute:ActivatedRoute,public zone: NgZone) {
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
    gf.googleAnalytion('policy','load','');
  }

  ngOnInit(){

  }

  getdata() {
    // this.http.post(C.urls.baseUrl.urlPost +"/mhoteldetail/" + this.HotelID + "", "")
    //   .toPromise()
    //   .then(data => {
    //     let jsondata = data.json();
    //     this.Name = jsondata.Name;
    //     this.cin = jsondata.CheckinTime;
    //     this.cout = jsondata.CheckoutTime;
    //     this.HotelPolicies = jsondata.HotelPolicies
    //     // for (let i = 0; i < this.HotelPolicies.length; i++) {
    //     //   this.HotelPolicies[i].PolicyDes=this.strip_html_tags(htmlDecode(this.HotelPolicies[i].PolicyDes))
    //     // }
    //   })
    //   .catch(
    //     error => {
    //     console.log("reg error", error)
    //     if (error) {
    //       error.page="policy";
    //       error.func="getdata";
    //       C.writeErrorLog(error);
    //     };
    //   }
    //   );
    var se=this;
    let url = C.urls.baseUrl.urlPost +"/mhoteldetail/"+this.HotelID;
    var options = {
      method: 'POST',
      url: url,
      timeout: 180000, maxAttempts: 5, retryDelay: 2000,
    };
    request(options, function (error, response, body) {
      if(response.statusCode != 200){
        var objError ={
            page: "policy",
            func: "getdata",
            message : response.statusMessage,
            content : response.body,
            type: "warning",
            param: JSON.stringify(options)
          };
        C.writeErrorLog(objError,response);
      }
      if (error) {
        error.page="policy";
        error.func="loaddata";
        error.param = JSON.stringify(options);
        C.writeErrorLog(objError,response);
      }
      if(response.statusCode== 200){
        let jsondata = JSON.parse(body);
        
        se.zone.run(()=>{
          se.Name = jsondata.Name;
          se.cin = jsondata.CheckinTime;
          se.cout = jsondata.CheckoutTime;
          se.HotelPolicies = jsondata.HotelPolicies
        })
       
      }
    })
  }
  goback(){
    this.navCtrl.navigateBack('/hoteldetail/'+this.HotelID);
    //this.navCtrl.navigateBack(['/app/tabs/hoteldetail/'+this.HotelID]);
  }

  strip_html_tags(str) {
    if ((str === null) || (str === ''))
      return false;
    else
      str = str.toString();
    return str.replace(/<[^>]*>/g, '');
  }

}
