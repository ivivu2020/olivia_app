import { Component,NgZone,OnInit } from '@angular/core';
import { NavController, Platform, ActionSheetController, ModalController ,LoadingController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as request from 'requestretry';
import { C } from './../providers/constants';
import { GlobalFunction } from './../providers/globalfunction';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-userfeedback',
  templateUrl: 'userfeedback.html',
  styleUrls: ['userfeedback.scss'],
})

export class UserFeedBackPage implements OnInit{
    cindisplay; coutdisplay; Description = "";
    trip: any;  public loader:any;
    star1Active=0;
    star2Active=0;
    base64Image:any;
    croppedImagepath :any;
    croppedImagefilename: any;
    imageResponsepost = [];
  fileType: any;
  options: {
    // Android only. Max images to be selected, defaults to 15. If this is set to 1, upon
    // selection of a single image, the plugin will return it.
    //maximumImagesCount: 3,
    // max width and height to allow the images to be.  Will keep aspect
    // ratio no matter what.  So if both are 800, the returned image
    // will be at most 800 pixels wide and 800 pixels tall.  If the width is
    // 800 and height 0 the image will be 800 pixels wide if the source
    // is at least that wide.
    width: number;
    //height: 200,
    // quality of resized image, defaults to 100
    quality: number;
    // output type, defaults to FILE_URIs.
    // available options are 
    // window.imagePicker.OutputType.FILE_URI (0) or 
    // window.imagePicker.OutputType.BASE64_STRING (1)
    outputType: number;
  };
    imageResponse = [];
    constructor(public platform: Platform,public navCtrl: NavController,public zone: NgZone,public storage: Storage,
      public gf: GlobalFunction,private ActivatedRoute: ActivatedRoute, public camera: Camera,public modalCtrl: ModalController, public loadingCtrl: LoadingController,
      private imagePicker: ImagePicker,
      private crop: Crop,
      public actionsheetCtrl: ActionSheetController,
      private file: File,){
        let trip = this.gf.getParams('tripFeedBack');
        if(trip){
            this.loadInfoTrip(trip);
          }
    }

    ngOnInit(){
     
    }

    ionViewWillEnter(){
      var se = this;
      let trip = se.gf.getParams('tripFeedBack');
      if(trip){
        se.loadInfoTrip(trip);
      }
      console.log("Test");
    }

    loadInfoTrip(trip){
      var se = this;
      se.trip = trip;
      se.cindisplay = moment(trip.checkInDate).format('DD-MM-YYYY');
      se.coutdisplay = moment(trip.checkOutDate).format('DD-MM-YYYY');
     
    }

    clickStar1(idx){
      this.zone.run(()=>{
        this.star1Active = idx;
      })
    }

    clickStar2(idx){
      this.zone.run(()=>{
        this.star2Active = idx;
      })
    }

    ionViewWillLeave(){
      this.star1Active =0;
      this.star2Active =0;
    }
    sendFeedBack() {
      var se = this;
      this.presentLoadingnotime();
      if (this.imageResponse.length > 0) {
        this.imageResponsepost = [];
        for (let i = 0; i < this.imageResponse.length; i++) {
          let b64: any = this.imageResponse[i].img.split(',')[1];
          if (i == this.imageResponse.length - 1) {
            this.uploadImage(b64, this.imageResponse[i].filename, 1);
          }
          else {
            this.uploadImage(b64, this.imageResponse[i].filename, 0);
          }
  
        }
      }
      else {
        if (se.star1Active || se.star2Active || se.Description) {
          var form = {
            QuantityEmp: se.star1Active, // điểm của nhân viên (tháng điểm 5)
            QuantityHotel: se.star2Active, //điểm của khách sạn(thang điểm 5)
            Description: se.Description, // lời nhắn của khách
            BookingId: se.trip.booking_id  //booking code (IVIVU43434)// Danh sách hình ảnh nếu có , nếu ko thì chuyền []
          }
          var options = {
            method: 'POST',
            url: C.urls.baseUrl.urlGet + '/feedback/savereview',
            headers:
            {
            },
            form
          }
          // console.log(JSON.stringify(form));
          request(options, function (error, response, body) {
            if (se.loader) {
              se.loader.dismiss()
            }
            alert("IVIVU.com đã nhận phản hồi của Quý khách");
            se.modalCtrl.dismiss();
          });
        } else {
          alert("Xin quý khách nhập đánh giá");
        }
      }
      
    }

