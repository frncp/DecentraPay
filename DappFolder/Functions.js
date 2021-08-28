function enabledisabletextbox(){
  var checkbox = document.getElementById("Selected");
  var textbox = document.getElementById("DiscountAmount");
  textbox.disabled = checkbox.checked ? false : true;
  if(textbox.disabled){
    textbox.value = "0";
  }

}