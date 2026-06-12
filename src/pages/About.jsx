import React from 'react';

const About = () => {
    const skills = ['Structural Analysis', 'FEA', 'Complex Geometry', 'Python Scripting', 'C#', 'Rhino', 'Grasshopper', 'Design_for_Fabrication', 'API_s', 'Visual Studio', 'React', 'Three.js', 'P5.js', 'WebGL', 'Node.js', 'Design Systems'];

    return (
        <div style={{ padding: '2rem var(--page-padding) 4rem', maxWidth: '800px' }}>
            <h1 className="title-hero fade-in">&gt; cat about.md</h1>

            <p className="fade-in" style={{
                fontSize: '1.8rem',
                fontWeight: 700,
                fontFamily: 'var(--font-heading)',
                lineHeight: '1.3',
                marginBottom: '2rem',
                animationDelay: '0.1s'
            }}>
                <span className="glitch" data-text="I want to understand the world." style={{ color: 'var(--green)' }}>
                    I want to understand the world.
                </span>
            </p>

            <div className="card fade-in" style={{ padding: '2rem 2.5rem', animationDelay: '0.2s' }}>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    A learner first — always running small simulations of the world to see how it behaves, then pulling at threads to see what unravels. Not because I expect to find the end of them, but because the pulling itself is the point. I've accepted that. Took longer than I'd like to admit.
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    Engineer by chance, computational designer by choice, after a long and occasionally painful search for problems interesting enough to justify the attention. The path wasn't straight. It rarely is when you're guided more by curiosity than by plan.
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    I'd call myself a breaker rather than a fixer. It took me a while to admit that too. For a long time I tried to be useful in the ways people expected — contained, reliable, solving the problem as stated. But the only thing that truly feeds me is to experiment, push, stay uncontained — by systems, by disciplines, by my own previous conclusions. Breaking things is how I learn what they're actually made of.
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    By day I work on design: forces, systems, algorithms. The kind of work that lives at the edge of what computers can describe and what humans can intuit. It's interesting enough. Fun enough. It keeps me going, and some days it's genuinely beautiful.
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
                    The rest of the time I follow my own threads — projects, ideas, half-finished obsessions that probably look like chaos from the outside but feel like breathing from the inside. It's how I keep my sanity. How I stay honest with myself. How I let the world be what it is rather than what I think it should be. A way to lose control, on purpose, without apology.
                </p>
                <p style={{ fontSize: '1.05rem', lineHeight: '1.8', color: 'var(--text-primary)' }}>
                    Music, art, astronomy, bikes, and calisthenics — when I'm not trying to talk to computers, or when the computers aren't listening.
                </p>
            </div>

            <div className="fade-in" style={{ animationDelay: '0.4s', marginTop: '3rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--green)' }}>
                    &gt; ls ./skills
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                    {skills.map((skill, index) => (
                        <span key={index} className="tag" style={{ borderColor: index % 2 === 0 ? 'var(--green)' : 'var(--magenta)', color: index % 2 === 0 ? 'var(--green)' : 'var(--magenta)' }}>
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
