import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../providers/auth-service';
import * as request from 'requestretry';
import { Storage } from '@ionic/storage';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import * as $ from 'jquery';
import { NavController, ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-experienceprofile',
  templateUrl: './experienceprofile.page.html',
  styleUrls: ['./experienceprofile.page.scss'],
})
export class ExperienceProfilePage implements OnInit {

  slide:any;
  profilename = "Quỷ Lệ";
  constructor(private storage: Storage, private zone: NgZone,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private gf: GlobalFunction) { }

  ngOnInit() {
  }

  goback(){
    this.navCtrl.back();
  }

  ionViewWillEnter(){
    var se = this;
    if(se.gf.getParams('experienceProfile')){
      se.slide = se.gf.getParams('experienceProfile');
    }
  }

}
