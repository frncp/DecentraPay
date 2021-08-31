// CHECK IF WALLET IS AVAILABLE
var account;
var ContractAddress = "0x8a4dc5828d824078797d4086496d72be816fed0b";
var abi = ReturnJSON();
var DecentraPayContract;
var accounts;

window.onload = function(){
  if(window.ethereum.isConnected()){
    AcceptConnection();
    Connect();
  }

}

// Checks if Ethereum is available on the browser
async function AcceptConnection(){
  if (typeof window.ethereum !== 'undefined') {
  console.log("Connection reset");
  web3 = new Web3(window.ethereum); 
  }else{
  //document.getElementById("metamaskButton").classList.add("display-none");
  web3 = new Web3('http://localhost:8545');
  }
  document.getElementById("provider_installation_prompt").classList.add("display-none");
  DecentraPayContract = new web3.eth.Contract(abi,ContractAddress);
  if(window.ethereum.isConnected()){
    Connect();
  }
}


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
  console.log(x);
  var Storage = await DecentraPayContract.methods.getMyCredit(x).call({from: x});
  console.log("Storage:" + Storage);
  document.getElementById("balance_information_web3").innerHTML = web3.utils.fromWei(Storage,"ether") + " ether";
}

async function PayWithoutDiscount(x,AmountToPay){
  await DecentraPayContract.methods.payRequireDiscount(x).send({from: x, value: AmountToPay});
}

async function PayWithDiscount(x,AmountToPay,DiscountRequest){
  await DecentraPayContract.methods.payAndApplyDiscount(x,DiscountRequest).send({from: x,value: AmountToPay});
}

window.ethereum.on('accountsChanged',function (accounts) {
  if(accounts.length == 0){
    document.getElementById("intro_section").classList.remove("display-none")
    document.getElementById("payment_section").classList.add("display-none")
    document.getElementById("account_informations").classList.add("display-none")
  }else{
  getAddress(accounts)}
});


async function Connect() {
  var result = await getAddress();
  if(result){
  getCredit(DecentraPayContract,result);
  goToPayment();
  }
}

function goToPayment() {
  document.getElementById("intro_section").classList.add("display-none")
  document.getElementById("payment_section").classList.remove("display-none")
  document.getElementById("account_informations").classList.remove("display-none")
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
