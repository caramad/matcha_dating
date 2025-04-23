import React, { useState, useRef } from "react";
import styles from "./DoubleRangeSlider.module.css";

const DoubleRangeSlider = ({ min = 0, max = 100, step = 1, minRange=1 }) => {
	const [value1, setValue1] = useState(min); // Real value, not %
	const [value2, setValue2] = useState(max); // Real value, not %
	const trackRef = useRef(null);
	const activeThumb = useRef(null);

	const handleMouseDown = (thumb) => {
		activeThumb.current = thumb;
		const track = trackRef.current;
		if (!track) return;

		document.body.style.userSelect = "none";

		const onMouseMove = (e) => {
			const rect = track.getBoundingClientRect();
			let rawPos = ((e.clientX - rect.left) / rect.width);
			rawPos = Math.max(0, Math.min(1, rawPos)); // clamp between 0 and 1

			// Convert position [0-1] to real value [18-99]
			let rawValue = min + rawPos * (max - min);

			// Snap to nearest step
			let newValue = Math.round(rawValue / step) * step;

			// Clamp within min and max
			newValue = Math.max(min, Math.min(max, newValue));

			if (activeThumb.current === "thumb1") {
				setValue1(Math.min(newValue, value2 - step * minRange));
			} else if (activeThumb.current === "thumb2") {
				setValue2(Math.max(newValue, value1 + step * minRange));
			}
		};

		const onMouseUp = () => {
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			activeThumb.current = null;
			document.body.style.userSelect = "";
		};

		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
	};

	// Convert a value [18-99] into % position [0-100] for CSS
	const valueToPercent = (value) => ((value - min) / (max - min)) * 100;

	return (
		<div ref={trackRef} className={styles.track}>
			{/* Thumb 1 */}
			<div
				className={styles.thumbWrapper}
				style={{ left: `${valueToPercent(value1)}%` }}
			>
				<div
					className={styles.thumb}
					onMouseDown={() => handleMouseDown("thumb1")}
				></div>
				<div className={styles.valueLabel}>{value1}</div>
			</div>

			{/* Thumb 2 */}
			<div
				className={styles.thumbWrapper}
				style={{ left: `${valueToPercent(value2)}%` }}
			>
				<div
					className={styles.thumb}
					onMouseDown={() => handleMouseDown("thumb2")}
				></div>
				<div className={styles.valueLabel}>{value2}</div>
			</div>



			{/* Range highlight */}
			<div
				className={styles.range}
				style={{
					left: `${valueToPercent(value1)}%`,
					width: `${valueToPercent(value2) - valueToPercent(value1)}%`
				}}
			></div>
		</div>
	);
};

export default DoubleRangeSlider;
