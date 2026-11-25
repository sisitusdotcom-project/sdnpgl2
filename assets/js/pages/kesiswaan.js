const KesiswaanPage={
photos:[],
async init(){
await this.loadGallery();
this.bindFilters();
this.bindLightbox();
if(window.location.hash){
const target=document.querySelector(window.location.hash);
if(target){
setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),150);
}
}
},
async loadGallery(){
try{
const res=await fetch("/assets/data/galeri.json");
if(!res.ok)throw new Error("HTTP "+res.status);
this.photos=await res.json();
this.renderGallery(this.photos);
}catch(err){
const container=document.getElementById("kesiswaan-gallery-container");
if(container){
container.innerHTML='<div class="card p-3 text-center text-muted">Gagal memuat galeri kegiatan. Silakan muat ulang halaman.</div>';
}
}
},
renderGallery(items){
const container=document.getElementById("kesiswaan-gallery-container");
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
const cards=document.querySelectorAll(".galeri-card");
cards.forEach((card)=>{
card.addEventListener("click",()=>{
const img=card.getAttribute("data-img");
const title=card.getAttribute("data-title");
const cat=card.getAttribute("data-cat");
const date=card.getAttribute("data-date");
const desc=card.getAttribute("data-desc");
this.openLightbox({img,title,cat,date,desc});
});
});
},
openLightbox(data){
const modal=document.getElementById("kesiswaan-modal");
const modalImg=document.getElementById("kesiswaan-modal-img");
const modalTitle=document.getElementById("kesiswaan-modal-title");
const modalCat=document.getElementById("kesiswaan-modal-cat");
const modalDate=document.getElementById("kesiswaan-modal-date");
const modalDesc=document.getElementById("kesiswaan-modal-desc");
if(!modal)return;
if(modalImg)modalImg.setAttribute("src",data.img);
if(modalTitle)modalTitle.textContent=data.title;
if(modalCat)modalCat.textContent=data.cat;
if(modalDate)modalDate.textContent=data.date;
if(modalDesc)modalDesc.textContent=data.desc;
modal.classList.add("active");
document.body.style.overflow="hidden";
},
closeLightbox(){
const modal=document.getElementById("kesiswaan-modal");
if(!modal)return;
modal.classList.remove("active");
document.body.style.overflow="";
},
bindLightbox(){
const modal=document.getElementById("kesiswaan-modal");
const closeBtn=document.getElementById("kesiswaan-modal-close");
if(!modal)return;
if(closeBtn)closeBtn.addEventListener("click",()=>this.closeLightbox());
modal.addEventListener("click",(e)=>{
if(e.target===modal)this.closeLightbox();
});
document.addEventListener("keydown",(e)=>{
if(e.key==="Escape"&&modal.classList.contains("active"))this.closeLightbox();
});
}
};
document.addEventListener("layoutReady",()=>{
KesiswaanPage.init();
});