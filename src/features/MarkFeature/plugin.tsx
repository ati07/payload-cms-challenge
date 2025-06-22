'use client';
import type { PluginComponent } from '@payloadcms/richtext-lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  $createTextNode,
  TextNode,
  LexicalNode,
} from '@payloadcms/richtext-lexical/lexical';
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
import { useEffect } from 'react';
import { $isMarkNode, $createMarkNode } from './nodes/MarkNode';

export const TOGGLE_MARK_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MARK_COMMAND');

export const MarkPlugin: PluginComponent = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        TOGGLE_MARK_COMMAND,
        () => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const nodes = selection.getNodes();
            const hasMark = nodes.every((node) => {
              const parent = node.getParent();
              return $isMarkNode(node) || $isMarkNode(parent);
            });

            if (hasMark) {
              // ✅ UNWRAP: Remove mark formatting
              editor.update(() => {
                const selectedNodes = selection.getNodes();

                selectedNodes.forEach((node) => {
                  const parent = node.getParent();

                  if (parent && $isMarkNode(parent)) {
                    node.remove();
                    parent.insertBefore(node);

                    if (parent.getChildrenSize() === 0) {
                      parent.remove();
                    }
                  } else if ($isMarkNode(node)) {
                    const children = node.getChildren();
                    children.forEach((child) => {
                      node.insertBefore(child);
                    });
                    node.remove();
                  }
                });
              });
            } else {
              // ✅ WRAP: Only selected span in <mark>
              editor.update(() => {
                const selection = $getSelection();
                if (!$isRangeSelection(selection)) return;

                const selectedText = selection.getTextContent();
                if (!selectedText.trim()) return;

                const nodes = selection.getNodes();

                for (const node of nodes) {
                  if (!(node instanceof TextNode)) continue;

                  const nodeText = node.getTextContent();
                  const anchorOffset = selection.anchor.offset;
                  const focusOffset = selection.focus.offset;

                  const [startOffset, endOffset] =
                    anchorOffset < focusOffset
                      ? [anchorOffset, focusOffset]
                      : [focusOffset, anchorOffset];

                  const nodeStart = selection.anchor.getNode() === node ? startOffset : 0;
                  const nodeEnd = selection.focus.getNode() === node ? endOffset : node.getTextContentSize();

                  if (nodeStart === nodeEnd) continue;

                  const beforeText = nodeText.slice(0, nodeStart);
                  const selected = nodeText.slice(nodeStart, nodeEnd);
                  const afterText = nodeText.slice(nodeEnd);

                  const parent = node.getParentOrThrow();
                  const newNodes: LexicalNode[] = [];

                  if (beforeText) {
                    newNodes.push(new TextNode(beforeText).setFormat(node.getFormat()));
                  }

                  if (selected) {
                    const markNode = $createMarkNode();
                    const wrappedText = new TextNode(selected).setFormat(node.getFormat());
                    markNode.append(wrappedText);
                    newNodes.push(markNode);
                  }

                  if (afterText) {
                    newNodes.push(new TextNode(afterText).setFormat(node.getFormat()));
                  }

                  const nextSibling = node.getNextSibling();

                  if (newNodes.length === 1) {
                    node.replace(newNodes[0]);
                  } else {
                    node.remove();
                    newNodes.forEach((n) => {
                      if (nextSibling) {
                        nextSibling.insertBefore(n);
                      } else {
                        parent.append(n);
                      }
                    });
                  }
                }
              });
            }
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
};




















// 'use client';
// import type { PluginComponent } from '@payloadcms/richtext-lexical';
// import {
//   $getSelection,
//   $isRangeSelection,
//   COMMAND_PRIORITY_EDITOR,
//   createCommand,
//   LexicalCommand,
//   $createTextNode,
//   TextNode,
// } from '@payloadcms/richtext-lexical/lexical';
// import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
// import { useEffect } from 'react';
// import { $isMarkNode, $createMarkNode } from './nodes/MarkNode';
// import { $wrapNodes } from '@lexical/selection';
// import type { LexicalNode } from '@payloadcms/richtext-lexical/lexical';

// export const TOGGLE_MARK_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MARK_COMMAND');

// export const MarkPlugin: PluginComponent = () => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         TOGGLE_MARK_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if ($isRangeSelection(selection)) {
//             const nodes = selection.getNodes();
//             const hasMark = nodes.every((node) => $isMarkNode(node));

