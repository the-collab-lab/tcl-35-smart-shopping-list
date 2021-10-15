import React from 'react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc,
} from '@firebase/firestore';

const AddItem = () => {
  const [itemName, setItemName] = useState('');
  const [nextPurchase, setNextPurchase] = useState(0);
  const [lastPurchase, setLastPurchase] = useState(null);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  const addItems = async () => {
    const refData = await getDocs(itemsCollectionRef);
    let tokenList = refData.docs.map(({ id }) => id);

    if (tokenList.includes(currToken)) {
      const newList = {
        itemName,
        nextPurchase,
        lastPurchase,
      };
      await updateDoc(doc(db, 'shopping-list', currToken), {
        items: arrayUnion(newList),
      });
    } else {
      await setDoc(doc(db, 'shopping-list', currToken), {
        items: [
          {
            itemName,
            nextPurchase,
            lastPurchase,
          },
        ],
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
