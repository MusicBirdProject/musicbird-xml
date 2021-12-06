import { Node } from './parser/node.interface';

export { xmlParser as parse } from './parser/parser';
export class NodeModel implements Node {
    name;
    value;
    isSelfClosing;
    attrs;
    children;

    constructor(node) {
        this.name = node.name;
        this.attrs = node.attrs;
        this.value = node.value;
        this.isSelfClosing = node.isSelfClosing;
        this.children = node.children;
    }

    findNode(nodeName): Node {
        return this.children.find((node: Node) => node.name == nodeName);
    }

    getChildValue(nodeName) {
        const node = this.findNode(nodeName);

        if (node && node.value != null) {
            return node.value;
        }

        return void 0;
    }
}