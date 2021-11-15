/**
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';
var app = {version:"1.0.1"}

app.deleteCache = ()=>{
  (async () => {
    //console.log('app.version: '+app.version)
    // import module for side effects
    var oldVersion = await appStore.get("app.version")
    if(!oldVersion){ // init version
      oldVersion = app.version?app.version:'1.0.1'
      appStore.set("app.version",oldVersion)
    }
    //console.log('cache version '+oldVersion);
    if(app.newVersion && oldVersion!=app.newVersion){  
      appStore.set("app.version",app.newVersion)
      //console.log("Đã có phiên bản mới bạn nên cập nhật để được thừa hưởng các tính năng mới")
      if(window.caches){
        appStore.set("deleteCache",true)
        var cacheNames = await caches.keys()
        cacheNames.forEach(cacheName => {
            caches.delete(cacheName);
        });
        setTimeout(()=>{
          serviceWorkerUpdate()
        },1000);
      }else{
        alert("Đã có phiên bản mới bạn nên cài đặt lại để được thừa hưởng các tính năng mới")
      }
    }
  })();
}

function listenForWaitingServiceWorker(registration, callback) {
  function awaitStateChange() {
    registration.installing.addEventListener('statechange', function() {
      if (this.state === 'installed') callback(registration);
    });
  }
  if (!registration) return;
  if (registration.waiting) return callback(registration);
  if (registration.installing) awaitStateChange();
  registration.addEventListener('updatefound', awaitStateChange);
}

// reload once when the new Service Worker starts activating
var refreshing;
navigator.serviceWorker.addEventListener('controllerchange',
  function() {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  }
);
function promptUserToRefresh(registration) {
  // this is just an example
  // don't use window.confirm in real life; it's terrible
    if (registration.waiting){
      setTimeout(()=>{
        registration.waiting.postMessage('SKIP_WAITING');
      },1000);
    }
    else{
      if (window.confirm("Có phiên bản mới! OK để làm mới?")) {
        registration.unregister()
        //alert('unregister')
        setTimeout(()=>{
          window.location.reload();
        },1000);
      }
    }
}

var serviceWorkerUpdate;

// from sarah-clack introduce
window.addEventListener('load', () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function(registration){
          serviceWorkerUpdate = ()=>{
            registration.update()
            promptUserToRefresh(registration)
          }
          listenForWaitingServiceWorker(registration, promptUserToRefresh);

        	console.log('SW registered! Scope is:'+ registration.scope);

        })
  }

  
  setTimeout(()=>{app.deleteCache()},100);
});
