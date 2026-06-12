import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            textAlign: 'center',
            padding: '0 2rem'
        }}>
            <p className="fade-in" style={{
                fontSize: '1rem',
                color: 'var(--green)',
                marginBottom: '0.5rem',
                animationDelay: '0.1s'
            }}>
                &gt; whoami
            </p>
            <p className="fade-in" style={{
                fontSize: '1.1rem',
                color: 'var(--text-secondary)',
                marginBottom: '2.5rem',
                animationDelay: '0.2s'
            }}>
                gustavo avellaneda m.
            </p>

            <h1 className="title-hero fade-in" style={{ animationDelay: '0.4s' }}>
                <span className="glitch" data-text="ENGINEER.">ENGINEER.</span>
                <br />
                <span className="glitch" data-text="COMPUTATIONAL DESIGNER.">COMPUTATIONAL DESIGNER.</span>
                <br />
                <span className="glitch" data-text="CODE TINKERER." style={{ color: 'var(--green)' }}>CODE TINKERER.</span>
            </h1>

            <p className="fade-in" style={{
                fontSize: '1rem',
                maxWidth: '600px',
                color: 'var(--text-secondary)',
                lineHeight: 1.8,
                marginBottom: '2.5rem',
                animationDelay: '0.7s'
            }}>
                &gt; searching for the thing that feels like me_
                <br />
                &gt; result: it doesn't exist yet<span className="cursor-blink">_</span>
            </p>

            <Link to="/contact" className="btn-sticker fade-in" style={{ animationDelay: '0.9s' }}>
                [ say hi ]
            </Link>
        </div>
    );
};

export default Home;
