'use strict';
import("./doc.js");
import("./epub.js");

// fetch: function(options) {
//   options = options ? _.clone(options) : {};
//   if (options.parse === void 0) options.parse = true;
//   var model = this;
//   var success = options.success;
//   options.success = function(resp) {
//     if (!model.set(model.parse(resp, options), options)) return false;
//     if (success) success(model, resp, options);

//     // HERE'S THE TRIGGER!
//     model.trigger('sync', model, resp, options);

//   };
//   wrapError(this, options);
//   return this.sync('read', this, options);
// },

// const constantMock = window.fetch;
// window.fetch = function() {
//    // Get the parameter in arguments
//    // Intercept the parameter here
//    console.log(arguments); 
//   return constantMock.apply(this, arguments)
// }

var

contentResult = '',
init = ()=>{
  'use strict';
  var
  count = 0,
  objAnswer,
  fileName = ''
  //declear all id
  // var globals = d.querySelectorAll('[id]')
  // globals.forEach(e=>{
  //   window[e.id] = d.id(e.id)
  // })
  d.globalIDs()


  //myFrame.contentWindow.fetch = window.fetch
  //myFrame.contentWindow.XMLHttpRequest = window.XMLHttpRequest
  //overrideXMLHttpRequest(myFrame.contentWindow)
  var epub = new Epub()
  
  // getResult.onclick = ()=>{
  //    myFrame.contentWindow.postMessage({cmd:'getResult'})
  // }

  inputSource.addEventListener("change", handleFiles, false);
  function handleFiles(file) {
    var fileList = this.files,
    file = fileList[0],
    fileName = file.name,
    fileExtension = (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined
    //alert(fileExtension)
    console.log(file.type);
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      // this will then display a text file
      //content.innerText = reader.result;
      //alert(reader.result)
      var my,text = reader.result
      sourceFile.value =text
      
      //iframeTranslateFromText.contentWindow.postMessage({cmd:'translate',data:text})
      iframeTranslateFromText.contentWindow.document.body.innerHTML = ''

      //if(/\.(htm?l)$/i.test(fileName))
      if(fileExtension=='html'||fileExtension=='htm')
        my = d.create('div',{id:'my',innerHTML:text},iframeTranslateFromText.contentWindow.document.body)
      else 
        my = d.create('div',{id:'my',innerText:text},iframeTranslateFromText.contentWindow.document.body)
      
      

      var myFrameOverride = new overrideXMLHttpRequest(iframeTranslateFromText.contentWindow)
      myFrameOverride.targetIdContent ='my'
      window['myFrameOverride'] = myFrameOverride
      //myFrame.contentWindow.document.querySelector('#my').innerText = text
    }, false);

    reader.readAsText(file);
  }

  inputHeading.addEventListener("change", handleHeadingFile,false)
  function handleHeadingFile (event){
    var fileList = this.files
    var file = fileList[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      // this will then display a text file
      //content.innerText = reader.result;
      //alert(reader.result)
      var text = reader.result
      headingFile.value =text
      //myFrame.contentWindow.postMessage({cmd:'translate',data:text})

    }, false);
    reader.readAsText(file);
  }
  //inputSourceEpub.addEventListener("change", inputSourceEpubFN, false);
  function readAsText (e,objectIframe){
    var
    file = e,
    reader = new FileReader();
    reader.addEventListener("load", () => {
      var text = reader.result
      headingFile.value = text

      var MIME_TYPE = "text/html";
      var blob = new Blob([text], {type: MIME_TYPE});
      objectIframe.contentWindow.document.location.href = window.URL.createObjectURL(blob)

    }, false);

    reader.readAsText(file);
  }
  
  cmdTranslateTXT.onclick = ()=>{
    createScripTranslate(iframeTranslateFromText.contentWindow.document.body)
    
    setTimeout(()=>{
      scrollWindow(iframeTranslateFromText.contentWindow)
    },5000)
  }
  cmdScrollTranslateTXT.onclick = (event)=>{
    scrollWindow(displayContentEPUB)
  }
  downloadFile.onclick = ()=>{
    var MIME_TYPE = "text/html";
    var context = iframeTranslateFromText.contentWindow.document.body.querySelector("div[id='my']")
    var blob = new Blob([context.innerHTML], {type: MIME_TYPE});
    // window.location.href = window.URL.createObjectURL(blob);
    //downloadURI("data:text/html,"+resultBuiltDoc.innerHTML, fileName+".html");
    downloadURI(window.URL.createObjectURL(blob), fileName+".html");
  }

  builtDoc.onclick = ()=>{

    //myFrame.contentWindow.postMessage({cmd:'getResult'})
    contentResult = iframeTranslateFromText.contentWindow.document.querySelector('#my').innerHTML
    resultBeforeBuiltDoc.innerHTML = contentResult.replace(/\<br\>/g,"\n")
    contentResult = resultBeforeBuiltDoc.innerText
    // setTimeout(()=>{
       resultBuiltDoc.innerHTML = createHeading(headingFile.value,lineByLine())
    // },1000);
    
  }
  cmdDualLanguageTXT.onclick = ()=>{
    myFrameOverride.lineByLine()
  }
  cmdJoinLine.onclick =()=>{
    var c = sourceFile.value
    c = c.replace(/\n\n/g,'#n')
    c = c.replace(/\n/g,' ')
    c = c.replace(/\#n/g,'\n\n')
    sourceFile.value = c
    iframeTranslateFromText.contentWindow.document.querySelector('#my').innerText = c
  }

  
}
window.addEventListener("load",()=>{
  setTimeout(init,100);
})

