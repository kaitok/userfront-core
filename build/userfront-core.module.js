import e from"axios";import t from"js-cookie";function n(e,t){try{var n=e()}catch(e){return t(e)}return n&&n.then?n.then(void 0,t):n}const{apiUrl:r,privateIPRegex:o}={apiUrl:"https://api.userfront.com/v0/",privateIPRegex:/((^127\.)|(^10\.)|(^172\.1[6-9]\.)|(^172\.2[0-9]\.)|(^172\.3[0-1]\.)|(^192\.168\.))\d{1,3}\.\d{1,3}/g},i=e=>{try{const t=e||window.location.hostname;return!(!t.match(/localhost/g)&&!t.match(o))}catch(e){return!0}},s={mode:i()?"test":"live"};function a(e){if(window.location.href&&!(window.location.href.indexOf(e+"=")<0))return decodeURIComponent(window.location.href.split(e+"=")[1].split("&")[0])}function c(e){if(!e)return;const t=document.createElement("a");t.href=e,t.pathname!==window.location.pathname&&(window.location.href=`${t.pathname}${t.hash}${t.search}`)}function u(e,n,r){const o=`${r}.${s.tenantId}`;n=n||{secure:"live"===s.mode,sameSite:"Lax"},"refresh"===r&&(n.sameSite="Strict"),t.set(o,e,n)}function d(e){t.remove(e),t.remove(e,{secure:!0,sameSite:"Lax"}),t.remove(e,{secure:!0,sameSite:"None"}),t.remove(e,{secure:!1,sameSite:"Lax"}),t.remove(e,{secure:!1,sameSite:"None"})}function m(){d(s.accessTokenName),d(s.idTokenName),d(s.refreshTokenName),s.accessToken=void 0,s.idToken=void 0,s.refreshToken=void 0}function h(){s.accessToken=t.get(s.accessTokenName),s.idToken=t.get(s.idTokenName),s.refreshToken=t.get(s.refreshTokenName)}function f(e){u(e.access.value,e.access.cookieOptions,"access"),u(e.id.value,e.id.cookieOptions,"id"),u(e.refresh.value,e.refresh.cookieOptions,"refresh"),h()}var l={accessToken:function(){return s.accessToken=t.get(s.accessTokenName),s.accessToken},getQueryAttr:a,idToken:function(){return s.idToken=t.get(s.idTokenName),s.idToken},init:function(e){if(!e)return console.warn("Userfront initialized without tenant ID");s.tenantId=e,s.accessTokenName="access."+e,s.idTokenName="id."+e,s.refreshTokenName="refresh."+e,h()},isTestHostname:i,login:function({email:t,username:n,emailOrUsername:o,password:i}){try{return Promise.resolve(e.post(r+"auth/basic",{tenantId:s.tenantId,emailOrUsername:t||n||o,password:i})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");f(e.tokens),c(a("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},loginWithTokenAndUuid:function(t,n){try{return t||(t=a("token")),n||(n=a("uuid")),t&&n?Promise.resolve(e.put(r+"auth/link",{token:t,uuid:n,tenantId:s.tenantId})).then(function({data:e}){if(!e.tokens)throw new Error("Problem logging in.");f(e.tokens),c(a("redirect")||e.redirectTo||"/")}):Promise.resolve()}catch(e){return Promise.reject(e)}},logout:function(){try{if(!s.accessToken)return Promise.resolve(m());const t=n(function(){return Promise.resolve(e.get(r+"auth/logout",{headers:{authorization:"Bearer "+s.accessToken}})).then(function({data:e}){m(),c(e.redirectTo)})},function(){});return Promise.resolve(t&&t.then?t.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},redirectIfLoggedIn:function(){try{if(!s.accessToken)return Promise.resolve(m());const t=n(function(){return Promise.resolve(e.get(r+"self",{headers:{authorization:"Bearer "+s.accessToken}})).then(function({data:e}){e.tenant&&e.tenant.loginRedirectPath&&c(e.tenant.loginRedirectPath)})},function(){m()});return Promise.resolve(t&&t.then?t.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},resetPassword:function({uuid:t,token:n,password:o}){try{if(n||(n=a("token")),t||(t=a("uuid")),!n||!t)throw new Error("Missing token or uuid");return Promise.resolve(e.put(r+"auth/reset",{tenantId:s.tenantId,uuid:t,token:n,password:o})).then(function({data:e}){if(!e.tokens)throw new Error("There was a problem resetting your password. Please try again.");f(e.tokens),c(a("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},sendLoginLink:function(t){try{return Promise.resolve(n(function(){return Promise.resolve(e.post(r+"auth/link",{email:t,tenantId:s.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},sendResetLink:function(t){try{return Promise.resolve(n(function(){return Promise.resolve(e.post(r+"auth/reset/link",{email:t,tenantId:s.tenantId})).then(function({data:e}){return e})},function(){throw new Error("Problem sending link")}))}catch(e){return Promise.reject(e)}},setMode:function(){try{const t=n(function(){return Promise.resolve(e.get(`${r}tenants/${s.tenantId}/mode`)).then(function({data:e}){s.mode=e.mode||"test"})},function(){s.mode="test"});return Promise.resolve(t&&t.then?t.then(function(){}):void 0)}catch(e){return Promise.reject(e)}},setCookie:u,signup:function({username:t,name:n,email:o,password:i}){try{return Promise.resolve(e.post(r+"auth/create",{tenantId:s.tenantId,username:t,name:n,email:o,password:i})).then(function({data:e}){if(!e.tokens)throw new Error("Please try again.");f(e.tokens),c(a("redirect")||e.redirectTo||"/")})}catch(e){return Promise.reject(e)}},store:s};export default l;
//# sourceMappingURL=userfront-core.module.js.map
