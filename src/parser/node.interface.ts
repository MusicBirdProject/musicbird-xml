export interface NodeWrapper {
    root: Node;
}

export interface Node {
    name: string;
    value: string;
    isSelfClosing: boolean;
    attrs: {
        [key: string]: string;
    };
    children: Node[];
}
