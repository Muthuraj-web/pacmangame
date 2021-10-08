export default class floydWarshall {
	constructor(grid) {
		this.numtoGrid = new Map();
		this.gridtonum = new Map();
		this.dp = [];
		this.nextMoveNode = [];

		this.populate(grid);
		this.markNeighbs(grid);
		this.applyAlgorithm();
	}

	isValid(i, j, grid) {
		return i >= 0 && i < grid.length && j >= 0 && j < grid[0].length;
	}

	populate(grid) {
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[0].length; j++) {
				if (grid[i][j] === 1) continue;
				const num = Object.keys(this.numtoGrid).length;
				this.numtoGrid[num] = [i, j];
				this.gridtonum[[i, j]] = num;
			}
		}

		for (let i = 0; i < Object.keys(this.numtoGrid).length; i++) {
			const dpRow = [];
			for (let j = 0; j < Object.keys(this.numtoGrid).length; j++) {
				dpRow.push(i === j ? 0 : Infinity);
			}
			this.dp.push(dpRow);
			this.nextMoveNode.push(new Array(dpRow.length));
		}
	}

	markNeighbs(grid) {
		const directions = [
			[1, 0],
			[0, 1],
			[-1, 0],
			[0, -1]
		];

		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[0].length; j++) {
				if (grid[i][j] === 1) continue;
				const row = this.gridtonum[[i, j]];
				for (let each = 0; each < directions.length; each++) {
					const [x, y] = directions[each];
					if (
						this.isValid(i + x, j + y, grid) &&
						grid[i + x][j + y] !== 1
					) {
						const col = this.gridtonum[[i + x, j + y]];
						this.dp[row][col] = 1;
					}
				}
			}
		}
	}

	applyAlgorithm() {
		for (let k = 0; k < this.dp.length; k++) {
			for (let i = 0; i < this.dp.length; i++) {
				for (let j = 0; j < this.dp.length; j++) {
					if (i === j) continue;
					if (this.dp[i][j] === 1) {
						this.nextMoveNode[i][j] = j;
						continue;
					}
					if (this.dp[i][j] > this.dp[i][k] + this.dp[k][j]) {
						this.dp[i][j] = this.dp[i][k] + this.dp[k][j];
						this.nextMoveNode[i][j] = this.nextMoveNode[i][k];
					}
				}
			}
		}
	}
	giveNextMove(villain, player) {
		const i = this.gridtonum[villain];
		const j = this.gridtonum[player];

		const resultIndex = this.nextMoveNode[i][j];
		return this.numtoGrid[resultIndex];
	}
}
