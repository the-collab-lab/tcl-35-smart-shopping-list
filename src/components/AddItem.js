import React from 'react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from '@firebase/firestore';

const AddItem = () => {
  const userToken = localStorage.getItem('currToken');
  const [itemName, setItemName] = useState('');
  const [nextPurchase, setNextPurchase] = useState(0);
  const [lastPurchase, setLastPurchase] = useState(null);
  const [tokenExists, setTokenExists] = useState(false);
  const [availableTokens, setAvailableTokens] = useState([]);
  const [shoppingItems, setShoppingItems] = useState([]);
  const [docObj, setDocObj] = useState(null);

  let tokenList = [];
  const itemsCollectionRef = collection(db, 'shopping-list');

  const addItems = async () => {
    const refData = await getDocs(itemsCollectionRef);

    tokenList = refData.docs.map((doc) => doc.data().currToken);
    setAvailableTokens(tokenList);

    const q = query(
      collection(db, 'shopping-list'),
      where('currToken', '==', 'userToken'),
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);
    setDocObj(querySnapshot);

    if (availableTokens.includes('userToken')) {
      console.log(availableTokens[0]);
      setTokenExists(true);
      setShoppingItems(...querySnapshot.docs.data().items);
      setShoppingItems(...shoppingItems, {
        itemName,
        nextPurchase,
        lastPurchase,
      });
      querySnapshot.update({
        items: db.FieldValue.arrayUnion(...shoppingItems),
      });
    } else {
      console.log('No such document!');
      setTokenExists(false);
      addDoc(collection(db, 'shopping-list'), {
        items: [
          {
            itemName,
            nextPurchase,
            lastPurchase,
          },
        ],
        currToken: 'userToken',
      });
    }
  };

  const calculateNextPurchase = (purchaseTime) => {
    if (purchaseTime === 'Not soon') {
      return 30;
    } else if (purchaseTime === 'Kind of soon') {
      return 14;
    } else {
      return 7;
    }
  };

  const handleValueChange = (e) =>
    setNextPurchase(calculateNextPurchase(e.target.value));

  const handleClick = (e) => {
    e.preventDefault();
    addItems();
    setItemName('');
  };

  return (
    <div>
      <form>
        <label htmlFor="itemName">What do you want to buy: </label>
        <input
          type="text"
          placeholder="Bread"
          id="itemName"
          value={itemName}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
          required
        />

        <fieldset>
          <legend>How soon do you want to buy your item?</legend>

          <input
            type="radio"
            name="timeToBuy"
            id="soon"
            value="soon"
            onChange={handleValueChange}
          />
          <label htmlFor="soon">Soon</label>

          <input
            type="radio"
            name="timeToBuy"
            id="kindOfSoon"
            value="Kind of soon"
            onChange={handleValueChange}
          />
          <label htmlFor="kindOfSoon">Kind of Soon</label>

          <input
            type="radio"
            name="timeToBuy"
            id="notSoon"
            value="Not soon"
            onChange={handleValueChange}
          />
          <label htmlFor="notSoon">Not Soon</label>
        </fieldset>

        <button onClick={handleClick}>Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
