const KontakPage={
init(){
const form=document.getElementById("kontak-form");
const btnWa=document.getElementById("btn-send-wa");
const btnForm=document.getElementById("btn-send-form");
const toast=document.getElementById("kontak-toast");
const toastClose=document.getElementById("toast-close-btn");
if(!form)return;
const getFormData=()=>{
const nama=document.getElementById("input-nama")?.value.trim()||"";
const kontak=document.getElementById("input-kontak")?.value.trim()||"";
const kategori=document.getElementById("input-subjek")?.value||"Umum";
const pesan=document.getElementById("input-pesan")?.value.trim()||"";
return {nama,kontak,kategori,pesan};
};
if(btnWa){
btnWa.addEventListener("click",()=>{
const {nama,kontak,kategori,pesan}=getFormData();
if(!nama||!pesan){
alert("Mohon lengkapi Nama dan Pesan Anda terlebih dahulu.");
return;
}
const text=`Halo Admin UPT SDN Punggul 02,
Saya: *${nama}* (${kontak||"Wali Murid"})
Kategori: *${kategori}*

*Pesan:*
${pesan}`;
const encoded=encodeURIComponent(text);
const waUrl=`https://wa.me/6283841741718?text=${encoded}`;
window.open(waUrl,"_blank");
});
}
form.addEventListener("submit",(e)=>{
e.preventDefault();
const {nama,pesan}=getFormData();
if(!nama||!pesan){
alert("Mohon lengkapi Nama dan Pesan Anda.");
return;
}
if(toast){
toast.classList.add("active");
setTimeout(()=>{
toast.classList.remove("active");
},6000);
}
form.reset();
});
if(toastClose&&toast){
toastClose.addEventListener("click",()=>{
toast.classList.remove("active");
});
}
}
};
document.addEventListener("layoutReady",()=>{
KontakPage.init();
});