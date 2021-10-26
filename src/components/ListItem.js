import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import Footer from './Footer';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');
  const [checkBoxes, setCheckBoxes] = useState([]);

  useEffect(() => {
    const getItems = async () => {
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (!doc.data()) {
            setEmptyList(true);
          } else {
            setItems(doc.data().items);
          }
        });
    };
    getItems();
  }, []);

  useEffect(() => {
    setCheckBoxes(new Array(items.length).fill(false));
  }, [items]);

  // TODO: this is fixed now
  console.log(checkBoxes);

  const readList = (position, callback) => {
    let newList = [];
    onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
      for (const item of doc.data().items) {
        if (item.itemName === items[position].itemName) {
          item['lastPurchase'] = new Date();
          newList.push(item);
        } else {
          newList.push(item);
        }
      }
    });
    callback(newList);
  };

  const updateList = async (position) => {
    const ref = doc(db, 'shopping-list', currToken);
    readList(position, (listItems) => {
      setItems(listItems);
      // setDoc(ref, { items: [{itemName: 'melon', lastPurchase: null, nextPurchase: null}] });
      console.log(listItems);
      console.log(items);
      // FIXME: items is not getting the updated newList
      updateDoc(ref, { items: items });
    });
  };

  const handleOnChange = (position) => {
    for (let item of items) {
      if (item['itemName'] === items[position]['itemName']) {
        updateList(position);
      }
    }

    const updatedCheckBoxes = checkBoxes.map((item, index) =>
      index === position ? !item : item,
    );

    setCheckBoxes(updatedCheckBoxes);
    setItems(items);
  };

  return (
    <div id="main-container" className="flex-wrapper">
      <div id="sub-wrapper">
        <h2>Names of Items in your shopping List</h2>
        {loading && <p>Loading ... </p>}
        {error && <p>An error occured</p>}
        {emptyList && <p>You dont have any list yet</p>}

        {items.map((item, index) => {
          return (
            <div key={index} className="item-wrapper">
              <div className="left">
                <input
                  type="checkbox"
                  id={`custom-checkbox-${index}`}
                  checked={checkBoxes[index]}
                  onChange={() => handleOnChange(index)}
                />
              </div>
              <div className="right">
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
