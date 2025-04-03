import { useState } from 'react';
import { useMemo } from 'react';
import axios from 'axios'
import { LuExpand } from "react-icons/lu";
import './DatabaseGallery.css'
import { prettierName } from './utils';

export default function DatabaseGallery() {

  const [showDataBase, setShowDatabase] = useState();
  const [indexData, setIndexData] = useState([]);
  const [selected, setSelected] = useState();

  const onIndexData = async (type, Text, Image, Spec) => {
    const results = await axios.get('http://127.0.0.1:5000/api/get_db');
    console.warn('New query results', results);
    setIndexData(results.data.data);
  };

  // TODO: import this from gallerypanel
  const modalDetailView = useMemo(() => {
    if (selected) {
      return (
        <div id='selected-example-modal' className='selected-example-panel-dark-background' onClick={(e) => e.target.id === 'selected-example-modal' ? setSelected(undefined) : null}>
          <div className='selected-example-panel'>
            <div className='selected-example-content'>
              <h2>Selected Example (<code>{selected.name}</code>)</h2>
              <h3>Image</h3>
              <img className='gallery-item-thumbnail' src={`data:image/png;base64,${selected.image}`} />
              <h3>Textual Description</h3>
              <div className='gallery-item-text'>
                {selected.text}
              </div>
              <h3>Specification</h3>
              <div className='gallery-item-spec'>
                <textarea>{JSON.stringify(JSON.parse(selected.spec), null, 2)}</textarea>
              </div>

            </div>
          </div>
        </div>
      );
    }
  }, [selected]);

  const dataBase = useMemo(() => {
    if (showDataBase) {
      return(
        <div id='database' className='database-panel-dark-background' onClick={(e) => e.target.id === 'database' ? setShowDatabase(false) : null}>
          <div className='database-panel'>
            <h2>Gallery</h2>
            <div className='database-grid'>
              {indexData.length > 0 ?
              (indexData.map(d => {
                const title = prettierName(d.name);
                return (
                  <div className='database-item' key={d.name}>
                    <div className='database-item-title' onClick={() => setSelected(d)}>{title}
                      <LuExpand style={{
                        color: '#4a4644',
                        verticalAlign: 'middle',
                        marginLeft: '1rem'
                      }} />
                    </div>
                    <img className='database-item-thumbnail' src={`data:image/png;base64,${d.image}`} />
                  </div>
                )
              })) : <p>There are no examples to show.</p>}
            </div>
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
      {modalDetailView}
    </div>
  )
}
