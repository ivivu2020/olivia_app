(window.webpackJsonp=window.webpackJsonp||[]).push([[126],{"/zrx":function(i,t,n){"use strict";n.r(t),n.d(t,"IonInfiniteScroll",function(){return o}),n.d(t,"IonInfiniteScrollContent",function(){return l});var e=n("gDZG"),s=n("ucZE");class o{constructor(){this.thrPx=0,this.thrPc=0,this.didFire=!1,this.isBusy=!1,this.isLoading=!1,this.threshold="15%",this.disabled=!1,this.position="bottom"}thresholdChanged(i){i.lastIndexOf("%")>-1?(this.thrPx=0,this.thrPc=parseFloat(i)/100):(this.thrPx=parseFloat(i),this.thrPc=0)}disabledChanged(i){this.disabled&&(this.isLoading=!1,this.isBusy=!1),this.enableScrollEvents(!i)}async componentDidLoad(){const i=this.el.closest("ion-content");i&&(await i.componentOnReady(),this.scrollEl=await i.getScrollElement()),this.thresholdChanged(this.threshold),this.enableScrollEvents(!this.disabled),"top"===this.position&&this.queue.write(()=>{this.scrollEl&&(this.scrollEl.scrollTop=this.scrollEl.scrollHeight-this.scrollEl.clientHeight)})}componentDidUnload(){this.scrollEl=void 0}onScroll(){const i=this.scrollEl;if(!i||!this.canStart())return 1;const t=this.el.offsetHeight;if(0===t)return 2;const n=i.scrollTop,e=i.offsetHeight,s=0!==this.thrPc?e*this.thrPc:this.thrPx;if(("bottom"===this.position?i.scrollHeight-t-n-s-e:n-t-s)<0){if(!this.didFire)return this.isLoading=!0,this.didFire=!0,this.ionInfinite.emit(),3}else this.didFire=!1;return 4}complete(){const i=this.scrollEl;if(this.isLoading&&i&&(this.isLoading=!1,"top"===this.position)){this.isBusy=!0;const t=i.scrollHeight-i.scrollTop;requestAnimationFrame(()=>{this.queue.read(()=>{const n=i.scrollHeight-t;requestAnimationFrame(()=>{this.queue.write(()=>{i.scrollTop=n,this.isBusy=!1})})})})}}canStart(){return!(this.disabled||this.isBusy||!this.scrollEl||this.isLoading)}enableScrollEvents(i){this.scrollEl&&this.enableListener(this,"scroll",i,this.scrollEl)}hostData(){return{class:{[`${this.mode}`]:!0,"infinite-scroll-loading":this.isLoading,"infinite-scroll-enabled":!this.disabled}}}static get is(){return"ion-infinite-scroll"}static get properties(){return{complete:{method:!0},disabled:{type:Boolean,attr:"disabled",watchCallbacks:["disabledChanged"]},el:{elementRef:!0},enableListener:{context:"enableListener"},isLoading:{state:!0},position:{type:String,attr:"position"},queue:{context:"queue"},threshold:{type:String,attr:"threshold",watchCallbacks:["thresholdChanged"]}}}static get events(){return[{name:"ionInfinite",method:"ionInfinite",bubbles:!0,cancelable:!0,composed:!0}]}static get listeners(){return[{name:"scroll",method:"onScroll",disabled:!0,passive:!0}]}static get style(){return"ion-infinite-scroll{display:none;width:100%}.infinite-scroll-enabled{display:block}"}}class l{componentDidLoad(){void 0===this.loadingSpinner&&(this.loadingSpinner=this.config.get("infiniteLoadingSpinner",this.config.get("spinner","ios"===this.mode?"lines":"crescent")))}hostData(){return{class:{[`${this.mode}`]:!0,[`infinite-scroll-content-${this.mode}`]:!0}}}render(){return Object(e.b)("div",{class:"infinite-loading"},this.loadingSpinner&&Object(e.b)("div",{class:"infinite-loading-spinner"},Object(e.b)("ion-spinner",{name:this.loadingSpinner})),this.loadingText&&Object(e.b)("div",{class:"infinite-loading-text",innerHTML:Object(s.a)(this.loadingText)}))}static get is(){return"ion-infinite-scroll-content"}static get properties(){return{config:{context:"config"},loadingSpinner:{type:String,attr:"loading-spinner",mutable:!0},loadingText:{type:String,attr:"loading-text"}}}static get style(){return"ion-infinite-scroll-content{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center;min-height:84px;text-align:center;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.infinite-loading{margin-left:0;margin-right:0;margin-top:0;margin-bottom:32px;display:none;width:100%}.infinite-loading-text{margin-left:32px;margin-right:32px;margin-top:4px;margin-bottom:0}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.infinite-loading-text{margin-left:unset;margin-right:unset;-webkit-margin-start:32px;margin-inline-start:32px;-webkit-margin-end:32px;margin-inline-end:32px}}.infinite-scroll-loading ion-infinite-scroll-content>.infinite-loading{display:block}.infinite-scroll-content-ios .infinite-loading-text{color:var(--ion-color-step-600,#666)}.infinite-scroll-content-ios .infinite-loading-spinner .spinner-crescent circle,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-lines-ios line,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-lines-small-ios line{stroke:var(--ion-color-step-600,#666)}.infinite-scroll-content-ios .infinite-loading-spinner .spinner-bubbles circle,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-circles circle,.infinite-scroll-content-ios .infinite-loading-spinner .spinner-dots circle{fill:var(--ion-color-step-600,#666)}"}static get styleMode(){return"ios"}}}}]);