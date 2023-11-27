import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase.js';
import { calculateEstimate } from '@the-collab-lab/shopping-list-utils';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Footer from './Footer';
import { useHistory } from 'react-router-dom';
import { searchListHandler } from './customFilter.js';
import { SortItems } from './Sort.js';
import { addAriaLabelHelper, addBgColourHelper } from './Colours.js';
import NavBar from './NavBar';
import { Container, Button, Row, Spinner, Alert } from 'react-bootstrap';

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
  const [show, setShow] = useState(true);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      `Are you sure you want to delete "${itemName}" from the list?`,
    );
    if (confirm) {
      const remainingItems = items.filter((item) => {
        return item.itemName !== itemName;
      });
      setItems(remainingItems);
      updateDoc(currentCollectionRef, { items: remainingItems });
    }
  };

  // Apply colours and aria labels
  const addAriaLabel = (interval, last, next, total, name) => {
    return addAriaLabelHelper({ interval, last, next, total, name });
  };

  const addBgColor = (interval, last, next, total) => {
    return addBgColourHelper({ interval, last, next, total });
  };

  // Sort items
  SortItems({ items });

  return (
    <main className="list-container">
      <NavBar title="Smart Shopping List" />
      <Container className="my-4 py-4 list-container">
        <Row className="justify-content-md-center">
          {loading && (
            <Spinner
              animation="border"
              role="status"
              variant="success"
            ></Spinner>
          )}
          {error && <p>An error occured</p>}
          {emptyList && (
            <div>
              {show ? (
                <Alert
                  variant="danger"
                  onClose={() => setShow(false)}
                  dismissible
                >
                  <Alert.Heading className="text-center">
                    Oh snap! You don't have any list yet!
                  </Alert.Heading>
                </Alert>
              ) : (
                ''
              )}
            </div>
          )}
          <div className="d-flex justify-content-center my-4 py-4">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text" id="basic-addon1">
                  <i class="bi bi-filter"></i>
                </span>
              </div>
              <input
                type="search"
                id="search"
                name="searchlist"
                className="search"
                onChange={(e) => setSearchList(e.target.value)}
                class="form-control"
                placeholder="Filter List"
                aria-label="Search item"
                aria-describedby="basic-addon1"
              />
            </div>
          </div>

          {searchListHandler({ value: searchlist, items }).length > 0 &&
            searchListHandler({ value: searchlist, items }).map((item) => {
              return (
                <div className="mx-auto w-75 my-3">
                  <div
                    key={item.itemName}
                    className={`${addBgColor(
                      item.estimatedPurchaseInterval,
                      item.lastPurchase,
                      item.nextPurchase,
                      item.totalPurchases,
                    )} item-wrapper`}
                  >
                    {
                      <div className="d-flex justify-content-between p-3">
                        <div className="d-flex">
                          <input
                            className="check"
                            type="checkbox"
                            id={item.itemName}
                            disabled={handlePurchaseInLastDay(
                              item.lastPurchase,
                            )}
                            checked={handlePurchaseInLastDay(item.lastPurchase)}
                            onChange={() => handleOnChange(item.itemName)}
                          />
                          <label htmlFor={item.itemName}>
                            <span
                              aria-label={addAriaLabel(
                                item.estimatedPurchaseInterval,
                                item.lastPurchase,
                                item.nextPurchase,
                                item.totalPurchases,
                                item.itemName,
                              )}
                            >
                              <p className="item-name text-capitalize">
                                {item.itemName}
                              </p>
                            </span>
                          </label>
                        </div>
                        <Button
                          variant="danger"
                          className="delete-list"
                          onClick={() => handleDeleteList(item.itemName)}
                        >
                          <i className="bi bi-trash pe-2"></i>
                          Delete
                        </Button>
                      </div>
                    }
                  </div>
                </div>
              );
            })}
        </Row>
        <div className="d-flex justify-content-center">
          {emptyList && (
            <Button variant="success" onClick={addItemBtn}>
              Add Item
            </Button>
          )}
        </div>
      </Container>
      <Footer />
    </main>
  );
};

export default ListItem;
