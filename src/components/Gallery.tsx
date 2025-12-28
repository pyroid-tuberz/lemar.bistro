export default function Gallery({ images }: { images: any[] }) {
    return (
        <div className="gallery-grid">
            {images.map((image, idx) => (
                <div key={idx} className="gallery-item">
                    <img
                        src={image.src}
                        alt="Lemar Bistro Gallery Image"
                        loading="lazy"
                    />
                </div>
            ))}
        </div>
    );
}
