import { BsFillInfoCircleFill } from "react-icons/bs";

import './SearchByTextPanel.css'

export default function SearchByTextPanel(props) {
  /* eslint-disable react/prop-types */
  const { onUpdate } = props;
  return (
    <div className='search-by-text-panel'>
      <BsFillInfoCircleFill style={{
        color: '#4a4644',
        marginRight: '6px',
        verticalAlign: 'middle'
      }} />
      Describe a visualization you want to search for.
      <textarea className='search-by-text-textarea' onChange={(e) => { onUpdate(e.currentTarget.value) }}></textarea>
    </div>
  );
}
