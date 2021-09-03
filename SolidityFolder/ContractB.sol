pragma solidity ^0.8.4;


contract ContractB{
    
mapping(address => uint256) AddrMap; 
mapping(address => bool) IfExistAddress;
address[] private Accounts;


event PaymentDone(address sender,uint value);

receive() external payable{}

function useDiscountAndDelete(address payable _address,uint _DiscountRequest) external payable{
    require(_DiscountRequest <= AddrMap[_address],"Balance not sufficent");
    require((_DiscountRequest/10000)*10000 == _DiscountRequest);
    AddrMap[_address] -= _DiscountRequest;
    (bool sent,) = _address.call{value: _DiscountRequest, gas: 2300}("");
    require(sent,"Transaction Failed");
    emit PaymentDone(msg.sender,msg.value);

}


function payAndRequestDiscount(address _address,uint256 _DiscountRequest) external payable{
    addAddress(_address);
    addDiscount(_address,_DiscountRequest);
}


function addDiscount(address _address,uint _discountRequest) internal{
    AddrMap[_address] += _discountRequest;
}

function GetDiscount(address _address) public view returns(uint){
    if(CheckIfAddressExists(_address)){
    return AddrMap[_address];
    }else
        return 0;

}

function CheckIfAddressExists(address _address) public view returns (bool){
    if (IfExistAddress[_address]){
        return true;
    }else{
        return false;
    }
}

function addAddress(address _address) internal{
    if(!IfExistAddress[_address])
        IfExistAddress[_address] = true;
        Accounts.push(_address);
}

function ContractBalance() external view returns(uint){
    return address(this).balance;
}

function getAccounts() external view returns(address[] memory){
    return Accounts;
}
}