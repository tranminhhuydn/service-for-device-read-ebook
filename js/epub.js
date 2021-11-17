import('../jszip/jszip.min.js');
var fileNameEpub;

function overrideXMLHttpRequest (objectIframe){
  this.myCache = []
  this.log = []

  this.objectIframe = objectIframe
  this.XMLHttpRequest = objectIframe.XMLHttpRequest
  var proxiedOpen = this.XMLHttpRequest.prototype.open;
  var proxiedsetRequestHeader = this.XMLHttpRequest.prototype.setRequestHeader;
  var proxiedSend = this.XMLHttpRequest.prototype.send;
  var self = this;

  var
  parser = (text,request)=>{
    var
    parser = new DOMParser(),
    doc = parser.parseFromString(text, "text/html"),
    line = doc.querySelectorAll('i a'),
    lineTranslate = doc.querySelectorAll('b a')

    if(!line||line.length==0){
      line = doc.querySelectorAll('i')
      lineTranslate = doc.querySelectorAll('b')
    }

    if(!line||line.length==0){
      lineTranslate = doc.querySelectorAll('a')
      doc = parser.parseFromString(request, "text/html")
      line = doc.querySelectorAll('a')
    }
    for(var i=0;i< line.length;i++){
      var e = line[i]
      if(e && lineTranslate[i]){
        var c = '<b>'+e.innerText+'</b>'
        c += ' '+lineTranslate[i].innerText
        if(self.myCache.findIndex(v=>{return v.i==e.innerText})==-1)
        self.myCache.push({i:e.innerText,k:lineTranslate[i].innerText,c:c})
      }
    }

    if(!line||line.length==0){
      var c = '<b>'+request+'</b>'
      c += ' '+text
      self.myCache.push({i:request,k:text,c:c})
    }

  },
  parserLog = ()=>{
    
    self.log.filter(ele=>{
      if(!ele.text) return;

      if(Array.isArray(ele.text))
        for(var texts,k =0;k<ele.text.length;k++){
          texts = ele.text[k]
          parser(texts[0],ele.request[k])          
          if(!Array.isArray(texts))
            parser(texts,ele.request[0])
        }

      if(!Array.isArray(ele.text))
        parser(ele.text,ele.request)
    })
  }

  this.XMLHttpRequest.prototype.open = function() {
    //console.log('open');
    //console.log( arguments );
    var urlParams = new URLSearchParams(arguments[1]);
    var myParam = urlParams.get('tc');
    //console.log('tc '+myParam)
    if(self.log.findIndex(v=>{return v.tc==myParam})==-1)
      self.log.push({tc:myParam})

    self.XMLHttpRequest.currentTc = myParam
    //var cacheRequest = self.argRequest

    this.addEventListener("readystatechange", function () {

      //self.log.push({tc:myParam,request:self.XMLHttpRequest.currentSend})
      //console.log('readystate: ' + this.readyState);
      if(this.responseText !== '' && this.readyState ==4) {

        var texts = JSON.parse(this.responseText)
        //self.log.push({tc:myParam,request:self.XMLHttpRequest.currentSend,text:texts})
        //console.log(this.responseURL)
        //console.log(texts)
        var urlParams = new URLSearchParams(this.responseURL);
        var myParam = urlParams.get('tc');
        self.log.filter(v=>{
          if(v.tc == myParam){
            v.text=texts
            return;
          }
        })
        //parserLog()
        
        //console.log(cacheRequest)
        // if(Array.isArray(texts)){
        //   for(var i =0;i<texts.length;i++)
        //   parser(texts[i])
        // }else{
        //   parser(texts)
        // }
      }
    }, false);

    return proxiedOpen.apply(this, [].slice.call(arguments));
  };

  this.XMLHttpRequest.prototype.setRequestHeader = function() {
    //console.log('header')
    //console.log(arguments)
    return proxiedsetRequestHeader.apply(this, [].slice.call(arguments));
  }
  this.XMLHttpRequest.prototype.send = function() {
    //console.log( arguments );
    for(var i in arguments){
      var text = decodeURIComponent(arguments[i])
      //console.log(text)
      text = text.split(/\&q=|q=/)
      text.shift()
      self.log.filter(v=>{
        if(v.tc == self.XMLHttpRequest.currentTc){
          v.request = text
          return;
        }
      })
    }
    proxiedSend.apply(this, arguments); // reset/reapply original send method
  }
  async function* asyncGeneratorMyCache() {
    let i = 0;
    while (i < self.myCache.length) {
      yield self.myCache[i];
      i++;
    }
  }
  function* asyncObjcet(objcet) {
    let i = 0;
    while (i < objcet.length) {
      yield Promise.resolve(objcet[i]);
      i++;
    }
  }
  this.lineByLine = async function (){
    parserLog()
    uiProgressEPUB.style.display='block'
    var 
    fonts,
    doc = this.objectIframe.document.body
    if(this.targetIdContent)
      doc = this.objectIframe.document.body.querySelector("div[id='"+this.targetIdContent+"']")
    
    fonts = doc.querySelectorAll('font font')
    
    var current = 0;
    self.myCache.map(() => task().then((res) =>{loadingBarStatus(current++, self.myCache,fonts)}));
    await Promise.all(self.myCache);
  }
}

