'use client';
import { createClientFeature } from '@payloadcms/richtext-lexical/client';
import { MarkNode, $isMarkNode } from './nodes/MarkNode';
import { MarkPlugin, TOGGLE_MARK_COMMAND } from './plugin';
import { MarkIcon } from './icon';
import { toolbarFormatGroupWithItems } from '@payloadcms/richtext-lexical/client';
import { $isRangeSelection } from '@payloadcms/richtext-lexical/lexical';

export const MarkClientFeature = createClientFeature({
  nodes: [MarkNode],
  plugins: [
    {
      Component: MarkPlugin,
      position: 'normal',
    },
  ],
  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: MarkIcon,
          key: 'mark',
          order: 6, // Between strikethrough (5) and subscript (7)
          label: ({ i18n }) => i18n.t('lexical:mark:label'), // Reference server-side i18n
          isActive: ({ selection }) => {
            if (!$isRangeSelection(selection)) return false;
            const nodes = selection.getNodes();
            return nodes.every((node) => $isMarkNode(node) || node.getParents().some($isMarkNode));
          },
          isEnabled: ({ selection }) => {
            if (!$isRangeSelection(selection)) return false;
            const nodes = selection.getNodes();
            return !nodes.every((node) => $isMarkNode(node) || node.getParents().some($isMarkNode));
          },
          onSelect: ({ editor }) => {
            editor.dispatchCommand(TOGGLE_MARK_COMMAND, undefined);
          },
        },
      ]),
    ],
  },
});


export default MarkClientFeature; // Add default export