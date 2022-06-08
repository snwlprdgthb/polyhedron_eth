pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;


contract Marketplace {
    enum State {Purchased, Activated, Deactivated}

    struct ItemStruct {
        uint256 id; //32
        uint256 price; //32
        address owner; // 20
        bytes32 proof; //32
        bytes16 itemId;
        State state; //1
    }
    mapping(uint256 => bytes32) private ownedItemHash; // Id => itemHash
    mapping(bytes32 => ItemStruct) private ownedItem; // itemHash => itemData

    uint256 private totalOwned;
    address payable private owner;
    bool private isFrozen = false;


    constructor () {
        changeOwner(msg.sender);
    }

    receive () external payable {}

    modifier onlyOwner () {
        if(msg.sender != getOwner()) {
            revert("error");
        }
        _;
    }

    function frozenContract () external onlyOwner {
          isFrozen = true;
    }

    function unFrozenContract () external onlyOwner {
        isFrozen = false;
    }


    modifier onlyWhenFrozen () {
        require(isFrozen, "only use when contract is frozen");
        _;
    }

    function withdraw (uint value) external onlyOwner {
             (bool success, )  = owner.call{value: value}("");
             require(success, "not enough balance in contract");           
   }

    function allWithdraw ()  external onlyOwner onlyWhenFrozen {
         (bool success, ) = owner.call{value: address(this).balance}("");
         require(success, "can't send some ether");
   }

    function selfDestruct () external onlyOwner  onlyWhenFrozen {
       selfdestruct(owner);
   }
    
    function purchaseItem(bytes16 itemId, bytes32 proof) external payable {
        bytes32 hashItem = keccak256(abi.encodePacked(itemId, msg.sender));

        if (alreadyOwned(hashItem)) {
              revert("error");
        }

        uint256 id = totalOwned++;
        

        ownedItemHash[id] = hashItem;
        ownedItem[hashItem] = ItemStruct({
            id: id,
            itemId: itemId,
            price: msg.value,
            owner: msg.sender,
            proof: proof,
            state: State.Purchased
        });
    }


    function rePurchaseItem (bytes32 hash) external payable {
         
        if(!ifItemCreated(hash)) {
            revert("doesn't include item");
        }

        if(!alreadyOwned(hash)) {
            revert("now owned");
        }

        ItemStruct storage item =  ownedItem[hash];

            if(item.state !=  State.Deactivated) {
                revert("incorrect state");
            }

      item.state = State.Purchased;
      item.price = msg.value;

    }

    function getItemHashByID(uint256 id)
        external
        view
        returns (bytes32 itemHash)
    {
        return ownedItemHash[id];
    }

   

    function transferOwneship (address newOwner) external onlyOwner {
        changeOwner(newOwner);
    }
    
    function verifyItem (bytes32 hash) external onlyOwner returns(bool) {
      if(!ifItemCreated(hash)) {  revert("error: item doesn't exists");}

      ItemStruct storage item = ownedItem[hash];

      if(item.state != State.Purchased) {
          revert("incorrrect state value");
      }
      item.state = State.Activated;
    }
    

    function deactivateItem (bytes32 hash) external onlyOwner {
        if(!ifItemCreated(hash) ) {
              revert("doesn't include item");
        }

        ItemStruct storage item = ownedItem[hash];

          if(item.state != State.Purchased) {
              revert("state isn't purchased");
          }

          (bool success, ) = item.owner.call{value: item.price}("");
          require(success, "transaction failed");

          item.state = State.Deactivated;
          item.price = 0;


    }

     function getItemDataByHash(bytes32 itemHash)
        external
        view
        returns (ItemStruct memory)
    {
        return ownedItem[itemHash];
    }

    function ifItemCreated (bytes32 hash) private view returns(bool) {
        return ownedItem[hash].owner != 0x0000000000000000000000000000000000000000;
    }

    function getTotalCount() external view returns (uint256 total) {
        return totalOwned;
    }

    function alreadyOwned(bytes32 ownedHash) private view returns (bool) {
        return ownedItem[ownedHash].owner == msg.sender;
    }

     function getOwner() public view returns(address){
        return owner;
    }

    function changeOwner (address newOwner) private {
        owner = payable(newOwner);
    }
}

