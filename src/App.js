// should be set by  createGrid()
// 0 -> food
// 1 -> block
// 2 -> villian
// 3 -> player

// should be set during gameplay
// 4 -> empty block after consuming food
import React, { useEffect, useRef, useState } from 'react';
import DisjointSetUnion from './algorithm/dsu';
import floydWarshall from './algorithm/floydwarshal2D';
import LoadingScoreManager from './LoadingScoreManager';
import PacmanGrid from './PacmanGrid';
import './styles.css';
import _ from 'lodash';

export default function App({ cellSize, villainCount }) {
	const width = Math.floor((window.innerWidth - 30) / cellSize);
	const height = Math.floor((window.innerHeight - 30) / cellSize);
	const [grid, setGrid] = useState([]);
	const [foodsArr, setFoodsArr] = useState([]);
	const [player, setPlayer] = useState([]);
	const [direction, setDirection] = useState([0, 0]);
	const [villains, setVillains] = useState([]);
	const [distObject, setDistObject] = useState({});
	const [loading, setLoading] = useState(true);
	const [isGameEnd, setGameEnd] = useState(false);
	const [maxPoints, setMaxPoints] = useState(0);
	const [points, setPoints] = useState(0);
	const [timerToggle, setTimerToggle] = useState(false);

	const gridRef = useRef(null);

	useEffect(() => {
		if (loading || isGameEnd) return reset();
		return move();
	}, [timerToggle]);

	const reset = () => {
		const {
			newGrid,
			newFoodsArr,
			newPlayer,
			newVillains,
			newMaxPoints
		} = createGrid(height, width);
		const newDistObject = new floydWarshall(newGrid);
		setGrid(newGrid);
		setFoodsArr(newFoodsArr);
		setPlayer(newPlayer);
		setDirection([0, 0]);
		setVillains(newVillains);
		setDistObject(newDistObject);
		setLoading(false);
		setGameEnd(false);
		setMaxPoints(newMaxPoints);
		setPoints(0);
		setTimeout(() => {
			setTimerToggle(!timerToggle);
		}, 500);
	};

	// gives min->max-1
	const createRandomNumber = (min, max) => {
		return Math.max(0, Math.ceil(Math.random() * (max - min) + min) - 1);
	};

	const createGrid = (height, width) => {
		const dsu = new DisjointSetUnion(height, width);

		const isConnected = (i, j, x, y) => {
			const [ri, rj] = dsu.find(i, j);
			const [rx, ry] = dsu.find(x, y);
			return ri === rx && rj === ry;
		};

		// initializing foodsArr and gridsArr
		const newFoodsArr = [];
		const newGrid = [];
		for (let i = 0; i < height; i++) {
			newGrid.push(new Array(width));
			newFoodsArr.push(new Array(width));
		}

		// setting villains and player
		const newPositions = [];
		for (let i = 0; i < villainCount + 1; i++) {
			let row = createRandomNumber(0, height);
			let col = createRandomNumber(0, width);
			while (newGrid[row][col] === 2) {
				row = createRandomNumber(0, height);
				col = createRandomNumber(0, width);
			}
			newGrid[row][col] = 2;
			if (i === villainCount) newGrid[row][col] = 3;
			newPositions.push([row, col]);
		}

		// setting food,blocks
		let newMaxPoints = 0;
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (newGrid[i][j] === 2 || newGrid[i][j] === 3) continue;
				else if (
					i === 0 ||
					i === height - 1 ||
					j === 0 ||
					j === width - 1
				)
					newGrid[i][j] = 0;
				else if (
					(newGrid[i - 1][j - 1] &&
						newGrid[i - 1][j + 1] &&
						isConnected(i - 1, j - 1, i - 1, j + 1)) ||
					(newGrid[i][j - 1] &&
						newGrid[i - 1][j + 1] &&
						isConnected(i, j - 1, i - 1, j + 1))
				)
					newGrid[i][j] = 0;
				else newGrid[i][j] = createRandomNumber(0, 2);

				newFoodsArr[i][j] = true;

				if (newGrid[i][j]) {
					const arr = [
						[i, j - 1],
						[i - 1, j - 1],
						[i - 1, j],
						[i - 1, j + 1]
					];
					for (let each in arr) {
						const [x, y] = arr[each];
						if (newGrid[x][y]) {
							dsu.union(arr[each], [i, j]);
						}
					}
					newFoodsArr[i][j] = false;
				}

				newMaxPoints += newGrid[i][j] ? 0 : 1;
			}
		}

		return {
			newGrid,
			newFoodsArr,
			newPlayer: newPositions[newPositions.length - 1],
			newVillains: newPositions.slice(0, -1),
			newMaxPoints
		};
	};

	const move = () => {
		// deep copy Elementsssss....
		const newGrid = _.cloneDeep(grid);
		const newFoodsArr = _.cloneDeep(foodsArr);
		const newPlayer = player;
		const newVillains = [];
		let newPoints = points;

		// check if player caught by ghost
		for (let each = 0; each < villains.length; each++) {
			if (
				(player[0] === villains[each][0] &&
					player[1] === villains[each][1]) ||
				maxPoints === points
			)
				return setGameEnd(true);
		}

		const checkValidMove = (i, j) =>
			i >= 0 &&
			i < grid.length &&
			j >= 0 &&
			j < grid[0].length &&
			grid[i][j] !== 1 &&
			grid[i][j] !== 2;

		let x = player[0] + direction[0];
		let y = player[1] + direction[1];

		if (checkValidMove(x, y)) {
			if (grid[x][y] === 0) newPoints += 1;
			newGrid[player[0]][player[1]] = 4;
			newGrid[x][y] = 3;

			newFoodsArr[x][y] = false;

			newPlayer[0] = x;
			newPlayer[1] = y;
		}

		for (let each = 0; each < villains.length; each++) {
			const [i, j] = villains[each];
			const [x, y] = distObject.giveNextMove(villains[each], player);

			if (newVillains.length === 0 || grid[x][y] !== 2) {
				newVillains.push([x, y]);
				newGrid[x][y] = 2;
				newGrid[i][j] = newFoodsArr[i][j] ? 0 : 4;
			} else {
				newVillains.push([i, j]);
				newGrid[i][j] = 2;
			}
		}

		gridRef.current.focus();
		setGrid(newGrid);
		setFoodsArr(newFoodsArr);
		setVillains(newVillains);
		setPlayer(newPlayer);
		setPoints(newPoints);

		setTimeout(() => {
			setTimerToggle(!timerToggle);
		}, 500);
	};

	const updatePlayerDirection = (e) => {
		if (e.which === 37) setDirection([0, -1]);
		else if (e.which === 38) setDirection([-1, 0]);
		else if (e.which === 39) setDirection([0, 1]);
		else setDirection([1, 0]);
	};

	return (
		<div className="outer-container">
			{loading || isGameEnd ? (
				<LoadingScoreManager
					points={points}
					reset={reset}
					setLoading={setLoading}
					setTimerToggle={setTimerToggle}
					timerToggle={timerToggle}
					loading={loading}
					isGameEnd={isGameEnd}
				/>
			) : (
				<PacmanGrid
					grid={grid}
					cellSize={cellSize}
					width={width}
					height={height}
					gridRef={gridRef}
					updatePlayerDirection={updatePlayerDirection}
					direction={direction}
				/>
			)}
		</div>
	);
}
