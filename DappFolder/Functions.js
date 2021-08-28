function enabledisabletextbox(){
  var checkbox = document.getElementById("Selected");
  var textbox = document.getElementById("DiscountAmount");
  textbox.disabled = checkbox.checked ? false : true;
  if(textbox.disabled){
    textbox.value = "0";
  }
}

function submitRequest(){
  var payament = document.getElementById("spendnum").value;
  var textbox = document.getElementById("DiscountAmount");
  var checkbox = document.getElementById("Selected");
  if(checkbox.checked){
      var discountRequested = textbox.value;
  }
  console.log("Pagamento Effettuato: " + payament);
  console.log("Sconto Richiesto: " + discountRequested);
  //Inizializza chiamata allo smart contract con payment e discountRequested;
}