    async addImage(){
      this.getImages();
      }

      getImages() {
        var se = this;
        const options: CameraOptions = {
          quality: 76,
          sourceType: se.camera.PictureSourceType.SAVEDPHOTOALBUM,
          destinationType: se.camera.DestinationType.FILE_URI,
          encodingType: se.camera.EncodingType.JPEG,
          mediaType: se.camera.MediaType.PICTURE,
          saveToPhotoAlbum: true,
          correctOrientation: true,
        }
        this.imageResponse = [];
        this.imagePicker.getPictures(options).then((results) => {
          for (var i = 0; i < results.length; i++) {
            let filename, path;
            se.base64Image = results[i];
            path = results[i].substring(0, results[i].lastIndexOf('/') + 1);
            filename = results[i].substring(results[i].lastIndexOf('/') + 1);
            let index = filename.indexOf('?');
            if (index > -1) {
              filename = filename.substring(0, index);
            }
            //se.croppedImagefilename = filename;
            //se.cropImage(imageData);
    
            //let filepath = path + filename;
            //alert(filepath)
            se.file.readAsDataURL(path, filename).then(base64 => {
              // let b64: any = base64.split(',')[1];
              var item = { img: base64, filename: filename }
              this.imageResponse.push(item);
            })
    
            //this.uploadImage(results[i],filename);
          }
          // this.croppedImagepath=this.imageResponse[0];
          // console.log(this.imageResponse);
        }, (err) => {
          alert(err);
        });
      }

    /**
         * Chọn từ bộ sưu tập
         * @param useAlbum 
         */
        async captureImageGallery() {
          var se = this;
          const options: CameraOptions = {
              quality: 76,
              sourceType: se.camera.PictureSourceType.SAVEDPHOTOALBUM,
              destinationType: se.camera.DestinationType.FILE_URI,
              encodingType: se.camera.EncodingType.JPEG,
              mediaType: se.camera.MediaType.PICTURE,
              saveToPhotoAlbum: true,
              correctOrientation: true,
            }

            se.camera.getPicture(options).then((imageData) => {   
                if(imageData){
                  let filename,path;
                  se.base64Image = imageData;
                      path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
                      filename = imageData.substring(imageData.lastIndexOf('/') + 1);
                      let index = filename.indexOf('?');     
                      if (index > -1) {
                        filename = filename.substring(0,index);
                      }      
                      se.croppedImagefilename = filename;
                      se.cropImage(imageData);
                } 
              
              })
      }

      /**
       * Chụp ảnh
       * @param useAlbum 
       */
      async captureImage() {
          var se = this;
          const options: CameraOptions = {
            quality: 76,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            sourceType: this.camera.PictureSourceType.CAMERA,
            correctOrientation: true,
          }
      
          this.zone.run(()=>{
              this.camera.getPicture(options).then((imageData) => {
                  if(imageData){
                      let filename,path;
                      se.base64Image = imageData;
                      path = imageData.substring(0, imageData.lastIndexOf('/') + 1);
                      filename = imageData.substring(imageData.lastIndexOf('/') + 1);
                      let index = filename.indexOf('?');     
                      if (index > -1) {
                        filename = filename.substring(0,index);
                      }      
                      se.croppedImagefilename = filename;
                      se.cropImage(imageData);
                  }
                 });
          })
      }

