import React from "react";
import { Rnd } from "react-rnd";
import "./Window.css";
import { IonIcon } from "@ionic/react";
import {
    close as closeIcon,
    browsersOutline as browsersIcon,
    remove as removeIcon,
} from "ionicons/icons";

const Window = ({
    id,
    title,
    icon,
    onClose = () => {},
    onMinimise = () => {},
    onInteract = () => {},
    onGlobalMaximise = () => {},
    hidden = false,
    children = <></>,
}) => {
    const [maximised, setMaximised] = React.useState(false);
    const RndRef = React.useRef(null);
    const [oldSize, setOldSize] = React.useState({
        width: "50%",
        height: "50%",
    });
    const [oldPosition, setOldPosition] = React.useState({ x: 200, y: 200 });

    const onMaximise = (shouldMaximise = !maximised) => {
        onGlobalMaximise(id, shouldMaximise);
        if (RndRef) {
            if (!shouldMaximise) {
                RndRef.current.updateSize({
                    width: oldSize.width,
                    height: oldSize.height,
                });
                RndRef.current.updatePosition({
                    x: oldPosition.x,
                    y: oldPosition.y,
                });
            } else {
                RndRef.current.updateSize({ width: "100%", height: "100%" });
                RndRef.current.updatePosition({ x: 0, y: 0 });
            }
        }
        setMaximised(shouldMaximise);
    };

    return (
        <Rnd
            ref={RndRef}
            default={{
                x: 200,
                y: 200,
                width: "50%",
                height: "50%",
            }}
            minWidth={200}
            minHeight={150}
            bounds="parent"
            className="window"
            onMouseDown={() => onInteract(id)}
            onResize={(a, b, ref, d, position) => {
                setOldSize({
                    width: ref.offsetWidth,
                    height: ref.offsetHeight,
                });
                setOldPosition({ x: position.x, y: position.y });
                // onMaximise(false);
            }}
            onDrag={(e) => {
                setOldPosition({ x: e.x, y: e.y });
            }}
            dragHandleClassName="title-bar"
            style={hidden ? { display: "none" } : {}}
        >
            <div className="title-bar">
                <div className="title-container">
                    <img src={icon} alt="icon" />
                    <p>{title}</p>
                </div>
                <div className="window-controls">
                    <div
                        className="minimise"
                        onClick={() => onMinimise(id, maximised)}
                    >
                        <IonIcon icon={removeIcon} />
                    </div>
                    <div className="maximise" onClick={() => onMaximise()}>
                        <IonIcon icon={browsersIcon} />
                    </div>
                    <div
                        className="close"
                        onClick={() => onClose(id, maximised)}
                    >
                        <IonIcon icon={closeIcon} />
                    </div>
                </div>
            </div>
            <div className="content">{children}</div>
        </Rnd>
    );
};

export default Window;
