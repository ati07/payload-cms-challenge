import { createServerFeature, createNode } from '@payloadcms/richtext-lexical';
import { MarkNode } from './nodes/MarkNode';

export const MarkFeature = createServerFeature({
  key: 'mark',
  feature: {
    nodes: [
      createNode({
        node: MarkNode,
        converters: {
          html: {
            converter: ({ node }) => {
              // Use node.text instead of node.getTextContent() for serialized node
              return `<mark>${node.text}</mark>`;
            },
            nodeTypes: [MarkNode.getType()],
          },
        },
      }),
    ],
    ClientFeature: './feature.client#MarkClientFeature',
    i18n: {
      en: {
        label: 'Highlight',
      },
    },
  },
});