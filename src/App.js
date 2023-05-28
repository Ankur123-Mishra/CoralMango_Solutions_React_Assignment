import React, { useState, useEffect } from 'react';
import './App.css';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (username === 'demo@coralmango.com' && password === 'demo123') {
      onLogin();
    } else {
      setErrorMessage('Invalid Credentials!');
    }
  };

  return (
    <div>
      <h2>Login Page</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button onClick={handleLogin}>Login</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};


const TableComponent = ({ data, filteredData, sortKey, handleSort, searchQuery, setSearchQuery, isFiltered }) => {
  return (
    <div>
      <h2>Table</h2>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {isFiltered && <p>Viewing filtered results</p>}
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Name {sortKey === 'name' && <span>&#9660;</span>}
            </th>
            <th onClick={() => handleSort('age')}>
              Age {sortKey === 'age' && <span>&#9660;</span>}
            </th>
            <th>Occupation</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.age}</td>
              <td>{item.occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CardListComponent = ({ filteredData }) => {
  return (
    <div className="card-list">
      {filteredData.map((item, index) => (
        <div key={index} className="card">
          <h3>{item.name}</h3>
          <p>Age: {item.age}</p>
          <p>Occupation: {item.occupation}</p>
        </div>
      ))}
    </div>
  );
};


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortKey, setSortKey] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://coralmango.com/api/react-test')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const filteredResults = data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredData(filteredResults);
    setIsFiltered(searchQuery !== '');
  }, [data, searchQuery]);

  const handleSort = (key) => {

    const sortedData = [...filteredData].sort((a, b) =>
      a[key].localeCompare(b[key])
    );
    setFilteredData(sortedData);
    setSortKey(key);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleToggleView = () => {
    setViewMode(viewMode === 'table' ? 'card' : 'table');
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <div>
          <nav>
            <ul>
              <li onClick={handleToggleView}>Toggle View</li>
            </ul>
          </nav>
          {viewMode === 'table' ? (
            <TableComponent
              data={data}
              filteredData={filteredData}
              sortKey={sortKey}
              handleSort={handleSort}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isFiltered={isFiltered}
            />
          ) : (
            <CardListComponent filteredData={filteredData} />
          )}
        </div>
      )}
    </div>
  );
};

export default App;
