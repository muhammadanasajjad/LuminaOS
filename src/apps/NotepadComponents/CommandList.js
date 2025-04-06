import React, { useEffect, useState } from "react";

const CommandList = ({ items, command }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
        const item = items[index];
        if (item) command(item);
    };

    const onKeyDown = ({ event }) => {
        if (event.key === "ArrowUp") {
            setSelectedIndex((i) => (i - 1 + items.length) % items.length);
            return true;
        }

        if (event.key === "ArrowDown") {
            setSelectedIndex((i) => (i + 1) % items.length);
            return true;
        }

        if (event.key === "Enter") {
            selectItem(selectedIndex);
            return true;
        }

        return false;
    };

    // Expose for suggestion.js
    useEffect(() => {
        // set ref for keyboard navigation
        window.commandListRef = { onKeyDown };
        return () => {
            delete window.commandListRef;
        };
    }, [onKeyDown]);

    return (
        <div className="slash-command-menu">
            {items.length ? (
                items.map((item, index) => (
                    <button
                        key={index}
                        className={index === selectedIndex ? "is-selected" : ""}
                        onClick={() => selectItem(index)}
                    >
                        {item.title}
                    </button>
                ))
            ) : (
                <div className="no-result">No result</div>
            )}
        </div>
    );
};

export default CommandList;
