// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { $getSelection, $isRangeSelection, SELECTION_CHANGE_COMMAND } from 'lexical';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@lexical/utils';
// import { createPortal } from 'react-dom';
// import { $isFootnoteNode } from './FootnoteNode';
// import './tooltip.css';

// export default function FootnoteTooltipPlugin({
//   footnoteId,
//   onClose,
// }: {
//   footnoteId: number;
//   onClose: () => void;
// }) {
//   const [editor] = useLexicalComposerContext();
//   const [showTooltip, setShowTooltip] = useState(false);
//   const tooltipRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         SELECTION_CHANGE_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if ($isRangeSelection(selection)) {
//             const node = selection.anchor.getNode();
//             if ($isFootnoteNode(node) && node.__footnoteId === footnoteId) {
//               setShowTooltip(true);
//             } else {
//               setShowTooltip(false);
//             }
//           }
//           return false;
//         },
//         1,
//       )
//     );
//   }, [editor, footnoteId]);

//   if (!showTooltip) return null;

//   return createPortal(
//     <div ref={tooltipRef} className="footnote-tooltip">
//       <div>Preview: Footnote {footnoteId}</div>
//       <button onClick={() => editor.dispatchCommand('OPEN_DRAWER', footnoteId)}>Edit</button>
//       <button
//         onClick={() =>
//           editor.update(() => {
//             const selection = $getSelection();
//             if ($isRangeSelection(selection)) {
//               const node = selection.anchor.getNode();
//               if ($isFootnoteNode(node)) {
//                 node.remove();
//               }
//             }
//             onClose();
//           })
//         }
//       >
//         Remove
//       </button>
//     </div>,
//     document.body
//   );
// }


// FootnoteTooltipPlugin.tsx
// 'use client';

// import { useEffect, useRef, useState } from 'react';
// import { createPortal } from 'react-dom';
// import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
// import { $getNodeByKey } from 'lexical';
// import { $isFootnoteNode } from './FootnoteNode';

// export const FootnoteTooltipPlugin = ({
//   onEdit,
//   onDelete,
// }: {
//   onEdit: (footnoteId: number) => void;
//   onDelete: (footnoteId: number) => void;
// }) => {
//   const [editor] = useLexicalComposerContext();
//   const tooltipRef = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(false);
//   const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
//   const [footnoteId, setFootnoteId] = useState<number | null>(null);

//   useEffect(() => {
//     const handleMouseOver = (e: MouseEvent) => {
//       const target = e.target as HTMLElement;
//       if (target && target.dataset?.footnoteKey) {
//         const key = target.dataset.footnoteKey;
//         editor.getEditorState().read(() => {
//           const node = $getNodeByKey(key);
//           if (node && $isFootnoteNode(node)) {
//             const rect = target.getBoundingClientRect();
//             setCoords({ top: rect.bottom + 4, left: rect.left });
//             setFootnoteId(node.__footnoteId);
//             setVisible(true);
//           }
//         });
//       } else {
//         setVisible(false);
//         setFootnoteId(null);
//       }
//     };

//     document.addEventListener('mouseover', handleMouseOver);
//     return () => {
//       document.removeEventListener('mouseover', handleMouseOver);
//     };
//   }, [editor]);

//   if (!visible || footnoteId === null) return null;

//   return createPortal(
//     <div
//       ref={tooltipRef}
//       style={{
//         position: 'absolute',
//         top: coords.top,
//         left: coords.left,
//         background: '#fff',
//         border: '1px solid #ccc',
//         padding: '6px 10px',
//         borderRadius: 4,
//         zIndex: 1000,
//         fontSize: '14px',
//       }}
//     >
//       <span style={{ marginRight: 8 }}>Footnote #{footnoteId}</span>
//       <button onClick={() => onEdit(footnoteId)} style={{ marginRight: 4 }}>✏️</button>
//       <button onClick={() => onDelete(footnoteId)}>❌</button>
//     </div>,
//     document.body,
//   );
// };


// FootnoteTooltipPlugin.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { $getRoot, $nodesOfType } from 'lexical';
import { $isFootnoteNode, FootnoteNode } from './FootnoteNode';
import { createPortal } from 'react-dom';
import { footnoteStore } from './plugin';

export const FootnoteTooltipPlugin = ({
  onEdit,
  onDelete,
}: {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const [editor] = useLexicalComposerContext();
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [visible, setVisible] = useState(false);
  const [footnoteId, setFootnoteId] = useState<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    // const updateTooltip = () => {
    //   const rootElement = editor.getRootElement();
    //   if (!rootElement) return;

    //   const footnoteElements = rootElement.querySelectorAll('sup > a');
    //   footnoteElements.forEach((el) => {
    //     el.addEventListener('mouseenter', (e) => {
    //       const rect = (e.target as HTMLElement).getBoundingClientRect();
    //       const id = Number((e.target as HTMLElement).id.replace('ref', ''));
    //       setCoords({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    //       setFootnoteId(id);
    //       setVisible(true);
    //     });
    //     el.addEventListener('mouseleave', () => {
    //       setTimeout(() => setVisible(false), 200);
    //     });
    //   });
    // };



    const updateTooltip = () => {
    const rootElement = editor.getRootElement();
    if (!rootElement) return;

    const footnoteElements = rootElement.querySelectorAll('sup > a');
    footnoteElements.forEach((el) => {
      el.addEventListener('mouseenter', (e) => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const id = Number((e.target as HTMLElement).id.replace('ref', ''));
        setCoords({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
        setFootnoteId(id);
        setVisible(true);
      });
      el.addEventListener('mouseleave', () => {
        hideTimeout.current = setTimeout(() => setVisible(false), 200);
      });
    });
  };
    return editor.registerUpdateListener(() => {
      updateTooltip();
    });
  }, [editor]);

  if (!visible || coords === null || footnoteId === null) return null;

  const preview = footnoteStore.get(footnoteId) || '<em>No content</em>';

  return createPortal(
    <div
      ref={tooltipRef}
      style={{
        position: 'absolute',
        top: coords.top,
        left: coords.left,
        background: '#fff',
        border: '1px solid #ccc',
        padding: '8px 12px',
        borderRadius: '6px',
        zIndex: 1000,
        maxWidth: '300px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
      }}
      // onMouseEnter={() => setVisible(true)}
      // onMouseLeave={() => setVisible(false)}
      onMouseEnter={() => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      setVisible(true);
      }}
      onMouseLeave={() => {
        hideTimeout.current = setTimeout(() => setVisible(false), 200);
      }}
    >
      <div style={{ marginBottom: 8, fontSize: 13 }}>
        <strong>Footnote #{footnoteId}</strong>
        <div dangerouslySetInnerHTML={{ __html: preview }} />
      </div>
      <div style={{ textAlign: 'right' }}>
        <button
          onClick={() => onEdit(footnoteId)}
          style={{ marginRight: 8 }}
        >
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(footnoteId)}>❌ Delete</button>
      </div>
    </div>,
    document.body
  );
};

