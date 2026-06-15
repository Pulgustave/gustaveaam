import React from 'react';

const linkStyle = {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(57, 255, 20, 0.4)',
    transition: 'color 0.2s ease, border-color 0.2s ease',
};

const hoverGreen = (e) => { e.target.style.color = 'var(--green)'; e.target.style.borderColor = 'var(--green)'; };
const hoverReset = (e) => { e.target.style.color = 'var(--text-primary)'; e.target.style.borderColor = 'rgba(57, 255, 20, 0.4)'; };

const Contact = () => {
    return (
        <div style={{ padding: '2rem var(--page-padding) 4rem', maxWidth: '800px' }}>
            <h1 className="title-hero fade-in">&gt; sendmail</h1>
            <p className="fade-in" style={{ fontSize: '1rem', marginBottom: '2.5rem', animationDelay: '0.2s', color: 'var(--text-secondary)' }}>
                &gt; interested in collaboration? let's build something fun.
            </p>

            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animationDelay: '0.4s', fontSize: '1rem' }}>
                <div>
                    <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>&gt; email: </span>
                    <a href="mailto:gustavo@feronomelabs.studio" style={linkStyle} onMouseEnter={hoverGreen} onMouseLeave={hoverReset}>
                        gustavo@feronomelabs.studio
                    </a>
                </div>
                <div>
                    <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>&gt; linkedin: </span>
                    <a href="https://www.linkedin.com/in/gustaveaam/" target="_blank" rel="noopener noreferrer" style={linkStyle} onMouseEnter={hoverGreen} onMouseLeave={hoverReset}>
                        linkedin.com/in/gustaveaam
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Contact;
