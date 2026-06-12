import React from 'react';

const inputStyle = {
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(57, 255, 20, 0.4)',
    padding: '0.75rem 0',
    color: 'var(--text-primary)',
    fontSize: '1rem',
    fontFamily: 'var(--font-main)',
    outline: 'none',
    transition: 'border-color 0.2s ease',
};

const focusGreen = (e) => { e.target.style.borderColor = 'var(--green)'; };
const blurReset = (e) => { e.target.style.borderColor = 'rgba(57, 255, 20, 0.4)'; };

const Contact = () => {
    return (
        <div style={{ padding: '2rem var(--page-padding) 4rem', maxWidth: '800px' }}>
            <h1 className="title-hero fade-in">&gt; sendmail</h1>
            <p className="fade-in" style={{ fontSize: '1rem', marginBottom: '2.5rem', animationDelay: '0.2s', color: 'var(--text-secondary)' }}>
                &gt; interested in collaboration? let's build something fun.
            </p>

            <form className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animationDelay: '0.4s' }}>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>&gt; name:</span>
                    <input type="text" style={inputStyle} onFocus={focusGreen} onBlur={blurReset} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>&gt; email:</span>
                    <input type="email" style={inputStyle} onFocus={focusGreen} onBlur={blurReset} />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <span style={{ color: 'var(--green)', fontSize: '0.9rem' }}>&gt; message:</span>
                    <textarea rows="4" style={{ ...inputStyle, resize: 'vertical' }} onFocus={focusGreen} onBlur={blurReset} />
                </label>
                <button type="button" className="btn-sticker" style={{ alignSelf: 'flex-start', marginTop: '0.5rem' }}>
                    [ send_ ]
                </button>
            </form>
        </div>
    );
};

export default Contact;
