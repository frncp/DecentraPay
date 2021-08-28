function enabledisabletextbox(){
  var checkbox = document.getElementById("Selected");
  var textbox = document.getElementById("DiscountAmount");
  textbox.disabled = checkbox.checked ? false : true;
  if(textbox.disabled){
    textbox.value = "0";
  }
}

function AdaptiveMinvalue(){
  var selectedOption = document.getElementById("Dropdown").value;
  var pay = document.getElementById("spendnum");
  switch(selectedOption){
    case "wei":
      console.log("wei");
      pay.setAttribute("min",1000);
      break;
    case "gwei":
      console.log("gwei");
      pay.setAttribute("min",2000);
      break;
    case "Ether":
      console.log("ether");
      pay.setAttribute("min",3000);
      break;
  }
}

function submitRequest(){
  var payment = document.getElementById("spendnum").value;
  var textbox = document.getElementById("DiscountAmount");
  var checkbox = document.getElementById("Selected");
  if(checkbox.checked){
      var discountRequested = textbox.value;
  }
  console.log("Pagamento Effettuato: " + payment);
  console.log("Sconto Richiesto: " + discountRequested);
  //Inizializza chiamata allo smart contract con payment e discountRequested;
}