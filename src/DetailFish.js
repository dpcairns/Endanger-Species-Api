import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchUnoFish, addToFishList, removeFromFishList, getFishList, getUser } from './services/fetch-utils';
import MyTable from './MyTable';
import Spinner from './Spinner';
import Accordion from './Accordion';
import SimplePopover from './Popover';

import { addEaten } from './services/fetch-utils';
//how do we check that this fish is on the users favorites?

import React from 'react';

export default function DetailFish() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [check, setCheck] = useState([]);
  const [user, setUser] = useState({});
  const [fish, setfish] = useState({
    'Species Illustration Photo': {}
  });
  
  
  function refreshPage() {
    window.location.reload(false);
  }

  /* i'd like to see this handled in another way. it seems to me you just want to fetch the fish again whenever the favorites are updated? you could achieve that by putting the favorites in the dependency array on line 65. forcing a reload to force a behavior is an anti-pattern in react that can usually be solved by adding something to the dependency array
  */
  function handleAddToFavs() {
    addToFishList(fish);
    setTimeout(() => {
      refreshPage();
    }, '250');
  }

  function handleRemove() {
    removeFromFishList(fish);
    setTimeout(() => {
      refreshPage();
    }, '250');
  }

  useEffect(() => {
    async function checkIt() {
      const data = await getFishList(user.id);
      setCheck(data);
    }
    if (user.id) checkIt();
  }, [user]);
  

  useEffect(() => {
    async function fetchUser() {
      const data = await getUser();
      setUser(data);
    }
    fetchUser();
    async function fetchSingleFish(name) {
      setLoading(true);
      const data = await fetchUnoFish(name);
      setfish(data[0]);
      setLoading(false);
    }
    fetchSingleFish(params.name);
  }, [params.name]);//eslint-disable-line
  

  async function handleAddEaten() {
    await addEaten(fish);

  }

  const itExists = check && check.find(item => item['Scientific Name'] === fish['Scientific Name']);

  return loading ? <Spinner /> : 
    <div className='detailFish'>
      {itExists 
        ? <div className='buttonz'>
            <button className='button' onClick={handleRemove}>
              Remove
            </button>
            <SimplePopover handleAdd={handleAddEaten}/>
          </div> 
        : <button className='button'onClick={handleAddToFavs}>
            Add to your favorites/watchlist
          </button>
      }
      <h1 className='header-1'>{fish['Species Name']}</h1>
      <h2 className='header-2'>{fish['Scientific Name']}</h2>
      <img className="fish-pic" src={fish['Species Illustration Photo'].src}/>
      <Accordion fish={fish}/>
      
      <div className='table-div'>
        <MyTable className='table'
          servingWeight={fish['Serving Weight']}
          totalFats={fish['Fat, Total']}
          protein={fish.Protein}
          cholesterol={fish.Cholesterol}
          sodium={fish.Sodium}
          calories={fish.Calories}
          carbohydrate={fish.Carbohydrate}
          fiber={fish['Fiber,Total Dietary']}
          sugar={fish['sugars.Total']} // is this really the key name? not fish.sugars.Total? If so, i believe you--the shape of the data that the API responds with seems reeeeally weird
        
        />
      </div>
      <footer></footer>
    </div>;
}

