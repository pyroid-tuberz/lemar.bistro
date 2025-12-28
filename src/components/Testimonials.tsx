'use client';

export default function Testimonials({ data, lang }: { data: any[], lang: 'tr' | 'en' }) {
    
    const getText = (t: any) => (lang === 'en' && t.text_en) ? t.text_en : t.text;
    const getName = (t: any) => (lang === 'en' && t.name_en) ? t.name_en : t.name;

    return (
        <div className="testimonial-grid">
            {data.map((t, idx) => (
                <div key={idx} className="testimonial-card scroll-animate">
                    <p>"{getText(t)}"</p>
                    <div className="testimonial-author">- {getName(t)}</div>
                </div>
            ))}
        </div>
    );
}
