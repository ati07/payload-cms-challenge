'use client';

import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { footnoteStore } from './plugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $getSelection, $isRangeSelection, ParagraphNode, TextNode } from 'lexical';
import { LinkNode } from '@lexical/link';

import './drawer.css';
import { $createCustomParagraphNode, $isFootnoteNode, CustomParagraphNode } from './FootnoteNode';
import ExampleTheme from './ExampleTheme';
import FootnoteToolbarPlugin from './FootnoteToolbarPlugin';
import {FootnoteTooltip} from './Tooltip';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';

export const FootnoteDrawer = ({ footnoteId, onClose }: { footnoteId: number; onClose: () => void }) => {
  const [editorHTML, setEditorHTML] = useState(footnoteStore.get(footnoteId) || '');
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    console.log('Opened drawer for footnote:', footnoteId);
  }, [footnoteId]);

  const placeholder = 'Enter footnote rich text...';

  const editorConfig: InitialConfigType = {
    namespace: `footnote-${footnoteId}`,
    nodes: [
      ParagraphNode,
      TextNode,
      LinkNode,
      CustomParagraphNode,
      {
        replace: ParagraphNode,
        with: () => $createCustomParagraphNode(),
        withKlass: CustomParagraphNode,
      },
    ],
    onError(error: Error) {
      throw error;
    },
    theme: ExampleTheme,
  };

  const handleSubmit = () => {
    footnoteStore.set(footnoteId, editorHTML);
    const footer = document.getElementById('footnotes-block');
    if (footer) {
      const items = Array.from(footnoteStore.entries())
        .sort(([a], [b]) => a - b)
        .map(([id, content]) => `<li id="fn${id}">${content}</li>`)
        .join('');
      footer.innerHTML = `<ul>${items}</ul>`;
    }
    onClose();
  };

  const handleDeleteFootnote = (id: number) => {
  editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = selection.anchor.getNode();
      if ($isFootnoteNode(node) && node.__footnoteId === id) {
        node.remove();
      }
    }
  });
  onClose();
};

  return (
    <Modal
      isOpen={true}
      onRequestClose={onClose}
      contentLabel={`Footnote ${footnoteId}`}
      style={{
        content: {
          top: '20%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -20%)',
          width: '600px',
        },
      }}
    >
      <h2 style={{ color: 'black' }}>Edit Footnote {footnoteId}</h2>

      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <FootnoteToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={placeholder}
                  placeholder={<div className="editor-placeholder">{placeholder}</div>}
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  const html = document.querySelector('.editor-input')?.innerHTML || '';
                  setEditorHTML(html);
                  footnoteStore.set(footnoteId, html);
                  const footer = document.getElementById('footnotes-block');
                  if (footer) {
                    const items = Array.from(footnoteStore.entries())
                      .sort(([a], [b]) => a - b)
                      .map(([id, content]) => `<li id="fn${id}">${content}</li>`)
                      .join('');
                    footer.innerHTML = `<ul>${items}</ul>`;
                  }
                });
              }}
            />
            {/* <FootnoteTooltipPlugin footnoteId={footnoteId} onClose={onClose} />
             */}
             {/* <FootnoteTooltip
              onEdit={() => {}}
              onDelete={(id) => {
                editor.update(() => {
                  const selection = $getSelection();
                  if ($isRangeSelection(selection)) {
                    const node = selection.anchor.getNode();
                    if ($isFootnoteNode(node) && node.__footnoteId === id) {
                      node.remove();
                    }
                  }
                });
                onClose();
              }}
            /> */}
            <FootnoteTooltip
  onEdit={() => {}}
  onDelete={handleDeleteFootnote}
/>


          </div>
        </div>
      </LexicalComposer>

      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <button onClick={onClose} style={{ marginRight: '0.5rem' }}>Close</button>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </Modal>
  );
};














// 'use client';

