const Layout={
searchData:null,
lightboxItems:[],
lightboxIndex:0,
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
initBackToTop(){
const btn=document.getElementById("back-to-top-btn");
if(!btn)return;
window.addEventListener("scroll",()=>{
if(window.scrollY>280){
btn.classList.add("visible");
}else{
btn.classList.remove("visible");
}
},{passive:true});
btn.addEventListener("click",()=>{
window.scrollTo({top:0,behavior:"smooth"});
});
},
initNewsletter(){
document.addEventListener("submit",(e)=>{
const form=e.target.closest(".newsletter-form");
if(!form)return;
e.preventDefault();
const input=form.querySelector(".newsletter-input");
const val=input?input.value.trim():"";
if(!val)return;
try{
const saved=JSON.parse(localStorage.getItem("newsletter_subscribers")||"[]");
if(!saved.includes(val)){
saved.push(val);
localStorage.setItem("newsletter_subscribers",JSON.stringify(saved));
}
}catch(err){}
const btn=form.querySelector(".newsletter-btn");
if(btn){
btn.innerHTML='<i class="ph-bold ph-check"></i>';
setTimeout(()=>{
btn.innerHTML='<i class="ph-bold ph-arrow-right"></i>';
},3000);
}
input.value="";
input.placeholder="Terima kasih telah berlangganan!";
setTimeout(()=>{
input.placeholder="Masukkan email / no WA...";
},4000);
});
},
async loadSearchData(){
if(this.searchData)return this.searchData;
try{
const [resBerita,resGtk,resEkskul,resPrestasi,resFaq]=await Promise.all([
fetch("/assets/data/berita.json").then((r)=>r.json()).catch(()=>[]),
fetch("/assets/data/gtk.json").then((r)=>r.json()).catch(()=>[]),
fetch("/assets/data/ekstrakurikuler.json").then((r)=>r.json()).catch(()=>[]),
fetch("/assets/data/prestasi.json").then((r)=>r.json()).catch(()=>[]),
fetch("/assets/data/faq.json").then((r)=>r.json()).catch(()=>[])
]);
this.searchData={
berita:resBerita,
gtk:resGtk,
ekskul:resEkskul,
prestasi:resPrestasi,
faq:resFaq
};
return this.searchData;
}catch(err){
return null;
}
},
initGlobalSearch(){
document.addEventListener("click",async(e)=>{
const trigger=e.target.closest("#header-search-btn");
if(trigger){
e.preventDefault();
Layout.openSearchModal();
}
});
document.addEventListener("keydown",(e)=>{
if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==="k"){
e.preventDefault();
Layout.openSearchModal();
}
if(e.key==="Escape"){
Layout.closeSearchModal();
Layout.closeLightbox();
}
});
const modal=document.getElementById("global-search-modal");
const closeBtn=document.getElementById("search-modal-close");
const input=document.getElementById("global-search-input");
const clearBtn=document.getElementById("search-modal-clear");
const resultsContainer=document.getElementById("global-search-results");
if(closeBtn){
closeBtn.addEventListener("click",()=>Layout.closeSearchModal());
}
if(modal){
modal.addEventListener("click",(e)=>{
if(e.target===modal)Layout.closeSearchModal();
});
}
if(clearBtn&&input){
clearBtn.addEventListener("click",()=>{
input.value="";
clearBtn.classList.remove("active");
if(resultsContainer){
resultsContainer.innerHTML='<div class="search-hints"><i class="ph ph-info"></i> Ketik minimal 2 karakter untuk mencari di seluruh data SDN Punggul 02...</div>';
}
input.focus();
});
}
let searchFocusIndex=-1;
if(input&&resultsContainer){
input.addEventListener("keydown",(e)=>{
const items=resultsContainer.querySelectorAll(".search-result-item");
if(items.length===0)return;
if(e.key==="ArrowDown"){
e.preventDefault();
searchFocusIndex=(searchFocusIndex+1)%items.length;
items.forEach((it,idx)=>it.classList.toggle("focused",idx===searchFocusIndex));
items[searchFocusIndex].scrollIntoView({block:"nearest"});
}else if(e.key==="ArrowUp"){
e.preventDefault();
searchFocusIndex=(searchFocusIndex-1+items.length)%items.length;
items.forEach((it,idx)=>it.classList.toggle("focused",idx===searchFocusIndex));
items[searchFocusIndex].scrollIntoView({block:"nearest"});
}else if(e.key==="Enter"&&searchFocusIndex>=0&&items[searchFocusIndex]){
e.preventDefault();
items[searchFocusIndex].click();
}
});
input.addEventListener("input",async(e)=>{
searchFocusIndex=-1;
const q=e.target.value.trim().toLowerCase();
if(clearBtn)clearBtn.classList.toggle("active",Boolean(q));
if(q.length<2){
resultsContainer.innerHTML='<div class="search-hints"><i class="ph ph-info"></i> Ketik minimal 2 karakter untuk mencari di seluruh data SDN Punggul 02...</div>';
return;
}
const data=await Layout.loadSearchData();
if(!data){
resultsContainer.innerHTML='<div class="search-hints text-danger">Gagal memuat basis data pencarian.</div>';
return;
}
let matches=[];
data.berita.forEach((b)=>{
if(b.judul.toLowerCase().includes(q)||b.ringkasan.toLowerCase().includes(q)||b.penulis.toLowerCase().includes(q)){
matches.push({
type:"Warta & Pengumuman",
icon:"ph-newspaper",
title:b.judul,
desc:b.ringkasan,
link:`/berita/index.html?read=${b.id}`
});
}
});
data.gtk.forEach((g)=>{
if(g.nama.toLowerCase().includes(q)||g.jabatan.toLowerCase().includes(q)||g.kategori.toLowerCase().includes(q)){
matches.push({
type:"Dewan Guru & GTK",
icon:"ph-chalkboard-teacher",
title:g.nama,
desc:`${g.jabatan} &bull; ${g.pendidikan}`,
link:"/profil/index.html#profil-gtk-list"
});
}
});
data.ekskul.forEach((ek)=>{
if(ek.nama.toLowerCase().includes(q)||ek.deskripsi.toLowerCase().includes(q)||ek.kategori.toLowerCase().includes(q)){
matches.push({
type:"Ekstrakurikuler",
icon:"ph-star",
title:ek.nama,
desc:`${ek.kategori} &bull; Pembina: ${ek.pembina}`,
link:"/akademik/index.html#akademik-ekskul-list"
});
}
});
data.prestasi.forEach((p)=>{
if(p.nama.toLowerCase().includes(q)||p.peraih.toLowerCase().includes(q)||p.tingkat.toLowerCase().includes(q)){
matches.push({
type:"Prestasi Siswa",
icon:"ph-trophy",
title:p.nama,
desc:`${p.peraih} &bull; ${p.tingkat} (${p.tahun})`,
link:"/akademik/index.html#prestasi"
});
}
});
data.faq.forEach((f)=>{
if(f.pertanyaan.toLowerCase().includes(q)||f.jawaban.toLowerCase().includes(q)){
matches.push({
type:"Tanya Jawab SPMB",
icon:"ph-question",
title:f.pertanyaan,
desc:f.jawaban,
link:"/spmb/index.html#syarat-spmb"
});
}
});
if(matches.length===0){
resultsContainer.innerHTML=`<div class="search-hints"><i class="ph ph-magnifying-glass"></i> Tidak ditemukan hasil untuk "<strong>${q}</strong>".</div>`;
return;
}
resultsContainer.innerHTML=matches.slice(0,10).map((m)=>`
<a href="${m.link}" class="search-result-item">
<div class="search-result-icon"><i class="ph-bold ${m.icon}"></i></div>
<div class="search-result-content">
<div class="search-group-title">${m.type}</div>
<div class="search-result-title">${m.title}</div>
<div class="search-result-desc">${m.desc}</div>
</div>
<i class="ph-bold ph-caret-right text-muted"></i>
</a>
`).join("");
});
}
},
openSearchModal(){
const modal=document.getElementById("global-search-modal");
const input=document.getElementById("global-search-input");
if(!modal)return;
modal.classList.add("active");
document.body.style.overflow="hidden";
if(input){
setTimeout(()=>input.focus(),100);
}
this.loadSearchData();
},
closeSearchModal(){
const modal=document.getElementById("global-search-modal");
if(!modal)return;
modal.classList.remove("active");
document.body.style.overflow="";
},
initLightbox(){
const modal=document.getElementById("global-lightbox");
const closeBtn=document.getElementById("lightbox-close");
const prevBtn=document.getElementById("lightbox-prev");
const nextBtn=document.getElementById("lightbox-next");
if(closeBtn)closeBtn.addEventListener("click",()=>Layout.closeLightbox());
if(prevBtn)prevBtn.addEventListener("click",()=>Layout.prevLightbox());
if(nextBtn)nextBtn.addEventListener("click",()=>Layout.nextLightbox());
if(modal){
modal.addEventListener("click",(e)=>{
if(e.target===modal||e.target.classList.contains("lightbox-stage"))Layout.closeLightbox();
});
}
document.addEventListener("keydown",(e)=>{
const m=document.getElementById("global-lightbox");
if(!m||!m.classList.contains("active"))return;
if(e.key==="ArrowLeft")Layout.prevLightbox();
if(e.key==="ArrowRight")Layout.nextLightbox();
});
this.bindAutoLightbox();
},
bindAutoLightbox(){
document.addEventListener("click",(e)=>{
const target=e.target.closest(".mosaic-card, .fasilitas-card, .ekskul-card, .galeri-card, [data-lightbox]");
if(!target)return;
e.preventDefault();
const img=target.querySelector("img");
if(!img)return;
const title=target.querySelector(".mosaic-title, .fasilitas-title, .ekskul-title, .galeri-title")?.textContent||img.alt||"Dokumentasi";
const tag=target.querySelector(".mosaic-tag, .fasilitas-badge, .ekskul-badge-overlay, .galeri-badge")?.textContent||"Kegiatan";
const parent=target.parentElement;
let items=[];
if(parent){
const siblings=Array.from(parent.querySelectorAll(".mosaic-card, .fasilitas-card, .ekskul-card, .galeri-card"));
if(siblings.length>1){
items=siblings.map((sib)=>{
const sImg=sib.querySelector("img");
const sTitle=sib.querySelector(".mosaic-title, .fasilitas-title, .ekskul-title, .galeri-title")?.textContent||sImg?.alt||"Dokumentasi";
const sTag=sib.querySelector(".mosaic-tag, .fasilitas-badge, .ekskul-badge-overlay, .galeri-badge")?.textContent||"Kegiatan";
return {src:sImg?.src||"",title:sTitle,tag:sTag};
});
const idx=siblings.indexOf(target);
Layout.openLightbox(items,idx>=0?idx:0);
return;
}
}
Layout.openLightbox([{src:img.src,title,tag}],0);
});
},
openLightbox(items,index=0){
const modal=document.getElementById("global-lightbox");
if(!modal||!items||items.length===0)return;
this.lightboxItems=items;
this.lightboxIndex=index;
this.renderLightboxView();
modal.classList.add("active");
document.body.style.overflow="hidden";
},
renderLightboxView(){
const img=document.getElementById("lightbox-img");
const title=document.getElementById("lightbox-title");
const tag=document.getElementById("lightbox-tag");
const counter=document.getElementById("lightbox-counter");
const prevBtn=document.getElementById("lightbox-prev");
const nextBtn=document.getElementById("lightbox-next");
const item=this.lightboxItems[this.lightboxIndex];
if(!item)return;
if(img){
img.src=item.src;
img.alt=item.title;
}
if(title)title.textContent=item.title;
if(tag)tag.textContent=item.tag;
if(counter)counter.textContent=`${this.lightboxIndex+1} / ${this.lightboxItems.length}`;
if(prevBtn)prevBtn.style.display=this.lightboxItems.length>1?"flex":"none";
if(nextBtn)nextBtn.style.display=this.lightboxItems.length>1?"flex":"none";
},
prevLightbox(){
if(this.lightboxItems.length<=1)return;
this.lightboxIndex=(this.lightboxIndex-1+this.lightboxItems.length)%this.lightboxItems.length;
this.renderLightboxView();
},
nextLightbox(){
if(this.lightboxItems.length<=1)return;
this.lightboxIndex=(this.lightboxIndex+1)%this.lightboxItems.length;
this.renderLightboxView();
},
closeLightbox(){
const modal=document.getElementById("global-lightbox");
if(!modal)return;
modal.classList.remove("active");
document.body.style.overflow="";
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
initFontScale(){
const savedScale=localStorage.getItem("font_scale");
if(savedScale==="large"){
document.documentElement.classList.add("large-font");
}
document.addEventListener("click",(e)=>{
const btn=e.target.closest("#font-scale-btn");
if(!btn)return;
const isLarge=document.documentElement.classList.toggle("large-font");
localStorage.setItem("font_scale",isLarge?"large":"normal");
});
},
async init(){
this.initTheme();
this.initFontScale();
this.initImageFallback();
this.initNewsletter();
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
this.initBackToTop();
this.initGlobalSearch();
this.initLightbox();
this.initInstagram();
document.dispatchEvent(new CustomEvent("layoutReady"));
}
};
window.Layout=Layout;