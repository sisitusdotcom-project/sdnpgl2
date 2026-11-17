const ProfilPage={
allGtk:[],
async init(){
await Promise.all([this.loadGTK(),this.renderFasilitas()]);
this.bindGtkFilters();
},
async loadGTK(){
const target=document.getElementById("profil-gtk-list");
if(!target)return;
try{
const res=await fetch("/assets/data/gtk.json");
if(!res.ok)throw new Error("HTTP "+res.status);
this.allGtk=await res.json();
const nonPimpinan=this.allGtk.filter((item)=>item.kategori!=="Pimpinan");
this.renderGTK(nonPimpinan);
}catch(err){
target.innerHTML='<div class="text-center text-muted w-100">Gagal memuat data dewan guru.</div>';
}
},
renderGTK(items){
const target=document.getElementById("profil-gtk-list");
if(!target)return;
if(!items||items.length===0){
target.innerHTML='<div class="text-center text-muted w-100">Tidak ada data pendidik pada kategori ini.</div>';
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
const cat=btn.getAttribute("data-cat");
if(!cat||cat==="all"){
const nonPimpinan=this.allGtk.filter((item)=>item.kategori!=="Pimpinan");
this.renderGTK(nonPimpinan);
}else{
const filtered=this.allGtk.filter((item)=>item.kategori.toLowerCase()===cat.toLowerCase());
this.renderGTK(filtered);
}
});
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
<div class="fasilitas-card">
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