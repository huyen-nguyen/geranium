import { useState } from 'react';
import { useMemo } from 'react';
import axios from "axios"
import './DatabaseGallery.css'

export default function DatabaseGallery() {

  const [showDataBase, setShowDatabase] = useState();
  const [indexData, setIndexData] = useState([]);

  const onIndexData = async (type, Text, Image, Spec) => {
    const results = await axios.get('http://127.0.0.1:5000/api/get_db');
    console.warn('New query results', results);
    setIndexData(results.data.data);
  };

  const dataBase = useMemo(() => {
    if (showDataBase) {
      return(
        <div id='database' className='database-panel-dark-background' onClick={(e) => e.target.id === 'database' ? setShowDatabase(false) : null}>
          <div className='database-panel'>
            hello
          </div>
        </div>
      )
    }
  }, [showDataBase, indexData])

  return (
    <div>
      <button onClick={() => {
        if (indexData.length === 0) {
          onIndexData();
        }
        setShowDatabase(true);
        }}>Gallery</button>
      {dataBase}
    </div>
  )
}
