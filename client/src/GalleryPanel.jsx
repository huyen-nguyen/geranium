import { useState } from 'react';
import { useMemo } from 'react';
import './GalleryPanel.css'
import ExampleDetailView from './ExampleDetailView';
import { LuExpand } from "react-icons/lu";
import { AiTwotoneCloseCircle } from "react-icons/ai";

export default function GalleryPanel(props) {
  /* eslint-disable react/prop-types */
  const { data } = props;
  const [selected, setSelected] = useState();

  return (
    <div className='gallery-panel'>
      <ExampleDetailView selected={selected} setSelected={setSelected}/>
      <h2 style={{ marginTop: 0 }}>Search Results</h2>
      {data.map(d => {
        const title = d.name.split('_')[0].replaceAll('-', ' ').titleCase();
        return (
          <div className='gallery-item' key={d.name}>
            <div className='gallery-item-title' onClick={() => setSelected(d)}>{`Example Name: ${d.name}`}
              <LuExpand style={{
                color: '#4a4644',
                verticalAlign: 'middle',
                marginLeft: '1rem'
              }} />
            </div>
            <div className='gallery-image-text-group'>
              <img className='gallery-item-thumbnail' src={`data:image/png;base64,${d.image}`} />
              <div className='gallery-item-text'>
                {d.text}
              </div>
              <div className='gallery-item-spec'>
                <textarea>{JSON.stringify(JSON.parse(d.spec), null, 2)}</textarea>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
