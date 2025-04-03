import { useState } from 'react';
import { useMemo } from 'react';
import './GalleryPanel.css'
import { LuExpand } from "react-icons/lu";
import { IoCopy } from "react-icons/io5";

async function copyToClipboard(spec, setCopyNotification) {
  try {
    await navigator.clipboard.writeText(spec);
    // Show notification
    setCopyNotification(true);
    // Hide notification after 2 seconds
    setTimeout(() => setCopyNotification(false), 1500);
  } catch (e) {
    throw new Error('Failure to copy a Gosling specification to the clipboard');
  }
}

export default function GalleryPanel(props) {
  /* eslint-disable react/prop-types */
  const { data } = props;
  const [selected, setSelected] = useState();
  const [copyNotification, setCopyNotification] = useState(false);

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
              <h3>
                Specification
                <div style={{ display: 'inline-block', position: 'relative' }}>
                <IoCopy
                  style={{ marginLeft: '0.5rem', color: '#4a4644', cursor: 'pointer' }}
                  onClick={() => copyToClipboard(JSON.stringify(JSON.parse(selected.spec), null, 2), setCopyNotification)}
                  />
                  {copyNotification && (
                      <div className="copy-notification">
                        Copied to clipboard!
                      </div>
                  )}
                </div>
              </h3>
              <div className='gallery-item-spec'>
                <textarea defaultValue={JSON.stringify(JSON.parse(selected.spec), null, 2)}
                 readOnly/>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }, [selected, copyNotification]);

  return (
    <div className='gallery-panel'>
      {modalDetailView}
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
               <textarea
                   defaultValue={JSON.stringify(JSON.parse(d.spec), null, 2)}
                   readOnly
               />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
