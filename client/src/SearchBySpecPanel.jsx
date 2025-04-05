import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import './SearchBySpecPanel.css';

export default function SearchBySpecPanel(props) {
  const { onUpdate } = props;
  const [inputFile, setInputFile] = useState();
  const [inputSpec, setInputSpec] = useState('');

  useEffect(() => {
    if (inputFile) {
      const reader = new FileReader();
      reader.onload = e => { setInputSpec(e.target.result) }
      reader.readAsText(inputFile);
    }}, [onUpdate, inputFile]);

  useEffect(() => {
    onUpdate(inputSpec);
  }, [onUpdate, inputSpec]);

  const specPreview = useMemo(() => {
    return (
        <Editor
            height="500px"
            language="json"
            value={inputSpec}
            onChange={(value) => setInputSpec(value)}
            theme="light"
            options={{
              minimap: { enabled: true },
              tabSize: 2,
              insertSpaces: true,          // Uses spaces for indentation.
              detectIndentation: false,
              fontSize: 14,
            }}
        />
    );
  }, [inputSpec]);

  return (
      <div className='search-by-spec-panel'>
        <input
            type="file"
            accept="application/JSON"
            className='image-upload-button'
            onChange={(e) => {
              setInputFile(e.currentTarget.files[0]);
            }}
        />
        {inputFile ? <h3>Preview</h3> : null}<br/><br/>
        <div className='editor-wrapper'>
          {specPreview}
        </div>
      </div>
  );
}
