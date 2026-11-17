const SPMBPage={
async init(){
await this.renderFAQ();
this.initAgeChecker();
},
async renderFAQ(){
const target=document.getElementById("spmb-faq-container");
if(!target)return;
try{
const res=await fetch("/assets/data/faq.json");
if(!res.ok)throw new Error("HTTP "+res.status);
const data=await res.json();
target.innerHTML=data.map((item,index)=>`
<div class="faq-item${index===0?" active":""}">
<button type="button" class="faq-trigger" aria-expanded="${index===0?"true":"false"}">
<span>${item.pertanyaan}</span>
<i class="ph-bold ph-caret-down"></i>
</button>
<div class="faq-content">
<p class="mb-0">${item.jawaban}</p>
</div>
</div>
`).join("");
this.bindAccordion();
}catch(err){
target.innerHTML='<div class="text-center text-muted w-100">Gagal memuat tanya jawab pendaftaran.</div>';
}
},
bindAccordion(){
document.querySelectorAll(".faq-trigger").forEach((btn)=>{
btn.addEventListener("click",()=>{
const item=btn.closest(".faq-item");
const wasActive=item.classList.contains("active");
document.querySelectorAll(".faq-item").forEach((i)=>{
i.classList.remove("active");
const trigger=i.querySelector(".faq-trigger");
if(trigger)trigger.setAttribute("aria-expanded","false");
});
if(!wasActive){
item.classList.add("active");
btn.setAttribute("aria-expanded","true");
}
});
});
},
initAgeChecker(){
const btn=document.getElementById("btn-cek-usia");
const input=document.getElementById("input-tgl-lahir");
const resultBox=document.getElementById("spmb-calc-result");
if(!btn||!input||!resultBox)return;
btn.addEventListener("click",()=>{
const val=input.value;
if(!val){
resultBox.classList.add("active");
resultBox.innerHTML='<div class="calc-result-title text-accent">Silakan pilih tanggal lahir calon siswa terlebih dahulu.</div>';
return;
}
const birthDate=new Date(val);
const targetDate=new Date(2026,6,1);
let years=targetDate.getFullYear()-birthDate.getFullYear();
let months=targetDate.getMonth()-birthDate.getMonth();
if(targetDate.getDate()<birthDate.getDate()){
months--;
}
if(months<0){
years--;
months+=12;
}
if(years<0){
resultBox.classList.add("active");
resultBox.innerHTML='<div class="calc-result-title text-accent">Tanggal lahir tidak valid untuk tahun ajaran 2026/2027.</div>';
return;
}
let badgeClass="badge-danger";
let badgeText="Belum Cukup Umur";
let title="Belum Memenuhi Ketentuan Usia Masuk SD Negeri";
let msg="Sesuai Permendikbudristek, calon peserta didik baru kelas 1 SD negeri harus berusia minimal 6 tahun pada 1 Juli 2026. Kami menyarankan ananda melanjutkan penguatan di jenjang TK/RA terlebih dahulu.";
if(years>=7){
badgeClass="badge-primary";
badgeText="Prioritas Utama";
title="Prioritas Tertinggi (Pasti Diterima Jalur Zonasi)";
msg="Alhamdulillah! Usia ananda telah mencapai usia emas sekolah dasar (7 tahun atau lebih). Ananda mendapatkan prioritas utama penerimaan jalur zonasi selama kuota zonasi tersedia.";
}else if(years===6){
badgeClass="badge-secondary";
badgeText="Memenuhi Syarat";
title="Memenuhi Syarat Usia Masuk Kelas 1 SD";
msg="Ananda telah berusia 6 tahun per 1 Juli 2026 dan memenuhi syarat pendaftaran resmi SD Negeri. Penerimaan dilakukan berdasarkan pemeringkatan urutan usia dan kuota rombel.";
}else if(years===5&&months>=6){
badgeClass="badge-accent";
badgeText="Perlu Rekomendasi";
title="Dapat Diterima dengan Rekomendasi Tertulis";
msg="Ananda berusia antara 5 tahun 6 bulan hingga 5 tahun 11 bulan. Dapat dipertimbangkan jika daya tampung masih ada, dengan syarat melampirkan surat rekomendasi tertulis dari psikolog profesional atau dewan guru TK/RA.";
}
resultBox.classList.add("active");
resultBox.innerHTML=`
<div class="calc-result-header">
<span class="badge ${badgeClass}">${badgeText}</span>
<span class="calc-result-age">Usia per 1 Juli 2026: ${years} Tahun ${months} Bulan</span>
</div>
<div class="calc-result-title">${title}</div>
<p class="calc-result-msg">${msg}</p>
`;
});
}
};
document.addEventListener("layoutReady",()=>{
SPMBPage.init();
});