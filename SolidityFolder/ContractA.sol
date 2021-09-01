pragma solidity ^0.8.4;
//Questo contratto deve ricevere i pagamenti in cui calcolare lo sconto e quelli in cui si vuole consumare uno sconto


interface ContractB{
    function payAndRequestDiscount(address _address,uint256 DiscountRequest) external payable;
    function useDiscountAndDelete(address payable _address,uint256 DiscountRequest) external payable;
    function GetDiscount(address _address) external view returns(uint);
    function ContractBalance() external view returns(uint);
}

contract contractA{
    
    event Paysent(uint256 value);
    
    address private Storage_address;
    
    uint256 private actualDiscount = 50;
    
    address private owner;
    
    ContractB StorageContract;
    
    constructor(address _StorageAddress){
        Storage_address=_StorageAddress;
        owner = msg.sender;
        StorageContract = ContractB(Storage_address);
    }
    
    receive() external payable{}
    
    function payRequireDiscount(address payable _address)  amountAboveZero(msg.value) validAddress(_address) external payable{
        uint256 calcDiscount = msg.value*actualDiscount/100;
        require((calcDiscount/10000)*10000 == calcDiscount);
        StorageContract.payAndRequestDiscount{value: calcDiscount}(_address,calcDiscount);
        emit Paysent(calcDiscount);
    }
    
    function payAndApplyDiscount(address payable _address,uint RequestedDiscount) amountAboveZero(msg.value) validAddress(_address) external payable{
        StorageContract.useDiscountAndDelete(_address,RequestedDiscount);
    }
    
    function getMyCredit(address _address) public view returns(uint){
        uint balance = StorageContract.GetDiscount(_address);
        return balance;
    }

    modifier OnlyOwnerof(){
        require(msg.sender == owner);
        _;
    }
    
    modifier amountAboveZero(uint _amount){
        require(_amount != 0);
        _;
    }
    
    modifier validAddress(address _address){
        require(_address != address(0));
        _;
    }
    
    function setStorageContract(address _address) external OnlyOwnerof{
        Storage_address = _address;
    }
    
    function getStorageContract() external OnlyOwnerof view returns(address){
        return Storage_address;
    }
    
    function SetDiscount(uint _discount) external OnlyOwnerof{
        actualDiscount = _discount;
    }
    
    function getCurrentDiscount() external view returns(uint){
        return actualDiscount;
    }
    
    function getBalance() external OnlyOwnerof view returns(uint){
        return address(this).balance;
    }
    
    function setOwner(address payable _address) external OnlyOwnerof{
        owner = _address;
    }
    
    function getStorageContractBalance() public view returns(uint){
        return StorageContract.ContractBalance();
    }
    
    function withdrow() external OnlyOwnerof{
    payable(msg.sender).transfer(address(this).balance);

    }
    
}