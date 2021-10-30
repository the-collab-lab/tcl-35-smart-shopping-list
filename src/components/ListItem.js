import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../lib/firebase.js';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [renderInput, setRenderInput] = useState(false);

  const history = useHistory();
  const currToken = localStorage.getItem('currToken');
  let currentCollectionRef;
  const itemsCollectionRef = collection(db, 'shopping-list');
  const history = useHistory();

  const addItemBtn = () => {
    history.push('/add');
  };

  if (currToken) {
    currentCollectionRef = doc(db, 'shopping-list', currToken);
  }

  useEffect(() => {
    setLoading(true);
    const getItems = async () => {
    const getItems = () => {
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

  return (
    <div>
      <section id="">
        <div id="main-container">
          <h2>Names of Items in your shopping List</h2>
          {loading && <p>Loading ... </p>}
          {error && <p>An error occured</p>}
          {emptyList && <p>You don't have any list yet</p>}
          {items.map((item) => {
            return (
              <div className="item-wrapper">
                <p key="item.itemName">{item.itemName}</p>
              </div>
            );
          })}
        </div>
      </section>
      <section>
        {emptyList && <button onClick={addItemBtn}>Add Item</button>}
      </section>
    <div id="main-container" className="flex-wrapper">
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
      <Footer />
    </div>
  );
};

export default ListItem;
