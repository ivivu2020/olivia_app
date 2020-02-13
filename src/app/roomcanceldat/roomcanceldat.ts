import { Component, OnInit } from '@angular/core';
import {  NavController, NavParams,Platform } from '@ionic/angular';
import { GlobalFunction } from '../providers/globalfunction';
/**
 * Generated class for the RoomcanceldatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'app-roomcanceldat',
  templateUrl: 'roomcanceldat.html',
  styleUrls: ['roomcanceldat.scss'],
})
export class RoomcanceldatPage implements OnInit{

  public roomInfo = null;
  public totalPrice = '';
  constructor(public platform: Platform,public navCtrl: NavController, public navParam: NavParams,public gf: GlobalFunction){
      if(navParam.data.roomInfo){
          this.roomInfo = navParam.data.roomInfo;
          //this.totalPrice = navParam.data.roomInfo.Penaltys[0].Penalty_Val_TA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
     
        //google analytic
        gf.googleAnalytion('roomcanceldat','load','');
  }
  ngOnInit() {
  }
  goback(){
      var self = this;
      self.navCtrl.back();
  }
  cancel(){
      var self = this;
      self.navCtrl.back();
  }

}
