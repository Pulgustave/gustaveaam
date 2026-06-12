import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import projectPlaceholder from '../assets/project_placeholder.png';

const Portfolio = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('All');

    // Dynamically get unique categories
    const categories = useMemo(() => {
        const allCats = projects.flatMap(p => p.categories);
        return ['All', ...new Set(allCats)];
    }, []);

    // Filter projects based on selection
    const filteredProjects = useMemo(() => {
        if (filter === 'All') return projects;
        return projects.filter(p => p.categories.includes(filter));
    }, [filter]);

    return (
        <div style={{ padding: '2rem var(--page-padding) 4rem', position: 'relative', minHeight: '100vh' }}>
            <h1 className="title-hero fade-in">&gt; ls ./work</h1>

            {/* Filter UI */}
            <div className="fade-in" style={{
                marginBottom: '3rem',
                display: 'flex',
                gap: '0.5rem',
                flexWrap: 'wrap',
                animationDelay: '0.1s'
            }}>
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: filter === cat ? 'var(--green)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-main)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            padding: '0.4rem 0.2rem',
                            transition: 'color 0.2s ease',
                            textTransform: 'lowercase'
                        }}
                        onMouseEnter={(e) => { if (filter !== cat) e.currentTarget.style.color = 'var(--green)'; }}
                        onMouseLeave={(e) => { if (filter !== cat) e.currentTarget.style.color = 'var(--text-secondary)'; }}
                    >
                        [ {cat} ]
                    </button>
                ))}
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '2.5rem',
            }}>
                {filteredProjects.map((project, index) => {
                    const hasRealImage = project.image && project.image !== projectPlaceholder;

                    return (
                        <div key={project.id} className="card fade-in" style={{
                            animationDelay: `${0.2 + (index * 0.1)}s`,
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer',
                            overflow: 'hidden',
                        }}
                            onClick={() => navigate(`/portfolio/${project.id}`)}
                        >
                            <div style={{
                                aspectRatio: '1.33 / 1',
                                background: hasRealImage ? `url(${project.image})` : '#000',
                                backgroundSize: hasRealImage ? 'cover' : undefined,
                                backgroundPosition: 'center',
                                borderBottom: '1px solid rgba(57, 255, 20, 0.4)',
                            }} />

                            <div style={{ padding: '1.1rem 1.25rem' }}>
                                <h3 style={{
                                    margin: 0,
                                    marginBottom: '0.75rem',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.4,
                                    color: 'var(--text-primary)',
                                    fontWeight: 600,
                                }}>
                                    {project.title}
                                </h3>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                    {project.categories.map(cat => (
                                        <span key={cat} className="tag">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Portfolio;
