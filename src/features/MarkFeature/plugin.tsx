'use client';
import type { PluginComponent } from '@payloadcms/richtext-lexical';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
  $createTextNode,
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
            const hasMark = nodes.every((node) => $isMarkNode(node) || node.getParents().some($isMarkNode));

            if (hasMark) {
              // Unwrap: Remove mark formatting
              editor.update(() => {
                nodes.forEach((node) => {
                  if ($isMarkNode(node)) {
                    const textNode = $createTextNode(node.getTextContent());
                    node.replace(textNode);
                  }
                });
              });
            } else {
              // Wrap: Apply mark formatting
              editor.update(() => {
                const markNode = $createMarkNode();
                markNode.setTextContent(selection.getTextContent()); // Set text content directly
                selection.insertNodes([markNode]);
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