// import { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { ContentEditable } from '@lexical/react/LexicalContentEditable';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
// import { footnoteStore } from './plugin';
// import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
// import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
// import { ParagraphNode, TextNode } from 'lexical';
// import { LinkNode } from '@lexical/link';

// import './drawer.css';
// import { $createCustomParagraphNode, CustomParagraphNode } from './FootnoteNode';
// import ExampleTheme from './ExampleTheme';
// import FootnoteToolbarPlugin from './FootnoteToolbarPlugin';

// export const FootnoteDrawer = ({ footnoteId, onClose }: { footnoteId: number; onClose: () => void }) => {
//   const [editorHTML, setEditorHTML] = useState(footnoteStore.get(footnoteId) || '');
//   useEffect(() => {
//     console.log('Opened drawer for footnote:', footnoteId);
//   }, [footnoteId]);

//   const placeholder = 'Enter footnote rich text...';

//   const editorConfig: InitialConfigType = {
//     namespace: `footnote-${footnoteId}`,
//     nodes: [
//       ParagraphNode,
//       TextNode,
//       LinkNode,
//       CustomParagraphNode,
//       {
//         replace: ParagraphNode,
//         with: () => $createCustomParagraphNode(),
//         withKlass: CustomParagraphNode,
//       },
//     ],
//     onError(error: Error) {
//       throw error;
//     },
//     theme: ExampleTheme,
//   };



//   const handleSubmit = () => {
//     footnoteStore.set(footnoteId, editorHTML);
//     const footer = document.getElementById('footnotes-block');
//     if (footer) {
//       const items = Array.from(footnoteStore.entries())
//         .sort(([a], [b]) => a - b)
//         .map(([id, content]) => `<li id="fn${id}">${content}</li>`)
//         .join('');
//       footer.innerHTML = `<ul>${items}</ul>`;
//     }
//     onClose();
//   };

//   return (
//     <Modal
//       isOpen={true}
//       onRequestClose={onClose}
//       contentLabel={`Footnote ${footnoteId}`}
//       style={{
//         content: {
//           top: '20%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           marginRight: '-50%',
//           transform: 'translate(-50%, -20%)',
//           width: '600px',
//         },
//       }}
//     >
//       <h2 style={{ color: 'black' }}>Edit Footnote {footnoteId}</h2>

//       <LexicalComposer initialConfig={editorConfig}>
//         <div className="editor-container">
//           <FootnoteToolbarPlugin />
//           <div className="editor-inner">
//             <RichTextPlugin
//               contentEditable={
//                 <ContentEditable
//                   className="editor-input"
//                   aria-placeholder={placeholder}
//                   placeholder={<div className="editor-placeholder">{placeholder}</div>}
//                 />
//               }
//               ErrorBoundary={LexicalErrorBoundary}
//             />
//             <HistoryPlugin />
//             <AutoFocusPlugin />
//             <OnChangePlugin
//               onChange={(editorState) => {
//                 editorState.read(() => {
//                   const html = document.querySelector('.editor-input')?.innerHTML || '';
//                   footnoteStore.set(footnoteId, html);
//                   const footer = document.getElementById('footnotes-block');
//                   if (footer) {
//                     const items = Array.from(footnoteStore.entries())
//                       .sort(([a], [b]) => a - b)
//                       .map(([id, content]) => `<li id="fn${id}">${content}</li>`)
//                       .join('');
//                     footer.innerHTML = `<ul>${items}</ul>`;
//                   }
//                 });
//               }}
//             />
//           </div>
//         </div>
//       </LexicalComposer>
//       <div style={{ marginTop: '1rem', textAlign: 'right' }}>
//          <button onClick={onClose} style={{ marginRight: '0.5rem' }}>Close</button>
//         <button onClick={handleSubmit}>Submit</button>
//       </div>
//     </Modal>
//   );
// };




















