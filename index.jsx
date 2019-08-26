import React, { useState, Fragment, useRef } from 'react';
import { render } from 'react-dom';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default function App() {
    const canvas = useRef();
    const [actualCircle, setActualCircle] = useState({});
    const [circles, setCircles] = useState([]);
    const [isCommenting, setIsCommenting] = useState(false);
    const [textInput, setTextInput] = useState("Comentário sobre as plantas.");

    const setPoint = ({ clientX, clientY }) => {
        const ctx = canvas.current.getContext("2d");
        const [x, y] = [clientX, clientY];
        if (circles.some(circle => isIntersection({ x, y }, circle))) return;

        ctx.beginPath();
        ctx.arc(x, y, 30, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
        setActualCircle({ x, y, radius: 30, color: "green", comment: "" });
        setIsCommenting(true);
    }

    const isIntersection = (point, circle) => {
        return Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) < (circle.radius * 2);
    }

    const handleClose = () => {
        setCircles([...circles, { ...actualCircle, comment: textInput }]);
        setIsCommenting(false);
    }

    const handleChange = ({ target }) => {
        setTextInput(target.value);
    }

    return (
        <Fragment>
            <canvas id="myCanvas" ref={canvas} className="canvas-bg" width="1200" height="800" onClick={setPoint}></canvas>

            <Dialog aria-labelledby="simple-dialog-title" open={isCommenting}>
                <DialogTitle>Comentário</DialogTitle>
                <DialogContent>
                    <TextField
                        label=""
                        multiline
                        rowsMax="4"
                        value={textInput}
                        onChange={handleChange}
                        margin="normal"
                    />

                    <br />

                    <Button variant="contained" onClick={handleClose}>
                        Salvar
                    </Button>
                </DialogContent>
            </Dialog>
        </Fragment>

    );
}

render(<App />, document.getElementById("root"));