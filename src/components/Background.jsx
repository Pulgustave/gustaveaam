import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

const Background = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            let cols, rows;
            const w = 14; // Cellular automata grid scale
            let board = [];
            let next = [];
            let colorIndex = [];
            let palette = [];

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight).parent(containerRef.current);
                cols = p.floor(p.width / w);
                rows = p.floor(p.height / w);
                board = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
                next = new Array(cols).fill(0).map(() => new Array(rows).fill(0));
                colorIndex = new Array(cols).fill(0).map(() => new Array(rows).fill(0));

                // Terminal simulation palette: mostly green, occasional magenta glitch
                palette = [
                    p.color(57, 255, 20, 70),  // green
                    p.color(57, 255, 20, 70),  // green
                    p.color(57, 255, 20, 70),  // green
                    p.color(57, 255, 20, 70),  // green
                    p.color(57, 255, 20, 70),  // green
                    p.color(57, 255, 20, 70),  // green
                    p.color(57, 255, 20, 70),  // green
                    p.color(255, 46, 151, 70), // magenta (glitch cell, ~1 in 8)
                ];

                // Randomly seed life
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        board[i][j] = p.random() > 0.94 ? 1 : 0;
                        colorIndex[i][j] = p.floor(p.random(palette.length));
                    }
                }

                p.frameRate(10); // Standard readable game of life speed
                p.noStroke();
            };

            p.draw = () => {
                p.clear();

                // Draw active cells as soft, colorful blocks
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        if (board[i] && board[i][j] === 1) {
                            p.fill(palette[colorIndex[i][j]]);
                            // Sub-pixel padding to look technical
                            p.rect(i * w + 1, j * w + 1, w - 2, w - 2, 4);
                        }
                    }
                }

                // Cellular Automata evaluation
                for (let x = 0; x < cols; x++) {
                    for (let y = 0; y < rows; y++) {
                        let neighbors = 0;
                        for (let i = -1; i <= 1; i++) {
                            for (let j = -1; j <= 1; j++) {
                                let col = (x + i + cols) % cols;
                                let row = (y + j + rows) % rows;
                                if (board[col] && board[col][row] !== undefined) {
                                    neighbors += board[col][row];
                                }
                            }
                        }
                        if (board[x] && board[x][y] !== undefined) {
                            neighbors -= board[x][y];

                            // Standard Conway transition rules
                            if ((board[x][y] === 1) && (neighbors < 2)) next[x][y] = 0;
                            else if ((board[x][y] === 1) && (neighbors > 3)) next[x][y] = 0;
                            else if ((board[x][y] === 0) && (neighbors === 3)) {
                                next[x][y] = 1;
                                colorIndex[x][y] = p.floor(p.random(palette.length));
                            }
                            else next[x][y] = board[x][y];
                        }
                    }
                }

                // Propagate forward
                let temp = board;
                board = next;
                next = temp;

                // Mouse Drag / Move Interaction
                if (p.mouseIsPressed || (p.mouseX !== p.pmouseX && p.mouseY !== p.pmouseY)) {
                    let mouseCol = p.floor(p.mouseX / w);
                    let mouseRow = p.floor(p.mouseY / w);

                    for (let i = -1; i <= 1; i++) {
                        for (let j = -1; j <= 1; j++) {
                            let cx = mouseCol + i;
                            let cy = mouseRow + j;
                            if (cx >= 0 && cx < cols && cy >= 0 && cy < rows) {
                                if (p.random() > 0.6) {
                                    board[cx][cy] = 1;
                                    colorIndex[cx][cy] = p.floor(p.random(palette.length));
                                }
                            }
                        }
                    }
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
                let newCols = p.floor(p.width / w);
                let newRows = p.floor(p.height / w);
                let newBoard = new Array(newCols).fill(0).map(() => new Array(newRows).fill(0));
                let newNext = new Array(newCols).fill(0).map(() => new Array(newRows).fill(0));
                let newColorIndex = new Array(newCols).fill(0).map(() => new Array(newRows).fill(0).map(() => p.floor(p.random(palette.length))));

                // Copy existing state to new grid size to prevent flash reset
                for (let i = 0; i < p.min(cols, newCols); i++) {
                    for (let j = 0; j < p.min(rows, newRows); j++) {
                        newBoard[i][j] = board[i]?.[j] || 0;
                        newColorIndex[i][j] = colorIndex[i]?.[j] ?? newColorIndex[i][j];
                    }
                }
                cols = newCols;
                rows = newRows;
                board = newBoard;
                next = newNext;
                colorIndex = newColorIndex;
            };
        };

        const p5Instance = new p5(sketch);

        return () => {
            p5Instance.remove();
        };
    }, []);

    return <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />;
};

export default Background;
