import { Component,OnInit } from '@angular/core';
import {  NavController, Platform } from '@ionic/angular';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { RoomInfo } from '../providers/book-service';
@Component({
  selector: 'app-roomcancel',
  templateUrl: 'roomcancel.html',
  styleUrls: ['roomcancel.scss'],
})
    
export class RoomCancelPage implements OnInit{
    public roomInfo = null;
    public totalPrice = '';roomcancelhbed;textcancel
    constructor(public navCtrl: NavController,public gf: GlobalFunction,public Roomif:RoomInfo){
        this.roomcancelhbed=this.Roomif.roomcancelhbed;
        this.textcancel=this.Roomif.textcancel;
        if(this.gf.getParams('roomInfo')){
            this.roomInfo = gf.getParams('roomInfo');
            //this.totalPrice = navParam.data.roomInfo.Penaltys[0].Penalty_Val_TA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            //this.roomInfo.PenaltyDescription = this.roomInfo.PenaltyDescription ? this.roomInfo.PenaltyDescription.replace("<p>","").replace("</p>","") : "";
        }
       
        //google analytic
        gf.googleAnalytion('roomcancel','load','');
    }
    ngOnInit(){

    }
    goback(){
        this.navCtrl.back();
    }
    cancel(){
        this.navCtrl.back();
    }
}