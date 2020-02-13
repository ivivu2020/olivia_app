import { Bookcombo } from './../providers/book-service';

import { SearchHotel } from 'src/app/providers/book-service';
import { Component, NgZone, ViewChild, OnInit } from '@angular/core';
import { NavController, ModalController, AlertController, Platform, LoadingController, ToastController } from '@ionic/angular';
import { Booking, ValueGlobal } from '../providers/book-service';
import { Storage } from '@ionic/storage';
import { C } from '../providers/constants';
import { GlobalFunction } from '../providers/globalfunction';
import * as request from 'requestretry';
import * as moment from 'moment';
import * as $ from 'jquery';

/**
 * Generated class for the FacilitiesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-flightcomboadddetails',
  templateUrl: 'flightcomboadddetails.html',
  styleUrls: ['flightcomboadddetails.scss'],
})
export class FlightComboAddDetailsPage implements OnInit {
  cin; BirthDay; ischecklugage = false; PriceAvgPlusTAStr; PriceAvgPlusTA; PriceAvgPlusTAOld
  showLuggage = false; ho; ten
  arrlugage = []; hoten; phone; arradult = []; datecin; objectFlight; airLineLuggageDepart = [];; airLineLuggageReturn = [];
  loader:any
  constructor(public platform: Platform, private toastCtrl: ToastController, public valueGlobal: ValueGlobal, public navCtrl: NavController, public zone: NgZone,
    public searchhotel: SearchHotel, private booking: Booking, private bookcombo: Bookcombo, public storage: Storage, public alertCtrl: AlertController, public value: ValueGlobal, public modalCtrl: ModalController, public gf: GlobalFunction, public loadingCtrl: LoadingController) {
    var id = 1;
    let num = 1;
    //this.gf.googleAnalytion('flightcomboadddetails', 'add_payment_info', '');
    // for (let i = 0; i < searchhotel.adult; i++) {
    //   let number = i + 1;
    //   var item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0 }
    //   this.arradult.push(item);
    //   id++;
    // }
    // if (searchhotel.arrchild) {
    //   for (let i = 0; i < searchhotel.arrchild.length; i++) {
    //     if (searchhotel.arrchild[i].numage == "<1") {
    //       var item = { id: id, text: "Trẻ em", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0 };
    //     }
    //     else if (Number(searchhotel.arrchild[i].numage) < 2) {
    //       var item = { id: id, text: "Trẻ em", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0 };
    //     }
    //     else {
    //       var item = { id: id, text: "Trẻ em", PassengerType: 1, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0 };
    //     }
    //     this.arradult.push(item);
    //     id++;
    //   }
    // }
    this.objectFlight = this.gf.getParams('flightcombo');
    this.PriceAvgPlusTAStr = this.objectFlight.HotelBooking.TotalPrices;
    this.PriceAvgPlusTA = this.objectFlight.HotelBooking.TotalPrices.replace(/\./g, '').replace(/\,/g, '');
    this.PriceAvgPlusTAOld = this.objectFlight.HotelBooking.TotalPrices.replace(/\./g, '').replace(/\,/g, '');
    this.PriceAvgPlusTAStr = this.PriceAvgPlusTAStr.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
    this.airLineLuggageDepart = this.objectFlight.airLineLuggageDepart;
    this.airLineLuggageReturn = this.objectFlight.airLineLuggageReturn;
    if (this.airLineLuggageDepart.length > 0 || this.airLineLuggageReturn.length > 0) {
      this.ischecklugage = true;
    }

    this.storage.get('infocus').then(infocus => {
      var item;
      if (infocus) {
        if (infocus.ho && infocus.ten) {
          this.hoten = infocus.ho + ' ' + infocus.ten;
        } else {
          if (infocus.ho) {
            this.hoten = infocus.ho;
          }
          else if (infocus.ten) {
            this.hoten = infocus.ten;
          }
        }
        this.phone = infocus.phone;
        if (this.bookcombo.arrPassengers.length > 0) {
          this.arradult = this.bookcombo.arrPassengers;
        } else {
          let number
          for (let i = 0; i < searchhotel.adult; i++) {
            number = i + 1;
            if (i == 0) {
              if (infocus.ho && infocus.ten) {
                item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: infocus.ten, LastName: infocus.ho, BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: infocus.ho + ' ' + infocus.ten }
              } else {
                if (infocus.ho) {
                  item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: '', LastName: infocus.ho, BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: infocus.ho }
                }
                else if (infocus.ten) {
                  item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: infocus.ten, LastName: '', BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: infocus.ten }
                }
              }
            } else {
              item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" }

            }
            this.arradult.push(item);
            id++;
          }
          if (searchhotel.arrchild) {
            for (let i = 0; i < searchhotel.arrchild.length; i++) {
              if (Number(searchhotel.arrchild[i].numage) > 11) {
                number = number + 1;
                item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" }
                this.arradult.push(item);
                id++;
              }
              if (searchhotel.arrchild[i].numage == "<1") {
                item = { id: id, text: "Trẻ em", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" };
                this.arradult.push(item);
                id++;
              }
              else if (Number(searchhotel.arrchild[i].numage) < 2) {
                item = { id: id, text: "Trẻ em", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" };
                this.arradult.push(item);
                id++;
              }
              else if (Number(searchhotel.arrchild[i].numage) < 12) {
                item = { id: id, text: "Trẻ em", PassengerType: 1, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" };
                this.arradult.push(item);
                id++;
              }
            }
          }
        }
      } else {
        if (this.bookcombo.hoten) {
          this.hoten = this.bookcombo.hoten;
        }
        if (this.bookcombo.phone) {
          this.phone = this.bookcombo.phone;
        }
        if (this.bookcombo.arrPassengers.length > 0) {
          this.arradult = this.bookcombo.arrPassengers;
        } else {
          let number
          for (let i = 0; i < searchhotel.adult; i++) {
            number = i + 1;
            item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" }
            this.arradult.push(item);
            id++;
          }
          if (searchhotel.arrchild) {
            for (let i = 0; i < searchhotel.arrchild.length; i++) {
              if (Number(searchhotel.arrchild[i].numage) > 11) {
                number = i + 1;
                item = { id: id, text: "Người lớn " + number + "", PassengerType: 0, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" }
                this.arradult.push(item);
                id++;
              }
              if (searchhotel.arrchild[i].numage == "<1") {
                item = { id: id, text: "Trẻ em", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" };
                this.arradult.push(item);
                id++;
              }
              else if (Number(searchhotel.arrchild[i].numage) < 2) {
                item = { id: id, text: "Trẻ em", PassengerType: 2, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" };
                this.arradult.push(item);
                id++;
              }
              else if (Number(searchhotel.arrchild[i].numage) < 12) {
                item = { id: id, text: "Trẻ em", PassengerType: 1, FirstName: "", LastName: "", BirthDay: null, Gender: null, Baggage: 0, ReturnBaggage: 0, hoten: "" };
                this.arradult.push(item);
                id++;
              }
            }
          }
        }
      }
      for (let i = 0; i < this.arradult.length; i++) {
        if (this.arradult[i].PassengerType != 2) {
          var item1 = { id: this.arradult[i].id, text: "Ký gửi khách " + num + "", weight: 0, amount: 0, amountstr: 0, weightreturn: 0, amountreturn: 0, amountreturnstr: 0, index: 0, indexreturn: 0 };
          this.arrlugage.push(item1);
          num++;
        }
      }
    })
  }

  ngOnInit() {
  }

  goback() {
    this.bookcombo.arrPassengers = this.arradult;
    this.bookcombo.arrlugage = this.arrlugage;
    this.bookcombo.hoten = this.hoten;
    this.bookcombo.phone = this.phone;
    // if (this.showLuggage) {
    //   this.bookcombo.totalpricecombo=this.PriceAvgPlusTA;
    // }
    // this.bookcombo.ischecklugage=this.showLuggage;
    this.navCtrl.back();
  }
  /** Mua thêm hành lý
   * PDANH 24/04/2018
   */
  buyLuggage() {
    this.zone.run(() => {
      this.showLuggage = !this.showLuggage;
      if (this.showLuggage) {
        this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTA;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      else {
        this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTAOld;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTAOld.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    })

  }

  minusluggedepart(weight, index) {
    this.zone.run(() => {
      if (weight != 0) {
        var priceold = this.arrlugage[index].amount;
        if (this.arrlugage[index].index != 0) {
          this.arrlugage[index].weight = this.airLineLuggageDepart[this.arrlugage[index].index - 1].weight;
          this.arrlugage[index].amount = this.airLineLuggageDepart[this.arrlugage[index].index - 1].amount;
          this.arrlugage[index].amountstr = this.airLineLuggageDepart[this.arrlugage[index].index - 1].amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].index = this.arrlugage[index].index - 1;
        }
        else {
          this.arrlugage[index].weight = 0;
          this.arrlugage[index].amount = 0;
          this.arrlugage[index].amountstr = "0";
        }
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amount) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    });
  }
  addluggedepart(weight, index) {
    this.zone.run(() => {
      var priceold = this.arrlugage[index].amount;
      if (weight == 0) {
        this.arrlugage[index].weight = this.airLineLuggageDepart[0].weight;
        this.arrlugage[index].amount = this.airLineLuggageDepart[0].amount;
        this.arrlugage[index].amountstr = this.airLineLuggageDepart[0].amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amount) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      else {
        if (this.arrlugage[index].index < this.airLineLuggageDepart.length - 1) {
          this.arrlugage[index].weight = this.airLineLuggageDepart[this.arrlugage[index].index + 1].weight;
          this.arrlugage[index].amount = this.airLineLuggageDepart[this.arrlugage[index].index + 1].amount;
          this.arrlugage[index].amountstr = this.airLineLuggageDepart[this.arrlugage[index].index + 1].amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].index = this.arrlugage[index].index + 1;
          this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amount) - priceold;
          this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
      }
    });
  }
  minusluggereturn(weight, index) {
    this.zone.run(() => {
      if (weight != 0) {
        var priceold = this.arrlugage[index].amountreturn;
        if (this.arrlugage[index].indexreturn != 0) {
          this.arrlugage[index].weightreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].weight;
          this.arrlugage[index].amountreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].amount;
          this.arrlugage[index].amountreturnstr = this.airLineLuggageReturn[this.arrlugage[index].indexreturn - 1].amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].indexreturn = this.arrlugage[index].indexreturn - 1;
        }
        else {
          this.arrlugage[index].weightreturn = 0;
          this.arrlugage[index].amountreturn = 0;
          this.arrlugage[index].amountreturnstr = "0";
        }
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amountreturn) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
    });
  }
  addluggereturn(weight, index) {
    this.zone.run(() => {
      var priceold = this.arrlugage[index].amountreturn;
      if (weight == 0) {
        this.arrlugage[index].weightreturn = this.airLineLuggageReturn[0].weight;
        this.arrlugage[index].amountreturn = this.airLineLuggageReturn[0].amount;
        this.arrlugage[index].amountreturnstr = this.airLineLuggageReturn[0].amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amountreturn) - priceold;
        this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
      }
      else {
        if (this.arrlugage[index].indexreturn < this.airLineLuggageReturn.length - 1) {
          this.arrlugage[index].weightreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].weight;
          this.arrlugage[index].amountreturn = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].amount;
          this.arrlugage[index].amountreturnstr = this.airLineLuggageReturn[this.arrlugage[index].indexreturn + 1].amount.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
          this.arrlugage[index].indexreturn = this.arrlugage[index].indexreturn + 1;
          this.PriceAvgPlusTA = Number(this.PriceAvgPlusTA) + Number(this.arrlugage[index].amountreturn) - priceold;
          this.PriceAvgPlusTAStr = this.PriceAvgPlusTA.toLocaleString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        }
      }
    });

  }
  next() {
    var co = 0;
    if (this.hoten) {
      var checktext = this.hasWhiteSpace(this.hoten);
      if (checktext) {
        if (this.phone) {
          if (this.phonenumber(this.phone)) {
            //check người lớn
            for (let i = 0; i < this.arradult.length; i++) {
              var checktext = this.hasWhiteSpace(this.arradult[i].hoten);
              if (!checktext) {
                co = 1;
                break;
              }
              if (!this.arradult[i].hoten) {
  
                co = 1;
                break;
              }
              else if (!this.arradult[i].Gender) {
                co = 3;
                break;
              }
              if (this.arradult[i].PassengerType != 0) {
                if (!this.arradult[i].BirthDay) {
                  co = 2;
                  break;
                }
              }
            }
            //check trẻ em
            // if (this.arrchild.length > 0) {
            //   for (let i = 0; i < this.arrchild.length; i++) {
            //     if (!this.arrchild[i].FirstName) {
            //       co = 1;
            //       break;
            //     }
            //     else if (!this.arrchild[i].LastName) {
            //       co = 1;
            //       break;
            //     }
            //     else if (!this.arrchild[i].BirthDay) {
            //       co = 2;
            //       break;
            //     }
            //     else if (!this.arrchild[i].Gender) {
            //       co = 3;
            //       break;
            //     }
            //   }
            // }
            if (co == 0) {
              for (let i = 0; i < this.arradult.length; i++) {
                if (this.arradult[i].BirthDay) {
                  this.arradult[i].BirthDay = moment(this.arradult[i].BirthDay).format('YYYY-MM-DD');
                }
                if (this.showLuggage) {
                  for (let j = 0; j < this.arrlugage.length; j++) {
                    if (this.arradult[i].id == this.arrlugage[j].id) {
                      this.arradult[i].Baggage = this.arrlugage[j].weight;
                      this.arradult[i].ReturnBaggage = this.arrlugage[j].weightreturn;
                      break
                    }
                  }
                } else {
                  this.arradult[i].Baggage = 0;
                  this.arradult[i].ReturnBaggage = 0;
                }
              }
              if (this.showLuggage) {
                this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTA;
              }
              else {
                this.objectFlight.HotelBooking.TotalPrices = this.PriceAvgPlusTAOld;
              }
              if (this.bookcombo.ischeckbtnpromo) {
                this.objectFlight.HotelBooking.TotalPrices = Number(this.objectFlight.HotelBooking.TotalPrices)+Number(this.bookcombo.discountpromo);
              }
              var arrPassengers = []
              for (let i = 0; i < this.arradult.length; i++) {
                var item;
                var texthoten = this.arradult[i].hoten.split(' ');
                if (texthoten.length > 2) {
                  let name = '';
                  for (let j = 1; j < texthoten.length; j++) {
                    if (j == 1) {
                      name += texthoten[j];
                    } else {
                      name += ' ' + texthoten[j];
                    }
                  }
                  item = { PassengerType: this.arradult[i].PassengerType, FirstName: name, LastName: texthoten[0], BirthDay: this.arradult[i].BirthDay, Gender: this.arradult[i].Gender, Baggage: this.arradult[i].Baggage, ReturnBaggage: this.arradult[i].ReturnBaggage };
                } else if (texthoten.length > 1) {
                  item = { PassengerType: this.arradult[i].PassengerType, FirstName: texthoten[1], LastName: texthoten[0], BirthDay: this.arradult[i].BirthDay, Gender: this.arradult[i].Gender, Baggage: this.arradult[i].Baggage, ReturnBaggage: this.arradult[i].ReturnBaggage };
                }
                else if (texthoten.length == 1) {
                  item = { PassengerType: this.arradult[i].PassengerType, FirstName: "", LastName: texthoten[0], BirthDay: this.arradult[i].BirthDay, Gender: this.arradult[i].Gender, Baggage: this.arradult[i].Baggage, ReturnBaggage: this.arradult[i].ReturnBaggage };
                }
                arrPassengers.push(item);
              }
              var texthoten = this.hoten.split(' ');
              if (texthoten.length > 2) {
                let name = '';
                for (let j = 1; j < texthoten.length; j++) {
                  if (j == 1) {
                    name += texthoten[j];
                  } else {
                    name += ' ' + texthoten[j];
                  }
                }
                this.ho = texthoten[0]; this.ten = name;
              } else if (texthoten.length > 1) {
                this.ho = texthoten[0]; this.ten = texthoten[1];
              }
              else if (texthoten.length == 1) {
                this.ho = texthoten[0]; this.ten = "";
              }
              var Contact = { FirstName: this.ten, LastName: this.ho, Email: this.booking.CEmail, MobileNumber: this.phone }
              var Passengers = { Passengers: arrPassengers, Contact: Contact, UserToken: '', NoteCorp: '' }
              this.objectFlight.FlightBooking.passengerModel = Passengers;
              //update thông tin
              this.objectFlight.HotelBooking.CName = this.hoten.trim();
              this.objectFlight.HotelBooking.CEmail = this.booking.CEmail;
              this.objectFlight.HotelBooking.CPhone = this.phone;
  
              this.objectFlight.HotelBooking.LeadingName = this.hoten.trim();
              this.objectFlight.HotelBooking.LeadingEmail = this.booking.CEmail;
              this.objectFlight.HotelBooking.LeadingPhone = this.phone;
  
              this.objectFlight.HotelBooking.CTitle = "Ms";
              this.objectFlight.HotelBooking.LeadingNationality = 0;
              var search = { FlightBooking: this.objectFlight.FlightBooking, HotelBooking: this.objectFlight.HotelBooking };
              // console.log(JSON.stringify(search));
              this.presentLoading();
              var settings = {
                "async": true,
                "crossDomain": true,
                "url": C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateComboBooking',
                "method": "POST",
                "headers": {
                  "content-type": "application/x-www-form-urlencoded"
                },
                "data": $.param(search)
              }
              console.log(JSON.stringify(search));
              var se = this;
              $.ajax(settings).done(function (response) {
                console.log(response);
                if (response.Error) {
                  var error = {
                    page: "flightcomboadddetails",
                    func: "CreateComboBooking",
                    message: response.Error,
                    content: response.body,
                    type: "warning",
                    param: JSON.stringify(settings)
                  };
                  C.writeErrorLog(error,response);
                } else {
                  var options_1 = {
                    method: 'POST',
                    url: C.urls.baseUrl.urlContracting + '/api/ToolsAPI/CreateTransactionIDCombo',
                    headers:
                    {
                      'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form:
                    {
                      HotelCode: response.Code,
                      FlightCode: response.flyBookingCode,
                      DepartATCode: '',
                      ReturnATCode: '',
                    }
                  };
  
                  request(options_1, function (error, response1, body) {
                    // if (error) throw new Error(error);
                    if (response1.Error) {
                      var error1 = {
                        page: "flightcomboadddetails",
                        func: "CreateTransactionIDCombo",
                        message: response1.Error,
                        content: response1.body,
                        type: "warning",
                        param: JSON.stringify(settings)
                      };
                      C.writeErrorLog(error1,response);
                    } else {
                      // var info = { ho: se.ho, ten: se.ten, phone: se.phone }
                      // se.storage.set("infocus", info);
                      var options_2 = {
                        'method': 'GET',
                        'url': C.urls.baseUrl.urlMobile+'/get-pnr-flight?reservationNo='+response.flyBookingCode+'&cacheDepartId='+se.bookcombo.iddepart+'&cacheReturnId='+se.bookcombo.idreturn+'',
                        'headers': {
                        }
                      };
                      request(options_2, function (error2, response2) {
                        if (error2) throw new Error(error2);
                        if (se.loader) {
                          se.loader.dismiss();
                        }
                        var obj =JSON.parse(response2.body);
                        if (obj.length>0) {
                          se.navCtrl.navigateForward('/flightcombopaymentdone/' + response.Code + "/RQ/" + response.flyBookingCode);
                        }
                        else
                        {
                          alert("Gặp sư cố, vui lòng thử lại");
                        }
                      });
                    }
                  })
                }
              });
              //console.log(this.objectFlight);
              //console.log(this.arrchild);
            } else if (co == 1) {
              this.presentToast();
            }
            else if (co == 2) {
              this.presentToastBirthDay();
            }
            else if (co == 3) {
              this.presentToastGender();
            }
          }
          else {
            this.presentToastPhone();
          }
        } else {
          this.presentToastPhoneNull();
        }
      }
      else {
        this.presentToast1();
      }
    } else {
      this.presentToast1();
    }

  }
  itemrdmale(index) {
    // if (flag == 0) {
    //   this.arradult[index].Gender = 1;
    // } else {
    //   this.arrchild[index].Gender = 1;
    // }
    this.arradult[index].Gender = 1;
  }
  itemrdfemale(index) {
    // if (flag == 0) {
    //   this.arradult[index].Gender = 2;
    // } else {
    //   this.arrchild[index].Gender = 2;
    // }
    this.arradult[index].Gender = 2;
  }
  async presentToast1() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập đầy đủ họ tên liên hệ",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToast() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập đầy đủ họ tên hàng khách",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastPhoneNull() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập số điện thoại",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  async presentToastPhone() {
    let toast = await this.toastCtrl.create({
      message: "Số điện thoại phải 10 số",
      duration: 3000,
      position: 'top'
    });

    toast.present();
  }
  async presentToastBirthDay() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng nhập ngày sinh của trẻ em",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentToastGender() {
    let toast = await this.toastCtrl.create({
      message: "Xin vui lòng chọn quý danh",
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  async presentLoading() {
    this.loader = await this.loadingCtrl.create({
      message: "",
    });
    this.loader.present();
  }
  phonenumber(inputtxt) {
    var test1 = inputtxt.length;
    if (inputtxt) {
      if (test1 == 10) {
        return true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  textchangehoten() {
    this.zone.run(() => {
      this.arradult[0].hoten = this.hoten;
    })
  }
  next1() {
    this.navCtrl.navigateForward('/flightcombopaymentdone');
  }
  hasWhiteSpace(s) {
    return s.indexOf(' ') >= 0;
  }
}
