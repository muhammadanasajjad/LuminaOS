import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";
import { ReactRenderer } from "@tiptap/react";
import CommandList from "./CommandList";

export default {
    items: ({ query }) => {
        return [
            {
                title: "Heading 1",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 1 })
                        .run();
                },
            },
            {
                title: "Heading 2",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 2 })
                        .run();
                },
            },
            {
                title: "Heading 3",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("heading", { level: 3 })
                        .run();
                },
            },
            {
                title: "Bullet List",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleBulletList()
                        .run();
                },
            },
            {
                title: "Numbered List",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleOrderedList()
                        .run();
                },
            },
            {
                title: "To-do List",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .toggleTaskList()
                        .run();
                },
            },
            {
                title: "Blockquote",
                command: ({ editor, range }) => {
                    editor.chain().focus().toggleBlockquote().run();
                },
            },
            {
                title: "Code Block",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setNode("codeBlock")
                        .run();
                },
            },
            {
                title: "Callout",
                command: ({ editor, range }) => {
                    editor
                        .chain()
                        .focus()
                        .deleteRange(range)
                        .setCallout() // or any emoji you want
                        .run();
                },
            },
        ]
            .filter((item) =>
                item.title.toLowerCase().startsWith(query.toLowerCase())
            )
            .slice(0, 10);
    },

    render: () => {
        let popup;
        let reactRenderer;

        return {
            onStart: (props) => {
                reactRenderer = new ReactRenderer(CommandList, {
                    props,
                    editor: props.editor,
                });

                popup = tippy("body", {
                    theme: "notion",
                    arrow: false,
                    getReferenceClientRect: props.clientRect,
                    appendTo: () => document.body,
                    content: reactRenderer.element,
                    showOnCreate: true,
                    interactive: true,
                    trigger: "manual",
                    placement: "bottom-start",
                });
            },

            onUpdate(props) {
                reactRenderer.updateProps(props);
                popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                });
            },

            onKeyDown(props) {
                return window.commandListRef?.onKeyDown(props);
            },

            onExit() {
                popup[0].destroy();
                reactRenderer.destroy();
            },
        };
    },
};
