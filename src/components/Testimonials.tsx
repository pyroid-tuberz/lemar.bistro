export default function Testimonials({ data }: { data: any[] }) {
    return (
        <div className="testimonial-grid">
            {data.map((t, idx) => (
                <div key={idx} className="testimonial-card scroll-animate">
                    <p>"{t.text}"</p>
                    <div className="testimonial-author">- {t.name}</div>
                </div>
            ))}
        </div>
    );
}
