import { useState } from 'react';
import { useMemo } from 'react';
import axios from 'axios'
import { LuExpand } from "react-icons/lu";
import './DatabaseGallery.css'
import ExampleDetailView from './ExampleDetailView';
import { prettierName } from './utils';


export default function DatabaseGallery() {

  const [showDataBase, setShowDatabase] = useState();
  const [indexData, setIndexData] = useState([]);
  const [selected, setSelected] = useState();

  const onIndexData = async () => {
    const results = await axios.get('http://127.0.0.1:5000/api/get_db');
    console.warn('Database Gallery', results);
    setIndexData(results.data.data);
  };

  const dataBase = useMemo(() => {
    if (showDataBase) {
      return(
        <div id='database' className='database-panel-dark-background' onClick={(e) => e.target.id === 'database' ? setShowDatabase(false) : null}>
          <div className='database-panel'>
            <div className='database-panel-content'>
              <h2>Gallery Overview: Selected Examples</h2>
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
      <ExampleDetailView selected={selected} setSelected={setSelected}/>
    </div>
  )
}
