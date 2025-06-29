'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
import { $isFootnoteNode } from './FootnoteNode';
import { createPortal } from 'react-dom';

export const FootnoteTooltip = ({ onEdit, onDelete }: {
  onEdit: (footnoteId: number) => void;
  onDelete: (footnoteId: number) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const [visible, setVisible] = useState(false);
  const [footnoteId, setFootnoteId] = useState<number | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        editor.getEditorState().read(() => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = selection.anchor.getNode();
            if ($isFootnoteNode(node)) {
              const domRange = editor.getElementByKey(node.getKey());
              const rect = domRange?.getBoundingClientRect();
              if (rect) {
                setCoords({ top: rect.bottom + 4, left: rect.left });
              }
              setFootnoteId(node.__footnoteId);
              setVisible(true);
              return;
            }
          }
          setVisible(false);
        });
        return false;
      },
      0,
    );
  }, [editor]);

  if (!visible || footnoteId === null) return null;

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        background: '#fff',
        border: '1px solid #ccc',
        padding: '6px 10px',
        borderRadius: 4,
        zIndex: 1000,
      }}
    >
      <span style={{ marginRight: 8 }}>Footnote #{footnoteId}</span>
      <button onClick={() => onEdit(footnoteId)}>✏️</button>
      <button onClick={() => onDelete(footnoteId)}>❌</button>
    </div>,
    document.body,
  );
};
