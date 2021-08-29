// CHECK IF WALLET IS AVAILABLE
//import Web3 from 'web3';

window.onload = function() {
  getAddress();
  if (typeof window.ethereum !== 'undefined') {
  document.getElementById("provider_installation_prompt").classList.add("display-none");
  Web3 = new Web3(window.ethereum);
  }else{
  document.getElementById("metamaskButton").classList.add("display-none");
    //web3 = new Web3(new Web3.providers.HttpProviders("http://localhost:8545"));
  }
  var DecentraPayContract = web3.eth.contract([
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "PaymentDone",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "DiscountRequest",
          "type": "uint256"
        }
      ],
      "name": "payAndRequestDiscount",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address payable",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "DiscountRequest",
          "type": "uint256"
        }
      ],
      "name": "useDiscountAndDelete",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "ContractBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAccounts",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalanceInEther",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "GetDiscount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ])
}


async function getAddress(){
  if(ethereum.isConnected()){
  const accounts = await ethereum.request({method: 'eth_requestAccounts'});
  const account = accounts[0];
  document.getElementById("address_information_web3").innerHTML = account;
  }
}

async function getCredit(){


}

function Connect(){
  ethereum.request({method: 'eth_requestAccounts'});
  getAddress();
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
  var selectedOption = document.getElementById("unit_selection_list").value;
  var pay = document.getElementById("amount_input");
  switch(selectedOption){
    case "wei":
      console.log("wei");
      pay.setAttribute("min",1000);
      break;
    case "gwei":
      console.log("gwei");
      pay.setAttribute("min",2000);
      break;
    case "ether":
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
