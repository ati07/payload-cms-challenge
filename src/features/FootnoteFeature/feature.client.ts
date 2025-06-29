'use client';
import { createClientFeature } from '@payloadcms/richtext-lexical/client';
import { FootnoteNode } from './FootnoteNode';
import { FootnotePlugin, INSERT_FOOTNOTE_COMMAND } from './plugin';
import { FootnoteIcon } from './icon';
import { toolbarFormatGroupWithItems } from '@payloadcms/richtext-lexical/client';

export const FootnoteClientFeature = createClientFeature({
  nodes: [FootnoteNode],
  plugins: [
    {
      Component: FootnotePlugin,
      position: 'normal',
    },
  ],
  toolbarInline: {
    groups: [
      toolbarFormatGroupWithItems([
        {
          ChildComponent: FootnoteIcon,
          key: 'footnote',
          order: 7, // Replace superscript position
          label: ({ i18n }) => i18n.t('lexical:footnote:label'),
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_FOOTNOTE_COMMAND, undefined);
          },
        },
      ]),
    ],
  },
//   i18n: {
//     en: {
//       label: 'Footnote',
//     },
//   },
});