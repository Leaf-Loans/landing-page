import{a as x}from"_assets/3db26aebda_chunk-YWBVRV5Y.mjs.js";import{m as p}from"_assets/1f368bc7fd_chunk-N2TZHYHR.mjs.js";import{a as h}from"_assets/ea1cce4797_chunk-JB2N3EQZ.mjs.js";import{c as a,e as c}from"_assets/a3d9eb7c95_chunk-AHQIRSXG.mjs.js";var f=a(V=>{"use strict";var L=x();V.useSubscription=function(e){return L.useSyncExternalStore(e.subscribe,e.getCurrentValue)}});var S=a((O,g)=>{"use strict";g.exports=f()});var l=c(h(),1),d=c(S(),1);var n=new Map,u=new Set;window.addEventListener("storage",e=>{if(!(e.storageArea!==localStorage||e.key===null))try{if(e.newValue===null)n.set(e.key,null);else if(e.oldValue!==e.newValue){let t=JSON.parse(e.newValue);n.set(e.key,t)}for(let t of u)t(e.key)}catch{}});function N(e){if(n.has(e))return n.get(e)??null;let t=localStorage.getItem(e);if(t)try{let r=JSON.parse(t);return n.set(e,r),r}catch{}return null}function m(e,t){if(t===null)n.set(e,null),localStorage.removeItem(e);else{n.set(e,t);let r=JSON.stringify(t);localStorage.setItem(e,r)}for(let r of u)r(e)}function I(e,t){let r=(0,l.useMemo)(()=>{function s(i){function o(C){C===e&&i()}return u.add(o),()=>u.delete(o)}return{getCurrentValue:()=>N(e),subscribe:s}},[e]),b=(0,d.useSubscription)(r)??t,w=(0,l.useCallback)(s=>{try{if(p(s)){let i=r.getCurrentValue()??t,o=s(i);m(e,o)}else m(e,s)}catch{}},[e,t,r.getCurrentValue]);return[b,w]}export{N as a,m as b,I as c};
/*! Bundled license information:

use-subscription/cjs/use-subscription.production.min.js:
  (**
   * @license React
   * use-subscription.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=_assets/3e61e171f3_chunk-HHOFF775.mjs.js.map
