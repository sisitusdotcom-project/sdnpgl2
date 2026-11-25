const ProfilPage={
allGtk:[],
activeCategory:"all",
searchQuery:"",
async init(){
await Promise.all([this.loadGTK(),this.renderFasilitas()]);
this.bindGtkFilters();
this.bindGtkSearch();
if(window.location.hash){
const target=document.querySelector(window.location.hash);
if(target){
setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),150);
}
}
},
async loadGTK(){
const target=document.getElementById("profil-gtk-list");
if(!target)return;
try{
const res=await fetch("/assets/data/gtk.json");
if(!res.ok)throw new Error("HTTP "+res.status);
this.allGtk=await res.json();
this.applyGtkFilters();
}catch(err){
target.innerHTML='<div class="text-center text-muted w-100">Gagal memuat data dewan guru.</div>';
}
},
applyGtkFilters(){
let filtered=this.allGtk.filter((item)=>item.kategori!=="Pimpinan");
if(this.activeCategory&&this.activeCategory!=="all"){
filtered=filtered.filter((item)=>item.kategori.toLowerCase()===this.activeCategory.toLowerCase());
}
if(this.searchQuery.trim()!==""){
const q=this.searchQuery.toLowerCase();
filtered=filtered.filter((item)=>item.nama.toLowerCase().includes(q)||item.jabatan.toLowerCase().includes(q)||item.pendidikan.toLowerCase().includes(q));
}
this.renderGTK(filtered);
},
renderGTK(items){
const target=document.getElementById("profil-gtk-list");
if(!target)return;
if(!items||items.length===0){
target.innerHTML='<div class="text-center text-muted w-100 p-md"><i class="ph ph-magnifying-glass"></i> Tidak ada tenaga pendidik yang cocok dengan pencarian atau filter ini.</div>';
return;
}
target.innerHTML=items.map((item)=>{
const fotoSrc=item.foto.startsWith("http")?item.foto:item.foto;
return `
<div class="gtk-card">
<div class="gtk-avatar">
<img src="${fotoSrc}" alt="${item.nama}" loading="lazy" width="80" height="80">
</div>
<div class="gtk-name">${item.nama}</div>
<div class="gtk-role">${item.jabatan}</div>
<div class="gtk-nip">NIP: ${item.nip}</div>
<div class="gtk-edu-badge">${item.pendidikan}</div>
</div>
`;
}).join("");
},
bindGtkFilters(){
const buttons=document.querySelectorAll(".gtk-filter-btn");
buttons.forEach((btn)=>{
btn.addEventListener("click",()=>{
buttons.forEach((b)=>b.classList.remove("active"));
btn.classList.add("active");
this.activeCategory=btn.getAttribute("data-cat")||"all";
this.applyGtkFilters();
});
});
},
bindGtkSearch(){
const input=document.getElementById("gtk-search-input");
if(!input)return;
input.addEventListener("input",(e)=>{
this.searchQuery=e.target.value;
this.applyGtkFilters();
});
},
async renderFasilitas(){
const target=document.getElementById("profil-fasilitas-list");
if(!target)return;
try{
const res=await fetch("/assets/data/fasilitas.json");
if(!res.ok)throw new Error("HTTP "+res.status);
const data=await res.json();
target.innerHTML=data.map((item)=>{
const imgSrc=item.gambar.startsWith("http")?item.gambar:item.gambar;
return `
<div class="fasilitas-card" id="${item.id}" data-lightbox>
<div class="fasilitas-media">
<img src="${imgSrc}" alt="${item.nama}" loading="lazy" width="340" height="210">
<span class="fasilitas-badge">${item.badge}</span>
</div>
<div class="fasilitas-body">
<div class="fasilitas-header-row">
<h3 class="fasilitas-title">${item.nama}</h3>
<span class="fasilitas-qty">${item.jumlah}</span>
</div>
<p class="fasilitas-desc">${item.deskripsi}</p>
</div>
</div>
`;
}).join("");
}catch(err){
target.innerHTML='<div class="text-center text-muted w-100">Gagal memuat data sarana prasarana.</div>';
}
}
};
document.addEventListener("layoutReady",()=>{
ProfilPage.init();
});