'use client';

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_TEXT_COMMAND, $getSelection, $isRangeSelection } from 'lexical';
import { TOGGLE_LINK_COMMAND } from '@lexical/link'; // ✅ Correct

import { useCallback } from 'react';

export default function FootnoteToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const applyFormat = useCallback((format: 'bold' | 'italic' | 'strikethrough') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  }, [editor]);

  const toggleLink = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const isLink = selection.getNodes().some(n => n.getType() === 'link');
        if (isLink) {
          editor.dispatchCommand(TOGGLE_LINK_COMMAND, null); // remove link
        } else {
          const url = prompt('Enter link URL');
          if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          }
        }
      }
    });
  };

  return (
    <div className="footnote-toolbar" style={{ marginBottom: '0.5rem' }}>
      <button onClick={() => applyFormat('bold')}><strong>B</strong></button>
      <button onClick={() => applyFormat('italic')}><em>I</em></button>
      <button onClick={() => applyFormat('strikethrough')}><s>S</s></button>
      <button onClick={toggleLink}>🔗</button>
    </div>
  );
}
