// https://leetcode.com/problems/shortest-path-to-get-all-keys/
// solution with DFS - slowest
function shortestPathAllKeys_my_implementation(grid: string[]): number {
  if (grid.length === 0) return 0;

  const rLen = grid.length;
  const cLen = grid[0].length;

  let keyCount = 0;
  let startPos: [number, number] = [0, 0];
  for (let i = 0; i < rLen; i++) {
    for (let j = 0; j < cLen; j++) {
      const cur = grid[i][j];
      if (cur === '@') {
        startPos = [i, j];
      }

      if (cur.charAt(0) >= 'a'.charAt(0) && cur.charAt(0) <= 'z'.charAt(0)) {
        ++keyCount;
      }
    }
  }

  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  const visited = new Set<string>();
  let res = Infinity;
  function dfs(
    r: number,
    c: number,
    curKeysSet: Set<string>,
    pathLength: number,
  ) {
    const cur = grid[r][c];

    if (cur.charAt(0) >= 'a'.charAt(0) && cur.charAt(0) <= 'z'.charAt(0)) {
      curKeysSet.add(cur.toUpperCase());
    }

    if (curKeysSet.size === keyCount) {
      res = Math.min(res, pathLength);
      return;
    }

    if (
      cur.charAt(0) >= 'A'.charAt(0) &&
      cur.charAt(0) <= 'Z'.charAt(0) &&
      !curKeysSet.has(cur)
    ) {
      return;
    }

    // NOTE:
    // this is not as same as
    // const state = `${r},${c},${Array.from(curKeysSet).sort().join()},${pathLength}`;
    // do not add pathlength, coz it will lead to call stack overflow
    //
    // also never have the visited node check before the return statement
    // coz if you see after the below for loop we are removing the visited node
    // so if this visited node was before those above return checks
    // then the value added to the visited nodes will be stuck and we new path
    // which might be smaller will never be checked
    const state = `${r},${c},${Array.from(curKeysSet).sort().join()}`;
    if (visited.has(state)) {
      return;
    }
    visited.add(state);

    for (let i = 0; i < directions.length; i++) {
      const [dr, dc] = directions[i];
      const nR = r + dr;
      const nC = c + dc;

      if (
        nR >= 0 &&
        nR < rLen &&
        nC >= 0 &&
        nC < cLen &&
        grid[nR][nC] !== '#'
      ) {
        dfs(nR, nC, new Set(curKeysSet), pathLength + 1);
      }
    }

    // this is way better than, coz using pathlength leads to call stack overflow
    // const state = `${r},${c},${Array.from(curKeysSet).sort().join()},${pathLength}`;
    visited.delete(state); // backtrack
  }

  dfs(...startPos, new Set<string>(), 0);

  return res === Infinity ? -1 : res;
}

// console.log(shortestPathAllKeys_my_implementation(['@..aA', '...#B', '....b']));
console.log(shortestPathAllKeys_my_implementation(['@a.', '#.A', 'b.B']));

// solution with BFS - medium, fastest is with bit mask
function shortestPathAllKeys_bfs(grid: string[]): number {
  const m = grid.length,
    n = grid[0].length;
  const directions = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  let startX = 0,
    startY = 0;
  let totalKeys = new Set<string>();

  // Find start position and count keys
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '@') {
        startX = i;
        startY = j;
      } else if (grid[i][j] >= 'a' && grid[i][j] <= 'f') {
        totalKeys.add(grid[i][j]);
      }
    }
  }

  const queue: [number, number, Set<string>][] = [[startX, startY, new Set()]];
  const seen = new Set<string>();
  let steps = 0;

  while (queue.length) {
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [x, y, keys] = queue.shift()!;
      if (keys.size === totalKeys.size) return steps;

      for (const [dx, dy] of directions) {
        const nx = x + dx,
          ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= m || ny >= n || grid[nx][ny] === '#')
          continue;

        const newKeys = new Set(keys);
        const cell = grid[nx][ny];

        if (cell >= 'a' && cell <= 'f') newKeys.add(cell);
        if (cell >= 'A' && cell <= 'F' && !newKeys.has(cell.toLowerCase()))
          continue;

        const state = `${nx},${ny},${Array.from(newKeys).sort().join('')}`;
        if (!seen.has(state)) {
          seen.add(state);
          queue.push([nx, ny, newKeys]);
        }
      }
    }

    steps++;
  }
  return -1;
}
