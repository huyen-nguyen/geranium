import { useMemo, useState, useEffect } from 'react'
import Header from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'
import GalleryPanel from './GalleryPanel.jsx'
import axios from "axios"
import './utils.js'
import { prettierName } from './utils.js'
import { LuExpand } from "react-icons/lu";

function App() {

  const [topK, setTopK] = useState([]);
  const [databaseGallery, setDatabaseGallery] = useState([]);

  const onSearch = async (type, Text, Image, Spec) => {
    const results = await axios.post('http://127.0.0.1:5000/api/get_inference', {
      k: 10,
      type,
      content: { Text, Image, Spec }[type]
    });
    console.warn('New query results', results);
    setTopK(results.data.data);
  };

  // fetch gallery database once
  useEffect(() => {
    getDatabaseGallery()
  }, [])

  const getDatabaseGallery = async () => {
    const results = await axios.get('http://127.0.0.1:5000/api/get_db');
    console.warn('Database Gallery', results);
    setDatabaseGallery(results.data.data);
  };

  const topKGallery = useMemo(() => {
    return (
      <GalleryPanel data={topK} databaseGallery={databaseGallery} />
    );
  }, [topK, databaseGallery]);

  return (
    <>
      <Header databaseGallery={databaseGallery} />
      <div className='content'>
        <SearchPanel onSearch={onSearch} />
        {topKGallery}
      </div>
    </>
  )
}

export default App
