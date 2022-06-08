const Marketplace = artifacts.require("Marketplace");

const getGas = async res => {
  const tx = await web3.eth.getTransaction(res.tx);
  const gasUsed = web3.utils.toBN(res.receipt.gasUsed);
  const gasPrice = web3.utils.toBN(tx.gasPrice);
  return gasUsed.mul(gasPrice);
};

contract("Marketplace", accounts => {
  let _contract = null;
  let contractOwner = null;
  let buyer = null;

  let itemId = "0x00000000000000000000000000000009";
  let proof =
    "0x0000000000000000000000000000000900000000000000000000000000000009";

  let itemId2 = "0x00000000000000000000000000000008";
  let proof2 =
    "0x0000000000000000000000000000000800000000000000000000000000000008";

  let value = 900000000;
  let itemHash = null;

  before(async () => {
    _contract = await Marketplace.deployed();
    contractOwner = accounts[0];
    buyer = accounts[1];
  });

  describe("Can purchase item", () => {
    before(async () => {
      await _contract.purchaseItem(itemId, proof, {
        from: buyer,
        value: value
      });
    });

    it("Should not allow re-purchased item already owned", async () => {
      try {
        await _contract.purchaseItem(itemId, proof, {
          from: buyer,
          value: value
        });
      } catch (error) {
        assert(error);
      }
    });

    it("Can get item hash by index", async () => {
      let index = 0;
      itemHash = await _contract.getItemHashByID(index);

      let expectedHash = web3.utils.soliditySha3(
        {
          type: "bytes16",
          value: itemId
        },
        {
          type: "address",
          value: buyer
        }
      );

      assert.equal(
        itemHash,
        expectedHash,
        "Item hash isn't matching the hash purchased item"
      );
    });

    it("should match data of the item purchased by buyer", async () => {
      let expextedId = 0;
      let expectedState = 0;
      let course = await _contract.getItemDataByHash(itemHash);

      assert.equal(course.id, expextedId, `item id should be 0 `);
      assert.equal(course.price, value, `item price should be  ${value}`);
      assert.equal(course.owner, buyer, `item owner should be ${buyer}`);
      assert.equal(course.proof, proof, `item proof should be ${proof}`);
      assert.equal(
        course.state,
        expectedState,
        `item state should be ${expectedState}`
      );
    });
  });

  describe("Verify purchased item", () => {
    it("shoould be activated state", async () => {
      await _contract.verifyItem(itemHash, { from: contractOwner });
      let course = await _contract.getItemDataByHash(itemHash);
      let expectedState = 1;
      assert.equal(course.state, expectedState, "state should be activated");
    });

    it("shoould not be verify by user who not owned of contract", async () => {
      try {
        await _contract.verifyItem(itemHash, { from: buyer });
      } catch (error) {
        assert(error, "only owner can verify item");
      }
    });
  });

  describe("Transfer ownership", () => {
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getOwner();
    });

    it("getOwner should return owner address", () => {
      assert.equal(
        currentOwner,
        contractOwner,
        "Contract owner isn't matching getOwner func return value"
      );
    });

    it("Transfer ownerhsip func should return error if invoke not owner", async () => {
      try {
        await _contract.transferOwneship(accounts[3], { from: accounts[4] });
      } catch (error) {
        assert(error, "only owner can transfer ownership");
      }
    });

    it("should transfer ownership from owner to third user", async () => {
      await _contract.transferOwneship(accounts[5], { from: contractOwner });
      let newOwner = await _contract.getOwner();
      assert.equal(newOwner, accounts[5]);
    });

    it("should transfer ownership back to contract creator", async () => {
      await _contract.transferOwneship(contractOwner, { from: accounts[5] });
      let newOwner = await _contract.getOwner();
      assert.equal(newOwner, contractOwner);
    });
  });

  describe("Deactivate item", () => {
    let itemHash2 = null;
    let contractOwner = null;

    before(async () => {
      await _contract.purchaseItem(itemId2, proof2, {
        from: buyer,
        value: value
      });
      itemHash2 = await _contract.getItemHashByID(1);
      contractOwner = await _contract.getOwner();
    });

    it("should not be able to deactivated item by not owner contract", async () => {
      try {
        await _contract.deactivateItem(itemHash2, { from: buyer });
      } catch (e) {
        assert(e, "only owner can deativate");
      }
    });

    it("should have deactivate state and price zero", async () => {
      const balanceBuyerBeforeTX = await web3.eth.getBalance(buyer);
      const balanceContractBeforeTX = await web3.eth.getBalance(
        _contract.address
      );
      const balanceOwnerBeforeTX = await web3.eth.getBalance(contractOwner);

      const res = await _contract.deactivateItem(itemHash2, {
        from: contractOwner
      });

      const balanceBuyerAfterTX = await web3.eth.getBalance(buyer);
      const balanceContractAfterTX = await web3.eth.getBalance(
        _contract.address
      );
      const balanceOwnerAfterTX = await web3.eth.getBalance(contractOwner);

      const gas = await getGas(res);

      const item = await _contract.getItemDataByHash(itemHash2);
      const expectedPrice = 0;
      const expectedState = 2;

      assert.equal(
        web3.utils
          .toBN(balanceBuyerBeforeTX)
          .add(web3.utils.toBN(value))
          .toString(),
        balanceBuyerAfterTX,
        "incorrect buyer balance"
      );

      assert.equal(
        web3.utils
          .toBN(balanceContractBeforeTX)
          .sub(web3.utils.toBN(value))
          .toString(),
        balanceContractAfterTX,
        "incorrect contract balance"
      );

      assert.equal(
        web3.utils
          .toBN(balanceOwnerBeforeTX)
          .sub(gas)
          .toString(),
        balanceOwnerAfterTX,
        "incorrect owner balance"
      );

      assert.equal(item.state, expectedState, "state isn't deactivated");
      assert.equal(item.price, expectedPrice, "price isn't zero");
    });

    it("should not be activate diactivated item", async () => {
      try {
        await _contract.verifyItem(itemHash2, { from: contractOwner });
      } catch (e) {
        assert(e, "can't activate diactivated item");
      }
    });
  });

  describe("Re-Puchase item", () => {
    let itemHash2 = null;

    before(async () => {
      itemHash2 = await _contract.getItemHashByID(1);
    });

    it("should not repuchase if item doesn't exist", async () => {
      try {
        const fakeHash =
          "0x0000000000000000000000000000000100000000000000000000000000000001";
        await _contract.rePurchaseItem(fakeHash, { from: buyer });
      } catch (e) {
        assert(e, "doesn't include hash");
      }
    });

    it("should not repuchase if not item owner", async () => {
      try {
        const nowOwnerItem = accounts[9];
        await _contract.rePurchaseItem(itemHash2, {
          from: nowOwnerItem,
          value
        });
      } catch (e) {
        assert(e, "only owner item can repurchase item");
      }
    });

    it("should be repurrchase with oiginal buyer", async () => {
      const balanceBuyerBeforeTX = await web3.eth.getBalance(buyer);
      const balanceContractBeforeTX = await web3.eth.getBalance(
        _contract.address
      );

      const res = await _contract.rePurchaseItem(itemHash2, {
        from: buyer,
        value: value
      });

      const balanceBuyerAterTX = await web3.eth.getBalance(buyer);
      const balanceContractAterTX = await web3.eth.getBalance(
        _contract.address
      );

      const gas = await getGas(res);

      const item = await _contract.getItemDataByHash(itemHash2);

      const expectedState = 0;
      const expectedPrice = value;

      assert.equal(item.owner, buyer, "should be buyer");
      assert.equal(item.state, expectedState, "should be purchased state");
      assert.equal(item.price, expectedPrice, "should be purchased state");
      assert.equal(
        web3.utils
          .toBN(balanceBuyerBeforeTX)
          .sub(web3.utils.toBN(value))
          .sub(gas)
          .toString(),
        balanceBuyerAterTX,
        "balance isn't correct"
      );
      assert.equal(
        web3.utils
          .toBN(balanceContractBeforeTX)
          .add(web3.utils.toBN(value))
          .toString(),
        balanceContractAterTX,
        "contract balance isn't correct"
      );
    });
  });

  describe("Receive funds", () => {
    it("should have transacted funds", async () => {
      const value = "100000000000000000";
      const contractBalanceBeforeTX = await web3.eth.getBalance(
        _contract.address
      );

      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value: value
      });

      const contractBalanceAfterTX = await web3.eth.getBalance(
        _contract.address
      );

      assert(
        web3.utils
          .toBN(contractBalanceBeforeTX)
          .add(web3.utils.toBN(value))
          .toString(),
        contractBalanceAfterTX,
        "value after/before isn't matching"
      );
    });
  });

  describe("Withdraw funds", () => {
    const value = "100000000000000000"; //0.1 eth
    const overLimitValue = "1000000000000000000"; //1eth
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getOwner();
      await web3.eth.sendTransaction({
        from: buyer,
        to: _contract.address,
        value: value
      });
    });

    it("should fail when withdrawing with not owner", async () => {
      try {
        await _contract.withdraw(value, { from: buyer });
      } catch (e) {
        assert(e, "only owner can withdraw");
      }
    });

    it("should fail when withdrawing over limit balance", async () => {
      try {
        await _contract.withdraw(overLimitValue, {
          from: currentOwner
        });
      } catch (e) {
        assert(e, "over limit withdraw");
      }
    });

    it("should have + 0.1 eth after withdraw", async () => {
      const balanceOwnerBeforeTX = await web3.eth.getBalance(currentOwner);
      const res = await _contract.withdraw(value, { from: currentOwner });
      const balanceOwnerAfterTX = await web3.eth.getBalance(currentOwner);

      const gas = await getGas(res);

      assert(
        web3.utils
          .toBN(balanceOwnerBeforeTX)
          .add(web3.utils.toBN(value))
          .sub(gas)
          .toString(),
        balanceOwnerAfterTX,
        "owner balance isn't matching"
      );
    });
  });

  describe("allWithdraw", () => {
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getOwner();
    });

    after(async () => {
      await _contract.unFrozenContract({ from: currentOwner });
    });

    it("should fail when contract is frozen", async () => {
      try {
        await _contract.allWithdraw({ from: currentOwner });
      } catch (e) {
        assert(e, "contract is frozen");
      }
    });

    it("should have contract funds on owner dep", async () => {
      await _contract.frozenContract({ from: currentOwner });
      const balanceOwnerBeforeTX = await web3.eth.getBalance(currentOwner);
      const balanceContractBeforeTX = await web3.eth.getBalance(
        _contract.address
      );

      const res = await _contract.allWithdraw({ from: currentOwner });

      const balanceOwnerAfterTX = await web3.eth.getBalance(currentOwner);
      // const balanceContractAfterTX = await web3.eth.getBalance(currentOwner);

      const gas = await getGas(res);

      assert(
        web3.utils
          .toBN(balanceOwnerBeforeTX)
          .add(web3.utils.toBN(balanceContractBeforeTX))
          .sub(gas)
          .toString(),
        balanceOwnerAfterTX,
        "balance isn't matchcing"
      );
    });

    it("should contract have zero balance after withdraw all cost", async () => {
      const balanceContractAfterAllWithdraw = await web3.eth.getBalance(
        _contract.address
      );

      assert(
        balanceContractAfterAllWithdraw,
        0,
        "contract balance should be a zerooo"
      );
    });
  });

  describe("Self Destruct", () => {
    let currentOwner = null;

    before(async () => {
      currentOwner = await _contract.getOwner();
    });

    it("should fail when contract is frozen", async () => {
      try {
        await _contract.selfDestruct({ from: currentOwner });
      } catch (e) {
        assert(e, "contract is frozen");
      }
    });

    it("should have contract funds on owner dep after self desctruct", async () => {
      await _contract.frozenContract({ from: currentOwner });

      const balanceOwnerBeforeSELFDESTRUCT = await web3.eth.getBalance(
        currentOwner
      );
      const balanceContractBeforeSELFDESTRUCT = await web3.eth.getBalance(
        _contract.address
      );

      const res = await _contract.selfDestruct({ from: currentOwner });

      const balanceOwnerAfterSELFDESTRUCT = await web3.eth.getBalance(
        currentOwner
      );

      const gas = await getGas(res);

      assert(
        web3.utils
          .toBN(balanceOwnerBeforeSELFDESTRUCT)
          .add(web3.utils.toBN(balanceContractBeforeSELFDESTRUCT))
          .sub(gas)
          .toString(),
        balanceOwnerAfterSELFDESTRUCT,
        "balance isn't matchcing"
      );
    });

    it("should contract have zero balance after self destruct", async () => {
      const balanceContractAfterSelfDestruct = await web3.eth.getBalance(
        _contract.address
      );

      assert(
        balanceContractAfterSelfDestruct,
        0,
        "contract balance should be a zerooo"
      );
    });

    it("should have 0x bytecode", async () => {
      const code = await web3.eth.getCode(_contract.address);
      assert(code, "0x", "bytecode contract gotta be 0x");
    });
  });
});
