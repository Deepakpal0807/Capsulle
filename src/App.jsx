import React, { useState } from 'react';
import './App.css';
import Allsalt from './Component/Allsalt';

function App() {
  const [name, setName] = useState('');
  const [data, setData] = useState([]);

  const handleChange = (event) => {
    setName(event.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      fetchData();
    }
  }

  const fetchData = async () => {
    try {
      let url = `https://backend.cappsule.co.in/api/v1/new_search?q=${name}&pharmacyIds=1,2,3`;
      let response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      let parsedData = await response.json();
      let saltSuggestions = parsedData.data.saltSuggestions;
      setData(saltSuggestions); // Update state with saltSuggestions
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  

  return (
    <>
      <div className='m-auto w-[50vw] mt-[8vh]'>
        <h3 className='font-semibold text-xl text-center'>Capsulle Web Development Project</h3>
      </div>

      <div className="flex w-[50vw] rounded-md shadow-sm m-auto mt-[10vh] shadow-xl border border-black-100 mb-[5vh]">
        <input
          type="text"
          placeholder="Type your name here"
          value={name}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="px-3 py-2 text-gray-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent w-[50vw] rounded-lg"
        />
        <button
          type="button"
          onClick={fetchData}
          className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-md"
        >
          Search
        </button>
      </div>

      {/* Display the fetched data */}
      {data.length !== 0 ? (
        <Allsalt data={data} />
      ) : (
        <div className='text-center text-2xl font-semibold mt-[30vh]'>"Find medicines with amazing discounts"</div>
      )}
    </>
  );
}

export default App;
