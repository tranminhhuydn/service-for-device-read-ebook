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

//importScripts("./inline-scripts/list-cache.js");
importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");
workbox.core.skipWaiting();

workbox.core.clientsClaim();



var
log = (str) => {
    postMessage(str);
},
listURL = [
    "index.html",
    "my-tabs.html",
    "my-pane.html",

    "images/icon-192.png",
    "images/favicon.png",

    "css/bootstrap.min.css",
    "fonts/glyphicons-halflings-regular.woff2",
    "css/style.css",

    "js/angular/angular.min.js",
    "js/angular/angular.min.js.map",
    "js/angular/angular-sanitize.js",

    "js/load-sw.js",
    "js/analytics.js",
    "js/services.js",
    "js/myDirective.js",
    "js/app.js",
    "js/idb-keyval-iife.js",
    "js/doc.js",
    "js/epub.js",
    
    "jszip/jszip.js",
    "jszip/jszip.min.js",

    "manifest.json"
]


var resourcesToPrecache = listURL
const cacheName='static-shell-v1'

self.__precacheManifest = [].concat(resourcesToPrecache|| []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

self.addEventListener('message',(event)=>{
    var {data} = event
    if (data === 'SKIP_WAITING') {
      workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
    }    

    // switch (data.key){
    //     case 'load': loadMulti();break;
    //     case 'query': filterWord(data.text);break;
    //     default: break;
    // }
})

self.addEventListener('install', function(e) {
  // eslint-disable-next-line no-console
  console.log('[ServiceWorker] Install');

  //self.skipWaiting();
  // e.waitUntil(
  //   caches.open(cacheName)
  //   .then(function(cache){
  //     return cache.addAll(resourcesToPrecache)
  //   })
  // );
});
self.addEventListener('appinstalled', (e) => {
  console.log('Install', 'installed');
});
self.addEventListener('activate', function(e) {
  // eslint-disable-next-line no-console
  console.log('[ServiceWorker] Activate');
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
   e.respondWith(caches.match(e.request)
    .then(cachedResponse=>{
      // get all link
      // listURL.push(e.request.url)
      // console.clear();
      // console.log(listURL)
      return cachedResponse || fetch(e.request)
    })
  );

});