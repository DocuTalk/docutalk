import{c as Q}from"./vendor-Cm6ldUtY.js";var B={exports:{}};(function(f,e){var t=typeof self<"u"?self:Q,n=function(){function r(){this.fetch=!1,this.DOMException=t.DOMException}return r.prototype=t,new r}();(function(r){(function(s){var a={searchParams:"URLSearchParams"in r,iterable:"Symbol"in r&&"iterator"in Symbol,blob:"FileReader"in r&&"Blob"in r&&function(){try{return new Blob,!0}catch{return!1}}(),formData:"FormData"in r,arrayBuffer:"ArrayBuffer"in r};function u(o){return o&&DataView.prototype.isPrototypeOf(o)}if(a.arrayBuffer)var l=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],w=ArrayBuffer.isView||function(o){return o&&l.indexOf(Object.prototype.toString.call(o))>-1};function g(o){if(typeof o!="string"&&(o=String(o)),/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(o))throw new TypeError("Invalid character in header field name");return o.toLowerCase()}function M(o){return typeof o!="string"&&(o=String(o)),o}function R(o){var c={next:function(){var h=o.shift();return{done:h===void 0,value:h}}};return a.iterable&&(c[Symbol.iterator]=function(){return c}),c}function v(o){this.map={},o instanceof v?o.forEach(function(c,h){this.append(h,c)},this):Array.isArray(o)?o.forEach(function(c){this.append(c[0],c[1])},this):o&&Object.getOwnPropertyNames(o).forEach(function(c){this.append(c,o[c])},this)}v.prototype.append=function(o,c){o=g(o),c=M(c);var h=this.map[o];this.map[o]=h?h+", "+c:c},v.prototype.delete=function(o){delete this.map[g(o)]},v.prototype.get=function(o){return o=g(o),this.has(o)?this.map[o]:null},v.prototype.has=function(o){return this.map.hasOwnProperty(g(o))},v.prototype.set=function(o,c){this.map[g(o)]=M(c)},v.prototype.forEach=function(o,c){for(var h in this.map)this.map.hasOwnProperty(h)&&o.call(c,this.map[h],h,this)},v.prototype.keys=function(){var o=[];return this.forEach(function(c,h){o.push(h)}),R(o)},v.prototype.values=function(){var o=[];return this.forEach(function(c){o.push(c)}),R(o)},v.prototype.entries=function(){var o=[];return this.forEach(function(c,h){o.push([h,c])}),R(o)},a.iterable&&(v.prototype[Symbol.iterator]=v.prototype.entries);function P(o){if(o.bodyUsed)return Promise.reject(new TypeError("Already read"));o.bodyUsed=!0}function U(o){return new Promise(function(c,h){o.onload=function(){c(o.result)},o.onerror=function(){h(o.error)}})}function S(o){var c=new FileReader,h=U(c);return c.readAsArrayBuffer(o),h}function _(o){var c=new FileReader,h=U(c);return c.readAsText(o),h}function x(o){for(var c=new Uint8Array(o),h=new Array(c.length),q=0;q<c.length;q++)h[q]=String.fromCharCode(c[q]);return h.join("")}function $(o){if(o.slice)return o.slice(0);var c=new Uint8Array(o.byteLength);return c.set(new Uint8Array(o)),c.buffer}function D(){return this.bodyUsed=!1,this._initBody=function(o){this._bodyInit=o,o?typeof o=="string"?this._bodyText=o:a.blob&&Blob.prototype.isPrototypeOf(o)?this._bodyBlob=o:a.formData&&FormData.prototype.isPrototypeOf(o)?this._bodyFormData=o:a.searchParams&&URLSearchParams.prototype.isPrototypeOf(o)?this._bodyText=o.toString():a.arrayBuffer&&a.blob&&u(o)?(this._bodyArrayBuffer=$(o.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):a.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(o)||w(o))?this._bodyArrayBuffer=$(o):this._bodyText=o=Object.prototype.toString.call(o):this._bodyText="",this.headers.get("content-type")||(typeof o=="string"?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):a.searchParams&&URLSearchParams.prototype.isPrototypeOf(o)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},a.blob&&(this.blob=function(){var o=P(this);if(o)return o;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?P(this)||Promise.resolve(this._bodyArrayBuffer):this.blob().then(S)}),this.text=function(){var o=P(this);if(o)return o;if(this._bodyBlob)return _(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(x(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},a.formData&&(this.formData=function(){return this.text().then(N)}),this.json=function(){return this.text().then(JSON.parse)},this}var F=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function C(o){var c=o.toUpperCase();return F.indexOf(c)>-1?c:o}function k(o,c){c=c||{};var h=c.body;if(o instanceof k){if(o.bodyUsed)throw new TypeError("Already read");this.url=o.url,this.credentials=o.credentials,c.headers||(this.headers=new v(o.headers)),this.method=o.method,this.mode=o.mode,this.signal=o.signal,!h&&o._bodyInit!=null&&(h=o._bodyInit,o.bodyUsed=!0)}else this.url=String(o);if(this.credentials=c.credentials||this.credentials||"same-origin",(c.headers||!this.headers)&&(this.headers=new v(c.headers)),this.method=C(c.method||this.method||"GET"),this.mode=c.mode||this.mode||null,this.signal=c.signal||this.signal,this.referrer=null,(this.method==="GET"||this.method==="HEAD")&&h)throw new TypeError("Body not allowed for GET or HEAD requests");this._initBody(h)}k.prototype.clone=function(){return new k(this,{body:this._bodyInit})};function N(o){var c=new FormData;return o.trim().split("&").forEach(function(h){if(h){var q=h.split("="),j=q.shift().replace(/\+/g," "),m=q.join("=").replace(/\+/g," ");c.append(decodeURIComponent(j),decodeURIComponent(m))}}),c}function H(o){var c=new v,h=o.replace(/\r?\n[\t ]+/g," ");return h.split(/\r?\n/).forEach(function(q){var j=q.split(":"),m=j.shift().trim();if(m){var L=j.join(":").trim();c.append(m,L)}}),c}D.call(k.prototype);function I(o,c){c||(c={}),this.type="default",this.status=c.status===void 0?200:c.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in c?c.statusText:"OK",this.headers=new v(c.headers),this.url=c.url||"",this._initBody(o)}D.call(I.prototype),I.prototype.clone=function(){return new I(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new v(this.headers),url:this.url})},I.error=function(){var o=new I(null,{status:0,statusText:""});return o.type="error",o};var V=[301,302,303,307,308];I.redirect=function(o,c){if(V.indexOf(c)===-1)throw new RangeError("Invalid status code");return new I(null,{status:c,headers:{location:o}})},s.DOMException=r.DOMException;try{new s.DOMException}catch{s.DOMException=function(c,h){this.message=c,this.name=h;var q=Error(c);this.stack=q.stack},s.DOMException.prototype=Object.create(Error.prototype),s.DOMException.prototype.constructor=s.DOMException}function T(o,c){return new Promise(function(h,q){var j=new k(o,c);if(j.signal&&j.signal.aborted)return q(new s.DOMException("Aborted","AbortError"));var m=new XMLHttpRequest;function L(){m.abort()}m.onload=function(){var E={status:m.status,statusText:m.statusText,headers:H(m.getAllResponseHeaders()||"")};E.url="responseURL"in m?m.responseURL:E.headers.get("X-Request-URL");var O="response"in m?m.response:m.responseText;h(new I(O,E))},m.onerror=function(){q(new TypeError("Network request failed"))},m.ontimeout=function(){q(new TypeError("Network request failed"))},m.onabort=function(){q(new s.DOMException("Aborted","AbortError"))},m.open(j.method,j.url,!0),j.credentials==="include"?m.withCredentials=!0:j.credentials==="omit"&&(m.withCredentials=!1),"responseType"in m&&a.blob&&(m.responseType="blob"),j.headers.forEach(function(E,O){m.setRequestHeader(O,E)}),j.signal&&(j.signal.addEventListener("abort",L),m.onreadystatechange=function(){m.readyState===4&&j.signal.removeEventListener("abort",L)}),m.send(typeof j._bodyInit>"u"?null:j._bodyInit)})}return T.polyfill=!0,r.fetch||(r.fetch=T,r.Headers=v,r.Request=k,r.Response=I),s.Headers=v,s.Request=k,s.Response=I,s.fetch=T,Object.defineProperty(s,"__esModule",{value:!0}),s})({})})(n),n.fetch.ponyfill=!0,delete n.fetch.polyfill;var i=n;e=i.fetch,e.default=i.fetch,e.fetch=i.fetch,e.Headers=i.Headers,e.Request=i.Request,e.Response=i.Response,f.exports=e})(B,B.exports);var W=B.exports;function p(f,e,t,n){function i(r){return r instanceof t?r:new t(function(s){s(r)})}return new(t||(t=Promise))(function(r,s){function a(w){try{l(n.next(w))}catch(g){s(g)}}function u(w){try{l(n.throw(w))}catch(g){s(g)}}function l(w){w.done?r(w.value):i(w.value).then(a,u)}l((n=n.apply(f,[])).next())})}class b{constructor(e){this.client=e}static flatten(e,t=""){let n={};for(const i in e){let r=e[i],s=t?`${t}[${i}]`:i;Array.isArray(r)?n=Object.assign(n,this.flatten(r,s)):n[s]=r}return n}}b.CHUNK_SIZE=5*1024*1024;class y{}y.equal=(f,e)=>y.addQuery(f,"equal",e);y.notEqual=(f,e)=>y.addQuery(f,"notEqual",e);y.lessThan=(f,e)=>y.addQuery(f,"lessThan",e);y.lessThanEqual=(f,e)=>y.addQuery(f,"lessThanEqual",e);y.greaterThan=(f,e)=>y.addQuery(f,"greaterThan",e);y.greaterThanEqual=(f,e)=>y.addQuery(f,"greaterThanEqual",e);y.isNull=f=>`isNull("${f}")`;y.isNotNull=f=>`isNotNull("${f}")`;y.between=(f,e,t)=>`between("${f}", ${y.parseValues(e)}, ${y.parseValues(t)})`;y.startsWith=(f,e)=>y.addQuery(f,"startsWith",e);y.endsWith=(f,e)=>y.addQuery(f,"endsWith",e);y.select=f=>`select([${f.map(e=>`"${e}"`).join(",")}])`;y.search=(f,e)=>y.addQuery(f,"search",e);y.orderDesc=f=>`orderDesc("${f}")`;y.orderAsc=f=>`orderAsc("${f}")`;y.cursorAfter=f=>`cursorAfter("${f}")`;y.cursorBefore=f=>`cursorBefore("${f}")`;y.limit=f=>`limit(${f})`;y.offset=f=>`offset(${f})`;y.addQuery=(f,e,t)=>t instanceof Array?`${e}("${f}", [${t.map(n=>y.parseValues(n)).join(",")}])`:`${e}("${f}", [${y.parseValues(t)}])`;y.parseValues=f=>typeof f=="string"||f instanceof String?`"${f}"`:`${f}`;class d extends Error{constructor(e,t=0,n="",i=""){super(e),this.name="AppwriteException",this.message=e,this.code=t,this.type=n,this.response=i}}class z{constructor(){this.config={endpoint:"https://HOSTNAME/v1",endpointRealtime:"",project:"",jwt:"",locale:""},this.headers={"x-sdk-name":"Web","x-sdk-platform":"client","x-sdk-language":"web","x-sdk-version":"13.0.2","X-Appwrite-Response-Format":"1.4.0"},this.realtime={socket:void 0,timeout:void 0,url:"",channels:new Set,subscriptions:new Map,subscriptionsCounter:0,reconnect:!0,reconnectAttempts:0,lastMessage:void 0,connect:()=>{clearTimeout(this.realtime.timeout),this.realtime.timeout=window==null?void 0:window.setTimeout(()=>{this.realtime.createSocket()},50)},getTimeout:()=>{switch(!0){case this.realtime.reconnectAttempts<5:return 1e3;case this.realtime.reconnectAttempts<15:return 5e3;case this.realtime.reconnectAttempts<100:return 1e4;default:return 6e4}},createSocket:()=>{var e,t;if(this.realtime.channels.size<1)return;const n=new URLSearchParams;n.set("project",this.config.project),this.realtime.channels.forEach(r=>{n.append("channels[]",r)});const i=this.config.endpointRealtime+"/realtime?"+n.toString();(i!==this.realtime.url||!this.realtime.socket||((e=this.realtime.socket)===null||e===void 0?void 0:e.readyState)>WebSocket.OPEN)&&(this.realtime.socket&&((t=this.realtime.socket)===null||t===void 0?void 0:t.readyState)<WebSocket.CLOSING&&(this.realtime.reconnect=!1,this.realtime.socket.close()),this.realtime.url=i,this.realtime.socket=new WebSocket(i),this.realtime.socket.addEventListener("message",this.realtime.onMessage),this.realtime.socket.addEventListener("open",r=>{this.realtime.reconnectAttempts=0}),this.realtime.socket.addEventListener("close",r=>{var s,a,u;if(!this.realtime.reconnect||((a=(s=this.realtime)===null||s===void 0?void 0:s.lastMessage)===null||a===void 0?void 0:a.type)==="error"&&((u=this.realtime)===null||u===void 0?void 0:u.lastMessage.data).code===1008){this.realtime.reconnect=!0;return}const l=this.realtime.getTimeout();console.error(`Realtime got disconnected. Reconnect will be attempted in ${l/1e3} seconds.`,r.reason),setTimeout(()=>{this.realtime.reconnectAttempts++,this.realtime.createSocket()},l)}))},onMessage:e=>{var t,n;try{const i=JSON.parse(e.data);switch(this.realtime.lastMessage=i,i.type){case"connected":const r=JSON.parse((t=window.localStorage.getItem("cookieFallback"))!==null&&t!==void 0?t:"{}"),s=r==null?void 0:r[`a_session_${this.config.project}`],a=i.data;s&&!a.user&&((n=this.realtime.socket)===null||n===void 0||n.send(JSON.stringify({type:"authentication",data:{session:s}})));break;case"event":let u=i.data;if(u!=null&&u.channels){if(!u.channels.some(w=>this.realtime.channels.has(w)))return;this.realtime.subscriptions.forEach(w=>{u.channels.some(g=>w.channels.includes(g))&&setTimeout(()=>w.callback(u))})}break;case"error":throw i.data;default:break}}catch(i){console.error(i)}},cleanUp:e=>{this.realtime.channels.forEach(t=>{e.includes(t)&&(Array.from(this.realtime.subscriptions).some(([i,r])=>r.channels.includes(t))||this.realtime.channels.delete(t))})}}}setEndpoint(e){return this.config.endpoint=e,this.config.endpointRealtime=this.config.endpointRealtime||this.config.endpoint.replace("https://","wss://").replace("http://","ws://"),this}setEndpointRealtime(e){return this.config.endpointRealtime=e,this}setProject(e){return this.headers["X-Appwrite-Project"]=e,this.config.project=e,this}setJWT(e){return this.headers["X-Appwrite-JWT"]=e,this.config.jwt=e,this}setLocale(e){return this.headers["X-Appwrite-Locale"]=e,this.config.locale=e,this}subscribe(e,t){let n=typeof e=="string"?[e]:e;n.forEach(r=>this.realtime.channels.add(r));const i=this.realtime.subscriptionsCounter++;return this.realtime.subscriptions.set(i,{channels:n,callback:t}),this.realtime.connect(),()=>{this.realtime.subscriptions.delete(i),this.realtime.cleanUp(n),this.realtime.connect()}}call(e,t,n={},i={}){var r,s;return p(this,void 0,void 0,function*(){e=e.toUpperCase(),n=Object.assign({},this.headers,n);let a={method:e,headers:n,credentials:"include"};if(typeof window<"u"&&window.localStorage&&(n["X-Fallback-Cookies"]=(r=window.localStorage.getItem("cookieFallback"))!==null&&r!==void 0?r:""),e==="GET")for(const[u,l]of Object.entries(b.flatten(i)))t.searchParams.append(u,l);else switch(n["content-type"]){case"application/json":a.body=JSON.stringify(i);break;case"multipart/form-data":let u=new FormData;for(const l in i)Array.isArray(i[l])?i[l].forEach(w=>{u.append(l+"[]",w)}):u.append(l,i[l]);a.body=u,delete n["content-type"];break}try{let u=null;const l=yield W.fetch(t.toString(),a);if(!((s=l.headers.get("content-type"))===null||s===void 0)&&s.includes("application/json")?u=yield l.json():u={message:yield l.text()},400<=l.status)throw new d(u==null?void 0:u.message,l.status,u==null?void 0:u.type,u);const w=l.headers.get("X-Fallback-Cookies");return typeof window<"u"&&window.localStorage&&w&&(window.console.warn("Appwrite is using localStorage for session management. Increase your security by adding a custom domain as your API endpoint."),window.localStorage.setItem("cookieFallback",w)),u}catch(u){throw u instanceof d?u:new d(u.message)}})}}class G extends b{constructor(e){super(e)}get(){return p(this,void 0,void 0,function*(){const e="/account",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("get",n,{"content-type":"application/json"},t)})}create(e,t,n,i){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "email"');if(typeof n>"u")throw new d('Missing required parameter: "password"');const r="/account",s={};typeof e<"u"&&(s.userId=e),typeof t<"u"&&(s.email=t),typeof n<"u"&&(s.password=n),typeof i<"u"&&(s.name=i);const a=new URL(this.client.config.endpoint+r);return yield this.client.call("post",a,{"content-type":"application/json"},s)})}updateEmail(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "email"');if(typeof t>"u")throw new d('Missing required parameter: "password"');const n="/account/email",i={};typeof e<"u"&&(i.email=e),typeof t<"u"&&(i.password=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("patch",r,{"content-type":"application/json"},i)})}listIdentities(e){return p(this,void 0,void 0,function*(){const t="/account/identities",n={};typeof e<"u"&&(n.queries=e);const i=new URL(this.client.config.endpoint+t);return yield this.client.call("get",i,{"content-type":"application/json"},n)})}deleteIdentity(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "identityId"');const t="/account/identities/{identityId}".replace("{identityId}",e),n={},i=new URL(this.client.config.endpoint+t);return yield this.client.call("delete",i,{"content-type":"application/json"},n)})}createJWT(){return p(this,void 0,void 0,function*(){const e="/account/jwt",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("post",n,{"content-type":"application/json"},t)})}listLogs(e){return p(this,void 0,void 0,function*(){const t="/account/logs",n={};typeof e<"u"&&(n.queries=e);const i=new URL(this.client.config.endpoint+t);return yield this.client.call("get",i,{"content-type":"application/json"},n)})}updateName(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "name"');const t="/account/name",n={};typeof e<"u"&&(n.name=e);const i=new URL(this.client.config.endpoint+t);return yield this.client.call("patch",i,{"content-type":"application/json"},n)})}updatePassword(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "password"');const n="/account/password",i={};typeof e<"u"&&(i.password=e),typeof t<"u"&&(i.oldPassword=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("patch",r,{"content-type":"application/json"},i)})}updatePhone(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "phone"');if(typeof t>"u")throw new d('Missing required parameter: "password"');const n="/account/phone",i={};typeof e<"u"&&(i.phone=e),typeof t<"u"&&(i.password=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("patch",r,{"content-type":"application/json"},i)})}getPrefs(){return p(this,void 0,void 0,function*(){const e="/account/prefs",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("get",n,{"content-type":"application/json"},t)})}updatePrefs(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "prefs"');const t="/account/prefs",n={};typeof e<"u"&&(n.prefs=e);const i=new URL(this.client.config.endpoint+t);return yield this.client.call("patch",i,{"content-type":"application/json"},n)})}createRecovery(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "email"');if(typeof t>"u")throw new d('Missing required parameter: "url"');const n="/account/recovery",i={};typeof e<"u"&&(i.email=e),typeof t<"u"&&(i.url=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("post",r,{"content-type":"application/json"},i)})}updateRecovery(e,t,n,i){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "secret"');if(typeof n>"u")throw new d('Missing required parameter: "password"');if(typeof i>"u")throw new d('Missing required parameter: "passwordAgain"');const r="/account/recovery",s={};typeof e<"u"&&(s.userId=e),typeof t<"u"&&(s.secret=t),typeof n<"u"&&(s.password=n),typeof i<"u"&&(s.passwordAgain=i);const a=new URL(this.client.config.endpoint+r);return yield this.client.call("put",a,{"content-type":"application/json"},s)})}listSessions(){return p(this,void 0,void 0,function*(){const e="/account/sessions",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("get",n,{"content-type":"application/json"},t)})}deleteSessions(){return p(this,void 0,void 0,function*(){const e="/account/sessions",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("delete",n,{"content-type":"application/json"},t)})}createAnonymousSession(){return p(this,void 0,void 0,function*(){const e="/account/sessions/anonymous",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("post",n,{"content-type":"application/json"},t)})}createEmailSession(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "email"');if(typeof t>"u")throw new d('Missing required parameter: "password"');const n="/account/sessions/email",i={};typeof e<"u"&&(i.email=e),typeof t<"u"&&(i.password=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("post",r,{"content-type":"application/json"},i)})}createMagicURLSession(e,t,n){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "email"');const i="/account/sessions/magic-url",r={};typeof e<"u"&&(r.userId=e),typeof t<"u"&&(r.email=t),typeof n<"u"&&(r.url=n);const s=new URL(this.client.config.endpoint+i);return yield this.client.call("post",s,{"content-type":"application/json"},r)})}updateMagicURLSession(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "secret"');const n="/account/sessions/magic-url",i={};typeof e<"u"&&(i.userId=e),typeof t<"u"&&(i.secret=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("put",r,{"content-type":"application/json"},i)})}createOAuth2Session(e,t,n,i){if(typeof e>"u")throw new d('Missing required parameter: "provider"');const r="/account/sessions/oauth2/{provider}".replace("{provider}",e),s={};typeof t<"u"&&(s.success=t),typeof n<"u"&&(s.failure=n),typeof i<"u"&&(s.scopes=i);const a=new URL(this.client.config.endpoint+r);s.project=this.client.config.project;for(const[u,l]of Object.entries(b.flatten(s)))a.searchParams.append(u,l);if(typeof window<"u"&&(window!=null&&window.location))window.location.href=a.toString();else return a}createPhoneSession(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "phone"');const n="/account/sessions/phone",i={};typeof e<"u"&&(i.userId=e),typeof t<"u"&&(i.phone=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("post",r,{"content-type":"application/json"},i)})}updatePhoneSession(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "secret"');const n="/account/sessions/phone",i={};typeof e<"u"&&(i.userId=e),typeof t<"u"&&(i.secret=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("put",r,{"content-type":"application/json"},i)})}getSession(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "sessionId"');const t="/account/sessions/{sessionId}".replace("{sessionId}",e),n={},i=new URL(this.client.config.endpoint+t);return yield this.client.call("get",i,{"content-type":"application/json"},n)})}updateSession(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "sessionId"');const t="/account/sessions/{sessionId}".replace("{sessionId}",e),n={},i=new URL(this.client.config.endpoint+t);return yield this.client.call("patch",i,{"content-type":"application/json"},n)})}deleteSession(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "sessionId"');const t="/account/sessions/{sessionId}".replace("{sessionId}",e),n={},i=new URL(this.client.config.endpoint+t);return yield this.client.call("delete",i,{"content-type":"application/json"},n)})}updateStatus(){return p(this,void 0,void 0,function*(){const e="/account/status",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("patch",n,{"content-type":"application/json"},t)})}createVerification(e){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "url"');const t="/account/verification",n={};typeof e<"u"&&(n.url=e);const i=new URL(this.client.config.endpoint+t);return yield this.client.call("post",i,{"content-type":"application/json"},n)})}updateVerification(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "secret"');const n="/account/verification",i={};typeof e<"u"&&(i.userId=e),typeof t<"u"&&(i.secret=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("put",r,{"content-type":"application/json"},i)})}createPhoneVerification(){return p(this,void 0,void 0,function*(){const e="/account/verification/phone",t={},n=new URL(this.client.config.endpoint+e);return yield this.client.call("post",n,{"content-type":"application/json"},t)})}updatePhoneVerification(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "userId"');if(typeof t>"u")throw new d('Missing required parameter: "secret"');const n="/account/verification/phone",i={};typeof e<"u"&&(i.userId=e),typeof t<"u"&&(i.secret=t);const r=new URL(this.client.config.endpoint+n);return yield this.client.call("put",r,{"content-type":"application/json"},i)})}}class J extends b{constructor(e){super(e)}getBrowser(e,t,n,i){if(typeof e>"u")throw new d('Missing required parameter: "code"');const r="/avatars/browsers/{code}".replace("{code}",e),s={};typeof t<"u"&&(s.width=t),typeof n<"u"&&(s.height=n),typeof i<"u"&&(s.quality=i);const a=new URL(this.client.config.endpoint+r);s.project=this.client.config.project;for(const[u,l]of Object.entries(b.flatten(s)))a.searchParams.append(u,l);return a}getCreditCard(e,t,n,i){if(typeof e>"u")throw new d('Missing required parameter: "code"');const r="/avatars/credit-cards/{code}".replace("{code}",e),s={};typeof t<"u"&&(s.width=t),typeof n<"u"&&(s.height=n),typeof i<"u"&&(s.quality=i);const a=new URL(this.client.config.endpoint+r);s.project=this.client.config.project;for(const[u,l]of Object.entries(b.flatten(s)))a.searchParams.append(u,l);return a}getFavicon(e){if(typeof e>"u")throw new d('Missing required parameter: "url"');const t="/avatars/favicon",n={};typeof e<"u"&&(n.url=e);const i=new URL(this.client.config.endpoint+t);n.project=this.client.config.project;for(const[r,s]of Object.entries(b.flatten(n)))i.searchParams.append(r,s);return i}getFlag(e,t,n,i){if(typeof e>"u")throw new d('Missing required parameter: "code"');const r="/avatars/flags/{code}".replace("{code}",e),s={};typeof t<"u"&&(s.width=t),typeof n<"u"&&(s.height=n),typeof i<"u"&&(s.quality=i);const a=new URL(this.client.config.endpoint+r);s.project=this.client.config.project;for(const[u,l]of Object.entries(b.flatten(s)))a.searchParams.append(u,l);return a}getImage(e,t,n){if(typeof e>"u")throw new d('Missing required parameter: "url"');const i="/avatars/image",r={};typeof e<"u"&&(r.url=e),typeof t<"u"&&(r.width=t),typeof n<"u"&&(r.height=n);const s=new URL(this.client.config.endpoint+i);r.project=this.client.config.project;for(const[a,u]of Object.entries(b.flatten(r)))s.searchParams.append(a,u);return s}getInitials(e,t,n,i){const r="/avatars/initials",s={};typeof e<"u"&&(s.name=e),typeof t<"u"&&(s.width=t),typeof n<"u"&&(s.height=n),typeof i<"u"&&(s.background=i);const a=new URL(this.client.config.endpoint+r);s.project=this.client.config.project;for(const[u,l]of Object.entries(b.flatten(s)))a.searchParams.append(u,l);return a}getQR(e,t,n,i){if(typeof e>"u")throw new d('Missing required parameter: "text"');const r="/avatars/qr",s={};typeof e<"u"&&(s.text=e),typeof t<"u"&&(s.size=t),typeof n<"u"&&(s.margin=n),typeof i<"u"&&(s.download=i);const a=new URL(this.client.config.endpoint+r);s.project=this.client.config.project;for(const[u,l]of Object.entries(b.flatten(s)))a.searchParams.append(u,l);return a}}class K extends b{constructor(e){super(e)}listDocuments(e,t,n){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "databaseId"');if(typeof t>"u")throw new d('Missing required parameter: "collectionId"');const i="/databases/{databaseId}/collections/{collectionId}/documents".replace("{databaseId}",e).replace("{collectionId}",t),r={};typeof n<"u"&&(r.queries=n);const s=new URL(this.client.config.endpoint+i);return yield this.client.call("get",s,{"content-type":"application/json"},r)})}createDocument(e,t,n,i,r){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "databaseId"');if(typeof t>"u")throw new d('Missing required parameter: "collectionId"');if(typeof n>"u")throw new d('Missing required parameter: "documentId"');if(typeof i>"u")throw new d('Missing required parameter: "data"');const s="/databases/{databaseId}/collections/{collectionId}/documents".replace("{databaseId}",e).replace("{collectionId}",t),a={};typeof n<"u"&&(a.documentId=n),typeof i<"u"&&(a.data=i),typeof r<"u"&&(a.permissions=r);const u=new URL(this.client.config.endpoint+s);return yield this.client.call("post",u,{"content-type":"application/json"},a)})}getDocument(e,t,n,i){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "databaseId"');if(typeof t>"u")throw new d('Missing required parameter: "collectionId"');if(typeof n>"u")throw new d('Missing required parameter: "documentId"');const r="/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}",e).replace("{collectionId}",t).replace("{documentId}",n),s={};typeof i<"u"&&(s.queries=i);const a=new URL(this.client.config.endpoint+r);return yield this.client.call("get",a,{"content-type":"application/json"},s)})}updateDocument(e,t,n,i,r){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "databaseId"');if(typeof t>"u")throw new d('Missing required parameter: "collectionId"');if(typeof n>"u")throw new d('Missing required parameter: "documentId"');const s="/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}",e).replace("{collectionId}",t).replace("{documentId}",n),a={};typeof i<"u"&&(a.data=i),typeof r<"u"&&(a.permissions=r);const u=new URL(this.client.config.endpoint+s);return yield this.client.call("patch",u,{"content-type":"application/json"},a)})}deleteDocument(e,t,n){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "databaseId"');if(typeof t>"u")throw new d('Missing required parameter: "collectionId"');if(typeof n>"u")throw new d('Missing required parameter: "documentId"');const i="/databases/{databaseId}/collections/{collectionId}/documents/{documentId}".replace("{databaseId}",e).replace("{collectionId}",t).replace("{documentId}",n),r={},s=new URL(this.client.config.endpoint+i);return yield this.client.call("delete",s,{"content-type":"application/json"},r)})}}class Z extends b{constructor(e){super(e)}listFiles(e,t,n){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');const i="/storage/buckets/{bucketId}/files".replace("{bucketId}",e),r={};typeof t<"u"&&(r.queries=t),typeof n<"u"&&(r.search=n);const s=new URL(this.client.config.endpoint+i);return yield this.client.call("get",s,{"content-type":"application/json"},r)})}createFile(e,t,n,i,r=s=>{}){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');if(typeof n>"u")throw new d('Missing required parameter: "file"');const s="/storage/buckets/{bucketId}/files".replace("{bucketId}",e),a={};typeof t<"u"&&(a.fileId=t),typeof n<"u"&&(a.file=n),typeof i<"u"&&(a.permissions=i);const u=new URL(this.client.config.endpoint+s);if(!(n instanceof File))throw new d('Parameter "file" has to be a File.');const l=n.size;if(l<=b.CHUNK_SIZE)return yield this.client.call("post",u,{"content-type":"multipart/form-data"},a);const w={"content-type":"multipart/form-data"};let g=0,M;if(t!="unique()")try{M=yield this.client.call("GET",new URL(this.client.config.endpoint+s+"/"+t),w),g=M.chunksUploaded*b.CHUNK_SIZE}catch{}for(;g<l;){let R=Math.min(g+b.CHUNK_SIZE-1,l-1);w["content-range"]="bytes "+g+"-"+R+"/"+l,M&&M.$id&&(w["x-appwrite-id"]=M.$id);const v=n.slice(g,R+1);a.file=new File([v],n.name),M=yield this.client.call("post",u,w,a),r&&r({$id:M.$id,progress:g/l*100,sizeUploaded:g,chunksTotal:M.chunksTotal,chunksUploaded:M.chunksUploaded}),g+=b.CHUNK_SIZE}return M})}getFile(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');const n="/storage/buckets/{bucketId}/files/{fileId}".replace("{bucketId}",e).replace("{fileId}",t),i={},r=new URL(this.client.config.endpoint+n);return yield this.client.call("get",r,{"content-type":"application/json"},i)})}updateFile(e,t,n,i){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');const r="/storage/buckets/{bucketId}/files/{fileId}".replace("{bucketId}",e).replace("{fileId}",t),s={};typeof n<"u"&&(s.name=n),typeof i<"u"&&(s.permissions=i);const a=new URL(this.client.config.endpoint+r);return yield this.client.call("put",a,{"content-type":"application/json"},s)})}deleteFile(e,t){return p(this,void 0,void 0,function*(){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');const n="/storage/buckets/{bucketId}/files/{fileId}".replace("{bucketId}",e).replace("{fileId}",t),i={},r=new URL(this.client.config.endpoint+n);return yield this.client.call("delete",r,{"content-type":"application/json"},i)})}getFileDownload(e,t){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');const n="/storage/buckets/{bucketId}/files/{fileId}/download".replace("{bucketId}",e).replace("{fileId}",t),i={},r=new URL(this.client.config.endpoint+n);i.project=this.client.config.project;for(const[s,a]of Object.entries(b.flatten(i)))r.searchParams.append(s,a);return r}getFilePreview(e,t,n,i,r,s,a,u,l,w,g,M,R){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');const v="/storage/buckets/{bucketId}/files/{fileId}/preview".replace("{bucketId}",e).replace("{fileId}",t),P={};typeof n<"u"&&(P.width=n),typeof i<"u"&&(P.height=i),typeof r<"u"&&(P.gravity=r),typeof s<"u"&&(P.quality=s),typeof a<"u"&&(P.borderWidth=a),typeof u<"u"&&(P.borderColor=u),typeof l<"u"&&(P.borderRadius=l),typeof w<"u"&&(P.opacity=w),typeof g<"u"&&(P.rotation=g),typeof M<"u"&&(P.background=M),typeof R<"u"&&(P.output=R);const U=new URL(this.client.config.endpoint+v);P.project=this.client.config.project;for(const[S,_]of Object.entries(b.flatten(P)))U.searchParams.append(S,_);return U}getFileView(e,t){if(typeof e>"u")throw new d('Missing required parameter: "bucketId"');if(typeof t>"u")throw new d('Missing required parameter: "fileId"');const n="/storage/buckets/{bucketId}/files/{fileId}/view".replace("{bucketId}",e).replace("{fileId}",t),i={},r=new URL(this.client.config.endpoint+n);i.project=this.client.config.project;for(const[s,a]of Object.entries(b.flatten(i)))r.searchParams.append(s,a);return r}}class A{}A.read=f=>`read("${f}")`;A.write=f=>`write("${f}")`;A.create=f=>`create("${f}")`;A.update=f=>`update("${f}")`;A.delete=f=>`delete("${f}")`;class Y{static any(){return"any"}static user(e,t=""){return t===""?`user:${e}`:`user:${e}/${t}`}static users(e=""){return e===""?"users":`users/${e}`}static guests(){return"guests"}static team(e,t=""){return t===""?`team:${e}`:`team:${e}/${t}`}static member(e){return`member:${e}`}static label(e){return`label:${e}`}}class ee{static custom(e){return e}static unique(){return"unique()"}}export{G as A,z as C,K as D,ee as I,A as P,y as Q,Y as R,Z as S,J as a};
