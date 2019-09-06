import React, { useState, useRef, useEffect } from "react";
import { render } from "react-dom";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default function App() {
	const canvas = useRef();
	const [actualCircle, setActualCircle] = useState({});
	const [circles, setCircles] = useState([]);
	const [isCommenting, setIsCommenting] = useState(false);
	const [textInput, setTextInput] = useState("");
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleCanvasClick = ({ clientX, clientY }) => {
		const ctx = canvas.current.getContext("2d");
		const [x, y] = [clientX, clientY];
		const foundIndex = circles.findIndex(circle =>
			isIntersection({ x, y }, circle, 1)
		);

		if (foundIndex >= 0) {
			setTextInput(circles[foundIndex].comment);
			setActualCircle({ ...circles[foundIndex], index: foundIndex });
			return setIsCommenting(true);
		}

		if (circles.some(circle => isIntersection({ x, y }, circle))) return;

		ctx.beginPath();
		ctx.arc(x, y, 30, 0, 2 * Math.PI);
		ctx.fillStyle = getRandomColor();
		ctx.fill();
		setActualCircle({ x, y, radius: 30, color: ctx.fillStyle, comment: "" });
		setIsCommenting(true);
	};

	const isIntersection = (point, circle, range = 2.2) =>
		Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) <
		circle.radius * range;

	const handleClose = () => {
		let aux = [...circles];
		if (actualCircle.hasOwnProperty("index")) {
			aux.splice(actualCircle.index, 1, {
				...actualCircle,
				comment: textInput
			});
			Reflect.deleteProperty(aux, "index");
		} else {
			aux = [...circles, { ...actualCircle, comment: textInput }];
		}
		setCircles(aux);
		setIsCommenting(false);
		setTextInput("");
	};

	const handleChange = ({ target }) => setTextInput(target.value);

	const getRandomColor = () => {
		let letters = "0123456789ABCDEF";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	};

	const handleMouseMove = ({ x, y }) => setMousePosition({ x, y });

	useEffect(() => {
		canvas.current.addEventListener("mousemove", handleMouseMove);

		return () => {
			canvas.current.removeEventListener("mousemove", handleMouseMove);
		};
	}, []);

	return (
		<div>
			<canvas
				id="myCanvas"
				ref={canvas}
				className="canvas-bg"
				onClick={handleCanvasClick}
				width="1200"
				height="800"
				style={{
					cursor:
						circles.some(circle => isIntersection(mousePosition, circle, 1)) &&
						"pointer"
				}}
			></canvas>

			<Dialog
				aria-labelledby="simple-dialog-title"
				open={isCommenting}
				fullWidth
				maxWidth="sm"
			>
				<DialogTitle>
					{!actualCircle.hasOwnProperty("index")
						? "Adicionar comentário"
						: "Editar comentário"}
				</DialogTitle>

				<DialogContent>
					<TextField
						id="outlined-multiline-static"
						label="Descrição do comentário"
						multiline
						rows="4"
						margin="normal"
						variant="outlined"
						value={textInput}
						onChange={handleChange}
						fullWidth
					/>
				</DialogContent>

				<Button
					variant="contained"
					onClick={handleClose}
					disabled={!textInput}
					color="primary"
				>
					Salvar
				</Button>
			</Dialog>
		</div>
	);
}

render(<App />, document.getElementById("root"));
