var _inputaddress = "0xb8bfa77c0bab0283e4e44035b215885c3c7355fb";
var OldSelection = 'ether';

window.onload = function () {
  if (isEthereumProviderInstalled())
    InizializeConnection();
}

// Wallet
var Wallet = {
  address: undefined,
  connect: async function () {
    try {
      var accounts = await ethereum.request({
        method: 'eth_requestAccounts'
      });
    } catch (err) {
      switch (err.code) {
        case -32002:
          document.getElementById('error_refused_connection').classList.add('display-none');
          document.getElementById('error_accept_pending').classList.remove('display-none');
          break;
        case 4001:
          document.getElementById('error_accept_pending').classList.add('display-none');
          document.getElementById('error_refused_connection').classList.remove('display-none');
          break;
      }
      return err.code
    }
    if (accounts.length != 0) {
      let address = accounts[0];
      this.address = address
    } else {
      this.address = undefined
    }
    return 0
  },

  getAddress: function () {
    return this.address
  },

  getBalance: function () {
    return this.balance
  },

  isThereAnAddress: function () {
    return (this.address != undefined) ? true : false
  }
}


// Contract
const Contract = {
  address: _inputaddress,
  abi: ReturnJSON(),
  contract: undefined,
  credit: undefined,
  deploy: function () {
    this.contract = new web3.eth.Contract(this.abi, this.address)
    this.contract.events.Paysent({}, {}).on('data', function () {
      getCredit();
    })
    this.contract.events.PayDiscount({}, {}).on('data', function () {
      getCredit();
    })
  },
  fetchCredit: async function (wallet) {
    if (this.contract) {
      try {
        this.credit = await this.contract.methods.getMyCredit(wallet.address).call({
          from: wallet.address
        });
      } catch (err) {
        this.credit = undefined;
      }
    }
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

function InizializeConnection() {
  Contract.deploy()
  document.getElementById('provider_section').classList.remove('display-none')
  Connect();
}

function getAddress() {
  document.getElementById("address_information_web3").innerHTML = Wallet.address;
}

function getCredit() {
  Contract.fetchCredit(Wallet).then(function () {
    if (Contract.credit != undefined) {
      document.getElementById("balance_information_web3").innerHTML = web3.utils.fromWei((Contract.credit).toString(), "ether") + " ether";
      document.getElementById('error_cant_use_this_chain').classList.add('display-none')
    } else {
      document.getElementById("balance_information_web3").innerHTML = "Balance Unavailable";
      document.getElementById('error_cant_use_this_chain').classList.remove('display-none')
    }
  });
}


async function PayWithoutDiscount(x, AmountToPay) {
  await Contract.contract.methods.payRequireDiscount(x).send({
    from: x,
    value: AmountToPay
  });
}

async function PayWithDiscount(x, AmountToPay, DiscountRequest) {
  if (Number(Contract.credit) >= Number(DiscountRequest)) {
    AmountToPay = AmountToPay - DiscountRequest;
    await Contract.contract.methods.payAndApplyDiscount(x, DiscountRequest).send({
      from: x,
      value: AmountToPay
    });
    document.getElementById("error_not_enough_credit").classList.add("display-none");
  } else {
    document.getElementById("error_not_enough_credit").classList.remove("display-none");
  }
}


function Connect() {
  Wallet.connect().then(function () {
    if (Wallet.isThereAnAddress()) {
      goToPayment();
      getAddress();
      getCredit();
    }
  })
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
      pay.setAttribute("min", 10000000000000000);
      AdaptDiscount.setAttribute("min", 10000000000000000)
      AdaptDiscount.setAttribute("max", Contract.credit);
      convertSelectedUnit(selectedOption, OldSelection, pay, AdaptDiscount)
      break;
    case "gwei":
      pay.setAttribute("min", 10000000);
      AdaptDiscount.setAttribute("min", 10000000)
      AdaptDiscount.setAttribute("max", web3.utils.fromWei(Contract.credit, "gwei"));
      convertSelectedUnit(selectedOption, OldSelection, pay, AdaptDiscount)
      break;
    case "ether":
      pay.setAttribute("min", 0.01);
      AdaptDiscount.setAttribute("min", 0.01)
      AdaptDiscount.setAttribute("max", web3.utils.fromWei(Contract.credit, "ether"));
      convertSelectedUnit(selectedOption, OldSelection, pay, AdaptDiscount)
      break;
  }
  OldSelection = selectedOption;
}


function convertSelectedUnit(current_unit, previous_unit, amount_input, discount_input) {
  if ((current_unit != previous_unit) && amount_input.value != 0) {
    var conversion = web3.utils.toWei(amount_input.value, previous_unit)
    amount_input.value = web3.utils.fromWei(conversion, current_unit)
    if (discount_input.value != 0) {
      var discount_conversion = web3.utils.toWei(discount_input.value, previous_unit)
      discount_input.value = web3.utils.fromWei(discount_conversion, current_unit)
    }
  }
}

function SubmitForm() {
  var payment_amount = document.getElementById("amount_input").value;
  var discount = document.getElementById("discount_amount_input").value;
  var discount_checkbox = document.getElementById("discount_checkbox");
  var selectedOption = document.getElementById("unit_selection_list").value;

  payment_amount = web3.utils.toWei(payment_amount, selectedOption);
  if (discount_checkbox.checked && discount !== undefined && discount !== 0) {
    discount = web3.utils.toWei(discount, selectedOption);
    PayWithDiscount(Wallet.address, payment_amount, discount);
  } else {
    PayWithoutDiscount(Wallet.address, payment_amount);
  }
}






/* EVENT HANDLING */


// Account change
window.ethereum.on('accountsChanged', function (accounts) {
  if (accounts.length == 0) {
    document.getElementById("provider_section").classList.remove("display-none");
    document.getElementById("payment_section").classList.add("display-none")
    document.getElementById("account_informations").classList.add("display-none")
    Wallet.address = undefined;
  } else {
    document.getElementById("provider_section").classList.add("display-none");
    Connect()
  }
});

// Network switch
ethereum.on('chainChanged', (chainId) => {
  Wallet.connect();
  getAddress();
  getCredit();
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
      "name": "PayDiscount",
      "type": "event"
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
          "internalType": "address",
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