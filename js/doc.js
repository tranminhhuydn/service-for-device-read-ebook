const d = document
d.id = (id)=>{return d.getElementById(id)}
d.create = (tag,objs,parent)=>{var c = d.createElement(tag); for(var attr in objs) c[attr]?c.setAttribute(attr,objs[attr]):(c[attr] = objs[attr]); if(parent) parent.append(c);return c}  

d.globalIDs = ()=>{
  var globals = d.querySelectorAll('[id]')
  function toTitleCase(str) {
  var c = str.replace(
      /(\w+)/g,
      (txt) => {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    ).replace(/([^\w])/g,'');
    return c.charAt(0).toLowerCase() + c.substr(1);
  }
  globals.forEach(e=>{
    var id = toTitleCase(e.id)
    window[id] = d.id(e.id)
  })
}

window.d = d
