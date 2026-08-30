import { SearchIcon } from '../../utils/style'
import './SearchBar.css'

export function SearchBar({ placeholder = 'Search', ...rest }) {
  return (
    <label className="search-bar">
      <SearchIcon className="search-bar__icon" />
      <input type="text" placeholder={placeholder} {...rest} />
    </label>
  )
}
