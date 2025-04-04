import { useState } from 'react';
import './GalleryPanel.css'
import ExampleDetailView from './ExampleDetailView';
import { LuExpand } from "react-icons/lu";
import { prettierName } from './utils.js'
import { IoCopy } from "react-icons/io5";
import React from 'react';
import { GoslingComponent } from "gosling.js";
import { ErrorBoundary } from 'react-error-boundary';

function GoslingViz({ spec, className = '' }) {
  if (!spec) return null;

  const parsedSpec = useMemo(() => {
    try {
      return typeof spec === 'string' ? JSON.parse(spec) : spec;
    } catch (e) {
      console.error('Failed to parse Gosling spec:', e);
      return null;
    }
  }, [spec]);

  if (!parsedSpec) return <div>Invalid specification format</div>;

  return (
      <ErrorBoundary fallback={<div>Failed to render visualization</div>}>
        <div className={`gosling-viz-container ${className}`}>
          <GoslingComponent
              spec={parsedSpec}
              experimental={{ reactive: true }}
          />
        </div>
      </ErrorBoundary>
  );
}


export default function GalleryPanel(props) {
  /* eslint-disable react/prop-types */
  const { data, databaseGallery } = props;
  const [selected, setSelected] = useState();
  const [copyNotification, setCopyNotification] = useState(false);
  const [itemCopyId, setItemCopyId] = useState(null);

  return (
    <div className='gallery-panel'>
      <ExampleDetailView selected={selected} setSelected={setSelected} copyNotification={copyNotification} setCopyNotification={setCopyNotification} />
      {data.length > 0 ? 
      <>
        <h2 style={{ marginTop: 0 }}>Search Results</h2>
        {data.map((d, index) => {
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
                    <div className="textarea-with-copy">
                  <textarea
                      defaultValue={JSON.stringify(JSON.parse(d.spec), null, 2)}
                      readOnly
                  />
                    <button
                      className="textarea-copy-btn"
                      onClick={() => {
                        const specJson = JSON.stringify(JSON.parse(d.spec), null, 2);
                        navigator.clipboard.writeText(specJson);
                        setItemCopyId(index);
                        setTimeout(() => setItemCopyId(null), 1500);
                      }}
                    >
                      <IoCopy />
                    </button>
                    {itemCopyId === index && (
                      <div className="textarea-copy-notification">
                        Copied to clipboard!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })} 
      </> : 
      <>
        <h2 style={{ marginTop: 0 }}>Gallery Overview: Selected Examples</h2>
        <div className='landing-page-database'>
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
      </>
    }
    </div>
  );
}