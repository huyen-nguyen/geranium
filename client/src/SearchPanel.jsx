import { useEffect, useMemo, useState } from 'react';
import SearchByTextPanel from './SearchByTextPanel';
import './SearchPanel.css'

export default function SearchPanel(props) {
  /* eslint-disable react/prop-types */
  const { onSearch } = props;
  const [searchType, setSearchType] = useState('Text');

  // inputs
  const [inputText, setInputText] = useState('');

  const SearchByButtons = useMemo(() => {
    return ['Text', 'Image', 'JSON Spec'].map(d => {
      return (
        <button
          key={d}
          className={`${searchType === d ? 'selected' : ''}`}
          onClick={() => { setSearchType(d); }}
        >
          {d}
        </button >
      )
    })
  }, [searchType]);

  const SearchByPanel = useMemo(() => {
    switch (searchType) {
      case 'Text':
        return <SearchByTextPanel onUpdate={(text) => { setInputText(text) }} />;
    }
  }, [searchType]);

  return (
    <div className='search-panel'>
      Search by
      <div className='search-by-button-group'>
        {SearchByButtons}
      </div>
      {SearchByPanel}
      <button className='search-button' onClick={() => { onSearch(searchType, inputText) }}>
        Search
      </button>
    </div>
  );
}
