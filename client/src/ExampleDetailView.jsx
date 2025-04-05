import { useMemo, useEffect } from 'react';
import './GalleryPanel.css'
import { IoCopy } from "react-icons/io5";
import { GoslingComponent } from "gosling.js";
import { ErrorBoundary } from 'react-error-boundary';
import Editor from "@monaco-editor/react";
import {LuExpand} from "react-icons/lu";

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
            <div className="gosling-visualization-section">
              <h3>Visualization</h3>
              <div className="gosling-visualization-wrapper">
                <GoslingViz spec={selected.spec} />
              </div>
            </div>
            <h3>Textual Description</h3>
            <div className='gallery-item-text'>
              {selected.text}
            </div>
            <h3>Specification</h3>
            <div className='gallery-item-spec'>
              <div className="textarea-with-copy">
                <Editor
                    height="500px"
                    language="json"
                    value={JSON.stringify(JSON.parse(selected.spec), null, 2)}
                    theme="light"
                    options={{
                      minimap: { enabled: true },
                      tabSize: 2,
                      insertSpaces: true,
                      detectIndentation: false,
                      fontSize: 13,
                      wordWrap: "on",
                      readOnly: true
                    }}
                />
                {/*<textarea*/}
                {/*    defaultValue={JSON.stringify(JSON.parse(selected.spec), null, 2)}*/}
                {/*    readOnly*/}
                {/*/>*/}
              </div>
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
    );
  }, [selected, copyNotification]);
}