//             if (hasMark) {
//               // // Unwrap: Remove mark formatting
//               // editor.update(() => {
//               //   nodes.forEach((node) => {
//               //     if ($isMarkNode(node)) {
//               //       const textNode = $createTextNode(node.getTextContent());
//               //       node.replace(textNode);
//               //     }
//               //   });
//               // });
//               nodes.forEach((node) => {
//               if ($isMarkNode(node)) {
//                 const children = node.getChildren();
//                 children.forEach(child => {
//                   node.insertBefore(child);
//                 });
//                 node.remove();
//               }
//             });
//             } else {
//               // ✅ Wrap: Apply mark formatting only to selected span
//               editor.update(() => {
//                 const selection = $getSelection();
//                 if (!$isRangeSelection(selection)) return;

//                 const selectedText = selection.getTextContent();
//                 if (!selectedText.trim()) return;

//                 const nodes = selection.getNodes();

//                 for (const node of nodes) {
//                   if (!(node instanceof TextNode)) continue;

//                   const nodeText = node.getTextContent();
//                   const anchorOffset = selection.anchor.offset;
//                   const focusOffset = selection.focus.offset;

//                   const [startOffset, endOffset] =
//                     anchorOffset < focusOffset
//                       ? [anchorOffset, focusOffset]
//                       : [focusOffset, anchorOffset];

//                   const nodeStart = selection.anchor.getNode() === node ? startOffset : 0;
//                   const nodeEnd = selection.focus.getNode() === node ? endOffset : node.getTextContentSize();

//                   if (nodeStart === nodeEnd) continue;

//                   const beforeText = nodeText.slice(0, nodeStart);
//                   const selected = nodeText.slice(nodeStart, nodeEnd);
//                   const afterText = nodeText.slice(nodeEnd);

//                   const parent = node.getParentOrThrow();
//                   const newNodes: LexicalNode[] = [];

//                   if (beforeText) {
//                     newNodes.push(new TextNode(beforeText).setFormat(node.getFormat()));
//                   }

//                   if (selected) {
//                     const markNode = $createMarkNode();
//                     const wrappedText = new TextNode(selected).setFormat(node.getFormat());
//                     markNode.append(wrappedText);
//                     newNodes.push(markNode);
//                   }

//                   if (afterText) {
//                     newNodes.push(new TextNode(afterText).setFormat(node.getFormat()));
//                   }

//                   const nextSibling = node.getNextSibling();

//                   if (newNodes.length === 1) {
//                     node.replace(newNodes[0]);
//                   } else if (newNodes.length > 1) {
//                     node.remove();

//                     newNodes.forEach(n => {
//                       if (nextSibling) {
//                         nextSibling.insertBefore(n);
//                       } else {
//                         parent.append(n); // Fallback to appending if there's no sibling
//                       }
//                     });
//                   }

//                 }
//               });
//             }
//             return true;
//           }
//           return false;
//         },
//         COMMAND_PRIORITY_EDITOR,
//       ),
//     );
//   }, [editor]);

//   return null;
// };















// 'use client';
// import type { PluginComponent } from '@payloadcms/richtext-lexical';
// import {
//   $getSelection,
//   $isRangeSelection,
//   COMMAND_PRIORITY_EDITOR,
//   createCommand,
//   LexicalCommand,
//   $createTextNode,
  
// } from '@payloadcms/richtext-lexical/lexical';
// import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
// import { useEffect } from 'react';
// import { $isMarkNode, $createMarkNode } from './nodes/MarkNode';
// import { $wrapNodes }  from "@lexical/selection"
// export const TOGGLE_MARK_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MARK_COMMAND');

// export const MarkPlugin: PluginComponent = () => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         TOGGLE_MARK_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if (!$isRangeSelection(selection)) {
//             return false;
//           }

//           const nodes = selection.getNodes();
//           // Check if any node in the selection is a MarkNode or has a MarkNode parent
//           const hasMark = nodes.some((node) => $isMarkNode(node) || node.getParents().some($isMarkNode));