// 'use client';
// import { useEffect, useState } from 'react';
// import Modal from 'react-modal';
// import { InitialConfigType, LexicalComposer } from '@lexical/react/LexicalComposer';
// import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
// import { ContentEditable } from '@lexical/react/LexicalContentEditable';
// import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
// import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
// import { footnoteStore } from './plugin';
// import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
// import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
// import {
//   ParagraphNode,
//   TextNode,
// } from 'lexical';
// import { LinkNode } from '@lexical/link'; // ✅ Correct

// import './drawer.css';
// import { $createCustomParagraphNode, CustomParagraphNode } from './FootnoteNode';
// import ExampleTheme from './ExampleTheme';
// import FootnoteToolbarPlugin from './FootnoteToolbarPlugin';

// export const FootnoteDrawer = ({ footnoteId, onClose }: { footnoteId: number; onClose: () => void }) => {
//   useEffect(() => {
//     console.log('Opened drawer for footnote:', footnoteId);
//   }, [footnoteId]);

//   const placeholder = 'Enter footnote content...';

//   const editorConfig: InitialConfigType = {
//     namespace: `footnote-${footnoteId}`,
//     nodes: [
//       ParagraphNode,
//       TextNode,
//       LinkNode,
//       CustomParagraphNode,
//       {
//         replace: ParagraphNode,
//         with: () => $createCustomParagraphNode(),
//         withKlass: CustomParagraphNode,
//       },
//     ],
//     onError(error: Error) {
//       throw error;
//     },
//     theme: ExampleTheme,
//   };

//   return (
//     <Modal
//       isOpen={true}
//       onRequestClose={onClose}
//       contentLabel={`Footnote ${footnoteId}`}
//       style={{
//         content: {
//           top: '20%',
//           left: '50%',
//           right: 'auto',
//           bottom: 'auto',
//           marginRight: '-50%',
//           transform: 'translate(-50%, -20%)',
//           width: '600px',
//         },
//       }}
//     >
//       <h2 style={{ color: 'black' }}>Edit Footnote {footnoteId}</h2>

//       <LexicalComposer initialConfig={editorConfig}>
//         <div className="editor-container">
//           <FootnoteToolbarPlugin />
//           <div className="editor-inner">
//             <RichTextPlugin
//               contentEditable={
//                 <ContentEditable
//                   className="editor-input"
//                   aria-placeholder={placeholder}
//                   placeholder={<div className="editor-placeholder">{placeholder}</div>}
//                 />
//               }
//               ErrorBoundary={LexicalErrorBoundary}
//             />
//             <HistoryPlugin />
//             <AutoFocusPlugin />
//           </div>
//         </div>
//       </LexicalComposer>

//       <div style={{ marginTop: '1rem', textAlign: 'right' }}>
//         <button onClick={onClose}>Close</button>
//       </div>
//     </Modal>
//   );
// };



// FootnoteDrawer.tsx
// FootnoteDrawer.tsx
// 'use client';

// import * as Dialog from '@radix-ui/react-dialog';
// import React, { useEffect, useState } from 'react';
// import './drawer.css';
// import { footnoteStore } from './plugin';

// export const FootnoteDrawer = ({ footnoteId, onClose }: { footnoteId: number; onClose: () => void }) => {
//   const [value, setValue] = useState(footnoteStore.get(footnoteId) || '');

//   useEffect(() => {
//     setValue(footnoteStore.get(footnoteId) || '');
//   }, [footnoteId]);

//   const saveFootnote = () => {
//     footnoteStore.set(footnoteId, value);
//     onClose();
//   };

//   return (
//     <Dialog.Root open onOpenChange={onClose}>
//       <Dialog.Portal>
//         <div className="drawer-overlay" />
//         <Dialog.Content className="drawer">
//           <Dialog.Title className="drawer-title">Edit Footnote #{footnoteId}</Dialog.Title>
//           <textarea
//             className="drawer-textarea"
//             value={value}
//             onChange={(e) => setValue(e.target.value)}
//             placeholder="Enter footnote content..."
//           />
//           <div className="drawer-footer">
//             <button className="drawer-button" onClick={saveFootnote}>
//               Save
//             </button>
//           </div>
//         </Dialog.Content>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

