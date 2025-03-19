import './SearchByTextPanel.css'

export default function SearchByTextPanel(props) {
  /* eslint-disable react/prop-types */
  const { onUpdate } = props;
  return (
    <div className='search-by-text-panel'>
      <textarea className='search-by-text-textarea' onChange={(e) => { onUpdate(e.currentTarget.value) }}></textarea>
    </div>
  );
}
