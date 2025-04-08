import DatabaseGallery from './DatabaseGallery';
import './Header.css';
import ThemeSwitcher from "./ThemeSwitcher.jsx";

export default function Header(props) {
    const { databaseGallery } = props;

    return (
        <div className="header">
            <div
                className="header-title"
                onClick={() => window.location.reload()}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && window.location.reload()}
                tabIndex="0"
            >
                <img src="/logo.svg" alt="Geranium Logo" className="logo" />
                <p>Geranium</p>
            </div>
            <div className="header-right">
                <DatabaseGallery databaseGallery={databaseGallery} />
                <ThemeSwitcher />
            </div>
        </div>
    )
}