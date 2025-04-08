// ThemeSwitcher.jsx
import { useState, useEffect } from 'react';

const ThemeSwitcher = () => {
    const themes = [
        { name: 'Green', class: '' },
        { name: 'Blue', class: 'theme-blue' },
        { name: 'Brown', class: 'theme-brown' }
    ];

    const [currentTheme, setCurrentTheme] = useState(
        localStorage.getItem('theme') || ''
    );

    useEffect(() => {
        // Remove any theme classes first
        document.body.classList.remove('theme-blue', 'theme-brown');

        // Add the current theme class
        if (currentTheme) {
            document.body.classList.add(currentTheme);
        }

        // Save to local storage
        localStorage.setItem('theme', currentTheme);
    }, [currentTheme]);

    return (
        <div className="theme-switcher">
            <select
                id="theme-select"
                value={currentTheme}
                onChange={(e) => setCurrentTheme(e.target.value)}
                aria-label="Change theme"
            >
                {themes.map((theme) => (
                    <option key={theme.name} value={theme.class}>
                        {theme.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ThemeSwitcher;