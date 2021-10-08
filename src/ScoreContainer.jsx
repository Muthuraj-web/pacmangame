import { useState } from 'react';
import './styles.css';

export default function ScoreContainer({
	points,
	loading,
	setLoading,
	setTimerToggle,
	timerToggle
}) {
	const [buttonState, setButtonState] = useState(false);
	return (
		<div>
			<h2>YOUR SCORE........</h2>
			<h5>{points}</h5>
			<button
				disabled={buttonState}
				className="scorecontainer-button"
				onClick={() => {
					setButtonState(true);
					setLoading(true);
					setTimerToggle(!timerToggle);
				}}
			>
				<p>RESET GAME</p>
			</button>
		</div>
	);
}
