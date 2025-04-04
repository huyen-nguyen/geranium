import { useState } from 'react';
import { useMemo } from 'react';
import './GalleryPanel.css'
import { LuExpand } from "react-icons/lu";
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

async function copyToClipboard(spec, setCopyNotification) {
  try {
    await navigator.clipboard.writeText(spec);
    // Show notification
    setCopyNotification(true);
    // Hide notification after 1.5 seconds
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
  const [itemCopyId, setItemCopyId] = useState(null);

  const modalDetailView = useMemo(() => {
    if (selected) {
      return (
          <div
              id='selected-example-modal'
              className='selected-example-panel-dark-background'
              onClick={(e) => e.target.id === 'selected-example-modal' ? setSelected(undefined) : null}
          >
            <div className='selected-example-panel'>
              <div className='selected-example-content'>
                <h2>Selected Example (<code>{selected.name}</code>)</h2>

                {/* Visualization section - allow natural height */}
                <div className="gosling-visualization-section">
                  <h3>Visualization</h3>
                  <div className="gosling-visualization-wrapper">
                    <GoslingViz spec={selected.spec} />
                  </div>
                </div>

                {/* Description section */}
                <h3>Text Description</h3>
                <div className='gallery-item-text'>
                  {selected.text}
                </div>

                {/* Specification section */}
                <h3>Specification</h3>
                <div className='gallery-item-spec'>
                  <div className="textarea-with-copy">
                <textarea
                  defaultValue={JSON.stringify(JSON.parse(selected.spec), null, 2)}
                  readOnly
                />
                    <button
                        className="textarea-copy-btn"
                        onClick={() => copyToClipboard(JSON.stringify(JSON.parse(selected.spec), null, 2), setCopyNotification)}
                    >
                      <IoCopy />
                    </button>
                    {copyNotification && (
                        <div className="textarea-copy-notification">
                          Copied to clipboard!
                        </div>
                    )}
                  </div>
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
                  <img className='gallery-item-thumbnail' src={`data:image/png;base64,${d.image}`}  onClick={() => setSelected(d)}/>
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
      </div>
  );
}