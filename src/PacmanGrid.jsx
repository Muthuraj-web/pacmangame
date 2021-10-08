import React from 'react';
import './styles.css';

export default function PacmanGrid({
	grid,
	gridRef,
	updatePlayerDirection,
	cellSize,
	width,
	height,
	direction
}) {
	const giveRotationClass = () => {
		if (
			(direction[0] === 0 && direction[1] === 0) ||
			(direction[0] === 0 && direction[1] === 1)
		)
			return ' ';
		if (direction[0] === 0 && direction[1] === -1)
			return 'pacman-player-left';
		if (direction[0] === -1 && direction[1] === 0)
			return 'pacman-player-top';
		return 'pacman-player-bottom';
	};
	const defaultStyle = { width: cellSize, height: cellSize };
	let keyIndex = grid.length;

	const checkValidCell = (i, j) => {
		return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
	};

	const blockBorders = (i, j) => {
		const bordersStyle = [];
		const left = 'pacman-block-left';
		const right = 'pacman-block-right';
		const top = 'pacman-block-top';
		const bottom = 'pacman-block-bottom';

		if (checkValidCell(i - 1, j) && grid[i - 1][j] !== 1)
			bordersStyle.push(top);
		if (checkValidCell(i + 1, j) && grid[i + 1][j] !== 1)
			bordersStyle.push(bottom);
		if (checkValidCell(i, j - 1) && grid[i][j - 1] !== 1)
			bordersStyle.push(left);
		if (checkValidCell(i, j + 1) && grid[i][j + 1] !== 1)
			bordersStyle.push(right);

		return bordersStyle.join(' ');
	};
	return (
		<div
			className="pacman-container"
			ref={gridRef}
			onKeyDown={(e) => {
				updatePlayerDirection(e);
			}}
			tabIndex={-1}
		>
			{grid.map((row, row_idx) => {
				return (
					<div key={row_idx} className="pacman-row">
						{row.map((col, col_idx) => {
							if (grid[row_idx][col_idx] === 1) {
								return (
									<div
										key={keyIndex++}
										className={`pacman-block ${blockBorders(
											row_idx,
											col_idx
										)}`}
										style={{ ...defaultStyle }}
									/>
								);
							}
							if (grid[row_idx][col_idx] === 0) {
								return (
									<div
										key={keyIndex++}
										style={{ ...defaultStyle }}
									>
										<div className="pacman-food">*</div>
									</div>
								);
							}
							if (grid[row_idx][col_idx] === 2) {
								return (
									<div
										key={keyIndex++}
										style={{ ...defaultStyle }}
									>
										<img
											alt="pacman-ghost"
											src={
												process.env.PUBLIC_URL +
												'/pacman-ghost.webp'
											}
											style={{ ...defaultStyle }}
										/>
									</div>
								);
							}
							if (grid[row_idx][col_idx] === 3) {
								return (
									<div
										key={keyIndex++}
										style={{ ...defaultStyle }}
									>
										<img
											alt="pacman-player"
											className={`pacman-player ${giveRotationClass()}`}
											src={
												process.env.PUBLIC_URL +
												'/pacman-player.webp'
											}
											style={{ ...defaultStyle }}
										/>
									</div>
								);
							}
							return (
								<div
									className="pacman-empty"
									key={keyIndex++}
									style={defaultStyle}
								/>
							);
						})}
					</div>
				);
			})}
		</div>
	);
}
