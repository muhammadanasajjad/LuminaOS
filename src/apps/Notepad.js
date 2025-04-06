import { useEditor, EditorContent, FloatingMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import SlashCommand from "./NotepadComponents/commands";
import suggestion from "./NotepadComponents/suggestion";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";

import "./Notepad.css";
import Callout from "./NotepadComponents/Callout";
import Blockquote from "@tiptap/extension-blockquote";

const Notepad = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem,
            Callout,
            Blockquote,
            SlashCommand.configure({ suggestion }),
        ],
        content: "",
    });

    return (
        <div className="notepad">
            <EditorContent editor={editor} />
            <FloatingMenu
                editor={editor}
                tippyOptions={{
                    arrow: false,
                }}
            >
                <div className="floating-menu">Type / for commands</div>
            </FloatingMenu>
        </div>
    );
};

export default Notepad;
