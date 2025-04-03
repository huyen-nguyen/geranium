import DatabaseGallery from './DatabaseGallery';
import './Header.css'

export default function Header(props) {
  const { databaseGallery } = props;

  return (
    <div className="header">
      <p>Geranium</p>
      <DatabaseGallery databaseGallery={databaseGallery} />
    </div>
  )
}
