$(".fa-chart-bar").on("click", (event)=>{
  $("#top-gem").toggleClass("top-gem");
  event.stopPropagation();
});

$("html").on("click", (event)=>{
  if(!$("#top-gem").hasClass("top-gem"))
    $("#top-gem").addClass("top-gem");
});




/*function tabmanipulate(num, id){
  $("div.tabcontent").hide();
  $(".nav-tabs li a").removeClass("active");
  $("#"+id).show();
  $("#"+"course"+num).addClass("active");
}*/



 
 
 