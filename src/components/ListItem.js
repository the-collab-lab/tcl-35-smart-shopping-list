import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [renderInput, setRenderInput] = useState(false);

  const currToken = localStorage.getItem('currToken');
  let currentCollectionRef;
  const itemsCollectionRef = collection(db, 'shopping-list');
  const history = useHistory();

  if (currToken) {
    currentCollectionRef = doc(db, 'shopping-list', currToken);
  }

  //route to list

  const addItemBtn = () => {
    history.push('/add');
  };

  // get items
  useEffect(() => {
    setLoading(true);
    const getItems = async () => {
      if (!currToken) {
        history.push('/');
      }
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (!doc.data()) {
            setEmptyList(true);
            setLoading(false);
          } else {
            setItems(doc.data().items);
            setLoading(false);
          }
        });
    };
    getItems();
  }, []);

  const handlePurchaseInLastDay = (lastPurchase) => {
    if (!lastPurchase) return false;
    const DayInMilliSeconds = 60 * 60 * 24 * 1000;
    return Date.now() - lastPurchase < DayInMilliSeconds;
  };

  const handleOnChange = (itemName) => {
    for (let item of items) {
      if (item.itemName === itemName) {
        item.lastPurchase = Date.now();
        updateDoc(currentCollectionRef, { items: items });
      }
    }
    setItems(items);
  };

  const cleanString = (str) => {
    const regex = /[a-z]/g;
    return str.trim().toLowerCase().match(regex).join('');
  };

  const searchItems = async (e) => {
    let docSnap = await getDoc(currentCollectionRef);
    const data = docSnap.data().items;
    const input = e.target.value;
    const filteredItems = [];
    for (const item of data) {
      if (cleanString(item.itemName).includes(cleanString(input))) {
        filteredItems.push(item);
      }
    }
    setItems(filteredItems);
  };

  return (
    <div>
      <div id="main-container" className="flex-wrapper">
        <input
          type="text"
          placeholder="Bread"
          id="itemName"
          // value={}
          onKeyUp={(e) => {
            searchItems(e);
          }}
        />

        <div id="sub-wrapper">
          <h2>Names of Items in your shopping List</h2>
          {loading && <p>Loading ... </p>}
          {error && <p>An error occured</p>}
          {emptyList && <p>You dont have any list yet</p>}

          {items.map((item) => {
            return (
              <div key={item.itemName} className="item-wrapper">
                <div className="left-list-pane">
                  <input
                    type="checkbox"
                    id={item.itemName}
                    disabled={handlePurchaseInLastDay(item.lastPurchase)}
                    checked={handlePurchaseInLastDay(item.lastPurchase)}
                    onChange={() => handleOnChange(item.itemName)}
                  />
                </div>
                <div className="right-list-pane">
                  <p>{item.itemName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <section>
        {emptyList && <button onClick={addItemBtn}>Add Item</button>}
      </section>
      <Footer />
    </div>
  );
};

export default ListItem;
