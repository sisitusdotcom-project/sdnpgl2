const SPMBPage={
async init(){
await this.renderFAQ();
this.initAgeChecker();
this.initZonasiChecker();
this.initChecklist();
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
},
initZonasiChecker(){
const btnCalc=document.getElementById("btn-cek-zonasi");
const btnGps=document.getElementById("btn-gps-zonasi");
const select=document.getElementById("select-zonasi-wilayah");
const resultBox=document.getElementById("spmb-zonasi-result");
if(!resultBox)return;
const schoolLat=-7.3989;
const schoolLon=112.7331;
const haversine=(lat1,lon1,lat2,lon2)=>{
const R=6371;
const dLat=(lat2-lat1)*Math.PI/180;
const dLon=(lon2-lon1)*Math.PI/180;
const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);
const c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
return R*c;
};
const displayResult=(distanceKm,locName)=>{
resultBox.classList.add("active");
let badgeClass="badge-primary";
let badgeText="Zonasi Ring 1";
let title="Prioritas Mutlak Wilayah Desa Punggul";
let msg="Lokasi domisili berada di kawasan ring utama SDN Punggul 02. Berkas pendaftaran ananda memiliki peluang kelulusan tertinggi pada jalur Zonasi Domisili.";
if(distanceKm<1.0){
badgeClass="badge-primary";
badgeText="Zonasi Ring 1 (< 1.0 km)";
title="Prioritas Mutlak Wilayah Desa Punggul";
msg=`Lokasi domisili (${locName}) berjarak sekitar ${(distanceKm*1000).toFixed(0)} meter dari sekolah. Masuk kuota prioritas utama zonasi desa.`;
}else if(distanceKm<=2.5){
badgeClass="badge-secondary";
badgeText="Zonasi Ring 2 (1.0 - 2.5 km)";
title="Wilayah Zonasi Kecamatan Gedangan";
msg=`Lokasi domisili (${locName}) berjarak sekitar ${distanceKm.toFixed(2)} km dari sekolah. Berada dalam cakupan zonasi antar-desa se-Kecamatan Gedangan.`;
}else{
badgeClass="badge-accent";
badgeText="Luar Zonasi (> 2.5 km)";
title="Zonasi Luar / Jalur Lain Disarankan";
msg=`Lokasi domisili (${locName}) berjarak sekitar ${distanceKm.toFixed(2)} km dari sekolah. Disarankan memanfaatkan Jalur Afirmasi atau Mutasi Orang Tua jika kuota zonasi terpenuhi.`;
}
resultBox.innerHTML=`
<div class="calc-result-header">
<span class="badge ${badgeClass}">${badgeText}</span>
<span class="calc-result-age">Estimasi Jarak: ${distanceKm<1?(distanceKm*1000).toFixed(0)+" Meter":distanceKm.toFixed(2)+" Km"}</span>
</div>
<div class="calc-result-title">${title}</div>
<p class="calc-result-msg">${msg}</p>
`;
};
if(btnCalc&&select){
btnCalc.addEventListener("click",()=>{
const val=select.value;
if(!val){
resultBox.classList.add("active");
resultBox.innerHTML='<div class="calc-result-title text-accent">Silakan pilih nama dusun atau desa domisili terlebih dahulu.</div>';
return;
}
const parts=val.split(",");
const lat=parseFloat(parts[0]);
const lon=parseFloat(parts[1]);
const name=parts[2]||"Domisili Anda";
const dist=haversine(lat,lon,schoolLat,schoolLon);
displayResult(dist,name);
});
}
if(btnGps){
btnGps.addEventListener("click",()=>{
if(!navigator.geolocation){
alert("Perangkat Anda tidak mendukung fitur geolokasi GPS.");
return;
}
btnGps.disabled=true;
btnGps.innerHTML='<i class="ph ph-spinner"></i><span>Mencari GPS...</span>';
navigator.geolocation.getCurrentPosition((pos)=>{
btnGps.disabled=false;
btnGps.innerHTML='<i class="ph-bold ph-crosshair"></i><span>GPS Saya</span>';
const userLat=pos.coords.latitude;
const userLon=pos.coords.longitude;
const dist=haversine(userLat,userLon,schoolLat,schoolLon);
displayResult(dist,"GPS Perangkat Anda");
},()=>{
btnGps.disabled=false;
btnGps.innerHTML='<i class="ph-bold ph-crosshair"></i><span>GPS Saya</span>';
alert("Tidak dapat mengakses GPS. Mohon aktifkan izin lokasi di browser atau pilih wilayah dari daftar.");
},{timeout:8000});
});
}
},
initChecklist(){
const checkboxes=document.querySelectorAll(".syarat-chk");
const counterEl=document.getElementById("checklist-counter");
const barEl=document.getElementById("checklist-progress-bar");
const resetBtn=document.getElementById("btn-reset-checklist");
if(checkboxes.length===0)return;
const storageKey="spmb_checklist_state";
let saved={};
try{
saved=JSON.parse(localStorage.getItem(storageKey)||"{}");
}catch(err){}
const updateProgress=()=>{
let count=0;
checkboxes.forEach((chk)=>{
const id=chk.getAttribute("data-id");
const isChecked=Boolean(saved[id]);
chk.checked=isChecked;
const parent=chk.closest(".syarat-item");
if(parent)parent.classList.toggle("checked",isChecked);
if(isChecked)count++;
});
const total=checkboxes.length;
if(counterEl)counterEl.textContent=`${count} dari ${total} Berkas Siap`;
if(barEl){
const pct=(count/total)*100;
barEl.style.width=`${pct}%`;
}
};
checkboxes.forEach((chk)=>{
chk.addEventListener("change",()=>{
const id=chk.getAttribute("data-id");
saved[id]=chk.checked;
localStorage.setItem(storageKey,JSON.stringify(saved));
updateProgress();
});
});
if(resetBtn){
resetBtn.addEventListener("click",()=>{
saved={};
localStorage.removeItem(storageKey);
updateProgress();
});
}
updateProgress();
}
};
document.addEventListener("layoutReady",()=>{
SPMBPage.init();
});