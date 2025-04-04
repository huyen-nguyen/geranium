import { useMemo, useEffect } from 'react';
import './GalleryPanel.css'
import { IoCopy } from "react-icons/io5";

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

export default function ExampleDetailView(props) {
  const { selected, setSelected, copyNotification, setCopyNotification } = props;

  if (!selected) return null;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelected(undefined);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
  
  
  return useMemo(() => {
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
              <div className="textarea-with-copy">
                <textarea
                    defaultValue={JSON.stringify(JSON.parse(selected.spec), null, 2)}
                    readOnly
                />
                <button
                  className="textarea-copy-btn"
                  onClick={() => {
                    copyToClipboard(JSON.stringify(JSON.parse(selected.spec), null, 2), setCopyNotification)}}
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
  }, [selected, copyNotification]);
}