import React from 'react';
import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from '@firebase/firestore';

const AddItem = () => {
  const handleClick = (e) => {
    addDoc(collection(db, 'shopping-list'), {
      itemName: 'watermelon',
      buyingTime: 'today',
    });
  };

  return (
    <div>
      <form>
        <label htmlFor="itemName">What to buy: </label>
        <input type="text" placeholder="Your username" id="itemName" required />

        <fieldset>
          <legend>How soon you want to buy your item?</legend>

          <input type="radio" name="timeToBuy" id="soon" />
          <label htmlFor="soon">Soon</label>

          <input type="radio" name="timeToBuy" id="kindOfSoon" />
          <label htmlFor="kindOfSoon">Kind of Soon</label>

          <input type="radio" name="timeToBuy" id="notSoon" />
          <label htmlFor="notSoon">Not Soon</label>
        </fieldset>

        <button onClick={handleClick}>Add Item</button>
      </form>
    </div>
  );
};

export default AddItem;
