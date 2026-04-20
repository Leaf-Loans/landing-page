function s(t,...r){if(t)return;let e=Error("Assertion Error"+(r.length>0?": "+r.join(" "):""));if(e.stack)try{let n=e.stack.split(`
`);n[1]?.includes("assert")?(n.splice(1,1),e.stack=n.join(`
`)):n[0]?.includes("assert")&&(n.splice(0,1),e.stack=n.join(`
`))}catch{}throw e}function i(t,r){throw r||new Error(t?`Unexpected value: ${t}`:"Application entered invalid state")}export{s as a,i as b};
//# sourceMappingURL=_assets/da72b7e536_chunk-BUC334RG.mjs.js.map
