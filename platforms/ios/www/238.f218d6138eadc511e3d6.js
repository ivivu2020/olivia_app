(window.webpackJsonp=window.webpackJsonp||[]).push([[238],{"2BOf":function(a,e,o){"use strict";o.r(e),o.d(e,"IonSearchbar",function(){return s});var t=o("gDZG"),i=o("FEEj"),r=o("ucZE"),n=o("ybXd");class s{constructor(){this.isCancelVisible=!1,this.shouldAlignLeft=!0,this.focused=!1,this.noAnimate=!0,this.animated=!1,this.autocomplete="off",this.autocorrect="off",this.cancelButtonIcon="md-arrow-back",this.cancelButtonText="Cancel",this.debounce=250,this.disabled=!1,this.placeholder="Search",this.searchIcon="search",this.showCancelButton=!1,this.spellcheck=!1,this.type="search",this.value="",this.onClearInput=(a=>{this.ionClear.emit(),a&&(a.preventDefault(),a.stopPropagation()),setTimeout(()=>{""!==this.getValue()&&(this.value="",this.ionInput.emit())},64)}),this.onCancelSearchbar=(a=>{a&&(a.preventDefault(),a.stopPropagation()),this.ionCancel.emit(),this.onClearInput(),this.nativeInput&&this.nativeInput.blur()}),this.onInput=(a=>{const e=a.target;e&&(this.value=e.value),this.ionInput.emit(a)}),this.onBlur=(()=>{this.focused=!1,this.ionBlur.emit(),this.positionElements()}),this.onFocus=(()=>{this.focused=!0,this.ionFocus.emit(),this.positionElements()})}debounceChanged(){this.ionChange=Object(n.f)(this.ionChange,this.debounce)}valueChanged(){const a=this.nativeInput,e=this.getValue();a&&a.value!==e&&(a.value=e),this.ionChange.emit({value:e})}componentDidLoad(){this.positionElements(),this.debounceChanged(),setTimeout(()=>{this.noAnimate=!1},300)}setFocus(){this.nativeInput&&this.nativeInput.focus()}getInputElement(){return Promise.resolve(this.nativeInput)}positionElements(){const a=this.getValue(),e=this.shouldAlignLeft,o=!this.animated||""!==a.trim()||!!this.focused;this.shouldAlignLeft=o,"ios"===this.mode&&(e!==o&&this.positionPlaceholder(),this.animated&&this.positionCancelButton())}positionPlaceholder(){const a=this.nativeInput;if(!a)return;const e="rtl"===this.doc.dir,o=(this.el.shadowRoot||this.el).querySelector(".searchbar-search-icon");if(this.shouldAlignLeft)a.removeAttribute("style"),o.removeAttribute("style");else{const t=this.doc,i=t.createElement("span");i.innerHTML=Object(r.a)(this.placeholder)||"",t.body.appendChild(i);const n=i.offsetWidth;i.remove();const s="calc(50% - "+n/2+"px)",c="calc(50% - "+(n/2+30)+"px)";e?(a.style.paddingRight=s,o.style.marginRight=c):(a.style.paddingLeft=s,o.style.marginLeft=c)}}positionCancelButton(){const a="rtl"===this.doc.dir,e=(this.el.shadowRoot||this.el).querySelector(".searchbar-cancel-button"),o=this.focused;if(e&&o!==this.isCancelVisible){const t=e.style;if(this.isCancelVisible=o,o)a?t.marginLeft="0":t.marginRight="0";else{const o=e.offsetWidth;o>0&&(a?t.marginLeft=-o+"px":t.marginRight=-o+"px")}}}getValue(){return this.value||""}hasValue(){return""!==this.getValue()}hostData(){const a=this.animated&&this.config.getBoolean("animated",!0);return{"aria-disabled":this.disabled?"true":null,class:Object.assign({},Object(i.c)(this.color),{[`${this.mode}`]:!0,"searchbar-animated":a,"searchbar-disabled":this.disabled,"searchbar-no-animate":a&&this.noAnimate,"searchbar-has-value":this.hasValue(),"searchbar-left-aligned":this.shouldAlignLeft,"searchbar-has-focus":this.focused})}}render(){const a=this.clearIcon||("ios"===this.mode?"ios-close-circle":"md-close"),e=this.searchIcon,o=this.showCancelButton&&Object(t.b)("button",{type:"button",tabIndex:"ios"!==this.mode||this.focused?void 0:-1,onMouseDown:this.onCancelSearchbar,onTouchStart:this.onCancelSearchbar,class:"searchbar-cancel-button"},Object(t.b)("div",null,"md"===this.mode?Object(t.b)("ion-icon",{mode:this.mode,icon:this.cancelButtonIcon,lazy:!1}):this.cancelButtonText));return[Object(t.b)("div",{class:"searchbar-input-container"},Object(t.b)("input",{disabled:this.disabled,ref:a=>this.nativeInput=a,class:"searchbar-input",onInput:this.onInput,onBlur:this.onBlur,onFocus:this.onFocus,placeholder:this.placeholder,type:this.type,value:this.getValue(),autoComplete:this.autocomplete,autoCorrect:this.autocorrect,spellCheck:this.spellcheck}),"md"===this.mode&&o,Object(t.b)("ion-icon",{mode:this.mode,icon:e,lazy:!1,class:"searchbar-search-icon"}),Object(t.b)("button",{type:"button","no-blur":!0,class:"searchbar-clear-button",onMouseDown:this.onClearInput,onTouchStart:this.onClearInput},Object(t.b)("ion-icon",{mode:this.mode,icon:a,lazy:!1,class:"searchbar-clear-icon"}))),"ios"===this.mode&&o]}static get is(){return"ion-searchbar"}static get encapsulation(){return"scoped"}static get properties(){return{animated:{type:Boolean,attr:"animated"},autocomplete:{type:String,attr:"autocomplete"},autocorrect:{type:String,attr:"autocorrect"},cancelButtonIcon:{type:String,attr:"cancel-button-icon"},cancelButtonText:{type:String,attr:"cancel-button-text"},clearIcon:{type:String,attr:"clear-icon"},color:{type:String,attr:"color"},config:{context:"config"},debounce:{type:Number,attr:"debounce",watchCallbacks:["debounceChanged"]},disabled:{type:Boolean,attr:"disabled"},doc:{context:"document"},el:{elementRef:!0},focused:{state:!0},getInputElement:{method:!0},mode:{type:String,attr:"mode"},noAnimate:{state:!0},placeholder:{type:String,attr:"placeholder"},searchIcon:{type:String,attr:"search-icon"},setFocus:{method:!0},showCancelButton:{type:Boolean,attr:"show-cancel-button"},spellcheck:{type:Boolean,attr:"spellcheck"},type:{type:String,attr:"type"},value:{type:String,attr:"value",mutable:!0,watchCallbacks:["valueChanged"]}}}static get events(){return[{name:"ionInput",method:"ionInput",bubbles:!0,cancelable:!0,composed:!0},{name:"ionChange",method:"ionChange",bubbles:!0,cancelable:!0,composed:!0},{name:"ionCancel",method:"ionCancel",bubbles:!0,cancelable:!0,composed:!0},{name:"ionClear",method:"ionClear",bubbles:!0,cancelable:!0,composed:!0},{name:"ionBlur",method:"ionBlur",bubbles:!0,cancelable:!0,composed:!0},{name:"ionFocus",method:"ionFocus",bubbles:!0,cancelable:!0,composed:!0}]}static get style(){return".sc-ion-searchbar-ios-h{--placeholder-color:initial;--placeholder-font-style:initial;--placeholder-font-weight:initial;--placeholder-opacity:.5;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;position:relative;-ms-flex-align:center;align-items:center;width:100%;color:var(--color);font-family:var(--ion-font-family,inherit);-webkit-box-sizing:border-box;box-sizing:border-box}.ion-color.sc-ion-searchbar-ios-h{color:var(--ion-color-contrast)}.ion-color.sc-ion-searchbar-ios-h   .searchbar-input.sc-ion-searchbar-ios{background:var(--ion-color-base)}.ion-color.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios, .ion-color.sc-ion-searchbar-ios-h   .searchbar-clear-button.sc-ion-searchbar-ios, .ion-color.sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{color:inherit}.searchbar-search-icon.sc-ion-searchbar-ios{color:var(--icon-color);pointer-events:none}.searchbar-input-container.sc-ion-searchbar-ios{display:block;position:relative;-ms-flex-negative:1;flex-shrink:1;width:100%}.searchbar-input.sc-ion-searchbar-ios{font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;-webkit-box-sizing:border-box;box-sizing:border-box;display:block;width:100%;border:0;outline:none;background:var(--background);font-family:inherit;-webkit-appearance:none;-moz-appearance:none;appearance:none}.searchbar-input.sc-ion-searchbar-ios::-webkit-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-ios:-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-ios::-ms-input-placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-ios::placeholder{color:var(--placeholder-color);font-family:inherit;font-style:var(--placeholder-font-style);font-weight:var(--placeholder-font-weight);opacity:var(--placeholder-opacity)}.searchbar-input.sc-ion-searchbar-ios::-ms-clear, .searchbar-input.sc-ion-searchbar-ios::-webkit-search-cancel-button{display:none}.searchbar-cancel-button.sc-ion-searchbar-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:none;height:100%;border:0;outline:none;color:var(--cancel-button-color);cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none}.searchbar-cancel-button.sc-ion-searchbar-ios > div.sc-ion-searchbar-ios{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.searchbar-clear-button.sc-ion-searchbar-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;display:none;min-height:0;outline:none;color:var(--clear-button-color);-webkit-appearance:none;-moz-appearance:none;appearance:none}.searchbar-has-value.searchbar-has-focus.sc-ion-searchbar-ios-h   .searchbar-clear-button.sc-ion-searchbar-ios{display:block}.searchbar-disabled.sc-ion-searchbar-ios-h{cursor:default;opacity:.4;pointer-events:none}.sc-ion-searchbar-ios-h{--clear-button-color:var(--ion-color-step-600,#666);--cancel-button-color:var(--ion-color-primary,#3880ff);--color:var(--ion-text-color,#000);--icon-color:var(--ion-color-step-600,#666);--background:rgba(var(--ion-text-color-rgb,0,0,0),0.07);padding-left:12px;padding-right:12px;padding-top:12px;padding-bottom:12px;height:60px;contain:strict}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.sc-ion-searchbar-ios-h{padding-left:unset;padding-right:unset;-webkit-padding-start:12px;padding-inline-start:12px;-webkit-padding-end:12px;padding-inline-end:12px}}.searchbar-input-container.sc-ion-searchbar-ios{height:36px;contain:strict}.searchbar-search-icon.sc-ion-searchbar-ios{margin-left:calc(50% - 60px);left:8px;top:0;position:absolute;width:16px;height:100%;contain:strict}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-search-icon.sc-ion-searchbar-ios{margin-left:unset;-webkit-margin-start:calc(50% - 60px);margin-inline-start:calc(50% - 60px)}}[dir=rtl].sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios, [dir=rtl]   .sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{right:8px}.searchbar-input.sc-ion-searchbar-ios{padding-left:28px;padding-right:28px;padding-top:0;padding-bottom:0;border-radius:10px;height:100%;font-size:14px;font-weight:400;contain:strict}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-input.sc-ion-searchbar-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:28px;padding-inline-start:28px;-webkit-padding-end:28px;padding-inline-end:28px}}.searchbar-clear-button.sc-ion-searchbar-ios{right:0;top:0;background-position:50%;position:absolute;width:30px;height:100%;border:0;background-color:transparent}[dir=rtl].sc-ion-searchbar-ios-h   .searchbar-clear-button.sc-ion-searchbar-ios, [dir=rtl]   .sc-ion-searchbar-ios-h   .searchbar-clear-button.sc-ion-searchbar-ios{left:0}.searchbar-clear-icon.sc-ion-searchbar-ios{width:18px;height:100%}.searchbar-cancel-button.sc-ion-searchbar-ios{padding-left:8px;padding-right:0;padding-top:0;padding-bottom:0;-ms-flex-negative:0;flex-shrink:0;background-color:transparent;font-size:16px}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-cancel-button.sc-ion-searchbar-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:0;padding-inline-end:0}}.searchbar-left-aligned.sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{margin-left:0}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-left-aligned.sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{margin-left:unset;-webkit-margin-start:0;margin-inline-start:0}}.searchbar-left-aligned.sc-ion-searchbar-ios-h   .searchbar-input.sc-ion-searchbar-ios{padding-left:30px}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-left-aligned.sc-ion-searchbar-ios-h   .searchbar-input.sc-ion-searchbar-ios{padding-left:unset;-webkit-padding-start:30px;padding-inline-start:30px}}.searchbar-animated.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios, .searchbar-has-focus.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios{display:block}.searchbar-animated.sc-ion-searchbar-ios-h   .searchbar-input.sc-ion-searchbar-ios, .searchbar-animated.sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{-webkit-transition:all .3s ease;transition:all .3s ease}.searchbar-animated.searchbar-has-focus.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios{opacity:1;pointer-events:auto}.searchbar-animated.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios{margin-right:-100%;-webkit-transform:translateZ(0);transform:translateZ(0);-webkit-transition:all .3s ease;transition:all .3s ease;opacity:0;pointer-events:none}@supports ((-webkit-margin-start:0) or (margin-inline-start:0)) or (-webkit-margin-start:0){.searchbar-animated.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios{margin-right:unset;-webkit-margin-end:-100%;margin-inline-end:-100%}}.searchbar-no-animate.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios, .searchbar-no-animate.sc-ion-searchbar-ios-h   .searchbar-input.sc-ion-searchbar-ios, .searchbar-no-animate.sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{-webkit-transition-duration:0ms;transition-duration:0ms}.ion-color.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios{color:var(--ion-color-base)}@media (any-hover:hover){.ion-color.sc-ion-searchbar-ios-h   .searchbar-cancel-button.sc-ion-searchbar-ios:hover{color:var(--ion-color-tint)}}ion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color), ion-toolbar.ion-color   .sc-ion-searchbar-ios-h:not(.ion-color){color:inherit}ion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color)   .searchbar-cancel-button.sc-ion-searchbar-ios, ion-toolbar.ion-color   .sc-ion-searchbar-ios-h:not(.ion-color)   .searchbar-cancel-button.sc-ion-searchbar-ios{color:currentColor}ion-toolbar.ion-color.sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios, ion-toolbar.ion-color   .sc-ion-searchbar-ios-h   .searchbar-search-icon.sc-ion-searchbar-ios{color:currentColor;opacity:.5}ion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color)   .searchbar-input.sc-ion-searchbar-ios, ion-toolbar.ion-color   .sc-ion-searchbar-ios-h:not(.ion-color)   .searchbar-input.sc-ion-searchbar-ios{background:rgba(var(--ion-color-contrast-rgb),.07);color:currentColor}ion-toolbar.ion-color.sc-ion-searchbar-ios-h:not(.ion-color)   .searchbar-clear-button.sc-ion-searchbar-ios, ion-toolbar.ion-color   .sc-ion-searchbar-ios-h:not(.ion-color)   .searchbar-clear-button.sc-ion-searchbar-ios{color:currentColor;opacity:.5}"}static get styleMode(){return"ios"}}}}]);