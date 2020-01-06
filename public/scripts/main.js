$(".fa-chart-bar").on("click", (event)=>{
  $("#top-gem").toggleClass("top-gem");
  event.stopPropagation();
});

$("html").on("click", (event)=>{
  if(!$("#top-gem").hasClass("top-gem"))
    $("#top-gem").addClass("top-gem");
});








 
 
 