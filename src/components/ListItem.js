import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';
import { searchListHandler } from './customFilter.js';
import { sortItems } from './Sort.js';

const ListItem = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [searchlist, setSearchList] = useState('');

  const currToken = localStorage.getItem('currToken');
  let currentCollectionRef;
  const itemsCollectionRef = collection(db, 'shopping-list');
  const history = useHistory();
  const DayInMilliSeconds = 60 * 60 * 24 * 1000;

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

  // event handlers
  const handlePurchaseInLastDay = (lastPurchase) => {
    if (!lastPurchase) return false;
    return Date.now() - lastPurchase < DayInMilliSeconds;
  };

  const handleOnChange = (itemName) => {
    for (let item of items) {
      if (item.itemName === itemName) {
        const daysSinceLastTransaction = item.lastPurchase
          ? Math.round((Date.now() - item.lastPurchase) / DayInMilliSeconds)
          : 0;
        item.estimatedPurchaseInterval = calculateEstimate(
          item.estimatedPurchaseInterval,
          daysSinceLastTransaction,
          item.totalPurchases,
        );
        item.lastPurchase = Date.now();
        item.totalPurchases = item.totalPurchases + 1;
        updateDoc(currentCollectionRef, { items: items });
      }
    }
    setItems(items);
  };

  const handleDeleteList = (itemName) => {
    let confirm = window.confirm(
      'Are you sure you want to delete this item from the list?',
    );
    if (confirm) {
      const remainingItems = items.filter((item) => {
        return item.itemName !== itemName;
      });
      setItems(remainingItems);
      updateDoc(currentCollectionRef, { items: remainingItems });
    }
  };

  // apply colours
  const addBgColor = (
    estimatedPurchaseInterval,
    lastPurchase,
    nextPurchase,
    totalPurchases,
  ) => {
    const ratio =
      (Date.now() - lastPurchase) /
      (estimatedPurchaseInterval * DayInMilliSeconds);
    if (totalPurchases === 1 || (ratio > 2 && estimatedPurchaseInterval)) {
      return 'red-bg';
    } else {
      if (nextPurchase === 7) {
        return 'green-bg';
      } else if (nextPurchase === 14) {
        return 'yellow-bg';
      } else if (nextPurchase === 30) {
        return 'purple-bg';
      }
    }
  };

  const addAriaLabel = (nextPurchase, itemName) => {
    if (itemName && nextPurchase === 7) {
      return `Buy ${itemName} every ${nextPurchase} days`;
    } else if (itemName && nextPurchase === 14) {
      return `Buy ${itemName} every ${nextPurchase} days`;
    } else if (itemName && nextPurchase === 30) {
      return `Buy ${itemName} every ${nextPurchase} days`;
    }
  };

  // sort items
  sortItems({ items: items, ratio: DayInMilliSeconds });

  return (
    <div>
      <div id="main-container" className="flex-wrapper">
        <div id="sub-wrapper">
          <h1>Shopping List</h1>
          {loading && <p>Loading ... </p>}
          {error && <p>An error occured</p>}
          {emptyList && <p>You don't have any list yet</p>}

          <div className="filter">
            <label htmlFor="search" className="search-label">
              Filter items:
            </label>
            <br />
            <input
              type="search"
              id="search"
              placeholder="start typing here..."
              name="searchlist"
              className="search"
              onChange={(e) => setSearchList(e.target.value)}
            />
          </div>

          {searchListHandler({ value: searchlist, items }).length > 0 &&
            searchListHandler({ value: searchlist, items }).map((item) => {
              return (
                <div
                  key={item.itemName}
                  className={`${addBgColor(
                    item.estimatedPurchaseInterval,
                    item.lastPurchase,
                    item.nextPurchase,
                    item.totalPurchases,
                  )} item-wrapper`}
                >
                  <div className="left-list-pane checkbox">
                    <label htmlFor={item.itemName}>
                      <span
                        className="hide-span"
                        aria-label={addAriaLabel(
                          item.nextPurchase,
                          item.itemName,
                        )}
                      >
                        {item.itemName}
                      </span>
                    </label>
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
                  <div key={item.itemName} className="item-wrapper">
                    {
                      <div className="right-list-pane">
                        <div className="item-name-wrapper">
                          <input
                            type="checkbox"
                            id={item.itemName}
                            disabled={handlePurchaseInLastDay(
                              item.lastPurchase,
                            )}
                            checked={handlePurchaseInLastDay(item.lastPurchase)}
                            onChange={() => handleOnChange(item.itemName)}
                          />
                          {/* <p className="item-name">
                            estimatedPurchaseInterval:{' '}
                            {item.estimatedPurchaseInterval} nextPurchase:{' '}
                            {item.nextPurchase} totalPurchases:{' '}
                            {item.totalPurchases}
                          </p> */}
                        </div>
                        <button
                          className="delete-list"
                          onClick={() => handleDeleteList(item.itemName)}
                        >
                          Delete
                        </button>
                      </div>
                    }
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