//           editor.update(() => {
//             if (hasMark) {
//               // Unwrap: Remove mark formatting
//               nodes.forEach((node) => {
//                 if ($isMarkNode(node)) {
//                   const textNode = $createTextNode(node.getTextContent());
//                   node.replace(textNode);
//                   textNode.select(0, textNode.getTextContent().length);
//                 } else if (node.getParents().some($isMarkNode)) {
//                   const markParent = node.getParents().find($isMarkNode);
//                   if (markParent) {
//                     const textNode = $createTextNode(markParent.getTextContent());
//                     markParent.replace(textNode);
//                     textNode.select(0, textNode.getTextContent().length);
//                   }
//                 }
//               });
//             } else {
//               // Wrap: Apply mark formatting
//               const textContent = selection.getTextContent();
//               if (textContent) {
//                 // Wrap selected nodes in a MarkNode
//                 $wrapNodes(selection, () => {
//                   const markNode = $createMarkNode();
//                   markNode.setTextContent(textContent);
//                   return markNode;
//                 }));
//                 // Re-select the wrapped text
//                 // const newSelection = $getSelection();
//                 // if ($isRangeSelection(newSelection)) {
//                 //   const markNodes = newSelection.getNodes().filter($isMarkNode);
//                 //   if (markNodes.length > 0) {
//                 //     newSelection.setTextNodeRange(
//                 //       markNodes[0],
//                 //       0,
//                 //       markNodes[markNodes.length - 1],
//                 //       markNodes[markNodes.length - 1].getTextContent().length
//                 //     );
//                 //   }
//                 // }
//               }
//             }
//           });

//           return true;
//         },
//         COMMAND_PRIORITY_EDITOR,
//       ),
//     );
//   }, [editor]);

//   return null;
// };








// 'use client';
// import type { PluginComponent } from '@payloadcms/richtext-lexical';
// import {
//   $getSelection,
//   $isRangeSelection,
//   COMMAND_PRIORITY_EDITOR,
//   createCommand,
//   LexicalCommand,
//   $createTextNode,
// } from '@payloadcms/richtext-lexical/lexical';
// import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
// import { useEffect } from 'react';
// import { $isMarkNode, $createMarkNode } from './nodes/MarkNode';

// export const TOGGLE_MARK_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MARK_COMMAND');

// export const MarkPlugin: PluginComponent = () => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         TOGGLE_MARK_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if (!$isRangeSelection(selection)) {
//             return false;
//           }

//           const nodes = selection.getNodes();
//           // Check if any node in the selection is a MarkNode or has a MarkNode parent
//           const hasMark = nodes.some((node) => $isMarkNode(node) || node.getParents().some($isMarkNode));

//           editor.update(() => {
//             if (hasMark) {
//               // Unwrap: Remove mark formatting
//               nodes.forEach((node) => {
//                 if ($isMarkNode(node)) {
//                   const textNode = $createTextNode(node.getTextContent());
//                   node.replace(textNode);
//                 } else if (node.getParents().some($isMarkNode)) {
//                   // If the node is a child of a MarkNode, replace the MarkNode parent
//                   const markParent = node.getParents().find($isMarkNode);
//                   if (markParent) {
//                     const textNode = $createTextNode(markParent.getTextContent());
//                     markParent.replace(textNode);
//                   }
//                 }
//               });
//             } else {
//               const focusNode = selection.focus.getNode()
//               console.log("focusNode",focusNode,nodes)
//               // Wrap: Apply mark formatting
//               const textContent = selection.getTextContent();
//               const markNode = $createMarkNode();
//               // markNode.setTextContent(textContent);
//               console.log("focusNode",focusNode,textContent,markNode,selection)
//               selection.insertNodes([markNode]);
//               // selection.hasFormat('highlight')
//               // if (textContent) {
//               //   const markNode = $createMarkNode();
//               //   markNode.setTextContent(textContent);

//               //   nodes.forEach((node) => {
//               //     node.replace(markNode)
//               //   // if ($isMarkNode(node)) {
//               //   //   const textNode = $createTextNode(node.getTextContent());
//               //   //   node.replace(textNode);
//               //   // } else if (node.getParents().some($isMarkNode)) {
//               //   //   // If the node is a child of a MarkNode, replace the MarkNode parent
//               //   //   const markParent = node.getParents().find($isMarkNode);
//               //   //   if (markParent) {
//               //   //     const textNode = $createTextNode(markParent.getTextContent());
//               //   //     markParent.replace(textNode);
//               //   //   }
//               //   // }
//               // });
//               //   // Remove existing nodes in the selection
//               //   // selection.extract();
//               //   // // Insert the new MarkNode
//               //   // selection.insertNodes([markNode]);
//               //   // // Re-select the inserted node to maintain selection
//               //   // selection.setTextNodeRange(markNode, 0, markNode, textContent.length);
//               // }
//             }
//           });

//           return true;
//         },
//         COMMAND_PRIORITY_EDITOR,
//       ),
//     );
//   }, [editor]);

//   return null;
// };






















