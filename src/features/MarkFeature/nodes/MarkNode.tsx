import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  SerializedTextNode,
} from '@payloadcms/richtext-lexical/lexical';
import {
  $applyNodeReplacement,
  Spread,
  TextNode,
} from '@payloadcms/richtext-lexical/lexical';

// Extend SerializedTextNode to include custom type and version
export type SerializedMarkNode = Spread<
  {
    type: 'mark';
    version: 1;
  },
  SerializedTextNode
>;

export class MarkNode extends TextNode {
  static getType(): string {
    return 'mark';
  }

  static clone(node: MarkNode): MarkNode {
    return new MarkNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedMarkNode): MarkNode {
    const node = $createMarkNode();
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      mark: () => ({
        conversion: $convertMarkElement,
        priority: 1,
      }),
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = document.createElement('mark');
    return element;
  }

  exportDOM(): DOMExportOutput {
    return { element: document.createElement('mark') };
  }

  exportJSON(): SerializedMarkNode {
    return {
      ...super.exportJSON(), // Include all TextNode properties
      type: 'mark',
      version: 1,
    };
  }

  isInline(): true {
    return true;
  }
}

function $convertMarkElement(): DOMConversionOutput {
  return { node: $createMarkNode() };
}

export function $createMarkNode(): MarkNode {
  return $applyNodeReplacement(new MarkNode());
}

export function $isMarkNode(node: LexicalNode | null | undefined): node is MarkNode {
  return node instanceof MarkNode;
}