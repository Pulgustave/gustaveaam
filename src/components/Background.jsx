import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

class Particle {
    constructor(p) {
        this.p = p;
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5)); // Slow drift
        this.size = p.random(1, 3);
    }

    update() {
        this.pos.add(this.vel);
    }

    draw() {
        this.p.noStroke();
        this.p.fill(255, 200);
        this.p.ellipse(this.pos.x, this.pos.y, this.size);
    }

    checkEdges() {
        if (this.pos.x < 0) this.pos.x = this.p.width;
        if (this.pos.x > this.p.width) this.pos.x = 0;
        if (this.pos.y < 0) this.pos.y = this.p.height;
        if (this.pos.y > this.p.height) this.pos.y = 0;
    }
}

const Background = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const sketch = (p) => {
            let particles = [];
            const particleCount = 100;
            const connectionDistance = 100;
            const mouseDistance = 150;

            p.setup = () => {
                p.createCanvas(p.windowWidth, p.windowHeight).parent(containerRef.current);
                p.noStroke();
                for (let i = 0; i < particleCount; i++) {
                    particles.push(new Particle(p));
                }
            };

            p.draw = () => {
                p.clear();

                // Update and draw particles
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                    particle.checkEdges();
                });

                // Connections
                p.strokeWeight(1);
                for (let i = 0; i < particles.length; i++) {
                    // Connect to other particles
                    for (let j = i + 1; j < particles.length; j++) {
                        let d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                        if (d < connectionDistance) {
                            let alpha = p.map(d, 0, connectionDistance, 255, 0);
                            p.stroke(0, 240, 255, alpha * 0.5); // Cyan color
                            p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
                        }
                    }

                    // Connect to mouse
                    let dMouse = p.dist(particles[i].pos.x, particles[i].pos.y, p.mouseX, p.mouseY);
                    if (dMouse < mouseDistance) {
                        let alpha = p.map(dMouse, 0, mouseDistance, 255, 0);
                        p.stroke(255, 0, 85, alpha); // Pink accent for interaction
                        p.line(particles[i].pos.x, particles[i].pos.y, p.mouseX, p.mouseY);
                    }
                }
            };

            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
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
