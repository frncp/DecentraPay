// CHECK IF WALLET IS AVAILABLE
var account;
var DecentraPayContract;


// Checks if Ethereum is available on the browser
window.onload = function(){
  if (typeof window.ethereum !== 'undefined') {
  document.getElementById("provider_installation_prompt").classList.add("display-none");
  web3 = new Web3(window.ethereum);
  }else{
  document.getElementById("metamaskButton").classList.add("display-none");
  }
    //web3 = new Web3(new Web3.providers.HttpProviders("http://localhost:8545"));
    console.log("Connection reset");
    var ContractAddress = "0x8a4dc5828d824078797d4086496d72be816fed0b";
    var abi = ReturnJSON();
    DecentraPayContract = new web3.eth.Contract(abi,ContractAddress);
  if(ethereum.isConnected()){
    Connect();
  }
}


async function getAddress(){
  const accounts = await ethereum.request({method: 'eth_requestAccounts'});
  account = accounts[0];
  document.getElementById("address_information_web3").innerHTML = account;
  return account;
}

async function getCredit(DecentraPayContract,x){
  console.log(x);
  var Storage = await DecentraPayContract.methods.getMyCredit(x).call({from: x});
  console.log("Storage:" + Storage);
  document.getElementById("balance_information_web3").innerHTML = web3.utils.fromWei(Storage,"ether") + " ether";
}

async function PayWithoutDiscount(x,AmountToPay){
  console.log(x);
  console.log("Amount " + web3.utils.toWei(AmountToPay));
  await DecentraPayContract.methods.payRequireDiscount(x).send({from: x, value: AmountToPay});

}

async function PayWithDiscount(x,AmountToPay,DiscountRequest){
  await DecentraPayContract.methods.payAndApplyDiscount(x,DiscountRequest).send({from: x,value: AmountToPay});
}

ethereum.on('accountsChanged', function (accounts) {
  getAddress(accounts)
});


async function Connect() {
if (!ethereum.isConnected()) {
document.getElementById("provider_connection_button").setAttribute('disabled',true) = true
 }
  goToPayment();
  getAddress().then( account => getCredit(DecentraPayContract,account));
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
      pay.setAttribute("min",0);
      break;
    case "gwei":
      console.log("gwei");
      pay.setAttribute("min",0);
      break;
    case "ether":
      console.log("ether");
      pay.setAttribute("min",0);
      break;
  }
}

function SubmitForm(){
  var payment_amount = document.getElementById("amount_input").value;
  var discount = document.getElementById("discount_amount_input").value;
  var discount_checkbox = document.getElementById("discount_checkbox");
  var selectedOption = document.getElementById("unit_selection_list").value;

  payment_amount = ConvertToWei(payment_amount,selectedOption);
  if(discount_checkbox.checked && discount!== undefined && discount !== 0){
      discount = ConvertToWei(discount,selectedOption);
      PayWithDiscount(account,payment_amount,discount);
  }else{
    PayWithoutDiscount(account,payment_amount);
  }
}

function ConvertToWei(amount,selectedOption){
  return web3.utils.toWei(amount,selectedOption);
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
