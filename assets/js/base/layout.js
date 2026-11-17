const Layout={
async loadComponent(elementId,componentPath){
const container=document.getElementById(elementId);
if(!container)return;
try{
const res=await fetch(componentPath);
if(!res.ok)throw new Error("HTTP "+res.status);
container.innerHTML=await res.text();
}catch(err){
console.error("Layout error loading "+componentPath+":",err);
}
},
initTheme(){
const savedTheme=localStorage.getItem("theme");
const isDark=savedTheme==="dark";
if(isDark){
document.documentElement.classList.add("dark-mode");
}
this.updateThemeIcon(isDark);
document.addEventListener("click",(e)=>{
const btn=e.target.closest("#theme-toggle-btn");
if(!btn)return;
const activeDark=document.documentElement.classList.toggle("dark-mode");
localStorage.setItem("theme",activeDark?"dark":"light");
Layout.updateThemeIcon(activeDark);
});
},
initImageFallback(){
document.addEventListener("error",(e)=>{
if(e.target&&e.target.tagName==="IMG"){
e.target.onerror=null;
e.target.src="/assets/img/logo/tiny-logo.webp";
}
},true);
},
initInstagram(){
const hasEmbed=document.querySelector(".instagram-media");
if(!hasEmbed)return;
if(window.instgrm&&window.instgrm.Embeds){
window.instgrm.Embeds.process();
}else if(!document.querySelector('script[src*="platform.instagram.com/en_US/embeds.js"]')){
const script=document.createElement("script");
script.async=true;
script.src="https://platform.instagram.com/en_US/embeds.js";
script.onload=()=>{
if(window.instgrm&&window.instgrm.Embeds){
window.instgrm.Embeds.process();
}
};
document.body.appendChild(script);
}
},
updateThemeIcon(isDark){
const icon=document.getElementById("theme-icon");
if(!icon)return;
if(isDark){
icon.classList.remove("ph-moon");
icon.classList.add("ph-sun");
}else{
icon.classList.remove("ph-sun");
icon.classList.add("ph-moon");
}
},
async init(){
this.initTheme();
this.initImageFallback();
await Promise.all([
this.loadComponent("app-header","/components/header.html"),
this.loadComponent("app-footer","/components/footer.html"),
this.loadComponent("app-hero","/components/hero.html"),
this.loadComponent("app-sidebar","/components/sidebar.html")
]);
if(window.Navigation&&typeof window.Navigation.init==="function"){
window.Navigation.init();
}
this.updateThemeIcon(document.documentElement.classList.contains("dark-mode"));
this.initInstagram();
document.dispatchEvent(new CustomEvent("layoutReady"));
}
};
window.Layout=Layout;