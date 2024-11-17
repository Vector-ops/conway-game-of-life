"use client";

import { ChangeEvent, useEffect, useState } from "react";

const numRows: number = 35;
const numCols: number = 60;

const genEmptyGrid = () => {
	return Array.from({ length: numRows }, () => Array(numCols).fill(0));
};

const createGospersGliderGun = () => {
	const grid = genEmptyGrid();
	grid[5][1] = 1;
	grid[5][2] = 1;
	grid[6][1] = 1;
	grid[6][2] = 1;
	grid[5][11] = 1;
	grid[5][12] = 1;
	grid[6][11] = 1;
	grid[6][12] = 1;
	grid[7][11] = 1;
	grid[8][10] = 1;
	grid[8][11] = 1;
	grid[8][12] = 1;
	grid[7][15] = 1;
	grid[8][15] = 1;
	grid[9][14] = 1;
	grid[9][15] = 1;
	return grid;
};

const createBlinker = () => {
	const grid = genEmptyGrid();
	grid[10][10] = 1;
	grid[10][11] = 1;
	grid[10][12] = 1;
	return grid;
};

const createToad = () => {
	const grid = genEmptyGrid();
	grid[10][10] = 1;
	grid[10][11] = 1;
	grid[10][12] = 1;
	grid[11][9] = 1;
	grid[11][10] = 1;
	grid[11][11] = 1;
	return grid;
};

const createBeacon = () => {
	const grid = genEmptyGrid();
	grid[10][10] = 1;
	grid[10][11] = 1;
	grid[11][10] = 1;
	grid[12][12] = 1;
	grid[12][13] = 1;
	grid[13][12] = 1;
	return grid;
};

const Home = () => {
	const [grid, setGrid] = useState(genEmptyGrid);
	const [running, setRunning] = useState(false);
	const [speed, setSpeed] = useState(100);
	const [patterns, setPatterns] = useState<
		{ name: string; pattern: number[][] }[]
	>([]);
	const [selectedPattern, setSelectedPattern] = useState<string>("");

	useEffect(() => {
		setPatterns([
			{ name: "Gosper's Glider Gun", pattern: createGospersGliderGun() },
			{ name: "Blinker", pattern: createBlinker() },
			{ name: "Toad", pattern: createToad() },
			{ name: "Beacon", pattern: createBeacon() },
		]);
	}, []);

	const loadPattern = (e: ChangeEvent<HTMLSelectElement>) => {
		const patternName = e.target.value;
		setSelectedPattern(patternName);

		const foundPattern = patterns.find(
			(n) => n.name.toLowerCase() === patternName.toLowerCase()
		);

		if (foundPattern) {
			setGrid(foundPattern.pattern);
		} else {
			alert(`No pattern found with the name "${patternName}".`);
		}
	};

	const runSimulation = () => {
		setGrid((prevGrid) => {
			const newGrid = prevGrid.map((arr) => [...arr]);

			for (let row = 0; row < numRows; row++) {
				for (let col = 0; col < numCols; col++) {
					const aliveNeighbors = countAliveNeighbors(
						prevGrid,
						row,
						col
					);

					if (prevGrid[row][col] === 1) {
						if (aliveNeighbors < 2 || aliveNeighbors > 3) {
							newGrid[row][col] = 0;
						}
					} else {
						if (aliveNeighbors === 3) {
							newGrid[row][col] = 1;
						}
					}
				}
			}

			return newGrid;
		});
	};

	const countAliveNeighbors = (
		grid: Array<Array<number>>,
		row: number,
		col: number
	) => {
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				if (i === 0 && j === 0) continue;
				const newRow = row + i;
				const newCol = col + j;
				if (
					newRow >= 0 &&
					newRow < numRows &&
					newCol >= 0 &&
					newCol < numCols &&
					grid[newRow][newCol] === 1
				) {
					count++;
				}
			}
		}
		return count;
	};

	const resetGrid = () => {
		setRunning(false);
		setSelectedPattern("");
		setGrid(genEmptyGrid());
	};

	const setSelectedValue = (e: ChangeEvent<HTMLSelectElement>) => {
		setSpeed(parseInt(e.target.value));
		if (running) {
			setRunning(false);
			setRunning(true);
		}
	};

	useEffect(() => {
		if (running) {
			const interval = setInterval(runSimulation, speed);
			return () => clearInterval(interval);
		}
	}, [running, speed]);

	return (
		<div className="flex flex-col justify-center items-center gap-4 m-10">
			<div className="flex justify-center items-center gap-4">
				<button
					onClick={() => setRunning(!running)}
					className="bg-blue-300 text-black w-20 rounded-lg"
				>
					{running ? "Stop" : "Start"}
				</button>
				<button
					onClick={resetGrid}
					className={`bg-blue-300 text-black w-20 rounded-lg disabled:bg-gray-400`}
				>
					Reset
				</button>
				{/**<input
					type="text"
					placeholder="Pattern name"
					value={patternName}
					onChange={(e) => setPatternName(e.target.value)}
					className="rounded-lg p-1 text-black"
				/>
				<button
					onClick={savePattern}
					className={`bg-blue-300 text-black w-20 rounded-lg disabled:bg-gray-400`}
					disabled={running}
				>
					Save
				</button>**/}
				<select
					name="speed"
					id="speed"
					value={speed}
					onChange={setSelectedValue}
					className="text-black rounded-lg w-15 p-2"
				>
					<option value={100}>100</option>
					<option value={200}>200</option>
					<option value={500}>500</option>
					<option value={1000}>1000</option>
				</select>
				<select
					name="saved patterns"
					id="patterns"
					value={selectedPattern}
					onChange={loadPattern}
					className="text-black rounded-lg w-15 p-2"
				>
					<option value="" disabled>
						Select a pattern
					</option>
					{patterns.map((p, i) => (
						<option value={p.name.toLowerCase()} key={i}>
							{p.name} {/* Displaying actual pattern name */}
						</option>
					))}
				</select>
			</div>
			<div className="flex flex-col justify-center items-center gap-1">
				{grid.map((row, rIndex) => (
					<div
						key={rIndex}
						className="flex justify-center items-center gap-1"
					>
						{row.map((cell: number, cIndex: number) => (
							<div
								key={cIndex}
								className={`h-4 w-4 cursor-pointer ${
									cell === 0 ? "bg-gray-400" : "bg-yellow-300"
								}`}
								onClick={() => {
									const newGrid = grid.map((r, rIdx) =>
										r.map((c: number, cIdx: number) =>
											rIdx === rIndex && cIdx === cIndex
												? c === 1
													? 0
													: 1
												: c
										)
									);
									setGrid(newGrid);
								}}
							></div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
