import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { LuExpand } from "react-icons/lu";
import './DatabaseGallery.css';
import ExampleDetailView from './ExampleDetailView';
import { prettierName } from './utils';


export default function DatabaseGallery(props) {
  const { databaseGallery } = props;
  const [showDataBase, setShowDatabase] = useState();
  const [selected, setSelected] = useState();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowDatabase(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const dataBase = useMemo(() => {
    if (showDataBase) {
      return(
        <div id='database' className='database-panel-dark-background' onClick={(e) => e.target.id === 'database' ? setShowDatabase(false) : null}>
          <div className='database-panel'>
            <div className='database-panel-content'>
              <h2>Gallery Overview: Selected Examples</h2>
              <div className='database-grid'>
                {databaseGallery.length > 0 ?
                (databaseGallery.map(d => {
                  const title = prettierName(d.name);
                  return (
                    <div className='database-item' key={d.name} onClick={() => setSelected(d)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(d)} tabIndex={0}>
                      <div className='database-item-title'>{title}
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
  }, [showDataBase])

  return (
    <div>
      <div className="gallery-button">
        <button onClick={() => setShowDatabase(true)}>Gallery</button>
      </div>
      {dataBase}
      <ExampleDetailView selected={selected} setSelected={setSelected}/>
    </div>
  )
}
