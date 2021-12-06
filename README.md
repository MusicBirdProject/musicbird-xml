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
import {parseXml, NodeWrapper} from '@musicbird/xml-parser';

const xmlString = '<SOME XML DOCUMENT>';
const jsonTree: NodeWrapper = parseXml(mainFile, { 
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
export interface ParserConfig {
    doctypeKey?: string;
    tagKey?: string;
    attrsKey?: string;
    contentKey?: string;
    childrenKey?: string;
    rootKey?: string;
    normalize?: boolean;
    lowerCaseTagsContent?: boolean;
    lowerCaseTagsNames?: boolean;
}
```

### Default Config
```ts
export const DEFAULT_CONFIG: ParserConfig = {
    doctypeKey: 'doctype',
    rootKey: 'root',
    tagKey: 'name',
    attrsKey: 'attrs',
    contentKey: 'value',
    childrenKey: 'children',
    normalize: true,
    lowerCaseTagsContent: true,
    lowerCaseTagsNames: false
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
    "name": "Tree",
    "children": [
      {
        "name": "Text",
        "value": "text"
      },
      {
        "name": "CDATA",
        "value": "Text"
      },
      {
        "name": "Empty"
      },
      {
        "name": "SelfClosing",
        "isSelfClosing": true
      },
      {
        "name": "TagWithAttrs",
        "attrs": {
          "id": "0",
          "ref": "test-ref-value",
          "test-attr": "test-attr-value"
        }
      },
      {
        "name": "TagSequence",
        "value": "1"
      },
      {
        "name": "TagSequence",
        "value": "2"
      },
      {
        "name": "TagSequence",
        "value": "3"
      }
    ]
  }
}
```

### Changelog
**2.0.0**
- parser now keeps tags names as is by default (doesn't lowercase it)
- exported ```parser``` method was renamed with ```parseXml```
