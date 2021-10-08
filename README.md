Pacman Game containes 2D grid to plot elements in DOM
// 0 -> food
// 1 -> block
// 2 -> villian
// 3 -> player
// 4 -> empty block after consuming food

Blocks and food will be set randomly using Math.random()
DisjointSetUnion data structure is used to ensure there is no food cell packed within block cells so that pacman can eat all foods

DSU ensures they below configuration doesnot happens
1 1 1 1
1 0 0 1
1 1 1 1

Floydwarshall's All source shortest path was used to give villains the intelligence to choose the next step in order to catch the pacman efficiently

You cannot escape from these bots 🤣🤣🤣🤣🤣 Good Luck

After then timer was set for 500ms to deliver next move where user can use keys to change directions of the pacman
