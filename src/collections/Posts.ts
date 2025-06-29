import { CollectionConfig } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { MarkFeature } from '../features/MarkFeature/feature.server';
import { FootnoteFeature } from '../features/FootnoteFeature/feature.server'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, MarkFeature(),FootnoteFeature()]
      }),
      required: true,
    },
  ],
};