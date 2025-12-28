'use client';

import { useState } from 'react';

interface Artist {
    name: string;
    name_en?: string;
    image: string;
}

interface DayData {
    dayName: string;
    dayName_en?: string;
    artist1?: Artist;
    artist2?: Artist;
}

export default function Artists({ weekData, lang }: { weekData: DayData[], lang: 'tr' | 'en' }) {
    const today = new Date();
    const todayDayIndex = (today.getDay() + 6) % 7;
    const [activeDayIndex, setActiveDayIndex] = useState(todayDayIndex);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeDay = weekData[activeDayIndex];

    const getArtistName = (artist: Artist) => (lang === 'en' && artist.name_en) ? artist.name_en : artist.name;
    const getDayName = (day: DayData) => (lang === 'en' && day.dayName_en) ? day.dayName_en : day.dayName;

    const createArtistCard = (artist: Artist, stageName: string, color: string) => (
        <div className="artist-card">
            <div className="artist-card-header" style={{ background: `linear-gradient(135deg, ${color}20 0%, ${color}05 100%)`, borderBottom: `2px solid ${color}40` }}>
                <span className="artist-stage-badge" style={{ background: color, color: 'white' }}>🎤 {stageName}</span>
            </div>
            <div className="artist-card-body">
                <div className="artist-avatar-container">
                    <img
                        src={artist.image}
                        alt={getArtistName(artist)}
                        className="artist-avatar"
                        style={{ border: `4px solid ${color}60` }}
                        onError={(e) => (e.currentTarget.src = '/uploads/default_artist.png')}
                    />
                </div>
                <h3 className="artist-name">{getArtistName(artist)}</h3>
                <p className="artist-venue">@ Lemar Bistro</p>
            </div>
        </div>
    );

    const liveStageName = lang === 'tr' ? 'Canlı Kat' : 'Live Stage';
    const terraceStageName = lang === 'tr' ? 'Teras Kat' : 'Terrace Stage';

    return (
        <div className="artist-grid">
            <div className={`artist-tabs-container ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                {weekData.map((day, index) => (
                    <button
                        key={index}
                        className={`artist-day-tab ${index === activeDayIndex ? 'active' : ''}`}
                        onClick={() => {
                            if (window.innerWidth <= 768) {
                                if (index === activeDayIndex) {
                                    setIsDropdownOpen(!isDropdownOpen);
                                } else {
                                    setActiveDayIndex(index);
                                    setIsDropdownOpen(false);
                                }
                            } else {
                                setActiveDayIndex(index);
                            }
                        }}
                    >
                        <div className="tab-day-name">{getDayName(day)}</div>
                        {index === todayDayIndex && <div className="tab-today-badge">{lang === 'tr' ? 'Bugün' : 'Today'}</div>}
                    </button>
                ))}
            </div>

            <div id="artist-content-container">
                <div className="artists-day-content">
                    {activeDay.artist1?.name && createArtistCard(activeDay.artist1, liveStageName, '#FF6B6B')}
                    {activeDay.artist2?.name && createArtistCard(activeDay.artist2, terraceStageName, '#4ECDC4')}
                </div>
            </div>
        </div>
    );
}
