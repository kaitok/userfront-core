import e from"js-cookie";import t from"axios";const n="https://api.userfront.com/v0/",r=/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g;function o(e){try{const t=e||window.location.hostname;return!(!t.match(/localhost/g)&&!t.match(r))}catch(e){return!0}}function a(e){var t,n;if(e){if("string"==typeof e)throw new Error(e);if(null!=e&&null!=(t=e.response)&&null!=(n=t.data)&&n.message)throw new Error(e.response.data.message);throw e}}const i={user:{},tokens:{},mode:o()?"test":"live"};function s(){["access","id","refresh"].map(t=>{try{const n=e.get(i.tokens[t+"TokenName"]);i.tokens[t+"Token"]=n}catch(e){console.warn(`Problem setting ${t} token.`)}})}const c=i.tokens;function d(t,n,r){const o=`${r}.${i.tenantId}`;n=n||{secure:"live"===i.mode,sameSite:"Lax"},"refresh"===r&&(n.sameSite="Strict"),e.set(o,t,n)}function u(t){e.remove(t),e.remove(t,{secure:!0,sameSite:"Lax"}),e.remove(t,{secure:!0,sameSite:"None"}),e.remove(t,{secure:!1,sameSite:"Lax"}),e.remove(t,{secure:!1,sameSite:"None"})}function w(){u(i.tokens.accessTokenName),u(i.tokens.idTokenName),u(i.tokens.refreshTokenName),i.tokens.accessToken=void 0,i.tokens.idToken=void 0,i.tokens.refreshToken=void 0}function h(e){d(e.access.value,e.access.cookieOptions,"access"),d(e.id.value,e.id.cookieOptions,"id"),d(e.refresh.value,e.refresh.cookieOptions,"refresh"),s()}function l(e){if("object"==typeof window&&"object"==typeof window.location&&window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function f(e,{redirect:t}={}){if(!1===t||"object"!=typeof document||"object"!=typeof window)return;try{document&&window}catch(e){return}if(t&&(e=t),!e)return;const n=document.createElement("a");n.href=e,n.pathname!==window.location.pathname&&window.location.assign(`${n.pathname}${n.hash}${n.search}`)}async function p({}){}function m({provider:e,redirect:t}){if(!e)throw new Error("Missing provider");if(!i.tenantId)throw new Error("Missing tenant ID");let n=`https://api.userfront.com/v0/auth/${e}/login?tenant_id=${i.tenantId}&origin=${window.location.origin}`,r=t||l("redirect");return!1===t&&(r="object"==typeof document&&document.location.pathname),r&&(n+="&redirect="+encodeURIComponent(r)),n}function k(){if(!i.tokens.idToken)return console.warn("Cannot define user: missing ID token");i.user=i.user||{};const e=function(e){try{const t=e.split(".")[1].replace("-","+").replace("_","/");return JSON.parse(atob(t))}catch(e){console.error("Problem decoding JWT payload",e)}}(i.tokens.idToken),t=["email","username","name","image","data","confirmedAt","createdAt","updatedAt","mode","userId","userUuid","tenantId","isConfirmed"];for(const n of t){if("update"===n)return;i.user[n]=e[n]}}const g=i.user;g.update=async function(e){return!e||Object.keys(e).length<1?console.warn("Missing user properties to update"):(await t.put(n+"self",e,{headers:{authorization:"Bearer "+i.tokens.accessToken}}),await async function(){}(),k(),i.user)};let y=[],v=!1;var T={addInitCallback:function(e){e&&"function"==typeof e&&y.push(e)},init:function(e){if(!e)return console.warn("Userfront initialized without tenant ID");i.tenantId=e,i.tokens=i.tokens||{},i.tokens.accessTokenName="access."+i.tenantId,i.tokens.idTokenName="id."+i.tenantId,i.tokens.refreshTokenName="refresh."+i.tenantId,s(),i.tokens.idToken&&k();try{y.length>0&&y.forEach(t=>{t&&"function"==typeof t&&t({tenantId:e})}),y=[]}catch(e){}},registerUrlChangedEventListener:function(){if(!v){v=!0;try{history.pushState=(e=history.pushState,function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("pushstate")),window.dispatchEvent(new Event("urlchanged")),t}),history.replaceState=(e=>function(){var t=e.apply(this,arguments);return window.dispatchEvent(new Event("replacestate")),window.dispatchEvent(new Event("urlchanged")),t})(history.replaceState),window.addEventListener("popstate",()=>{window.dispatchEvent(new Event("urlchanged"))})}catch(e){}var e}},logout:async function(){if(!i.tokens.accessToken)return w();try{const{data:e}=await t.get(n+"auth/logout",{headers:{authorization:"Bearer "+i.tokens.accessToken}});w(),f(e.redirectTo)}catch(e){w()}},setMode:async function(){try{const{data:e}=await t.get(`${n}tenants/${i.tenantId}/mode`);i.mode=e.mode||"test"}catch(e){i.mode="test"}},login:async function({method:e,email:r,username:o,emailOrUsername:s,password:c,token:d,uuid:u,redirect:w}={}){if(!e)throw new Error('Userfront.login called without "method" property.');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return function({provider:e,redirect:t}){if(!e)throw new Error("Missing provider");const n=m({provider:e,redirect:t});window.location.assign(n)}({provider:e,redirect:w});case"password":return async function({email:e,username:r,emailOrUsername:o,password:s,redirect:c}){try{const{data:a}=await t.post(n+"auth/basic",{tenantId:i.tenantId,emailOrUsername:e||r||o,password:s});if(a.tokens)return h(a.tokens),await p(a),f(l("redirect")||a.redirectTo||"/",{redirect:c}),a;throw new Error("Please try again.")}catch(e){a(e)}}({email:r,username:o,emailOrUsername:s,password:c,redirect:w});case"link":return async function({token:e,uuid:r,redirect:o}={}){try{if(e=e||l("token"),r=r||l("uuid"),!e||!r)return;const{data:a}=await t.put(n+"auth/link",{token:e,uuid:r,tenantId:i.tenantId});if(a.tokens)return h(a.tokens),await p(a),f(l("redirect")||a.redirectTo||"/",{redirect:o}),a;throw new Error("Problem logging in.")}catch(e){a(e)}}({token:d,uuid:u,redirect:w});default:throw new Error('Userfront.login called with invalid "method" property.')}},resetPassword:async function({uuid:e,token:r,password:o,redirect:s}){try{if(r=r||l("token"),e=e||l("uuid"),!r||!e)throw new Error("Missing token or uuid");const{data:a}=await t.put(n+"auth/reset",{tenantId:i.tenantId,uuid:e,token:r,password:o});if(a.tokens)return h(a.tokens),f(l("redirect")||a.redirectTo||"/",{redirect:s}),a;throw new Error("There was a problem resetting your password. Please try again.")}catch(e){a(e)}},sendLoginLink:async function(e){try{const{data:r}=await t.post(n+"auth/link",{email:e,tenantId:i.tenantId});return r}catch(e){throw new Error("Problem sending link.")}},sendResetLink:async function(e){try{const{data:r}=await t.post(n+"auth/reset/link",{email:e,tenantId:i.tenantId});return r}catch(e){throw new Error("Problem sending link.")}},signup:async function({method:e,username:r,name:o,email:a,password:s,data:c,redirect:d}={}){if(!e)throw new Error('Userfront.signup called without "method" property.');switch(e){case"azure":case"facebook":case"github":case"google":case"linkedin":return function({provider:e,redirect:t}){if(!e)throw new Error("Missing provider");const n=m({provider:e,redirect:t});window.location.assign(n)}({provider:e,redirect:d});case"password":return async function({username:e,name:r,email:o,password:a,userData:s,redirect:c}={}){try{const{data:d}=await t.post(n+"auth/create",{tenantId:i.tenantId,username:e,name:r,email:o,password:a,data:s});if(d.tokens)return h(d.tokens),await p(d),f(l("redirect")||d.redirectTo||"/",{redirect:c}),d;throw new Error("Please try again.")}catch(e){var d,u;if(null!=e&&null!=(d=e.response)&&null!=(u=d.data)&&u.message)throw new Error(e.response.data.message);throw e}}({username:r,name:o,email:a,password:s,userData:c,redirect:d});default:throw new Error('Userfront.signup called with invalid "method" property.')}},store:i,tokens:c,accessToken:function(){return i.tokens.accessToken=e.get(i.tokens.accessTokenName),i.tokens.accessToken},idToken:function(){return i.tokens.idToken=e.get(i.tokens.idTokenName),i.tokens.idToken},redirectIfLoggedIn:async function(){if(!i.tokens.accessToken)return w();if(l("redirect"))return f(l("redirect"));try{const{data:e}=await t.get(n+"self",{headers:{authorization:"Bearer "+i.tokens.accessToken}});e.tenant&&e.tenant.loginRedirectPath&&f(e.tenant.loginRedirectPath)}catch(e){w()}},user:g,isTestHostname:o};export default T;
//# sourceMappingURL=userfront-core.modern.js.map
