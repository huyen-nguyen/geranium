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

  // Debounce and auto-format JSON upon typing.
  useEffect(() => {
    // Set a timer to format after the user stops typing.
    const timer = setTimeout(() => {
      try {
        // Try to parse and format the JSON.
        const formatted = JSON.stringify(JSON.parse(inputSpec), null, 2);
        // Only update if formatting changes the string.
        if (formatted !== inputSpec) {
          setInputSpec(formatted);
        }
      } catch (error) {
        // If JSON is invalid, skip formatting.
      }
    }, 800); // Adjust delay (in ms) as needed.

    // Clear the timer if inputSpec changes before the delay finishes.
    return () => clearTimeout(timer);
  }, [inputSpec]);

  // Memoize the Monaco Editor component.
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
              wordWrap: "on",
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
