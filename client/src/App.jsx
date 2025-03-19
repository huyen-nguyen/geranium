import { useEffect, useMemo, useState } from 'react'
import Header from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'
// import axios from "axios"

function App() {

  const [searchParam, setSearchParam] = useState({});

  //const fetchAPI = async () => {
  //  await axios.get("http://127.0.0.1:8080/api/users")
  //}

  //useEffect(() => {
  //  fetchAPI()
  //}, [])

  // Just for testing
  const SearchedMsg = useMemo(() => {
    return (
      <div className="search-result-panel">You clicked "Search." The input type is "{searchParam.type}" and the actual input is "{searchParam.text}" and "{searchParam.image + ''}" and "{searchParam.spec + ''}"</div>
    )
  }, [searchParam]);

  return (
    <>
      <Header />
      <div className='content'>
        <SearchPanel onSearch={(type, text, image, spec) => { setSearchParam({ type, text, image, spec }) }} />
        {SearchedMsg}
      </div>
    </>
  )
}

export default App
