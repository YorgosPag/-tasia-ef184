"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3609],{89762:function(e,t,n){n.d(t,{Ab:function(){return lq},Bt:function(){return lL},EK:function(){return ei},ET:function(){return lR},IO:function(){return lc},JU:function(){return oA},PL:function(){return lC},QT:function(){return lx},ST:function(){return oU},Xo:function(){return lp},ad:function(){return oP},ar:function(){return lf},cf:function(){return lV},hJ:function(){return oD},oe:function(){return lk},pl:function(){return lD},qs:function(){return lB},r7:function(){return lA},vr:function(){return lU}});var r,i,s,a,o=n(21480),l=n(65980),u=n(73693),h=n(32723),c=n(76552),d=n(4575),f=n(25566),m=n(9109).lW;let g="@firebase/firestore",p="4.9.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class y{constructor(e){this.uid=e}isAuthenticated(){return null!=this.uid}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}y.UNAUTHENTICATED=new y(null),y.GOOGLE_CREDENTIALS=new y("google-credentials-uid"),y.FIRST_PARTY=new y("first-party-uid"),y.MOCK_USER=new y("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let w="12.0.0",v=new u.Yd("@firebase/firestore");function I(){return v.logLevel}function T(e,...t){if(v.logLevel<=u.in.DEBUG){let n=t.map(b);v.debug(`Firestore (${w}): ${e}`,...n)}}function E(e,...t){if(v.logLevel<=u.in.ERROR){let n=t.map(b);v.error(`Firestore (${w}): ${e}`,...n)}}function _(e,...t){if(v.logLevel<=u.in.WARN){let n=t.map(b);v.warn(`Firestore (${w}): ${e}`,...n)}}function b(e){if("string"==typeof e)return e;try{/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */return JSON.stringify(e)}catch(t){return e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function S(e,t,n){let r="Unexpected state";"string"==typeof t?r=t:n=t,x(e,r,n)}function x(e,t,n){let r=`FIRESTORE (${w}) INTERNAL ASSERTION FAILED: ${t} (ID: ${e.toString(16)})`;if(void 0!==n)try{r+=" CONTEXT: "+JSON.stringify(n)}catch(e){r+=" CONTEXT: "+n}throw E(r),Error(r)}function N(e,t,n,r){let i="Unexpected state";"string"==typeof n?i=n:r=n,e||x(t,i,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let C={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends h.ZR{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class A{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class k{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class R{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable(()=>t(y.UNAUTHENTICATED))}shutdown(){}}class V{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable(()=>t(this.token.user))}shutdown(){this.changeListener=null}}class M{constructor(e){this.t=e,this.currentUser=y.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,t){N(void 0===this.o,42304);let n=this.i,r=e=>this.i!==n?(n=this.i,t(e)):Promise.resolve(),i=new A;this.o=()=>{this.i++,this.currentUser=this.u(),i.resolve(),i=new A,e.enqueueRetryable(()=>r(this.currentUser))};let s=()=>{let t=i;e.enqueueRetryable(async()=>{await t.promise,await r(this.currentUser)})},a=e=>{T("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=e,this.o&&(this.auth.addAuthTokenListener(this.o),s())};this.t.onInit(e=>a(e)),setTimeout(()=>{if(!this.auth){let e=this.t.getImmediate({optional:!0});e?a(e):(T("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new A)}},0),s()}getToken(){let e=this.i,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then(t=>this.i!==e?(T("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):t?(N("string"==typeof t.accessToken,31837,{l:t}),new k(t.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){let e=this.auth&&this.auth.getUid();return N(null===e||"string"==typeof e,2055,{h:e}),new y(e)}}class O{constructor(e,t,n){this.P=e,this.T=t,this.I=n,this.type="FirstParty",this.user=y.FIRST_PARTY,this.A=new Map}R(){return this.I?this.I():null}get headers(){this.A.set("X-Goog-AuthUser",this.P);let e=this.R();return e&&this.A.set("Authorization",e),this.T&&this.A.set("X-Goog-Iam-Authorization-Token",this.T),this.A}}class P{constructor(e,t,n){this.P=e,this.T=t,this.I=n}getToken(){return Promise.resolve(new O(this.P,this.T,this.I))}start(e,t){e.enqueueRetryable(()=>t(y.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class F{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class L{constructor(e,t){this.V=t,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,(0,o.rh)(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,t){N(void 0===this.o,3512);let n=e=>{null!=e.error&&T("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${e.error.message}`);let n=e.token!==this.m;return this.m=e.token,T("FirebaseAppCheckTokenProvider",`Received ${n?"new":"existing"} token.`),n?t(e.token):Promise.resolve()};this.o=t=>{e.enqueueRetryable(()=>n(t))};let r=e=>{T("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=e,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(e=>r(e)),setTimeout(()=>{if(!this.appCheck){let e=this.V.getImmediate({optional:!0});e?r(e):T("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new F(this.p));let e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(e=>e?(N("string"==typeof e.token,44558,{tokenResult:e}),this.m=e.token,new F(e.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class U{static newId(){let e=62*Math.floor(256/62),t="";for(;t.length<20;){let n=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){let t="undefined"!=typeof self&&(self.crypto||self.msCrypto),n=new Uint8Array(40);if(t&&"function"==typeof t.getRandomValues)t.getRandomValues(n);else for(let e=0;e<40;e++)n[e]=Math.floor(256*Math.random());return n}(0);for(let r=0;r<n.length;++r)t.length<20&&n[r]<e&&(t+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(n[r]%62))}return t}}function q(e,t){return e<t?-1:e>t?1:0}function B(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=e.charAt(r),i=t.charAt(r);if(n!==i)return z(n)===z(i)?q(n,i):z(n)?1:-1}return q(e.length,t.length)}function z(e){let t=e.charCodeAt(0);return t>=55296&&t<=57343}function K(e,t,n){return e.length===t.length&&e.every((e,r)=>n(e,t[r]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let G="__name__";class ${constructor(e,t,n){void 0===t?t=0:t>e.length&&S(637,{offset:t,range:e.length}),void 0===n?n=e.length-t:n>e.length-t&&S(1746,{length:n,range:e.length-t}),this.segments=e,this.offset=t,this.len=n}get length(){return this.len}isEqual(e){return 0===$.comparator(this,e)}child(e){let t=this.segments.slice(this.offset,this.limit());return e instanceof $?e.forEach(e=>{t.push(e)}):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=void 0===e?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return 0===this.length}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,n=this.limit();t<n;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){let n=Math.min(e.length,t.length);for(let r=0;r<n;r++){let n=$.compareSegments(e.get(r),t.get(r));if(0!==n)return n}return q(e.length,t.length)}static compareSegments(e,t){let n=$.isNumericId(e),r=$.isNumericId(t);return n&&!r?-1:!n&&r?1:n&&r?$.extractNumericId(e).compare($.extractNumericId(t)):B(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return c.z8.fromString(e.substring(4,e.length-2))}}class j extends ${construct(e,t,n){return new j(e,t,n)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){let t=[];for(let n of e){if(n.indexOf("//")>=0)throw new D(C.INVALID_ARGUMENT,`Invalid segment (${n}). Paths must not contain // in them.`);t.push(...n.split("/").filter(e=>e.length>0))}return new j(t)}static emptyPath(){return new j([])}}let Q=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class W extends ${construct(e,t,n){return new W(e,t,n)}static isValidIdentifier(e){return Q.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),W.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return 1===this.length&&this.get(0)===G}static keyField(){return new W([G])}static fromServerFormat(e){let t=[],n="",r=0,i=()=>{if(0===n.length)throw new D(C.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(n),n=""},s=!1;for(;r<e.length;){let t=e[r];if("\\"===t){if(r+1===e.length)throw new D(C.INVALID_ARGUMENT,"Path has trailing escape character: "+e);let t=e[r+1];if("\\"!==t&&"."!==t&&"`"!==t)throw new D(C.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);n+=t,r+=2}else"`"===t?s=!s:"."!==t||s?n+=t:i(),r++}if(i(),s)throw new D(C.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new W(t)}static emptyPath(){return new W([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class H{constructor(e){this.path=e}static fromPath(e){return new H(j.fromString(e))}static fromName(e){return new H(j.fromString(e).popFirst(5))}static empty(){return new H(j.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return null!==e&&0===j.comparator(this.path,e.path)}toString(){return this.path.toString()}static comparator(e,t){return j.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new H(new j(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Y(e,t,n){if(!n)throw new D(C.INVALID_ARGUMENT,`Function ${e}() cannot be called with an empty ${t}.`)}function X(e){if(!H.isDocumentKey(e))throw new D(C.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${e} has ${e.length}.`)}function J(e){if(H.isDocumentKey(e))throw new D(C.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${e} has ${e.length}.`)}function Z(e){return"object"==typeof e&&null!==e&&(Object.getPrototypeOf(e)===Object.prototype||null===Object.getPrototypeOf(e))}function ee(e){if(void 0===e)return"undefined";if(null===e)return"null";if("string"==typeof e)return e.length>20&&(e=`${e.substring(0,20)}...`),JSON.stringify(e);if("number"==typeof e||"boolean"==typeof e)return""+e;if("object"==typeof e){if(e instanceof Array)return"an array";{var t;let n=(t=e).constructor?t.constructor.name:null;return n?`a custom ${n} object`:"an object"}}return"function"==typeof e?"a function":S(12329,{type:typeof e})}function et(e,t){if("_delegate"in e&&(e=e._delegate),!(e instanceof t)){if(t.name===e.constructor.name)throw new D(C.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{let n=ee(e);throw new D(C.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${n}`)}}return e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function en(e,t){let n={typeString:e};return t&&(n.value=t),n}function er(e,t){let n;if(!Z(e))throw new D(C.INVALID_ARGUMENT,"JSON must be an object");for(let r in t)if(t[r]){let i=t[r].typeString,s="value"in t[r]?{value:t[r].value}:void 0;if(!(r in e)){n=`JSON missing required field: '${r}'`;break}let a=e[r];if(i&&typeof a!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(void 0!==s&&a!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new D(C.INVALID_ARGUMENT,n);return!0}class ei{static now(){return ei.fromMillis(Date.now())}static fromDate(e){return ei.fromMillis(e.getTime())}static fromMillis(e){let t=Math.floor(e/1e3);return new ei(t,Math.floor((e-1e3*t)*1e6))}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0||t>=1e9)throw new D(C.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<-62135596800||e>=253402300800)throw new D(C.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/1e6}_compareTo(e){return this.seconds===e.seconds?q(this.nanoseconds,e.nanoseconds):q(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:ei._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(er(e,ei._jsonSchema))return new ei(e.seconds,e.nanoseconds)}valueOf(){return String(this.seconds- -62135596800).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}ei._jsonSchemaVersion="firestore/timestamp/1.0",ei._jsonSchema={type:en("string",ei._jsonSchemaVersion),seconds:en("number"),nanoseconds:en("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class es{static fromTimestamp(e){return new es(e)}static min(){return new es(new ei(0,0))}static max(){return new es(new ei(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}class ea{constructor(e,t,n,r){this.indexId=e,this.collectionGroup=t,this.fields=n,this.indexState=r}}function eo(e){return e.fields.find(e=>2===e.kind)}function el(e){return e.fields.filter(e=>2!==e.kind)}ea.UNKNOWN_ID=-1;class eu{constructor(e,t){this.fieldPath=e,this.kind=t}}class eh{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new eh(0,ed.min())}}function ec(e){return new ed(e.readTime,e.key,-1)}class ed{constructor(e,t,n){this.readTime=e,this.documentKey=t,this.largestBatchId=n}static min(){return new ed(es.min(),H.empty(),-1)}static max(){return new ed(es.max(),H.empty(),-1)}}function ef(e,t){let n=e.readTime.compareTo(t.readTime);return 0!==n?n:0!==(n=H.comparator(e.documentKey,t.documentKey))?n:q(e.largestBatchId,t.largestBatchId)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let em="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class eg{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function ep(e){if(e.code!==C.FAILED_PRECONDITION||e.message!==em)throw e;T("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ey{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)},e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)})}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&S(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new ey((n,r)=>{this.nextCallback=t=>{this.wrapSuccess(e,t).next(n,r)},this.catchCallback=e=>{this.wrapFailure(t,e).next(n,r)}})}toPromise(){return new Promise((e,t)=>{this.next(e,t)})}wrapUserFunction(e){try{let t=e();return t instanceof ey?t:ey.resolve(t)}catch(e){return ey.reject(e)}}wrapSuccess(e,t){return e?this.wrapUserFunction(()=>e(t)):ey.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction(()=>e(t)):ey.reject(t)}static resolve(e){return new ey((t,n)=>{t(e)})}static reject(e){return new ey((t,n)=>{n(e)})}static waitFor(e){return new ey((t,n)=>{let r=0,i=0,s=!1;e.forEach(e=>{++r,e.next(()=>{++i,s&&i===r&&t()},e=>n(e))}),s=!0,i===r&&t()})}static or(e){let t=ey.resolve(!1);for(let n of e)t=t.next(e=>e?ey.resolve(e):n());return t}static forEach(e,t){let n=[];return e.forEach((e,r)=>{n.push(t.call(this,e,r))}),this.waitFor(n)}static mapArray(e,t){return new ey((n,r)=>{let i=e.length,s=Array(i),a=0;for(let o=0;o<i;o++){let l=o;t(e[l]).next(e=>{s[l]=e,++a===i&&n(s)},e=>r(e))}})}static doWhile(e,t){return new ey((n,r)=>{let i=()=>{!0===e()?t().next(()=>{i()},r):n()};i()})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ew="SimpleDb";class ev{static open(e,t,n,r){try{return new ev(t,e.transaction(r,n))}catch(e){throw new e_(t,e)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.S=new A,this.transaction.oncomplete=()=>{this.S.resolve()},this.transaction.onabort=()=>{t.error?this.S.reject(new e_(e,t.error)):this.S.resolve()},this.transaction.onerror=t=>{let n=eC(t.target.error);this.S.reject(new e_(e,n))}}get D(){return this.S.promise}abort(e){e&&this.S.reject(e),this.aborted||(T(ew,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}C(){let e=this.transaction;this.aborted||"function"!=typeof e.commit||e.commit()}store(e){return new eS(this.transaction.objectStore(e))}}class eI{static delete(e){return T(ew,"Removing database:",e),ex((0,h.Rd)().indexedDB.deleteDatabase(e)).toPromise()}static v(){if(!(0,h.hl)())return!1;if(eI.F())return!0;let e=(0,h.z$)(),t=eI.M(e),n=eT(e);return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||0<t&&t<10||0<n&&n<4.5)}static F(){return void 0!==f&&"YES"===f.__PRIVATE_env?.__PRIVATE_USE_MOCK_PERSISTENCE}static O(e,t){return e.store(t)}static M(e){let t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i);return Number(t?t[1].split("_").slice(0,2).join("."):"-1")}constructor(e,t,n){this.name=e,this.version=t,this.N=n,this.B=null,12.2===eI.M((0,h.z$)())&&E("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async L(e){return this.db||(T(ew,"Opening database:",this.name),this.db=await new Promise((t,n)=>{let r=indexedDB.open(this.name,this.version);r.onsuccess=e=>{t(e.target.result)},r.onblocked=()=>{n(new e_(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},r.onerror=t=>{let r=t.target.error;"VersionError"===r.name?n(new D(C.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):"InvalidStateError"===r.name?n(new D(C.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+r)):n(new e_(e,r))},r.onupgradeneeded=e=>{T(ew,'Database "'+this.name+'" requires upgrade from version:',e.oldVersion);let t=e.target.result;this.N.k(t,r.transaction,e.oldVersion,this.version).next(()=>{T(ew,"Database upgrade to version "+this.version+" complete")})}})),this.q&&(this.db.onversionchange=e=>this.q(e)),this.db}$(e){this.q=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,n,r){let i="readonly"===t,s=0;for(;;){++s;try{this.db=await this.L(e);let t=ev.open(this.db,e,i?"readonly":"readwrite",n),s=r(t).next(e=>(t.C(),e)).catch(e=>(t.abort(e),ey.reject(e))).toPromise();return s.catch(()=>{}),await t.D,s}catch(t){let e="FirebaseError"!==t.name&&s<3;if(T(ew,"Transaction failed with error:",t.message,"Retrying:",e),this.close(),!e)return Promise.reject(t)}}}close(){this.db&&this.db.close(),this.db=void 0}}function eT(e){let t=e.match(/Android ([\d.]+)/i);return Number(t?t[1].split(".").slice(0,2).join("."):"-1")}class eE{constructor(e){this.U=e,this.K=!1,this.W=null}get isDone(){return this.K}get G(){return this.W}set cursor(e){this.U=e}done(){this.K=!0}j(e){this.W=e}delete(){return ex(this.U.delete())}}class e_ extends D{constructor(e,t){super(C.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function eb(e){return"IndexedDbTransactionError"===e.name}class eS{constructor(e){this.store=e}put(e,t){let n;return void 0!==t?(T(ew,"PUT",this.store.name,e,t),n=this.store.put(t,e)):(T(ew,"PUT",this.store.name,"<auto-key>",e),n=this.store.put(e)),ex(n)}add(e){return T(ew,"ADD",this.store.name,e,e),ex(this.store.add(e))}get(e){return ex(this.store.get(e)).next(t=>(void 0===t&&(t=null),T(ew,"GET",this.store.name,e,t),t))}delete(e){return T(ew,"DELETE",this.store.name,e),ex(this.store.delete(e))}count(){return T(ew,"COUNT",this.store.name),ex(this.store.count())}J(e,t){let n=this.options(e,t),r=n.index?this.store.index(n.index):this.store;if("function"==typeof r.getAll){let e=r.getAll(n.range);return new ey((t,n)=>{e.onerror=e=>{n(e.target.error)},e.onsuccess=e=>{t(e.target.result)}})}{let e=this.cursor(n),t=[];return this.H(e,(e,n)=>{t.push(n)}).next(()=>t)}}Y(e,t){let n=this.store.getAll(e,null===t?void 0:t);return new ey((e,t)=>{n.onerror=e=>{t(e.target.error)},n.onsuccess=t=>{e(t.target.result)}})}Z(e,t){T(ew,"DELETE ALL",this.store.name);let n=this.options(e,t);n.X=!1;let r=this.cursor(n);return this.H(r,(e,t,n)=>n.delete())}ee(e,t){let n;t?n=e:(n={},t=e);let r=this.cursor(n);return this.H(r,t)}te(e){let t=this.cursor({});return new ey((n,r)=>{t.onerror=e=>{r(eC(e.target.error))},t.onsuccess=t=>{let r=t.target.result;r?e(r.primaryKey,r.value).next(e=>{e?r.continue():n()}):n()}})}H(e,t){let n=[];return new ey((r,i)=>{e.onerror=e=>{i(e.target.error)},e.onsuccess=e=>{let i=e.target.result;if(!i)return void r();let s=new eE(i),a=t(i.primaryKey,i.value,s);if(a instanceof ey){let e=a.catch(e=>(s.done(),ey.reject(e)));n.push(e)}s.isDone?r():null===s.G?i.continue():i.continue(s.G)}}).next(()=>ey.waitFor(n))}options(e,t){let n;return void 0!==e&&("string"==typeof e?n=e:t=e),{index:n,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){let n=this.store.index(e.index);return e.X?n.openKeyCursor(e.range,t):n.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function ex(e){return new ey((t,n)=>{e.onsuccess=e=>{t(e.target.result)},e.onerror=e=>{n(eC(e.target.error))}})}let eN=!1;function eC(e){let t=eI.M((0,h.z$)());if(t>=12.2&&t<13){let t="An internal error was encountered in the Indexed Database server";if(e.message.indexOf(t)>=0){let e=new D("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return eN||(eN=!0,setTimeout(()=>{throw e},0)),e}}return e}let eD="IndexBackfiller";class eA{constructor(e,t){this.asyncQueue=e,this.ne=t,this.task=null}start(){this.re(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return null!==this.task}re(e){T(eD,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,async()=>{this.task=null;try{let e=await this.ne.ie();T(eD,`Documents written: ${e}`)}catch(e){eb(e)?T(eD,"Ignoring IndexedDB error during index backfill: ",e):await ep(e)}await this.re(6e4)})}}class ek{constructor(e,t){this.localStore=e,this.persistence=t}async ie(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",t=>this.se(t,e))}se(e,t){let n=new Set,r=t,i=!0;return ey.doWhile(()=>!0===i&&r>0,()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next(t=>{if(null!==t&&!n.has(t))return T(eD,`Processing collection: ${t}`),this.oe(e,t,r).next(e=>{r-=e,n.add(t)});i=!1})).next(()=>t-r)}oe(e,t,n){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next(r=>this.localStore.localDocuments.getNextDocuments(e,t,r,n).next(n=>{let i=n.changes;return this.localStore.indexManager.updateIndexEntries(e,i).next(()=>this._e(r,n)).next(n=>(T(eD,`Updating offset: ${n}`),this.localStore.indexManager.updateCollectionGroup(e,t,n))).next(()=>i.size)}))}_e(e,t){let n=e;return t.changes.forEach((e,t)=>{let r=ec(t);ef(r,n)>0&&(n=r)}),new ed(n.readTime,n.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eR{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=e=>this.ae(e),this.ue=e=>t.writeSequenceNumber(e))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){let e=++this.previousValue;return this.ue&&this.ue(e),e}}function eV(e){return 0===e&&1/e==-1/0}function eM(e){let t="";for(let n=0;n<e.length;n++)t.length>0&&(t+="\x01\x01"),t=function(e,t){let n=t,r=e.length;for(let t=0;t<r;t++){let r=e.charAt(t);switch(r){case"\0":n+="\x01\x10";break;case"\x01":n+="\x01\x11";break;default:n+=r}}return n}(e.get(n),t);return t+"\x01\x01"}function eO(e){let t=e.length;if(N(t>=2,64408,{path:e}),2===t)return N("\x01"===e.charAt(0)&&"\x01"===e.charAt(1),56145,{path:e}),j.emptyPath();let n=t-2,r=[],i="";for(let s=0;s<t;){let t=e.indexOf("\x01",s);switch((t<0||t>n)&&S(50515,{path:e}),e.charAt(t+1)){case"\x01":let a;let o=e.substring(s,t);0===i.length?a=o:(i+=o,a=i,i=""),r.push(a);break;case"\x10":i+=e.substring(s,t)+"\0";break;case"\x11":i+=e.substring(s,t+1);break;default:S(61167,{path:e})}s=t+2}return new j(r)}eR.ce=-1;/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eP="remoteDocuments",eF="owner",eL="owner",eU="mutationQueues",eq="mutations",eB="batchId",ez="userMutationsIndex",eK=["userId","batchId"],eG={},e$="documentMutations",ej="remoteDocumentsV14",eQ=["prefixPath","collectionGroup","readTime","documentId"],eW="documentKeyIndex",eH=["prefixPath","collectionGroup","documentId"],eY="collectionGroupIndex",eX=["collectionGroup","readTime","prefixPath","documentId"],eJ="remoteDocumentGlobal",eZ="remoteDocumentGlobalKey",e0="targets",e1="queryTargetsIndex",e2=["canonicalId","targetId"],e5="targetDocuments",e4=["targetId","path"],e6="documentTargetsIndex",e3=["path","targetId"],e8="targetGlobalKey",e9="targetGlobal",e7="collectionParents",te=["collectionId","parent"],tt="clientMetadata",tn="bundles",tr="namedQueries",ti="indexConfiguration",ts="collectionGroupIndex",ta="indexState",to=["indexId","uid"],tl="sequenceNumberIndex",tu=["uid","sequenceNumber"],th="indexEntries",tc=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],td="documentKeyIndex",tf=["indexId","uid","orderedDocumentKey"],tm="documentOverlays",tg=["userId","collectionPath","documentId"],tp="collectionPathOverlayIndex",ty=["userId","collectionPath","largestBatchId"],tw="collectionGroupOverlayIndex",tv=["userId","collectionGroup","largestBatchId"],tI="globals",tT=[eU,eq,e$,eP,e0,eF,e9,e5,tt,eJ,e7,tn,tr],tE=[...tT,tm],t_=[eU,eq,e$,ej,e0,eF,e9,e5,tt,eJ,e7,tn,tr,tm],tb=[...t_,ti,ta,th],tS=[...tb,tI];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tx extends eg{constructor(e,t){super(),this.le=e,this.currentSequenceNumber=t}}function tN(e,t){return eI.O(e.le,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function tC(e){let t=0;for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t++;return t}function tD(e,t){for(let n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function tA(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tk{constructor(e,t){this.comparator=e,this.root=t||tV.EMPTY}insert(e,t){return new tk(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,tV.BLACK,null,null))}remove(e){return new tk(this.comparator,this.root.remove(e,this.comparator).copy(null,null,tV.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){let n=this.comparator(e,t.key);if(0===n)return t.value;n<0?t=t.left:n>0&&(t=t.right)}return null}indexOf(e){let t=0,n=this.root;for(;!n.isEmpty();){let r=this.comparator(e,n.key);if(0===r)return t+n.left.size;r<0?n=n.left:(t+=n.left.size+1,n=n.right)}return -1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((t,n)=>(e(t,n),!1))}toString(){let e=[];return this.inorderTraversal((t,n)=>(e.push(`${t}:${n}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new tR(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new tR(this.root,e,this.comparator,!1)}getReverseIterator(){return new tR(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new tR(this.root,e,this.comparator,!0)}}class tR{constructor(e,t,n,r){this.isReverse=r,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?n(e.key,t):1,t&&r&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(0===i){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop(),t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(0===this.nodeStack.length)return null;let e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class tV{constructor(e,t,n,r,i){this.key=e,this.value=t,this.color=null!=n?n:tV.RED,this.left=null!=r?r:tV.EMPTY,this.right=null!=i?i:tV.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,n,r,i){return new tV(null!=e?e:this.key,null!=t?t:this.value,null!=n?n:this.color,null!=r?r:this.left,null!=i?i:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,n){let r=this,i=n(e,r.key);return(r=i<0?r.copy(null,null,null,r.left.insert(e,t,n),null):0===i?r.copy(null,t,null,null,null):r.copy(null,null,null,null,r.right.insert(e,t,n))).fixUp()}removeMin(){if(this.left.isEmpty())return tV.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),(e=e.copy(null,null,null,e.left.removeMin(),null)).fixUp()}remove(e,t){let n,r=this;if(0>t(e,r.key))r.left.isEmpty()||r.left.isRed()||r.left.left.isRed()||(r=r.moveRedLeft()),r=r.copy(null,null,null,r.left.remove(e,t),null);else{if(r.left.isRed()&&(r=r.rotateRight()),r.right.isEmpty()||r.right.isRed()||r.right.left.isRed()||(r=r.moveRedRight()),0===t(e,r.key)){if(r.right.isEmpty())return tV.EMPTY;n=r.right.min(),r=r.copy(n.key,n.value,null,null,r.right.removeMin())}r=r.copy(null,null,null,null,r.right.remove(e,t))}return r.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=(e=(e=e.copy(null,null,null,null,e.right.rotateRight())).rotateLeft()).colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=(e=e.rotateRight()).colorFlip()),e}rotateLeft(){let e=this.copy(null,null,tV.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){let e=this.copy(null,null,tV.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){let e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){return Math.pow(2,this.check())<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw S(43730,{key:this.key,value:this.value});if(this.right.isRed())throw S(14113,{key:this.key,value:this.value});let e=this.left.check();if(e!==this.right.check())throw S(27949);return e+(this.isRed()?0:1)}}tV.EMPTY=null,tV.RED=!0,tV.BLACK=!1,tV.EMPTY=new class{constructor(){this.size=0}get key(){throw S(57766)}get value(){throw S(16141)}get color(){throw S(16727)}get left(){throw S(29726)}get right(){throw S(36894)}copy(e,t,n,r,i){return this}insert(e,t,n){return new tV(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tM{constructor(e){this.comparator=e,this.data=new tk(this.comparator)}has(e){return null!==this.data.get(e)}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((t,n)=>(e(t),!1))}forEachInRange(e,t){let n=this.data.getIteratorFrom(e[0]);for(;n.hasNext();){let r=n.getNext();if(this.comparator(r.key,e[1])>=0)return;t(r.key)}}forEachWhile(e,t){let n;for(n=void 0!==t?this.data.getIteratorFrom(t):this.data.getIterator();n.hasNext();)if(!e(n.getNext().key))return}firstAfterOrEqual(e){let t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new tO(this.data.getIterator())}getIteratorFrom(e){return new tO(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach(e=>{t=t.add(e)}),t}isEqual(e){if(!(e instanceof tM)||this.size!==e.size)return!1;let t=this.data.getIterator(),n=e.data.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(0!==this.comparator(e,r))return!1}return!0}toArray(){let e=[];return this.forEach(t=>{e.push(t)}),e}toString(){let e=[];return this.forEach(t=>e.push(t)),"SortedSet("+e.toString()+")"}copy(e){let t=new tM(this.comparator);return t.data=e,t}}class tO{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function tP(e){return e.hasNext()?e.getNext():void 0}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tF{constructor(e){this.fields=e,e.sort(W.comparator)}static empty(){return new tF([])}unionWith(e){let t=new tM(W.comparator);for(let e of this.fields)t=t.add(e);for(let n of e)t=t.add(n);return new tF(t.toArray())}covers(e){for(let t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return K(this.fields,e.fields,(e,t)=>e.isEqual(t))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tL extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tU{constructor(e){this.binaryString=e}static fromBase64String(e){return new tU(function(e){try{return atob(e)}catch(e){throw"undefined"!=typeof DOMException&&e instanceof DOMException?new tL("Invalid base64 string: "+e):e}}(e))}static fromUint8Array(e){return new tU(function(e){let t="";for(let n=0;n<e.length;++n)t+=String.fromCharCode(e[n]);return t}(e))}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return btoa(this.binaryString)}toUint8Array(){return function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return q(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}tU.EMPTY_BYTE_STRING=new tU("");let tq=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function tB(e){if(N(!!e,39018),"string"==typeof e){let t=0,n=tq.exec(e);if(N(!!n,46558,{timestamp:e}),n[1]){let e=n[1];t=Number(e=(e+"000000000").substr(0,9))}return{seconds:Math.floor(new Date(e).getTime()/1e3),nanos:t}}return{seconds:tz(e.seconds),nanos:tz(e.nanos)}}function tz(e){return"number"==typeof e?e:"string"==typeof e?Number(e):0}function tK(e){return"string"==typeof e?tU.fromBase64String(e):tU.fromUint8Array(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let tG="server_timestamp",t$="__type__",tj="__previous_value__",tQ="__local_write_time__";function tW(e){return(e?.mapValue?.fields||{})[t$]?.stringValue===tG}function tH(e){let t=e.mapValue.fields[tj];return tW(t)?tH(t):t}function tY(e){let t=tB(e.mapValue.fields[tQ].timestampValue);return new ei(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tX{constructor(e,t,n,r,i,s,a,o,l,u){this.databaseId=e,this.appId=t,this.persistenceKey=n,this.host=r,this.ssl=i,this.forceLongPolling=s,this.autoDetectLongPolling=a,this.longPollingOptions=o,this.useFetchStreams=l,this.isUsingEmulator=u}}let tJ="(default)";class tZ{constructor(e,t){this.projectId=e,this.database=t||tJ}static empty(){return new tZ("","")}get isDefaultDatabase(){return this.database===tJ}isEqual(e){return e instanceof tZ&&e.projectId===this.projectId&&e.database===this.database}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let t0="__type__",t1="__max__",t2={mapValue:{fields:{__type__:{stringValue:t1}}}},t5="__vector__",t4="value",t6={nullValue:"NULL_VALUE"};function t3(e){return"nullValue"in e?0:"booleanValue"in e?1:"integerValue"in e||"doubleValue"in e?2:"timestampValue"in e?3:"stringValue"in e?5:"bytesValue"in e?6:"referenceValue"in e?7:"geoPointValue"in e?8:"arrayValue"in e?9:"mapValue"in e?tW(e)?4:nc(e)?9007199254740991:nu(e)?10:11:S(28295,{value:e})}function t8(e,t){if(e===t)return!0;let n=t3(e);if(n!==t3(t))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return e.booleanValue===t.booleanValue;case 4:return tY(e).isEqual(tY(t));case 3:return function(e,t){if("string"==typeof e.timestampValue&&"string"==typeof t.timestampValue&&e.timestampValue.length===t.timestampValue.length)return e.timestampValue===t.timestampValue;let n=tB(e.timestampValue),r=tB(t.timestampValue);return n.seconds===r.seconds&&n.nanos===r.nanos}(e,t);case 5:return e.stringValue===t.stringValue;case 6:return tK(e.bytesValue).isEqual(tK(t.bytesValue));case 7:return e.referenceValue===t.referenceValue;case 8:return tz(e.geoPointValue.latitude)===tz(t.geoPointValue.latitude)&&tz(e.geoPointValue.longitude)===tz(t.geoPointValue.longitude);case 2:return function(e,t){if("integerValue"in e&&"integerValue"in t)return tz(e.integerValue)===tz(t.integerValue);if("doubleValue"in e&&"doubleValue"in t){let n=tz(e.doubleValue),r=tz(t.doubleValue);return n===r?eV(n)===eV(r):isNaN(n)&&isNaN(r)}return!1}(e,t);case 9:return K(e.arrayValue.values||[],t.arrayValue.values||[],t8);case 10:case 11:return function(e,t){let n=e.mapValue.fields||{},r=t.mapValue.fields||{};if(tC(n)!==tC(r))return!1;for(let e in n)if(n.hasOwnProperty(e)&&(void 0===r[e]||!t8(n[e],r[e])))return!1;return!0}(e,t);default:return S(52216,{left:e})}}function t9(e,t){return void 0!==(e.values||[]).find(e=>t8(e,t))}function t7(e,t){if(e===t)return 0;let n=t3(e),r=t3(t);if(n!==r)return q(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return q(e.booleanValue,t.booleanValue);case 2:return function(e,t){let n=tz(e.integerValue||e.doubleValue),r=tz(t.integerValue||t.doubleValue);return n<r?-1:n>r?1:n===r?0:isNaN(n)?isNaN(r)?0:-1:1}(e,t);case 3:return ne(e.timestampValue,t.timestampValue);case 4:return ne(tY(e),tY(t));case 5:return B(e.stringValue,t.stringValue);case 6:return function(e,t){let n=tK(e),r=tK(t);return n.compareTo(r)}(e.bytesValue,t.bytesValue);case 7:return function(e,t){let n=e.split("/"),r=t.split("/");for(let e=0;e<n.length&&e<r.length;e++){let t=q(n[e],r[e]);if(0!==t)return t}return q(n.length,r.length)}(e.referenceValue,t.referenceValue);case 8:return function(e,t){let n=q(tz(e.latitude),tz(t.latitude));return 0!==n?n:q(tz(e.longitude),tz(t.longitude))}(e.geoPointValue,t.geoPointValue);case 9:return nt(e.arrayValue,t.arrayValue);case 10:return function(e,t){let n=e.fields||{},r=t.fields||{},i=n[t4]?.arrayValue,s=r[t4]?.arrayValue,a=q(i?.values?.length||0,s?.values?.length||0);return 0!==a?a:nt(i,s)}(e.mapValue,t.mapValue);case 11:return function(e,t){if(e===t2.mapValue&&t===t2.mapValue)return 0;if(e===t2.mapValue)return 1;if(t===t2.mapValue)return -1;let n=e.fields||{},r=Object.keys(n),i=t.fields||{},s=Object.keys(i);r.sort(),s.sort();for(let e=0;e<r.length&&e<s.length;++e){let t=B(r[e],s[e]);if(0!==t)return t;let a=t7(n[r[e]],i[s[e]]);if(0!==a)return a}return q(r.length,s.length)}(e.mapValue,t.mapValue);default:throw S(23264,{he:n})}}function ne(e,t){if("string"==typeof e&&"string"==typeof t&&e.length===t.length)return q(e,t);let n=tB(e),r=tB(t),i=q(n.seconds,r.seconds);return 0!==i?i:q(n.nanos,r.nanos)}function nt(e,t){let n=e.values||[],r=t.values||[];for(let e=0;e<n.length&&e<r.length;++e){let t=t7(n[e],r[e]);if(t)return t}return q(n.length,r.length)}function nn(e){var t,n;return"nullValue"in e?"null":"booleanValue"in e?""+e.booleanValue:"integerValue"in e?""+e.integerValue:"doubleValue"in e?""+e.doubleValue:"timestampValue"in e?function(e){let t=tB(e);return`time(${t.seconds},${t.nanos})`}(e.timestampValue):"stringValue"in e?e.stringValue:"bytesValue"in e?tK(e.bytesValue).toBase64():"referenceValue"in e?(t=e.referenceValue,H.fromName(t).toString()):"geoPointValue"in e?(n=e.geoPointValue,`geo(${n.latitude},${n.longitude})`):"arrayValue"in e?function(e){let t="[",n=!0;for(let r of e.values||[])n?n=!1:t+=",",t+=nn(r);return t+"]"}(e.arrayValue):"mapValue"in e?function(e){let t=Object.keys(e.fields||{}).sort(),n="{",r=!0;for(let i of t)r?r=!1:n+=",",n+=`${i}:${nn(e.fields[i])}`;return n+"}"}(e.mapValue):S(61005,{value:e})}function nr(e,t){return{referenceValue:`projects/${e.projectId}/databases/${e.database}/documents/${t.path.canonicalString()}`}}function ni(e){return!!e&&"integerValue"in e}function ns(e){return!!e&&"arrayValue"in e}function na(e){return!!e&&"nullValue"in e}function no(e){return!!e&&"doubleValue"in e&&isNaN(Number(e.doubleValue))}function nl(e){return!!e&&"mapValue"in e}function nu(e){return(e?.mapValue?.fields||{})[t0]?.stringValue===t5}function nh(e){if(e.geoPointValue)return{geoPointValue:{...e.geoPointValue}};if(e.timestampValue&&"object"==typeof e.timestampValue)return{timestampValue:{...e.timestampValue}};if(e.mapValue){let t={mapValue:{fields:{}}};return tD(e.mapValue.fields,(e,n)=>t.mapValue.fields[e]=nh(n)),t}if(e.arrayValue){let t={arrayValue:{values:[]}};for(let n=0;n<(e.arrayValue.values||[]).length;++n)t.arrayValue.values[n]=nh(e.arrayValue.values[n]);return t}return{...e}}function nc(e){return(((e.mapValue||{}).fields||{}).__type__||{}).stringValue===t1}let nd={mapValue:{fields:{[t0]:{stringValue:t5},[t4]:{arrayValue:{}}}}};function nf(e,t){let n=t7(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?-1:!e.inclusive&&t.inclusive?1:0}function nm(e,t){let n=t7(e.value,t.value);return 0!==n?n:e.inclusive&&!t.inclusive?1:!e.inclusive&&t.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ng{constructor(e){this.value=e}static empty(){return new ng({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let n=0;n<e.length-1;++n)if(!nl(t=(t.mapValue.fields||{})[e.get(n)]))return null;return(t=(t.mapValue.fields||{})[e.lastSegment()])||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=nh(t)}setAll(e){let t=W.emptyPath(),n={},r=[];e.forEach((e,i)=>{if(!t.isImmediateParentOf(i)){let e=this.getFieldsMap(t);this.applyChanges(e,n,r),n={},r=[],t=i.popLast()}e?n[i.lastSegment()]=nh(e):r.push(i.lastSegment())});let i=this.getFieldsMap(t);this.applyChanges(i,n,r)}delete(e){let t=this.field(e.popLast());nl(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return t8(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let n=0;n<e.length;++n){let r=t.mapValue.fields[e.get(n)];nl(r)&&r.mapValue.fields||(r={mapValue:{fields:{}}},t.mapValue.fields[e.get(n)]=r),t=r}return t.mapValue.fields}applyChanges(e,t,n){for(let r of(tD(t,(t,n)=>e[t]=n),n))delete e[r]}clone(){return new ng(nh(this.value))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class np{constructor(e,t,n,r,i,s,a){this.key=e,this.documentType=t,this.version=n,this.readTime=r,this.createTime=i,this.data=s,this.documentState=a}static newInvalidDocument(e){return new np(e,0,es.min(),es.min(),es.min(),ng.empty(),0)}static newFoundDocument(e,t,n,r){return new np(e,1,t,es.min(),n,r,0)}static newNoDocument(e,t){return new np(e,2,t,es.min(),es.min(),ng.empty(),0)}static newUnknownDocument(e,t){return new np(e,3,t,es.min(),es.min(),ng.empty(),2)}convertToFoundDocument(e,t){return this.createTime.isEqual(es.min())&&(2===this.documentType||0===this.documentType)&&(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ng.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ng.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=es.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return 1===this.documentState}get hasCommittedMutations(){return 2===this.documentState}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return 0!==this.documentType}isFoundDocument(){return 1===this.documentType}isNoDocument(){return 2===this.documentType}isUnknownDocument(){return 3===this.documentType}isEqual(e){return e instanceof np&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new np(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{constructor(e,t){this.position=e,this.inclusive=t}}function nw(e,t,n){let r=0;for(let i=0;i<e.position.length;i++){let s=t[i],a=e.position[i];if(r=s.field.isKeyField()?H.comparator(H.fromName(a.referenceValue),n.key):t7(a,n.data.field(s.field)),"desc"===s.dir&&(r*=-1),0!==r)break}return r}function nv(e,t){if(null===e)return null===t;if(null===t||e.inclusive!==t.inclusive||e.position.length!==t.position.length)return!1;for(let n=0;n<e.position.length;n++)if(!t8(e.position[n],t.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nI{constructor(e,t="asc"){this.field=e,this.dir=t}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nT{}class nE extends nT{constructor(e,t,n){super(),this.field=e,this.op=t,this.value=n}static create(e,t,n){return e.isKeyField()?"in"===t||"not-in"===t?this.createKeyFieldInFilter(e,t,n):new nD(e,t,n):"array-contains"===t?new nV(e,n):"in"===t?new nM(e,n):"not-in"===t?new nO(e,n):"array-contains-any"===t?new nP(e,n):new nE(e,t,n)}static createKeyFieldInFilter(e,t,n){return"in"===t?new nA(e,n):new nk(e,n)}matches(e){let t=e.data.field(this.field);return"!="===this.op?null!==t&&void 0===t.nullValue&&this.matchesComparison(t7(t,this.value)):null!==t&&t3(this.value)===t3(t)&&this.matchesComparison(t7(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return 0===e;case"!=":return 0!==e;case">":return e>0;case">=":return e>=0;default:return S(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class n_ extends nT{constructor(e,t){super(),this.filters=e,this.op=t,this.Pe=null}static create(e,t){return new n_(e,t)}matches(e){return nb(this)?void 0===this.filters.find(t=>!t.matches(e)):void 0!==this.filters.find(t=>t.matches(e))}getFlattenedFilters(){return null!==this.Pe||(this.Pe=this.filters.reduce((e,t)=>e.concat(t.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function nb(e){return"and"===e.op}function nS(e){return"or"===e.op}function nx(e){return nN(e)&&nb(e)}function nN(e){for(let t of e.filters)if(t instanceof n_)return!1;return!0}function nC(e,t){let n=e.filters.concat(t);return n_.create(n,e.op)}class nD extends nE{constructor(e,t,n){super(e,t,n),this.key=H.fromName(n.referenceValue)}matches(e){let t=H.comparator(e.key,this.key);return this.matchesComparison(t)}}class nA extends nE{constructor(e,t){super(e,"in",t),this.keys=nR("in",t)}matches(e){return this.keys.some(t=>t.isEqual(e.key))}}class nk extends nE{constructor(e,t){super(e,"not-in",t),this.keys=nR("not-in",t)}matches(e){return!this.keys.some(t=>t.isEqual(e.key))}}function nR(e,t){return(t.arrayValue?.values||[]).map(e=>H.fromName(e.referenceValue))}class nV extends nE{constructor(e,t){super(e,"array-contains",t)}matches(e){let t=e.data.field(this.field);return ns(t)&&t9(t.arrayValue,this.value)}}class nM extends nE{constructor(e,t){super(e,"in",t)}matches(e){let t=e.data.field(this.field);return null!==t&&t9(this.value.arrayValue,t)}}class nO extends nE{constructor(e,t){super(e,"not-in",t)}matches(e){if(t9(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;let t=e.data.field(this.field);return null!==t&&void 0===t.nullValue&&!t9(this.value.arrayValue,t)}}class nP extends nE{constructor(e,t){super(e,"array-contains-any",t)}matches(e){let t=e.data.field(this.field);return!(!ns(t)||!t.arrayValue.values)&&t.arrayValue.values.some(e=>t9(this.value.arrayValue,e))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nF{constructor(e,t=null,n=[],r=[],i=null,s=null,a=null){this.path=e,this.collectionGroup=t,this.orderBy=n,this.filters=r,this.limit=i,this.startAt=s,this.endAt=a,this.Te=null}}function nL(e,t=null,n=[],r=[],i=null,s=null,a=null){return new nF(e,t,n,r,i,s,a)}function nU(e){if(null===e.Te){let t=e.path.canonicalString();null!==e.collectionGroup&&(t+="|cg:"+e.collectionGroup),t+="|f:"+e.filters.map(e=>(function e(t){if(t instanceof nE)return t.field.canonicalString()+t.op.toString()+nn(t.value);if(nx(t))return t.filters.map(t=>e(t)).join(",");{let n=t.filters.map(t=>e(t)).join(",");return`${t.op}(${n})`}})(e)).join(",")+"|ob:"+e.orderBy.map(e=>e.field.canonicalString()+e.dir).join(","),null==e.limit||(t+="|l:"+e.limit),e.startAt&&(t+="|lb:"+(e.startAt.inclusive?"b:":"a:")+e.startAt.position.map(e=>nn(e)).join(",")),e.endAt&&(t+="|ub:"+(e.endAt.inclusive?"a:":"b:")+e.endAt.position.map(e=>nn(e)).join(",")),e.Te=t}return e.Te}function nq(e,t){if(e.limit!==t.limit||e.orderBy.length!==t.orderBy.length)return!1;for(let i=0;i<e.orderBy.length;i++){var n,r;if(n=e.orderBy[i],r=t.orderBy[i],!(n.dir===r.dir&&n.field.isEqual(r.field)))return!1}if(e.filters.length!==t.filters.length)return!1;for(let n=0;n<e.filters.length;n++)if(!function e(t,n){return t instanceof nE?n instanceof nE&&t.op===n.op&&t.field.isEqual(n.field)&&t8(t.value,n.value):t instanceof n_?n instanceof n_&&t.op===n.op&&t.filters.length===n.filters.length&&t.filters.reduce((t,r,i)=>t&&e(r,n.filters[i]),!0):void S(19439)}(e.filters[n],t.filters[n]))return!1;return e.collectionGroup===t.collectionGroup&&!!e.path.isEqual(t.path)&&!!nv(e.startAt,t.startAt)&&nv(e.endAt,t.endAt)}function nB(e){return H.isDocumentKey(e.path)&&null===e.collectionGroup&&0===e.filters.length}function nz(e,t){return e.filters.filter(e=>e instanceof nE&&e.field.isEqual(t))}function nK(e,t,n){let r=t6,i=!0;for(let n of nz(e,t)){let e=t6,t=!0;switch(n.op){case"<":case"<=":var s;e="nullValue"in(s=n.value)?t6:"booleanValue"in s?{booleanValue:!1}:"integerValue"in s||"doubleValue"in s?{doubleValue:NaN}:"timestampValue"in s?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in s?{stringValue:""}:"bytesValue"in s?{bytesValue:""}:"referenceValue"in s?nr(tZ.empty(),H.empty()):"geoPointValue"in s?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in s?{arrayValue:{}}:"mapValue"in s?nu(s)?nd:{mapValue:{}}:S(35942,{value:s});break;case"==":case"in":case">=":e=n.value;break;case">":e=n.value,t=!1;break;case"!=":case"not-in":e=t6}0>nf({value:r,inclusive:i},{value:e,inclusive:t})&&(r=e,i=t)}if(null!==n){for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){let e=n.position[s];0>nf({value:r,inclusive:i},{value:e,inclusive:n.inclusive})&&(r=e,i=n.inclusive);break}}return{value:r,inclusive:i}}function nG(e,t,n){let r=t2,i=!0;for(let n of nz(e,t)){let e=t2,t=!0;switch(n.op){case">=":case">":var s;e="nullValue"in(s=n.value)?{booleanValue:!1}:"booleanValue"in s?{doubleValue:NaN}:"integerValue"in s||"doubleValue"in s?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in s?{stringValue:""}:"stringValue"in s?{bytesValue:""}:"bytesValue"in s?nr(tZ.empty(),H.empty()):"referenceValue"in s?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in s?{arrayValue:{}}:"arrayValue"in s?nd:"mapValue"in s?nu(s)?{mapValue:{}}:t2:S(61959,{value:s}),t=!1;break;case"==":case"in":case"<=":e=n.value;break;case"<":e=n.value,t=!1;break;case"!=":case"not-in":e=t2}nm({value:r,inclusive:i},{value:e,inclusive:t})>0&&(r=e,i=t)}if(null!==n){for(let s=0;s<e.orderBy.length;++s)if(e.orderBy[s].field.isEqual(t)){let e=n.position[s];nm({value:r,inclusive:i},{value:e,inclusive:n.inclusive})>0&&(r=e,i=n.inclusive);break}}return{value:r,inclusive:i}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n${constructor(e,t=null,n=[],r=[],i=null,s="F",a=null,o=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=n,this.filters=r,this.limit=i,this.limitType=s,this.startAt=a,this.endAt=o,this.Ie=null,this.Ee=null,this.de=null,this.startAt,this.endAt}}function nj(e){return new n$(e)}function nQ(e){return 0===e.filters.length&&null===e.limit&&null==e.startAt&&null==e.endAt&&(0===e.explicitOrderBy.length||1===e.explicitOrderBy.length&&e.explicitOrderBy[0].field.isKeyField())}function nW(e){return null!==e.collectionGroup}function nH(e){if(null===e.Ie){let t;e.Ie=[];let n=new Set;for(let t of e.explicitOrderBy)e.Ie.push(t),n.add(t.field.canonicalString());let r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(t=new tM(W.comparator),e.filters.forEach(e=>{e.getFlattenedFilters().forEach(e=>{e.isInequality()&&(t=t.add(e.field))})}),t).forEach(t=>{n.has(t.canonicalString())||t.isKeyField()||e.Ie.push(new nI(t,r))}),n.has(W.keyField().canonicalString())||e.Ie.push(new nI(W.keyField(),r))}return e.Ie}function nY(e){return e.Ee||(e.Ee=function(e,t){if("F"===e.limitType)return nL(e.path,e.collectionGroup,t,e.filters,e.limit,e.startAt,e.endAt);{t=t.map(e=>{let t="desc"===e.dir?"asc":"desc";return new nI(e.field,t)});let n=e.endAt?new ny(e.endAt.position,e.endAt.inclusive):null,r=e.startAt?new ny(e.startAt.position,e.startAt.inclusive):null;return nL(e.path,e.collectionGroup,t,e.filters,e.limit,n,r)}}(e,nH(e))),e.Ee}function nX(e,t){let n=e.filters.concat([t]);return new n$(e.path,e.collectionGroup,e.explicitOrderBy.slice(),n,e.limit,e.limitType,e.startAt,e.endAt)}function nJ(e,t,n){return new n$(e.path,e.collectionGroup,e.explicitOrderBy.slice(),e.filters.slice(),t,n,e.startAt,e.endAt)}function nZ(e,t){return nq(nY(e),nY(t))&&e.limitType===t.limitType}function n0(e){return`${nU(nY(e))}|lt:${e.limitType}`}function n1(e){var t;let n;return`Query(target=${n=(t=nY(e)).path.canonicalString(),null!==t.collectionGroup&&(n+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(n+=`, filters: [${t.filters.map(e=>(function e(t){return t instanceof nE?`${t.field.canonicalString()} ${t.op} ${nn(t.value)}`:t instanceof n_?t.op.toString()+" {"+t.getFilters().map(e).join(" ,")+"}":"Filter"})(e)).join(", ")}]`),null==t.limit||(n+=", limit: "+t.limit),t.orderBy.length>0&&(n+=`, orderBy: [${t.orderBy.map(e=>`${e.field.canonicalString()} (${e.dir})`).join(", ")}]`),t.startAt&&(n+=", startAt: "+(t.startAt.inclusive?"b:":"a:")+t.startAt.position.map(e=>nn(e)).join(",")),t.endAt&&(n+=", endAt: "+(t.endAt.inclusive?"a:":"b:")+t.endAt.position.map(e=>nn(e)).join(",")),`Target(${n})`}; limitType=${e.limitType})`}function n2(e,t){return t.isFoundDocument()&&function(e,t){let n=t.key.path;return null!==e.collectionGroup?t.key.hasCollectionId(e.collectionGroup)&&e.path.isPrefixOf(n):H.isDocumentKey(e.path)?e.path.isEqual(n):e.path.isImmediateParentOf(n)}(e,t)&&function(e,t){for(let n of nH(e))if(!n.field.isKeyField()&&null===t.data.field(n.field))return!1;return!0}(e,t)&&function(e,t){for(let n of e.filters)if(!n.matches(t))return!1;return!0}(e,t)&&(!e.startAt||!!function(e,t,n){let r=nw(e,t,n);return e.inclusive?r<=0:r<0}(e.startAt,nH(e),t))&&(!e.endAt||!!function(e,t,n){let r=nw(e,t,n);return e.inclusive?r>=0:r>0}(e.endAt,nH(e),t))}function n5(e){return(t,n)=>{let r=!1;for(let i of nH(e)){let e=function(e,t,n){let r=e.field.isKeyField()?H.comparator(t.key,n.key):function(e,t,n){let r=t.data.field(e),i=n.data.field(e);return null!==r&&null!==i?t7(r,i):S(42886)}(e.field,t,n);switch(e.dir){case"asc":return r;case"desc":return -1*r;default:return S(19790,{direction:e.dir})}}(i,t,n);if(0!==e)return e;r=r||i.field.isKeyField()}return 0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class n4{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){let t=this.mapKeyFn(e),n=this.inner[t];if(void 0!==n){for(let[t,r]of n)if(this.equalsFn(t,e))return r}}has(e){return void 0!==this.get(e)}set(e,t){let n=this.mapKeyFn(e),r=this.inner[n];if(void 0===r)return this.inner[n]=[[e,t]],void this.innerSize++;for(let n=0;n<r.length;n++)if(this.equalsFn(r[n][0],e))return void(r[n]=[e,t]);r.push([e,t]),this.innerSize++}delete(e){let t=this.mapKeyFn(e),n=this.inner[t];if(void 0===n)return!1;for(let r=0;r<n.length;r++)if(this.equalsFn(n[r][0],e))return 1===n.length?delete this.inner[t]:n.splice(r,1),this.innerSize--,!0;return!1}forEach(e){tD(this.inner,(t,n)=>{for(let[t,r]of n)e(t,r)})}isEmpty(){return tA(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let n6=new tk(H.comparator),n3=new tk(H.comparator);function n8(...e){let t=n3;for(let n of e)t=t.insert(n.key,n);return t}function n9(e){let t=n3;return e.forEach((e,n)=>t=t.insert(e,n.overlayedDocument)),t}function n7(){return new n4(e=>e.toString(),(e,t)=>e.isEqual(t))}let re=new tk(H.comparator),rt=new tM(H.comparator);function rn(...e){let t=rt;for(let n of e)t=t.add(n);return t}let rr=new tM(q);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ri(e,t){if(e.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:eV(t)?"-0":t}}function rs(e){return{integerValue:""+e}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ra{constructor(){this._=void 0}}function ro(e,t){return e instanceof rf?ni(t)||t&&"doubleValue"in t?t:{integerValue:0}:null}class rl extends ra{}class ru extends ra{constructor(e){super(),this.elements=e}}function rh(e,t){let n=rg(t);for(let t of e.elements)n.some(e=>t8(e,t))||n.push(t);return{arrayValue:{values:n}}}class rc extends ra{constructor(e){super(),this.elements=e}}function rd(e,t){let n=rg(t);for(let t of e.elements)n=n.filter(e=>!t8(e,t));return{arrayValue:{values:n}}}class rf extends ra{constructor(e,t){super(),this.serializer=e,this.Ae=t}}function rm(e){return tz(e.integerValue||e.doubleValue)}function rg(e){return ns(e)&&e.arrayValue.values?e.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rp{constructor(e,t){this.field=e,this.transform=t}}class ry{constructor(e,t){this.version=e,this.transformResults=t}}class rw{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new rw}static exists(e){return new rw(void 0,e)}static updateTime(e){return new rw(e)}get isNone(){return void 0===this.updateTime&&void 0===this.exists}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function rv(e,t){return void 0!==e.updateTime?t.isFoundDocument()&&t.version.isEqual(e.updateTime):void 0===e.exists||e.exists===t.isFoundDocument()}class rI{}function rT(e,t){if(!e.hasLocalMutations||t&&0===t.fields.length)return null;if(null===t)return e.isNoDocument()?new rD(e.key,rw.none()):new rb(e.key,e.data,rw.none());{let n=e.data,r=ng.empty(),i=new tM(W.comparator);for(let e of t.fields)if(!i.has(e)){let t=n.field(e);null===t&&e.length>1&&(e=e.popLast(),t=n.field(e)),null===t?r.delete(e):r.set(e,t),i=i.add(e)}return new rS(e.key,r,new tF(i.toArray()),rw.none())}}function rE(e,t,n,r){return e instanceof rb?function(e,t,n,r){if(!rv(e.precondition,t))return n;let i=e.value.clone(),s=rC(e.fieldTransforms,r,t);return i.setAll(s),t.convertToFoundDocument(t.version,i).setHasLocalMutations(),null}(e,t,n,r):e instanceof rS?function(e,t,n,r){if(!rv(e.precondition,t))return n;let i=rC(e.fieldTransforms,r,t),s=t.data;return(s.setAll(rx(e)),s.setAll(i),t.convertToFoundDocument(t.version,s).setHasLocalMutations(),null===n)?null:n.unionWith(e.fieldMask.fields).unionWith(e.fieldTransforms.map(e=>e.field))}(e,t,n,r):rv(e.precondition,t)?(t.convertToNoDocument(t.version).setHasLocalMutations(),null):n}function r_(e,t){var n,r;return e.type===t.type&&!!e.key.isEqual(t.key)&&!!e.precondition.isEqual(t.precondition)&&(n=e.fieldTransforms,r=t.fieldTransforms,!!(void 0===n&&void 0===r||!(!n||!r)&&K(n,r,(e,t)=>{var n,r;return e.field.isEqual(t.field)&&(n=e.transform,r=t.transform,n instanceof ru&&r instanceof ru||n instanceof rc&&r instanceof rc?K(n.elements,r.elements,t8):n instanceof rf&&r instanceof rf?t8(n.Ae,r.Ae):n instanceof rl&&r instanceof rl)})))&&(0===e.type?e.value.isEqual(t.value):1!==e.type||e.data.isEqual(t.data)&&e.fieldMask.isEqual(t.fieldMask))}class rb extends rI{constructor(e,t,n,r=[]){super(),this.key=e,this.value=t,this.precondition=n,this.fieldTransforms=r,this.type=0}getFieldMask(){return null}}class rS extends rI{constructor(e,t,n,r,i=[]){super(),this.key=e,this.data=t,this.fieldMask=n,this.precondition=r,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function rx(e){let t=new Map;return e.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){let r=e.data.field(n);t.set(n,r)}}),t}function rN(e,t,n){let r=new Map;N(e.length===n.length,32656,{Re:n.length,Ve:e.length});for(let s=0;s<n.length;s++){var i;let a=e[s],o=a.transform,l=t.data.field(a.field);r.set(a.field,(i=n[s],o instanceof ru?rh(o,l):o instanceof rc?rd(o,l):i))}return r}function rC(e,t,n){let r=new Map;for(let i of e){let e=i.transform,s=n.data.field(i.field);r.set(i.field,e instanceof rl?function(e,t){let n={fields:{[t$]:{stringValue:tG},[tQ]:{timestampValue:{seconds:e.seconds,nanos:e.nanoseconds}}}};return t&&tW(t)&&(t=tH(t)),t&&(n.fields[tj]=t),{mapValue:n}}(t,s):e instanceof ru?rh(e,s):e instanceof rc?rd(e,s):function(e,t){let n=ro(e,t),r=rm(n)+rm(e.Ae);return ni(n)&&ni(e.Ae)?rs(r):ri(e.serializer,r)}(e,s))}return r}class rD extends rI{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class rA extends rI{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rk{constructor(e,t,n,r){this.batchId=e,this.localWriteTime=t,this.baseMutations=n,this.mutations=r}applyToRemoteDocument(e,t){let n=t.mutationResults;for(let t=0;t<this.mutations.length;t++){let i=this.mutations[t];if(i.key.isEqual(e.key)){var r;r=n[t],i instanceof rb?function(e,t,n){let r=e.value.clone(),i=rN(e.fieldTransforms,t,n.transformResults);r.setAll(i),t.convertToFoundDocument(n.version,r).setHasCommittedMutations()}(i,e,r):i instanceof rS?function(e,t,n){if(!rv(e.precondition,t))return void t.convertToUnknownDocument(n.version);let r=rN(e.fieldTransforms,t,n.transformResults),i=t.data;i.setAll(rx(e)),i.setAll(r),t.convertToFoundDocument(n.version,i).setHasCommittedMutations()}(i,e,r):function(e,t,n){t.convertToNoDocument(n.version).setHasCommittedMutations()}(0,e,r)}}}applyToLocalView(e,t){for(let n of this.baseMutations)n.key.isEqual(e.key)&&(t=rE(n,e,t,this.localWriteTime));for(let n of this.mutations)n.key.isEqual(e.key)&&(t=rE(n,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){let n=n7();return this.mutations.forEach(r=>{let i=e.get(r.key),s=i.overlayedDocument,a=this.applyToLocalView(s,i.mutatedFields),o=rT(s,a=t.has(r.key)?null:a);null!==o&&n.set(r.key,o),s.isValidDocument()||s.convertToNoDocument(es.min())}),n}keys(){return this.mutations.reduce((e,t)=>e.add(t.key),rn())}isEqual(e){return this.batchId===e.batchId&&K(this.mutations,e.mutations,(e,t)=>r_(e,t))&&K(this.baseMutations,e.baseMutations,(e,t)=>r_(e,t))}}class rR{constructor(e,t,n,r){this.batch=e,this.commitVersion=t,this.mutationResults=n,this.docVersions=r}static from(e,t,n){N(e.mutations.length===n.length,58842,{me:e.mutations.length,fe:n.length});let r=re,i=e.mutations;for(let e=0;e<i.length;e++)r=r.insert(i[e].key,n[e].version);return new rR(e,t,n,r)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rV{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return null!==e&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rM{constructor(e,t){this.count=e,this.unchangedNames=t}}function rO(e){if(void 0===e)return E("GRPC error has no .code"),C.UNKNOWN;switch(e){case r.OK:return C.OK;case r.CANCELLED:return C.CANCELLED;case r.UNKNOWN:return C.UNKNOWN;case r.DEADLINE_EXCEEDED:return C.DEADLINE_EXCEEDED;case r.RESOURCE_EXHAUSTED:return C.RESOURCE_EXHAUSTED;case r.INTERNAL:return C.INTERNAL;case r.UNAVAILABLE:return C.UNAVAILABLE;case r.UNAUTHENTICATED:return C.UNAUTHENTICATED;case r.INVALID_ARGUMENT:return C.INVALID_ARGUMENT;case r.NOT_FOUND:return C.NOT_FOUND;case r.ALREADY_EXISTS:return C.ALREADY_EXISTS;case r.PERMISSION_DENIED:return C.PERMISSION_DENIED;case r.FAILED_PRECONDITION:return C.FAILED_PRECONDITION;case r.ABORTED:return C.ABORTED;case r.OUT_OF_RANGE:return C.OUT_OF_RANGE;case r.UNIMPLEMENTED:return C.UNIMPLEMENTED;case r.DATA_LOSS:return C.DATA_LOSS;default:return S(39323,{code:e})}}(i=r||(r={}))[i.OK=0]="OK",i[i.CANCELLED=1]="CANCELLED",i[i.UNKNOWN=2]="UNKNOWN",i[i.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",i[i.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",i[i.NOT_FOUND=5]="NOT_FOUND",i[i.ALREADY_EXISTS=6]="ALREADY_EXISTS",i[i.PERMISSION_DENIED=7]="PERMISSION_DENIED",i[i.UNAUTHENTICATED=16]="UNAUTHENTICATED",i[i.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",i[i.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",i[i.ABORTED=10]="ABORTED",i[i.OUT_OF_RANGE=11]="OUT_OF_RANGE",i[i.UNIMPLEMENTED=12]="UNIMPLEMENTED",i[i.INTERNAL=13]="INTERNAL",i[i.UNAVAILABLE=14]="UNAVAILABLE",i[i.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rP=new c.z8([4294967295,4294967295],0);function rF(e){let t=(new TextEncoder).encode(e),n=new c.V8;return n.update(t),new Uint8Array(n.digest())}function rL(e){let t=new DataView(e.buffer),n=t.getUint32(0,!0),r=t.getUint32(4,!0),i=t.getUint32(8,!0),s=t.getUint32(12,!0);return[new c.z8([n,r],0),new c.z8([i,s],0)]}class rU{constructor(e,t,n){if(this.bitmap=e,this.padding=t,this.hashCount=n,t<0||t>=8)throw new rq(`Invalid padding: ${t}`);if(n<0||e.length>0&&0===this.hashCount)throw new rq(`Invalid hash count: ${n}`);if(0===e.length&&0!==t)throw new rq(`Invalid padding when bitmap length is 0: ${t}`);this.ge=8*e.length-t,this.pe=c.z8.fromNumber(this.ge)}ye(e,t,n){let r=e.add(t.multiply(c.z8.fromNumber(n)));return 1===r.compare(rP)&&(r=new c.z8([r.getBits(0),r.getBits(1)],0)),r.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(0===this.ge)return!1;let[t,n]=rL(rF(e));for(let e=0;e<this.hashCount;e++){let r=this.ye(t,n,e);if(!this.we(r))return!1}return!0}static create(e,t,n){let r=new rU(new Uint8Array(Math.ceil(e/8)),e%8==0?0:8-e%8,t);return n.forEach(e=>r.insert(e)),r}insert(e){if(0===this.ge)return;let[t,n]=rL(rF(e));for(let e=0;e<this.hashCount;e++){let r=this.ye(t,n,e);this.Se(r)}}Se(e){this.bitmap[Math.floor(e/8)]|=1<<e%8}}class rq extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rB{constructor(e,t,n,r,i){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=n,this.documentUpdates=r,this.resolvedLimboDocuments=i}static createSynthesizedRemoteEventForCurrentChange(e,t,n){let r=new Map;return r.set(e,rz.createSynthesizedTargetChangeForCurrentChange(e,t,n)),new rB(es.min(),r,new tk(q),n6,rn())}}class rz{constructor(e,t,n,r,i){this.resumeToken=e,this.current=t,this.addedDocuments=n,this.modifiedDocuments=r,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,n){return new rz(n,t,rn(),rn(),rn())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rK{constructor(e,t,n,r){this.be=e,this.removedTargetIds=t,this.key=n,this.De=r}}class rG{constructor(e,t){this.targetId=e,this.Ce=t}}class r${constructor(e,t,n=tU.EMPTY_BYTE_STRING,r=null){this.state=e,this.targetIds=t,this.resumeToken=n,this.cause=r}}class rj{constructor(){this.ve=0,this.Fe=rH(),this.Me=tU.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return 0!==this.ve}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=rn(),t=rn(),n=rn();return this.Fe.forEach((r,i)=>{switch(i){case 0:e=e.add(r);break;case 2:t=t.add(r);break;case 1:n=n.add(r);break;default:S(38017,{changeType:i})}}),new rz(this.Me,this.xe,e,t,n)}qe(){this.Oe=!1,this.Fe=rH()}Qe(e,t){this.Oe=!0,this.Fe=this.Fe.insert(e,t)}$e(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}Ue(){this.ve+=1}Ke(){this.ve-=1,N(this.ve>=0,3241,{ve:this.ve})}We(){this.Oe=!0,this.xe=!0}}class rQ{constructor(e){this.Ge=e,this.ze=new Map,this.je=n6,this.Je=rW(),this.He=rW(),this.Ye=new tk(q)}Ze(e){for(let t of e.be)e.De&&e.De.isFoundDocument()?this.Xe(t,e.De):this.et(t,e.key,e.De);for(let t of e.removedTargetIds)this.et(t,e.key,e.De)}tt(e){this.forEachTarget(e,t=>{let n=this.nt(t);switch(e.state){case 0:this.rt(t)&&n.Le(e.resumeToken);break;case 1:n.Ke(),n.Ne||n.qe(),n.Le(e.resumeToken);break;case 2:n.Ke(),n.Ne||this.removeTarget(t);break;case 3:this.rt(t)&&(n.We(),n.Le(e.resumeToken));break;case 4:this.rt(t)&&(this.it(t),n.Le(e.resumeToken));break;default:S(56790,{state:e.state})}})}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.ze.forEach((e,n)=>{this.rt(n)&&t(n)})}st(e){let t=e.targetId,n=e.Ce.count,r=this.ot(t);if(r){let i=r.target;if(nB(i)){if(0===n){let e=new H(i.path);this.et(t,e,np.newNoDocument(e,es.min()))}else N(1===n,20013,{expectedCount:n})}else{let r=this._t(t);if(r!==n){let n=this.ut(e),i=n?this.ct(n,e,r):1;0!==i&&(this.it(t),this.Ye=this.Ye.insert(t,2===i?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch"))}}}}ut(e){let t,n;let r=e.Ce.unchangedNames;if(!r||!r.bits)return null;let{bits:{bitmap:i="",padding:s=0},hashCount:a=0}=r;try{t=tK(i).toUint8Array()}catch(e){if(e instanceof tL)return _("Decoding the base64 bloom filter in existence filter failed ("+e.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw e}try{n=new rU(t,s,a)}catch(e){return _(e instanceof rq?"BloomFilter error: ":"Applying bloom filter failed: ",e),null}return 0===n.ge?null:n}ct(e,t,n){return t.Ce.count===n-this.Pt(e,t.targetId)?0:2}Pt(e,t){let n=this.Ge.getRemoteKeysForTarget(t),r=0;return n.forEach(n=>{let i=this.Ge.ht(),s=`projects/${i.projectId}/databases/${i.database}/documents/${n.path.canonicalString()}`;e.mightContain(s)||(this.et(t,n,null),r++)}),r}Tt(e){let t=new Map;this.ze.forEach((n,r)=>{let i=this.ot(r);if(i){if(n.current&&nB(i.target)){let t=new H(i.target.path);this.It(t).has(r)||this.Et(r,t)||this.et(r,t,np.newNoDocument(t,e))}n.Be&&(t.set(r,n.ke()),n.qe())}});let n=rn();this.He.forEach((e,t)=>{let r=!0;t.forEachWhile(e=>{let t=this.ot(e);return!t||"TargetPurposeLimboResolution"===t.purpose||(r=!1,!1)}),r&&(n=n.add(e))}),this.je.forEach((t,n)=>n.setReadTime(e));let r=new rB(e,t,this.Ye,this.je,n);return this.je=n6,this.Je=rW(),this.He=rW(),this.Ye=new tk(q),r}Xe(e,t){if(!this.rt(e))return;let n=this.Et(e,t.key)?2:0;this.nt(e).Qe(t.key,n),this.je=this.je.insert(t.key,t),this.Je=this.Je.insert(t.key,this.It(t.key).add(e)),this.He=this.He.insert(t.key,this.dt(t.key).add(e))}et(e,t,n){if(!this.rt(e))return;let r=this.nt(e);this.Et(e,t)?r.Qe(t,1):r.$e(t),this.He=this.He.insert(t,this.dt(t).delete(e)),this.He=this.He.insert(t,this.dt(t).add(e)),n&&(this.je=this.je.insert(t,n))}removeTarget(e){this.ze.delete(e)}_t(e){let t=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+t.addedDocuments.size-t.removedDocuments.size}Ue(e){this.nt(e).Ue()}nt(e){let t=this.ze.get(e);return t||(t=new rj,this.ze.set(e,t)),t}dt(e){let t=this.He.get(e);return t||(t=new tM(q),this.He=this.He.insert(e,t)),t}It(e){let t=this.Je.get(e);return t||(t=new tM(q),this.Je=this.Je.insert(e,t)),t}rt(e){let t=null!==this.ot(e);return t||T("WatchChangeAggregator","Detected inactive target",e),t}ot(e){let t=this.ze.get(e);return t&&t.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new rj),this.Ge.getRemoteKeysForTarget(e).forEach(t=>{this.et(e,t,null)})}Et(e,t){return this.Ge.getRemoteKeysForTarget(e).has(t)}}function rW(){return new tk(H.comparator)}function rH(){return new tk(H.comparator)}let rY={asc:"ASCENDING",desc:"DESCENDING"},rX={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},rJ={and:"AND",or:"OR"};class rZ{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function r0(e,t){return e.useProto3Json||null==t?t:{value:t}}function r1(e,t){return e.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function r2(e,t){return e.useProto3Json?t.toBase64():t.toUint8Array()}function r5(e){return N(!!e,49232),es.fromTimestamp(function(e){let t=tB(e);return new ei(t.seconds,t.nanos)}(e))}function r4(e,t){return r6(e,t).canonicalString()}function r6(e,t){let n=new j(["projects",e.projectId,"databases",e.database]).child("documents");return void 0===t?n:n.child(t)}function r3(e){let t=j.fromString(e);return N(id(t),10190,{key:t.toString()}),t}function r8(e,t){return r4(e.databaseId,t.path)}function r9(e,t){let n=r3(t);if(n.get(1)!==e.databaseId.projectId)throw new D(C.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+e.databaseId.projectId);if(n.get(3)!==e.databaseId.database)throw new D(C.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+e.databaseId.database);return new H(ir(n))}function r7(e,t){return r4(e.databaseId,t)}function ie(e){let t=r3(e);return 4===t.length?j.emptyPath():ir(t)}function it(e){return new j(["projects",e.databaseId.projectId,"databases",e.databaseId.database]).canonicalString()}function ir(e){return N(e.length>4&&"documents"===e.get(4),29091,{key:e.toString()}),e.popFirst(5)}function ii(e,t,n){return{name:r8(e,t),fields:n.value.mapValue.fields}}function is(e,t){var n;let r;if(t instanceof rb)r={update:ii(e,t.key,t.value)};else if(t instanceof rD)r={delete:r8(e,t.key)};else if(t instanceof rS)r={update:ii(e,t.key,t.data),updateMask:function(e){let t=[];return e.fields.forEach(e=>t.push(e.canonicalString())),{fieldPaths:t}}(t.fieldMask)};else{if(!(t instanceof rA))return S(16599,{Vt:t.type});r={verify:r8(e,t.key)}}return t.fieldTransforms.length>0&&(r.updateTransforms=t.fieldTransforms.map(e=>(function(e,t){let n=t.transform;if(n instanceof rl)return{fieldPath:t.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(n instanceof ru)return{fieldPath:t.field.canonicalString(),appendMissingElements:{values:n.elements}};if(n instanceof rc)return{fieldPath:t.field.canonicalString(),removeAllFromArray:{values:n.elements}};if(n instanceof rf)return{fieldPath:t.field.canonicalString(),increment:n.Ae};throw S(20930,{transform:t.transform})})(0,e))),t.precondition.isNone||(r.currentDocument=void 0!==(n=t.precondition).updateTime?{updateTime:r1(e,n.updateTime.toTimestamp())}:void 0!==n.exists?{exists:n.exists}:S(27497)),r}function ia(e,t){var n;let r=t.currentDocument?void 0!==(n=t.currentDocument).updateTime?rw.updateTime(r5(n.updateTime)):void 0!==n.exists?rw.exists(n.exists):rw.none():rw.none(),i=t.updateTransforms?t.updateTransforms.map(t=>{let n;return n=null,"setToServerValue"in t?(N("REQUEST_TIME"===t.setToServerValue,16630,{proto:t}),n=new rl):"appendMissingElements"in t?n=new ru(t.appendMissingElements.values||[]):"removeAllFromArray"in t?n=new rc(t.removeAllFromArray.values||[]):"increment"in t?n=new rf(e,t.increment):S(16584,{proto:t}),new rp(W.fromServerFormat(t.fieldPath),n)}):[];if(t.update){t.update.name;let n=r9(e,t.update.name),s=new ng({mapValue:{fields:t.update.fields}});return t.updateMask?new rS(n,s,new tF((t.updateMask.fieldPaths||[]).map(e=>W.fromServerFormat(e))),r,i):new rb(n,s,r,i)}return t.delete?new rD(r9(e,t.delete),r):t.verify?new rA(r9(e,t.verify),r):S(1463,{proto:t})}function io(e,t){return{documents:[r7(e,t.path)]}}function il(e,t){var n,r;let i;let s={structuredQuery:{}},a=t.path;null!==t.collectionGroup?(i=a,s.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(i=a.popLast(),s.structuredQuery.from=[{collectionId:a.lastSegment()}]),s.parent=r7(e,i);let o=function(e){if(0!==e.length)return function e(t){return t instanceof nE?function(e){if("=="===e.op){if(no(e.value))return{unaryFilter:{field:ih(e.field),op:"IS_NAN"}};if(na(e.value))return{unaryFilter:{field:ih(e.field),op:"IS_NULL"}}}else if("!="===e.op){if(no(e.value))return{unaryFilter:{field:ih(e.field),op:"IS_NOT_NAN"}};if(na(e.value))return{unaryFilter:{field:ih(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:ih(e.field),op:rX[e.op],value:e.value}}}(t):t instanceof n_?function(t){let n=t.getFilters().map(t=>e(t));return 1===n.length?n[0]:{compositeFilter:{op:rJ[t.op],filters:n}}}(t):S(54877,{filter:t})}(n_.create(e,"and"))}(t.filters);o&&(s.structuredQuery.where=o);let l=function(e){if(0!==e.length)return e.map(e=>({field:ih(e.field),direction:rY[e.dir]}))}(t.orderBy);l&&(s.structuredQuery.orderBy=l);let u=r0(e,t.limit);return null!==u&&(s.structuredQuery.limit=u),t.startAt&&(s.structuredQuery.startAt={before:(n=t.startAt).inclusive,values:n.position}),t.endAt&&(s.structuredQuery.endAt={before:!(r=t.endAt).inclusive,values:r.position}),{ft:s,parent:i}}function iu(e){var t;let n,r=ie(e.parent),i=e.structuredQuery,s=i.from?i.from.length:0,a=null;if(s>0){N(1===s,65062);let e=i.from[0];e.allDescendants?a=e.collectionId:r=r.child(e.collectionId)}let o=[];i.where&&(o=function(e){let t=function e(t){return void 0!==t.unaryFilter?function(e){switch(e.unaryFilter.op){case"IS_NAN":let t=ic(e.unaryFilter.field);return nE.create(t,"==",{doubleValue:NaN});case"IS_NULL":let n=ic(e.unaryFilter.field);return nE.create(n,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":let r=ic(e.unaryFilter.field);return nE.create(r,"!=",{doubleValue:NaN});case"IS_NOT_NULL":let i=ic(e.unaryFilter.field);return nE.create(i,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return S(61313);default:return S(60726)}}(t):void 0!==t.fieldFilter?nE.create(ic(t.fieldFilter.field),function(e){switch(e){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return S(58110);default:return S(50506)}}(t.fieldFilter.op),t.fieldFilter.value):void 0!==t.compositeFilter?n_.create(t.compositeFilter.filters.map(t=>e(t)),function(e){switch(e){case"AND":return"and";case"OR":return"or";default:return S(1026)}}(t.compositeFilter.op)):S(30097,{filter:t})}(e);return t instanceof n_&&nx(t)?t.getFilters():[t]}(i.where));let l=[];i.orderBy&&(l=i.orderBy.map(e=>new nI(ic(e.field),function(e){switch(e){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(e.direction))));let u=null;i.limit&&(u=null==(n="object"==typeof(t=i.limit)?t.value:t)?null:n);let h=null;i.startAt&&(h=function(e){let t=!!e.before;return new ny(e.values||[],t)}(i.startAt));let c=null;return i.endAt&&(c=function(e){let t=!e.before;return new ny(e.values||[],t)}(i.endAt)),new n$(r,a,l,o,u,"F",h,c)}function ih(e){return{fieldPath:e.canonicalString()}}function ic(e){return W.fromServerFormat(e.fieldPath)}function id(e){return e.length>=4&&"projects"===e.get(0)&&"databases"===e.get(2)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class im{constructor(e,t,n,r,i=es.min(),s=es.min(),a=tU.EMPTY_BYTE_STRING,o=null){this.target=e,this.targetId=t,this.purpose=n,this.sequenceNumber=r,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=s,this.resumeToken=a,this.expectedCount=o}withSequenceNumber(e){return new im(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new im(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new im(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new im(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ig{constructor(e){this.yt=e}}function ip(e,t){let n=t.key,r={prefixPath:n.getCollectionPath().popLast().toArray(),collectionGroup:n.collectionGroup,documentId:n.path.lastSegment(),readTime:iy(t.readTime),hasCommittedMutations:t.hasCommittedMutations};if(t.isFoundDocument()){var i;r.document={name:r8(i=e.yt,t.key),fields:t.data.value.mapValue.fields,updateTime:r1(i,t.version.toTimestamp()),createTime:r1(i,t.createTime.toTimestamp())}}else if(t.isNoDocument())r.noDocument={path:n.path.toArray(),readTime:iw(t.version)};else{if(!t.isUnknownDocument())return S(57904,{document:t});r.unknownDocument={path:n.path.toArray(),version:iw(t.version)}}return r}function iy(e){let t=e.toTimestamp();return[t.seconds,t.nanoseconds]}function iw(e){let t=e.toTimestamp();return{seconds:t.seconds,nanoseconds:t.nanoseconds}}function iv(e){let t=new ei(e.seconds,e.nanoseconds);return es.fromTimestamp(t)}function iI(e,t){let n=(t.baseMutations||[]).map(t=>ia(e.yt,t));for(let e=0;e<t.mutations.length-1;++e){let n=t.mutations[e];if(e+1<t.mutations.length&&void 0!==t.mutations[e+1].transform){let r=t.mutations[e+1];n.updateTransforms=r.transform.fieldTransforms,t.mutations.splice(e+1,1),++e}}let r=t.mutations.map(t=>ia(e.yt,t)),i=ei.fromMillis(t.localWriteTimeMs);return new rk(t.batchId,i,n,r)}function iT(e){let t=iv(e.readTime),n=void 0!==e.lastLimboFreeSnapshotVersion?iv(e.lastLimboFreeSnapshotVersion):es.min();return new im(void 0!==e.query.documents?function(e){let t=e.documents.length;return N(1===t,1966,{count:t}),nY(nj(ie(e.documents[0])))}(e.query):nY(iu(e.query)),e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,n,tU.fromBase64String(e.resumeToken))}function iE(e,t){let n;let r=iw(t.snapshotVersion),i=iw(t.lastLimboFreeSnapshotVersion);n=nB(t.target)?io(e.yt,t.target):il(e.yt,t.target).ft;let s=t.resumeToken.toBase64();return{targetId:t.targetId,canonicalId:nU(t.target),readTime:r,resumeToken:s,lastListenSequenceNumber:t.sequenceNumber,lastLimboFreeSnapshotVersion:i,query:n}}function i_(e){let t=iu({parent:e.parent,structuredQuery:e.structuredQuery});return"LAST"===e.limitType?nJ(t,t.limit,"L"):t}function ib(e,t){return new rV(t.largestBatchId,ia(e.yt,t.overlayMutation))}function iS(e,t){let n=t.path.lastSegment();return[e,eM(t.path.popLast()),n]}function ix(e,t,n,r){return{indexId:e,uid:t,sequenceNumber:n,readTime:iw(r.readTime),documentKey:eM(r.documentKey.path),largestBatchId:r.largestBatchId}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iN{getBundleMetadata(e,t){return tN(e,tn).get(t).next(e=>{if(e)return{id:e.bundleId,createTime:iv(e.createTime),version:e.version}})}saveBundleMetadata(e,t){return tN(e,tn).put({bundleId:t.id,createTime:iw(r5(t.createTime)),version:t.version})}getNamedQuery(e,t){return tN(e,tr).get(t).next(e=>{if(e)return{name:e.name,query:i_(e.bundledQuery),readTime:iv(e.readTime)}})}saveNamedQuery(e,t){return tN(e,tr).put({name:t.name,readTime:iw(r5(t.readTime)),bundledQuery:t.bundledQuery})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iC{constructor(e,t){this.serializer=e,this.userId=t}static wt(e,t){return new iC(e,t.uid||"")}getOverlay(e,t){return tN(e,tm).get(iS(this.userId,t)).next(e=>e?ib(this.serializer,e):null)}getOverlays(e,t){let n=n7();return ey.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){let r=[];return n.forEach((n,i)=>{let s=new rV(t,i);r.push(this.St(e,s))}),ey.waitFor(r)}removeOverlaysForBatchId(e,t,n){let r=new Set;t.forEach(e=>r.add(eM(e.getCollectionPath())));let i=[];return r.forEach(t=>{let r=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,n+1],!1,!0);i.push(tN(e,tm).Z(tp,r))}),ey.waitFor(i)}getOverlaysForCollection(e,t,n){let r=n7(),i=eM(t),s=IDBKeyRange.bound([this.userId,i,n],[this.userId,i,Number.POSITIVE_INFINITY],!0);return tN(e,tm).J(tp,s).next(e=>{for(let t of e){let e=ib(this.serializer,t);r.set(e.getKey(),e)}return r})}getOverlaysForCollectionGroup(e,t,n,r){let i;let s=n7(),a=IDBKeyRange.bound([this.userId,t,n],[this.userId,t,Number.POSITIVE_INFINITY],!0);return tN(e,tm).ee({index:tw,range:a},(e,t,n)=>{let a=ib(this.serializer,t);s.size()<r||a.largestBatchId===i?(s.set(a.getKey(),a),i=a.largestBatchId):n.done()}).next(()=>s)}St(e,t){return tN(e,tm).put(function(e,t,n){let[r,i,s]=iS(t,n.mutation.key);return{userId:t,collectionPath:i,documentId:s,collectionGroup:n.mutation.key.getCollectionGroup(),largestBatchId:n.largestBatchId,overlayMutation:is(e.yt,n.mutation)}}(this.serializer,this.userId,t))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iD{bt(e){return tN(e,tI)}getSessionToken(e){return this.bt(e).get("sessionToken").next(e=>{let t=e?.value;return t?tU.fromUint8Array(t):tU.EMPTY_BYTE_STRING})}setSessionToken(e,t){return this.bt(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iA{constructor(){}Dt(e,t){this.Ct(e,t),t.vt()}Ct(e,t){if("nullValue"in e)this.Ft(t,5);else if("booleanValue"in e)this.Ft(t,10),t.Mt(e.booleanValue?1:0);else if("integerValue"in e)this.Ft(t,15),t.Mt(tz(e.integerValue));else if("doubleValue"in e){let n=tz(e.doubleValue);isNaN(n)?this.Ft(t,13):(this.Ft(t,15),eV(n)?t.Mt(0):t.Mt(n))}else if("timestampValue"in e){let n=e.timestampValue;this.Ft(t,20),"string"==typeof n&&(n=tB(n)),t.xt(`${n.seconds||""}`),t.Mt(n.nanos||0)}else if("stringValue"in e)this.Ot(e.stringValue,t),this.Nt(t);else if("bytesValue"in e)this.Ft(t,30),t.Bt(tK(e.bytesValue)),this.Nt(t);else if("referenceValue"in e)this.Lt(e.referenceValue,t);else if("geoPointValue"in e){let n=e.geoPointValue;this.Ft(t,45),t.Mt(n.latitude||0),t.Mt(n.longitude||0)}else"mapValue"in e?nc(e)?this.Ft(t,Number.MAX_SAFE_INTEGER):nu(e)?this.kt(e.mapValue,t):(this.qt(e.mapValue,t),this.Nt(t)):"arrayValue"in e?(this.Qt(e.arrayValue,t),this.Nt(t)):S(19022,{$t:e})}Ot(e,t){this.Ft(t,25),this.Ut(e,t)}Ut(e,t){t.xt(e)}qt(e,t){let n=e.fields||{};for(let e of(this.Ft(t,55),Object.keys(n)))this.Ot(e,t),this.Ct(n[e],t)}kt(e,t){let n=e.fields||{};this.Ft(t,53);let r=n[t4].arrayValue?.values?.length||0;this.Ft(t,15),t.Mt(tz(r)),this.Ot(t4,t),this.Ct(n[t4],t)}Qt(e,t){let n=e.values||[];for(let e of(this.Ft(t,50),n))this.Ct(e,t)}Lt(e,t){this.Ft(t,37),H.fromName(e).path.forEach(e=>{this.Ft(t,60),this.Ut(e,t)})}Ft(e,t){e.Mt(t)}Nt(e){e.Mt(2)}}function ik(e){return Math.ceil((64-function(e){let t=0;for(let n=0;n<8;++n){let r=function(e){if(0===e)return 8;let t=0;return e>>4||(t+=4,e<<=4),e>>6||(t+=2,e<<=2),e>>7||(t+=1),t}(255&e[n]);if(t+=r,8!==r)break}return t}(e))/8)}iA.Kt=new iA;class iR{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Wt(e){let t=e[Symbol.iterator](),n=t.next();for(;!n.done;)this.Gt(n.value),n=t.next();this.zt()}jt(e){let t=e[Symbol.iterator](),n=t.next();for(;!n.done;)this.Jt(n.value),n=t.next();this.Ht()}Yt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Gt(e);else if(e<2048)this.Gt(960|e>>>6),this.Gt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Gt(480|e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e);else{let e=t.codePointAt(0);this.Gt(240|e>>>18),this.Gt(128|63&e>>>12),this.Gt(128|63&e>>>6),this.Gt(128|63&e)}}this.zt()}Zt(e){for(let t of e){let e=t.charCodeAt(0);if(e<128)this.Jt(e);else if(e<2048)this.Jt(960|e>>>6),this.Jt(128|63&e);else if(t<"\ud800"||"\udbff"<t)this.Jt(480|e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e);else{let e=t.codePointAt(0);this.Jt(240|e>>>18),this.Jt(128|63&e>>>12),this.Jt(128|63&e>>>6),this.Jt(128|63&e)}}this.Ht()}Xt(e){let t=this.en(e),n=ik(t);this.tn(1+n),this.buffer[this.position++]=255&n;for(let e=t.length-n;e<t.length;++e)this.buffer[this.position++]=255&t[e]}nn(e){let t=this.en(e),n=ik(t);this.tn(1+n),this.buffer[this.position++]=~(255&n);for(let e=t.length-n;e<t.length;++e)this.buffer[this.position++]=~(255&t[e])}rn(){this.sn(255),this.sn(255)}_n(){this.an(255),this.an(255)}reset(){this.position=0}seed(e){this.tn(e.length),this.buffer.set(e,this.position),this.position+=e.length}un(){return this.buffer.slice(0,this.position)}en(e){let t=function(e){let t=new DataView(new ArrayBuffer(8));return t.setFloat64(0,e,!1),new Uint8Array(t.buffer)}(e),n=!!(128&t[0]);t[0]^=n?255:128;for(let e=1;e<t.length;++e)t[e]^=n?255:0;return t}Gt(e){let t=255&e;0===t?(this.sn(0),this.sn(255)):255===t?(this.sn(255),this.sn(0)):this.sn(t)}Jt(e){let t=255&e;0===t?(this.an(0),this.an(255)):255===t?(this.an(255),this.an(0)):this.an(e)}zt(){this.sn(0),this.sn(1)}Ht(){this.an(0),this.an(1)}sn(e){this.tn(1),this.buffer[this.position++]=e}an(e){this.tn(1),this.buffer[this.position++]=~e}tn(e){let t=e+this.position;if(t<=this.buffer.length)return;let n=2*this.buffer.length;n<t&&(n=t);let r=new Uint8Array(n);r.set(this.buffer),this.buffer=r}}class iV{constructor(e){this.cn=e}Bt(e){this.cn.Wt(e)}xt(e){this.cn.Yt(e)}Mt(e){this.cn.Xt(e)}vt(){this.cn.rn()}}class iM{constructor(e){this.cn=e}Bt(e){this.cn.jt(e)}xt(e){this.cn.Zt(e)}Mt(e){this.cn.nn(e)}vt(){this.cn._n()}}class iO{constructor(){this.cn=new iR,this.ln=new iV(this.cn),this.hn=new iM(this.cn)}seed(e){this.cn.seed(e)}Pn(e){return 0===e?this.ln:this.hn}un(){return this.cn.un()}reset(){this.cn.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iP{constructor(e,t,n,r){this.Tn=e,this.In=t,this.En=n,this.dn=r}An(){let e=this.dn.length,t=0===e||255===this.dn[e-1]?e+1:e,n=new Uint8Array(t);return n.set(this.dn,0),t!==e?n.set([0],this.dn.length):++n[n.length-1],new iP(this.Tn,this.In,this.En,n)}Rn(e,t,n){return{indexId:this.Tn,uid:e,arrayValue:iU(this.En),directionalValue:iU(this.dn),orderedDocumentKey:iU(t),documentKey:n.path.toArray()}}Vn(e,t,n){let r=this.Rn(e,t,n);return[r.indexId,r.uid,r.arrayValue,r.directionalValue,r.orderedDocumentKey,r.documentKey]}}function iF(e,t){let n=e.Tn-t.Tn;return 0!==n?n:0!==(n=iL(e.En,t.En))?n:0!==(n=iL(e.dn,t.dn))?n:H.comparator(e.In,t.In)}function iL(e,t){for(let n=0;n<e.length&&n<t.length;++n){let r=e[n]-t[n];if(0!==r)return r}return e.length-t.length}function iU(e){return(0,h.WO)()?function(e){let t="";for(let n=0;n<e.length;n++)t+=String.fromCharCode(e[n]);return t}(e):e}function iq(e){return"string"!=typeof e?e:function(e){let t=new Uint8Array(e.length);for(let n=0;n<e.length;n++)t[n]=e.charCodeAt(n);return t}(e)}class iB{constructor(e){for(let t of(this.mn=new tM((e,t)=>W.comparator(e.field,t.field)),this.collectionId=null!=e.collectionGroup?e.collectionGroup:e.path.lastSegment(),this.fn=e.orderBy,this.gn=[],e.filters))t.isInequality()?this.mn=this.mn.add(t):this.gn.push(t)}get pn(){return this.mn.size>1}yn(e){if(N(e.collectionGroup===this.collectionId,49279),this.pn)return!1;let t=eo(e);if(void 0!==t&&!this.wn(t))return!1;let n=el(e),r=new Set,i=0,s=0;for(;i<n.length&&this.wn(n[i]);++i)r=r.add(n[i].fieldPath.canonicalString());if(i===n.length)return!0;if(this.mn.size>0){let e=this.mn.getIterator().getNext();if(!r.has(e.field.canonicalString())){let t=n[i];if(!this.Sn(e,t)||!this.bn(this.fn[s++],t))return!1}++i}for(;i<n.length;++i){let e=n[i];if(s>=this.fn.length||!this.bn(this.fn[s++],e))return!1}return!0}Dn(){if(this.pn)return null;let e=new tM(W.comparator),t=[];for(let n of this.gn)if(!n.field.isKeyField()){if("array-contains"===n.op||"array-contains-any"===n.op)t.push(new eu(n.field,2));else{if(e.has(n.field))continue;e=e.add(n.field),t.push(new eu(n.field,0))}}for(let n of this.fn)n.field.isKeyField()||e.has(n.field)||(e=e.add(n.field),t.push(new eu(n.field,"asc"===n.dir?0:1)));return new ea(ea.UNKNOWN_ID,this.collectionId,t,eh.empty())}wn(e){for(let t of this.gn)if(this.Sn(t,e))return!0;return!1}Sn(e,t){if(void 0===e||!e.field.isEqual(t.fieldPath))return!1;let n="array-contains"===e.op||"array-contains-any"===e.op;return 2===t.kind===n}bn(e,t){return!!e.field.isEqual(t.fieldPath)&&(0===t.kind&&"asc"===e.dir||1===t.kind&&"desc"===e.dir)}}function iz(e){return e instanceof nE}function iK(e){return e instanceof n_&&nx(e)}function iG(e){return iz(e)||iK(e)||function(e){if(e instanceof n_&&nS(e)){for(let t of e.getFilters())if(!iz(t)&&!iK(t))return!1;return!0}return!1}(e)}function i$(e,t){return N(e instanceof nE||e instanceof n_,38388),N(t instanceof nE||t instanceof n_,25473),iQ(e instanceof nE?t instanceof nE?n_.create([e,t],"and"):ij(e,t):t instanceof nE?ij(t,e):function(e,t){if(N(e.filters.length>0&&t.filters.length>0,48005),nb(e)&&nb(t))return nC(e,t.getFilters());let n=nS(e)?e:t,r=nS(e)?t:e,i=n.filters.map(e=>i$(e,r));return n_.create(i,"or")}(e,t))}function ij(e,t){if(nb(t))return nC(t,e.getFilters());{let n=t.filters.map(t=>i$(e,t));return n_.create(n,"or")}}function iQ(e){if(N(e instanceof nE||e instanceof n_,11850),e instanceof nE)return e;let t=e.getFilters();if(1===t.length)return iQ(t[0]);if(nN(e))return e;let n=t.map(e=>iQ(e)),r=[];return n.forEach(t=>{t instanceof nE?r.push(t):t instanceof n_&&(t.op===e.op?r.push(...t.filters):r.push(t))}),1===r.length?r[0]:n_.create(r,e.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iW{constructor(){this.Cn=new iH}addToCollectionParentIndex(e,t){return this.Cn.add(t),ey.resolve()}getCollectionParents(e,t){return ey.resolve(this.Cn.getEntries(t))}addFieldIndex(e,t){return ey.resolve()}deleteFieldIndex(e,t){return ey.resolve()}deleteAllFieldIndexes(e){return ey.resolve()}createTargetIndexes(e,t){return ey.resolve()}getDocumentsMatchingTarget(e,t){return ey.resolve(null)}getIndexType(e,t){return ey.resolve(0)}getFieldIndexes(e,t){return ey.resolve([])}getNextCollectionGroupToUpdate(e){return ey.resolve(null)}getMinOffset(e,t){return ey.resolve(ed.min())}getMinOffsetFromCollectionGroup(e,t){return ey.resolve(ed.min())}updateCollectionGroup(e,t,n){return ey.resolve()}updateIndexEntries(e,t){return ey.resolve()}}class iH{constructor(){this.index={}}add(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t]||new tM(j.comparator),i=!r.has(n);return this.index[t]=r.add(n),i}has(e){let t=e.lastSegment(),n=e.popLast(),r=this.index[t];return r&&r.has(n)}getEntries(e){return(this.index[e]||new tM(j.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let iY="IndexedDbIndexManager",iX=new Uint8Array(0);class iJ{constructor(e,t){this.databaseId=t,this.vn=new iH,this.Fn=new n4(e=>nU(e),(e,t)=>nq(e,t)),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.vn.has(t)){let n=t.lastSegment(),r=t.popLast();e.addOnCommittedListener(()=>{this.vn.add(t)});let i={collectionId:n,parent:eM(r)};return tN(e,e7).put(i)}return ey.resolve()}getCollectionParents(e,t){let n=[],r=IDBKeyRange.bound([t,""],[t+"\0",""],!1,!0);return tN(e,e7).J(r).next(e=>{for(let r of e){if(r.collectionId!==t)break;n.push(eO(r.parent))}return n})}addFieldIndex(e,t){let n=tN(e,ti),r={indexId:t.indexId,collectionGroup:t.collectionGroup,fields:t.fields.map(e=>[e.fieldPath.canonicalString(),e.kind])};delete r.indexId;let i=n.add(r);if(t.indexState){let n=tN(e,ta);return i.next(e=>{n.put(ix(e,this.uid,t.indexState.sequenceNumber,t.indexState.offset))})}return i.next()}deleteFieldIndex(e,t){let n=tN(e,ti),r=tN(e,ta),i=tN(e,th);return n.delete(t.indexId).next(()=>r.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))).next(()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))}deleteAllFieldIndexes(e){let t=tN(e,ti),n=tN(e,th),r=tN(e,ta);return t.Z().next(()=>n.Z()).next(()=>r.Z())}createTargetIndexes(e,t){return ey.forEach(this.Mn(t),t=>this.getIndexType(e,t).next(n=>{if(0===n||1===n){let n=new iB(t).Dn();if(null!=n)return this.addFieldIndex(e,n)}}))}getDocumentsMatchingTarget(e,t){let n=tN(e,th),r=!0,i=new Map;return ey.forEach(this.Mn(t),t=>this.xn(e,t).next(e=>{r&&(r=!!e),i.set(t,e)})).next(()=>{if(r){let e=rn(),r=[];return ey.forEach(i,(i,s)=>{T(iY,`Using index id=${i.indexId}|cg=${i.collectionGroup}|f=${i.fields.map(e=>`${e.fieldPath}:${e.kind}`).join(",")} to execute ${nU(t)}`);let a=function(e,t){let n=eo(t);if(void 0===n)return null;for(let t of nz(e,n.fieldPath))switch(t.op){case"array-contains-any":return t.value.arrayValue.values||[];case"array-contains":return[t.value]}return null}(s,i),o=function(e,t){let n=new Map;for(let r of el(t))for(let t of nz(e,r.fieldPath))switch(t.op){case"==":case"in":n.set(r.fieldPath.canonicalString(),t.value);break;case"not-in":case"!=":return n.set(r.fieldPath.canonicalString(),t.value),Array.from(n.values())}return null}(s,i),l=function(e,t){let n=[],r=!0;for(let i of el(t)){let t=0===i.kind?nK(e,i.fieldPath,e.startAt):nG(e,i.fieldPath,e.startAt);n.push(t.value),r&&(r=t.inclusive)}return new ny(n,r)}(s,i),u=function(e,t){let n=[],r=!0;for(let i of el(t)){let t=0===i.kind?nG(e,i.fieldPath,e.endAt):nK(e,i.fieldPath,e.endAt);n.push(t.value),r&&(r=t.inclusive)}return new ny(n,r)}(s,i),h=this.On(i,s,l),c=this.On(i,s,u),d=this.Nn(i,s,o),f=this.Bn(i.indexId,a,h,l.inclusive,c,u.inclusive,d);return ey.forEach(f,i=>n.Y(i,t.limit).next(t=>{t.forEach(t=>{let n=H.fromSegments(t.documentKey);e.has(n)||(e=e.add(n),r.push(n))})}))}).next(()=>r)}return ey.resolve(null)})}Mn(e){let t=this.Fn.get(e);return t||(t=0===e.filters.length?[e]:(function(e){if(0===e.getFilters().length)return[];let t=function e(t){if(N(t instanceof nE||t instanceof n_,34018),t instanceof nE)return t;if(1===t.filters.length)return e(t.filters[0]);let n=t.filters.map(t=>e(t)),r=n_.create(n,t.op);return iG(r=iQ(r))?r:(N(r instanceof n_,64498),N(nb(r),40251),N(r.filters.length>1,57927),r.filters.reduce((e,t)=>i$(e,t)))}(/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function e(t){if(N(t instanceof nE||t instanceof n_,20012),t instanceof nE){if(t instanceof nM){let e=t.value.arrayValue?.values?.map(e=>nE.create(t.field,"==",e))||[];return n_.create(e,"or")}return t}let n=t.filters.map(t=>e(t));return n_.create(n,t.op)}(e));return N(iG(t),7391),iz(t)||iK(t)?[t]:t.getFilters()})(n_.create(e.filters,"and")).map(t=>nL(e.path,e.collectionGroup,e.orderBy,t.getFilters(),e.limit,e.startAt,e.endAt)),this.Fn.set(e,t)),t}Bn(e,t,n,r,i,s,a){let o=(null!=t?t.length:1)*Math.max(n.length,i.length),l=o/(null!=t?t.length:1),u=[];for(let h=0;h<o;++h){let o=t?this.Ln(t[h/l]):iX,c=this.kn(e,o,n[h%l],r),d=this.qn(e,o,i[h%l],s),f=a.map(t=>this.kn(e,o,t,!0));u.push(...this.createRange(c,d,f))}return u}kn(e,t,n,r){let i=new iP(e,H.empty(),t,n);return r?i:i.An()}qn(e,t,n,r){let i=new iP(e,H.empty(),t,n);return r?i.An():i}xn(e,t){let n=new iB(t),r=null!=t.collectionGroup?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,r).next(e=>{let t=null;for(let r of e)n.yn(r)&&(!t||r.fields.length>t.fields.length)&&(t=r);return t})}getIndexType(e,t){let n=2,r=this.Mn(t);return ey.forEach(r,t=>this.xn(e,t).next(e=>{e?0!==n&&e.fields.length<function(e){let t=new tM(W.comparator),n=!1;for(let r of e.filters)for(let e of r.getFlattenedFilters())e.field.isKeyField()||("array-contains"===e.op||"array-contains-any"===e.op?n=!0:t=t.add(e.field));for(let n of e.orderBy)n.field.isKeyField()||(t=t.add(n.field));return t.size+(n?1:0)}(t)&&(n=1):n=0})).next(()=>null!==t.limit&&r.length>1&&2===n?1:n)}Qn(e,t){let n=new iO;for(let r of el(e)){let e=t.data.field(r.fieldPath);if(null==e)return null;let i=n.Pn(r.kind);iA.Kt.Dt(e,i)}return n.un()}Ln(e){let t=new iO;return iA.Kt.Dt(e,t.Pn(0)),t.un()}$n(e,t){let n=new iO;return iA.Kt.Dt(nr(this.databaseId,t),n.Pn(function(e){let t=el(e);return 0===t.length?0:t[t.length-1].kind}(e))),n.un()}Nn(e,t,n){if(null===n)return[];let r=[];r.push(new iO);let i=0;for(let s of el(e)){let e=n[i++];for(let n of r)if(this.Un(t,s.fieldPath)&&ns(e))r=this.Kn(r,s,e);else{let t=n.Pn(s.kind);iA.Kt.Dt(e,t)}}return this.Wn(r)}On(e,t,n){return this.Nn(e,t,n.position)}Wn(e){let t=[];for(let n=0;n<e.length;++n)t[n]=e[n].un();return t}Kn(e,t,n){let r=[...e],i=[];for(let e of n.arrayValue.values||[])for(let n of r){let r=new iO;r.seed(n.un()),iA.Kt.Dt(e,r.Pn(t.kind)),i.push(r)}return i}Un(e,t){return!!e.filters.find(e=>e instanceof nE&&e.field.isEqual(t)&&("in"===e.op||"not-in"===e.op))}getFieldIndexes(e,t){let n=tN(e,ti),r=tN(e,ta);return(t?n.J(ts,IDBKeyRange.bound(t,t)):n.J()).next(e=>{let t=[];return ey.forEach(e,e=>r.get([e.indexId,this.uid]).next(n=>{t.push(function(e,t){let n=t?new eh(t.sequenceNumber,new ed(iv(t.readTime),new H(eO(t.documentKey)),t.largestBatchId)):eh.empty(),r=e.fields.map(([e,t])=>new eu(W.fromServerFormat(e),t));return new ea(e.indexId,e.collectionGroup,r,n)}(e,n))})).next(()=>t)})}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next(e=>0===e.length?null:(e.sort((e,t)=>{let n=e.indexState.sequenceNumber-t.indexState.sequenceNumber;return 0!==n?n:q(e.collectionGroup,t.collectionGroup)}),e[0].collectionGroup))}updateCollectionGroup(e,t,n){let r=tN(e,ti),i=tN(e,ta);return this.Gn(e).next(e=>r.J(ts,IDBKeyRange.bound(t,t)).next(t=>ey.forEach(t,t=>i.put(ix(t.indexId,this.uid,e,n)))))}updateIndexEntries(e,t){let n=new Map;return ey.forEach(t,(t,r)=>{let i=n.get(t.collectionGroup);return(i?ey.resolve(i):this.getFieldIndexes(e,t.collectionGroup)).next(i=>(n.set(t.collectionGroup,i),ey.forEach(i,n=>this.zn(e,t,n).next(t=>{let i=this.jn(r,n);return t.isEqual(i)?ey.resolve():this.Jn(e,r,n,t,i)}))))})}Hn(e,t,n,r){return tN(e,th).put(r.Rn(this.uid,this.$n(n,t.key),t.key))}Yn(e,t,n,r){return tN(e,th).delete(r.Vn(this.uid,this.$n(n,t.key),t.key))}zn(e,t,n){let r=tN(e,th),i=new tM(iF);return r.ee({index:td,range:IDBKeyRange.only([n.indexId,this.uid,iU(this.$n(n,t))])},(e,r)=>{i=i.add(new iP(n.indexId,t,iq(r.arrayValue),iq(r.directionalValue)))}).next(()=>i)}jn(e,t){let n=new tM(iF),r=this.Qn(t,e);if(null==r)return n;let i=eo(t);if(null!=i){let s=e.data.field(i.fieldPath);if(ns(s))for(let i of s.arrayValue.values||[])n=n.add(new iP(t.indexId,e.key,this.Ln(i),r))}else n=n.add(new iP(t.indexId,e.key,iX,r));return n}Jn(e,t,n,r,i){T(iY,"Updating index entries for document '%s'",t.key);let s=[];return function(e,t,n,r,i){let s=e.getIterator(),a=t.getIterator(),o=tP(s),l=tP(a);for(;o||l;){let e=!1,t=!1;if(o&&l){let r=n(o,l);r<0?t=!0:r>0&&(e=!0)}else null!=o?t=!0:e=!0;e?(r(l),l=tP(a)):t?(i(o),o=tP(s)):(o=tP(s),l=tP(a))}}(r,i,iF,r=>{s.push(this.Hn(e,t,n,r))},r=>{s.push(this.Yn(e,t,n,r))}),ey.waitFor(s)}Gn(e){let t=1;return tN(e,ta).ee({index:tl,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},(e,n,r)=>{r.done(),t=n.sequenceNumber+1}).next(()=>t)}createRange(e,t,n){n=n.sort((e,t)=>iF(e,t)).filter((e,t,n)=>!t||0!==iF(e,n[t-1]));let r=[];for(let i of(r.push(e),n)){let n=iF(i,e),s=iF(i,t);if(0===n)r[0]=e.An();else if(n>0&&s<0)r.push(i),r.push(i.An());else if(s>0)break}r.push(t);let i=[];for(let e=0;e<r.length;e+=2){if(this.Zn(r[e],r[e+1]))return[];let t=r[e].Vn(this.uid,iX,H.empty()),n=r[e+1].Vn(this.uid,iX,H.empty());i.push(IDBKeyRange.bound(t,n))}return i}Zn(e,t){return iF(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(iZ)}getMinOffset(e,t){return ey.mapArray(this.Mn(t),t=>this.xn(e,t).next(e=>e||S(44426))).next(iZ)}}function iZ(e){N(0!==e.length,28825);let t=e[0].indexState.offset,n=t.largestBatchId;for(let r=1;r<e.length;r++){let i=e[r].indexState.offset;0>ef(i,t)&&(t=i),n<i.largestBatchId&&(n=i.largestBatchId)}return new ed(t.readTime,t.documentKey,n)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let i0={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0};class i1{static withCacheSize(e){return new i1(e,i1.DEFAULT_COLLECTION_PERCENTILE,i1.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,n){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function i2(e,t,n){let r=e.store(eq),i=e.store(e$),s=[],a=IDBKeyRange.only(n.batchId),o=0,l=r.ee({range:a},(e,t,n)=>(o++,n.delete()));s.push(l.next(()=>{N(1===o,47070,{batchId:n.batchId})}));let u=[];for(let e of n.mutations){var h,c;let r=(h=e.key.path,c=n.batchId,[t,eM(h),c]);s.push(i.delete(r)),u.push(e.key)}return ey.waitFor(s).next(()=>u)}function i5(e){let t;if(!e)return 0;if(e.document)t=e.document;else if(e.unknownDocument)t=e.unknownDocument;else{if(!e.noDocument)throw S(14731);t=e.noDocument}return JSON.stringify(t).length}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */i1.DEFAULT_COLLECTION_PERCENTILE=10,i1.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,i1.DEFAULT=new i1(41943040,i1.DEFAULT_COLLECTION_PERCENTILE,i1.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),i1.DISABLED=new i1(-1,0,0);class i4{constructor(e,t,n,r){this.userId=e,this.serializer=t,this.indexManager=n,this.referenceDelegate=r,this.Xn={}}static wt(e,t,n,r){return N(""!==e.uid,64387),new i4(e.isAuthenticated()?e.uid:"",t,n,r)}checkEmpty(e){let t=!0,n=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return i3(e).ee({index:ez,range:n},(e,n,r)=>{t=!1,r.done()}).next(()=>t)}addMutationBatch(e,t,n,r){let i=tN(e,e$),s=i3(e);return s.add({}).next(a=>{N("number"==typeof a,49019);let o=new rk(a,t,n,r),l=function(e,t,n){let r=n.baseMutations.map(t=>is(e.yt,t)),i=n.mutations.map(t=>is(e.yt,t));return{userId:t,batchId:n.batchId,localWriteTimeMs:n.localWriteTime.toMillis(),baseMutations:r,mutations:i}}(this.serializer,this.userId,o),u=[],h=new tM((e,t)=>q(e.canonicalString(),t.canonicalString()));for(let e of r){let t=[this.userId,eM(e.key.path),a];h=h.add(e.key.path.popLast()),u.push(s.put(l)),u.push(i.put(t,eG))}return h.forEach(t=>{u.push(this.indexManager.addToCollectionParentIndex(e,t))}),e.addOnCommittedListener(()=>{this.Xn[a]=o.keys()}),ey.waitFor(u).next(()=>o)})}lookupMutationBatch(e,t){return i3(e).get(t).next(e=>e?(N(e.userId===this.userId,48,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),iI(this.serializer,e)):null)}er(e,t){return this.Xn[t]?ey.resolve(this.Xn[t]):this.lookupMutationBatch(e,t).next(e=>{if(e){let n=e.keys();return this.Xn[t]=n,n}return null})}getNextMutationBatchAfterBatchId(e,t){let n=t+1,r=IDBKeyRange.lowerBound([this.userId,n]),i=null;return i3(e).ee({index:ez,range:r},(e,t,r)=>{t.userId===this.userId&&(N(t.batchId>=n,47524,{tr:n}),i=iI(this.serializer,t)),r.done()}).next(()=>i)}getHighestUnacknowledgedBatchId(e){let t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]),n=-1;return i3(e).ee({index:ez,range:t,reverse:!0},(e,t,r)=>{n=t.batchId,r.done()}).next(()=>n)}getAllMutationBatches(e){let t=IDBKeyRange.bound([this.userId,-1],[this.userId,Number.POSITIVE_INFINITY]);return i3(e).J(ez,t).next(e=>e.map(e=>iI(this.serializer,e)))}getAllMutationBatchesAffectingDocumentKey(e,t){let n=[this.userId,eM(t.path)],r=IDBKeyRange.lowerBound(n),i=[];return tN(e,e$).ee({range:r},(n,r,s)=>{let[a,o,l]=n,u=eO(o);if(a===this.userId&&t.path.isEqual(u))return i3(e).get(l).next(e=>{if(!e)throw S(61480,{nr:n,batchId:l});N(e.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:e.userId,batchId:l}),i.push(iI(this.serializer,e))});s.done()}).next(()=>i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new tM(q),r=[];return t.forEach(t=>{let i=[this.userId,eM(t.path)],s=IDBKeyRange.lowerBound(i),a=tN(e,e$).ee({range:s},(e,r,i)=>{let[s,a,o]=e,l=eO(a);s===this.userId&&t.path.isEqual(l)?n=n.add(o):i.done()});r.push(a)}),ey.waitFor(r).next(()=>this.rr(e,n))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=[this.userId,eM(n)],s=IDBKeyRange.lowerBound(i),a=new tM(q);return tN(e,e$).ee({range:s},(e,t,i)=>{let[s,o,l]=e,u=eO(o);s===this.userId&&n.isPrefixOf(u)?u.length===r&&(a=a.add(l)):i.done()}).next(()=>this.rr(e,a))}rr(e,t){let n=[],r=[];return t.forEach(t=>{r.push(i3(e).get(t).next(e=>{if(null===e)throw S(35274,{batchId:t});N(e.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:e.userId,batchId:t}),n.push(iI(this.serializer,e))}))}),ey.waitFor(r).next(()=>n)}removeMutationBatch(e,t){return i2(e.le,this.userId,t).next(n=>(e.addOnCommittedListener(()=>{this.ir(t.batchId)}),ey.forEach(n,t=>this.referenceDelegate.markPotentiallyOrphaned(e,t))))}ir(e){delete this.Xn[e]}performConsistencyCheck(e){return this.checkEmpty(e).next(t=>{if(!t)return ey.resolve();let n=IDBKeyRange.lowerBound([this.userId]),r=[];return tN(e,e$).ee({range:n},(e,t,n)=>{if(e[0]===this.userId){let t=eO(e[1]);r.push(t)}else n.done()}).next(()=>{N(0===r.length,56720,{sr:r.map(e=>e.canonicalString())})})})}containsKey(e,t){return i6(e,this.userId,t)}_r(e){return tN(e,eU).get(this.userId).next(e=>e||{userId:this.userId,lastAcknowledgedBatchId:-1,lastStreamToken:""})}}function i6(e,t,n){let r=[t,eM(n.path)],i=r[1],s=IDBKeyRange.lowerBound(r),a=!1;return tN(e,e$).ee({range:s,X:!0},(e,n,r)=>{let[s,o,l]=e;s===t&&o===i&&(a=!0),r.done()}).next(()=>a)}function i3(e){return tN(e,eq)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i8{constructor(e){this.ar=e}next(){return this.ar+=2,this.ar}static ur(){return new i8(0)}static cr(){return new i8(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class i9{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.lr(e).next(t=>{let n=new i8(t.highestTargetId);return t.highestTargetId=n.next(),this.hr(e,t).next(()=>t.highestTargetId)})}getLastRemoteSnapshotVersion(e){return this.lr(e).next(e=>es.fromTimestamp(new ei(e.lastRemoteSnapshotVersion.seconds,e.lastRemoteSnapshotVersion.nanoseconds)))}getHighestSequenceNumber(e){return this.lr(e).next(e=>e.highestListenSequenceNumber)}setTargetsMetadata(e,t,n){return this.lr(e).next(r=>(r.highestListenSequenceNumber=t,n&&(r.lastRemoteSnapshotVersion=n.toTimestamp()),t>r.highestListenSequenceNumber&&(r.highestListenSequenceNumber=t),this.hr(e,r)))}addTargetData(e,t){return this.Pr(e,t).next(()=>this.lr(e).next(n=>(n.targetCount+=1,this.Tr(t,n),this.hr(e,n))))}updateTargetData(e,t){return this.Pr(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next(()=>tN(e,e0).delete(t.targetId)).next(()=>this.lr(e)).next(t=>(N(t.targetCount>0,8065),t.targetCount-=1,this.hr(e,t)))}removeTargets(e,t,n){let r=0,i=[];return tN(e,e0).ee((s,a)=>{let o=iT(a);o.sequenceNumber<=t&&null===n.get(o.targetId)&&(r++,i.push(this.removeTargetData(e,o)))}).next(()=>ey.waitFor(i)).next(()=>r)}forEachTarget(e,t){return tN(e,e0).ee((e,n)=>{t(iT(n))})}lr(e){return tN(e,e9).get(e8).next(e=>(N(null!==e,2888),e))}hr(e,t){return tN(e,e9).put(e8,t)}Pr(e,t){return tN(e,e0).put(iE(this.serializer,t))}Tr(e,t){let n=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,n=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,n=!0),n}getTargetCount(e){return this.lr(e).next(e=>e.targetCount)}getTargetData(e,t){let n=nU(t),r=IDBKeyRange.bound([n,Number.NEGATIVE_INFINITY],[n,Number.POSITIVE_INFINITY]),i=null;return tN(e,e0).ee({range:r,index:e1},(e,n,r)=>{let s=iT(n);nq(t,s.target)&&(i=s,r.done())}).next(()=>i)}addMatchingKeys(e,t,n){let r=[],i=i7(e);return t.forEach(t=>{let s=eM(t.path);r.push(i.put({targetId:n,path:s})),r.push(this.referenceDelegate.addReference(e,n,t))}),ey.waitFor(r)}removeMatchingKeys(e,t,n){let r=i7(e);return ey.forEach(t,t=>{let i=eM(t.path);return ey.waitFor([r.delete([n,i]),this.referenceDelegate.removeReference(e,n,t)])})}removeMatchingKeysForTargetId(e,t){let n=i7(e),r=IDBKeyRange.bound([t],[t+1],!1,!0);return n.delete(r)}getMatchingKeysForTargetId(e,t){let n=IDBKeyRange.bound([t],[t+1],!1,!0),r=i7(e),i=rn();return r.ee({range:n,X:!0},(e,t,n)=>{let r=new H(eO(e[1]));i=i.add(r)}).next(()=>i)}containsKey(e,t){let n=eM(t.path),r=IDBKeyRange.bound([n],[n+"\0"],!1,!0),i=0;return i7(e).ee({index:e6,X:!0,range:r},([e,t],n,r)=>{0!==e&&(i++,r.done())}).next(()=>i>0)}At(e,t){return tN(e,e0).get(t).next(e=>e?iT(e):null)}}function i7(e){return tN(e,e5)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let se="LruGarbageCollector";function st([e,t],[n,r]){let i=q(e,n);return 0===i?q(t,r):i}class sn{constructor(e){this.Ir=e,this.buffer=new tM(st),this.Er=0}dr(){return++this.Er}Ar(e){let t=[e,this.dr()];if(this.buffer.size<this.Ir)this.buffer=this.buffer.add(t);else{let e=this.buffer.last();0>st(t,e)&&(this.buffer=this.buffer.delete(e).add(t))}}get maxValue(){return this.buffer.last()[0]}}class sr{constructor(e,t,n){this.garbageCollector=e,this.asyncQueue=t,this.localStore=n,this.Rr=null}start(){-1!==this.garbageCollector.params.cacheSizeCollectionThreshold&&this.Vr(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return null!==this.Rr}Vr(e){T(se,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){eb(e)?T(se,"Ignoring IndexedDB error during garbage collection: ",e):await ep(e)}await this.Vr(3e5)})}}class si{constructor(e,t){this.mr=e,this.params=t}calculateTargetCount(e,t){return this.mr.gr(e).next(e=>Math.floor(t/100*e))}nthSequenceNumber(e,t){if(0===t)return ey.resolve(eR.ce);let n=new sn(t);return this.mr.forEachTarget(e,e=>n.Ar(e.sequenceNumber)).next(()=>this.mr.pr(e,e=>n.Ar(e))).next(()=>n.maxValue)}removeTargets(e,t,n){return this.mr.removeTargets(e,t,n)}removeOrphanedDocuments(e,t){return this.mr.removeOrphanedDocuments(e,t)}collect(e,t){return -1===this.params.cacheSizeCollectionThreshold?(T("LruGarbageCollector","Garbage collection skipped; disabled"),ey.resolve(i0)):this.getCacheSize(e).next(n=>n<this.params.cacheSizeCollectionThreshold?(T("LruGarbageCollector",`Garbage collection skipped; Cache size ${n} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),i0):this.yr(e,t))}getCacheSize(e){return this.mr.getCacheSize(e)}yr(e,t){let n,r,i,s,a,o,l;let h=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(t=>(t>this.params.maximumSequenceNumbersToCollect?(T("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${t}`),r=this.params.maximumSequenceNumbersToCollect):r=t,s=Date.now(),this.nthSequenceNumber(e,r))).next(r=>(n=r,a=Date.now(),this.removeTargets(e,n,t))).next(t=>(i=t,o=Date.now(),this.removeOrphanedDocuments(e,n))).next(e=>(l=Date.now(),I()<=u.in.DEBUG&&T("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${s-h}ms
	Determined least recently used ${r} in `+(a-s)+"ms\n"+`	Removed ${i} targets in `+(o-a)+"ms\n"+`	Removed ${e} documents in `+(l-o)+"ms\n"+`Total Duration: ${l-h}ms`),ey.resolve({didRun:!0,sequenceNumbersCollected:r,targetsRemoved:i,documentsRemoved:e})))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ss{constructor(e,t){this.db=e,this.garbageCollector=new si(this,t)}gr(e){let t=this.wr(e);return this.db.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}wr(e){let t=0;return this.pr(e,e=>{t++}).next(()=>t)}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}pr(e,t){return this.Sr(e,(e,n)=>t(n))}addReference(e,t,n){return sa(e,n)}removeReference(e,t,n){return sa(e,n)}removeTargets(e,t,n){return this.db.getTargetCache().removeTargets(e,t,n)}markPotentiallyOrphaned(e,t){return sa(e,t)}br(e,t){let n;return n=!1,tN(e,eU).te(r=>i6(e,r,t).next(e=>(e&&(n=!0),ey.resolve(!e)))).next(()=>n)}removeOrphanedDocuments(e,t){let n=this.db.getRemoteDocumentCache().newChangeBuffer(),r=[],i=0;return this.Sr(e,(s,a)=>{if(a<=t){let t=this.br(e,s).next(t=>{if(!t)return i++,n.getEntry(e,s).next(()=>(n.removeEntry(s,es.min()),i7(e).delete([0,eM(s.path)])))});r.push(t)}}).next(()=>ey.waitFor(r)).next(()=>n.apply(e)).next(()=>i)}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,n)}updateLimboDocument(e,t){return sa(e,t)}Sr(e,t){let n=i7(e),r,i=eR.ce;return n.ee({index:e6},([e,n],{path:s,sequenceNumber:a})=>{0===e?(i!==eR.ce&&t(new H(eO(r)),i),i=a,r=s):i=eR.ce}).next(()=>{i!==eR.ce&&t(new H(eO(r)),i)})}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function sa(e,t){var n;return i7(e).put((n=e.currentSequenceNumber,{targetId:0,path:eM(t.path),sequenceNumber:n}))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class so{constructor(){this.changes=new n4(e=>e.toString(),(e,t)=>e.isEqual(t)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,np.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();let n=this.changes.get(t);return void 0!==n?ey.resolve(n):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sl{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,n){return tN(e,ej).put(n)}removeEntry(e,t,n){return tN(e,ej).delete(function(e,t){let n=e.path.toArray();return[n.slice(0,n.length-2),n[n.length-2],iy(t),n[n.length-1]]}(t,n))}updateMetadata(e,t){return this.getMetadata(e).next(n=>(n.byteSize+=t,this.Dr(e,n)))}getEntry(e,t){let n=np.newInvalidDocument(t);return tN(e,ej).ee({index:eW,range:IDBKeyRange.only(sh(t))},(e,r)=>{n=this.Cr(t,r)}).next(()=>n)}vr(e,t){let n={size:0,document:np.newInvalidDocument(t)};return tN(e,ej).ee({index:eW,range:IDBKeyRange.only(sh(t))},(e,r)=>{n={document:this.Cr(t,r),size:i5(r)}}).next(()=>n)}getEntries(e,t){let n=n6;return this.Fr(e,t,(e,t)=>{let r=this.Cr(e,t);n=n.insert(e,r)}).next(()=>n)}Mr(e,t){let n=n6,r=new tk(H.comparator);return this.Fr(e,t,(e,t)=>{let i=this.Cr(e,t);n=n.insert(e,i),r=r.insert(e,i5(t))}).next(()=>({documents:n,Or:r}))}Fr(e,t,n){if(t.isEmpty())return ey.resolve();let r=new tM(sd);t.forEach(e=>r=r.add(e));let i=IDBKeyRange.bound(sh(r.first()),sh(r.last())),s=r.getIterator(),a=s.getNext();return tN(e,ej).ee({index:eW,range:i},(e,t,r)=>{let i=H.fromSegments([...t.prefixPath,t.collectionGroup,t.documentId]);for(;a&&0>sd(a,i);)n(a,null),a=s.getNext();a&&a.isEqual(i)&&(n(a,t),a=s.hasNext()?s.getNext():null),a?r.j(sh(a)):r.done()}).next(()=>{for(;a;)n(a,null),a=s.hasNext()?s.getNext():null})}getDocumentsMatchingQuery(e,t,n,r,i){let s=t.path,a=[s.popLast().toArray(),s.lastSegment(),iy(n.readTime),n.documentKey.path.isEmpty()?"":n.documentKey.path.lastSegment()],o=[s.popLast().toArray(),s.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return tN(e,ej).J(IDBKeyRange.bound(a,o,!0)).next(e=>{i?.incrementDocumentReadCount(e.length);let n=n6;for(let i of e){let e=this.Cr(H.fromSegments(i.prefixPath.concat(i.collectionGroup,i.documentId)),i);e.isFoundDocument()&&(n2(t,e)||r.has(e.key))&&(n=n.insert(e.key,e))}return n})}getAllFromCollectionGroup(e,t,n,r){let i=n6,s=sc(t,n),a=sc(t,ed.max());return tN(e,ej).ee({index:eY,range:IDBKeyRange.bound(s,a,!0)},(e,t,n)=>{let s=this.Cr(H.fromSegments(t.prefixPath.concat(t.collectionGroup,t.documentId)),t);(i=i.insert(s.key,s)).size===r&&n.done()}).next(()=>i)}newChangeBuffer(e){return new su(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next(e=>e.byteSize)}getMetadata(e){return tN(e,eJ).get(eZ).next(e=>(N(!!e,20021),e))}Dr(e,t){return tN(e,eJ).put(eZ,t)}Cr(e,t){if(t){let e=function(e,t){let n;if(t.document)n=function(e,t,n){let r=r9(e,t.name),i=r5(t.updateTime),s=t.createTime?r5(t.createTime):es.min(),a=new ng({mapValue:{fields:t.fields}}),o=np.newFoundDocument(r,i,s,a);return n&&o.setHasCommittedMutations(),n?o.setHasCommittedMutations():o}(e.yt,t.document,!!t.hasCommittedMutations);else if(t.noDocument){let e=H.fromSegments(t.noDocument.path),r=iv(t.noDocument.readTime);n=np.newNoDocument(e,r),t.hasCommittedMutations&&n.setHasCommittedMutations()}else{if(!t.unknownDocument)return S(56709);{let e=H.fromSegments(t.unknownDocument.path),r=iv(t.unknownDocument.version);n=np.newUnknownDocument(e,r)}}return t.readTime&&n.setReadTime(function(e){let t=new ei(e[0],e[1]);return es.fromTimestamp(t)}(t.readTime)),n}(this.serializer,t);if(!(e.isNoDocument()&&e.version.isEqual(es.min())))return e}return np.newInvalidDocument(e)}}class su extends so{constructor(e,t){super(),this.Nr=e,this.trackRemovals=t,this.Br=new n4(e=>e.toString(),(e,t)=>e.isEqual(t))}applyChanges(e){let t=[],n=0,r=new tM((e,t)=>q(e.canonicalString(),t.canonicalString()));return this.changes.forEach((i,s)=>{let a=this.Br.get(i);if(t.push(this.Nr.removeEntry(e,i,a.readTime)),s.isValidDocument()){let o=ip(this.Nr.serializer,s);r=r.add(i.path.popLast());let l=i5(o);n+=l-a.size,t.push(this.Nr.addEntry(e,i,o))}else if(n-=a.size,this.trackRemovals){let n=ip(this.Nr.serializer,s.convertToNoDocument(es.min()));t.push(this.Nr.addEntry(e,i,n))}}),r.forEach(n=>{t.push(this.Nr.indexManager.addToCollectionParentIndex(e,n))}),t.push(this.Nr.updateMetadata(e,n)),ey.waitFor(t)}getFromCache(e,t){return this.Nr.vr(e,t).next(e=>(this.Br.set(t,{size:e.size,readTime:e.document.readTime}),e.document))}getAllFromCache(e,t){return this.Nr.Mr(e,t).next(({documents:e,Or:t})=>(t.forEach((t,n)=>{this.Br.set(t,{size:n,readTime:e.get(t).readTime})}),e))}}function sh(e){let t=e.path.toArray();return[t.slice(0,t.length-2),t[t.length-2],t[t.length-1]]}function sc(e,t){let n=t.documentKey.path.toArray();return[e,iy(t.readTime),n.slice(0,n.length-2),n.length>0?n[n.length-1]:""]}function sd(e,t){let n=e.path.toArray(),r=t.path.toArray(),i=0;for(let e=0;e<n.length-2&&e<r.length-2;++e)if(i=q(n[e],r[e]))return i;return(i=q(n.length,r.length))||(i=q(n[n.length-2],r[r.length-2]))||q(n[n.length-1],r[r.length-1])}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sf{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(e,t,n,r){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=n,this.indexManager=r}getDocument(e,t){let n=null;return this.documentOverlayCache.getOverlay(e,t).next(r=>(n=r,this.remoteDocumentCache.getEntry(e,t))).next(e=>(null!==n&&rE(n.mutation,e,tF.empty(),ei.now()),e))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.getLocalViewOfDocuments(e,t,rn()).next(()=>t))}getLocalViewOfDocuments(e,t,n=rn()){let r=n7();return this.populateOverlays(e,r,t).next(()=>this.computeViews(e,t,r,n).next(e=>{let t=n8();return e.forEach((e,n)=>{t=t.insert(e,n.overlayedDocument)}),t}))}getOverlayedDocuments(e,t){let n=n7();return this.populateOverlays(e,n,t).next(()=>this.computeViews(e,t,n,rn()))}populateOverlays(e,t,n){let r=[];return n.forEach(e=>{t.has(e)||r.push(e)}),this.documentOverlayCache.getOverlays(e,r).next(e=>{e.forEach((e,n)=>{t.set(e,n)})})}computeViews(e,t,n,r){let i=n6,s=n7(),a=n7();return t.forEach((e,t)=>{let a=n.get(t.key);r.has(t.key)&&(void 0===a||a.mutation instanceof rS)?i=i.insert(t.key,t):void 0!==a?(s.set(t.key,a.mutation.getFieldMask()),rE(a.mutation,t,a.mutation.getFieldMask(),ei.now())):s.set(t.key,tF.empty())}),this.recalculateAndSaveOverlays(e,i).next(e=>(e.forEach((e,t)=>s.set(e,t)),t.forEach((e,t)=>a.set(e,new sf(t,s.get(e)??null))),a))}recalculateAndSaveOverlays(e,t){let n=n7(),r=new tk((e,t)=>e-t),i=rn();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next(e=>{for(let i of e)i.keys().forEach(e=>{let s=t.get(e);if(null===s)return;let a=n.get(e)||tF.empty();a=i.applyToLocalView(s,a),n.set(e,a);let o=(r.get(i.batchId)||rn()).add(e);r=r.insert(i.batchId,o)})}).next(()=>{let s=[],a=r.getReverseIterator();for(;a.hasNext();){let r=a.getNext(),o=r.key,l=r.value,u=n7();l.forEach(e=>{if(!i.has(e)){let r=rT(t.get(e),n.get(e));null!==r&&u.set(e,r),i=i.add(e)}}),s.push(this.documentOverlayCache.saveOverlays(e,o,u))}return ey.waitFor(s)}).next(()=>n)}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next(t=>this.recalculateAndSaveOverlays(e,t))}getDocumentsMatchingQuery(e,t,n,r){return H.isDocumentKey(t.path)&&null===t.collectionGroup&&0===t.filters.length?this.getDocumentsMatchingDocumentQuery(e,t.path):nW(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,n,r):this.getDocumentsMatchingCollectionQuery(e,t,n,r)}getNextDocuments(e,t,n,r){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,n,r).next(i=>{let s=r-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,n.largestBatchId,r-i.size):ey.resolve(n7()),a=-1,o=i;return s.next(t=>ey.forEach(t,(t,n)=>(a<n.largestBatchId&&(a=n.largestBatchId),i.get(t)?ey.resolve():this.remoteDocumentCache.getEntry(e,t).next(e=>{o=o.insert(t,e)}))).next(()=>this.populateOverlays(e,t,i)).next(()=>this.computeViews(e,o,t,rn())).next(e=>({batchId:a,changes:n9(e)})))})}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new H(t)).next(e=>{let t=n8();return e.isFoundDocument()&&(t=t.insert(e.key,e)),t})}getDocumentsMatchingCollectionGroupQuery(e,t,n,r){let i=t.collectionGroup,s=n8();return this.indexManager.getCollectionParents(e,i).next(a=>ey.forEach(a,a=>{let o=new n$(a.child(i),null,t.explicitOrderBy.slice(),t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt);return this.getDocumentsMatchingCollectionQuery(e,o,n,r).next(e=>{e.forEach((e,t)=>{s=s.insert(e,t)})})}).next(()=>s))}getDocumentsMatchingCollectionQuery(e,t,n,r){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,n.largestBatchId).next(s=>(i=s,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,n,i,r))).next(e=>{i.forEach((t,n)=>{let r=n.getKey();null===e.get(r)&&(e=e.insert(r,np.newInvalidDocument(r)))});let n=n8();return e.forEach((e,r)=>{let s=i.get(e);void 0!==s&&rE(s.mutation,r,tF.empty(),ei.now()),n2(t,r)&&(n=n.insert(e,r))}),n})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sg{constructor(e){this.serializer=e,this.Lr=new Map,this.kr=new Map}getBundleMetadata(e,t){return ey.resolve(this.Lr.get(t))}saveBundleMetadata(e,t){return this.Lr.set(t.id,{id:t.id,version:t.version,createTime:r5(t.createTime)}),ey.resolve()}getNamedQuery(e,t){return ey.resolve(this.kr.get(t))}saveNamedQuery(e,t){return this.kr.set(t.name,{name:t.name,query:i_(t.bundledQuery),readTime:r5(t.readTime)}),ey.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sp{constructor(){this.overlays=new tk(H.comparator),this.qr=new Map}getOverlay(e,t){return ey.resolve(this.overlays.get(t))}getOverlays(e,t){let n=n7();return ey.forEach(t,t=>this.getOverlay(e,t).next(e=>{null!==e&&n.set(t,e)})).next(()=>n)}saveOverlays(e,t,n){return n.forEach((n,r)=>{this.St(e,t,r)}),ey.resolve()}removeOverlaysForBatchId(e,t,n){let r=this.qr.get(n);return void 0!==r&&(r.forEach(e=>this.overlays=this.overlays.remove(e)),this.qr.delete(n)),ey.resolve()}getOverlaysForCollection(e,t,n){let r=n7(),i=t.length+1,s=new H(t.child("")),a=this.overlays.getIteratorFrom(s);for(;a.hasNext();){let e=a.getNext().value,s=e.getKey();if(!t.isPrefixOf(s.path))break;s.path.length===i&&e.largestBatchId>n&&r.set(e.getKey(),e)}return ey.resolve(r)}getOverlaysForCollectionGroup(e,t,n,r){let i=new tk((e,t)=>e-t),s=this.overlays.getIterator();for(;s.hasNext();){let e=s.getNext().value;if(e.getKey().getCollectionGroup()===t&&e.largestBatchId>n){let t=i.get(e.largestBatchId);null===t&&(t=n7(),i=i.insert(e.largestBatchId,t)),t.set(e.getKey(),e)}}let a=n7(),o=i.getIterator();for(;o.hasNext()&&(o.getNext().value.forEach((e,t)=>a.set(e,t)),!(a.size()>=r)););return ey.resolve(a)}St(e,t,n){let r=this.overlays.get(n.key);if(null!==r){let e=this.qr.get(r.largestBatchId).delete(n.key);this.qr.set(r.largestBatchId,e)}this.overlays=this.overlays.insert(n.key,new rV(t,n));let i=this.qr.get(t);void 0===i&&(i=rn(),this.qr.set(t,i)),this.qr.set(t,i.add(n.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sy{constructor(){this.sessionToken=tU.EMPTY_BYTE_STRING}getSessionToken(e){return ey.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,ey.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sw{constructor(){this.Qr=new tM(sv.$r),this.Ur=new tM(sv.Kr)}isEmpty(){return this.Qr.isEmpty()}addReference(e,t){let n=new sv(e,t);this.Qr=this.Qr.add(n),this.Ur=this.Ur.add(n)}Wr(e,t){e.forEach(e=>this.addReference(e,t))}removeReference(e,t){this.Gr(new sv(e,t))}zr(e,t){e.forEach(e=>this.removeReference(e,t))}jr(e){let t=new H(new j([])),n=new sv(t,e),r=new sv(t,e+1),i=[];return this.Ur.forEachInRange([n,r],e=>{this.Gr(e),i.push(e.key)}),i}Jr(){this.Qr.forEach(e=>this.Gr(e))}Gr(e){this.Qr=this.Qr.delete(e),this.Ur=this.Ur.delete(e)}Hr(e){let t=new H(new j([])),n=new sv(t,e),r=new sv(t,e+1),i=rn();return this.Ur.forEachInRange([n,r],e=>{i=i.add(e.key)}),i}containsKey(e){let t=new sv(e,0),n=this.Qr.firstAfterOrEqual(t);return null!==n&&e.isEqual(n.key)}}class sv{constructor(e,t){this.key=e,this.Yr=t}static $r(e,t){return H.comparator(e.key,t.key)||q(e.Yr,t.Yr)}static Kr(e,t){return q(e.Yr,t.Yr)||H.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sI{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.tr=1,this.Zr=new tM(sv.$r)}checkEmpty(e){return ey.resolve(0===this.mutationQueue.length)}addMutationBatch(e,t,n,r){let i=this.tr;this.tr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];let s=new rk(i,t,n,r);for(let t of(this.mutationQueue.push(s),r))this.Zr=this.Zr.add(new sv(t.key,i)),this.indexManager.addToCollectionParentIndex(e,t.key.path.popLast());return ey.resolve(s)}lookupMutationBatch(e,t){return ey.resolve(this.Xr(t))}getNextMutationBatchAfterBatchId(e,t){let n=this.ei(t+1),r=n<0?0:n;return ey.resolve(this.mutationQueue.length>r?this.mutationQueue[r]:null)}getHighestUnacknowledgedBatchId(){return ey.resolve(0===this.mutationQueue.length?-1:this.tr-1)}getAllMutationBatches(e){return ey.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){let n=new sv(t,0),r=new sv(t,Number.POSITIVE_INFINITY),i=[];return this.Zr.forEachInRange([n,r],e=>{let t=this.Xr(e.Yr);i.push(t)}),ey.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let n=new tM(q);return t.forEach(e=>{let t=new sv(e,0),r=new sv(e,Number.POSITIVE_INFINITY);this.Zr.forEachInRange([t,r],e=>{n=n.add(e.Yr)})}),ey.resolve(this.ti(n))}getAllMutationBatchesAffectingQuery(e,t){let n=t.path,r=n.length+1,i=n;H.isDocumentKey(i)||(i=i.child(""));let s=new sv(new H(i),0),a=new tM(q);return this.Zr.forEachWhile(e=>{let t=e.key.path;return!!n.isPrefixOf(t)&&(t.length===r&&(a=a.add(e.Yr)),!0)},s),ey.resolve(this.ti(a))}ti(e){let t=[];return e.forEach(e=>{let n=this.Xr(e);null!==n&&t.push(n)}),t}removeMutationBatch(e,t){N(0===this.ni(t.batchId,"removed"),55003),this.mutationQueue.shift();let n=this.Zr;return ey.forEach(t.mutations,r=>{let i=new sv(r.key,t.batchId);return n=n.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,r.key)}).next(()=>{this.Zr=n})}ir(e){}containsKey(e,t){let n=new sv(t,0),r=this.Zr.firstAfterOrEqual(n);return ey.resolve(t.isEqual(r&&r.key))}performConsistencyCheck(e){return this.mutationQueue.length,ey.resolve()}ni(e,t){return this.ei(e)}ei(e){return 0===this.mutationQueue.length?0:e-this.mutationQueue[0].batchId}Xr(e){let t=this.ei(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sT{constructor(e){this.ri=e,this.docs=new tk(H.comparator),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){let n=t.key,r=this.docs.get(n),i=r?r.size:0,s=this.ri(t);return this.docs=this.docs.insert(n,{document:t.mutableCopy(),size:s}),this.size+=s-i,this.indexManager.addToCollectionParentIndex(e,n.path.popLast())}removeEntry(e){let t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){let n=this.docs.get(t);return ey.resolve(n?n.document.mutableCopy():np.newInvalidDocument(t))}getEntries(e,t){let n=n6;return t.forEach(e=>{let t=this.docs.get(e);n=n.insert(e,t?t.document.mutableCopy():np.newInvalidDocument(e))}),ey.resolve(n)}getDocumentsMatchingQuery(e,t,n,r){let i=n6,s=t.path,a=new H(s.child("__id-9223372036854775808__")),o=this.docs.getIteratorFrom(a);for(;o.hasNext();){let{key:e,value:{document:a}}=o.getNext();if(!s.isPrefixOf(e.path))break;e.path.length>s.length+1||0>=ef(ec(a),n)||(r.has(a.key)||n2(t,a))&&(i=i.insert(a.key,a.mutableCopy()))}return ey.resolve(i)}getAllFromCollectionGroup(e,t,n,r){S(9500)}ii(e,t){return ey.forEach(this.docs,e=>t(e))}newChangeBuffer(e){return new sE(this)}getSize(e){return ey.resolve(this.size)}}class sE extends so{constructor(e){super(),this.Nr=e}applyChanges(e){let t=[];return this.changes.forEach((n,r)=>{r.isValidDocument()?t.push(this.Nr.addEntry(e,r)):this.Nr.removeEntry(n)}),ey.waitFor(t)}getFromCache(e,t){return this.Nr.getEntry(e,t)}getAllFromCache(e,t){return this.Nr.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s_{constructor(e){this.persistence=e,this.si=new n4(e=>nU(e),nq),this.lastRemoteSnapshotVersion=es.min(),this.highestTargetId=0,this.oi=0,this._i=new sw,this.targetCount=0,this.ai=i8.ur()}forEachTarget(e,t){return this.si.forEach((e,n)=>t(n)),ey.resolve()}getLastRemoteSnapshotVersion(e){return ey.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return ey.resolve(this.oi)}allocateTargetId(e){return this.highestTargetId=this.ai.next(),ey.resolve(this.highestTargetId)}setTargetsMetadata(e,t,n){return n&&(this.lastRemoteSnapshotVersion=n),t>this.oi&&(this.oi=t),ey.resolve()}Pr(e){this.si.set(e.target,e);let t=e.targetId;t>this.highestTargetId&&(this.ai=new i8(t),this.highestTargetId=t),e.sequenceNumber>this.oi&&(this.oi=e.sequenceNumber)}addTargetData(e,t){return this.Pr(t),this.targetCount+=1,ey.resolve()}updateTargetData(e,t){return this.Pr(t),ey.resolve()}removeTargetData(e,t){return this.si.delete(t.target),this._i.jr(t.targetId),this.targetCount-=1,ey.resolve()}removeTargets(e,t,n){let r=0,i=[];return this.si.forEach((s,a)=>{a.sequenceNumber<=t&&null===n.get(a.targetId)&&(this.si.delete(s),i.push(this.removeMatchingKeysForTargetId(e,a.targetId)),r++)}),ey.waitFor(i).next(()=>r)}getTargetCount(e){return ey.resolve(this.targetCount)}getTargetData(e,t){let n=this.si.get(t)||null;return ey.resolve(n)}addMatchingKeys(e,t,n){return this._i.Wr(t,n),ey.resolve()}removeMatchingKeys(e,t,n){this._i.zr(t,n);let r=this.persistence.referenceDelegate,i=[];return r&&t.forEach(t=>{i.push(r.markPotentiallyOrphaned(e,t))}),ey.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this._i.jr(t),ey.resolve()}getMatchingKeysForTargetId(e,t){let n=this._i.Hr(t);return ey.resolve(n)}containsKey(e,t){return ey.resolve(this._i.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sb{constructor(e,t){this.ui={},this.overlays={},this.ci=new eR(0),this.li=!1,this.li=!0,this.hi=new sy,this.referenceDelegate=e(this),this.Pi=new s_(this),this.indexManager=new iW,this.remoteDocumentCache=new sT(e=>this.referenceDelegate.Ti(e)),this.serializer=new ig(t),this.Ii=new sg(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.li=!1,Promise.resolve()}get started(){return this.li}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new sp,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let n=this.ui[e.toKey()];return n||(n=new sI(t,this.referenceDelegate),this.ui[e.toKey()]=n),n}getGlobalsCache(){return this.hi}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Ii}runTransaction(e,t,n){T("MemoryPersistence","Starting transaction:",e);let r=new sS(this.ci.next());return this.referenceDelegate.Ei(),n(r).next(e=>this.referenceDelegate.di(r).next(()=>e)).toPromise().then(e=>(r.raiseOnCommittedEvent(),e))}Ai(e,t){return ey.or(Object.values(this.ui).map(n=>()=>n.containsKey(e,t)))}}class sS extends eg{constructor(e){super(),this.currentSequenceNumber=e}}class sx{constructor(e){this.persistence=e,this.Ri=new sw,this.Vi=null}static mi(e){return new sx(e)}get fi(){if(this.Vi)return this.Vi;throw S(60996)}addReference(e,t,n){return this.Ri.addReference(n,t),this.fi.delete(n.toString()),ey.resolve()}removeReference(e,t,n){return this.Ri.removeReference(n,t),this.fi.add(n.toString()),ey.resolve()}markPotentiallyOrphaned(e,t){return this.fi.add(t.toString()),ey.resolve()}removeTarget(e,t){this.Ri.jr(t.targetId).forEach(e=>this.fi.add(e.toString()));let n=this.persistence.getTargetCache();return n.getMatchingKeysForTargetId(e,t.targetId).next(e=>{e.forEach(e=>this.fi.add(e.toString()))}).next(()=>n.removeTargetData(e,t))}Ei(){this.Vi=new Set}di(e){let t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return ey.forEach(this.fi,n=>{let r=H.fromPath(n);return this.gi(e,r).next(e=>{e||t.removeEntry(r,es.min())})}).next(()=>(this.Vi=null,t.apply(e)))}updateLimboDocument(e,t){return this.gi(e,t).next(e=>{e?this.fi.delete(t.toString()):this.fi.add(t.toString())})}Ti(e){return 0}gi(e,t){return ey.or([()=>ey.resolve(this.Ri.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.Ai(e,t)])}}class sN{constructor(e,t){this.persistence=e,this.pi=new n4(e=>eM(e.path),(e,t)=>e.isEqual(t)),this.garbageCollector=new si(this,t)}static mi(e,t){return new sN(e,t)}Ei(){}di(e){return ey.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}gr(e){let t=this.wr(e);return this.persistence.getTargetCache().getTargetCount(e).next(e=>t.next(t=>e+t))}wr(e){let t=0;return this.pr(e,e=>{t++}).next(()=>t)}pr(e,t){return ey.forEach(this.pi,(n,r)=>this.br(e,n,r).next(e=>e?ey.resolve():t(r)))}removeTargets(e,t,n){return this.persistence.getTargetCache().removeTargets(e,t,n)}removeOrphanedDocuments(e,t){let n=0,r=this.persistence.getRemoteDocumentCache(),i=r.newChangeBuffer();return r.ii(e,r=>this.br(e,r,t).next(e=>{e||(n++,i.removeEntry(r,es.min()))})).next(()=>i.apply(e)).next(()=>n)}markPotentiallyOrphaned(e,t){return this.pi.set(t,e.currentSequenceNumber),ey.resolve()}removeTarget(e,t){let n=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,n)}addReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),ey.resolve()}removeReference(e,t,n){return this.pi.set(n,e.currentSequenceNumber),ey.resolve()}updateLimboDocument(e,t){return this.pi.set(t,e.currentSequenceNumber),ey.resolve()}Ti(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=function e(t){switch(t3(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:let n=tH(t);return n?16+e(n):16;case 5:return 2*t.stringValue.length;case 6:return tK(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return(t.arrayValue.values||[]).reduce((t,n)=>t+e(n),0);case 10:case 11:var r;let i;return r=t.mapValue,i=0,tD(r.fields,(t,n)=>{i+=t.length+e(n)}),i;default:throw S(13486,{value:t})}}(e.data.value)),t}br(e,t,n){return ey.or([()=>this.persistence.Ai(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{let e=this.pi.get(t);return ey.resolve(void 0!==e&&e>n)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sC{constructor(e){this.serializer=e}k(e,t,n,r){let i=new ev("createOrUpgrade",t);n<1&&r>=1&&(!function(e){e.createObjectStore(eF)}(e),e.createObjectStore(eU,{keyPath:"userId"}),e.createObjectStore(eq,{keyPath:eB,autoIncrement:!0}).createIndex(ez,eK,{unique:!0}),e.createObjectStore(e$),sD(e),function(e){e.createObjectStore(eP)}(e));let s=ey.resolve();return n<3&&r>=3&&(0!==n&&(e.deleteObjectStore(e5),e.deleteObjectStore(e0),e.deleteObjectStore(e9),sD(e)),s=s.next(()=>(function(e){let t=e.store(e9),n={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:es.min().toTimestamp(),targetCount:0};return t.put(e8,n)})(i))),n<4&&r>=4&&(0!==n&&(s=s.next(()=>i.store(eq).J().next(t=>{e.deleteObjectStore(eq),e.createObjectStore(eq,{keyPath:eB,autoIncrement:!0}).createIndex(ez,eK,{unique:!0});let n=i.store(eq),r=t.map(e=>n.put(e));return ey.waitFor(r)}))),s=s.next(()=>{!function(e){e.createObjectStore(tt,{keyPath:"clientId"})}(e)})),n<5&&r>=5&&(s=s.next(()=>this.yi(i))),n<6&&r>=6&&(s=s.next(()=>((function(e){e.createObjectStore(eJ)})(e),this.wi(i)))),n<7&&r>=7&&(s=s.next(()=>this.Si(i))),n<8&&r>=8&&(s=s.next(()=>this.bi(e,i))),n<9&&r>=9&&(s=s.next(()=>{e.objectStoreNames.contains("remoteDocumentChanges")&&e.deleteObjectStore("remoteDocumentChanges")})),n<10&&r>=10&&(s=s.next(()=>this.Di(i))),n<11&&r>=11&&(s=s.next(()=>{(function(e){e.createObjectStore(tn,{keyPath:"bundleId"})})(e),function(e){e.createObjectStore(tr,{keyPath:"name"})}(e)})),n<12&&r>=12&&(s=s.next(()=>{!function(e){let t=e.createObjectStore(tm,{keyPath:tg});t.createIndex(tp,ty,{unique:!1}),t.createIndex(tw,tv,{unique:!1})}(e)})),n<13&&r>=13&&(s=s.next(()=>(function(e){let t=e.createObjectStore(ej,{keyPath:eQ});t.createIndex(eW,eH),t.createIndex(eY,eX)})(e)).next(()=>this.Ci(e,i)).next(()=>e.deleteObjectStore(eP))),n<14&&r>=14&&(s=s.next(()=>this.Fi(e,i))),n<15&&r>=15&&(s=s.next(()=>{e.createObjectStore(ti,{keyPath:"indexId",autoIncrement:!0}).createIndex(ts,"collectionGroup",{unique:!1}),e.createObjectStore(ta,{keyPath:to}).createIndex(tl,tu,{unique:!1}),e.createObjectStore(th,{keyPath:tc}).createIndex(td,tf,{unique:!1})})),n<16&&r>=16&&(s=s.next(()=>{t.objectStore(ta).clear()}).next(()=>{t.objectStore(th).clear()})),n<17&&r>=17&&(s=s.next(()=>{!function(e){e.createObjectStore(tI,{keyPath:"name"})}(e)})),n<18&&r>=18&&(0,h.WO)()&&(s=s.next(()=>{t.objectStore(ta).clear()}).next(()=>{t.objectStore(th).clear()})),s}wi(e){let t=0;return e.store(eP).ee((e,n)=>{t+=i5(n)}).next(()=>{let n={byteSize:t};return e.store(eJ).put(eZ,n)})}yi(e){let t=e.store(eU),n=e.store(eq);return t.J().next(t=>ey.forEach(t,t=>{let r=IDBKeyRange.bound([t.userId,-1],[t.userId,t.lastAcknowledgedBatchId]);return n.J(ez,r).next(n=>ey.forEach(n,n=>{N(n.userId===t.userId,18650,"Cannot process batch from unexpected user",{batchId:n.batchId});let r=iI(this.serializer,n);return i2(e,t.userId,r).next(()=>{})}))}))}Si(e){let t=e.store(e5),n=e.store(eP);return e.store(e9).get(e8).next(e=>{let r=[];return n.ee((n,i)=>{let s=new j(n),a=[0,eM(s)];r.push(t.get(a).next(n=>n?ey.resolve():t.put({targetId:0,path:eM(s),sequenceNumber:e.highestListenSequenceNumber})))}).next(()=>ey.waitFor(r))})}bi(e,t){e.createObjectStore(e7,{keyPath:te});let n=t.store(e7),r=new iH,i=e=>{if(r.add(e)){let t=e.lastSegment(),r=e.popLast();return n.put({collectionId:t,parent:eM(r)})}};return t.store(eP).ee({X:!0},(e,t)=>i(new j(e).popLast())).next(()=>t.store(e$).ee({X:!0},([e,t,n],r)=>i(eO(t).popLast())))}Di(e){let t=e.store(e0);return t.ee((e,n)=>{let r=iT(n),i=iE(this.serializer,r);return t.put(i)})}Ci(e,t){let n=t.store(eP),r=[];return n.ee((e,n)=>{let i=t.store(ej),s=(n.document?new H(j.fromString(n.document.name).popFirst(5)):n.noDocument?H.fromSegments(n.noDocument.path):n.unknownDocument?H.fromSegments(n.unknownDocument.path):S(36783)).path.toArray(),a={prefixPath:s.slice(0,s.length-2),collectionGroup:s[s.length-2],documentId:s[s.length-1],readTime:n.readTime||[0,0],unknownDocument:n.unknownDocument,noDocument:n.noDocument,document:n.document,hasCommittedMutations:!!n.hasCommittedMutations};r.push(i.put(a))}).next(()=>ey.waitFor(r))}Fi(e,t){let n=t.store(eq),r=new sl(this.serializer),i=new sb(sx.mi,this.serializer.yt);return n.J().next(e=>{let n=new Map;return e.forEach(e=>{let t=n.get(e.userId)??rn();iI(this.serializer,e).keys().forEach(e=>t=t.add(e)),n.set(e.userId,t)}),ey.forEach(n,(e,n)=>{let s=new y(n),a=iC.wt(this.serializer,s),o=i.getIndexManager(s);return new sm(r,i4.wt(s,this.serializer,o,i.referenceDelegate),a,o).recalculateAndSaveOverlaysForDocumentKeys(new tx(t,eR.ce),e).next()})})}}function sD(e){e.createObjectStore(e5,{keyPath:e4}).createIndex(e6,e3,{unique:!0}),e.createObjectStore(e0,{keyPath:"targetId"}).createIndex(e1,e2,{unique:!0}),e.createObjectStore(e9)}let sA="IndexedDbPersistence",sk="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.";class sR{constructor(e,t,n,r,i,s,a,o,l,u,h=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=n,this.Mi=i,this.window=s,this.document=a,this.xi=l,this.Oi=u,this.Ni=h,this.ci=null,this.li=!1,this.isPrimary=!1,this.networkEnabled=!0,this.Bi=null,this.inForeground=!1,this.Li=null,this.ki=null,this.qi=Number.NEGATIVE_INFINITY,this.Qi=e=>Promise.resolve(),!sR.v())throw new D(C.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new ss(this,r),this.$i=t+"main",this.serializer=new ig(o),this.Ui=new eI(this.$i,this.Ni,new sC(this.serializer)),this.hi=new iD,this.Pi=new i9(this.referenceDelegate,this.serializer),this.remoteDocumentCache=new sl(this.serializer),this.Ii=new iN,this.window&&this.window.localStorage?this.Ki=this.window.localStorage:(this.Ki=null,!1===u&&E(sA,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.Wi().then(()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new D(C.FAILED_PRECONDITION,sk);return this.Gi(),this.zi(),this.ji(),this.runTransaction("getHighestListenSequenceNumber","readonly",e=>this.Pi.getHighestSequenceNumber(e))}).then(e=>{this.ci=new eR(e,this.xi)}).then(()=>{this.li=!0}).catch(e=>(this.Ui&&this.Ui.close(),Promise.reject(e)))}Ji(e){return this.Qi=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.Ui.$(async t=>{null===t.newVersion&&await e()})}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.Mi.enqueueAndForget(async()=>{this.started&&await this.Wi()}))}Wi(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",e=>tN(e,tt).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next(()=>{if(this.isPrimary)return this.Hi(e).next(e=>{e||(this.isPrimary=!1,this.Mi.enqueueRetryable(()=>this.Qi(!1)))})}).next(()=>this.Yi(e)).next(t=>this.isPrimary&&!t?this.Zi(e).next(()=>!1):!!t&&this.Xi(e).next(()=>!0))).catch(e=>{if(eb(e))return T(sA,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return T(sA,"Releasing owner lease after error during lease refresh",e),!1}).then(e=>{this.isPrimary!==e&&this.Mi.enqueueRetryable(()=>this.Qi(e)),this.isPrimary=e})}Hi(e){return tN(e,eF).get(eL).next(e=>ey.resolve(this.es(e)))}ts(e){return tN(e,tt).delete(this.clientId)}async ns(){if(this.isPrimary&&!this.rs(this.qi,18e5)){this.qi=Date.now();let e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",e=>{let t=tN(e,tt);return t.J().next(e=>{let n=this.ss(e,18e5),r=e.filter(e=>-1===n.indexOf(e));return ey.forEach(r,e=>t.delete(e.clientId)).next(()=>r)})}).catch(()=>[]);if(this.Ki)for(let t of e)this.Ki.removeItem(this._s(t.clientId))}}ji(){this.ki=this.Mi.enqueueAfterDelay("client_metadata_refresh",4e3,()=>this.Wi().then(()=>this.ns()).then(()=>this.ji()))}es(e){return!!e&&e.ownerId===this.clientId}Yi(e){return this.Oi?ey.resolve(!0):tN(e,eF).get(eL).next(t=>{if(null!==t&&this.rs(t.leaseTimestampMs,5e3)&&!this.us(t.ownerId)){if(this.es(t)&&this.networkEnabled)return!0;if(!this.es(t)){if(!t.allowTabSynchronization)throw new D(C.FAILED_PRECONDITION,sk);return!1}}return!(!this.networkEnabled||!this.inForeground)||tN(e,tt).J().next(e=>void 0===this.ss(e,5e3).find(e=>{if(this.clientId!==e.clientId){let t=!this.networkEnabled&&e.networkEnabled,n=!this.inForeground&&e.inForeground,r=this.networkEnabled===e.networkEnabled;if(t||n&&r)return!0}return!1}))}).next(e=>(this.isPrimary!==e&&T(sA,`Client ${e?"is":"is not"} eligible for a primary lease.`),e))}async shutdown(){this.li=!1,this.cs(),this.ki&&(this.ki.cancel(),this.ki=null),this.ls(),this.hs(),await this.Ui.runTransaction("shutdown","readwrite",[eF,tt],e=>{let t=new tx(e,eR.ce);return this.Zi(t).next(()=>this.ts(t))}),this.Ui.close(),this.Ps()}ss(e,t){return e.filter(e=>this.rs(e.updateTimeMs,t)&&!this.us(e.clientId))}Ts(){return this.runTransaction("getActiveClients","readonly",e=>tN(e,tt).J().next(e=>this.ss(e,18e5).map(e=>e.clientId)))}get started(){return this.li}getGlobalsCache(){return this.hi}getMutationQueue(e,t){return i4.wt(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.Pi}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new iJ(e,this.serializer.yt.databaseId)}getDocumentOverlayCache(e){return iC.wt(this.serializer,e)}getBundleCache(){return this.Ii}runTransaction(e,t,n){var r;let i;T(sA,"Starting transaction:",e);let s=18===(r=this.Ni)?tS:17===r?tS:16===r?tb:15===r?tb:14===r?t_:13===r?t_:12===r?tE:11===r?tT:void S(60245);return this.Ui.runTransaction(e,"readonly"===t?"readonly":"readwrite",s,r=>(i=new tx(r,this.ci?this.ci.next():eR.ce),"readwrite-primary"===t?this.Hi(i).next(e=>!!e||this.Yi(i)).next(t=>{if(!t)throw E(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.Mi.enqueueRetryable(()=>this.Qi(!1)),new D(C.FAILED_PRECONDITION,em);return n(i)}).next(e=>this.Xi(i).next(()=>e)):this.Is(i).next(()=>n(i)))).then(e=>(i.raiseOnCommittedEvent(),e))}Is(e){return tN(e,eF).get(eL).next(e=>{if(null!==e&&this.rs(e.leaseTimestampMs,5e3)&&!this.us(e.ownerId)&&!this.es(e)&&!(this.Oi||this.allowTabSynchronization&&e.allowTabSynchronization))throw new D(C.FAILED_PRECONDITION,sk)})}Xi(e){let t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return tN(e,eF).put(eL,t)}static v(){return eI.v()}Zi(e){let t=tN(e,eF);return t.get(eL).next(e=>this.es(e)?(T(sA,"Releasing primary lease."),t.delete(eL)):ey.resolve())}rs(e,t){let n=Date.now();return!(e<n-t)&&(!(e>n)||(E(`Detected an update time that is in the future: ${e} > ${n}`),!1))}Gi(){null!==this.document&&"function"==typeof this.document.addEventListener&&(this.Li=()=>{this.Mi.enqueueAndForget(()=>(this.inForeground="visible"===this.document.visibilityState,this.Wi()))},this.document.addEventListener("visibilitychange",this.Li),this.inForeground="visible"===this.document.visibilityState)}ls(){this.Li&&(this.document.removeEventListener("visibilitychange",this.Li),this.Li=null)}zi(){"function"==typeof this.window?.addEventListener&&(this.Bi=()=>{this.cs();let e=/(?:Version|Mobile)\/1[456]/;(0,h.G6)()&&(navigator.appVersion.match(e)||navigator.userAgent.match(e))&&this.Mi.enterRestrictedMode(!0),this.Mi.enqueueAndForget(()=>this.shutdown())},this.window.addEventListener("pagehide",this.Bi))}hs(){this.Bi&&(this.window.removeEventListener("pagehide",this.Bi),this.Bi=null)}us(e){try{let t=null!==this.Ki?.getItem(this._s(e));return T(sA,`Client '${e}' ${t?"is":"is not"} zombied in LocalStorage`),t}catch(e){return E(sA,"Failed to get zombied client id.",e),!1}}cs(){if(this.Ki)try{this.Ki.setItem(this._s(this.clientId),String(Date.now()))}catch(e){E("Failed to set zombie client id.",e)}}Ps(){if(this.Ki)try{this.Ki.removeItem(this._s(this.clientId))}catch(e){}}_s(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sV{constructor(e,t,n,r){this.targetId=e,this.fromCache=t,this.Es=n,this.ds=r}static As(e,t){let n=rn(),r=rn();for(let e of t.docChanges)switch(e.type){case 0:n=n.add(e.doc.key);break;case 1:r=r.add(e.doc.key)}return new sV(e,t.fromCache,n,r)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sM{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sO{constructor(){this.Rs=!1,this.Vs=!1,this.fs=100,this.gs=(0,h.G6)()?8:eT((0,h.z$)())>0?6:4}initialize(e,t){this.ps=e,this.indexManager=t,this.Rs=!0}getDocumentsMatchingQuery(e,t,n,r){let i={result:null};return this.ys(e,t).next(e=>{i.result=e}).next(()=>{if(!i.result)return this.ws(e,t,r,n).next(e=>{i.result=e})}).next(()=>{if(i.result)return;let n=new sM;return this.Ss(e,t,n).next(r=>{if(i.result=r,this.Vs)return this.bs(e,t,n,r.size)})}).next(()=>i.result)}bs(e,t,n,r){return n.documentReadCount<this.fs?(I()<=u.in.DEBUG&&T("QueryEngine","SDK will not create cache indexes for query:",n1(t),"since it only creates cache indexes for collection contains","more than or equal to",this.fs,"documents"),ey.resolve()):(I()<=u.in.DEBUG&&T("QueryEngine","Query:",n1(t),"scans",n.documentReadCount,"local documents and returns",r,"documents as results."),n.documentReadCount>this.gs*r?(I()<=u.in.DEBUG&&T("QueryEngine","The SDK decides to create cache indexes for query:",n1(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,nY(t))):ey.resolve())}ys(e,t){if(nQ(t))return ey.resolve(null);let n=nY(t);return this.indexManager.getIndexType(e,n).next(r=>0===r?null:(null!==t.limit&&1===r&&(n=nY(t=nJ(t,null,"F"))),this.indexManager.getDocumentsMatchingTarget(e,n).next(r=>{let i=rn(...r);return this.ps.getDocuments(e,i).next(r=>this.indexManager.getMinOffset(e,n).next(n=>{let s=this.Ds(t,r);return this.Cs(t,s,i,n.readTime)?this.ys(e,nJ(t,null,"F")):this.vs(e,s,t,n)}))})))}ws(e,t,n,r){return nQ(t)||r.isEqual(es.min())?ey.resolve(null):this.ps.getDocuments(e,n).next(i=>{let s=this.Ds(t,i);return this.Cs(t,s,n,r)?ey.resolve(null):(I()<=u.in.DEBUG&&T("QueryEngine","Re-using previous result from %s to execute query: %s",r.toString(),n1(t)),this.vs(e,s,t,function(e,t){let n=e.toTimestamp().seconds,r=e.toTimestamp().nanoseconds+1;return new ed(es.fromTimestamp(1e9===r?new ei(n+1,0):new ei(n,r)),H.empty(),-1)}(r,0)).next(e=>e))})}Ds(e,t){let n=new tM(n5(e));return t.forEach((t,r)=>{n2(e,r)&&(n=n.add(r))}),n}Cs(e,t,n,r){if(null===e.limit)return!1;if(n.size!==t.size)return!0;let i="F"===e.limitType?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(r)>0)}Ss(e,t,n){return I()<=u.in.DEBUG&&T("QueryEngine","Using full collection scan to execute query:",n1(t)),this.ps.getDocumentsMatchingQuery(e,t,ed.min(),n)}vs(e,t,n,r){return this.ps.getDocumentsMatchingQuery(e,n,r).next(e=>(t.forEach(t=>{e=e.insert(t.key,t)}),e))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sP="LocalStore";class sF{constructor(e,t,n,r){this.persistence=e,this.Fs=t,this.serializer=r,this.Ms=new tk(q),this.xs=new n4(e=>nU(e),nq),this.Os=new Map,this.Ns=e.getRemoteDocumentCache(),this.Pi=e.getTargetCache(),this.Ii=e.getBundleCache(),this.Bs(n)}Bs(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new sm(this.Ns,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ns.setIndexManager(this.indexManager),this.Fs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",t=>e.collect(t,this.Ms))}}async function sL(e,t){return await e.persistence.runTransaction("Handle user change","readonly",n=>{let r;return e.mutationQueue.getAllMutationBatches(n).next(i=>(r=i,e.Bs(t),e.mutationQueue.getAllMutationBatches(n))).next(t=>{let i=[],s=[],a=rn();for(let e of r)for(let t of(i.push(e.batchId),e.mutations))a=a.add(t.key);for(let e of t)for(let t of(s.push(e.batchId),e.mutations))a=a.add(t.key);return e.localDocuments.getDocuments(n,a).next(e=>({Ls:e,removedBatchIds:i,addedBatchIds:s}))})})}function sU(e){return e.persistence.runTransaction("Get last remote snapshot version","readonly",t=>e.Pi.getLastRemoteSnapshotVersion(t))}async function sq(e,t,n){let r=e.Ms.get(t);try{n||await e.persistence.runTransaction("Release target",n?"readwrite":"readwrite-primary",t=>e.persistence.referenceDelegate.removeTarget(t,r))}catch(e){if(!eb(e))throw e;T(sP,`Failed to update sequence numbers for target ${t}: ${e}`)}e.Ms=e.Ms.remove(t),e.xs.delete(r.target)}function sB(e,t,n){let r=es.min(),i=rn();return e.persistence.runTransaction("Execute query","readwrite",s=>(function(e,t,n){let r=e.xs.get(n);return void 0!==r?ey.resolve(e.Ms.get(r)):e.Pi.getTargetData(t,n)})(e,s,nY(t)).next(t=>{if(t)return r=t.lastLimboFreeSnapshotVersion,e.Pi.getMatchingKeysForTargetId(s,t.targetId).next(e=>{i=e})}).next(()=>e.Fs.getDocumentsMatchingQuery(s,t,n?r:es.min(),n?i:rn())).next(n=>{var r;let s;return r=t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2)),s=e.Os.get(r)||es.min(),n.forEach((e,t)=>{t.readTime.compareTo(s)>0&&(s=t.readTime)}),e.Os.set(r,s),{documents:n,Qs:i}}))}class sz{constructor(){this.activeTargetIds=rr}zs(e){this.activeTargetIds=this.activeTargetIds.add(e)}js(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Gs(){return JSON.stringify({activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()})}}class sK{constructor(){this.Mo=new sz,this.xo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,n){}addLocalQueryTarget(e,t=!0){return t&&this.Mo.zs(e),this.xo[e]||"not-current"}updateQueryState(e,t,n){this.xo[e]=t}removeLocalQueryTarget(e){this.Mo.js(e)}isLocalQueryTarget(e){return this.Mo.activeTargetIds.has(e)}clearQueryState(e){delete this.xo[e]}getAllActiveQueryTargets(){return this.Mo.activeTargetIds}isActiveQueryTarget(e){return this.Mo.activeTargetIds.has(e)}start(){return this.Mo=new sz,Promise.resolve()}handleUserChange(e,t,n){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sG{Oo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let s$="ConnectivityMonitor";class sj{constructor(){this.No=()=>this.Bo(),this.Lo=()=>this.ko(),this.qo=[],this.Qo()}Oo(e){this.qo.push(e)}shutdown(){window.removeEventListener("online",this.No),window.removeEventListener("offline",this.Lo)}Qo(){window.addEventListener("online",this.No),window.addEventListener("offline",this.Lo)}Bo(){for(let e of(T(s$,"Network connectivity changed: AVAILABLE"),this.qo))e(0)}ko(){for(let e of(T(s$,"Network connectivity changed: UNAVAILABLE"),this.qo))e(1)}static v(){return"undefined"!=typeof window&&void 0!==window.addEventListener&&void 0!==window.removeEventListener}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sQ=null;function sW(){return null===sQ?sQ=268435456+Math.round(2147483648*Math.random()):sQ++,"0x"+sQ.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sH="RestConnection",sY={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery"};class sX{get $o(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;let t=e.ssl?"https":"http",n=encodeURIComponent(this.databaseId.projectId),r=encodeURIComponent(this.databaseId.database);this.Uo=t+"://"+e.host,this.Ko=`projects/${n}/databases/${r}`,this.Wo=this.databaseId.database===tJ?`project_id=${n}`:`project_id=${n}&database_id=${r}`}Go(e,t,n,r,i){let s=sW(),a=this.zo(e,t.toUriEncodedString());T(sH,`Sending RPC '${e}' ${s}:`,a,n);let o={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Wo};this.jo(o,r,i);let{host:l}=new URL(a),u=(0,h.Xx)(l);return this.Jo(e,a,o,n,u).then(t=>(T(sH,`Received RPC '${e}' ${s}: `,t),t),t=>{throw _(sH,`RPC '${e}' ${s} failed with error: `,t,"url: ",a,"request:",n),t})}Ho(e,t,n,r,i,s){return this.Go(e,t,n,r,i)}jo(e,t,n){e["X-Goog-Api-Client"]="gl-js/ fire/"+w,e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach((t,n)=>e[n]=t),n&&n.headers.forEach((t,n)=>e[n]=t)}zo(e,t){let n=sY[e];return`${this.Uo}/v1/${t}:${n}`}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sJ{constructor(e){this.Yo=e.Yo,this.Zo=e.Zo}Xo(e){this.e_=e}t_(e){this.n_=e}r_(e){this.i_=e}onMessage(e){this.s_=e}close(){this.Zo()}send(e){this.Yo(e)}o_(){this.e_()}__(){this.n_()}a_(e){this.i_(e)}u_(e){this.s_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let sZ="WebChannelConnection";class s0 extends sX{constructor(e){super(e),this.c_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}Jo(e,t,n,r,i){let s=sW();return new Promise((i,a)=>{let o=new d.JJ;o.setWithCredentials(!0),o.listenOnce(d.tw.COMPLETE,()=>{try{switch(o.getLastErrorCode()){case d.jK.NO_ERROR:let t=o.getResponseJson();T(sZ,`XHR for RPC '${e}' ${s} received:`,JSON.stringify(t)),i(t);break;case d.jK.TIMEOUT:T(sZ,`RPC '${e}' ${s} timed out`),a(new D(C.DEADLINE_EXCEEDED,"Request time out"));break;case d.jK.HTTP_ERROR:let n=o.getStatus();if(T(sZ,`RPC '${e}' ${s} failed with status:`,n,"response text:",o.getResponseText()),n>0){let e=o.getResponseJson();Array.isArray(e)&&(e=e[0]);let t=e?.error;if(t&&t.status&&t.message){let e=function(e){let t=e.toLowerCase().replace(/_/g,"-");return Object.values(C).indexOf(t)>=0?t:C.UNKNOWN}(t.status);a(new D(e,t.message))}else a(new D(C.UNKNOWN,"Server responded with status "+o.getStatus()))}else a(new D(C.UNAVAILABLE,"Connection failed."));break;default:S(9055,{l_:e,streamId:s,h_:o.getLastErrorCode(),P_:o.getLastError()})}}finally{T(sZ,`RPC '${e}' ${s} completed.`)}});let l=JSON.stringify(r);T(sZ,`RPC '${e}' ${s} sending request:`,r),o.send(t,"POST",l,n,15)})}T_(e,t,n){let i=sW(),s=[this.Uo,"/","google.firestore.v1.Firestore","/",e,"/channel"],a=(0,d.UE)(),o=(0,d.FJ)(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;void 0!==u&&(l.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(l.useFetchStreams=!0),this.jo(l.initMessageHeaders,t,n),l.encodeInitMessageHeaders=!0;let h=s.join("");T(sZ,`Creating RPC '${e}' stream ${i}: ${h}`,l);let c=a.createWebChannel(h,l);this.I_(c);let f=!1,m=!1,g=new sJ({Yo:t=>{m?T(sZ,`Not sending because RPC '${e}' stream ${i} is closed:`,t):(f||(T(sZ,`Opening RPC '${e}' stream ${i} transport.`),c.open(),f=!0),T(sZ,`RPC '${e}' stream ${i} sending:`,t),c.send(t))},Zo:()=>c.close()}),p=(e,t,n)=>{e.listen(t,e=>{try{n(e)}catch(e){setTimeout(()=>{throw e},0)}})};return p(c,d.ii.EventType.OPEN,()=>{m||(T(sZ,`RPC '${e}' stream ${i} transport opened.`),g.o_())}),p(c,d.ii.EventType.CLOSE,()=>{m||(m=!0,T(sZ,`RPC '${e}' stream ${i} transport closed`),g.a_(),this.E_(c))}),p(c,d.ii.EventType.ERROR,t=>{m||(m=!0,_(sZ,`RPC '${e}' stream ${i} transport errored. Name:`,t.name,"Message:",t.message),g.a_(new D(C.UNAVAILABLE,"The operation could not be completed")))}),p(c,d.ii.EventType.MESSAGE,t=>{if(!m){let n=t.data[0];N(!!n,16349);let s=n?.error||n[0]?.error;if(s){T(sZ,`RPC '${e}' stream ${i} received error:`,s);let t=s.status,n=function(e){let t=r[e];if(void 0!==t)return rO(t)}(t),a=s.message;void 0===n&&(n=C.INTERNAL,a="Unknown error status: "+t+" with message "+s.message),m=!0,g.a_(new D(n,a)),c.close()}else T(sZ,`RPC '${e}' stream ${i} received:`,n),g.u_(n)}}),p(o,d.ju.STAT_EVENT,t=>{t.stat===d.kN.PROXY?T(sZ,`RPC '${e}' stream ${i} detected buffering proxy`):t.stat===d.kN.NOPROXY&&T(sZ,`RPC '${e}' stream ${i} detected no buffering proxy`)}),setTimeout(()=>{g.__()},0),g}terminate(){this.c_.forEach(e=>e.close()),this.c_=[]}I_(e){this.c_.push(e)}E_(e){this.c_=this.c_.filter(t=>t===e)}}function s1(){return"undefined"!=typeof document?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s2(e){return new rZ(e,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s5{constructor(e,t,n=1e3,r=1.5,i=6e4){this.Mi=e,this.timerId=t,this.d_=n,this.A_=r,this.R_=i,this.V_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.V_=0}g_(){this.V_=this.R_}p_(e){this.cancel();let t=Math.floor(this.V_+this.y_()),n=Math.max(0,Date.now()-this.f_),r=Math.max(0,t-n);r>0&&T("ExponentialBackoff",`Backing off for ${r} ms (base delay: ${this.V_} ms, delay with jitter: ${t} ms, last attempt: ${n} ms ago)`),this.m_=this.Mi.enqueueAfterDelay(this.timerId,r,()=>(this.f_=Date.now(),e())),this.V_*=this.A_,this.V_<this.d_&&(this.V_=this.d_),this.V_>this.R_&&(this.V_=this.R_)}w_(){null!==this.m_&&(this.m_.skipDelay(),this.m_=null)}cancel(){null!==this.m_&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let s4="PersistentStream";class s6{constructor(e,t,n,r,i,s,a,o){this.Mi=e,this.S_=n,this.b_=r,this.connection=i,this.authCredentialsProvider=s,this.appCheckCredentialsProvider=a,this.listener=o,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new s5(e,t)}x_(){return 1===this.state||5===this.state||this.O_()}O_(){return 2===this.state||3===this.state}start(){this.F_=0,4!==this.state?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&null===this.C_&&(this.C_=this.Mi.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.Q_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}Q_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,t){this.Q_(),this.U_(),this.M_.cancel(),this.D_++,4!==e?this.M_.reset():t&&t.code===C.RESOURCE_EXHAUSTED?(E(t.toString()),E("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):t&&t.code===C.UNAUTHENTICATED&&3!==this.state&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),null!==this.stream&&(this.K_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.r_(t)}K_(){}auth(){this.state=1;let e=this.W_(this.D_),t=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([e,n])=>{this.D_===t&&this.G_(e,n)},t=>{e(()=>{let e=new D(C.UNKNOWN,"Fetching auth token failed: "+t.message);return this.z_(e)})})}G_(e,t){let n=this.W_(this.D_);this.stream=this.j_(e,t),this.stream.Xo(()=>{n(()=>this.listener.Xo())}),this.stream.t_(()=>{n(()=>(this.state=2,this.v_=this.Mi.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.t_()))}),this.stream.r_(e=>{n(()=>this.z_(e))}),this.stream.onMessage(e=>{n(()=>1==++this.F_?this.J_(e):this.onNext(e))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return T(s4,`close with error: ${e}`),this.stream=null,this.close(4,e)}W_(e){return t=>{this.Mi.enqueueAndForget(()=>this.D_===e?t():(T(s4,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class s3 extends s6{constructor(e,t,n,r,i,s){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}j_(e,t){return this.connection.T_("Listen",e,t)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();let t=function(e,t){let n;if("targetChange"in t){var r,i;t.targetChange;let s="NO_CHANGE"===(r=t.targetChange.targetChangeType||"NO_CHANGE")?0:"ADD"===r?1:"REMOVE"===r?2:"CURRENT"===r?3:"RESET"===r?4:S(39313,{state:r}),a=t.targetChange.targetIds||[],o=(i=t.targetChange.resumeToken,e.useProto3Json?(N(void 0===i||"string"==typeof i,58123),tU.fromBase64String(i||"")):(N(void 0===i||i instanceof m||i instanceof Uint8Array,16193),tU.fromUint8Array(i||new Uint8Array))),l=t.targetChange.cause;n=new r$(s,a,o,l&&new D(void 0===l.code?C.UNKNOWN:rO(l.code),l.message||"")||null)}else if("documentChange"in t){t.documentChange;let r=t.documentChange;r.document,r.document.name,r.document.updateTime;let i=r9(e,r.document.name),s=r5(r.document.updateTime),a=r.document.createTime?r5(r.document.createTime):es.min(),o=new ng({mapValue:{fields:r.document.fields}}),l=np.newFoundDocument(i,s,a,o);n=new rK(r.targetIds||[],r.removedTargetIds||[],l.key,l)}else if("documentDelete"in t){t.documentDelete;let r=t.documentDelete;r.document;let i=r9(e,r.document),s=r.readTime?r5(r.readTime):es.min(),a=np.newNoDocument(i,s);n=new rK([],r.removedTargetIds||[],a.key,a)}else if("documentRemove"in t){t.documentRemove;let r=t.documentRemove;r.document;let i=r9(e,r.document);n=new rK([],r.removedTargetIds||[],i,null)}else{if(!("filter"in t))return S(11601,{Rt:t});{t.filter;let e=t.filter;e.targetId;let{count:r=0,unchangedNames:i}=e,s=new rM(r,i);n=new rG(e.targetId,s)}}return n}(this.serializer,e),n=function(e){if(!("targetChange"in e))return es.min();let t=e.targetChange;return t.targetIds&&t.targetIds.length?es.min():t.readTime?r5(t.readTime):es.min()}(e);return this.listener.H_(t,n)}Y_(e){let t={};t.database=it(this.serializer),t.addTarget=function(e,t){let n;let r=t.target;if((n=nB(r)?{documents:io(e,r)}:{query:il(e,r).ft}).targetId=t.targetId,t.resumeToken.approximateByteSize()>0){n.resumeToken=r2(e,t.resumeToken);let r=r0(e,t.expectedCount);null!==r&&(n.expectedCount=r)}else if(t.snapshotVersion.compareTo(es.min())>0){n.readTime=r1(e,t.snapshotVersion.toTimestamp());let r=r0(e,t.expectedCount);null!==r&&(n.expectedCount=r)}return n}(this.serializer,e);let n=function(e,t){let n=function(e){switch(e){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return S(28987,{purpose:e})}}(t.purpose);return null==n?null:{"goog-listen-tags":n}}(this.serializer,e);n&&(t.labels=n),this.q_(t)}Z_(e){let t={};t.database=it(this.serializer),t.removeTarget=e,this.q_(t)}}class s8 extends s6{constructor(e,t,n,r,i,s){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,n,r,s),this.serializer=i}get X_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}K_(){this.X_&&this.ea([])}j_(e,t){return this.connection.T_("Write",e,t)}J_(e){return N(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,N(!e.writeResults||0===e.writeResults.length,55816),this.listener.ta()}onNext(e){var t,n;N(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();let r=(t=e.writeResults,n=e.commitTime,t&&t.length>0?(N(void 0!==n,14353),t.map(e=>{let t;return(t=e.updateTime?r5(e.updateTime):r5(n)).isEqual(es.min())&&(t=r5(n)),new ry(t,e.transformResults||[])})):[]),i=r5(e.commitTime);return this.listener.na(i,r)}ra(){let e={};e.database=it(this.serializer),this.q_(e)}ea(e){let t={streamToken:this.lastStreamToken,writes:e.map(e=>is(this.serializer,e))};this.q_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s9{}class s7 extends s9{constructor(e,t,n,r){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=n,this.serializer=r,this.ia=!1}sa(){if(this.ia)throw new D(C.FAILED_PRECONDITION,"The client has already been terminated.")}Go(e,t,n,r){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([i,s])=>this.connection.Go(e,r6(t,n),r,i,s)).catch(e=>{throw"FirebaseError"===e.name?(e.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new D(C.UNKNOWN,e.toString())})}Ho(e,t,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,a])=>this.connection.Ho(e,r6(t,n),r,s,a,i)).catch(e=>{throw"FirebaseError"===e.name?(e.code===C.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),e):new D(C.UNKNOWN,e.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}class ae{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){0===this.oa&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){"Online"===this.state?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,"Online"===e&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){let t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(E(t),this.aa=!1):T("OnlineStateTracker",t)}Pa(){null!==this._a&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let at="RemoteStore";class an{constructor(e,t,n,r,i){this.localStore=e,this.datastore=t,this.asyncQueue=n,this.remoteSyncer={},this.Ta=[],this.Ia=new Map,this.Ea=new Set,this.da=[],this.Aa=i,this.Aa.Oo(e=>{n.enqueueAndForget(async()=>{ac(this)&&(T(at,"Restarting streams for network reachability change."),await async function(e){e.Ea.add(4),await ai(e),e.Ra.set("Unknown"),e.Ea.delete(4),await ar(e)}(this))})}),this.Ra=new ae(n,r)}}async function ar(e){if(ac(e))for(let t of e.da)await t(!0)}async function ai(e){for(let t of e.da)await t(!1)}function as(e,t){e.Ia.has(t.targetId)||(e.Ia.set(t.targetId,t),ah(e)?au(e):aN(e).O_()&&ao(e,t))}function aa(e,t){let n=aN(e);e.Ia.delete(t),n.O_()&&al(e,t),0===e.Ia.size&&(n.O_()?n.L_():ac(e)&&e.Ra.set("Unknown"))}function ao(e,t){if(e.Va.Ue(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(es.min())>0){let n=e.remoteSyncer.getRemoteKeysForTarget(t.targetId).size;t=t.withExpectedCount(n)}aN(e).Y_(t)}function al(e,t){e.Va.Ue(t),aN(e).Z_(t)}function au(e){e.Va=new rQ({getRemoteKeysForTarget:t=>e.remoteSyncer.getRemoteKeysForTarget(t),At:t=>e.Ia.get(t)||null,ht:()=>e.datastore.serializer.databaseId}),aN(e).start(),e.Ra.ua()}function ah(e){return ac(e)&&!aN(e).x_()&&e.Ia.size>0}function ac(e){return 0===e.Ea.size}async function ad(e){e.Ra.set("Online")}async function af(e){e.Ia.forEach((t,n)=>{ao(e,t)})}async function am(e,t){e.Va=void 0,ah(e)?(e.Ra.ha(t),au(e)):e.Ra.set("Unknown")}async function ag(e,t,n){if(e.Ra.set("Online"),t instanceof r$&&2===t.state&&t.cause)try{await async function(e,t){let n=t.cause;for(let r of t.targetIds)e.Ia.has(r)&&(await e.remoteSyncer.rejectListen(r,n),e.Ia.delete(r),e.Va.removeTarget(r))}(e,t)}catch(n){T(at,"Failed to remove targets %s: %s ",t.targetIds.join(","),n),await ap(e,n)}else if(t instanceof rK?e.Va.Ze(t):t instanceof rG?e.Va.st(t):e.Va.tt(t),!n.isEqual(es.min()))try{let t=await sU(e.localStore);n.compareTo(t)>=0&&await function(e,t){let n=e.Va.Tt(t);return n.targetChanges.forEach((n,r)=>{if(n.resumeToken.approximateByteSize()>0){let i=e.Ia.get(r);i&&e.Ia.set(r,i.withResumeToken(n.resumeToken,t))}}),n.targetMismatches.forEach((t,n)=>{let r=e.Ia.get(t);if(!r)return;e.Ia.set(t,r.withResumeToken(tU.EMPTY_BYTE_STRING,r.snapshotVersion)),al(e,t);let i=new im(r.target,t,n,r.sequenceNumber);ao(e,i)}),e.remoteSyncer.applyRemoteEvent(n)}(e,n)}catch(t){T(at,"Failed to raise snapshot:",t),await ap(e,t)}}async function ap(e,t,n){if(!eb(t))throw t;e.Ea.add(1),await ai(e),e.Ra.set("Offline"),n||(n=()=>sU(e.localStore)),e.asyncQueue.enqueueRetryable(async()=>{T(at,"Retrying IndexedDB access"),await n(),e.Ea.delete(1),await ar(e)})}function ay(e,t){return t().catch(n=>ap(e,n,t))}async function aw(e){let t=aC(e),n=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:-1;for(;ac(e)&&e.Ta.length<10;)try{let r=await function(e,t){return e.persistence.runTransaction("Get next mutation batch","readonly",n=>(void 0===t&&(t=-1),e.mutationQueue.getNextMutationBatchAfterBatchId(n,t)))}(e.localStore,n);if(null===r){0===e.Ta.length&&t.L_();break}n=r.batchId,function(e,t){e.Ta.push(t);let n=aC(e);n.O_()&&n.X_&&n.ea(t.mutations)}(e,r)}catch(t){await ap(e,t)}av(e)&&aI(e)}function av(e){return ac(e)&&!aC(e).x_()&&e.Ta.length>0}function aI(e){aC(e).start()}async function aT(e){aC(e).ra()}async function aE(e){let t=aC(e);for(let n of e.Ta)t.ea(n.mutations)}async function a_(e,t,n){let r=e.Ta.shift(),i=rR.from(r,t,n);await ay(e,()=>e.remoteSyncer.applySuccessfulWrite(i)),await aw(e)}async function ab(e,t){t&&aC(e).X_&&await async function(e,t){var n;if(function(e){switch(e){case C.OK:return S(64938);case C.CANCELLED:case C.UNKNOWN:case C.DEADLINE_EXCEEDED:case C.RESOURCE_EXHAUSTED:case C.INTERNAL:case C.UNAVAILABLE:case C.UNAUTHENTICATED:return!1;case C.INVALID_ARGUMENT:case C.NOT_FOUND:case C.ALREADY_EXISTS:case C.PERMISSION_DENIED:case C.FAILED_PRECONDITION:case C.ABORTED:case C.OUT_OF_RANGE:case C.UNIMPLEMENTED:case C.DATA_LOSS:return!0;default:return S(15467,{code:e})}}(n=t.code)&&n!==C.ABORTED){let n=e.Ta.shift();aC(e).B_(),await ay(e,()=>e.remoteSyncer.rejectFailedWrite(n.batchId,t)),await aw(e)}}(e,t),av(e)&&aI(e)}async function aS(e,t){e.asyncQueue.verifyOperationInProgress(),T(at,"RemoteStore received new credentials");let n=ac(e);e.Ea.add(3),await ai(e),n&&e.Ra.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Ea.delete(3),await ar(e)}async function ax(e,t){t?(e.Ea.delete(2),await ar(e)):t||(e.Ea.add(2),await ai(e),e.Ra.set("Unknown"))}function aN(e){var t,n,r;return e.ma||(e.ma=(t=e.datastore,n=e.asyncQueue,r={Xo:ad.bind(null,e),t_:af.bind(null,e),r_:am.bind(null,e),H_:ag.bind(null,e)},t.sa(),new s3(n,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,r)),e.da.push(async t=>{t?(e.ma.B_(),ah(e)?au(e):e.Ra.set("Unknown")):(await e.ma.stop(),e.Va=void 0)})),e.ma}function aC(e){var t,n,r;return e.fa||(e.fa=(t=e.datastore,n=e.asyncQueue,r={Xo:()=>Promise.resolve(),t_:aT.bind(null,e),r_:ab.bind(null,e),ta:aE.bind(null,e),na:a_.bind(null,e)},t.sa(),new s8(n,t.connection,t.authCredentials,t.appCheckCredentials,t.serializer,r)),e.da.push(async t=>{t?(e.fa.B_(),await aw(e)):(await e.fa.stop(),e.Ta.length>0&&(T(at,`Stopping write stream with ${e.Ta.length} pending writes`),e.Ta=[]))})),e.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aD{constructor(e,t,n,r,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=n,this.op=r,this.removalCallback=i,this.deferred=new A,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(e=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,t,n,r,i){let s=new aD(e,t,Date.now()+n,r,i);return s.start(n),s}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){null!==this.timerHandle&&(this.clearTimeout(),this.deferred.reject(new D(C.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>null!==this.timerHandle?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){null!==this.timerHandle&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function aA(e,t){if(E("AsyncQueue",`${t}: ${e}`),eb(e))return new D(C.UNAVAILABLE,`${t}: ${e}`);throw e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ak{static emptySet(e){return new ak(e.comparator)}constructor(e){this.comparator=e?(t,n)=>e(t,n)||H.comparator(t.key,n.key):(e,t)=>H.comparator(e.key,t.key),this.keyedMap=n8(),this.sortedSet=new tk(this.comparator)}has(e){return null!=this.keyedMap.get(e)}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){let t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((t,n)=>(e(t),!1))}add(e){let t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){let t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof ak)||this.size!==e.size)return!1;let t=this.sortedSet.getIterator(),n=e.sortedSet.getIterator();for(;t.hasNext();){let e=t.getNext().key,r=n.getNext().key;if(!e.isEqual(r))return!1}return!0}toString(){let e=[];return this.forEach(t=>{e.push(t.toString())}),0===e.length?"DocumentSet ()":"DocumentSet (\n  "+e.join("  \n")+"\n)"}copy(e,t){let n=new ak;return n.comparator=this.comparator,n.keyedMap=e,n.sortedSet=t,n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aR{constructor(){this.ga=new tk(H.comparator)}track(e){let t=e.doc.key,n=this.ga.get(t);n?0!==e.type&&3===n.type?this.ga=this.ga.insert(t,e):3===e.type&&1!==n.type?this.ga=this.ga.insert(t,{type:n.type,doc:e.doc}):2===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):2===e.type&&0===n.type?this.ga=this.ga.insert(t,{type:0,doc:e.doc}):1===e.type&&0===n.type?this.ga=this.ga.remove(t):1===e.type&&2===n.type?this.ga=this.ga.insert(t,{type:1,doc:n.doc}):0===e.type&&1===n.type?this.ga=this.ga.insert(t,{type:2,doc:e.doc}):S(63341,{Rt:e,pa:n}):this.ga=this.ga.insert(t,e)}ya(){let e=[];return this.ga.inorderTraversal((t,n)=>{e.push(n)}),e}}class aV{constructor(e,t,n,r,i,s,a,o,l){this.query=e,this.docs=t,this.oldDocs=n,this.docChanges=r,this.mutatedKeys=i,this.fromCache=s,this.syncStateChanged=a,this.excludesMetadataChanges=o,this.hasCachedResults=l}static fromInitialDocuments(e,t,n,r,i){let s=[];return t.forEach(e=>{s.push({type:0,doc:e})}),new aV(e,t,ak.emptySet(t),s,n,r,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&nZ(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;let t=this.docChanges,n=e.docChanges;if(t.length!==n.length)return!1;for(let e=0;e<t.length;e++)if(t[e].type!==n[e].type||!t[e].doc.isEqual(n[e].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aM{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class aO{constructor(){this.queries=aP(),this.onlineState="Unknown",this.Ca=new Set}terminate(){!function(e,t){let n=e.queries;e.queries=aP(),n.forEach((e,n)=>{for(let e of n.Sa)e.onError(t)})}(this,new D(C.ABORTED,"Firestore shutting down"))}}function aP(){return new n4(e=>n0(e),nZ)}async function aF(e,t){let n=3,r=t.query,i=e.queries.get(r);i?!i.ba()&&t.Da()&&(n=2):(i=new aM,n=t.Da()?0:1);try{switch(n){case 0:i.wa=await e.onListen(r,!0);break;case 1:i.wa=await e.onListen(r,!1);break;case 2:await e.onFirstRemoteStoreListen(r)}}catch(n){let e=aA(n,`Initialization of query '${n1(t.query)}' failed`);return void t.onError(e)}e.queries.set(r,i),i.Sa.push(t),t.va(e.onlineState),i.wa&&t.Fa(i.wa)&&aB(e)}async function aL(e,t){let n=t.query,r=3,i=e.queries.get(n);if(i){let e=i.Sa.indexOf(t);e>=0&&(i.Sa.splice(e,1),0===i.Sa.length?r=t.Da()?0:1:!i.ba()&&t.Da()&&(r=2))}switch(r){case 0:return e.queries.delete(n),e.onUnlisten(n,!0);case 1:return e.queries.delete(n),e.onUnlisten(n,!1);case 2:return e.onLastRemoteStoreUnlisten(n);default:return}}function aU(e,t){let n=!1;for(let r of t){let t=r.query,i=e.queries.get(t);if(i){for(let e of i.Sa)e.Fa(r)&&(n=!0);i.wa=r}}n&&aB(e)}function aq(e,t,n){let r=e.queries.get(t);if(r)for(let e of r.Sa)e.onError(n);e.queries.delete(t)}function aB(e){e.Ca.forEach(e=>{e.next()})}(a=s||(s={})).Ma="default",a.Cache="cache";class az{constructor(e,t,n){this.query=e,this.xa=t,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=n||{}}Fa(e){if(!this.options.includeMetadataChanges){let t=[];for(let n of e.docChanges)3!==n.type&&t.push(n);e=new aV(e.query,e.docs,e.oldDocs,t,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),t=!0):this.La(e,this.onlineState)&&(this.ka(e),t=!0),this.Na=e,t}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let t=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),t=!0),t}La(e,t){return!(e.fromCache&&this.Da())||(!this.options.qa||!("Offline"!==t))&&(!e.docs.isEmpty()||e.hasCachedResults||"Offline"===t)}Ba(e){if(e.docChanges.length>0)return!0;let t=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&!0===this.options.includeMetadataChanges}ka(e){e=aV.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==s.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aK{constructor(e){this.key=e}}class aG{constructor(e){this.key=e}}class a${constructor(e,t){this.query=e,this.Ya=t,this.Za=null,this.hasCachedResults=!1,this.current=!1,this.Xa=rn(),this.mutatedKeys=rn(),this.eu=n5(e),this.tu=new ak(this.eu)}get nu(){return this.Ya}ru(e,t){let n=t?t.iu:new aR,r=t?t.tu:this.tu,i=t?t.mutatedKeys:this.mutatedKeys,s=r,a=!1,o="F"===this.query.limitType&&r.size===this.query.limit?r.last():null,l="L"===this.query.limitType&&r.size===this.query.limit?r.first():null;if(e.inorderTraversal((e,t)=>{let u=r.get(e),h=n2(this.query,t)?t:null,c=!!u&&this.mutatedKeys.has(u.key),d=!!h&&(h.hasLocalMutations||this.mutatedKeys.has(h.key)&&h.hasCommittedMutations),f=!1;u&&h?u.data.isEqual(h.data)?c!==d&&(n.track({type:3,doc:h}),f=!0):this.su(u,h)||(n.track({type:2,doc:h}),f=!0,(o&&this.eu(h,o)>0||l&&0>this.eu(h,l))&&(a=!0)):!u&&h?(n.track({type:0,doc:h}),f=!0):u&&!h&&(n.track({type:1,doc:u}),f=!0,(o||l)&&(a=!0)),f&&(h?(s=s.add(h),i=d?i.add(e):i.delete(e)):(s=s.delete(e),i=i.delete(e)))}),null!==this.query.limit)for(;s.size>this.query.limit;){let e="F"===this.query.limitType?s.last():s.first();s=s.delete(e.key),i=i.delete(e.key),n.track({type:1,doc:e})}return{tu:s,iu:n,Cs:a,mutatedKeys:i}}su(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,n,r){let i=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;let s=e.iu.ya();s.sort((e,t)=>(function(e,t){let n=e=>{switch(e){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return S(20277,{Rt:e})}};return n(e)-n(t)})(e.type,t.type)||this.eu(e.doc,t.doc)),this.ou(n),r=r??!1;let a=t&&!r?this._u():[],o=0===this.Xa.size&&this.current&&!r?1:0,l=o!==this.Za;return(this.Za=o,0!==s.length||l)?{snapshot:new aV(this.query,e.tu,i,s,e.mutatedKeys,0===o,l,!1,!!n&&n.resumeToken.approximateByteSize()>0),au:a}:{au:a}}va(e){return this.current&&"Offline"===e?(this.current=!1,this.applyChanges({tu:this.tu,iu:new aR,mutatedKeys:this.mutatedKeys,Cs:!1},!1)):{au:[]}}uu(e){return!this.Ya.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(e=>this.Ya=this.Ya.add(e)),e.modifiedDocuments.forEach(e=>{}),e.removedDocuments.forEach(e=>this.Ya=this.Ya.delete(e)),this.current=e.current)}_u(){if(!this.current)return[];let e=this.Xa;this.Xa=rn(),this.tu.forEach(e=>{this.uu(e.key)&&(this.Xa=this.Xa.add(e.key))});let t=[];return e.forEach(e=>{this.Xa.has(e)||t.push(new aG(e))}),this.Xa.forEach(n=>{e.has(n)||t.push(new aK(n))}),t}cu(e){this.Ya=e.Qs,this.Xa=rn();let t=this.ru(e.documents);return this.applyChanges(t,!0)}lu(){return aV.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,0===this.Za,this.hasCachedResults)}}let aj="SyncEngine";class aQ{constructor(e,t,n){this.query=e,this.targetId=t,this.view=n}}class aW{constructor(e){this.key=e,this.hu=!1}}class aH{constructor(e,t,n,r,i,s){this.localStore=e,this.remoteStore=t,this.eventManager=n,this.sharedClientState=r,this.currentUser=i,this.maxConcurrentLimboResolutions=s,this.Pu={},this.Tu=new n4(e=>n0(e),nZ),this.Iu=new Map,this.Eu=new Set,this.du=new tk(H.comparator),this.Au=new Map,this.Ru=new sw,this.Vu={},this.mu=new Map,this.fu=i8.cr(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return!0===this.gu}}async function aY(e,t,n=!0){let r;let i=oo(e),s=i.Tu.get(t);return s?(i.sharedClientState.addLocalQueryTarget(s.targetId),r=s.view.lu()):r=await aJ(i,t,n,!0),r}async function aX(e,t){let n=oo(e);await aJ(n,t,!0,!1)}async function aJ(e,t,n,r){var i,s;let a;let o=await (i=e.localStore,s=nY(t),i.persistence.runTransaction("Allocate target","readwrite",e=>{let t;return i.Pi.getTargetData(e,s).next(n=>n?(t=n,ey.resolve(t)):i.Pi.allocateTargetId(e).next(n=>(t=new im(s,n,"TargetPurposeListen",e.currentSequenceNumber),i.Pi.addTargetData(e,t).next(()=>t))))}).then(e=>{let t=i.Ms.get(e.targetId);return(null===t||e.snapshotVersion.compareTo(t.snapshotVersion)>0)&&(i.Ms=i.Ms.insert(e.targetId,e),i.xs.set(s,e.targetId)),e})),l=o.targetId,u=e.sharedClientState.addLocalQueryTarget(l,n);return r&&(a=await aZ(e,t,l,"current"===u,o.resumeToken)),e.isPrimaryClient&&n&&as(e.remoteStore,o),a}async function aZ(e,t,n,r,i){e.pu=(t,n,r)=>(async function(e,t,n,r){let i=t.view.ru(n);i.Cs&&(i=await sB(e.localStore,t.query,!1).then(({documents:e})=>t.view.ru(e,i)));let s=r&&r.targetChanges.get(t.targetId),a=r&&null!=r.targetMismatches.get(t.targetId),o=t.view.applyChanges(i,e.isPrimaryClient,s,a);return on(e,t.targetId,o.au),o.snapshot})(e,t,n,r);let s=await sB(e.localStore,t,!0),a=new a$(t,s.Qs),o=a.ru(s.documents),l=rz.createSynthesizedTargetChangeForCurrentChange(n,r&&"Offline"!==e.onlineState,i),u=a.applyChanges(o,e.isPrimaryClient,l);on(e,n,u.au);let h=new aQ(t,n,a);return e.Tu.set(t,h),e.Iu.has(n)?e.Iu.get(n).push(t):e.Iu.set(n,[t]),u.snapshot}async function a0(e,t,n){let r=e.Tu.get(t),i=e.Iu.get(r.targetId);if(i.length>1)return e.Iu.set(r.targetId,i.filter(e=>!nZ(e,t))),void e.Tu.delete(t);e.isPrimaryClient?(e.sharedClientState.removeLocalQueryTarget(r.targetId),e.sharedClientState.isActiveQueryTarget(r.targetId)||await sq(e.localStore,r.targetId,!1).then(()=>{e.sharedClientState.clearQueryState(r.targetId),n&&aa(e.remoteStore,r.targetId),oe(e,r.targetId)}).catch(ep)):(oe(e,r.targetId),await sq(e.localStore,r.targetId,!0))}async function a1(e,t){let n=e.Tu.get(t),r=e.Iu.get(n.targetId);e.isPrimaryClient&&1===r.length&&(e.sharedClientState.removeLocalQueryTarget(n.targetId),aa(e.remoteStore,n.targetId))}async function a2(e,t,n){let r=ol(e);try{var i;let e;let s=await function(e,t){let n,r;let i=ei.now(),s=t.reduce((e,t)=>e.add(t.key),rn());return e.persistence.runTransaction("Locally write mutations","readwrite",a=>{let o=n6,l=rn();return e.Ns.getEntries(a,s).next(e=>{(o=e).forEach((e,t)=>{t.isValidDocument()||(l=l.add(e))})}).next(()=>e.localDocuments.getOverlayedDocuments(a,o)).next(r=>{n=r;let s=[];for(let e of t){let t=function(e,t){let n=null;for(let r of e.fieldTransforms){let e=t.data.field(r.field),i=ro(r.transform,e||null);null!=i&&(null===n&&(n=ng.empty()),n.set(r.field,i))}return n||null}(e,n.get(e.key).overlayedDocument);null!=t&&s.push(new rS(e.key,t,function e(t){let n=[];return tD(t.fields,(t,r)=>{let i=new W([t]);if(nl(r)){let t=e(r.mapValue).fields;if(0===t.length)n.push(i);else for(let e of t)n.push(i.child(e))}else n.push(i)}),new tF(n)}(t.value.mapValue),rw.exists(!0)))}return e.mutationQueue.addMutationBatch(a,i,s,t)}).next(t=>{r=t;let i=t.applyToLocalDocumentSet(n,l);return e.documentOverlayCache.saveOverlays(a,t.batchId,i)})}).then(()=>({batchId:r.batchId,changes:n9(n)}))}(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),i=s.batchId,(e=r.Vu[r.currentUser.toKey()])||(e=new tk(q)),e=e.insert(i,n),r.Vu[r.currentUser.toKey()]=e,await oi(r,s.changes),await aw(r.remoteStore)}catch(t){let e=aA(t,"Failed to persist write");n.reject(e)}}async function a5(e,t){try{let n=await function(e,t){let n=t.snapshotVersion,r=e.Ms;return e.persistence.runTransaction("Apply remote event","readwrite-primary",i=>{var s;let a,o;let l=e.Ns.newChangeBuffer({trackRemovals:!0});r=e.Ms;let u=[];t.targetChanges.forEach((s,a)=>{var o;let l=r.get(a);if(!l)return;u.push(e.Pi.removeMatchingKeys(i,s.removedDocuments,a).next(()=>e.Pi.addMatchingKeys(i,s.addedDocuments,a)));let h=l.withSequenceNumber(i.currentSequenceNumber);null!==t.targetMismatches.get(a)?h=h.withResumeToken(tU.EMPTY_BYTE_STRING,es.min()).withLastLimboFreeSnapshotVersion(es.min()):s.resumeToken.approximateByteSize()>0&&(h=h.withResumeToken(s.resumeToken,n)),r=r.insert(a,h),o=h,(0===l.resumeToken.approximateByteSize()||o.snapshotVersion.toMicroseconds()-l.snapshotVersion.toMicroseconds()>=3e8||s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size>0)&&u.push(e.Pi.updateTargetData(i,h))});let h=n6,c=rn();if(t.documentUpdates.forEach(n=>{t.resolvedLimboDocuments.has(n)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(i,n))}),u.push((s=t.documentUpdates,a=rn(),o=rn(),s.forEach(e=>a=a.add(e)),l.getEntries(i,a).next(e=>{let t=n6;return s.forEach((n,r)=>{let i=e.get(n);r.isFoundDocument()!==i.isFoundDocument()&&(o=o.add(n)),r.isNoDocument()&&r.version.isEqual(es.min())?(l.removeEntry(n,r.readTime),t=t.insert(n,r)):!i.isValidDocument()||r.version.compareTo(i.version)>0||0===r.version.compareTo(i.version)&&i.hasPendingWrites?(l.addEntry(r),t=t.insert(n,r)):T(sP,"Ignoring outdated watch update for ",n,". Current version:",i.version," Watch version:",r.version)}),{ks:t,qs:o}})).next(e=>{h=e.ks,c=e.qs})),!n.isEqual(es.min())){let t=e.Pi.getLastRemoteSnapshotVersion(i).next(t=>e.Pi.setTargetsMetadata(i,i.currentSequenceNumber,n));u.push(t)}return ey.waitFor(u).next(()=>l.apply(i)).next(()=>e.localDocuments.getLocalViewOfDocuments(i,h,c)).next(()=>h)}).then(t=>(e.Ms=r,t))}(e.localStore,t);t.targetChanges.forEach((t,n)=>{let r=e.Au.get(n);r&&(N(t.addedDocuments.size+t.modifiedDocuments.size+t.removedDocuments.size<=1,22616),t.addedDocuments.size>0?r.hu=!0:t.modifiedDocuments.size>0?N(r.hu,14607):t.removedDocuments.size>0&&(N(r.hu,42227),r.hu=!1))}),await oi(e,n,t)}catch(e){await ep(e)}}function a4(e,t,n){var r;if(e.isPrimaryClient&&0===n||!e.isPrimaryClient&&1===n){let n;let i=[];e.Tu.forEach((e,n)=>{let r=n.view.va(t);r.snapshot&&i.push(r.snapshot)}),(r=e.eventManager).onlineState=t,n=!1,r.queries.forEach((e,r)=>{for(let e of r.Sa)e.va(t)&&(n=!0)}),n&&aB(r),i.length&&e.Pu.H_(i),e.onlineState=t,e.isPrimaryClient&&e.sharedClientState.setOnlineState(t)}}async function a6(e,t,n){e.sharedClientState.updateQueryState(t,"rejected",n);let r=e.Au.get(t),i=r&&r.key;if(i){let n=new tk(H.comparator);n=n.insert(i,np.newNoDocument(i,es.min()));let r=rn().add(i),s=new rB(es.min(),new Map,new tk(q),n,r);await a5(e,s),e.du=e.du.remove(i),e.Au.delete(t),or(e)}else await sq(e.localStore,t,!1).then(()=>oe(e,t,n)).catch(ep)}async function a3(e,t){var n;let r=t.batch.batchId;try{let i=await (n=e.localStore).persistence.runTransaction("Acknowledge batch","readwrite-primary",e=>{let r=t.batch.keys(),i=n.Ns.newChangeBuffer({trackRemovals:!0});return(function(e,t,n,r){let i=n.batch,s=i.keys(),a=ey.resolve();return s.forEach(e=>{a=a.next(()=>r.getEntry(t,e)).next(t=>{let s=n.docVersions.get(e);N(null!==s,48541),0>t.version.compareTo(s)&&(i.applyToRemoteDocument(t,n),t.isValidDocument()&&(t.setReadTime(n.commitVersion),r.addEntry(t)))})}),a.next(()=>e.mutationQueue.removeMutationBatch(t,i))})(n,e,t,i).next(()=>i.apply(e)).next(()=>n.mutationQueue.performConsistencyCheck(e)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(e,r,t.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,function(e){let t=rn();for(let n=0;n<e.mutationResults.length;++n)e.mutationResults[n].transformResults.length>0&&(t=t.add(e.batch.mutations[n].key));return t}(t))).next(()=>n.localDocuments.getDocuments(e,r))});a7(e,r,null),a9(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await oi(e,i)}catch(e){await ep(e)}}async function a8(e,t,n){var r;try{let i=await (r=e.localStore).persistence.runTransaction("Reject batch","readwrite-primary",e=>{let n;return r.mutationQueue.lookupMutationBatch(e,t).next(t=>(N(null!==t,37113),n=t.keys(),r.mutationQueue.removeMutationBatch(e,t))).next(()=>r.mutationQueue.performConsistencyCheck(e)).next(()=>r.documentOverlayCache.removeOverlaysForBatchId(e,n,t)).next(()=>r.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(e,n)).next(()=>r.localDocuments.getDocuments(e,n))});a7(e,t,n),a9(e,t),e.sharedClientState.updateMutationState(t,"rejected",n),await oi(e,i)}catch(e){await ep(e)}}function a9(e,t){(e.mu.get(t)||[]).forEach(e=>{e.resolve()}),e.mu.delete(t)}function a7(e,t,n){let r=e.Vu[e.currentUser.toKey()];if(r){let i=r.get(t);i&&(n?i.reject(n):i.resolve(),r=r.remove(t)),e.Vu[e.currentUser.toKey()]=r}}function oe(e,t,n=null){for(let r of(e.sharedClientState.removeLocalQueryTarget(t),e.Iu.get(t)))e.Tu.delete(r),n&&e.Pu.yu(r,n);e.Iu.delete(t),e.isPrimaryClient&&e.Ru.jr(t).forEach(t=>{e.Ru.containsKey(t)||ot(e,t)})}function ot(e,t){e.Eu.delete(t.path.canonicalString());let n=e.du.get(t);null!==n&&(aa(e.remoteStore,n),e.du=e.du.remove(t),e.Au.delete(n),or(e))}function on(e,t,n){for(let r of n)r instanceof aK?(e.Ru.addReference(r.key,t),function(e,t){let n=t.key,r=n.path.canonicalString();e.du.get(n)||e.Eu.has(r)||(T(aj,"New document in limbo: "+n),e.Eu.add(r),or(e))}(e,r)):r instanceof aG?(T(aj,"Document no longer in limbo: "+r.key),e.Ru.removeReference(r.key,t),e.Ru.containsKey(r.key)||ot(e,r.key)):S(19791,{wu:r})}function or(e){for(;e.Eu.size>0&&e.du.size<e.maxConcurrentLimboResolutions;){let t=e.Eu.values().next().value;e.Eu.delete(t);let n=new H(j.fromString(t)),r=e.fu.next();e.Au.set(r,new aW(n)),e.du=e.du.insert(n,r),as(e.remoteStore,new im(nY(nj(n.path)),r,"TargetPurposeLimboResolution",eR.ce))}}async function oi(e,t,n){let r=[],i=[],s=[];e.Tu.isEmpty()||(e.Tu.forEach((a,o)=>{s.push(e.pu(o,t,n).then(t=>{if((t||n)&&e.isPrimaryClient){let r=t?!t.fromCache:n?.targetChanges.get(o.targetId)?.current;e.sharedClientState.updateQueryState(o.targetId,r?"current":"not-current")}if(t){r.push(t);let e=sV.As(o.targetId,t);i.push(e)}}))}),await Promise.all(s),e.Pu.H_(r),await async function(e,t){try{await e.persistence.runTransaction("notifyLocalViewChanges","readwrite",n=>ey.forEach(t,t=>ey.forEach(t.Es,r=>e.persistence.referenceDelegate.addReference(n,t.targetId,r)).next(()=>ey.forEach(t.ds,r=>e.persistence.referenceDelegate.removeReference(n,t.targetId,r)))))}catch(e){if(!eb(e))throw e;T(sP,"Failed to update sequence numbers: "+e)}for(let n of t){let t=n.targetId;if(!n.fromCache){let n=e.Ms.get(t),r=n.snapshotVersion,i=n.withLastLimboFreeSnapshotVersion(r);e.Ms=e.Ms.insert(t,i)}}}(e.localStore,i))}async function os(e,t){var n;if(!e.currentUser.isEqual(t)){T(aj,"User change. New user:",t.toKey());let r=await sL(e.localStore,t);e.currentUser=t,n="'waitForPendingWrites' promise is rejected due to a user change.",e.mu.forEach(e=>{e.forEach(e=>{e.reject(new D(C.CANCELLED,n))})}),e.mu.clear(),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await oi(e,r.Ls)}}function oa(e,t){let n=e.Au.get(t);if(n&&n.hu)return rn().add(n.key);{let n=rn(),r=e.Iu.get(t);if(!r)return n;for(let t of r){let r=e.Tu.get(t);n=n.unionWith(r.view.nu)}return n}}function oo(e){return e.remoteStore.remoteSyncer.applyRemoteEvent=a5.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=oa.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=a6.bind(null,e),e.Pu.H_=aU.bind(null,e.eventManager),e.Pu.yu=aq.bind(null,e.eventManager),e}function ol(e){return e.remoteStore.remoteSyncer.applySuccessfulWrite=a3.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=a8.bind(null,e),e}class ou{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=s2(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,t){return null}Mu(e,t){return null}vu(e){var t;return t=this.persistence,new sF(t,new sO,e.initialUser,this.serializer)}Cu(e){return new sb(sx.mi,this.serializer)}Du(e){return new sK}async terminate(){this.gcScheduler?.stop(),this.indexBackfillerScheduler?.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}ou.provider={build:()=>new ou};class oh extends ou{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,t){return N(this.persistence.referenceDelegate instanceof sN,46915),new sr(this.persistence.referenceDelegate.garbageCollector,e.asyncQueue,t)}Cu(e){let t=void 0!==this.cacheSizeBytes?i1.withCacheSize(this.cacheSizeBytes):i1.DEFAULT;return new sb(e=>sN.mi(e,t),this.serializer)}}class oc extends ou{constructor(e,t,n){super(),this.xu=e,this.cacheSizeBytes=t,this.forceOwnership=n,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.xu.initialize(this,e),await ol(this.xu.syncEngine),await aw(this.xu.remoteStore),await this.persistence.Ji(()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve()))}vu(e){var t;return t=this.persistence,new sF(t,new sO,e.initialUser,this.serializer)}Fu(e,t){return new sr(this.persistence.referenceDelegate.garbageCollector,e.asyncQueue,t)}Mu(e,t){let n=new ek(t,this.persistence);return new eA(e.asyncQueue,n)}Cu(e){var t,n;let r;let i=(t=e.databaseInfo.databaseId,n=e.databaseInfo.persistenceKey,r=t.projectId,t.isDefaultDatabase||(r+="."+t.database),"firestore/"+n+"/"+r+"/"),s=void 0!==this.cacheSizeBytes?i1.withCacheSize(this.cacheSizeBytes):i1.DEFAULT;return new sR(this.synchronizeTabs,i,e.clientId,s,e.asyncQueue,"undefined"!=typeof window?window:null,s1(),this.serializer,this.sharedClientState,!!this.forceOwnership)}Du(e){return new sK}}class od{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=e=>a4(this.syncEngine,e,1),this.remoteStore.remoteSyncer.handleCredentialChange=os.bind(null,this.syncEngine),await ax(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return new aO}createDatastore(e){let t=s2(e.databaseInfo.databaseId),n=new s0(e.databaseInfo);return new s7(e.authCredentials,e.appCheckCredentials,n,t)}createRemoteStore(e){var t;return t=this.localStore,new an(t,this.datastore,e.asyncQueue,e=>a4(this.syncEngine,e,0),sj.v()?new sj:new sG)}createSyncEngine(e,t){return function(e,t,n,r,i,s,a){let o=new aH(e,t,n,r,i,s);return a&&(o.gu=!0),o}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){await async function(e){T(at,"RemoteStore shutting down."),e.Ea.add(5),await ai(e),e.Aa.shutdown(),e.Ra.set("Unknown")}(this.remoteStore),this.datastore?.terminate(),this.eventManager?.terminate()}}od.provider={build:()=>new od};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class of{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):E("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,t){setTimeout(()=>{this.muted||e(t)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let om="FirestoreClient";class og{constructor(e,t,n,r,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=n,this.databaseInfo=r,this.user=y.UNAUTHENTICATED,this.clientId=U.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(n,async e=>{T(om,"Received user=",e.uid),await this.authCredentialListener(e),this.user=e}),this.appCheckCredentials.start(n,e=>(T(om,"Received new app check token=",e),this.appCheckCredentialListener(e,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this.databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();let e=new A;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){let t=aA(n,"Failed to shutdown persistence");e.reject(t)}}),e.promise}}async function op(e,t){e.asyncQueue.verifyOperationInProgress(),T(om,"Initializing OfflineComponentProvider");let n=e.configuration;await t.initialize(n);let r=n.initialUser;e.setCredentialChangeListener(async e=>{r.isEqual(e)||(await sL(t.localStore,e),r=e)}),t.persistence.setDatabaseDeletedListener(()=>e.terminate()),e._offlineComponents=t}async function oy(e,t){e.asyncQueue.verifyOperationInProgress();let n=await ow(e);T(om,"Initializing OnlineComponentProvider"),await t.initialize(n,e.configuration),e.setCredentialChangeListener(e=>aS(t.remoteStore,e)),e.setAppCheckTokenChangeListener((e,n)=>aS(t.remoteStore,n)),e._onlineComponents=t}async function ow(e){if(!e._offlineComponents){if(e._uninitializedComponentsProvider){T(om,"Using user provided OfflineComponentProvider");try{await op(e,e._uninitializedComponentsProvider._offline)}catch(t){if(!("FirebaseError"===t.name?t.code===C.FAILED_PRECONDITION||t.code===C.UNIMPLEMENTED:!("undefined"!=typeof DOMException&&t instanceof DOMException)||22===t.code||20===t.code||11===t.code))throw t;_("Error using user provided cache. Falling back to memory cache: "+t),await op(e,new ou)}}else T(om,"Using default OfflineComponentProvider"),await op(e,new oh(void 0))}return e._offlineComponents}async function ov(e){return e._onlineComponents||(e._uninitializedComponentsProvider?(T(om,"Using user provided OnlineComponentProvider"),await oy(e,e._uninitializedComponentsProvider._online)):(T(om,"Using default OnlineComponentProvider"),await oy(e,new od))),e._onlineComponents}async function oI(e){let t=await ov(e),n=t.eventManager;return n.onListen=aY.bind(null,t.syncEngine),n.onUnlisten=a0.bind(null,t.syncEngine),n.onFirstRemoteStoreListen=aX.bind(null,t.syncEngine),n.onLastRemoteStoreUnlisten=a1.bind(null,t.syncEngine),n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oT(e){let t={};return void 0!==e.timeoutSeconds&&(t.timeoutSeconds=e.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oE=new Map,o_="firestore.googleapis.com";class ob{constructor(e){if(void 0===e.host){if(void 0!==e.ssl)throw new D(C.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=o_,this.ssl=!0}else this.host=e.host,this.ssl=e.ssl??!0;if(this.isUsingEmulator=void 0!==e.emulatorOptions,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,void 0===e.cacheSizeBytes)this.cacheSizeBytes=41943040;else{if(-1!==e.cacheSizeBytes&&e.cacheSizeBytes<1048576)throw new D(C.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}(function(e,t,n,r){if(!0===t&&!0===r)throw new D(C.INVALID_ARGUMENT,`${e} and ${n} cannot be used together.`)})("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:void 0===e.experimentalAutoDetectLongPolling?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=oT(e.experimentalLongPollingOptions??{}),function(e){if(void 0!==e.timeoutSeconds){if(isNaN(e.timeoutSeconds))throw new D(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (must not be NaN)`);if(e.timeoutSeconds<5)throw new D(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (minimum allowed value is 5)`);if(e.timeoutSeconds>30)throw new D(C.INVALID_ARGUMENT,`invalid long polling timeout: ${e.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){var t,n;return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(t=this.experimentalLongPollingOptions,n=e.experimentalLongPollingOptions,t.timeoutSeconds===n.timeoutSeconds)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class oS{constructor(e,t,n,r){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=n,this._app=r,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new ob({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(C.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return"notTerminated"!==this._terminateTask}_setSettings(e){if(this._settingsFrozen)throw new D(C.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new ob(e),this._emulatorOptions=e.emulatorOptions||{},void 0!==e.credentials&&(this._authCredentials=function(e){if(!e)return new R;switch(e.type){case"firstParty":return new P(e.sessionIndex||"0",e.iamToken||null,e.authTokenFactory||null);case"provider":return e.client;default:throw new D(C.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return"notTerminated"===this._terminateTask&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){"notTerminated"===this._terminateTask?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(e){let t=oE.get(e);t&&(T("ComponentProvider","Removing Datastore"),oE.delete(e),t.terminate())}(this),Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ox{constructor(e,t,n){this.converter=t,this._query=n,this.type="query",this.firestore=e}withConverter(e){return new ox(this.firestore,e,this._query)}}class oN{constructor(e,t,n){this.converter=t,this._key=n,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new oC(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new oN(this.firestore,e,this._key)}toJSON(){return{type:oN._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,n){if(er(t,oN._jsonSchema))return new oN(e,n||null,new H(j.fromString(t.referencePath)))}}oN._jsonSchemaVersion="firestore/documentReference/1.0",oN._jsonSchema={type:en("string",oN._jsonSchemaVersion),referencePath:en("string")};class oC extends ox{constructor(e,t,n){super(e,t,nj(n)),this._path=n,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){let e=this._path.popLast();return e.isEmpty()?null:new oN(this.firestore,null,new H(e))}withConverter(e){return new oC(this.firestore,e,this._path)}}function oD(e,t,...n){if(e=(0,h.m9)(e),Y("collection","path",t),e instanceof oS){let r=j.fromString(t,...n);return J(r),new oC(e,null,r)}{if(!(e instanceof oN||e instanceof oC))throw new D(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(j.fromString(t,...n));return J(r),new oC(e.firestore,null,r)}}function oA(e,t,...n){if(e=(0,h.m9)(e),1==arguments.length&&(t=U.newId()),Y("doc","path",t),e instanceof oS){let r=j.fromString(t,...n);return X(r),new oN(e,null,new H(r))}{if(!(e instanceof oN||e instanceof oC))throw new D(C.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");let r=e._path.child(j.fromString(t,...n));return X(r),new oN(e.firestore,e instanceof oC?e.converter:null,new H(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ok="AsyncQueue";class oR{constructor(e=Promise.resolve()){this.Xu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new s5(this,"async_queue_retry"),this._c=()=>{let e=s1();e&&T(ok,"Visibility state changed to "+e.visibilityState),this.M_.w_()},this.ac=e;let t=s1();t&&"function"==typeof t.addEventListener&&t.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;let t=s1();t&&"function"==typeof t.removeEventListener&&t.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});let t=new A;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise)).then(()=>t.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Xu.push(e),this.lc()))}async lc(){if(0!==this.Xu.length){try{await this.Xu[0](),this.Xu.shift(),this.M_.reset()}catch(e){if(!eb(e))throw e;T(ok,"Operation failed with retryable error: "+e)}this.Xu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){let t=this.ac.then(()=>(this.rc=!0,e().catch(e=>{throw this.nc=e,this.rc=!1,E("INTERNAL UNHANDLED ERROR: ",oV(e)),e}).then(e=>(this.rc=!1,e))));return this.ac=t,t}enqueueAfterDelay(e,t,n){this.uc(),this.oc.indexOf(e)>-1&&(t=0);let r=aD.createAndSchedule(this,e,t,n,e=>this.hc(e));return this.tc.push(r),r}uc(){this.nc&&S(47125,{Pc:oV(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ic(e){for(let t of this.tc)if(t.timerId===e)return!0;return!1}Ec(e){return this.Tc().then(()=>{for(let t of(this.tc.sort((e,t)=>e.targetTimeMs-t.targetTimeMs),this.tc))if(t.skipDelay(),"all"!==e&&t.timerId===e)break;return this.Tc()})}dc(e){this.oc.push(e)}hc(e){let t=this.tc.indexOf(e);this.tc.splice(t,1)}}function oV(e){let t=e.message||"";return e.stack&&(t=e.stack.includes(e.message)?e.stack:e.message+"\n"+e.stack),t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oM(e){return function(e,t){if("object"!=typeof e||null===e)return!1;for(let n of t)if(n in e&&"function"==typeof e[n])return!0;return!1}(e,["next","error","complete"])}class oO extends oS{constructor(e,t,n,r){super(e,t,n,r),this.type="firestore",this._queue=new oR,this._persistenceKey=r?.name||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){let e=this._firestoreClient.terminate();this._queue=new oR(e),this._firestoreClient=void 0,await e}}}function oP(e,t){let n="object"==typeof e?e:(0,o.Mq)(),r=(0,o.qX)(n,"firestore").getImmediate({identifier:"string"==typeof e?e:t||tJ});if(!r._initialized){let e=(0,h.P0)("firestore");e&&function(e,t,n,r={}){e=et(e,oS);let i=(0,h.Xx)(t),s=e._getSettings(),a={...s,emulatorOptions:e._getEmulatorOptions()},o=`${t}:${n}`;i&&((0,h.Uo)(`https://${o}`),(0,h.dp)("Firestore",!0)),s.host!==o_&&s.host!==o&&_("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");let l={...s,host:o,ssl:i,emulatorOptions:r};if(!(0,h.vZ)(l,a)&&(e._setSettings(l),r.mockUserToken)){let t,n;if("string"==typeof r.mockUserToken)t=r.mockUserToken,n=y.MOCK_USER;else{t=(0,h.Sg)(r.mockUserToken,e._app?.options.projectId);let i=r.mockUserToken.sub||r.mockUserToken.user_id;if(!i)throw new D(C.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");n=new y(i)}e._authCredentials=new V(new k(t,n))}}(r,...e)}return r}function oF(e){if(e._terminated)throw new D(C.FAILED_PRECONDITION,"The client has already been terminated.");return e._firestoreClient||oL(e),e._firestoreClient}function oL(e){var t;let n=e._freezeSettings(),r=(t=e._databaseId,new tX(t,e._app?.options.appId||"",e._persistenceKey,n.host,n.ssl,n.experimentalForceLongPolling,n.experimentalAutoDetectLongPolling,oT(n.experimentalLongPollingOptions),n.useFetchStreams,n.isUsingEmulator));e._componentsProvider||n.localCache?._offlineComponentProvider&&n.localCache?._onlineComponentProvider&&(e._componentsProvider={_offline:n.localCache._offlineComponentProvider,_online:n.localCache._onlineComponentProvider}),e._firestoreClient=new og(e._authCredentials,e._appCheckCredentials,e._queue,r,e._componentsProvider&&function(e){let t=e?._online.build();return{_offline:e?._offline.build(t),_online:t}}(e._componentsProvider))}function oU(e,t){_("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");let n=e._freezeSettings();return function(e,t,n){if((e=et(e,oO))._firestoreClient||e._terminated)throw new D(C.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(e._componentsProvider||e._getSettings().localCache)throw new D(C.FAILED_PRECONDITION,"SDK cache is already specified.");e._componentsProvider={_online:t,_offline:n},oL(e)}(e,od.provider,{build:e=>new oc(e,n.cacheSizeBytes,t?.forceOwnership)}),Promise.resolve()}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oq{constructor(e){this._byteString=e}static fromBase64String(e){try{return new oq(tU.fromBase64String(e))}catch(e){throw new D(C.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(e){return new oq(tU.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:oq._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(er(e,oq._jsonSchema))return oq.fromBase64String(e.bytes)}}oq._jsonSchemaVersion="firestore/bytes/1.0",oq._jsonSchema={type:en("string",oq._jsonSchemaVersion),bytes:en("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oB{constructor(...e){for(let t=0;t<e.length;++t)if(0===e[t].length)throw new D(C.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new W(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oz{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oK{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new D(C.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new D(C.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return q(this._lat,e._lat)||q(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:oK._jsonSchemaVersion}}static fromJSON(e){if(er(e,oK._jsonSchema))return new oK(e.latitude,e.longitude)}}oK._jsonSchemaVersion="firestore/geoPoint/1.0",oK._jsonSchema={type:en("string",oK._jsonSchemaVersion),latitude:en("number"),longitude:en("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oG{constructor(e){this._values=(e||[]).map(e=>e)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(e,t){if(e.length!==t.length)return!1;for(let n=0;n<e.length;++n)if(e[n]!==t[n])return!1;return!0}(this._values,e._values)}toJSON(){return{type:oG._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(er(e,oG._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(e=>"number"==typeof e))return new oG(e.vectorValues);throw new D(C.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}oG._jsonSchemaVersion="firestore/vectorValue/1.0",oG._jsonSchema={type:en("string",oG._jsonSchemaVersion),vectorValues:en("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let o$=/^__.*__$/;class oj{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return null!==this.fieldMask?new rS(e,this.data,this.fieldMask,t,this.fieldTransforms):new rb(e,this.data,t,this.fieldTransforms)}}class oQ{constructor(e,t,n){this.data=e,this.fieldMask=t,this.fieldTransforms=n}toMutation(e,t){return new rS(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function oW(e){switch(e){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw S(40011,{Ac:e})}}class oH{constructor(e,t,n,r,i,s){this.settings=e,this.databaseId=t,this.serializer=n,this.ignoreUndefinedProperties=r,void 0===i&&this.Rc(),this.fieldTransforms=i||[],this.fieldMask=s||[]}get path(){return this.settings.path}get Ac(){return this.settings.Ac}Vc(e){return new oH({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}mc(e){let t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.gc(e),n}yc(e){let t=this.path?.child(e),n=this.Vc({path:t,fc:!1});return n.Rc(),n}wc(e){return this.Vc({path:void 0,fc:!0})}Sc(e){return lr(e,this.settings.methodName,this.settings.bc||!1,this.path,this.settings.Dc)}contains(e){return void 0!==this.fieldMask.find(t=>e.isPrefixOf(t))||void 0!==this.fieldTransforms.find(t=>e.isPrefixOf(t.field))}Rc(){if(this.path)for(let e=0;e<this.path.length;e++)this.gc(this.path.get(e))}gc(e){if(0===e.length)throw this.Sc("Document fields must not be empty");if(oW(this.Ac)&&o$.test(e))throw this.Sc('Document fields cannot begin and end with "__"')}}class oY{constructor(e,t,n){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=n||s2(e)}Cc(e,t,n,r=!1){return new oH({Ac:e,methodName:t,Dc:n,path:W.emptyPath(),fc:!1,bc:r},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function oX(e){let t=e._freezeSettings(),n=s2(e._databaseId);return new oY(e._databaseId,!!t.ignoreUndefinedProperties,n)}function oJ(e,t,n,r,i,s={}){let a,o;let l=e.Cc(s.merge||s.mergeFields?2:0,t,n,i);o7("Data must be an object, but it was:",l,r);let u=o8(r,l);if(s.merge)a=new tF(l.fieldMask),o=l.fieldTransforms;else if(s.mergeFields){let e=[];for(let r of s.mergeFields){let i=le(t,r,n);if(!l.contains(i))throw new D(C.INVALID_ARGUMENT,`Field '${i}' is specified in your field mask but missing from your input data.`);li(e,i)||e.push(i)}a=new tF(e),o=l.fieldTransforms.filter(e=>a.covers(e.field))}else a=null,o=l.fieldTransforms;return new oj(new ng(u),a,o)}class oZ extends oz{_toFieldTransform(e){if(2!==e.Ac)throw 1===e.Ac?e.Sc(`${this._methodName}() can only appear at the top level of your update data`):e.Sc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof oZ}}function o0(e,t,n){return new oH({Ac:3,Dc:t.settings.Dc,methodName:e._methodName,fc:n},t.databaseId,t.serializer,t.ignoreUndefinedProperties)}class o1 extends oz{_toFieldTransform(e){return new rp(e.path,new rl)}isEqual(e){return e instanceof o1}}class o2 extends oz{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){let t=o0(this,e,!0),n=new ru(this.vc.map(e=>o3(e,t)));return new rp(e.path,n)}isEqual(e){return e instanceof o2&&(0,h.vZ)(this.vc,e.vc)}}class o5 extends oz{constructor(e,t){super(e),this.vc=t}_toFieldTransform(e){let t=o0(this,e,!0),n=new rc(this.vc.map(e=>o3(e,t)));return new rp(e.path,n)}isEqual(e){return e instanceof o5&&(0,h.vZ)(this.vc,e.vc)}}function o4(e,t,n,r){let i=e.Cc(1,t,n);o7("Data must be an object, but it was:",i,r);let s=[],a=ng.empty();return tD(r,(e,r)=>{let o=ln(t,e,n);r=(0,h.m9)(r);let l=i.yc(o);if(r instanceof oZ)s.push(o);else{let e=o3(r,l);null!=e&&(s.push(o),a.set(o,e))}}),new oQ(a,new tF(s),i.fieldTransforms)}function o6(e,t,n,r,i,s){let a=e.Cc(1,t,n),o=[le(t,r,n)],l=[i];if(s.length%2!=0)throw new D(C.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let e=0;e<s.length;e+=2)o.push(le(t,s[e])),l.push(s[e+1]);let u=[],c=ng.empty();for(let e=o.length-1;e>=0;--e)if(!li(u,o[e])){let t=o[e],n=l[e];n=(0,h.m9)(n);let r=a.yc(t);if(n instanceof oZ)u.push(t);else{let e=o3(n,r);null!=e&&(u.push(t),c.set(t,e))}}return new oQ(c,new tF(u),a.fieldTransforms)}function o3(e,t){if(o9(e=(0,h.m9)(e)))return o7("Unsupported field value:",t,e),o8(e,t);if(e instanceof oz)return function(e,t){if(!oW(t.Ac))throw t.Sc(`${e._methodName}() can only be used with update() and set()`);if(!t.path)throw t.Sc(`${e._methodName}() is not currently supported inside arrays`);let n=e._toFieldTransform(t);n&&t.fieldTransforms.push(n)}(e,t),null;if(void 0===e&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),e instanceof Array){if(t.settings.fc&&4!==t.Ac)throw t.Sc("Nested arrays are not supported");return function(e,t){let n=[],r=0;for(let i of e){let e=o3(i,t.wc(r));null==e&&(e={nullValue:"NULL_VALUE"}),n.push(e),r++}return{arrayValue:{values:n}}}(e,t)}return function(e,t){var n,r,i;if(null===(e=(0,h.m9)(e)))return{nullValue:"NULL_VALUE"};if("number"==typeof e)return n=t.serializer,"number"==typeof(i=r=e)&&Number.isInteger(i)&&!eV(i)&&i<=Number.MAX_SAFE_INTEGER&&i>=Number.MIN_SAFE_INTEGER?rs(r):ri(n,r);if("boolean"==typeof e)return{booleanValue:e};if("string"==typeof e)return{stringValue:e};if(e instanceof Date){let n=ei.fromDate(e);return{timestampValue:r1(t.serializer,n)}}if(e instanceof ei){let n=new ei(e.seconds,1e3*Math.floor(e.nanoseconds/1e3));return{timestampValue:r1(t.serializer,n)}}if(e instanceof oK)return{geoPointValue:{latitude:e.latitude,longitude:e.longitude}};if(e instanceof oq)return{bytesValue:r2(t.serializer,e._byteString)};if(e instanceof oN){let n=t.databaseId,r=e.firestore._databaseId;if(!r.isEqual(n))throw t.Sc(`Document reference is for database ${r.projectId}/${r.database} but should be for database ${n.projectId}/${n.database}`);return{referenceValue:r4(e.firestore._databaseId||t.databaseId,e._key.path)}}if(e instanceof oG)return{mapValue:{fields:{[t0]:{stringValue:t5},[t4]:{arrayValue:{values:e.toArray().map(e=>{if("number"!=typeof e)throw t.Sc("VectorValues must only contain numeric values.");return ri(t.serializer,e)})}}}}};throw t.Sc(`Unsupported field value: ${ee(e)}`)}(e,t)}function o8(e,t){let n={};return tA(e)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):tD(e,(e,r)=>{let i=o3(r,t.mc(e));null!=i&&(n[e]=i)}),{mapValue:{fields:n}}}function o9(e){return!("object"!=typeof e||null===e||e instanceof Array||e instanceof Date||e instanceof ei||e instanceof oK||e instanceof oq||e instanceof oN||e instanceof oz||e instanceof oG)}function o7(e,t,n){if(!o9(n)||!Z(n)){let r=ee(n);throw"an object"===r?t.Sc(e+" a custom object"):t.Sc(e+" "+r)}}function le(e,t,n){if((t=(0,h.m9)(t))instanceof oB)return t._internalPath;if("string"==typeof t)return ln(e,t);throw lr("Field path arguments must be of type string or ",e,!1,void 0,n)}let lt=RegExp("[~\\*/\\[\\]]");function ln(e,t,n){if(t.search(lt)>=0)throw lr(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,e,!1,void 0,n);try{return new oB(...t.split("."))._internalPath}catch(r){throw lr(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,e,!1,void 0,n)}}function lr(e,t,n,r,i){let s=r&&!r.isEmpty(),a=void 0!==i,o=`Function ${t}() called with invalid data`;n&&(o+=" (via `toFirestore()`)"),o+=". ";let l="";return(s||a)&&(l+=" (found",s&&(l+=` in field ${r}`),a&&(l+=` in document ${i}`),l+=")"),new D(C.INVALID_ARGUMENT,o+e+l)}function li(e,t){return e.some(e=>e.isEqual(t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ls{constructor(e,t,n,r,i){this._firestore=e,this._userDataWriter=t,this._key=n,this._document=r,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new oN(this._firestore,this._converter,this._key)}exists(){return null!==this._document}data(){if(this._document){if(this._converter){let e=new la(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}get(e){if(this._document){let t=this._document.data.field(lo("DocumentSnapshot.get",e));if(null!==t)return this._userDataWriter.convertValue(t)}}}class la extends ls{data(){return super.data()}}function lo(e,t){return"string"==typeof t?ln(e,t):t instanceof oB?t._internalPath:t._delegate._internalPath}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ll(e){if("L"===e.limitType&&0===e.explicitOrderBy.length)throw new D(C.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class lu{}class lh extends lu{}function lc(e,t,...n){let r=[];for(let i of(t instanceof lu&&r.push(t),function(e){let t=e.filter(e=>e instanceof lm).length,n=e.filter(e=>e instanceof ld).length;if(t>1||t>0&&n>0)throw new D(C.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r=r.concat(n)),r))e=i._apply(e);return e}class ld extends lh{constructor(e,t,n){super(),this._field=e,this._op=t,this._value=n,this.type="where"}static _create(e,t,n){return new ld(e,t,n)}_apply(e){let t=this._parse(e);return lv(e._query,t),new ox(e.firestore,e.converter,nX(e._query,t))}_parse(e){let t=oX(e.firestore);return function(e,t,n,r,i,s,a){let o;if(i.isKeyField()){if("array-contains"===s||"array-contains-any"===s)throw new D(C.INVALID_ARGUMENT,`Invalid Query. You can't perform '${s}' queries on documentId().`);if("in"===s||"not-in"===s){lw(a,s);let t=[];for(let n of a)t.push(ly(r,e,n));o={arrayValue:{values:t}}}else o=ly(r,e,a)}else"in"!==s&&"not-in"!==s&&"array-contains-any"!==s||lw(a,s),o=function(e,t,n,r=!1){return o3(n,e.Cc(r?4:3,t))}(n,t,a,"in"===s||"not-in"===s);return nE.create(i,s,o)}(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function lf(e,t,n){let r=lo("where",e);return ld._create(r,t,n)}class lm extends lu{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new lm(e,t)}_parse(e){let t=this._queryConstraints.map(t=>t._parse(e)).filter(e=>e.getFilters().length>0);return 1===t.length?t[0]:n_.create(t,this._getOperator())}_apply(e){let t=this._parse(e);return 0===t.getFilters().length?e:(function(e,t){let n=e;for(let e of t.getFlattenedFilters())lv(n,e),n=nX(n,e)}(e._query,t),new ox(e.firestore,e.converter,nX(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return"and"===this.type?"and":"or"}}class lg extends lh{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new lg(e,t)}_apply(e){let t=function(e,t,n){if(null!==e.startAt)throw new D(C.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(null!==e.endAt)throw new D(C.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new nI(t,n)}(e._query,this._field,this._direction);return new ox(e.firestore,e.converter,function(e,t){let n=e.explicitOrderBy.concat([t]);return new n$(e.path,e.collectionGroup,n,e.filters.slice(),e.limit,e.limitType,e.startAt,e.endAt)}(e._query,t))}}function lp(e,t="asc"){let n=lo("orderBy",e);return lg._create(n,t)}function ly(e,t,n){if("string"==typeof(n=(0,h.m9)(n))){if(""===n)throw new D(C.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!nW(t)&&-1!==n.indexOf("/"))throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);let r=t.path.child(j.fromString(n));if(!H.isDocumentKey(r))throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return nr(e,new H(r))}if(n instanceof oN)return nr(e,n._key);throw new D(C.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${ee(n)}.`)}function lw(e,t){if(!Array.isArray(e)||0===e.length)throw new D(C.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function lv(e,t){let n=function(e,t){for(let n of e)for(let e of n.getFlattenedFilters())if(t.indexOf(e.op)>=0)return e.op;return null}(e.filters,function(e){switch(e){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(t.op));if(null!==n)throw n===t.op?new D(C.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new D(C.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${n.toString()}' filters.`)}class lI{convertValue(e,t="none"){switch(t3(e)){case 0:return null;case 1:return e.booleanValue;case 2:return tz(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(tK(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw S(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){let n={};return tD(e,(e,r)=>{n[e]=this.convertValue(r,t)}),n}convertVectorValue(e){return new oG(e.fields?.[t4].arrayValue?.values?.map(e=>tz(e.doubleValue)))}convertGeoPoint(e){return new oK(tz(e.latitude),tz(e.longitude))}convertArray(e,t){return(e.values||[]).map(e=>this.convertValue(e,t))}convertServerTimestamp(e,t){switch(t){case"previous":let n=tH(e);return null==n?null:this.convertValue(n,t);case"estimate":return this.convertTimestamp(tY(e));default:return null}}convertTimestamp(e){let t=tB(e);return new ei(t.seconds,t.nanos)}convertDocumentKey(e,t){let n=j.fromString(e);N(id(n),9688,{name:e});let r=new tZ(n.get(1),n.get(3)),i=new H(n.popFirst(5));return r.isEqual(t)||E(`Document ${i} contains a document reference within a different database (${r.projectId}/${r.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lT(e,t,n){return e?n&&(n.merge||n.mergeFields)?e.toFirestore(t,n):e.toFirestore(t):t}class lE{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class l_ extends ls{constructor(e,t,n,r,i,s){super(e,t,n,r,s),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){let t=new lb(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){let n=this._document.data.field(lo("DocumentSnapshot.get",e));if(null!==n)return this._userDataWriter.convertValue(n,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(C.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e=this._document,t={};return t.type=l_._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),e&&e.isValidDocument()&&e.isFoundDocument()&&(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED")),t}}l_._jsonSchemaVersion="firestore/documentSnapshot/1.0",l_._jsonSchema={type:en("string",l_._jsonSchemaVersion),bundleSource:en("string","DocumentSnapshot"),bundleName:en("string"),bundle:en("string")};class lb extends l_{data(e={}){return super.data(e)}}class lS{constructor(e,t,n,r){this._firestore=e,this._userDataWriter=t,this._snapshot=r,this.metadata=new lE(r.hasPendingWrites,r.fromCache),this.query=n}get docs(){let e=[];return this.forEach(t=>e.push(t)),e}get size(){return this._snapshot.docs.size}get empty(){return 0===this.size}forEach(e,t){this._snapshot.docs.forEach(n=>{e.call(t,new lb(this._firestore,this._userDataWriter,n.key,n,new lE(this._snapshot.mutatedKeys.has(n.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){let t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new D(C.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=function(e,t){if(e._snapshot.oldDocs.isEmpty()){let t=0;return e._snapshot.docChanges.map(n=>{let r=new lb(e._firestore,e._userDataWriter,n.doc.key,n.doc,new lE(e._snapshot.mutatedKeys.has(n.doc.key),e._snapshot.fromCache),e.query.converter);return n.doc,{type:"added",doc:r,oldIndex:-1,newIndex:t++}})}{let n=e._snapshot.oldDocs;return e._snapshot.docChanges.filter(e=>t||3!==e.type).map(t=>{let r=new lb(e._firestore,e._userDataWriter,t.doc.key,t.doc,new lE(e._snapshot.mutatedKeys.has(t.doc.key),e._snapshot.fromCache),e.query.converter),i=-1,s=-1;return 0!==t.type&&(i=n.indexOf(t.doc.key),n=n.delete(t.doc.key)),1!==t.type&&(s=(n=n.add(t.doc)).indexOf(t.doc.key)),{type:function(e){switch(e){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return S(61501,{type:e})}}(t.type),doc:r,oldIndex:i,newIndex:s}})}}(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(C.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");let e={};e.type=lS._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=U.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;let t=[],n=[],r=[];return this.docs.forEach(e=>{null!==e._document&&(t.push(e._document),n.push(this._userDataWriter.convertObjectMap(e._document.data.value.mapValue.fields,"previous")),r.push(e.ref.path))}),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lx(e){e=et(e,oN);let t=et(e.firestore,oO);return(function(e,t,n={}){let r=new A;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,n,r,i){let s=new of({next:o=>{s.Nu(),t.enqueueAndForget(()=>aL(e,a));let l=o.docs.has(n);!l&&o.fromCache?i.reject(new D(C.UNAVAILABLE,"Failed to get document because the client is offline.")):l&&o.fromCache&&r&&"server"===r.source?i.reject(new D(C.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):i.resolve(o)},error:e=>i.reject(e)}),a=new az(nj(n.path),s,{includeMetadataChanges:!0,qa:!0});return aF(e,a)})(await oI(e),e.asyncQueue,t,n,r)),r.promise})(oF(t),e._key).then(n=>lO(t,e,n))}lS._jsonSchemaVersion="firestore/querySnapshot/1.0",lS._jsonSchema={type:en("string",lS._jsonSchemaVersion),bundleSource:en("string","QuerySnapshot"),bundleName:en("string"),bundle:en("string")};class lN extends lI{constructor(e){super(),this.firestore=e}convertBytes(e){return new oq(e)}convertReference(e){let t=this.convertDocumentKey(e,this.firestore._databaseId);return new oN(this.firestore,null,t)}}function lC(e){e=et(e,ox);let t=et(e.firestore,oO),n=oF(t),r=new lN(t);return ll(e._query),(function(e,t,n={}){let r=new A;return e.asyncQueue.enqueueAndForget(async()=>(function(e,t,n,r,i){let s=new of({next:n=>{s.Nu(),t.enqueueAndForget(()=>aL(e,a)),n.fromCache&&"server"===r.source?i.reject(new D(C.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):i.resolve(n)},error:e=>i.reject(e)}),a=new az(n,s,{includeMetadataChanges:!0,qa:!0});return aF(e,a)})(await oI(e),e.asyncQueue,t,n,r)),r.promise})(n,e._query).then(n=>new lS(t,r,e,n))}function lD(e,t,n){e=et(e,oN);let r=et(e.firestore,oO),i=lT(e.converter,t,n);return lM(r,[oJ(oX(r),"setDoc",e._key,i,null!==e.converter,n).toMutation(e._key,rw.none())])}function lA(e,t,n,...r){e=et(e,oN);let i=et(e.firestore,oO),s=oX(i);return lM(i,[("string"==typeof(t=(0,h.m9)(t))||t instanceof oB?o6(s,"updateDoc",e._key,t,n,r):o4(s,"updateDoc",e._key,t)).toMutation(e._key,rw.exists(!0))])}function lk(e){return lM(et(e.firestore,oO),[new rD(e._key,rw.none())])}function lR(e,t){let n=et(e.firestore,oO),r=oA(e),i=lT(e.converter,t);return lM(n,[oJ(oX(e.firestore),"addDoc",r._key,i,null!==e.converter,{}).toMutation(r._key,rw.exists(!1))]).then(()=>r)}function lV(e,...t){let n,r,i;e=(0,h.m9)(e);let s={includeMetadataChanges:!1,source:"default"},a=0;"object"!=typeof t[0]||oM(t[a])||(s=t[a++]);let o={includeMetadataChanges:s.includeMetadataChanges,source:s.source};if(oM(t[a])){let e=t[a];t[a]=e.next?.bind(e),t[a+1]=e.error?.bind(e),t[a+2]=e.complete?.bind(e)}if(e instanceof oN)r=et(e.firestore,oO),i=nj(e._key.path),n={next:n=>{t[a]&&t[a](lO(r,e,n))},error:t[a+1],complete:t[a+2]};else{let s=et(e,ox);r=et(s.firestore,oO),i=s._query;let o=new lN(r);n={next:e=>{t[a]&&t[a](new lS(r,o,s,e))},error:t[a+1],complete:t[a+2]},ll(e._query)}return function(e,t,n,r){let i=new of(r),s=new az(t,i,n);return e.asyncQueue.enqueueAndForget(async()=>aF(await oI(e),s)),()=>{i.Nu(),e.asyncQueue.enqueueAndForget(async()=>aL(await oI(e),s))}}(oF(r),i,o,n)}function lM(e,t){return function(e,t){let n=new A;return e.asyncQueue.enqueueAndForget(async()=>a2(await ov(e).then(e=>e.syncEngine),t,n)),n.promise}(oF(e),t)}function lO(e,t,n){let r=n.docs.get(t._key),i=new lN(e);return new l_(e,i,t._key,r,new lE(n.hasPendingWrites,n.fromCache),t.converter)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lP{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=oX(e)}set(e,t,n){this._verifyNotCommitted();let r=lF(e,this._firestore),i=lT(r.converter,t,n),s=oJ(this._dataReader,"WriteBatch.set",r._key,i,null!==r.converter,n);return this._mutations.push(s.toMutation(r._key,rw.none())),this}update(e,t,n,...r){let i;this._verifyNotCommitted();let s=lF(e,this._firestore);return i="string"==typeof(t=(0,h.m9)(t))||t instanceof oB?o6(this._dataReader,"WriteBatch.update",s._key,t,n,r):o4(this._dataReader,"WriteBatch.update",s._key,t),this._mutations.push(i.toMutation(s._key,rw.exists(!0))),this}delete(e){this._verifyNotCommitted();let t=lF(e,this._firestore);return this._mutations=this._mutations.concat(new rD(t._key,rw.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new D(C.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function lF(e,t){if((e=(0,h.m9)(e)).firestore!==t)throw new D(C.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return e}function lL(){return new o1("serverTimestamp")}function lU(...e){return new o2("arrayUnion",e)}function lq(...e){return new o5("arrayRemove",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lB(e){return oF(e=et(e,oO)),new lP(e,t=>lM(e,t))}new WeakMap,function(e=!0){w=o.Jn,(0,o.Xd)(new l.wA("firestore",(t,{instanceIdentifier:n,options:r})=>{let i=t.getProvider("app").getImmediate(),s=new oO(new M(t.getProvider("auth-internal")),new L(i,t.getProvider("app-check-internal")),function(e,t){if(!Object.prototype.hasOwnProperty.apply(e.options,["projectId"]))throw new D(C.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new tZ(e.options.projectId,t)}(i,n),i);return r={useFetchStreams:e,...r},s._setSettings(r),s},"PUBLIC").setMultipleInstances(!0)),(0,o.KN)(g,p,void 0),(0,o.KN)(g,p,"esm2020")}()}}]);