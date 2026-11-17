const Preloader={
init(){
this.el=document.getElementById("site-preloader");
if(!this.el)return;
this.hide();
this.bindTransitions();
window.addEventListener("pageshow",(e)=>{
if(e.persisted)this.hide();
});
},
show(){
if(!this.el)return;
this.el.classList.remove("loaded");
this.el.classList.add("active");
},
hide(){
if(!this.el)return;
setTimeout(()=>{
this.el.classList.remove("active");
this.el.classList.add("loaded");
},120);
},
bindTransitions(){
document.addEventListener("click",(e)=>{
const link=e.target.closest("a");
if(!link)return;
const href=link.getAttribute("href");
if(!href)return;
const target=link.getAttribute("target");
if(target==="_blank")return;
if(e.ctrlKey||e.metaKey||e.shiftKey)return;
if(href.startsWith("#")||href.startsWith("javascript:")||href.startsWith("mailto:")||href.startsWith("tel:"))return;
if(href.startsWith("http://")||href.startsWith("https://")){
try{
const url=new URL(href,window.location.origin);
if(url.origin!==window.location.origin)return;
}catch(err){
return;
}
}
e.preventDefault();
this.show();
setTimeout(()=>{
window.location.href=href;
},200);
});
}
};
document.addEventListener("DOMContentLoaded",()=>{
Preloader.init();
});
document.addEventListener("layoutReady",()=>{
Preloader.hide();
});
window.Preloader=Preloader;