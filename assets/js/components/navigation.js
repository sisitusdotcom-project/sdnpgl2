const Navigation={
init(){
this.initDrawer();
this.highlightCurrentPage();
this.initScrollHeader();
},
initDrawer(){
const hamburger=document.getElementById("hamburger-btn");
const drawer=document.getElementById("mobile-drawer");
const backdrop=document.getElementById("drawer-backdrop");
const closeBtn=document.getElementById("drawer-close-btn");
if(!drawer)return;
const openDrawer=()=>{
drawer.classList.add("open");
if(backdrop)backdrop.classList.add("active");
document.body.style.overflow="hidden";
};
const closeDrawer=()=>{
drawer.classList.remove("open");
if(backdrop)backdrop.classList.remove("active");
document.body.style.overflow="";
};
if(hamburger)hamburger.addEventListener("click",openDrawer);
if(closeBtn)closeBtn.addEventListener("click",closeDrawer);
if(backdrop)backdrop.addEventListener("click",closeDrawer);
document.addEventListener("keydown",(e)=>{
if(e.key==="Escape"&&drawer.classList.contains("open")){
closeDrawer();
}
});
drawer.querySelectorAll(".drawer-link").forEach((link)=>{
link.addEventListener("click",closeDrawer);
});
},
initScrollHeader(){
const header=document.querySelector(".site-header");
if(!header)return;
let lastScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
let ticking=false;
const threshold=280;
const tolerance=6;
const onScroll=()=>{
const currentScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
const drawer=document.getElementById("mobile-drawer");
if(drawer&&drawer.classList.contains("open")){
lastScrollY=currentScrollY;
ticking=false;
return;
}
if(currentScrollY<=threshold){
header.classList.remove("header-hidden");
header.classList.toggle("header-scrolled",currentScrollY>10);
}else if(currentScrollY>lastScrollY+tolerance){
header.classList.add("header-hidden");
}else if(currentScrollY<lastScrollY-tolerance){
header.classList.remove("header-hidden");
header.classList.add("header-scrolled");
}
lastScrollY=currentScrollY<=0?0:currentScrollY;
ticking=false;
};
window.addEventListener("scroll",()=>{
if(!ticking){
window.requestAnimationFrame(onScroll);
ticking=true;
}
},{passive:true});
window.addEventListener("resize",()=>{
lastScrollY=window.pageYOffset||document.documentElement.scrollTop||0;
},{passive:true});
},
highlightCurrentPage(){
const currentPath=window.location.pathname.replace(/\/index\.html$/,"/").replace(/\/$/,"")||"/";
document.querySelectorAll(".nav-link, .drawer-link").forEach((link)=>{
const href=link.getAttribute("href");
if(!href)return;
const linkPath=href.replace(/\/index\.html$/,"/").replace(/\/$/,"")||"/";
if(linkPath===currentPath){
link.classList.add("active");
}else{
link.classList.remove("active");
}
});
}
};
window.Navigation=Navigation;