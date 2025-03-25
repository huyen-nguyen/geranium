import { useEffect, useMemo, useState } from 'react'
import Header from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'
import axios from "axios"
import './GalleryPanel.css'
import './utils.js'
import { BsFillInfoCircleFill } from "react-icons/bs";

function App() {

  const [topK, setTopK] = useState([]);

  const onSearch = async (type, text, image, spec) => {
    const results = await axios.post('http://127.0.0.1:5000/api/get_inference', {
      k: 10,
      type,
      content: type === 'Text' ? text : image
    });
    console.warn('New query results', results);
    setTopK(results.data.data);
  };

  const topKGallery = useMemo(() => {
    return (
      <div className='gallery-panel'>
        {topK.map(d => {
          const title = d.name.split('_')[0].replaceAll('-', ' ').titleCase();
          return (
            <div className='gallery-item' key={d.name}>
              <div className='gallery-item-title'>{`Example Name: ${d.name}`}</div>
              <div className='gallery-image-text-group'>
                <img className='gallery-item-thumbnail' src={`data:image/png;base64,${d.image}`} />
                <div className='gallery-item-text'>
                  <BsFillInfoCircleFill style={{
                    color: '#4a4644',
                    marginRight: '6px',
                    verticalAlign: 'middle'
                  }} />

                  {d.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>
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
