import { useMemo, useState } from 'react'
import Header from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'
import GalleryPanel from './GalleryPanel.jsx'
import axios from "axios"
import './utils.js'

function App() {

  const [topK, setTopK] = useState([]);

  const onSearch = async (type, Text, Image, Spec) => {
    const results = await axios.post('http://127.0.0.1:5000/api/get_inference', {
      k: 10,
      type,
      content: { Text, Image, Spec }[type]
    });
    console.warn('New query results', results);
    setTopK(results.data.data);
  };

  const topKGallery = useMemo(() => {
    return (
      <GalleryPanel data={topK} />
    );
  }, [topK]);

  return (
    <>
      <Header />
      <div className='content'>
        <SearchPanel onSearch={onSearch} />
        {topKGallery}
      </div>
    </>
  )
}

export default App
