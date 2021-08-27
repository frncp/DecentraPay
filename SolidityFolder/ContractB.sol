pragma solidity ^0.8.4;


contract ContractB{
    
mapping(address => uint256) AddrMap;    
address[] private Accounts;

address private bAddress;

event PaymentDone(address sender,uint value);


function useDiscountAndDelete(address payable _address,uint DiscountRequest) external payable{
    require(DiscountRequest <= AddrMap[_address],"Balance not sufficent");
    require((DiscountRequest/10000)*10000 == DiscountRequest);
    AddrMap[_address] -= DiscountRequest;
    _address.transfer(DiscountRequest);
    emit PaymentDone(msg.sender,msg.value);

}


function payAndRequestDiscount(address _address,uint256 DiscountRequest) external payable{
    addAddress(_address);
    addDiscount(_address,DiscountRequest);
}

function addDiscount(address _address,uint _discountRequest) internal{
    AddrMap[_address] += _discountRequest;
}

function GetDiscount(address _address) public view returns(uint){
    return AddrMap[_address];
}

function CheckIfAddressExists(address _address) private view returns (bool){
    for (uint i = 0; i<Accounts.length;i++){
            if(Accounts[i]== _address)
                return true;}
    return false;
}

function addAddress(address _address) internal{
    if(!CheckIfAddressExists(_address)){
        Accounts.push(_address);
    }
}

function ContractBalance() public view returns(uint256){
    return address(this).balance;
}

function getBalanceInEther() external view returns(uint){
        return address(this).balance;
    }

function getAccounts() external view returns(address[] memory){
    return Accounts;
}
}