// textNode.js — contentEditable editor with inline tags + {{ popup + auto-connect

import { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';
import { FileText } from 'lucide-react';

// Helper for a lightweight SVG string for the inline tag chips
const TagIconSVG = `<svg style="margin-right:4px; margin-bottom:-2px;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 10 4 15 9 20"></polyline><path d="M20 4v7a4 4 0 0 1-4 4H4"></path></svg>`;

// Convert raw text → HTML with inline tag chips
const buildHtml = (text) => {
  if (!text) return '';
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  html = html.replace(
    /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)?)\s*\}\}/g,
    `<span class="text-node-inline-tag" contenteditable="false" data-var="$1">${TagIconSVG}$1</span>`
  );
  html = html.replace(/\n/g, '<br>');
  return html;
};

// Extract raw text from editor HTML
const htmlToText = (html) => {
  let text = html;
  // Replace tag elements with {{ var }}
  text = text.replace(/<span[^>]*data-var="([^"]*)"[^>]*>[^<]*<\/span>/g, '{{$1}}');
  // Handle divs added by contentEditable for newlines
  text = text.replace(/<div><br><\/div>/gi, '\n');
  text = text.replace(/<div>/gi, '\n');
  text = text.replace(/<\/div>/gi, '');
  text = text.replace(/<br\s*\/?>/gi, '\n');
  // Strip other HTML
  text = text.replace(/<[^>]*>/g, '');
  // Decode entities
  text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  text = text.replace(/\u200B/g, '');
  return text;
};

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const getInputNodes = useStore((s) => s.getInputNodes);
  const editorRef = useRef(null);
  const popupRef = useRef(null);
  const measureRef = useRef(null);
  const lastStateTextRef = useRef(data?.text || '');

  const [rawText, setRawText] = useState(data?.text || '');
  const [showPopup, setShowPopup] = useState(false);
  const [popupStep, setPopupStep] = useState('node');
  const [selectedNode, setSelectedNode] = useState(null);
  const [dims, setDims] = useState({ width: 260, height: 80 });

  // Init
  useEffect(() => {
    if (editorRef.current && rawText) {
      editorRef.current.innerHTML = buildHtml(rawText);
    }
  }, []); // eslint-disable-line

  // Incoming sync from Store (e.g. auto-connect)
  useEffect(() => {
    const freshText = data?.text || '';
    if (freshText !== lastStateTextRef.current) {
      lastStateTextRef.current = freshText;
      setRawText(freshText);
      if (editorRef.current) {
        editorRef.current.innerHTML = buildHtml(freshText);
      }
    }
  }, [data?.text]);

  const pushStateOut = useCallback((text) => {
    if (text !== lastStateTextRef.current) {
      lastStateTextRef.current = text;
      setRawText(text);
      updateNodeField(id, 'text', text);
    }
  }, [id, updateNodeField]);

  // Measure
  useEffect(() => {
    if (measureRef.current) {
      measureRef.current.innerHTML = buildHtml(rawText) || '<br>';
      const w = Math.max(260, Math.min(500, measureRef.current.scrollWidth + 48));
      const h = Math.max(60, measureRef.current.scrollHeight + 4);
      setDims({ width: w, height: h });
    }
  }, [rawText]);

  // Handle editor input
  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    const text = htmlToText(editorRef.current.innerHTML);
    pushStateOut(text);

    // Detect {{ trigger
    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const before = range.startContainer.textContent.substring(0, range.startOffset);
        if (before.endsWith('{{')) {
          setShowPopup(true);
          setPopupStep('node');
          setSelectedNode(null);
        }
      }
    }
  }, [pushStateOut]);

  // Click tag to remove it
  const handleEditorClick = useCallback((e) => {
    const tag = e.target.closest('.text-node-inline-tag');
    if (tag) {
      e.preventDefault();
      tag.remove();
      const text = htmlToText(editorRef.current.innerHTML);
      pushStateOut(text);
    }
  }, [pushStateOut]);

  // Insert tag from popup
  const insertTag = useCallback((varName) => {
    const editor = editorRef.current;
    if (!editor) return;

    const sel = window.getSelection();
    if (sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const textNode = range.startContainer;
        const offset = range.startOffset;
        const before = textNode.textContent.substring(0, offset);
        const after = textNode.textContent.substring(offset);

        if (before.endsWith('{{')) {
          const cleanBefore = before.slice(0, -2);
          const beforeNode = document.createTextNode(cleanBefore);
          const afterNode = document.createTextNode(' ' + after);

          const tagEl = document.createElement('span');
          tagEl.className = 'text-node-inline-tag';
          tagEl.contentEditable = 'false';
          tagEl.setAttribute('data-var', varName);
          tagEl.textContent = `📥 ${varName}`;

          const parent = textNode.parentNode;
          // insert everything back
          parent.insertBefore(beforeNode, textNode);
          parent.insertBefore(tagEl, textNode);
          parent.insertBefore(afterNode, textNode);
          parent.removeChild(textNode);

          // Cursor after the new text node
          const newRange = document.createRange();
          newRange.setStartAfter(afterNode);
          newRange.collapse(true);
          sel.removeAllRanges();
          sel.addRange(newRange);
        }
      }
    }

    const text = htmlToText(editor.innerHTML);
    pushStateOut(text);
    setShowPopup(false);
    setPopupStep('node');
    setSelectedNode(null);
    editor.focus();
  }, [pushStateOut]);

  const handleSelectNode = (node) => {
    setSelectedNode(node);
    setPopupStep('output');
  };

  const handleSelectOutput = (outputField) => {
    const nodeName = selectedNode.data?.inputName || selectedNode.id.replace('customInput-', 'input_');
    insertTag(`${nodeName}.${outputField}`);
  };

  const inputNodes = showPopup ? getInputNodes() : [];

  return (
    <div className="base-node text-node-resizable" style={{ width: dims.width }}>
      <div className="base-node-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="base-node-icon" style={{ color: '#f59e0b' }}><FileText size={16} /></span>
          <span className="base-node-label">Text</span>
        </div>
        <button className="base-node-close">✕</button>
      </div>

      <div className="base-node-body" style={{ position: 'relative' }}>
        <div className="base-node-description">Write static text or use {'{{'} to insert variables</div>
        <div className="base-node-field">
          <label className="base-node-field-label">Text</label>

          {/* Hidden measurement element */}
          <div ref={measureRef} className="text-node-measure" aria-hidden="true" />

          {/* contentEditable rich editor */}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="text-node-editor nodrag"
            onInput={handleInput}
            onClick={handleEditorClick}
            data-placeholder="Type here... use {{ to reference inputs"
            style={{ minHeight: Math.max(60, dims.height) }}
          />
        </div>

        {/* {{ Popup */}
        {showPopup && (
          <div ref={popupRef} className="text-node-popup">
            {popupStep === 'node' && (
              <>
                <div className="text-node-popup-header">
                  <span className="text-node-popup-step">❶ Select Node</span>
                </div>
                {inputNodes.length === 0 ? (
                  <div className="text-node-popup-empty">No Input nodes on canvas</div>
                ) : (
                  inputNodes.map((node) => {
                    const name = node.data?.inputName || node.id.replace('customInput-', 'input_');
                    return (
                      <button key={node.id} className="text-node-popup-item" onClick={() => handleSelectNode(node)}>
                        <span className="text-node-popup-icon">📥</span>
                        <span className="text-node-popup-name">{name}</span>
                        <span className="text-node-popup-badge">Input</span>
                      </button>
                    );
                  })
                )}
              </>
            )}
            {popupStep === 'output' && selectedNode && (
              <>
                <div className="text-node-popup-header">
                  <span className="text-node-popup-step">❷ Select Output</span>
                </div>
                <button className="text-node-popup-item" onClick={() => handleSelectOutput('text')}>
                  <span className="text-node-popup-icon">📄</span>
                  <span className="text-node-popup-name">text</span>
                  <span className="text-node-popup-desc">The inputted text</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Single input connection point as requested */}
      <Handle
        type="target"
        position={Position.Left}
        id={`${id}-input`}
        className="base-node-handle base-node-handle-target"
        style={{ top: '50%' }}
      >
        <span className="handle-label handle-label-left">input</span>
      </Handle>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
        className="base-node-handle base-node-handle-source"
        style={{ top: '50%' }}
      >
        <span className="handle-label handle-label-right">output</span>
      </Handle>
    </div>
  );
};
