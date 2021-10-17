import React from 'react';
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';

const Home = () => {
  // const existingToken = localStorage.getItem('currentToken');
  const [token, setToken] = useState(() => {
    const existingToken = localStorage.getItem('currToken');
    return existingToken ? existingToken : '';
  });

  const history = useHistory();

  if (token) {
    history.push('/list');
  }

  const handleClick = function () {
    if (!token) {
      localStorage.setItem('currToken', getToken());
    }
    history.push('/list');
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
        <form action="">
          <div>
            <label htmlFor="token">Share token</label>
            <br />
            <input type="text" id="token" />
          </div>
        </form>
        <button>Join an existing list</button>
      </section>
    </header>
  );
};

export default Home;
