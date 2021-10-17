import React from 'react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { NavLink } from 'react-router-dom';
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

  const clearFormElements = () => {
    setItemName('');
    document.getElementById('soon').checked = false;
    document.getElementById('kindOfSoon').checked = false;
    document.getElementById('notSoon').checked = false;
  };

  const handleValueChange = (e) =>
    setNextPurchase(calculateNextPurchase(e.target.value));

  const handleClick = (e) => {
    e.preventDefault();
    addItems();
    clearFormElements();
  };

  return (
    <div id="main-container" className="add-items">
      <form id="sub-wrapper">
        <div className="form-item">
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
        </div>

        <div className="form-item">
          <p>How soon do you want to buy your item?</p>
          <input
            checked
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
        </div>

        <button id="submit" className="form-item" onClick={handleClick}>
          Add Item
        </button>
      </form>

      <footer>
        <nav className="links-wrapper">
          <ul className="links">
            <li>
              <NavLink to="/list" activeClassName="active">
                List
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" activeClassName="active">
                Add Item
              </NavLink>
            </li>
          </ul>
        </nav>
      </footer>
    </div>
  );
};

export default AddItem;