      uploadImage(text, filename, co) {
        var se = this;
        //var fs1 = require('fs');
        // var formdata = new formData();
        // console.log(fs);
        // formdata.append('myfile', fs.createReadStream(filepath));
        //     var options = { 
        //       method: 'POST',
        //       url: 'https://cdn1.ivivu.com/newcdn/api/upload/uimages',
        //       headers: 
        //       { 'cache-control': 'no-cache',
        //         'Connection': 'keep-alive',
        //         'Content-Length': '60092',
        //         'Content-Type': 'multipart/form-data; boundary=--------------------------538357226843524475162502',
        //         'Accept-Encoding': 'gzip, deflate',
        //         'Host': 'cdn1.ivivu.com',
        //         'Accept': '*/*',
        //         'User-Agent': 'PostmanRuntime/7.15.2',
        //         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' 
        //       },
        //       formData: formdata
        //         // { 'myfile': 
        //         //     { value: fs.createReadStream(filepath),
        //         //       options: 
        //         //       { filename: filepath,
        //         //         contentType: null 
        //         //       } 
        //         //     },
        //         //   'order': '1',
        //         //   'desc_img': 'abc',
        //         //   'id': '0' 
        //         // } 
        //     };
    
        //   request(options, function (error, response, body) {
        //     if(!error){
        //       console.log(body);
        //     }
        //   });
        var form = {
          imgBase64: text,
          desc_img: 'desc ',
          id: '0',
          fileName64: filename,
          order: '0'
        }
        var options = {
          method: 'POST',
          url: 'https://cdn1.ivivu.com/newcdn/api/upload/Base64Upload',
          headers:
          {
          },
          form
        };
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          var json = JSON.parse(body);
          console.log(json);
          var itemjs = { Url: json[0].Url, ObjectParam: json[0].ObjectParam }
          se.imageResponsepost.push(itemjs);
          if (co == 1) {
            if (se.star1Active || se.star2Active || se.Description) {
              var form = {
                QuantityEmp: se.star1Active, // điểm của nhân viên (tháng điểm 5)
                QuantityHotel: se.star2Active, //điểm của khách sạn(thang điểm 5)
                Description: se.Description, // lời nhắn của khách
                BookingId: se.trip.booking_id  //booking code (IVIVU43434)// Danh sách hình ảnh nếu có , nếu ko thì chuyền []
              }
              if (se.imageResponsepost.length > 0) {
                for (let index = 0; index < se.imageResponsepost.length; index++) {
                  form["Images[" + index + "][0][ObjectParam][order]"] = se.imageResponsepost[index].ObjectParam.order;
                  form["Images[" + index + "][0][ObjectParam][id]"] = se.imageResponsepost[index].ObjectParam.id;
                  form["Images[" + index + "][0][ObjectParam][desc_img]"] = se.imageResponsepost[index].ObjectParam.desc_img;
                  form["Images[" + index + "][0][Url]"] = se.imageResponsepost[index].Url;
                }
              }
              var options = {
                method: 'POST',
                url: C.urls.baseUrl.urlGet + '/feedback/savereview',
                headers:
                {
                },
                form
              }
              //console.log(JSON.stringify(form));
              request(options, function (error, response, body) {
                if (se.loader) {
                  se.loader.dismiss()
                }
                alert("IVIVU.com đã nhận phản hồi của Quý khách");
                se.modalCtrl.dismiss();
              });
            } else {
              alert("Xin quý khách nhập đánh giá");
            }
          }
        });
      }

      cropImage(imgPath) {
        this.crop.crop(imgPath, { quality: 100 })
          .then(
            newPath => {
              this.showCroppedImage(newPath.split('?')[0]);
            },
            error => {
              throw error;
            }
            
          )
      }

       /**
           * Trả về dạng base64 của image full
           * @param ImagePath Đường dẫn image full
           */
          getFullImage(ImagePath): Promise < any >{
            return new Promise((resolve, reject) => {
                var copyPath = ImagePath;
                var splitPath = copyPath.split('/');
                var imageName = splitPath[splitPath.length-1];
                var filePath = ImagePath.split(imageName)[0];
                var splitType = imageName.split('.');
                var imageType = splitType[splitType.length -1];
                var se = this;
                se.file.readAsDataURL(filePath,imageName).then(base64=>{
                 let b64:any = base64.split(',')[1];
                resolve(b64);
                })
            })
          }
            /**
           * Trả về dạng base64 của image đã scrop
           * @param ImagePath Đường dẫn image scrop
           */
          showCroppedImage(ImagePath){
            var copyPath = ImagePath;
            var splitPath = copyPath.split('/');
            var imageName = splitPath[splitPath.length-1];
            var filePath = ImagePath.split(imageName)[0];
            var splitType = imageName.split('.');
            var imageType = splitType[splitType.length -1];
            
            var se = this;
            se.fileType = imageType;
            se.file.readAsDataURL(filePath,imageName).then(base64=>{
            se.zone.run(()=>{
                se.croppedImagepath = base64;
            })
            const contentType ='image/'+imageType;
            let b64:any = base64.split(',')[1];
            //se.uploadImage(b64);
            })
           
          }

    close(){
      this.modalCtrl.dismiss();
    }
    async presentLoadingnotime() {
      this.loader = await this.loadingCtrl.create({
        message: "",
      });
      this.loader.present();
    }
}