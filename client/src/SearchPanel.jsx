import { useEffect, useMemo, useState } from 'react';
import SearchByTextPanel from './SearchByTextPanel';
import './SearchPanel.css'
import './SearchResultPanel.css'
import SearchByImagePanel from './SearchByImagePanel';
import SearchBySpecPanel from './SearchBySpecPanel';

export default function SearchPanel(props) {
  /* eslint-disable react/prop-types */
  const { onSearch } = props;
  const [searchType, setSearchType] = useState('Text');

  // inputs
  const [inputText, setInputText] = useState('');
  const [inputImage, setInputImage] = useState('');
  const [inputSpec, setInputSpec] = useState('');

  const SearchByButtons = useMemo(() => {
    return ['Text', 'Image', 'Spec'].map(d => {
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
      case 'Image':
        return <SearchByImagePanel onUpdate={(img) => { setInputImage(img) }} />;
      case 'Spec':
        return <SearchBySpecPanel onUpdate={(spec) => { setInputSpec(spec) }} />;
    }
  }, [searchType]);

  return (
    <div className='search-panel'>
      Search by
      <div className='search-by-button-group'>
        {SearchByButtons}
      </div>
      {SearchByPanel}
      <button className='search-button' onClick={() => { onSearch(searchType, inputText, inputImage, inputSpec) }}>
        Search
      </button>
    </div>
  );
}
