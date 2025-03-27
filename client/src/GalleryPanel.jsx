import { useState } from 'react';
import './GalleryPanel.css'
import { BsFillInfoCircleFill } from "react-icons/bs";

export default function GalleryPanel(props) {
  /* eslint-disable react/prop-types */
  const { data } = props;

  return (
    <div className='gallery-panel'>
      {data.map(d => {
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
}
