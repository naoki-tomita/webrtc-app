parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"xEjK":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.Verbinden=void 0;var e=function(){function e(e){this._members=[],this.observables={},this._id=Math.random().toString(32).substring(2),this.client=new WebSocket(e+"?id="+this._id),this.client.addEventListener("message",this.receiveMessage.bind(this))}return Object.defineProperty(e.prototype,"id",{get:function(){return this._id},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"members",{get:function(){var e=this;return this._members.filter(function(t){return t!==e.id})},enumerable:!1,configurable:!0}),e.prototype.receiveMessage=function(e){var t=this,n=JSON.parse(e.data);switch(n.type){case"list":return this._members=n.data,void this.observables.__member_changed__.forEach(function(e){return e("__server__",t._members)});default:return void this.observables[n.channel].forEach(function(e){return e(n.id,n.data)})}},e.prototype.on=function(e,t){this.observables[e]=this.observables[e]||[],this.observables[e].push(t)},e.prototype.onMemberChanged=function(e){this.observables.__member_changed__.push(e)},e.prototype.channel=function(e){var t=this;return{target:function(n){return{send:function(r){return t._send({type:"target",channel:e,id:n,data:r})}}},broadcast:function(n){t._send({type:"broadcast",channel:e,data:n})}}},e.prototype.send=function(e,t,n){this._send({type:"target",channel:e,id:t,data:n})},e.prototype._send=function(e){this.client.send(JSON.stringify(e))},e}();exports.Verbinden=e;
},{}],"Focm":[function(require,module,exports) {
function e(e){return a(e)||r(e)||n(e)||t()}function t(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function n(e,t){if(e){if("string"==typeof e)return i(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?i(e,t):void 0}}function r(e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(e))return Array.from(e)}function a(e){if(Array.isArray(e))return i(e)}function i(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function c(e,t,n){return t&&s(e.prototype,t),n&&s(e,n),e}function u(e,t,n,r,a,i,o){try{var s=e[i](o),c=s.value}catch(u){return void n(u)}s.done?t(c):Promise.resolve(c).then(r,a)}function p(e){return function(){var t=this,n=arguments;return new Promise(function(r,a){var i=e.apply(t,n);function o(e){u(i,r,a,o,s,"next",e)}function s(e){u(i,r,a,o,s,"throw",e)}o(void 0)})}}var f=require("verbinden/client"),l=f.Verbinden;function d(e,t){var n=document.createElement(e);Object.keys(t).forEach(function(e){if(e.startsWith("on"))n.addEventListener(e.substr(2).toLowerCase(),t[e]);else if("style"!==e)n.setAttribute(e,t[e]);else{var r=t.style;Object.keys(r).forEach(function(e){n.style[e]=r[e]})}});for(var r=arguments.length,a=new Array(r>2?r-2:0),i=2;i<r;i++)a[i-2]=arguments[i];return n.append.apply(n,a),n}var h=document.getElementById("app");function v(){return m.apply(this,arguments)}function m(){return(m=p(regeneratorRuntime.mark(function t(){var n,r;return regeneratorRuntime.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,navigator.mediaDevices.enumerateDevices();case 2:n=t.sent.filter(function(e){return"videoinput"===e.kind}),r=d.apply(void 0,["select",{}].concat(e(n.map(function(e){return d("option",{value:e.deviceId},e.label)})))),null==h||h.append(d("div",{},r,r,d("button",{onClick:function(){var e=p(regeneratorRuntime.mark(function e(){var t;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,y(r.value);case 2:(t=e.sent).getTracks().forEach(function(e){return x.addTrack(e,t)});case 4:case"end":return e.stop()}},e)}));return function(){return e.apply(this,arguments)}}()},"select")));case 5:case"end":return t.stop()}},t)}))).apply(this,arguments)}function y(e){return g.apply(this,arguments)}function g(){return(g=p(regeneratorRuntime.mark(function e(t){var n,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,navigator.mediaDevices.getUserMedia({video:{deviceId:{exact:t},frameRate:{ideal:10,max:15},width:480,height:300},audio:!1});case 2:return n=e.sent,r=d("video",{}),null==h||h.append(d("div",{},r)),r.srcObject=n,r.play(),e.abrupt("return",n);case 8:case"end":return e.stop()}},e)}))).apply(this,arguments)}function w(e){return b.apply(this,arguments)}function b(){return(b=p(regeneratorRuntime.mark(function e(t){var n,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:n=d("video",{}),r=d("button",{style:{position:"absolute",top:50,left:30,zIndex:1},onClick:function(){return r.style.display="none",n.play()}},"play"),null==h||h.append(d("div",{},r,n)),n.srcObject=t;case 4:case"end":return e.stop()}},e)}))).apply(this,arguments)}var k=function(){function e(){o(this,e),this.ID=Math.random().toString(32).substring(2),this.ws=new l("wss://webrtc-room7.herokuapp.com"),this.ws.on("signaling",this.onReceiveSdpMessage.bind(this)),this.peers={},this.tracks=[]}return c(e,[{key:"addTrack",value:function(e,t){var n=this;this.tracks.push({track:e,stream:t}),Object.keys(this.peers).forEach(function(r){n.peerInstance(r).addTrack(e,t)})}},{key:"peerInstance",value:function(e){var t=this;if(this.peers[e])return this.peers[e];var n=this.peers[e]=new RTCPeerConnection({iceServers:[{urls:"stun:stun.webrtc.ecl.ntt.com:3478"}]});return n.addEventListener("icecandidate",function(r){return!r.candidate&&t.sendSdpToId(e,n.localDescription||{})}),n.addEventListener("track",function(e){return e.streams.forEach(function(e){return w(e)})}),n.addEventListener("negotiationneeded",function(){var r=p(regeneratorRuntime.mark(function r(a){var i;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:return r.next=2,n.createOffer({offerToReceiveAudio:!0,offerToReceiveVideo:!0});case 2:if(i=r.sent,"stable"==n.signalingState){r.next=5;break}return r.abrupt("return");case 5:return r.next=7,n.setLocalDescription(i);case 7:t.sendSdpToId(e,n.localDescription||{});case 8:case"end":return r.stop()}},r)}));return function(e){return r.apply(this,arguments)}}()),this.tracks.forEach(function(e){var t=e.track,r=e.stream;return n.addTrack(t,r)}),n}},{key:"requestConnection",value:function(){var e=p(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:this.ws.members.forEach(this.requestConnect.bind(this));case 1:case"end":return e.stop()}},e,this)}));return function(){return e.apply(this,arguments)}}()},{key:"requestConnect",value:function(){var e=p(regeneratorRuntime.mark(function e(t){var n,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return n=this.peerInstance(t),e.next=3,n.createOffer();case 3:return r=e.sent,e.next=6,n.setLocalDescription(r);case 6:this.sendSdpToId(t,r);case 7:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"onOffer",value:function(){var e=p(regeneratorRuntime.mark(function e(t,n){var r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=this.peerInstance(t),e.next=3,r.setRemoteDescription(n);case 3:console.log("success to set remote description"),this.sendAnswerTo(t);case 5:case"end":return e.stop()}},e,this)}));return function(t,n){return e.apply(this,arguments)}}()},{key:"sendAnswerTo",value:function(){var e=p(regeneratorRuntime.mark(function e(t){var n,r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("connected"!==(n=this.peerInstance(t)).connectionState){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,n.createAnswer();case 5:return r=e.sent,e.next=8,n.setLocalDescription(r);case 8:this.sendSdpToId(t,n.localDescription||{});case 9:case"end":return e.stop()}},e,this)}));return function(t){return e.apply(this,arguments)}}()},{key:"onAnswer",value:function(){var e=p(regeneratorRuntime.mark(function e(t,n){var r;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:if("connected"!==(r=this.peerInstance(t)).connectionState){e.next=3;break}return e.abrupt("return");case 3:return e.next=5,r.setRemoteDescription(n);case 5:case"end":return e.stop()}},e,this)}));return function(t,n){return e.apply(this,arguments)}}()},{key:"sendSdpToId",value:function(e,t){console.log("send to: ",e,t.type),this.ws.channel("signaling").target(e).send(t)}},{key:"onReceiveSdpMessage",value:function(e,t){switch(t.type){case"offer":this.onOffer(e,t);break;case"answer":this.onAnswer(e,t)}}}]),e}(),x=new k;function R(){return I.apply(this,arguments)}function I(){return(I=p(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,v();case 2:setTimeout(function(){return x.requestConnection()},2e3);case 3:case"end":return e.stop()}},e)}))).apply(this,arguments)}R();
},{"verbinden/client":"xEjK"}]},{},["Focm"], null)
//# sourceMappingURL=/webapp.16a89ef7.js.map