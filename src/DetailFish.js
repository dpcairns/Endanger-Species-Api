import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUnoFish } from './services/fetch-utils';

import React from 'react';

export default function DetailFish() {
  const params = useParams();
  const [fish, setfish] = useState({});
    
  useEffect(() => {
    async function fetchSingleFish(name) {
      const data = await fetchUnoFish(name);
      setfish(data);
    }
    fetchSingleFish(params['Species Name']);
  }, []); 
  return (
    <div>
      <h1>{fish['Species Name']}</h1>
      <img/>
    </div>
  );
}

