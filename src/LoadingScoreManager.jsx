import LoadingContainer from './LoadingContainer';
import ScoreContainer from './ScoreContainer';

export default function LoadingScoreManager({
	setLoading,
	isGameEnd,
	points,
	loading,
	setTimerToggle,
	timerToggle
}) {
	if (loading) return <LoadingContainer />;
	return (
		<ScoreContainer
			points={points}
			setLoading={setLoading}
			setTimerToggle={setTimerToggle}
			timerToggle={timerToggle}
		/>
	);
}
