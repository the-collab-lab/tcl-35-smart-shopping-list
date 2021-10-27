import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { NavLink } from 'react-router-dom';
import { collection, doc, onSnapshot } from 'firebase/firestore';
import Footer from './Footer';
import AddItem from './AddItem';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [renderInput, setRenderInput] = useState(false);

  const currToken = localStorage.getItem('currToken');
  const itemsCollectionRef = collection(db, 'shopping-list');

  const addItemBtn = (props) => {
    return <button onClick={props.children}>Add Item</button>;
  };

  // get items
  useEffect(() => {
    const getItems = async () => {
      currToken &&
        onSnapshot(doc(itemsCollectionRef, currToken), (doc) => {
          if (!doc.data()) {
            setEmptyList(true);
            setRenderInput(true);
          } else {
            setItems(doc.data().items);
            setEmptyList(false);
            setRenderInput(false);
          }
        });
    };
    getItems();
  }, []);

  return (
    <div id="main-container" className="flex-wrapper">
      <div id="sub-wrapper">
        <h2>Names of Items in your shopping List</h2>
        {loading && <p>Loading ... </p>}
        {error && <p>An error occured</p>}
        {emptyList && <p>You don't have any list yet</p>}

        {items.map((item) => {
          return (
            <div className="item-wrapper">
              <p>{item.itemName}</p>
            </div>
          );
        })}
      </div>
      {renderInput && <AddItem addItemBtn={addItemBtn} />}
      <Footer />
    </div>
  );
};

export default ListItem;
