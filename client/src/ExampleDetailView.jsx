import { useMemo, useEffect } from 'react';
import './GalleryPanel.css'

export default function ExampleDetailView(props) {
  const { selected, setSelected } = props;

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
              <textarea>{JSON.stringify(JSON.parse(selected.spec), null, 2)}</textarea>
            </div>
          </div>
        </div>
      </div>
    );
  }, [selected]);
}