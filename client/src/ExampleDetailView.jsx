import { useMemo, useRef, useState, useEffect } from 'react';
import './GalleryPanel.css';
import { IoCopy } from "react-icons/io5";
import { GoslingComponent } from "gosling.js";
import { ErrorBoundary } from 'react-error-boundary';
import Editor from "@monaco-editor/react";

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
        setCopyNotification(true);
        setTimeout(() => setCopyNotification(false), 1500);
    } catch (e) {
        throw new Error('Failure to copy a Gosling specification to the clipboard');
    }
}

// ResizablePanels
function ResizablePanels({ leftPanel, rightPanel }) {
    const containerRef = useRef(null);
    const [leftWidth, setLeftWidth] = useState(50); // initial percentage
    const isResizing = useRef(false);

    const onMouseDown = () => {
        isResizing.current = true;
    };

    const onMouseMove = (e) => {
        if (!isResizing.current) return;
        if (containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            let newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            // Clamp values between 10% and 90%
            newWidth = Math.max(10, Math.min(90, newWidth));
            setLeftWidth(newWidth);
        }
    };

    const onMouseUp = () => {
        isResizing.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return (
        <div className="spec-vis-container" ref={containerRef}>
            <div className="spec-panel" style={{ width: `${leftWidth}%` }}>
                {leftPanel}
            </div>
            <div className="divider" onMouseDown={onMouseDown} />
            <div className="viz-panel" style={{ width: `${100 - leftWidth}%` }}>
                {rightPanel}
            </div>
        </div>
    );
}

export default function ExampleDetailView(props) {
    const { selected, setSelected, copyNotification, setCopyNotification } = props;

    // State for the editable specification text
    const [editorSpec, setEditorSpec] = useState(selected ? selected.spec : '');

    // When a new example is selected, update the editor's spec
    useEffect(() => {
        if (selected) {
            setEditorSpec(selected.spec);

            // Debounce for auto-format JSON upon typing.
            const timer = setTimeout(() => {
                try {
                    const formatted = JSON.stringify(JSON.parse(selected.spec), null, 2);
                    if (formatted !== selected.spec) {
                        setEditorSpec(formatted);
                    }
                } catch (error) {
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [selected]);

    // Always call useMemo and do conditional rendering inside it
    return useMemo(() => {
        if (!selected) return null; // Conditional rendering inside useMemo

        return (
            <div id="selected-example-modal" className="selected-example-panel-dark-background">
                <div className="selected-example-panel">
                    <button
                        className="modal-close-button"
                        onClick={() => setSelected(undefined)}
                    >
                        ✕
                    </button>
                    <div className="selected-example-content">
                        <h2>
                            Selected Example: <code>{selected.name}</code>
                        </h2>
                        <ResizablePanels
                            leftPanel={
                                <>
                                    <div className="spec-header">
                                        {copyNotification && (
                                            <div className="textarea-copy-notification">
                                                Copied to clipboard!
                                            </div>
                                        )}
                                        <div>
                                            <button
                                                className="textarea-copy-btn"
                                                onClick={() => {
                                                    copyToClipboard(editorSpec, setCopyNotification);
                                                }}
                                            >
                                                <IoCopy />
                                            </button>
                                        </div>
                                        <h3>Specification</h3>
                                    </div>

                                    <div className="textarea-with-copy">
                                        <Editor
                                            height="100%"
                                            language="json"
                                            value={editorSpec}
                                            theme="light"
                                            onChange={(value) => setEditorSpec(value)}
                                            options={{
                                                minimap: { enabled: true },
                                                tabSize: 2,
                                                insertSpaces: true,
                                                detectIndentation: false,
                                                fontSize: 13,
                                                wordWrap: "on"
                                            }}
                                        />
                                    </div>

                                </>
                            }

                            rightPanel={
                                <>
                                    <h3>Visualization</h3>
                                    <div className="gosling-visualization-wrapper">
                                        <GoslingViz spec={editorSpec}
                                        />
                                    </div>
                                </>
                            }
                        />
                        <div className="textual-description-section">
                            <h3>Text Description</h3>
                            <div className="gallery-item-text">{selected.text}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }, [selected, copyNotification, editorSpec, setSelected, setCopyNotification]);
}

