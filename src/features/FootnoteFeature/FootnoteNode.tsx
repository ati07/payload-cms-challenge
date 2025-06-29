// import {
//   $applyNodeReplacement,
//   DOMExportOutput,
//   ElementNode,
//   LexicalNode,
//   SerializedElementNode,
//   Spread,
//   DOMConversionMap,
//   DOMConversionOutput,
//   EditorConfig,
// } from '@payloadcms/richtext-lexical/lexical';

// export type SerializedFootnoteNode = Spread<
//   {
//     type: 'footnote';
//     version: 1;
//     footnoteId: number;
//   },
//   SerializedElementNode
// >;

// export class FootnoteNode extends ElementNode {
//   __footnoteId: number;

//   constructor(footnoteId: number, key?: string) {
//     super(key);
//     this.__footnoteId = footnoteId;
//   }

//   static getType(): string {
//     return 'footnote';
//   }

//   static clone(node: FootnoteNode): FootnoteNode {
//     return new FootnoteNode(node.__footnoteId, node.__key);
//   }

//   createDOM(_config: EditorConfig): HTMLElement {
//     const sup = document.createElement('sup');
//     const anchor = document.createElement('a');
//     anchor.href = `#fn${this.__footnoteId}`;
//     anchor.textContent = `${this.__footnoteId}`;
//     sup.appendChild(anchor);
//     return sup;
//   }

//   updateDOM(): false {
//     return false;
//   }

//   exportDOM(): DOMExportOutput {
//     return {
//       element: this.createDOM({} as EditorConfig),
//     };
//   }

//   exportJSON(): SerializedFootnoteNode {
//     return {
//       ...super.exportJSON(),
//       type: 'footnote',
//       version: 1,
//       footnoteId: this.__footnoteId,
//     };
//   }

//   static importJSON(serializedNode: SerializedFootnoteNode): FootnoteNode {
//     const node = $createFootnoteNode(serializedNode.footnoteId);
//     return node;
//   }

//   static importDOM(): DOMConversionMap | null {
//     return {
//       sup: () => ({
//         conversion: $convertFootnoteElement,
//         priority: 1,
//       }),
//     };
//   }

//   isInline(): true {
//     return true;
//   }
// }

// function $convertFootnoteElement(): DOMConversionOutput {
//   return { node: $createFootnoteNode(Date.now()) }; // fallback unique ID
// }

// export function $createFootnoteNode(id: number): FootnoteNode {
//   return $applyNodeReplacement(new FootnoteNode(id));
// }

// export function $isFootnoteNode(node: LexicalNode | null | undefined): node is FootnoteNode {
//   return node instanceof FootnoteNode;
// }

import {
  $applyNodeReplacement,
  EditorConfig,
  ParagraphNode,
  SerializedParagraphNode,
} from 'lexical';
import {
  
  DOMExportOutput,
  ElementNode,
  LexicalNode,
  SerializedElementNode,
  Spread,
  DOMConversionMap,
  DOMConversionOutput,
  
} from '@payloadcms/richtext-lexical/lexical';

export type SerializedFootnoteNode = Spread<
  {
    type: 'footnote';
    version: 1;
    footnoteId: number;
    footnoteContent: string;
    label: string;
  },
  SerializedElementNode
>;

export class FootnoteNode extends ElementNode {
  __footnoteId: number;
  __footnoteContent: string;
  __label: string;

  constructor(footnoteId: number, content: string, label: string, key?: string) {
    super(key);
    this.__footnoteId = footnoteId;
    this.__footnoteContent = content;
    this.__label = label;
  }

  static getType(): string {
    return 'footnote';
  }

  static clone(node: FootnoteNode): FootnoteNode {
    return new FootnoteNode(
      node.__footnoteId,
      node.__footnoteContent,
      node.__label,
      node.__key
    );
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const sup = document.createElement('sup');
    const anchor = document.createElement('a');
    anchor.href = `#fn${this.__footnoteId}`;
    anchor.textContent = this.__label || `${this.__footnoteId}`;
    anchor.id = `ref${this.__footnoteId}`;
    sup.appendChild(anchor);
    return sup;
  }

  updateDOM(): false {
    return false;
  }

  exportDOM(): DOMExportOutput {
    return {
      element: this.createDOM({} as EditorConfig),
    };
  }

  exportJSON(): SerializedFootnoteNode {
    return {
      ...super.exportJSON(),
      type: 'footnote',
      version: 1,
      footnoteId: this.__footnoteId,
      footnoteContent: this.__footnoteContent,
      label: this.__label,
    };
  }

  static importJSON(serializedNode: SerializedFootnoteNode): FootnoteNode {
    return new FootnoteNode(
      serializedNode.footnoteId,
      serializedNode.footnoteContent,
      serializedNode.label
    );
  }

  static importDOM(): DOMConversionMap | null {
    return {
      sup: () => ({
        conversion: $convertFootnoteElement,
        priority: 1,
      }),
    };
  }

  isInline(): true {
    return true;
  }

  get footnoteId() {
    return this.__footnoteId;
  }

  get footnoteContent() {
    return this.__footnoteContent;
  }

  get label() {
    return this.__label;
  }
}

function $convertFootnoteElement(): DOMConversionOutput {
  return {
    node: $createFootnoteNode(Date.now(), '', ''),
  };
}

export function $createFootnoteNode(
  id: number,
  content: string,
  label: string
): FootnoteNode {
  return $applyNodeReplacement(new FootnoteNode(id, content, label));
}

export function $isFootnoteNode(
  node: LexicalNode | null | undefined
): node is FootnoteNode {
  return node instanceof FootnoteNode;
}


export class CustomParagraphNode extends ParagraphNode {
  static getType() {
    return 'custom-paragraph';
  }
  static clone(node: CustomParagraphNode): CustomParagraphNode {
    return new CustomParagraphNode(node.__key);
  }
  static importJSON(json: SerializedParagraphNode): CustomParagraphNode {
    return $createCustomParagraphNode().updateFromJSON(json);
  }
  createDOM(config: EditorConfig) {
    const el = super.createDOM(config);
    // Normally this sort of thing would be done with the theme, this is for
    // demonstration purposes only
    el.style.border = '1px dashed black';
    el.style.background = 'linear-gradient(to top, #f7f8f8, #acbb78)';
    return el;
  }
}

export function $createCustomParagraphNode() {
  return $applyNodeReplacement(new CustomParagraphNode());
}