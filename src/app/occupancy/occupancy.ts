import { Component,OnInit, NgZone } from '@angular/core';
import { NavController,Platform, ModalController, ActionSheetController, PickerController } from '@ionic/angular';
import { SearchHotel } from '../providers/book-service';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ValueGlobal } from './../providers/book-service';
import * as $ from 'jquery';
/**
 * Generated class for the OccupancyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-occupancy',
  templateUrl: 'occupancy.html',
  styleUrls: ['occupancy.scss'],
})
export class OccupancyPage implements OnInit {
  adults = 2;
  child = 0;
  room = 1;
  arrchild = [];
  public numage;
  ischeckadults = true;
  ischeckchild = false;
  ischeckroom = false;
  cout; cin;
  ComboDayNum;namecombo;Address;imghotel;namehotel;
  showpopupfromrequestcombo = false;ChildAgeTo
  constructor(public platform: Platform,public navCtrl: NavController, public modalCtrl: ModalController,public valueGlobal:ValueGlobal,
    public searchhotel: SearchHotel, public gf: GlobalFunction,
    public actionsheetCtrl: ActionSheetController,
    public pickerController: PickerController,
    private zone: NgZone) {
    if (searchhotel.adult) {
      this.adults = searchhotel.adult;
    }
    if (searchhotel.child) {
      this.child = searchhotel.child;
    }
    if (searchhotel.roomnumber) {
      this.room = searchhotel.roomnumber;
    }
    if (searchhotel.ChildAgeTo) {
      this.ChildAgeTo = searchhotel.ChildAgeTo;
    }
    else
    {
      this.ChildAgeTo = 16;
    }
    if (searchhotel.arrchild) {
      searchhotel.arrchild.forEach(element => {
        this.arrchild.push(element);
      });
    }
    this.showpopupfromrequestcombo = this.gf.getParams('requestcombo');
    
    //google analytic
    gf.googleAnalytion('occupancy','load','');
  }

  ngOnInit() {
   
  }
  closeModal() {
    this.searchhotel.adult=this.adults;
    this.searchhotel.child=this.child;
    this.searchhotel.roomnumber=this.room;
    this.searchhotel.arrchild= this.arrchild;

    if(this.showpopupfromrequestcombo){
      this.modalCtrl.dismiss();
    }else{
      this.navCtrl.back();
    }
  }
  plusadults() {
    if(this.adults < 50){
      this.adults++;
    }
    
    if (this.adults == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }
  }
  minusadults() {
    if (this.adults > 1) {
      this.adults--;
    }
    if (this.adults == 1) {
      this.ischeckadults = false;
    }
    else {
      this.ischeckadults = true;
    }
    
  }
  pluschild() {
    if(this.child < 12){
      this.child++;
      var arr = { text: 'Trẻ em' + ' ' + this.child, numage: "7" }
      this.arrchild.push(arr);
    }
    if (this.child == 0) {
      this.ischeckchild = false;
    }
    else {
      this.ischeckchild = true;
    }
  }
  minuschild() {

    if (this.child > 0) {
      this.child--;
      this.arrchild.splice(this.arrchild.length - 1, 1);
    }
    if (this.child == 0) {
      this.ischeckchild = false;
      this.arrchild.splice(this.arrchild.length - 1, 1);
    }
    else {
      this.ischeckchild = true;
    }
  }
  selectclick(event, text) {
    for (let i = 0; i < this.arrchild.length; i++) {
      if (this.arrchild[i].text == text) {
        this.zone.run(()=>{
          this.arrchild[i].numage = event;
        })
        
        break;
      }

    }
  }

  plusroom() {
    if(this.room <9){
      this.room++;
      if(this.adults < this.room){
        this.adults = this.room;
      }
    }

    if (this.room == 1) {
      this.ischeckroom = false;
    } else {
      this.ischeckroom = true;
    }
  }
  minusroom() {

    if (this.room > 1) {
      this.room--;
    }
    if (this.room == 1) {
      this.ischeckroom = false;
    } else {
      this.ischeckroom = true;
    }
  }
  data()
  {
    this.valueGlobal.checksendcb=true;
    this.searchhotel.adult=this.adults;
    this.searchhotel.child=this.child;
    this.searchhotel.roomnumber=this.room;
    this.searchhotel.arrchild= this.arrchild;
    console.log(this.searchhotel.arrchild);
    if(this.showpopupfromrequestcombo){
      this.gf.setParams(false,'requestcombo');
      this.modalCtrl.dismiss();
    }else{
      this.navCtrl.back();
    }
    
  }
  ionViewDidLoad() {
    let elements = document.querySelectorAll(".tabbar");

    if (elements != null) {
      Object.keys(elements).map((key) => {
        elements[key].style.display = 'none';
      });
    }
  }

  async selectAge(textchild){
    var se =this;
   
    var columnOptions =['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];

    const picker = await this.pickerController.create({
      columns: this.getColumns(1, 16, columnOptions, textchild),
      cssClass: 'action-sheets-select-age',
      buttons: [
        {
          text: textchild,
          cssClass: 'picker-header',
          handler: (value) => {
           return false;
          }
        }
      ],
    });

    $('.picker-wrapper.sc-ion-picker-ios').append('<div class="div-button"><button (click)="getPickerValue()" ion-button round outline class="button button-done">Xong</button></div>');
    $('.action-sheets-select-age .button-done').on('click', ()=>{
      let value = $('.picker-opt.picker-opt-selected')[0].innerText;
      se.selectclick(value, textchild);
      picker.dismiss();
    })
    await picker.present();
  }

  getColumns(numColumns, numOptions, columnOptions, textchild) {
    let columns = [];
    for (let i = 0; i < numColumns; i++) {
      columns.push({
        name: textchild,
        options: this.getColumnOptions(i, numOptions, columnOptions)
      });
    }

    return columns;
  }

  getColumnOptions(columnIndex, numOptions, columnOptions) {
    let options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: columnOptions[i],
        value: i
      })
    }

    return options;
  }

  getPickerValue(){
    var se = this;
    
  }
}