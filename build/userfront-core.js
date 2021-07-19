function e(e){return e&&"object"==typeof e&&"default"in e?e.default:e}var r=e(require("js-cookie")),t=e(require("axios"));const n="https://api.userfront.com/v0/",o=/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g;function i(e){try{const r=e||window.location.hostname;return!(!r.match(/localhost/g)&&!r.match(o))}catch(e){return!0}}function s(e){var r,t;if(e){if("string"==typeof e)throw new Error(e);if(null!=e&&null!=(r=e.response)&&null!=(t=r.data)&&t.message)throw new Error(e.response.data.message);throw e}}const a={user:{},mode:i()?"test":"live"};function c(){["access","id","refresh"].map(e=>{try{const t=r.get(a[e+"TokenName"]);a[e+"Token"]=t}catch(r){console.warn(`Problem setting ${e} token.`)}})}function u(e,t,n){const o=`${n}.${a.tenantId}`;t=t||{secure:"live"===a.mode,sameSite:"Lax"},"refresh"===n&&(t.sameSite="Strict"),r.set(o,e,t)}function d(e){r.remove(e),r.remove(e,{secure:!0,sameSite:"Lax"}),r.remove(e,{secure:!0,sameSite:"None"}),r.remove(e,{secure:!1,sameSite:"Lax"}),r.remove(e,{secure:!1,sameSite:"None"})}function h(){d(a.accessTokenName),d(a.idTokenName),d(a.refreshTokenName),a.accessToken=void 0,a.idToken=void 0,a.refreshToken=void 0}function l(e){u(e.access.value,e.access.cookieOptions,"access"),u(e.id.value,e.id.cookieOptions,"id"),u(e.refresh.value,e.refresh.cookieOptions,"refresh"),c()}function f(e){if(window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function m(e,{redirect:r}={}){if(!1===r)return;r&&(e=r);try{document&&window}catch(e){return}if(!e)return;const t=document.createElement("a");t.href=e,t.pathname!==window.location.pathname&&window.location.assign(`${t.pathname}${t.hash}${t.search}`)}const w=function({}){return Promise.resolve()};function p(e,r){try{var t=e()}catch(e){return r(e)}return t&&t.then?t.then(void 0,r):t}function v({provider:e,redirect:r}){if(!e)throw new Error("Missing provider");if(!a.tenantId)throw new Error("Missing tenant ID");let t=`https://api.userfront.com/v0/auth/${e}/login?tenant_id=${a.tenantId}&origin=${window.location.origin}`,n=r||f("redirect");return!1===r&&(n="object"==typeof document&&document.location.pathname),n&&(t+="&redirect="+encodeURIComponent(n)),t}function g(){if(!a.idToken)return console.warn("Cannot define user: missing ID token");a.user=a.user||{};const e=function(e){try{const r=e.split(".")[1].replace("-","+").replace("_","/");return JSON.parse(atob(r))}catch(e){console.error("Problem decoding JWT payload",e)}}(a.idToken),r=["email","username","name","image","data","confirmedAt","createdAt","updatedAt","mode","userId","userUuid","tenantId","isConfirmed"];for(const t of r){if("update"===t)return;a.user[t]=e[t]}}const k=a.user;k.update=function(e){try{return!e||Object.keys(e).length<1?Promise.resolve(console.warn("Missing user properties to update")):Promise.resolve(t.put(n+"self",e,{headers:{authorization:"Bearer "+a.accessToken}})).then(function(){return Promise.resolve(Promise.resolve()).then(function(){return g(),a.user})})}catch(e){return Promise.reject(e)}};let P=[],y=!1;module.exports={addInitCallback:function(e){e&&"function"==typeof e&&P.push(e)},init:function(e){if(!e)return console.warn("Userfront initialized without tenant ID");a.tenantId=e,a.accessTokenName="access."+e,a.idTokenName="id."+e,a.refreshTokenName="refresh."+e,c(),a.idToken&&g();try{P.length>0&&P.forEach(r=>{r&&"function"==typeof r&&r({tenantId:e})}),P=[]}catch(e){}},registerUrlChangedEventListener:function(){if(!y){y=!0;try{history.pushState=(e=history.pushState,function(){var r=e.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("urlchanged")),r}),history.replaceState=(e=>function(){var r=e.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("urlchanged")),r})(history.replaceState),window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchanged"))})}catch(e){}var e}},logout:function(){try{if(!a.accessToken)return Promise.resolve(h());const e=function(e,r){try{var o=Promise.resolve(t.get(n+"auth/logout",{headers:{authorization:"Bearer "+a.accessToken}})).then(function({data:e}){h(),m(e.redirectTo)})}catch(e){return r()}return o&&o.then?o.then(void 0,r):o}(0,function(){h()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},setMode:function(){try{const e=function(e,r){try{var o=Promise.resolve(t.get(`${n}tenants/${a.tenantId}/mode`)).then(function({data:e}){a.mode=e.mode||"test"})}catch(e){return r()}return o&&o.then?o.then(void 0,r):o}(0,function(){a.mode="test"});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},login:function({method:e,email:r,username:o,emailOrUsername:i,password:c,token:u,uuid:d,redirect:h}={}){try{if(!e)throw new Error('Userfront.login called without "method" property.');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(function({provider:e,redirect:r}){if(!e)throw new Error("Missing provider");const t=v({provider:e,redirect:r});window.location.assign(t)}({provider:e,redirect:h}));case"password":return function({email:e,username:r,emailOrUsername:o,password:i,redirect:c}){try{return Promise.resolve(p(function(){return Promise.resolve(t.post(n+"auth/basic",{tenantId:a.tenantId,emailOrUsername:e||r||o,password:i})).then(function({data:e}){return function(){if(e.tokens)return l(e.tokens),Promise.resolve(w(e)).then(function(){m(f("redirect")||e.redirectTo||"/",{redirect:c})});throw new Error("Please try again.")}()})},function(e){s(e)}))}catch(e){return Promise.reject(e)}}({email:r,username:o,emailOrUsername:i,password:c,redirect:h});case"link":return function({token:e,uuid:r,redirect:o}={}){try{return Promise.resolve(p(function(){if(e=e||f("token"),r=r||f("uuid"),e&&r)return Promise.resolve(t.put(n+"auth/link",{token:e,uuid:r,tenantId:a.tenantId})).then(function({data:e}){if(!e.tokens)throw new Error("Problem logging in.");l(e.tokens),m(f("redirect")||e.redirectTo||"/",{redirect:o})})},function(e){s(e)}))}catch(e){return Promise.reject(e)}}({token:u,uuid:d,redirect:h});default:throw new Error('Userfront.login called with invalid "method" property.')}}catch(e){return Promise.reject(e)}},resetPassword:function({uuid:e,token:r,password:o,redirect:i}){try{return Promise.resolve(p(function(){if(r=r||f("token"),e=e||f("uuid"),!r||!e)throw new Error("Missing token or uuid");return Promise.resolve(t.put(n+"auth/reset",{tenantId:a.tenantId,uuid:e,token:r,password:o})).then(function({data:e}){if(!e.tokens)throw new Error("There was a problem resetting your password. Please try again.");l(e.tokens),m(f("redirect")||e.redirectTo||"/",{redirect:i})})},function(e){s(e)}))}catch(e){return Promise.reject(e)}},sendLoginLink:function(e){try{return Promise.resolve(p(function(){return Promise.resolve(t.post(n+"auth/link",{email:e,tenantId:a.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link.")}))}catch(e){return Promise.reject(e)}},sendResetLink:function(e){try{return Promise.resolve(p(function(){return Promise.resolve(t.post(n+"auth/reset/link",{email:e,tenantId:a.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link.")}))}catch(e){return Promise.reject(e)}},signup:function({method:e,username:r,name:o,email:i,password:s,data:c,redirect:u}={}){try{if(!e)throw new Error('Userfront.signup called without "method" property.');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return Promise.resolve(function({provider:e,redirect:r}){if(!e)throw new Error("Missing provider");const t=v({provider:e,redirect:r});window.location.assign(t)}({provider:e,redirect:u}));case"password":return function({username:e,name:r,email:o,password:i,userData:s,redirect:c}={}){try{return Promise.resolve(p(function(){return Promise.resolve(t.post(n+"auth/create",{tenantId:a.tenantId,username:e,name:r,email:o,password:i,data:s})).then(function({data:e}){return function(){if(e.tokens)return l(e.tokens),Promise.resolve(w(e)).then(function(){m(f("redirect")||e.redirectTo||"/",{redirect:c})});throw new Error("Please try again.")}()})},function(e){var r,t;if(null!=e&&null!=(r=e.response)&&null!=(t=r.data)&&t.message)throw new Error(e.response.data.message);throw e}))}catch(e){return Promise.reject(e)}}({username:r,name:o,email:i,password:s,userData:c,redirect:u});default:throw new Error('Userfront.signup called with invalid "method" property.')}}catch(e){return Promise.reject(e)}},store:a,accessToken:function(){return a.accessToken=r.get(a.accessTokenName),a.accessToken},idToken:function(){return a.idToken=r.get(a.idTokenName),a.idToken},redirectIfLoggedIn:function(){try{if(!a.accessToken)return Promise.resolve(h());if(f("redirect"))return Promise.resolve(m(f("redirect")));const e=function(e,r){try{var o=Promise.resolve(t.get(n+"self",{headers:{authorization:"Bearer "+a.accessToken}})).then(function({data:e}){e.tenant&&e.tenant.loginRedirectPath&&m(e.tenant.loginRedirectPath)})}catch(e){return r()}return o&&o.then?o.then(void 0,r):o}(0,function(){h()});return Promise.resolve(e&&e.then?e.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},user:k,isTestHostname:i};
//# sourceMappingURL=userfront-core.js.map
