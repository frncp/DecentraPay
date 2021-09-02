// CHECK IF WALLET IS AVAILABLE
var account;
var Storage;
var ContractAddress = "0xf0f7d0541d7473a136245914d6b9797829eb7725";
var abi = ReturnJSON();
var DecentraPayContract;
var accounts;
var OldSelection = 'ether';

window.onload = function () {
  if (isEthereumProviderInstalled())
    InizializeConnection();
}

// Wallet
// TODO : Object
var Wallet = {
  address : undefined,
  connect : async function() {
   try{
 var accounts = await ethereum.request({method: 'eth_requestAccounts'});
 } catch(err) {
   switch(err.code){
     case -32002: document.getElementById('error_refused_connection').classList.add('display-none');document.getElementById('error_accept_pending').classList.remove('display-none');break;
     case 4001: 
document.getElementById('error_accept_pending').classList.add('display-none');document.getElementById('error_refused_connection').classList.remove('display-none');break;
   }
   return err.code
 }
 if(accounts.length != 0){
  let address = accounts[0];
  this.address = address
 } else {
  this.address = undefined
 }
 return 0
},

 getAddress : function() {
 return this.address
  },

 getBalance : function() {
     return this.balance
 },
 
 isThereAnAddress : function() {
     return (typeof address != undefined) ? true : false
 }
}


// Contract
const Contract = {
 address : "0x2df7bd73910cd9313717d8b80373303d9624836f",
 abi : ReturnJSON(),
 contract : undefined,
 credit : undefined,
 deploy : function() {
     this.contract = new web3.eth.Contract(this.abi,this.address)
 },
 fetchCredit : async function(wallet) {
    if (this.contract)
     this.credit = await this.contract.methods.getMyCredit(wallet.address).call({from: wallet.address});
 }
}

// Checks if Ethereum is available on the browser
function isEthereumProviderInstalled() {
  if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    return true
  } else {
    web3 = new Web3('http://localhost:8545');
    document.getElementById("provider_installation_prompt").classList.remove("display-none");
    return false
  }
}

function InizializeConnection(){
  Contract.deploy()
  web3.eth.net.isListening().then(function(){
    Connect();})}

function getAddress(){ 
  document.getElementById("address_information_web3").innerHTML = Wallet.address;
}

function getCredit(){
  Contract.fetchCredit(Wallet).then( function() {
  document.getElementById("balance_information_web3").innerHTML = web3.utils.fromWei((Contract.credit).toString(),"ether") + " ether"; })
}

async function PayWithoutDiscount(x,AmountToPay){
  await Contract.contract.methods.payRequireDiscount(x).send({from: x, value: AmountToPay});
}

async function PayWithDiscount(x,AmountToPay,DiscountRequest){
  if(Contract.credit >= DiscountRequest){
  var AmountToPay = AmountToPay - DiscountRequest;
  await Contract.contract.methods.payAndApplyDiscount(x,DiscountRequest).send({from: x,value: AmountToPay});
  }
}


function Connect() {
  Wallet.connect().then( function() {
  if(Wallet.isThereAnAddress()){
  getAddress()
  getCredit();
  goToPayment();
  }})
}

function goToPayment() {
  document.getElementById("payment_section").classList.remove("display-none")
  document.getElementById("account_informations").classList.remove("display-none")
  document.getElementById("provider_section").classList.add("display-none");
}

function enableDiscount() {
  var checkbox = document.getElementById("discount_checkbox")
  var textbox = document.getElementById("discount_amount_input")
  textbox.disabled = checkbox.checked ? false : true;
  if (textbox.disabled) {
    textbox.value = "0"
  }
}

function adaptMinValueToUnit() {
  var selectedOption = document.getElementById("unit_selection_list").value;
  var pay = document.getElementById("amount_input");
  var AdaptDiscount = document.getElementById("discount_amount_input");
  switch (selectedOption) {
    case "wei":
      pay.setAttribute("min",10000000000000000);
      AdaptDiscount.setAttribute("min",10000000000000000)
     //TODO: fix -> AdaptDiscount.setAttribute("max",Storage);
      convertSelectedUnit(selectedOption, OldSelection, pay, AdaptDiscount)
      break;
    case "gwei":
      pay.setAttribute("min",10000000);
      AdaptDiscount.setAttribute("min",10000000)
      //TODO: fix --> AdaptDiscount.setAttribute("max",web3.utils.fromWei(Storage,"gwei"));
      convertSelectedUnit(selectedOption, OldSelection, pay, AdaptDiscount)
      break;
    case "ether":
      pay.setAttribute("min",0.01);
      AdaptDiscount.setAttribute("min",0.01)
      //TODO: fix --> AdaptDiscount.setAttribute("max",web3.utils.fromWei(Storage,"ether"));
      convertSelectedUnit(selectedOption, OldSelection, pay, AdaptDiscount)
      break;
  }
  OldSelection = selectedOption;
}


function convertSelectedUnit(current_unit, previous_unit, amount_input, discount_input) {
   if((current_unit != previous_unit) && amount_input.value != 0){
        var conversion = web3.utils.toWei(amount_input.value,previous_unit)
        amount_input.value = web3.utils.fromWei(conversion,current_unit)
        if(discount_input.value != 0){
          var discount_conversion = web3.utils.toWei(discount_input.value,previous_unit)
          discount_input.value = web3.utils.fromWei(discount_conversion,current_unit)
        }}
}

function SubmitForm(){
  var payment_amount = document.getElementById("amount_input").value;
  var discount = document.getElementById("discount_amount_input").value;
  var discount_checkbox = document.getElementById("discount_checkbox");
  var selectedOption = document.getElementById("unit_selection_list").value;

  payment_amount = web3.utils.toWei(payment_amount,selectedOption);
  if(discount_checkbox.checked && discount!== undefined && discount !== 0){
      discount = web3.utils.toWei(discount,selectedOption);
      PayWithDiscount(account,payment_amount,discount);
  }else{
    PayWithoutDiscount(account,payment_amount);
  }
}






/* EVENT HANDLING */


// Account change
window.ethereum.on('accountsChanged',function (accounts) {
  if (accounts.length == 0) {
    document.getElementById("provider_section").classList.remove("display-none");
    document.getElementById("payment_section").classList.add("display-none")
    document.getElementById("account_informations").classList.add("display-none")
  } else {
    document.getElementById("provider_section").classList.add("display-none");
    Connect()
 }
});

// Network switch
ethereum.on('chainChanged', (chainId) => {
  location.reload()
});


/* START OF ABI */

function ReturnJSON() {

  return (JSON.parse(JSON.stringify([
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_StorageAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_discount",
          "type": "uint256"
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
      "inputs": [],
      "name": "getStorageContractBalance",
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
          "internalType": "address payable",
          "name": "_address",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_RequestedDiscount",
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
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ])));
}
