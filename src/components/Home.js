import React from 'react';
import { useState, useEffect } from 'react';
import { getToken, words } from '@the-collab-lab/shopping-list-utils';

const Home = () => {
  const [token, setToken] = useState(getToken);

  const handleClick = function () {
    setToken(token);
  };

  useEffect(() => {
    localStorage.setItem('currToken', JSON.stringify(token));
  }, [token]);

  return (
    <header className="home-header">
      <h1>Welcome to your Smart Shopping list!</h1>
      <button onClick={() => handleClick()}>Create a new list</button>
      <p>- or -</p>
      <p>Join an existing shopping list by entering a three word token.</p>
      <label htmlFor="token">
        Share token
        <input type="text" id="token"></input>
      </label>
      <button>Join an existing list</button>
    </header>
  );
};

export default Home;
