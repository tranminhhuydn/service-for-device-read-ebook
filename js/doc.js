const d = document
d.id = (id)=>{return d.getElementById(id)}
d.create = (tag,objs,parent)=>{var c = d.createElement(tag); for(var attr in objs) c[attr]?c.setAttribute(attr,objs[attr]):(c[attr] = objs[attr]); if(parent) parent.append(c);return c}  

d.globalIDs = ()=>{
  var globals = d.querySelectorAll('[id]')
  globals.forEach(e=>{
    window[e.id] = d.id(e.id)
  })
}

window.d = d
