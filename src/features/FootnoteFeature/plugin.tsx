'use client';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  TextNode,
} from '@payloadcms/richtext-lexical/lexical';
import { useEffect, useState } from 'react';
import { $createFootnoteNode, $isFootnoteNode } from './FootnoteNode';
import { FootnoteDrawer } from './FootnoteDrawer';
// import { FootnoteTooltip } from './Tooltip'; // ✅ Make sure this path is correct
import { FootnoteTooltipPlugin } from './FootnoteTooltipPlugin';

export const INSERT_FOOTNOTE_COMMAND: LexicalCommand<void> = createCommand('INSERT_FOOTNOTE_COMMAND');

export const footnoteStore = new Map<number, string>();
let globalFootnoteCounter = 1;

export const FootnotePlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [openDrawerId, setOpenDrawerId] = useState<number | null>(null);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_FOOTNOTE_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const footnoteId = globalFootnoteCounter++;
            const footnoteNode = $createFootnoteNode(footnoteId, '', `${footnoteId}`);
            selection.insertNodes([footnoteNode]);
            setOpenDrawerId(footnoteId);
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      )
    );
  }, [editor]);

  return (
    <>
      {openDrawerId !== null && (
        <FootnoteDrawer
          footnoteId={openDrawerId}
          onClose={() => setOpenDrawerId(null)}
        />
      )}

      {/* ✅ Tooltip floating preview with edit/delete */}
      <FootnoteTooltipPlugin
        onEdit={(id) => setOpenDrawerId(id)}
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
        }}
      />
    </>
  );
};





















// 'use client';
// import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
// import {
//   $getSelection,
//   $isRangeSelection,
//   COMMAND_PRIORITY_EDITOR,
//   createCommand,
//   LexicalCommand,
//   TextNode,
// } from '@payloadcms/richtext-lexical/lexical';
// import { useEffect, useState } from 'react';
// import { $createFootnoteNode } from './FootnoteNode';
// import { FootnoteDrawer } from './FootnoteDrawer';

// export const INSERT_FOOTNOTE_COMMAND: LexicalCommand<void> = createCommand('INSERT_FOOTNOTE_COMMAND');

// export const footnoteStore = new Map<number, string>();
// let globalFootnoteCounter = 1;

// export const FootnotePlugin = () => {
//   const [editor] = useLexicalComposerContext();
//   const [openDrawerId, setOpenDrawerId] = useState<number | null>(null);

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         INSERT_FOOTNOTE_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if ($isRangeSelection(selection)) {
//             const footnoteId = globalFootnoteCounter++;
//             // const footnoteNode = $createFootnoteNode(footnoteId);

//             // const textNode = new TextNode(`${footnoteId}`);
//             // footnoteNode.append(textNode);
//             const footnoteNode = $createFootnoteNode(footnoteId, '', `${footnoteId}`);
//             selection.insertNodes([footnoteNode]);
//             setOpenDrawerId(footnoteId);
//           }
//           return true;
//         },
//         COMMAND_PRIORITY_EDITOR
//       )
//     );
//   }, [editor]);

//   return (
//     <>
//       {openDrawerId !== null && (
//         <FootnoteDrawer
//           footnoteId={openDrawerId}
//           onClose={() => setOpenDrawerId(null)}
//         />
//       )}
//     </>
//   );
// };