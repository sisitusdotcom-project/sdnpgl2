const BeritaPage={
allNews:[],
activeFilter:"all",
searchQuery:"",
async init(){
await this.fetchNews();
this.bindFilters();
this.bindSearch();
this.bindModalEvents();
this.checkUrlReadParam();
},
async fetchNews(){
const gridTarget=document.getElementById("berita-grid-container");
try{
const res=await fetch("/assets/data/berita.json");
if(!res.ok)throw new Error("HTTP "+res.status);
this.allNews=await res.json();
this.renderFeatured();
this.applyFilters();
}catch(err){
if(gridTarget){
gridTarget.innerHTML='<div class="card p-3 text-center text-muted w-100">Gagal memuat warta sekolah. Silakan muat ulang halaman.</div>';
}
}
},
renderFeatured(){
const featuredTarget=document.getElementById("featured-story-container");
if(!featuredTarget)return;
const featured=this.allNews.find((item)=>item.featured)||this.allNews[0];
if(!featured){
featuredTarget.innerHTML="";
return;
}
featuredTarget.innerHTML=`
<article class="featured-story-card">
<div class="featured-media">
<img src="${featured.gambar}" alt="${featured.judul}" width="600" height="338" loading="lazy">
<span class="featured-floating-tag"><i class="ph-fill ph-megaphone"></i> SOROTAN UTAMA</span>
</div>
<div class="featured-body">
<div class="featured-meta-row">
<span><i class="ph-bold ph-calendar"></i>${featured.tanggal}</span>
<span><i class="ph-bold ph-user"></i>${featured.penulis}</span>
<span class="badge badge-primary">${featured.kategori}</span>
</div>
<h2 class="featured-title">${featured.judul}</h2>
<p class="featured-desc">${featured.ringkasan}</p>
<div class="featured-action-bar">
<button type="button" class="btn btn-primary btn-pill" data-read-id="${featured.id}">
<span>Baca Warta Lengkap</span>
<i class="ph-bold ph-arrow-right"></i>
</button>
</div>
</div>
</article>
`;
const featuredBtn=featuredTarget.querySelector("[data-read-id]");
if(featuredBtn){
featuredBtn.addEventListener("click",()=>{
this.openModal(featured);
});
}
},
applyFilters(){
const gridTarget=document.getElementById("berita-grid-container");
const featuredTarget=document.getElementById("featured-story-container");
if(featuredTarget){
const isSearching=Boolean(this.searchQuery&&this.searchQuery.trim()!=="");
featuredTarget.classList.toggle("d-none",isSearching);
}
if(!gridTarget)return;
let filtered=this.allNews;
if(this.activeFilter&&this.activeFilter!=="all"){
filtered=filtered.filter((n)=>n.kategori.toLowerCase()===this.activeFilter.toLowerCase());
}
if(this.searchQuery.trim()!==""){
const q=this.searchQuery.toLowerCase();
filtered=filtered.filter((n)=>n.judul.toLowerCase().includes(q)||n.ringkasan.toLowerCase().includes(q)||n.penulis.toLowerCase().includes(q));
}
if(!filtered||filtered.length===0){
gridTarget.innerHTML='<div class="card p-4 text-center text-muted w-100"><i class="ph ph-magnifying-glass empty-search-icon"></i>Tidak ada warta yang cocok dengan pencarian atau filter yang dipilih.</div>';
return;
}
gridTarget.innerHTML=filtered.map((item)=>{
const badgeClass=this.getBadgeClass(item.kategori);
return `
<article class="news-card">
<div class="news-media">
<img src="${item.gambar}" alt="${item.judul}" loading="lazy" width="400" height="225">
<span class="news-badge ${badgeClass}">${item.kategori}</span>
</div>
<div class="news-body">
<div class="news-meta">
<span><i class="ph-bold ph-calendar"></i>${item.tanggal}</span>
<span><i class="ph-bold ph-tag"></i>${item.badge}</span>
</div>
<h3 class="news-title">${item.judul}</h3>
<p class="news-desc">${item.ringkasan}</p>
<div class="news-action">
<span class="news-author">${item.penulis}</span>
<button type="button" class="news-read-btn" data-read-id="${item.id}">
<span>Baca Warta</span>
<i class="ph-bold ph-arrow-right"></i>
</button>
</div>
</div>
</article>
`;
}).join("");
this.bindReadButtons();
},
getBadgeClass(kategori){
const k=kategori.toLowerCase();
if(k==="pengumuman")return "badge-pengumuman";
if(k==="kurikulum")return "badge-kurikulum";
if(k==="prestasi")return "badge-prestasi";
return "badge-kbm";
},
bindFilters(){
const filterBtns=document.querySelectorAll(".filter-btn");
filterBtns.forEach((btn)=>{
btn.addEventListener("click",()=>{
filterBtns.forEach((b)=>b.classList.remove("active"));
btn.classList.add("active");
this.activeFilter=btn.getAttribute("data-filter")||"all";
this.applyFilters();
});
});
},
bindSearch(){
const searchForm=document.getElementById("berita-search-form");
const searchInput=document.getElementById("berita-search-input");
if(searchInput){
searchInput.addEventListener("input",(e)=>{
this.searchQuery=e.target.value;
this.applyFilters();
});
}
if(searchForm){
searchForm.addEventListener("submit",(e)=>{
e.preventDefault();
if(searchInput){
this.searchQuery=searchInput.value;
this.applyFilters();
}
});
}
const urlParams=new URLSearchParams(window.location.search);
if(urlParams.has("focus")||urlParams.has("q")){
const q=urlParams.get("q")||"";
if(searchInput){
searchInput.value=q;
this.searchQuery=q;
searchInput.focus();
searchInput.scrollIntoView({behavior:"smooth",block:"center"});
if(q){
this.applyFilters();
}
}
}
if(urlParams.has("cat")){
const c=urlParams.get("cat");
const matchingBtn=document.querySelector(`.filter-btn[data-filter="${c}"]`);
if(matchingBtn){
document.querySelectorAll(".filter-btn").forEach((b)=>b.classList.remove("active"));
matchingBtn.classList.add("active");
this.activeFilter=c;
this.applyFilters();
}
}
},
checkUrlReadParam(){
const urlParams=new URLSearchParams(window.location.search);
if(urlParams.has("read")){
const readId=urlParams.get("read");
const item=this.allNews.find((n)=>n.id===readId);
if(item){
setTimeout(()=>this.openModal(item),250);
}
}
},
bindReadButtons(){
const btns=document.querySelectorAll("[data-read-id]");
btns.forEach((btn)=>{
btn.addEventListener("click",()=>{
const id=btn.getAttribute("data-read-id");
const item=this.allNews.find((n)=>n.id===id);
if(item){
this.openModal(item);
}
});
});
},
openModal(item){
const modal=document.getElementById("berita-modal");
const modalImg=document.getElementById("modal-article-img");
const modalTitle=document.getElementById("modal-article-title");
const modalDate=document.getElementById("modal-article-date");
const modalAuthor=document.getElementById("modal-article-author");
const modalCat=document.getElementById("modal-article-cat");
const modalBody=document.getElementById("modal-article-paragraphs");
const shareWaBtn=document.getElementById("modal-share-wa");
const printBtn=document.getElementById("modal-print-btn");
if(!modal)return;
if(modalImg)modalImg.setAttribute("src",item.gambar);
if(modalTitle)modalTitle.textContent=item.judul;
if(modalDate)modalDate.textContent=item.tanggal;
if(modalAuthor)modalAuthor.textContent=item.penulis;
if(modalCat)modalCat.textContent=item.kategori;
if(modalBody){
const paragraphs=item.isi.split(/\n\s*\n/);
modalBody.innerHTML=paragraphs.map((p)=>`<p>${p.replace(/\n/g,"<br>")}</p>`).join("");
}
if(shareWaBtn){
const shareText=`Warta Resmi UPT SDN Punggul 02:
*${item.judul}* (${item.tanggal})
${item.ringkasan}
Baca selengkapnya di: ${window.location.origin}/berita/index.html?read=${item.id}`;
shareWaBtn.setAttribute("href",`https://wa.me/?text=${encodeURIComponent(shareText)}`);
}
if(printBtn){
printBtn.onclick=()=>window.print();
}
const copyBtn=document.getElementById("modal-copy-link");
if(copyBtn){
copyBtn.onclick=()=>{
const url=`${window.location.origin}/berita/index.html?read=${item.id}`;
navigator.clipboard.writeText(url).then(()=>{
const txt=document.getElementById("copy-btn-text");
if(txt){
txt.textContent="Tersalin!";
setTimeout(()=>{txt.textContent="Salin Tautan";},2000);
}
}).catch(()=>{});
};
}
modal.classList.add("active");
document.body.style.overflow="hidden";
},
closeModal(){
const modal=document.getElementById("berita-modal");
if(!modal)return;
modal.classList.remove("active");
document.body.style.overflow="";
},
bindModalEvents(){
const modal=document.getElementById("berita-modal");
const closeBtn=document.getElementById("berita-modal-close");
if(!modal)return;
if(closeBtn)closeBtn.addEventListener("click",()=>this.closeModal());
modal.addEventListener("click",(e)=>{
if(e.target===modal)this.closeModal();
});
document.addEventListener("keydown",(e)=>{
if(e.key==="Escape"&&modal.classList.contains("active"))this.closeModal();
});
}
};
document.addEventListener("layoutReady",()=>{
BeritaPage.init();
});