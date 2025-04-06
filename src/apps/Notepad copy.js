import React, { useState, useCallback, useRef, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";

import "./Notepad.css";

const SLASH_COMMANDS = [
    {
        label: "Heading",
        command: (editor) =>
            editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
        label: "Bullet List",
        command: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        label: "Code Block",
        command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    },
    {
        label: "Paragraph",
        command: (editor) => editor.chain().focus().setParagraph().run(),
    },
];

export default function Notepad() {
    const [slashActive, setSlashActive] = useState(false);
    const [filteredCommands, setFilteredCommands] = useState([]);
    const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const editorRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: false,
                bulletList: false,
                listItem: false,
                codeBlock: false,
                paragraph: false,
            }),
            Heading.configure({ levels: [1, 2] }),
            BulletList,
            ListItem,
            CodeBlock,
            Paragraph,
            Placeholder.configure({
                placeholder: 'Type "/" for commands...',
            }),
        ],
        content: "",
        onUpdate({ editor }) {
            const text = editor.getText();

            // Find the last slash ('/') in the content
            const lastSlashIndex = text.lastIndexOf("/");

            // If no '/' found, hide the menu
            if (lastSlashIndex === -1) {
                setSlashActive(false);
                return;
            }

            // Get the line containing the last '/'
            const lineStart = text.lastIndexOf("\n", lastSlashIndex);
            const lineEnd = text.indexOf("\n", lastSlashIndex);

            const lineText = text.slice(
                lineStart + 1,
                lineEnd === -1 ? text.length : lineEnd
            );

            const lastWord = lineText.split(/\s/).pop();

            // Filter slash commands based on the word after the '/'
            const query = lastWord.slice(1).toLowerCase();
            const matches = SLASH_COMMANDS.filter((cmd) =>
                cmd.label.toLowerCase().includes(query)
            );

            // Get the caret position where the cursor is located
            const { from } = editor.state.selection;
            const caretCoords = editor.view.coordsAtPos(from);

            const containerEl = editorRef.current;
            if (containerEl) {
                const containerBox = containerEl.getBoundingClientRect();
                const relativeTop = caretCoords.top - containerBox.top + 25;
                const relativeLeft = caretCoords.left - containerBox.left;

                setMenuPos({ top: relativeTop, left: relativeLeft });
            }

            setSlashActive(true);
            setFilteredCommands(matches);
            setSelectedIndex(0);
        },
        onTransaction({ transaction }) {
            if (transaction.docChanged) {
                const lastChar = transaction.doc.textBetween(
                    transaction.selection.from - 1,
                    transaction.selection.from,
                    "\n"
                );
                if (lastChar === "\n") {
                    setSlashActive(false);
                }
            }
        },
    });

    const handleKeyDown = useCallback(
        (e) => {
            // Only intercept Enter key if slash menu is active
            if (slashActive) {
                if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev + 1 < filteredCommands.length ? prev + 1 : 0
                    );
                } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) =>
                        prev - 1 >= 0 ? prev - 1 : filteredCommands.length - 1
                    );
                } else if (e.key === "Enter") {
                    e.preventDefault(); // Prevent the default behavior of Enter (new line)
                    // Execute the selected command
                    if (filteredCommands[selectedIndex]) {
                        filteredCommands[selectedIndex].command(editor); // Execute the selected command

                        // Remove the line containing '/'
                        const { from } = editor.state.selection;

                        // Find the start of the line with '/' by getting text before and after the cursor
                        const lineStart = editor.state.doc
                            .textBetween(
                                editor.state.doc.resolve(from).before(),
                                from,
                                "\n"
                            )
                            .lastIndexOf("\n");

                        const lineEnd = editor.state.doc
                            .textBetween(
                                from,
                                editor.state.doc.resolve(from).after(),
                                "\n"
                            )
                            .indexOf("\n");

                        const start = lineStart === -1 ? 0 : lineStart + 1;
                        const end =
                            lineEnd === -1
                                ? editor.state.doc.content.size
                                : lineEnd;

                        // Delete the line
                        editor.chain().focus().deleteRange(start, end).run();

                        setSlashActive(false); // Close the slash menu after executing the command
                    }
                } else if (e.key === "Escape") {
                    setSlashActive(false); // Close the menu if Escape is pressed
                }
            }
        },
        [slashActive, filteredCommands, selectedIndex, editor]
    );

    useEffect(() => {
        const editorEl = editorRef.current;
        if (editorEl) {
            editorEl.addEventListener("keydown", handleKeyDown);
            return () => editorEl.removeEventListener("keydown", handleKeyDown);
        }
    }, [handleKeyDown]);

    return (
        <div className="notepad-container" ref={editorRef}>
            <EditorContent editor={editor} className="notepad-content" />
            {slashActive && (
                <div
                    className="slash-menu"
                    style={{
                        top: `${menuPos.top}px`,
                        left: `${menuPos.left}px`,
                    }}
                >
                    {filteredCommands.map((item, i) => (
                        <div
                            key={i}
                            className={`slash-menu-item ${
                                i === selectedIndex ? "selected" : ""
                            }`}
                            onMouseDown={() => {
                                item.command(editor);
                                setSlashActive(false);
                            }}
                        >
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
