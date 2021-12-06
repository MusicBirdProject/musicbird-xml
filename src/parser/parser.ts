const sax = require('sax');

import { ParserConfig, DEFAULT_CONFIG } from './parser.config';
import { NodeWrapper } from './node.interface';

export function xmlParser(data: string = '', userConfig: ParserConfig = {}): NodeWrapper {
    const config: ParserConfig = {
        ...DEFAULT_CONFIG,
        ...userConfig
    };

    const strict = !config.lowerCaseTagsNames;
    const parser = sax.parser(strict, {
        trim: true,
        normalize: config.normalize,
        lowercase: config.lowerCaseTagsNames
    });

    let stack = [];
    let currentElement = null;
    let result = {};

    const eventHandlers = {
        ondoctype: handleDoctype,
        onopentag: handleOpenTag,
        onclosetag: handleCloseTag,
        ontext: handleText,
        oncdata: handleCData,
        onclosecdata: handleCloseCData,
        onerror: handleError,
        // onend: handleEnd
    };

    Object.assign(parser, eventHandlers);
    parser.write(data).close();

    return <NodeWrapper>result;

    /// -- Event Handlers

    function handleDoctype(doctype) {
        const {doctypeKey} = config;
        const parts = doctype.trim().match(/(\"[^\"]+\")|([^\s]+)/gi);

        result[doctypeKey] = parts;
    }

    function handleOpenTag(node) {
        const {name, attributes} = node;
        const {tagKey, childrenKey, attrsKey, rootKey} = config;
        const element = {
            [tagKey]: name
        };

        if (this.tag.isSelfClosing) {
            element.isSelfClosing = true;
        }

        if (Object.keys(attributes).length) {
            element[attrsKey] = attributes;
        }

        if (!currentElement) { // handle root element
            return result[rootKey || name] = currentElement = element;
        }

        if (currentElement[childrenKey] == null)
            currentElement[childrenKey] = [];

        stack.push(currentElement);
        currentElement[childrenKey].push(currentElement = element);
    }

    function handleCloseTag(name: string) {
        currentElement = stack.pop();
    }

    function handleText(text: string) {
        if (!currentElement) return;

        const safeValue = config.lowerCaseTagsContent
            ? text.trim().toLowerCase()
            : text.trim();

        if (safeValue) {
            currentElement[config.contentKey] = safeValue;
        } else {
            currentElement[config.contentKey] = null;
        }
    }

    function handleCData(cdata: string) {
        if (!currentElement) return;

        const safeValue = cdata.trim();
        if (safeValue) {
            currentElement[config.contentKey] = safeValue;
        }
    }

    function handleCloseCData() {
        if (currentElement[config.contentKey] == undefined) {
            currentElement[config.contentKey] = null;
        }
    }

     function handleError(e) {
        console.error(e);
     }

    // function handleEnd() {
    //     // console.info('result:', JSON.stringify(result));
    // }
}