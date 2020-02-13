import { Bookcombo } from './../providers/book-service';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-combocarchangeplace',
  templateUrl: './combocarchangeplace.page.html',
  styleUrls: ['./combocarchangeplace.page.scss'],
})
export class CombocarchangeplacePage implements OnInit {
  depPlace; retPlace;isDepart
  public tabplace: string = "placed";
  arrplaced = [];
  arrplacet = [];
  activeTap=1;
  placed=[];
  placet=[];
  // arrplaceretd = [];
  // arrplacerett = [];
  constructor(public bookCombo: Bookcombo, public modalCtrl: ModalController) {
    console.log("test");
    this.depPlace = this.bookCombo.ComboDetail.comboDetail.departurePlace;
    this.retPlace = this.bookCombo.ComboDetail.arrivalName;
    this.isDepart=this.bookCombo.isDepart;
    if (this.isDepart=='0') {
      var cod=0;
      var cot=0;
      this.arrplaced = this.bookCombo.arrplacedepd;
      this.arrplacet = this.bookCombo.arrplacedept;
      for (var i = 0; i < this.arrplaced.length; i++) {
        if (this.bookCombo.idpointdepd||this.bookCombo.idpointdepd=='0') {
          if (this.bookCombo.idpointdepd==this.arrplaced[i].id) {
            var ischeck=true;
            this.arrplaced[i].ischeck=ischeck;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.placed.push(this.arrplaced[i]);
            cod=1;
            break;
          }
          else{
            var ischeck=false;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplaced[i].ischeck=ischeck;
          }
        }
        else
        {
          cod=1;
          if (i==0) {
            var ischeck=true;
            this.arrplaced[i].ischeck=ischeck;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          }
          else{
            var ischeck=false;
            this.arrplaced[i].ischeck=ischeck;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          }
        }
      
      
      }
      for (var i = 0; i < this.arrplacet.length; i++) {
        if (this.bookCombo.idpointdept||this.bookCombo.idpointdept=='0') {
          if (this.bookCombo.idpointdept== this.arrplacet[i].id) {
            var ischeck=true;
            this.arrplacet[i].ischeck=ischeck;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.placed.push(this.arrplacet[i]);
            cot=1;
            break;
          }
          else{
            var ischeck=false;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacet[i].ischeck=ischeck;
          }
        }
        else
        {
          cot=1;
          if (i==0) {
            var ischeck=true;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1."); 
            this.arrplacet[i].ischeck=ischeck;
          }
          else {
            var ischeck=false;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacet[i].ischeck=ischeck;
          }
        }
     
      }
      if (cod==0) {
        var ischeck=true;
        this.arrplaced[0].surchargeshow=this.arrplaced[0].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.arrplaced[0].ischeck=ischeck;
      }
      if (cot==0) {
        var ischeck=true;
        this.arrplacet[0].surchargeshow=this.arrplacet[0].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.arrplacet[0].ischeck=ischeck;
      }
    }
    else{
      var cod=0;
      var cot=0;
      this.arrplaced = this.bookCombo.arrplaceretd;
      this.arrplacet = this.bookCombo.arrplacerett;
      for (var i = 0; i < this.arrplaced.length; i++) {
        if (this.bookCombo.idpointretd||this.bookCombo.idpointretd=='0') {
          if (this.bookCombo.idpointretd== this.arrplaced[i].id) {
            var ischeck=true;
            this.arrplaced[i].ischeck=ischeck;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.placed.push(this.arrplaced[i]);
            cod=1;
            break;
          }
          else{
            var ischeck=false;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplaced[i].ischeck=ischeck;
          }
        }
        else
        {
          if (i==0) {
            var ischeck=true;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplaced[i].ischeck=ischeck;
          }
          else{
            var ischeck=false;
            this.arrplaced[i].surchargeshow=this.arrplaced[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplaced[i].ischeck=ischeck;
          }
        }
      
      
      }
      for (var i = 0; i < this.arrplacet.length; i++) {
        if (this.bookCombo.idpointrett||this.bookCombo.idpointrett=='0') {
          if (this.bookCombo.idpointrett== this.arrplacet[i].id) {
            var ischeck=true;
            this.arrplacet[i].ischeck=ischeck;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.placet.push(this.arrplacet[i]);
            cot=1;
            break;
          }
          else{
            var ischeck=false;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacet[i].ischeck=ischeck;
          }
        }
        else
        {
          cot=1;
          if (i==0) {
            var ischeck=true;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacet[i].ischeck=ischeck;
          }
          else {
            var ischeck=false;
            this.arrplacet[i].surchargeshow=this.arrplacet[i].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
            this.arrplacet[i].ischeck=ischeck;
          }
        }
      }
      if (cod==0) {
        var ischeck=true;
        this.arrplaced[0].surchargeshow=this.arrplaced[0].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.arrplaced[0].ischeck=ischeck;
      }
      if (cot==0) {
        var ischeck=true;
        this.arrplacet[0].surchargeshow=this.arrplacet[0].surcharge.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.arrplacet[0].ischeck=ischeck;
      }
    }
  }
  //Chọn tap
  Selectdepart()
  {
    this.activeTap=1;
    if (this.placed.length>0) {
      for (let i = 0; i < this.arrplaced.length; i++) {
        if (this.arrplaced[i].id==this.placed[0].id) {
          this.arrplaced[i].ischeck=true;
        }
        else{
          this.arrplaced[i].ischeck=false;
        }
      }
    }
   
  }
  Selectreturn()
  {
    this.activeTap=2;
    if (this.placet.length>0) {
      for (let i = 0; i < this.arrplacet.length; i++) {
        if (this.arrplacet[i].id==this.placet[0].id) {
          this.arrplacet[i].ischeck=true;
        }
        else{
          this.arrplacet[i].ischeck=false;
        }
      }
    }
   
  }
  //chọn nơi đón
  itemrddep(item)
  {
    this.placed = [];
    this.placed.push(item);
    this.activeTap=2;
    this.tabplace='placet';
  }
  //chọn nơi trả
  itemrdret(item)
  {
    this.placet = [];
    this.placet.push(item);
    this.modalCtrl.dismiss({ isdepart: this.isDepart, placed: this.placed,placet: this.placet });
  }
  ngOnInit() {
  }
  goback() {
    this.modalCtrl.dismiss({ isdepart: this.isDepart, placed: this.placed,placet: this.placet });
  }
  // next()
  // {
  //   this.modalCtrl.dismiss({ isdepart: this.isDepart, placed: this.placed,placet: this.placet });
  // }
}
