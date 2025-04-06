import React, { useState, useEffect } from "react";
import "./App.css";
import Window from "./components/Window";
import logo from "./assets/logo.png";
import notepadIcon from "./assets/notepadIcon.png";
import SimpleSearch from "./components/SearchEngine";
import { IonIcon } from "@ionic/react";
import {
    options as optionsIcon,
    notifications as notificationsIcon,
} from "ionicons/icons";
import Notepad from "./apps/Notepad";

const App = () => {
    const [windows, setWindows] = useState([]);
    const [maximiseCount, setMaximiseCount] = useState(0);

    const openWindow = (
        title = "New Window",
        type = "window",
        icon = "https://placehold.co/50x50",
        children = <div style={{ backgroundColor: "black" }}>something</div>
    ) => {
        let index = -1;
        let latestTime = 0;
        windows.forEach((win, i) => {
            if (win.type === type && win.lastInteraction > latestTime)
                index = i;
        });

        if (index !== -1) {
            setWindows(
                windows.map((win, i) =>
                    i === index
                        ? {
                              ...win,
                              lastInteraction: Date.now(),
                              minimised: !win.minimised,
                          }
                        : win
                )
            );
            return;
        }
        setWindows([
            ...windows,
            {
                id: Date.now(),
                type,
                title,
                minimised: false,
                lastInteraction: Date.now(),
                children,
                icon,
            },
        ]);
    };

    const closeWindow = (id, maximised) => {
        if (maximised) setMaximiseCount(maximiseCount - 1);
        setWindows(windows.filter((win) => win.id !== id));
    };

    const minimiseWindow = (id, maximised) => {
        if (maximised) setMaximiseCount(maximiseCount - 1);
        setWindows(
            windows.map((win) =>
                win.id === id ? { ...win, minimised: true } : win
            )
        );
    };

    const interactWindow = (id) => {
        setWindows(
            windows.map((win) =>
                win.id === id ? { ...win, lastInteraction: Date.now() } : win
            )
        );
    };

    const Taskbar = () => {
        return (
            <div
                className={"taskbar" + (maximiseCount > 0 ? " maximised" : "")}
            >
                <div className="taskbar-app">
                    <img src={logo} alt="icon" />
                </div>
                <div
                    className="taskbar-app"
                    onClick={() =>
                        openWindow(
                            "Notepad",
                            "notepad",
                            notepadIcon,
                            <Notepad />
                        )
                    }
                >
                    <img src={notepadIcon} alt="icon" />
                </div>
            </div>
        );
    };

    const Controls = ({ isHidden }) => {
        return (
            <div
                className={
                    "controls" +
                    (isHidden ? " hidden" : "") +
                    (maximiseCount > 0 ? " maximised" : "")
                }
            >
                <div className="controls-icon">
                    <IonIcon className="icon" icon={optionsIcon} />
                </div>
                <div className="controls-icon">
                    <IonIcon className="icon" icon={notificationsIcon} />
                </div>
            </div>
        );
    };

    return (
        <div className="desktop-container">
            <div className="desktop">
                {windows.map((win) => {
                    return (
                        <Window
                            key={win.id}
                            id={win.id}
                            title={win.title}
                            icon={win.icon}
                            hidden={win.minimised}
                            onClose={closeWindow}
                            onMinimise={minimiseWindow}
                            onInteract={interactWindow}
                            onGlobalMaximise={(id, maximised) => {
                                console.log(id, maximiseCount);
                                if (maximised) {
                                    setMaximiseCount(maximiseCount + 1);
                                } else {
                                    setMaximiseCount(maximiseCount - 1);
                                }
                                console.log(id, maximiseCount);
                            }}
                        >
                            {win.children}
                        </Window>
                    );
                })}
            </div>
            <div
                className={
                    "taskbar-container" +
                    (maximiseCount > 0 ? " maximised" : "")
                }
            >
                <Controls isHidden={true} />
                <Taskbar />
                <Controls isHidden={false} />
            </div>
        </div>
    );
};

export default App;
