import React from 'react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  setDoc,
  onSnapshot,
} from '@firebase/firestore';
import Footer from './Footer';
import { validateInput } from './Validation';

const AddItem = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [nextPurchase, setNextPurchase] = useState(7);
  const [lastPurchase] = useState(null);
  const [hasError, setHasError] = useState('false');
  const [errors, setErrors] = useState('');
  const [newItem, setNewItem] = useState({});

  const errorsList = {
    empty: 'Make sure you add an item',
    duplicate: 'Item already exists',
  };

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  useEffect(() => {
    const getItems = async () => {
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (doc.data()) setItems(doc.data().items);
        });
    };
    getItems();
  }, []);

  const addItems = async () => {
    const refData = await getDocs(itemsCollectionRef);
    let tokenList = refData.docs.map(({ id }) => id);

    if (tokenList.includes(currToken)) {
      if (validateInput({ newItem, setErrors, errorsList, items })) {
        await updateDoc(doc(db, 'shopping-list', currToken), {
          items: arrayUnion(newItem),
        });
      } else {
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }
    } else {
      if (validateInput({ newItem, setErrors, errorsList, items })) {
        await setDoc(doc(db, 'shopping-list', currToken), {
          items: [newItem],
        });
      }
    }
  };

  useEffect(() => {
    addItems();
  }, [newItem]);

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

  const handleValueChange = (e) => {
    setNextPurchase(calculateNextPurchase(e.target.value));
  };

  const handleClick = (e) => {
    e.preventDefault();
    setNewItem({
      itemName,
      nextPurchase,
      lastPurchase,
      estimatedPurchaseInterval: null,
      totalPurchases: 0,
    });
    // addItems();
    clearFormElements();
  };

  return (
    <div id="main-container" className="add-items">
      <h1>What To Buy</h1>
      <form id="sub-wrapper" onSubmit={handleClick}>
        <div className="form-item">
          {hasError && <p className="error"> {errors} </p>}

          <label htmlFor="itemName">I want to buy: </label>
          <input
            type="text"
            placeholder="Bread"
            id="itemName"
            value={itemName}
            onChange={(e) => {
              setItemName(e.target.value);
            }}
          />
        </div>

        <div className="form-item">
          <fieldset>
            <legend>How soon?</legend>
            <input
              type="radio"
              name="timeToBuy"
              id="soon"
              value="soon"
              onChange={handleValueChange}
              checked
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
        </div>

        <button id="submit" className="form-item">
          Add Item
        </button>
      </form>
      <Footer />
    </div>
  );
};

export default AddItem;
