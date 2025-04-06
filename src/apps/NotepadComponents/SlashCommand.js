import { Extension } from "@tiptap/core";
import Suggestion from "@tiptap/extension-suggestion";

export default Extension.create({
    name: "slash-command",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                startOfLine: true,
                command: ({ editor, range, props }) => {
                    props.command({ editor, range });
                },
            },
        };
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            }),
        ];
    },
});
