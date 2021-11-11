import React from 'react';
import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { NavLink } from 'react-router-dom';
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

const AddItem = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [nextPurchase, setNextPurchase] = useState(7);
  const [lastPurchase, setLastPurchase] = useState(null);
  const [hasError, setHasError] = useState('false');
  const [errors, setErrors] = useState('');

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

  const cleanString = (str) => {
    const regex = /[a-z]/g;
    return str.trim().toLowerCase().match(regex).join('');
  };

  const validateInput = (list) => {
    if (!list.itemName) {
      setErrors(errorsList['empty']);
      return false;
    } else {
      for (const item of items) {
        if (cleanString(item.itemName) === cleanString(list.itemName)) {
          setErrors(errorsList['duplicate']);
          return false;
        }
      }
    }
    return true;
  };

  const addItems = async () => {
    const refData = await getDocs(itemsCollectionRef);
    let tokenList = refData.docs.map(({ id }) => id);

    const newList = {
      itemName,
      nextPurchase,
      lastPurchase,
      estimatedPurchaseInterval: null,
      totalPurchases: 0,
    };

    if (tokenList.includes(currToken)) {
      if (validateInput(newList)) {
        await updateDoc(doc(db, 'shopping-list', currToken), {
          items: arrayUnion(newList),
        });
      } else {
        setHasError(true);
        setTimeout(() => setHasError(false), 3000);
      }
    } else {
      if (validateInput(newList)) {
        await setDoc(doc(db, 'shopping-list', currToken), {
          items: [newList],
        });
      }
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

  const handleValueChange = (e) => {
    setNextPurchase(calculateNextPurchase(e.target.value));
  };

  const handleClick = (e) => {
    e.preventDefault();
    addItems();
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
            <div className="radio-wrapper">
              <div className="radio">
                <label htmlFor="soon" className="radio-label">
                  Soon
                </label>
                <input
                  type="radio"
                  name="timeToBuy"
                  id="soon"
                  value="soon"
                  onChange={handleValueChange}
                  checked
                />
              </div>
              <div className="radio">
                <label htmlFor="kindOfSoon" className="radio-label">
                  Kind of Soon
                </label>
                <input
                  type="radio"
                  name="timeToBuy"
                  id="kindOfSoon"
                  value="Kind of soon"
                  onChange={handleValueChange}
                />
              </div>
              <div className="radio">
                <label htmlFor="notSoon" className="radio-label">
                  Not Soon
                </label>
                <input
                  type="radio"
                  name="timeToBuy"
                  id="notSoon"
                  value="Not soon"
                  onChange={handleValueChange}
                />
              </div>
            </div>
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
