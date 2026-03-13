import { Resume, ResumeVariant, ExperienceEntry, EducationEntry, ProjectEntry } from '@/types/resume';

/**
 * Converts a Resume object to a RenderCV-compatible YAML string.
 * RenderCV expects a specific structure for its YAML files.
 */
export function resumeToRenderCVYaml(resume: any): string {
    const personal = resume.personalInfo || {};
    
    // Extract social networks
    const socialNetworks = [];
    if (personal.linkedIn) socialNetworks.push({ network: 'LinkedIn', username: personal.linkedIn });
    if (personal.github) socialNetworks.push({ network: 'GitHub', username: personal.github });

    const data = {
        cv: {
            name: resume.resumeName || 'Your Name',
            location: personal.location || undefined,
            email: personal.email || undefined,
            phone: personal.phone || undefined,
            website: personal.website || undefined,
            social_networks: socialNetworks.length > 0 ? socialNetworks : undefined,
            sections: {
                summary: resume.summary ? [resume.summary] : undefined,
                experience: resume.experience?.map((exp: any) => ({
                    company: exp.company,
                    position: exp.role,
                    location: exp.location || '',
                    start_date: exp.startDate || '',
                    end_date: exp.endDate || (exp.current ? 'present' : ''),
                    summary: exp.summary || '',
                    highlights: exp.achievements ? exp.achievements.split('\n').filter((s: string) => s.trim() !== '') : [],
                })),
                education: resume.education?.map((edu: any) => ({
                    institution: edu.institution,
                    area: edu.fieldOfStudy || '',
                    degree: edu.degree || '',
                    start_date: edu.startDate || '',
                    end_date: edu.endDate || '',
                })),
                projects: resume.projects?.map((proj: any) => ({
                    name: proj.name,
                    summary: proj.description || '',
                    highlights: proj.technologies ? [`Built with: ${proj.technologies.join(', ')}`] : [],
                })),
                skills: resume.skills ? Object.entries(resume.skills).map(([category, items]) => ({
                    label: category,
                    details: Array.isArray(items) ? items.join(', ') : String(items),
                })) : undefined,
            }
        },
        design: {
            theme: resume.template || 'classic'
        }
    };

    // Return as pretty JSON but with YAML-like spacing
    return JSON.stringify(data, null, 2);
}

/**
 * Placeholder for LaTeX generation. 
 * Real LaTeX generation would ideally happen on the backend, 
 * but we can provide a raw LaTeX view for the user.
 */
export function generateRawLatex(resume: Resume | ResumeVariant): string {
    const personal = resume.personalInfo || {};
    return `
\\documentclass{resume}
\\begin{document}
\\name{${resume.resumeName}}
\\address{${personal.location || ''}}
`.trim();
}
