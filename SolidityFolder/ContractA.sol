pragma solidity ^0.8.4;
//Questo contratto deve ricevere i pagamenti in cui calcolare lo sconto e quelli in cui si vuole consumare uno sconto


interface StorageContract{
    function payAndRequestDiscount(address _address,uint256 DiscountRequest) external payable;
    function useDiscountAndDelete(address payable _address,uint256 DiscountRequest) external payable;
    function GetDiscount(address _address) external view returns(uint);
}

contract InterfaceContract{
    
    event Paysent(uint256 value);

    event PayDiscount(uint value);
    
    address private Storage_address;
    
    uint256 private actualDiscount;
    
    address private owner;
    
    StorageContract StorageInstance;
    
    constructor(address _StorageAddress,uint _discount){
        Storage_address=_StorageAddress;
        owner = msg.sender;
        actualDiscount = _discount;
        StorageInstance = StorageContract(Storage_address);
    }
    
    receive() external payable{}
    
    function payRequireDiscount(address payable _address)  amountAboveZero(msg.value) validAddress(_address) external payable{
        uint256 calcDiscount = msg.value*actualDiscount/100;
        StorageInstance.payAndRequestDiscount{value: calcDiscount}(_address,calcDiscount);
        emit Paysent(calcDiscount);
    }
    
    function payAndApplyDiscount(address payable _address,uint _RequestedDiscount) ValidDiscountRequest(_address,_RequestedDiscount) validAddress(_address) amountAboveZero(_RequestedDiscount) amountAboveZero(msg.value) external payable{
        StorageInstance.useDiscountAndDelete(_address,_RequestedDiscount);
        emit PayDiscount(msg.value);
    }
    
    function getMyCredit(address _address) public view returns(uint){
        uint balance = StorageInstance.GetDiscount(_address);
        return balance;
    }

    modifier ValidDiscountRequest(address _address,uint _RequestedDiscount) {
        require(StorageInstance.GetDiscount(_address) >= _RequestedDiscount);
        _;
    }

    modifier UnderFlowDetection(uint _Value) {
        require((_Value/10000)*10000 == _Value);
        _;
    }

    modifier OnlyOwnerof(){
        require(msg.sender == owner);
        _;
    }
    
    modifier amountAboveZero(uint _amount){
        require(_amount > 0 );
        _;
    }
    
    modifier validAddress(address _address){
        require(_address != address(0));
        _;
    }
    
    function setStorageContract(address _address) external OnlyOwnerof{
        Storage_address = _address;
        StorageInstance = StorageContract(Storage_address);
    }
    
    function getStorageContract() external OnlyOwnerof view returns(address){
        return Storage_address;
    }
    
    function SetDiscount(uint _discount) external OnlyOwnerof{
        require(actualDiscount >= 0 && actualDiscount<=100);
        actualDiscount = _discount;
    }
    
    function getCurrentDiscount() external OnlyOwnerof view returns(uint){
        return actualDiscount;
    }
    
    function getBalance() external OnlyOwnerof view returns(uint){
        return address(this).balance;
    }
    
    function setOwner(address payable _address) external OnlyOwnerof{
        owner = _address;
    }
    
    function withdrow() external OnlyOwnerof{
    payable(msg.sender).transfer(address(this).balance);

    }
    
}