window.addEventListener("message", (event) => {
 //alert(event.data)
 //console.log(event.data);
 var data = event.data
 switch(data.cmd){
  case 'getResult': contentResult = data.data;break;
 }
}, false);

var
lineByLine = ()=>{
  var 
  returnTrimArray = (src)=>{
    var ss = src.split(/\n/g)
    ss = ss.map((s)=>{return s.trim()})
    return ss
  },
  splitDoted = (s)=>{
    var ss = s.split(/\./g)
    return ss;
  },
  connectDoted = (a,b)=>{
    var context = '',
    max = a.length>b.length?a:b
    
    for(var i =0;i<max.length;i++){
      a[i] = a[i]!=undefined?"<b>"+a[i]+"</b> ":''
      b[i] = b[i]!=undefined?b[i]:''
      context+=a[i]+b[i]+". "
    }
    return context
  },
  c_en = returnTrimArray(sourceFile.value),
  c_vi = returnTrimArray(contentResult),
  html = `<html><head><meta charset="UTF-8"></head><body>{heading}<br>{result}</body></html>`,
  context = ''
  for(var i =0;i<c_en.length;i++){
    if(c_en[i].length==0){
      context+='<br>'
    }else{
      var sc_en = splitDoted(c_en[i]),
      sc_vi = splitDoted(c_vi[i])
      console.log(sc_en.length);
      console.log(sc_vi.length);
      if(sc_en.length==sc_vi.length && sc_en.length!=1)
        context+=connectDoted(sc_en,sc_vi)+"<br>"
      else if(sc_en.length == sc_vi.length && sc_en.length==1){
        context+=connectDoted(sc_en,sc_vi)+"<br>"
      }
      else{
        //context+="<b style='color:red'>"+c_en[i]+"</b> "+c_vi[i]+"<br>"
        context+=connectDoted(sc_en,sc_vi)+"<br>"
      }
    }
  }
  return html.replace('{result}',context)
},
createHeading = (heading,source) =>{
  var
  // path1 = './txt/suragansutra_en_vi.html',
  // path2 = './txt/heading.txt',
  // path3 = './txt/suragansutra_heading.html',
  // heading = fs.readFileSync(path2,'utf8'),
  src = source,
  html = src

  headingSrc  = heading.split(/\n/g)
  var headings = headingSrc.map((v)=>{v = v.trim(); if(v.length!=0) return v}),
  tagHeading = (c,i)=>{ return `<a href='#heading${i}'>${c}</a><br>`}
  tagBookmark = (c,i)=>{ return `<h3 id='heading${i}'>${c}</h3>`}
  headings.forEach((h,i)=>{
    html = html.replace(h,tagBookmark(h,i))
    heading = heading.replace(h,tagHeading(h,i)) 
  })
  //log(heading)
  return html.replace('{heading}',heading)
},
downloadURI = (uri, name)=>{
  var ilink = document.createElement("a");
  ilink.download = name;
  ilink.href = uri;
  document.body.appendChild(ilink);
  ilink.click();
  document.body.removeChild(ilink);
  //delete ilink;
}

