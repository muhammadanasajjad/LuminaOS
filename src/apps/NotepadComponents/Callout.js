import React, { useEffect, useRef, useState } from "react";
import { Node, mergeAttributes } from "@tiptap/core";
import {
    NodeViewWrapper,
    NodeViewContent,
    ReactNodeViewRenderer,
} from "@tiptap/react";
import EmojiPicker from "emoji-picker-react";
import "./Callout.css";

export const Callout = Node.create({
    name: "callout",

    group: "block",
    content: "block+",
    defining: true,

    addAttributes() {
        return {
            imageUrl: {
                default:
                    "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f4a1.png",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="callout"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            mergeAttributes(HTMLAttributes, {
                "data-type": "callout",
                class: "callout",
            }),
            0,
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(({ node, updateAttributes }) => {
            const { imageUrl } = node.attrs;
            const [showPicker, setShowPicker] = useState(false);

            const handleEmojiClick = (emojiData) => {
                if (emojiData.imageUrl) {
                    updateAttributes({ imageUrl: emojiData.imageUrl });
                }
                setShowPicker(false);
            };

            return (
                <NodeViewWrapper className="callout">
                    <div
                        className="callout-emoji"
                        onClick={() => setShowPicker(!showPicker)}
                        title="Click to change emoji"
                    >
                        <img src={imageUrl} alt="emoji" />
                    </div>
                    {showPicker && (
                        <>
                            <div
                                contentEditable={false}
                                className="callout-overlay"
                                onClick={() => setShowPicker(false)}
                            ></div>
                            <div className="callout-picker">
                                <EmojiPicker
                                    onEmojiClick={handleEmojiClick}
                                    autoFocusSearch={false}
                                />
                            </div>
                        </>
                    )}

                    <div className="callout-content">
                        <NodeViewContent as="div" />
                    </div>
                </NodeViewWrapper>
            );
        });
    },

    addCommands() {
        return {
            setCallout:
                (attributes = {}) =>
                ({ commands }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: attributes,
                        content: [
                            {
                                type: "paragraph",
                                content: [],
                            },
                        ],
                    });
                },
        };
    },
});

export default Callout;