function loadingBarStatus(current, obj,fonts) {
  for(var i =0;i<fonts.length;i++){
      var f = fonts[i]
      var v = obj[current]
      if(f.innerText.trim()==v.k.trim()){
        f.innerHTML = v.c 
        break;
      }
  }
  if(current==obj.length){
    alert('finish')
    uiProgressEPUB.style.display='none'
  }
  uiBarEPUB.style.width = (((current)*100)/obj.length)+'%'
}
function task(obj) {
  return new Promise(res => {
    setTimeout(res,1);
  })
}

window['overrideXMLHttpRequest'] = overrideXMLHttpRequest

function createScripTranslate (bodyIframe){
  if(!bodyIframe.querySelector("div[id='google_translate_element']")){
    bodyIframe.prepend(d.create("div",{id:'google_translate_element'}))
    d.create('script',
      {
        type:"text/javascript",
        innerHTML:`
              var p
              function googleTranslateElementInit() {
                p = new google.translate.TranslateElement({}, 'google_translate_element');
              }`
      },
    bodyIframe)

    d.create('script',{
      type:"text/javascript",
      src:'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'}
    ,bodyIframe)
  }
}
window['createScripTranslate'] = createScripTranslate
function scrollWindow (yourWindow) {
    var self = yourWindow.contentWindow,
    offsetHeight = self.document.body.offsetHeight,
    next = self.scrollY,
    go = yourWindow.offsetHeight
    
    var myVar = setInterval(()=>{
      offsetHeight = self.document.body.offsetHeight
      self.scroll(0,next)
      next+= go
      if(next>offsetHeight)
        clearInterval(myVar);
    }, 10);
}
window['scrollWindow'] = scrollWindow
function Epub() {
  this.init()
}
Epub.prototype.init = ()=>{
  console.log ('Epub init')
  var header = d.querySelector('header')
  var html = d.querySelector('html')
  // console.log(header.offsetHeight);
  // console.log(d.body.offsetHeight);
  // console.log(d.body.offsetHeight - header.offsetHeight);
  d.body.style.height = (html.offsetHeight - (header.offsetHeight+20))+"px"
  //d.body.offsetHeight = d.body.offsetHeight - header.offsetHeight


  var objOverride = new overrideXMLHttpRequest(displayContentEPUB.contentWindow)
  objOverride.targetIdContent ='contentEPUB'

  cmdDualLanguageEPUB.onclick = ()=>{
    objOverride.lineByLine()
  }
  window['objOverride'] = objOverride


  var $result = resultEPUB,
  zipSource = null,
  readZipDir = (zip,dateBefore,$title,$fileContent)=>{
    var dateAfter = new Date();
    $title.append(d.create("span", {
        "class": "small",
        innerText:" (loaded in " + (dateAfter - dateBefore) + "ms)"
    }));

    for(var i in zip.files) {
        $fileContent.append(d.create("li", {
            innerText : i
        }));
    }
    
    return readZipFile(zip,'META-INF/container.xml');

  },
  readZipFile = (zip,fileName,format = "string")=>{
    var fileContent = null
    for(var i in zip.files) {
        if(i == fileName|| i.indexOf(fileName)!=-1)
          fileContent = i
    }
    if(fileContent!=null)
      return zip.file(fileContent).async(format)
    else
      return false
  },
  readZipFileImages = (fileName,mediaType)=>{
    //uint8array
    for(var i in zipSource.files) {
        if(i == fileName|| i.indexOf(fileName)!=-1)
          return Promise.resolve({fileName:fileName ,src:zipSource.file(i).async('base64'),mediaType:mediaType})
    }
    return Promise.resolve({fileName:fileName ,src:null,mediaType:null})
  },
  readAsDom = (xmlStr)=>{
    if(xmlStr){
      var 
      parser = new DOMParser(),
      doc = parser.parseFromString(xmlStr, "application/xml");
      // print the name of the root element or error message
      var errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        console.log("error while parsing");
      } else {
        var r = doc.querySelector('rootfile'),
        nextFile = r.getAttribute('full-path')
        if(nextFile){
          console.log('read: '+nextFile);
          return readZipFile(zipSource,nextFile)
        }
      }
    }
    return null
  },
  readAsHTML = async (source)=>{
    var listImages = []
    //console.log(source);
    if(source){
      var 
      parser = new DOMParser(),
      doc = parser.parseFromString(source, "application/xml");
      // print the name of the root element or error message
      var errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        console.log("error while parsing");
      } else {
      //(async function() {  
        var r = doc.querySelectorAll('item'),
        bodyEPUB = displayContentEPUB.contentWindow.document.body
        bodyEPUB.innerHTML = ''
        var contentEPUB = d.create('div',{id:'contentEPUB'},bodyEPUB)
        window['contentEPUB'] = contentEPUB
        //console.log(r);
        var innerHTML = contentEPUB.innerHTML
        for(var e,i=0;i<r.length;i++){
          e = r[i]
          var 
          mediaType = e.getAttribute('media-type'),
          fileName = e.getAttribute('href')
          if(mediaType =='application/xhtml+xml'){
            //console.log(fileName);
            var txt = await 
            readZipFile(zipSource,fileName)
            //.then(txt=>{
              if(txt){
                var 
                parser = new DOMParser(),
                doc = parser.parseFromString(txt, "application/xml"),
                ra = doc.querySelectorAll('a')
                if(fileName.indexOf('toc')!=-1){
                  console.log(fileName);
                  for(var e,j=0;j<ra.length;j++){
                    e = ra[j]
                    e.classList.add('toc')
                    var href = e.getAttribute('href')
                    e.setAttribute('href','#'+href)
                    //e.setAttribute('href','#'+fileName)
                  }
                }else{
                  var ids = doc.querySelectorAll('[id]')
                  for(var e,j=0;j<ids.length;j++){
                    e = ids[j]
                    e.setAttribute('id',fileName+"#"+e.getAttribute('id'))
                  }
                  for(var e,j=0;j<ra.length;j++){
                    e = ra[j]
                    e.classList.add('bookmark')

                    var id, prefixId,
                    href = e.getAttribute('href')
                    if(href){
                      //id = href.slice(href.indexOf('#')+1,href.length)
                      //prefixId = href.slice(0,href.indexOf('#'))
                      console.log(href);
                      //e.setAttribute('href','#')
                      //e.setAttribute('id',id)

                      e.setAttribute('id',fileName)
                      e.setAttribute('href','#'+fileName)
                    }

                  }
                  
                }

                innerHTML+=doc.querySelector('body').innerHTML
                // var aa = doc.querySelector('body').children
                // for(var j=0;j<aa.length;j++)
                // contentEPUB.append(aa[j])
              }
              //console.log(txt);
            //})
          }else if(mediaType.indexOf('image')==0){
            //console.log(fileName);
            var txt = await readZipFileImages(fileName,mediaType)
            if(txt){
              listImages.push(txt)
            }
          }else if(mediaType.indexOf('text/css')==0){
            var txt = await readZipFile(zipSource,fileName)
            //link href="../bootstrap-3.3.7/css/bootstrap.min.css" rel="stylesheet"
            //var blob = new Blob([txt], {type: mediaType});  
            //d.create('link',{rel:"stylesheet",href:window.URL.createObjectURL(blob)},contentEPUB)
            //console.log(fileName);
            //console.log(txt);
            var style = d.create('style',{innerHTML:txt})
            //contentEPUB.prepend(style)
            innerHTML+=style.outerHTML;
          }else{
            //console.log(e);
          }
        }
      //})

        contentEPUB.innerHTML = innerHTML

        setTimeout(()=>{
          (async function() {  
            //console.log(listImages)
            for (var i=0;i<listImages.length;i++){
              var 
              ele = listImages[i],
              eleName = ele.fileName.split('/')
              eleName = eleName[eleName.length-1]
              var text = await ele.src
              //var blob = new Blob([text], {type: ele.mediaType});                  
              //r = contentEPUB.querySelectorAll('img')
              r = contentEPUB.querySelectorAll('img')
                r.forEach(e=>{
                  var filename = e.src.split('/')
                  filename = filename[filename.length-1]
                  if(eleName == filename){
                    //e.src = window.URL.createObjectURL(blob)
                    e.src = "data:"+ele.mediaType+";base64,"+text
                  }
                })
            }
          })();
        
        }, 2000);
      }
    }
  },
  // Closure to capture the file information.
  handleFile = (f) => {
      fileNameEpub = f.name
      var $title = d.create("h4", {innerText : f.name});
      var $fileContent = d.create("ul",{});
      $result.append($title);
      $result.append($fileContent);

      var dateBefore = new Date();
      var jszip = new JSZip()
      jszip.loadAsync(f)                                   // 1) read the Blob
      .then((zip)=>{
        zipSource = zip;
        return readZipDir(zip,dateBefore,$title,$fileContent)
      }, function (e) {
          $result.append(d.create("div", {
              "class" : "alert alert-danger",
              innerText : "Error reading " + f.name + ": " + e.message
          }));
      })
      .then(xmlStr=>{return readAsDom(xmlStr)})
      .then(source=>{return readAsHTML(source)})
  }

  //event
  inputSourceEpubV2.onchange = function(evt) {
      // remove content
      $result.innerHTML  = "";
      // be sure to show the results
      //resultBlockEPUB.classList.toggle('hidden') 

      var files = evt.target.files;
      for (var i = 0; i < files.length; i++) {
          handleFile(files[i]);
      }
  };
  downloadFileEPUB.onclick = (event)=>{
    var MIME_TYPE = "text/html",
    prefix = `<!DOCTYPE html><html><head><title>${fileNameEpub}</title><meta charset="utf-8"></head><body>`,
    blob = new Blob([prefix+contentEPUB.outerHTML+'</body></html>'], {type: MIME_TYPE}),
    ilink = d.create("a",{download:fileNameEpub+".html",href:window.URL.createObjectURL(blob)},d.body);
    ilink.click();
    d.body.removeChild(ilink);
  }
  cmdTranslateEPUB.onclick = (event)=>{
    var bodyIframe = displayContentEPUB.contentWindow.document.body
    createScripTranslate(bodyIframe)
    setTimeout(()=>{
      
    },5000)
  }
  cmdScrollTranslateEPUB.onclick = (event)=>{
    scrollWindow(displayContentEPUB)
  }
}



window.Epub = Epub