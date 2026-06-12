import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projects } from '../data/projects';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projects.find(p => p.id === parseInt(id));

    if (!project) {
        return (
            <div style={{ padding: '2rem var(--page-padding)' }}>
                <h2>404: project not found</h2>
                <button onClick={() => navigate('/portfolio')} className="btn-sticker" style={{ marginTop: '1rem' }}>
                    [ back ]
                </button>
            </div>
        );
    }

    return (
        <div className="fade-in" style={{ padding: '2rem var(--page-padding) 4rem', color: 'var(--text-primary)', maxWidth: '1000px', margin: '0 auto' }}>
            <button onClick={() => navigate('/portfolio')} className="btn-sticker" style={{ marginBottom: '2.5rem' }}>
                [ back ]
            </button>

            {/* Header Section */}
            <div style={{ marginBottom: '4rem' }}>
                <h1 className="project-details-title">{project.title}</h1>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem', borderBottom: '1px solid rgba(57, 255, 20, 0.4)', paddingBottom: '2rem' }}>
                    {project.categories.map(cat => (
                        <span key={cat} className="tag">{cat}</span>
                    ))}
                </div>

                {/* Markdown Content Section */}
                <div className="card project-markdown-container" style={{ padding: '2rem 2.5rem' }}>
                    <ReactMarkdown
                        rehypePlugins={[rehypeRaw]}
                        components={{
                            p: ({ ...props }) => <p className="project-details-desc" style={{ marginBottom: '1.5rem' }} {...props} />,
                            img: ({ ...props }) => (
                                <div className="card" style={{
                                    width: '100%',
                                    maxWidth: '700px',
                                    margin: '3rem auto', // centered block
                                    background: '#fff',
                                    padding: '0.75rem',
                                    boxSizing: 'border-box',
                                }}>
                                    <img {...props} style={{
                                        width: '100%',
                                        height: 'auto',
                                        display: 'block',
                                    }} />
                                </div>
                            )
                        }}
                    >
                        {project.description}
                    </ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
