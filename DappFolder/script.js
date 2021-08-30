// CHECK IF WALLET IS AVAILABLE
var account;
var DecentraPayContract;


// Checks if Ethereum is available on the browser
window.onload = function() {
  if (typeof window.ethereum !== 'undefined') {
  //document.getElementById("provider_installation_prompt").classList.add("display-none");
  web3 = new Web3(window.ethereum);
  }else{
  document.getElementById("metamaskButton").classList.add("display-none");
    //web3 = new Web3(new Web3.providers.HttpProviders("http://localhost:8545"));
  }
  var ContractAddress = "0xf53b85d2854edcdb5d9677fab0ba215d33eac899";
  var abi = ReturnJSON();
  DecentraPayContract = new web3.eth.Contract(abi,ContractAddress);
  if(ethereum.isConnected()){
    Connect();
}}

async function getAddress(){
  const accounts = await ethereum.request({method: 'eth_requestAccounts'});
  account = accounts[0];
  document.getElementById("address_information_web3").innerHTML = account;
  return account;
}

async function getCredit(DecentraPayContract,x){
  console.log(x);
  var Storage = await DecentraPayContract.methods.getMyCredit(x).call({from: x});
  console.log(Storage);
  document.getElementById("balance_information_web3").innerHTML = Storage;
}

ethereum.on('accountsChanged', function (accounts) {
  getAddress(accounts)
});


async function Connect() {
if (!ethereum.isConnected()) {
 try { 
document.getElementById("provider_connection_button").setAttribute('disabled',true) = true
  account = await ethereum.request({method: 'eth_requestAccounts'})
 } catch(err) {
  switch(err.code) {
    case -32002: alert("activation"); break;
    case 4001: alert("refused"); break;
   }
   return
  }
} else {
  account = await ethereum.request({method: 'eth_requestAccounts'})
}
  goToPayment()
  getAddress(account).then( account => getCredit(DecentraPayContract,account));
}

function goToPayment() {
  document.getElementById("intro_section").classList.add("display-none")
  document.getElementById("payment_section").classList.remove("display-none")
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

function ReturnJSON(){

	return (JSON.parse(JSON.stringify([
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_StorageAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Paysent",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_discount",
          "type": "uint256"
        }
      ],
      "name": "SetDiscount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
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
      "name": "getCurrentDiscount",
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
      "name": "getMyCredit",
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
      "name": "getStorageContract",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
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
          "name": "RequestedDiscount",
          "type": "uint256"
        }
      ],
      "name": "payAndApplyDiscount",
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
        }
      ],
      "name": "payRequireDiscount",
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
        }
      ],
      "name": "setOwner",
      "outputs": [],
      "stateMutability": "nonpayable",
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
      "name": "setStorageContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrow",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
   )));
}
