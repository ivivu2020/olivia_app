import request from 'request';
import { error } from 'util';
import { environment } from '../../environments/environment';

export class C {
    //public static googleAnalytics: GoogleAnalytics;
    public static ENV = environment.ENV || 'dev';
    public static urls: any = {
      get baseUrl() {
        if (!C.HOSTS[C.ENV]) { throw new error('Unknown environment'); }
  
        return C.HOSTS[C.ENV];
      },
      apiVersion: 'api',
      get url() {
        return this.baseUrl + '/' + this.apiVersion;
      },
      get users() {
        return this.url + '/users';
      },
    };
  
    private static HOSTS: any = {
      //dev: {urlPost: 'https://svc1-beta.ivivu.com',urlGet: 'https://beta.ivivu.com', urlContracting: 'https://betapay.ivivu.com', urlMobile: 'https://beta-olivia.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://beta-olivia.ivivu.com/payment',urlbookcombo:'https://betapay.ivivu.com/', urlSVC3: 'https://beta-svc3.ivivu.com/api/'},
      dev: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'http://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/'},
      prod: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/'},
      release: {urlPost: 'https://svc1.ivivu.com',urlGet: 'https://www.ivivu.com', urlContracting: 'https://pay.ivivu.com', urlMobile: 'https://gate.ivivu.com',urlBlog: 'https://svc3.ivivu.com',urlGate: 'https://gate.ivivu.com',urlPayment: 'https://gate.ivivu.com/payment', urlSVC3: 'https://svc3.ivivu.com/api/'},
    };
  

    public static writeErrorLog(objError:any,response) {
      if(objError.type){
        return;
      }
      var obj = { 
       "content": "Error from page: "+ (objError.page || "") + " - function: " + (objError.func|| "") + " - params: " + (objError.param|| "" )+ " - Content: " + (objError.stack || "") + " - response: " + JSON.stringify(response) + " - AppVersion: 1.6.4",
       "name": "[Olivia App] " +"page: "+ (objError.page || "") + " - function: " + (objError.func|| "") + " " + objError.message || "",
       "status": objError.type || "error",
       "type": "app" 
       }
       var options = {
         method: 'POST',
         url: C.urls.baseUrl.urlMobile +"/api/erp/Logging/write-json",
         headers:
           {
            'accept': 'application/json',
            'content-type': 'application/json-patch+json',
           },
         body: JSON.stringify(obj),
       };
       request(options, function (error, response, body) {
         if (error) {
           throw new Error(error);
         };
       })
     };

  };
