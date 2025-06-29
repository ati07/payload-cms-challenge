// === File: feature.server.ts ===
import { createServerFeature, createNode } from '@payloadcms/richtext-lexical';
import { FootnoteNode } from './FootnoteNode';

export const FootnoteFeature = createServerFeature({
  key: 'footnote',
  feature: {
    nodes: [
      createNode({
        node: FootnoteNode,
        converters: {
          html: {
            converter: ({ node }) => {
              const footnoteId = node.footnoteId;
              const footnoteContent = node.footnoteContent;
              console.log("node",node)
              const label = node.label ?? '';
              return `<sup><a href="#fn${footnoteId}" id="ref${footnoteId}">${label}</a></sup>`;
            },
            nodeTypes: [FootnoteNode.getType()],
          },
        },
      }),
    ],
    ClientFeature: './feature.client#FootnoteClientFeature',
    i18n: {
      en: {
        label: 'Footnote',
      },
    },
  },
});