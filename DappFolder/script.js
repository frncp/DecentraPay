// CHECK IF WALLET IS AVAILABLE
var account;
var Storage;
var ContractAddress = "0x2df7bd73910cd9313717d8b80373303d9624836f";
var abi = ReturnJSON();
var DecentraPayContract;
var accounts;
var OldSelection = 'ether';

window.onload = function(){
  InizializeConnection();
}

// Checks if Ethereum is available on the browser
function InizializeConnection(){
  if (typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
  //document.getElementById("provider_installation_prompt").classList.remove("display-none");
  }else{
  web3 = new Web3('http://localhost:8545');
  }
  DecentraPayContract = new web3.eth.Contract(abi,ContractAddress);
  console.log("arrived");
  if(!window.ethereum.isConnected()){
    console.log("logged");
    Connect();
}}

async function getAddress(){
  try{
  accounts = await ethereum.request({method: 'eth_requestAccounts'});
  }catch(err){
    switch(err.code){
      case -32002: alert("already active");break;
      case 4001: alert("Connection Refused");break;
    }
    return
  }
  if(accounts.length != 0){
  account = accounts[0];
  document.getElementById("address_information_web3").innerHTML = account;
  return account;
  }
  document.getElementById("address_information_web3").innerHTML = 0;
  return 0;
}

async function getCredit(DecentraPayContract,x){
  Storage = await DecentraPayContract.methods.getMyCredit(x).call({from: x});
  console.log("Storage:" + Storage);
  document.getElementById("balance_information_web3").innerHTML = web3.utils.fromWei(Storage,"ether") + " ether";
  return Storage;
}

async function GetStorageBalance(){
  var val = await DecentraPayContract.methods.getStorageContractBalance().call({from:account});
  console.log("Storage contract Balance " + web3.utils.fromWei(val,'ether'));
}

async function GetInterfaceBalance(){
  var val = await DecentraPayContract.methods.getBalance().call({from:account});
  console.log("Interface contract Balance " + web3.utils.fromWei(val,'ether'));
}

async function PayWithoutDiscount(x,AmountToPay){
  await DecentraPayContract.methods.payRequireDiscount(x).send({from: x, value: AmountToPay});
}

async function PayWithDiscount(x,AmountToPay,DiscountRequest){
  if(Storage >= DiscountRequest){
  var AmountToPay = AmountToPay - DiscountRequest;
  await DecentraPayContract.methods.payAndApplyDiscount(x,DiscountRequest).send({from: x,value: AmountToPay});
  }
}
window.ethereum.on('accountsChanged',function (accounts) {
  console.log(accounts);
  if(accounts.length == 0){
    document.getElementById("intro_section").classList.remove("display-none");
    document.getElementById("provider_section").classList.remove("display-none");
    document.getElementById("payment_section").classList.add("display-none");
    document.getElementById("account_informations").classList.remove("display-none");
  }else{
  getAddress()}
});

async function Connect() {
  var result = await getAddress();
  if(result){
  getCredit(DecentraPayContract,result);
  goToPayment();
  GetStorageBalance();
  GetInterfaceBalance();
  }
}

ethereum.on('chainChanged', (chainId) => {
  if(chainId!= 3){
    alert("Connect to Ropsten, please");
  }
});

function goToPayment() {
  document.getElementById("intro_section").classList.add("display-none");
  document.getElementById("provider_section").classList.add("display-none");
  document.getElementById("payment_section").classList.remove("display-none");
  document.getElementById("account_informations").classList.remove("display-none");
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
  var AdaptDiscount = document.getElementById("discount_amount_input");
  switch(selectedOption){
    case "wei":
      pay.setAttribute("min",10000000000000000);
      AdaptDiscount.setAttribute("min",10000000000000000)
      AdaptDiscount.setAttribute("max",Storage);
      if(selectedOption != OldSelection && pay.value != 0){
          pay.value = web3.utils.toWei(pay.value,OldSelection);
          if(AdaptDiscount.value != 0 )
              AdaptDiscount.value = web3.utils.toWei(AdaptDiscount.value,OldSelection);
      }
      break;
    case "gwei":
      console.log("gwei");
      pay.setAttribute("min",10000000);
      AdaptDiscount.setAttribute("min",10000000)
      AdaptDiscount.setAttribute("max",web3.utils.fromWei(Storage,"gwei"));
      if(selectedOption != OldSelection && pay.value != 0){
          console.log("old" + OldSelection);
          var temp = web3.utils.toWei(pay.value,OldSelection);
          pay.value = web3.utils.fromWei(temp,selectedOption);
        if(AdaptDiscount.value != 0){
          console.log("Discount:" + AdaptDiscount.value);
          var Val = web3.utils.toWei(AdaptDiscount.value,OldSelection)
          AdaptDiscount.value = web3.utils.fromWei(Val,selectedOption);
        }}
      break;
    case "ether":
      pay.setAttribute("min",0.01);
      AdaptDiscount.setAttribute("min",0.01)
      AdaptDiscount.setAttribute("max",web3.utils.fromWei(Storage,"ether"));
      if(selectedOption != OldSelection && pay.value != 0){
        var temp = web3.utils.toWei(pay.value,OldSelection);
        pay.value = web3.utils.fromWei(temp,selectedOption);
        if(AdaptDiscount.value != 0){
          console.log("Discount:" + AdaptDiscount.value);
          var Val = web3.utils.toWei(AdaptDiscount.value,OldSelection)
          AdaptDiscount.value = web3.utils.fromWei(Val,selectedOption);
        }}
      break;
  }
  console.log("arrived");
  OldSelection = selectedOption;
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
    },
    {
      "stateMutability": "payable",
      "type": "receive"
    }
  ]
   )));
}
