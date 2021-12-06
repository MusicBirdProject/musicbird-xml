'use strict';

var fs = require('fs');

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n["default"] = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespace(fs);

var cli = require('caporal');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var DEFAULT_CONFIG = {
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

var sax = require('sax');
function xmlParser(data, userConfig) {
    if (data === void 0) { data = ''; }
    if (userConfig === void 0) { userConfig = {}; }
    var config = __assign(__assign({}, DEFAULT_CONFIG), userConfig);
    var strict = !config.lowerCaseTagsNames;
    var parser = sax.parser(strict, {
        trim: true,
        normalize: config.normalize,
        lowercase: config.lowerCaseTagsNames
    });
    var stack = [];
    var currentElement = null;
    var result = {};
    var eventHandlers = {
        ondoctype: handleDoctype,
        onopentag: handleOpenTag,
        onclosetag: handleCloseTag,
        ontext: handleText,
        oncdata: handleCData,
        onclosecdata: handleCloseCData,
        onerror: handleError
    };
    Object.assign(parser, eventHandlers);
    parser.write(data).close();
    return result;
    /// -- Event Handlers
    function handleDoctype(doctype) {
        var doctypeKey = config.doctypeKey;
        var parts = doctype.trim().match(/(\"[^\"]+\")|([^\s]+)/gi);
        result[doctypeKey] = parts;
    }
    function handleOpenTag(node) {
        var _a;
        var name = node.name, attributes = node.attributes;
        var tagKey = config.tagKey, childrenKey = config.childrenKey, attrsKey = config.attrsKey, rootKey = config.rootKey;
        var element = (_a = {},
            _a[tagKey] = name,
            _a);
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
    function handleCloseTag(name) {
        currentElement = stack.pop();
    }
    function handleText(text) {
        if (!currentElement)
            return;
        var safeValue = config.lowerCaseTagsContent
            ? text.trim().toLowerCase()
            : text.trim();
        if (safeValue) {
            currentElement[config.contentKey] = safeValue;
        }
        else {
            currentElement[config.contentKey] = null;
        }
    }
    function handleCData(cdata) {
        if (!currentElement)
            return;
        var safeValue = cdata.trim();
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

cli.command('parse', 'Parse XML into JSON tree').alias('p')
    .argument('<source-file>', 'Source XML file')
    .argument('<target-file>', 'Target JSON file')
    .action(function (args, options, logger) {
    var source = fs__namespace.readFileSync(args.sourceFile);
    var parsed = xmlParser(source.toString());
    fs__namespace.writeFileSync(args.targetFile, JSON.stringify(parsed));
    logger.log("".concat(args.sourceFile, " was parsed into a ").concat(args.targetFile));
});

///
cli.version('0.0.1').parse(process.argv);
