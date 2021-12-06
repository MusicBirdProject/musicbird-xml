# MusicBird - XML Parser

Converts XML document into a JSON tree.
Used as a part of a GPX (Guitar Pro 6+ format) files parser in the MusicBird ecosystem.

## Installation
```
yarn add @musicbird/xml-parser
``` 
or 
```
npm install @musicbird/xml-parser
```

## Usage

```ts
import {parse, NodeWrapper} from '@musicbird/xml-parser';

const xmlString = '<SOME XML DOCUMENT>';
const jsonTree: NodeWrapper = parse(mainFile, { 
    // options 
});
```

## Output Data Format
### Wrapper
```ts
interface NodeWrapper {
    root: Node;
}
```
### Node
```ts
interface Node {
    name: string;
    value: string;
    isSelfClosing: boolean;
    attrs: {
        [key: string]: string;
    };
    children: Node[];
}
```

## Config Format

```ts
interface ParserConfig {
    doctypeKey?: string; 
    rootKey?: string;
    tagKey?: string; 
    contentKey?: string;
    attrsKey?: string;
    childrenKey?: string; 
    lowerCaseTagsContent?: boolean;
}
```

### Default Config
```ts
const DEFAULT_CONFIG: ParserConfig = {
    doctypeKey: 'doctype',
    rootKey: 'root',
    tagKey: 'name',
    attrsKey: 'attrs',
    contentKey: 'value',
    childrenKey: 'children',
    lowerCaseTagsContent: true
};
```

## Example
Source:
```xml
<?xml version="1.0" encoding="utf-8"?>
<Tree>
    <Text>Text</Text>
    <CDATA><![CDATA[Text]]></CDATA>
    <Empty></Empty>
    <SelfClosing/>
    <TagWithAttrs
        id="0"
        ref="test-ref-value"
        test-attr="test-attr-value">
    </TagWithAttrs>
    <TagSequence>1</TagSequence>
    <TagSequence>2</TagSequence>
    <TagSequence>3</TagSequence>
</Tree>
```
Output:
```json
{
  "root": {
    "name": "tree",
    "children": [
      {
        "name": "text",
        "value": "text"
      },
      {
        "name": "cdata",
        "value": "Text"
      },
      {
        "name": "empty"
      },
      {
        "name": "selfclosing",
        "isSelfClosing": true
      },
      {
        "name": "tagwithattrs",
        "attrs": {
          "id": "0",
          "ref": "test-ref-value",
          "test-attr": "test-attr-value"
        }
      },
      {
        "name": "tagsequence",
        "value": "1"
      },
      {
        "name": "tagsequence",
        "value": "2"
      },
      {
        "name": "tagsequence",
        "value": "3"
      }
    ]
  }
}
```