import { useEffect, useMemo, useState } from 'react';
import './SearchBySpecPanel.css';

export default function SearchBySpecPanel(props) {
  /* eslint-disable react/prop-types */
  const { onUpdate } = props;
  const [inputFile, setInputFile] = useState();
  const [inputSpec, setInputSpec] = useState();

  useEffect(() => {
    if (inputFile) {
      const reader = new FileReader();
      reader.onload = e => { setInputSpec(e.target.result) }
      reader.readAsText(inputFile);
    }
  }, [onUpdate, inputFile]);

  useEffect(() => {
    onUpdate(inputSpec);
  }, [onUpdate, inputSpec]);

  const specPreview = useMemo(() => {
    return (
      <textarea className='spec-preview' value={inputSpec ?? ''} onChange={(e) => setInputSpec(e.target.value)} />
    );
  }, [inputSpec]);

  return (
    <div className='search-by-spec-panel'>
      <input type="file" accept="application/JSON" className='image-upload-button' onChange={(e) => { setInputFile(e.currentTarget.files[0]) }} />
      {inputFile ? <h3>Preview</h3> : null}
      {specPreview}
    </div>
  );
}