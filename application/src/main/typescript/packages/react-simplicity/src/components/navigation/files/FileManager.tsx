import "./FileManager.css"
import React, {useEffect, useMemo, useState} from 'react';
import NodeRenderer from './tree/NodeRenderer';

function buildTree(files: FileManager.File[]): FileManager.TreeNode {
    const root: FileManager.TreeNode = {
        name: '/',
        fullName: '/',
        path : "/",
        isFolder: true,
        isOpen: true,
        children: [],
        parent : null
    };

    for (const file of files) {
        const parts = file.name.split('/').filter(Boolean);
        let currentNode = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            const isFolder = i < parts.length - 1;
            const fullPath = parts.slice(0, i + 1).join('/');

            if (!currentNode.children) {
                currentNode.children = [];
            }

            let existing = currentNode.children.find(
                c => c.name === part && c.isFolder === isFolder
            );

            if (!existing) {
                existing = {
                    name: part,
                    fullName: "/" + fullPath,
                    path : isFolder ? "/" + fullPath + "/" : "/" + parts.slice(0, i).join("/") + (parts.length > 1 ? "/" : ""),
                    isFolder,
                    isOpen: false,
                    children: isFolder ? [] : undefined,
                    parent : currentNode
                };
                currentNode.children.push(existing);
            }

            currentNode = existing;
        }
    }

    return root;
}

export function FileManager(properties : FileManager.Attributes) {

    const {files, commands} = properties

    const [tree, setTree] = useState<FileManager.TreeNode>(() => buildTree(files));

    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileManager.TreeNode; }>(null);

    const [open, setOpen] = useState(false)

    function onContextMenu(event : React.MouseEvent, node : FileManager.TreeNode) {
        event.preventDefault()
        event.stopPropagation()
        setOpen(! open)
        setContextMenu({node : node, x : event.clientX, y : event.clientY})
    }

    function onNewFileHandler() {
        commands.onCreate(contextMenu.node.path)
        setOpen(false)
    }

    function onRemoveFileHandler() {
        commands.onRemove(contextMenu.node.fullName)
        let indexOf = contextMenu.node.parent.children.indexOf(contextMenu.node);
        contextMenu.node.parent.children.splice(indexOf, 1)
        setOpen(false)
    }

    useEffect(() => {
        const sorted = [...files].sort((a, b) =>
            a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
        );
        setTree(buildTree(sorted));
    }, [files]);

    useEffect(() => {
        let listener = () => {
            setOpen(false)
        };

        window.addEventListener("click", listener)

        return () => {
            window.removeEventListener("click", listener)
        }
    }, []);

    return (
        <div className="file-manager">
            {
                open && (
                    <div className={"overlay"} style={{top : contextMenu.y, left : contextMenu.x}} onClick={event => event.stopPropagation()}>
                        <button className={"hover"} onClick={() => onNewFileHandler()}>New File</button>
                        <button className={"hover"} onClick={() => onRemoveFileHandler()}>Remove File</button>
                    </div>
                )
            }
            <NodeRenderer node={tree} commands={commands} onContextMenu={onContextMenu}/>
        </div>
    );
}

export namespace FileManager {
    export interface Attributes {
        files: File[];
        commands : Commands
    }

    export interface Commands {
        onRead(file : TreeNode) : void
        onCreate(path : string) : void
        onRemove(fileName : string) : void
    }

    export interface File {
        name: string;
    }

    export interface TreeNode {
        name: string;
        fullName: string;
        path : string;
        isFolder: boolean;
        isOpen: boolean;
        children?: TreeNode[];
        parent : TreeNode
    }
}

export default FileManager;
