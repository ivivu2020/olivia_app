(window.webpackJsonp=window.webpackJsonp||[]).push([[131],{Jy7L:function(e,o,t){"use strict";t.r(o),t.d(o,"shadow",function(){return i}),t.d(o,"iosTransitionAnimation",function(){return m}),t("gDZG");const n=500,r="cubic-bezier(0.36,0.66,0.04,1)",l="opacity",d="transform",a="translateX",c="0%",s=.8;function i(e){return e.shadowRoot||e}function m(e,o,t){const m="rtl"===o.ownerDocument.dir,f=m?"-99.5%":"99.5%",u=m?"33%":"-33%",T=t.enteringEl,b=t.leavingEl,y=new e;if(y.addElement(T).duration(t.duration||n).easing(t.easing||r).beforeRemoveClass("ion-page-invisible"),b&&o){const t=new e;t.addElement(o),y.add(t)}const S="back"===t.direction,w=T.querySelector(":scope > ion-content"),p=T.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *"),E=T.querySelectorAll(":scope > ion-header > ion-toolbar"),g=new e;if(w||0!==E.length||0!==p.length?(g.addElement(w),g.addElement(p)):g.addElement(T.querySelector(":scope > .ion-page, :scope > ion-nav, :scope > ion-tabs")),y.add(g),S?g.beforeClearStyles([l]).fromTo(a,u,c,!0).fromTo(l,s,1,!0):g.beforeClearStyles([l]).fromTo(a,f,c,!0),E.forEach(o=>{const t=new e;t.addElement(o),y.add(t);const n=new e;n.addElement(o.querySelector("ion-title"));const r=new e;r.addElement(o.querySelectorAll("ion-buttons,[menuToggle]"));const d=new e;d.addElement(o.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])"));const s=new e;s.addElement(i(o).querySelector(".toolbar-background"));const T=new e,b=o.querySelector("ion-back-button");if(b&&T.addElement(b),t.add(n).add(r).add(d).add(s).add(T),n.fromTo(l,.01,1,!0),r.fromTo(l,.01,1,!0),d.fromTo(l,.01,1,!0),S)n.fromTo(a,u,c,!0),d.fromTo(a,u,c,!0),T.fromTo(l,.01,1,!0);else if(n.fromTo(a,f,c,!0),d.fromTo(a,f,c,!0),s.beforeClearStyles([l]).fromTo(l,.01,1,!0),T.fromTo(l,.01,1,!0),b){const o=new e;o.addElement(i(b).querySelector(".button-text")).fromTo(a,m?"-100px":"100px","0px"),t.add(o)}}),b){const o=new e;o.addElement(b.querySelector(":scope > ion-content")),o.addElement(b.querySelectorAll(":scope > ion-header > *:not(ion-toolbar), :scope > ion-footer > *")),y.add(o),S?o.beforeClearStyles([l]).fromTo(a,c,m?"-100%":"100%"):o.fromTo(a,c,u,!0).fromTo(l,1,s,!0),b.querySelectorAll(":scope > ion-header > ion-toolbar").forEach(o=>{const t=new e;t.addElement(o);const n=new e;n.addElement(o.querySelector("ion-title"));const r=new e;r.addElement(o.querySelectorAll("ion-buttons,[menuToggle]"));const s=new e,f=o.querySelectorAll(":scope > *:not(ion-title):not(ion-buttons):not([menuToggle])");f.length>0&&s.addElement(f);const T=new e;T.addElement(i(o).querySelector(".toolbar-background"));const b=new e,w=o.querySelector("ion-back-button");if(w&&b.addElement(w),t.add(n).add(r).add(s).add(b).add(T),y.add(t),b.fromTo(l,.99,0),n.fromTo(l,.99,0),r.fromTo(l,.99,0,0),s.fromTo(l,.99,0),S){if(n.fromTo(a,c,m?"-100%":"100%"),s.fromTo(a,c,m?"-100%":"100%"),T.beforeClearStyles([l]).fromTo(l,1,.01),w){const o=new e;o.addElement(i(w).querySelector(".button-text")),o.fromTo(a,c,(m?-124:124)+"px"),t.add(o)}}else n.fromTo(a,c,u).afterClearStyles([d]),s.fromTo(a,c,u).afterClearStyles([d,l]),b.afterClearStyles([l]),n.afterClearStyles([l]),r.afterClearStyles([l])})}return Promise.resolve(y)}}}]);