(window.webpackJsonp=window.webpackJsonp||[]).push([[255],{tbqa:function(e,t,a){"use strict";a.r(t),a.d(t,"IonSearchbar",function(){return c});var o=a("gDZG"),r=a("FEEj"),n=a("ucZE"),i=a("ybXd");class c{constructor(){this.isCancelVisible=!1,this.shouldAlignLeft=!0,this.focused=!1,this.noAnimate=!0,this.animated=!1,this.autocomplete="off",this.autocorrect="off",this.cancelButtonIcon="md-arrow-back",this.cancelButtonText="Cancel",this.debounce=250,this.disabled=!1,this.placeholder="Search",this.searchIcon="search",this.showCancelButton=!1,this.spellcheck=!1,this.type="search",this.value="",this.onClearInput=(e=>{this.ionClear.emit(),e&&(e.preventDefault(),e.stopPropagation()),setTimeout(()=>{""!==this.getValue()&&(this.value="",this.ionInput.emit())},64)}),this.onCancelSearchbar=(e=>{e&&(e.preventDefault(),e.stopPropagation()),this.ionCancel.emit(),this.onClearInput(),this.nativeInput&&this.nativeInput.blur()}),this.onInput=(e=>{const t=e.target;t&&(this.value=t.value),this.ionInput.emit(e)}),this.onBlur=(()=>{this.focused=!1,this.ionBlur.emit(),this.positionElements()}),this.onFocus=(()=>{this.focused=!0,this.ionFocus.emit(),this.positionElements()})}debounceChanged(){this.ionChange=Object(i.f)(this.ionChange,this.debounce)}valueChanged(){const e=this.nativeInput,t=this.getValue();e&&e.value!==t&&(e.value=t),this.ionChange.emit({value:t})}componentDidLoad(){this.positionElements(),this.debounceChanged(),setTimeout(()=>{this.noAnimate=!1},300)}setFocus(){this.nativeInput&&this.nativeInput.focus()}getInputElement(){return Promise.resolve(this.nativeInput)}positionElements(){const e=this.getValue(),t=this.shouldAlignLeft,a=!this.animated||""!==e.trim()||!!this.focused;this.shouldAlignLeft=a,"ios"===this.mode&&(t!==a&&this.positionPlaceholder(),this.animated&&this.positionCancelButton())}positionPlaceholder(){const e=this.nativeInput;if(!e)return;const t="rtl"===this.doc.dir,a=(this.el.shadowRoot||this.el).querySelector(".searchbar-search-icon");if(this.shouldAlignLeft)e.removeAttribute("style"),a.removeAttribute("style");else{const o=this.doc,r=o.createElement("span");r.innerHTML=Object(n.a)(this.placeholder)||"",o.body.appendChild(r);const i=r.offsetWidth;r.remove();const c="calc(50% - "+i/2+"px)",s="calc(50% - "+(i/2+30)+"px)";t?(e.style.paddingRight=c,a.style.marginRight=s):(e.style.paddingLeft=c,a.style.marginLeft=s)}}positionCancelButton(){const e="rtl"===this.doc.dir,t=(this.el.shadowRoot||this.el).querySelector(".searchbar-cancel-button"),a=this.focused;if(t&&a!==this.isCancelVisible){const o=t.style;if(this.isCancelVisible=a,a)e?o.marginLeft="0":o.marginRight="0";else{const a=t.offsetWidth;a>0&&(e?o.marginLeft=-a+"px":o.marginRight=-a+"px")}}}getValue(){return this.value||""}hasValue(){return""!==this.getValue()}hostData(){const e=this.animated&&this.config.getBoolean("animated",!0);return{"aria-disabled":this.disabled?"true":null,class:Object.assign({},Object(r.c)(this.color),{[`${this.mode}`]:!0,"searchbar-animated":e,"searchbar-disabled":this.disabled,"searchbar-no-animate":e&&this.noAnimate,"searchbar-has-value":this.hasValue(),"searchbar-left-aligned":this.shouldAlignLeft,"searchbar-has-focus":this.focused})}}render(){const e=this.clearIcon||("ios"===this.mode?"ios-close-circle":"md-close"),t=this.searchIcon,a=this.showCancelButton&&Object(o.b)("button",{type:"button",tabIndex:"ios"!==this.mode||this.focused?void 0:-1,onMouseDown:this.onCancelSearchbar,onTouchStart:this.onCancelSearchbar,class:"searchbar-cancel-button"},Object(o.b)("div",null,"md"===this.mode?Object(o.b)("ion-icon",{mode:this.mode,icon:this.cancelButtonIcon,lazy:!1}):this.cancelButtonText));return[Object(o.b)("div",{class:"searchbar-input-container"},Object(o.b)("input",{disabled:this.disabled,ref:e=>this.nativeInput=e,class:"searchbar-input",onInput:this.onInput,onBlur:this.onBlur,onFocus:this.onFocus,placeholder:this.placeholder,type:this.type,value:this.getValue(),autoComplete:this.autocomplete,autoCorrect:this.autocorrect,spellCheck:this.spellcheck}),"md"===this.mode&&a,Object(o.b)("ion-icon",{mode:this.mode,icon:t,lazy:!1,class:"searchbar-search-icon"}),Object(o.b)("button",{type:"button","no-blur":!0,class:"searchbar-clear-button",onMouseDown:this.onClearInput,onTouchStart:this.onClearInput},Object(o.b)("ion-icon",{mode:this.mode,icon:e,lazy:!1,class:"searchbar-clear-icon"}))),"ios"===this.mode&&a]}static get is(){return"ion-searchbar"}static get encapsulation(){return"scoped"}static get properties(){return{animated:{type:Boolean,attr:"animated"},autocomplete:{type:String,attr:"autocomplete"},autocorrect:{type:String,attr:"autocorrect"},cancelButtonIcon:{type:String,attr:"cancel-button-icon"},cancelButtonText:{type:String,attr:"cancel-button-text"},clearIcon:{type:String,attr:"clear-icon"},color:{type:String,attr:"color"},config:{context:"config"},debounce:{type:Number,attr:"debounce",watchCallbacks:["debounceChanged"]},disabled:{type:Boolean,attr:"disabled"},doc:{context:"document"},el:{elementRef:!0},focused:{state:!0},getInputElement:{method:!0},mode:{type:String,attr:"mode"},noAnimate:{state:!0},placeholder:{type:String,attr:"placeholder"},searchIcon:{type:String,attr:"search-icon"},setFocus:{method:!0},showCancelButton:{type:Boolean,attr:"show-cancel-button"},spellcheck:{type:Boolean,attr:"spellcheck"},type:{type:String,attr:"type"},value:{type:String,attr:"value",mutable:!0,watchCallbacks:["valueChanged"]}}}static get events(){return[{name:"ionInput",method:"ionInput",bubbles:!0,cancelable:!0,composed:!0},{name:"ionChange",method:"ionChange",bubbles:!0,cancelable:!0,composed:!0},{name:"ionCancel",method:"ionCancel",bubbles:!0,cancelable:!0,composed:!0},{name:"ionClear",method:"ionClear",bubbles:!0,cancelable:!0,composed:!0},{name:"ionBlur",method:"ionBlur",bubbles:!0,cancelable:!0,composed:!0},{name:"ionFocus",method:"ionFocus",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".sc-ion-searchbar-md-h{--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:.5;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;width:100%;color:var(--color);font-family:var(--ion-font-family,inherit);-webkit-box-sizing:border-box;box-sizing:border-box}.ion-color.sc-ion-searchbar-md-h{color:var(--ion-color-contrast)}.ion-color.sc-ion-searchbar-md-h   .searchbar-input.sc-ion-searchbar-md{background:var(--ion-color-base)}.ion-color.sc-ion-searchbar-md-h   .searchbar-cancel-button.sc-ion-searchbar-md, .ion-color.sc-ion-searchbar-md-h   .searchbar-clear-button.sc-ion-searchbar-md, .ion-color.sc-ion-searchbar-md-h   .searchbar-search-icon.sc-ion-searchbar-md{color:inherit}.searchbar-search-icon.sc-ion-searchbar-md{color:var(--icon-color);pointer-events:none}.searchbar-input-container.sc-ion-searchbar-md{display:block;position:relative;-ms-flex-negative:1;flex-shrink:1;width:100%}.searchbar-input.sc-ion-searchbar-md{font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;-webkit-box-sizing:border-box;box-sizing:border-box;display:block;width:100%;border:0;outline:none;background:var(--background);font-family:inherit;-webkit-appearance:none;-moz-appearance:none;appearance:none}.searchbar-input.sc-ion-searchbar-md::-webkit-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-md:-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-md::-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-md::placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-md::-ms-clear, .searchbar-input.sc-ion-searchbar-md::-webkit-search-cancel-button{display:none}.searchbar-cancel-button.sc-ion-searchbar-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:none;height:100%;border:0;outline:none;color:var(--cancel-button-color);cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none}.searchbar-cancel-button.sc-ion-searchbar-md > div.sc-ion-searchbar-md{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.searchbar-clear-button.sc-ion-searchbar-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:none;min-height:0;outline:none;color:var(--clear-button-color);-webkit-appearance:none;-moz-appearance:none;appearance:none}.searchbar-has-value.searchbar-has-focus.sc-ion-searchbar-md-h   .searchbar-clear-button.sc-ion-searchbar-md{display:block}.searchbar-disabled.sc-ion-searchbar-md-h{cursor:default;opacity:.4;pointer-events:none}.sc-ion-searchbar-md-h{--clear-button-color:initial;--cancel-button-color:var(--ion-color-step-900,#1a1a1a);--color:var(--ion-color-step-850,#262626);--icon-color:var(--ion-color-step-600,#666);--background:var(--ion-background-color,#fff);padding-left:8px;padding-right:8px;padding-top:8px;padding-bottom:8px;background:inherit}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.sc-ion-searchbar-md-h{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px}}.searchbar-search-icon.sc-ion-searchbar-md{left:16px;top:11px;width:21px;height:21px}[dir=rtl].sc-ion-searchbar-md-h   .searchbar-search-icon.sc-ion-searchbar-md, [dir=rtl]   .sc-ion-searchbar-md-h   .searchbar-search-icon.sc-ion-searchbar-md{right:16px}.searchbar-cancel-button.sc-ion-searchbar-md{left:5px;top:0;background-color:transparent;font-size:1.6em}[dir=rtl].sc-ion-searchbar-md-h   .searchbar-cancel-button.sc-ion-searchbar-md, [dir=rtl]   .sc-ion-searchbar-md-h   .searchbar-cancel-button.sc-ion-searchbar-md{right:5px}.searchbar-cancel-button.sc-ion-searchbar-md, .searchbar-search-icon.sc-ion-searchbar-md{position:absolute}.searchbar-cancel-button.activated.sc-ion-searchbar-md, .searchbar-search-icon.activated.sc-ion-searchbar-md{background-color:transparent}.searchbar-input.sc-ion-searchbar-md{padding-left:55px;padding-right:55px;padding-top:6px;padding-bottom:6px;border-radius:2px;background-position:left 8px center;height:auto;font-size:16px;font-weight:400;line-height:30px;-webkit-box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12);box-shadow:0 2px 2px 0 rgba(0,0,0,.14),0 3px 1px -2px rgba(0,0,0,.2),0 1px 5px 0 rgba(0,0,0,.12)}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-input.sc-ion-searchbar-md{padding-left:unset;padding-right:unset;-webkit-padding-start:55px;padding-inline-start:55px;-webkit-padding-end:55px;padding-inline-end:55px}}[dir=rtl].sc-ion-searchbar-md-h   .searchbar-input.sc-ion-searchbar-md, [dir=rtl]   .sc-ion-searchbar-md-h   .searchbar-input.sc-ion-searchbar-md{background-position:right 8px center}.searchbar-clear-button.sc-ion-searchbar-md{right:13px;top:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;position:absolute;height:100%;border:0;background-color:transparent}[dir=rtl].sc-ion-searchbar-md-h   .searchbar-clear-button.sc-ion-searchbar-md, [dir=rtl]   .sc-ion-searchbar-md-h   .searchbar-clear-button.sc-ion-searchbar-md{left:13px}.searchbar-clear-button.activated.sc-ion-searchbar-md{background-color:transparent}.searchbar-clear-icon.sc-ion-searchbar-md{width:22px;height:100%}.searchbar-has-focus.sc-ion-searchbar-md-h   .searchbar-cancel-button.sc-ion-searchbar-md, .searchbar-has-focus.sc-ion-searchbar-md-h   .searchbar-search-icon.sc-ion-searchbar-md{display:block}.searchbar-has-focus.sc-ion-searchbar-md-h   .searchbar-cancel-button.sc-ion-searchbar-md + .searchbar-search-icon.sc-ion-searchbar-md{display:none}ion-toolbar.sc-ion-searchbar-md-h, ion-toolbar   .sc-ion-searchbar-md-h{padding-left:3px;padding-right:3px;padding-top:3px;padding-bottom:3px}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){ion-toolbar.sc-ion-searchbar-md-h, ion-toolbar   .sc-ion-searchbar-md-h{padding-left:unset;padding-right:unset;-webkit-padding-start:3px;padding-inline-start:3px;-webkit-padding-end:3px;padding-inline-end:3px}}"}static get styleMode(){return"md"}}}}]);