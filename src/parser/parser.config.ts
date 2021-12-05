export interface ParserConfig {
    doctypeKey?: string;
    tagKey?: string;
    attrsKey?: string;
    contentKey?: string;
    childrenKey?: string;
    rootKey?: string;
    lowerCaseTagsContent?: boolean;
}

export const DEFAULT_CONFIG: ParserConfig = {
    doctypeKey: 'doctype',
    rootKey: 'root',
    tagKey: 'name',
    attrsKey: 'attrs',
    contentKey: 'value',
    childrenKey: 'children',
    lowerCaseTagsContent: true
};
