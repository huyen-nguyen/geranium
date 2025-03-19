import { useEffect, useMemo, useState } from 'react'
import axios from "axios"
import Header from './Header.jsx'
import SearchPanel from './SearchPanel.jsx'

function App() {

  const [searchParam, setSearchParam] = useState({});

  const fetchAPI = async () => {
    await axios.get("http://127.0.0.1:8080/api/users")
  }

  useEffect(() => {
    fetchAPI()
  }, [])

  const SearchedMsg = useMemo(() => {
    return (
      <div>Input Type is "{searchParam.type}" and and actual input is "{searchParam.text}"</div>
    )
  }, [searchParam]);

  return (
    <>
      <Header />
      <content>
        <SearchPanel onSearch={(type, text) => { setSearchParam({ type, text }) }} />
        {SearchedMsg}
      </content>
    </>
  )
}

export default App
