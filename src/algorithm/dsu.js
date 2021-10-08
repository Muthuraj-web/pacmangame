class DisjointSetUnion {
	constructor(height, width) {
		this.height = height;
		this.width = width;

		this.root = [];
		this.rank = [];

		for (let i = 0; i < height; i++) {
			const colArr = [];
			const rankArr = [];

			for (let j = 0; j < width; j++) {
				colArr.push([i, j]);
				rankArr.push(0);
			}

			this.root.push(colArr);
			this.rank.push(rankArr);
		}
	}

	find(i, j) {
		if (this.root[i][j][0] === i && this.root[i][j][1] === j)
			return [...this.root[i][j]];
		this.root[i][j] = this.find(this.root[i][j][0], this.root[i][j][1]);
		return this.root[i][j];
	}

	union(node1, node2) {
		const [i, j] = node1;
		const [x, y] = node2;

		const root1 = this.find(i, j);
		const root2 = this.find(x, y);

		const [ri, rj] = root1;
		const [rx, ry] = root2;

		if (ri === rx && rj === ry) return;
		if (this.rank[ri][rj] < this.rank[rx][ry]) {
			this.root[ri][rj] = [...root2];
		} else if (this.rank[ri][rj] > this.rank[rx][ry]) {
			this.root[rx][ry] = [...root1];
		} else {
			this.root[ri][rj] = [...root2];
			this.rank[rx][ry] += 1;
		}
	}
}

export default DisjointSetUnion;
