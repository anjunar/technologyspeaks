import {AbstractContainerNode, AbstractNode} from "./TreeNode";

export function membrane<E extends AbstractNode>(array : E[], parentContainer : AbstractContainerNode<E>) {
    return new Proxy(array, {

        get<E>(target: E[], p: string | symbol, receiver: any): any {
            switch (p) {
                case "push" : return new Proxy(Reflect.get(target, p, receiver), {
                    apply(target: any, thisArg: any, argArray: any[]): any {
                        for (const arg of argArray) {
                            let parent = arg.parent;
                            if (parent) {
                                let indexOf = parent.children.indexOf(arg);
                                if (indexOf > -1) {
                                    parent.children.splice(indexOf, 1)
                                }
                            }
                            arg.parent = parentContainer
                        }
                        return Reflect.apply(target, thisArg, argArray)
                    }
                })
                case "splice" : return new Proxy(Reflect.get(target, p, receiver), {
                    apply(target: any, thisArg: any, argArray: any[]): any {
                        if (argArray.length === 3) {
                            let parent = argArray[2].parent;
                            if (parent) {
                                let indexOf = parent.children.indexOf(argArray[2]);
                                parent.children.splice(indexOf, 1)
                            }
                            argArray[2].parent = parentContainer
                            return Reflect.apply(target, thisArg, argArray);
                        } else {
                            let apply : any = Reflect.apply(target, thisArg, argArray);
                            apply.parent = null
                            return apply
                        }
                    }
                })
                default : return Reflect.get(target, p, receiver)
            }

        }
    })
}