const AkademikPage={
allPrestasi:[],
activePrestasiCat:"all",
activePrestasiYear:"all",
async init(){
await Promise.all([this.renderEkskul(),this.renderPrestasi()]);
this.bindPrestasiFilters();
if(window.location.hash){
const target=document.querySelector(window.location.hash);
if(target){
setTimeout(()=>target.scrollIntoView({behavior:"smooth",block:"start"}),150);
}
}
},
async renderEkskul(){
const target=document.getElementById("akademik-ekskul-list");
if(!target)return;
try{
const res=await fetch("/assets/data/ekstrakurikuler.json");
if(!res.ok)throw new Error("HTTP "+res.status);
const data=await res.json();
target.innerHTML=data.map((item)=>{
const imgSrc=item.gambar.startsWith("http")?item.gambar:item.gambar;
return `
<div class="ekskul-card" data-lightbox>
<div class="ekskul-media">
<img src="${imgSrc}" alt="${item.nama}" loading="lazy" width="340" height="210">
<span class="ekskul-badge-overlay">${item.kategori}</span>
</div>
<div class="ekskul-body">
<h3 class="ekskul-title">${item.nama}</h3>
<p class="ekskul-desc">${item.deskripsi}</p>
<div class="ekskul-meta">
<div class="ekskul-meta-row"><i class="ph-bold ph-user"></i><span>${item.pembina}</span></div>
<div class="ekskul-meta-row"><i class="ph-bold ph-calendar"></i><span>${item.jadwal}</span></div>
</div>
</div>
</div>
`;
}).join("");
}catch(err){
target.innerHTML='<div class="text-center text-muted w-100">Gagal memuat data ekstrakurikuler.</div>';
}
},
async renderPrestasi(){
const target=document.getElementById("akademik-prestasi-body");
if(!target)return;
try{
const res=await fetch("/assets/data/prestasi.json");
if(!res.ok)throw new Error("HTTP "+res.status);
this.allPrestasi=await res.json();
this.applyPrestasiFilters();
}catch(err){
target.innerHTML='<tr><td colspan="6" class="text-center text-muted">Gagal memuat rekam jejak prestasi.</td></tr>';
}
},
applyPrestasiFilters(){
const target=document.getElementById("akademik-prestasi-body");
if(!target)return;
let filtered=this.allPrestasi;
if(this.activePrestasiCat!=="all"){
filtered=filtered.filter((p)=>p.kategori.toLowerCase().includes(this.activePrestasiCat.toLowerCase()));
}
if(this.activePrestasiYear!=="all"){
filtered=filtered.filter((p)=>p.tahun===this.activePrestasiYear);
}
if(filtered.length===0){
target.innerHTML='<tr><td colspan="6" class="text-center text-muted p-md"><i class="ph ph-trophy"></i> Tidak ada catatan prestasi pada kategori atau tahun yang dipilih.</td></tr>';
return;
}
target.innerHTML=filtered.map((item,index)=>`
<tr>
<td>${index+1}</td>
<td class="font-bold">${item.nama}</td>
<td><span class="badge badge-primary">${item.kategori}</span></td>
<td>${item.tingkat}</td>
<td>${item.peraih}</td>
<td>${item.tahun}</td>
</tr>
`).join("");
},
bindPrestasiFilters(){
const pills=document.querySelectorAll("#prestasi-cat-filter .filter-btn");
const yearSelect=document.getElementById("prestasi-year-select");
pills.forEach((btn)=>{
btn.addEventListener("click",()=>{
pills.forEach((b)=>b.classList.remove("active"));
btn.classList.add("active");
this.activePrestasiCat=btn.getAttribute("data-pcat")||"all";
this.applyPrestasiFilters();
});
});
if(yearSelect){
yearSelect.addEventListener("change",(e)=>{
this.activePrestasiYear=e.target.value;
this.applyPrestasiFilters();
});
}
}
};
document.addEventListener("layoutReady",()=>{
AkademikPage.init();
});