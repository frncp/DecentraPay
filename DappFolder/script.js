// CHECK IF WALLET IS AVAILABLE

window.onload = function() {
  if (typeof window.ethereum !== 'undefined') {
  document.getElementById("provider_installation_prompt").addClass("display-none")
  }
}


function enableDiscount(){
  var checkbox = document.getElementById("discount_checkbox")
  var textbox = document.getElementById("discount_amount_input")
  textbox.disabled = checkbox.checked ? false : true;
  if(textbox.disabled){
    textbox.value = "0"
  }
}

function adaptMinValueToUnit(){
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
  var payment_amount = document.getElementById("amount_input").value
  var discount = document.getElementById("discount_amount_input")
  var discount_checkbox = document.getElementById("discount_checkbox")
  if(discount_checkbox.checked){
      var discount_amount = discount.value
  }
  console.log("Pagamento Effettuato: " + payment_amount)
  console.log("Sconto Richiesto: " + discount_amount)
  //Inizializza chiamata allo smart contract con payment e discountRequested
  return false
}
