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