// 'use client';
// import type { PluginComponent } from '@payloadcms/richtext-lexical';
// import {
//   $getSelection,
//   $isRangeSelection,
//   COMMAND_PRIORITY_EDITOR,
//   createCommand,
//   LexicalCommand,
//   $createTextNode,
// } from '@payloadcms/richtext-lexical/lexical';
// import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
// import { useEffect } from 'react';
// import { $isMarkNode, $createMarkNode } from './nodes/MarkNode';
// import { $wrapNodes } from '@lexical/selection'
// export const TOGGLE_MARK_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MARK_COMMAND');

// export const MarkPlugin: PluginComponent = () => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         TOGGLE_MARK_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if ($isRangeSelection(selection)) {
//             const nodes = selection.getNodes();
//             // || node.getParents().some($isMarkNode)
//             const hasMark = nodes.every((node) => $isMarkNode(node) );

//             if (hasMark) {
//               // Unwrap: Remove mark formatting
//               editor.update(() => {
//                 nodes.forEach((node) => {
//                   if ($isMarkNode(node)) {
//                     const textNode = $createTextNode(node.getTextContent());
//                     node.replace(textNode);
//                   }
//                 });
//               });
//             } else {
//               // Wrap: Apply mark formatting
//               editor.update(() => {
//                 const markNode = $createMarkNode();
//                 markNode.setTextContent(selection.getTextContent()); // Set text content directly
//                 selection.insertNodes([markNode]);
                
//               });
//               // editor.update(() => {
//               //   // const markNode = $createMarkNode();
//               //   // markNode.setTextContent(selection.getTextContent()); // Set text content directly
//               //   // selection.insertNodes([markNode]);
                
//               // });
//               // $wrapNodes(selection, () => $createMarkNode());
//             }
//             return true;
//           }
//           return false;
//         },
//         COMMAND_PRIORITY_EDITOR,
//       ),
//     );
//   }, [editor]);

//   return null;
// };



// 'use client';
// import type { PluginComponent } from '@payloadcms/richtext-lexical';
// import {
//   $getSelection,
//   $isRangeSelection,
//   COMMAND_PRIORITY_EDITOR,
//   createCommand,
//   LexicalCommand,
//   $createTextNode,
//   $isTextNode,
// } from '@payloadcms/richtext-lexical/lexical';
// import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext';
// import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils';
// import { useEffect } from 'react';
// import { $isMarkNode, $createMarkNode } from './nodes/MarkNode';
// import { $wrapNodes } from '@lexical/selection';

// export const TOGGLE_MARK_COMMAND: LexicalCommand<void> = createCommand('TOGGLE_MARK_COMMAND');

// export const MarkPlugin: PluginComponent = () => {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     return mergeRegister(
//       editor.registerCommand(
//         TOGGLE_MARK_COMMAND,
//         () => {
//           const selection = $getSelection();
//           if (!$isRangeSelection(selection)) {
//             return false;
//           }

//           const nodes = selection.getNodes();
//           // Revert to 'some' to detect partial mark selections
//           const hasMark = nodes.some((node) => $isMarkNode(node) || node.getParents().some($isMarkNode));

//           editor.update(() => {
//             if (hasMark) {
//               // Unwrap: Remove mark formatting
//               nodes.forEach((node) => {
//                 if ($isMarkNode(node)) {
//                   const textNode = $createTextNode(node.getTextContent());
//                   node.replace(textNode);
//                   textNode.select(0, textNode.getTextContent().length);
//                 } else if (node.getParents().some($isMarkNode)) {
//                   const markParent = node.getParents().find($isMarkNode);
//                   if (markParent) {
//                     const textNode = $createTextNode(markParent.getTextContent());
//                     markParent.replace(textNode);
//                     textNode.select(0, textNode.getTextContent().length);
//                   }
//                 }
//               });
//             } else {
//               // Wrap: Apply mark formatting
//               const textContent = selection.getTextContent();
//               if (textContent) {
//                 // Use $wrapNodes inside editor.update()
//                 $wrapNodes(selection, () => {
//                   const markNode = $createMarkNode();
//                   markNode.setTextContent(textContent);
//                   return markNode;
//                 });
//                 // Re-select the wrapped node(s)
//                 const newSelection = $getSelection();
//                 if ($isRangeSelection(newSelection)) {
//                   const markNodes = newSelection.getNodes().filter($isMarkNode);
//                   if (markNodes.length > 0) {
//                     const firstMarkNode = markNodes[0];
//                     firstMarkNode.select(0, firstMarkNode.getTextContent().length);
//                   }
//                 }
//               }
//             }
//           });

//           return true;
//         },
//         COMMAND_PRIORITY_EDITOR,
//       ),
//     );
//   }, [editor]);

//   return null;
// };