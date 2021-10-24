import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';
import { db } from '../lib/firebase.js';
import { collection, getDocs } from '@firebase/firestore';
import Error from './Error';

const Home = () => {
  const [joinlist, setJoinList] = useState('');
  const [noSharedToken, setNoSharedToken] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(true);
  const [token, setToken] = useState(() => {
    const existingToken = localStorage.getItem('currToken');
    return existingToken ? existingToken : '';
  });

  const history = useHistory();
  const itemsCollectionRef = collection(db, 'shopping-list');

  if (token) {
    history.push('/list');
  }

  const fetchTokens = async () => {
    const refData = await getDocs(itemsCollectionRef);
    let tokenList = refData.docs.map(({ id }) => id);

    if (!tokenList.includes(joinlist)) {
      setNoSharedToken(true);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } else {
      history.push('/list');
    }
  };

  const handleClick = function () {
    if (!token) {
      localStorage.setItem('currToken', getToken());
    }
    history.push('/list');
  };

  const handleChange = (e) => {
    const { value } = e.currentTarget;
    setJoinList(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (joinlist) {
      localStorage.setItem('currToken', joinlist);
    }
    fetchTokens();
  };

  return (
    <header className="home-header">
      <section className="welcome">
        <h1>Welcome to your Smart Shopping list!</h1>
      </section>
      <section className="create">
        <button onClick={() => handleClick()}>Create a new list</button>
        <p>- or -</p>
      </section>
      <section className="join">
        <p>Join an existing shopping list by entering a three word token.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="token">Share token</label>
            <br />
            <input
              placeholder="three word token"
              type="text"
              name="joinlist"
              value={joinlist}
              onChange={handleChange}
            />
          </div>
          {noSharedToken && showErrorMessage && (
            <Error errorMessage="Token does not exist, enter a valid token" />
          )}
          <button>Join an existing list</button>
        </form>
      </section>
    </header>
  );
};

export default Home;
