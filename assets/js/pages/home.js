const HomePage={
testimonials:[
{
quote:"SDN Punggul 02 telah memberikan pengalaman belajar yang luar biasa bagi putra kami. Dewan guru sangat berdedikasi, fasilitas sekolah ramah anak dan asri, serta pembiasaan karakternya membuat anak kami lebih mandiri dan santun.",
name:"Ibu Siti Rahmawati",
role:"Orang Tua Siswa Kelas 4",
avatar:"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format"
},
{
quote:"Program Kurikulum Merdeka di SDN Punggul 02 sangat memerdekakan anak untuk bereksplorasi. Anak saya selalu bersemangat ke sekolah setiap pagi karena suasana kelas yang hangat, aman, dan mendidik.",
name:"Bapak Hendra Kurniawan",
role:"Orang Tua Siswa Kelas 2",
avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format"
},
{
quote:"Bimbingan persiapan kelanjutan ke SMP Negeri dan pembinaan ekstrakurikuler drumband serta silat sangat berkualitas. Kami sangat bangga menjadi bagian dari keluarga besar SDN Punggul 02.",
name:"Ibu Nurul Farida",
role:"Orang Tua Siswa Kelas 6",
avatar:"https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=200&auto=format"
}
],
currentTestimonial:0,
init(){
this.bindTestimonials();
},
bindTestimonials(){
const quoteEl=document.querySelector(".testimonial-quote");
const authorNameEl=document.querySelector(".author-name");
const authorRoleEl=document.querySelector(".author-role");
const authorAvatarEl=document.querySelector(".author-avatar img");
const dots=document.querySelectorAll(".slider-dot");
const prevBtn=document.querySelector(".slider-btn:first-of-type");
const nextBtn=document.querySelector(".slider-btn:last-of-type");
if(!quoteEl||!prevBtn||!nextBtn)return;
const updateView=()=>{
const item=this.testimonials[this.currentTestimonial];
quoteEl.textContent='"'+item.quote+'"';
authorNameEl.textContent=item.name;
authorRoleEl.textContent=item.role;
authorAvatarEl.setAttribute("src",item.avatar);
authorAvatarEl.setAttribute("alt",item.name);
dots.forEach((d,i)=>{
if(i===this.currentTestimonial){
d.classList.add("active");
}else{
d.classList.remove("active");
}
});
};
prevBtn.addEventListener("click",()=>{
this.currentTestimonial=(this.currentTestimonial-1+this.testimonials.length)%this.testimonials.length;
updateView();
});
nextBtn.addEventListener("click",()=>{
this.currentTestimonial=(this.currentTestimonial+1)%this.testimonials.length;
updateView();
});
dots.forEach((dot,index)=>{
dot.addEventListener("click",()=>{
this.currentTestimonial=index;
updateView();
});
});
}
};
document.addEventListener("layoutReady",()=>{
HomePage.init();
});