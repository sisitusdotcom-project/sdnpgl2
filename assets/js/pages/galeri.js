const GaleriPage={
photos:[],
async init(){
await this.loadGallery();
this.bindFilters();
this.bindCardClicks();
},
async loadGallery(){
try{
const res=await fetch("/assets/data/galeri.json");
if(!res.ok)throw new Error("HTTP "+res.status);
this.photos=await res.json();
this.renderGallery(this.photos);
}catch(err){
const container=document.getElementById("galeri-grid-container");
if(container){
container.innerHTML='<div class="card p-3 text-center text-muted">Gagal memuat galeri kegiatan. Silakan muat ulang halaman.</div>';
}
}
},
renderGallery(items){
const container=document.getElementById("galeri-grid-container");
if(!container)return;
if(!items||items.length===0){
container.innerHTML='<div class="card p-3 text-center text-muted">Tidak ada foto kegiatan pada kategori ini.</div>';
return;
}
container.innerHTML=items.map((p)=>{
return `
<div class="galeri-card" data-id="${p.id}" data-img="${p.img}" data-title="${p.judul}" data-cat="${p.kategori}" data-date="${p.tanggal}" data-desc="${p.deskripsi}">
<div class="galeri-media">
<img src="${p.img}" alt="${p.judul}" loading="lazy" width="400" height="300">
<span class="galeri-badge">${p.kategori}</span>
</div>
<div class="galeri-body">
<div class="galeri-date"><i class="ph-bold ph-calendar"></i><span>${p.tanggal}</span></div>
<h3 class="galeri-title">${p.judul}</h3>
<p class="galeri-desc">${p.deskripsi}</p>
<div class="galeri-action-row">
<span class="galeri-zoom-btn"><i class="ph-bold ph-magnifying-glass-plus"></i><span>Pratinjau Foto</span></span>
</div>
</div>
</div>
`;
}).join("");
this.bindCardClicks();
},
bindFilters(){
const filterBtns=document.querySelectorAll(".galeri-filter-btn");
filterBtns.forEach((btn)=>{
btn.addEventListener("click",()=>{
filterBtns.forEach((b)=>b.classList.remove("active"));
btn.classList.add("active");
const cat=btn.getAttribute("data-cat");
if(!cat||cat==="all"){
this.renderGallery(this.photos);
}else{
const filtered=this.photos.filter((p)=>p.kategori.toLowerCase()===cat.toLowerCase());
this.renderGallery(filtered);
}
});
});
},
bindCardClicks(){
const cards=document.querySelectorAll("#galeri-grid-container .galeri-card");
cards.forEach((card,idx)=>{
card.addEventListener("click",()=>{
if(window.Layout&&typeof window.Layout.openLightbox==="function"){
const currentCards=Array.from(document.querySelectorAll("#galeri-grid-container .galeri-card"));
const items=currentCards.map((c)=>{
const img=c.getAttribute("data-img")||c.querySelector("img")?.src||"";
const title=c.getAttribute("data-title")||c.querySelector(".galeri-title")?.textContent||"Dokumentasi";
const tag=c.getAttribute("data-cat")||c.querySelector(".galeri-badge")?.textContent||"Kegiatan";
return {src:img,title,tag};
});
window.Layout.openLightbox(items,idx);
}
});
});
}
};
document.addEventListener("layoutReady",()=>{
GaleriPage.init();
});