import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import p5 from 'p5';

const DEFAULTS = {
    cellSize: 14,
    frameRate: 10,
    seedDensity: 0.06,
    glitchChance: 0.125,
};

const panelInputStyle = {
    width: '100%',
    accentColor: 'var(--green)',
};

const Background = () => {
    const containerRef = useRef(null);
    const p5Ref = useRef(null);
    const paramsRef = useRef({ ...DEFAULTS });
    const reseedRef = useRef(() => {});
    const rescaleRef = useRef(() => {});

    const [open, setOpen] = useState(false);
    const [cellSize, setCellSize] = useState(DEFAULTS.cellSize);
    const [frameRate, setFrameRate] = useState(DEFAULTS.frameRate);
    const [seedDensity, setSeedDensity] = useState(DEFAULTS.seedDensity);
    const [glitchChance, setGlitchChance] = useState(DEFAULTS.glitchChance);

    useEffect(() => {
        const sketch = (p) => {
            let cols, rows;
            let board = [];
            let next = [];
            let colorIndex = [];

            const pickColor = () => {
                return p.random() < paramsRef.current.glitchChance
                    ? p.color(255, 46, 151, 70) // magenta (glitch cell)
                    : p.color(57, 255, 20, 70); // green
            };

            // mode: 'reseed' (fresh random fill), 'preserve' (same indices, e.g. window resize),
            // or 'rescale' (remap old pattern proportionally onto the new grid size)
            const rebuildGrid = (mode = 'reseed') => {
                const w = paramsRef.current.cellSize;
                const newCols = p.floor(p.width / w);
                const newRows = p.floor(p.height / w);
                const newBoard = new Array(newCols).fill(0).map(() => new Array(newRows).fill(0));
                const newNext = new Array(newCols).fill(0).map(() => new Array(newRows).fill(0));
                const newColorIndex = new Array(newCols).fill(0).map(() => new Array(newRows).fill(0));

                const oldCols = cols || newCols;
                const oldRows = rows || newRows;

                for (let i = 0; i < newCols; i++) {
                    for (let j = 0; j < newRows; j++) {
                        if (mode === 'preserve' && board[i] && board[i][j] !== undefined) {
                            newBoard[i][j] = board[i][j];
                            newColorIndex[i][j] = colorIndex[i]?.[j] ?? pickColor();
                        } else if (mode === 'rescale' && board.length) {
                            const oldI = Math.min(oldCols - 1, p.floor(i * oldCols / newCols));
                            const oldJ = Math.min(oldRows - 1, p.floor(j * oldRows / newRows));
                            newBoard[i][j] = board[oldI]?.[oldJ] ?? 0;
                            newColorIndex[i][j] = colorIndex[oldI]?.[oldJ] ?? pickColor();
                        } else {
                            newBoard[i][j] = p.random() > (1 - paramsRef.current.seedDensity) ? 1 : 0;
                            newColorIndex[i][j] = pickColor();
                        }
                    }
                }

                cols = newCols;
                rows = newRows;
                board = newBoard;
                next = newNext;
                colorIndex = newColorIndex;
            };

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight).parent(containerRef.current);
                rebuildGrid('reseed');
                p.frameRate(paramsRef.current.frameRate);
                p.noStroke();
            };

            p.draw = () => {
                p.clear();

                const w = paramsRef.current.cellSize;

                // Draw active cells as soft, colorful blocks
                for (let i = 0; i < cols; i++) {
                    for (let j = 0; j < rows; j++) {
                        if (board[i] && board[i][j] === 1) {
                            p.fill(colorIndex[i][j]);
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
                                colorIndex[x][y] = pickColor();
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
                                    colorIndex[cx][cy] = pickColor();
                                }
                            }
                        }
                    }
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
                rebuildGrid('preserve');
            };

            reseedRef.current = () => rebuildGrid('reseed');
            rescaleRef.current = () => rebuildGrid('rescale');
        };

        const p5Instance = new p5(sketch);
        p5Ref.current = p5Instance;

        return () => {
            p5Instance.remove();
        };
    }, []);

    // Keep the running sketch in sync with control changes
    useEffect(() => { paramsRef.current.cellSize = cellSize; }, [cellSize]);
    useEffect(() => { paramsRef.current.seedDensity = seedDensity; }, [seedDensity]);
    useEffect(() => { paramsRef.current.glitchChance = glitchChance; }, [glitchChance]);
    useEffect(() => {
        paramsRef.current.frameRate = frameRate;
        p5Ref.current?.frameRate(frameRate);
    }, [frameRate]);

    const handleCellSizeChange = (value) => {
        setCellSize(value);
        paramsRef.current.cellSize = value;
        rescaleRef.current();
    };

    const handleReseed = () => reseedRef.current();

    const handleReset = () => {
        setCellSize(DEFAULTS.cellSize);
        setFrameRate(DEFAULTS.frameRate);
        setSeedDensity(DEFAULTS.seedDensity);
        setGlitchChance(DEFAULTS.glitchChance);
        paramsRef.current = { ...DEFAULTS };
        reseedRef.current();
    };

    return (
        <>
            <div ref={containerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }} />

            {createPortal(
            <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 1000, fontFamily: 'var(--font-main)' }}>
                {open && (
                    <div style={{
                        background: 'var(--panel)',
                        border: '1px solid rgba(57, 255, 20, 0.4)',
                        borderRadius: '4px',
                        padding: '0.75rem 1rem',
                        marginBottom: '0.5rem',
                        width: '195px',
                        color: 'var(--text-primary)',
                        fontSize: '0.7rem',
                        boxShadow: '0 0 24px rgba(0,0,0,0.6)',
                    }}>
                        <div style={{ color: 'var(--green)', marginBottom: '0.75rem' }}>&gt; game_of_life.cfg</div>

                        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                <span>cell size</span><span>{cellSize}px</span>
                            </div>
                            <input style={panelInputStyle} type="range" min="6" max="32" step="1"
                                value={cellSize} onChange={(e) => handleCellSizeChange(Number(e.target.value))} />
                        </label>

                        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                <span>speed</span><span>{frameRate} fps</span>
                            </div>
                            <input style={panelInputStyle} type="range" min="1" max="30" step="1"
                                value={frameRate} onChange={(e) => setFrameRate(Number(e.target.value))} />
                        </label>

                        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                <span>seed density</span><span>{Math.round(seedDensity * 100)}%</span>
                            </div>
                            <input style={panelInputStyle} type="range" min="0.01" max="0.5" step="0.01"
                                value={seedDensity} onChange={(e) => setSeedDensity(Number(e.target.value))} />
                        </label>

                        <label style={{ display: 'block', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                <span>glitch ratio</span><span>{Math.round(glitchChance * 100)}%</span>
                            </div>
                            <input style={panelInputStyle} type="range" min="0" max="1" step="0.01"
                                value={glitchChance} onChange={(e) => setGlitchChance(Number(e.target.value))} />
                        </label>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn-sticker" style={{ padding: '0.35rem 0.5rem', fontSize: '0.6rem', whiteSpace: 'nowrap' }} onClick={handleReseed}>
                                [ reseed ]
                            </button>
                            <button className="btn-sticker" style={{ padding: '0.35rem 0.5rem', fontSize: '0.6rem', whiteSpace: 'nowrap' }} onClick={handleReset}>
                                [ reset ]
                            </button>
                        </div>
                    </div>
                )}

                <button className="btn-sticker" style={{ float: 'right', padding: '0.5rem 1rem', fontSize: '0.75rem' }} onClick={() => setOpen((v) => !v)}>
                    {open ? '[ close_ ]' : '[ tweak_sim ]'}
                </button>
            </div>,
            document.body
            )}
        </>
    );
};

export default Background;
