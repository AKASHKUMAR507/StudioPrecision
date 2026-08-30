import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Layout } from '../components/layout/Layout'
import { About } from '../features/about'
import { BlogList, BlogPost } from '../features/blog'
import { Home } from '../features/home'
import { StyleShowcase } from '../features/style-showcase'
import { WorkDetail } from '../features/work'
import { NotFound } from './NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="blog" element={<BlogList />} />
          <Route path="blog/:slug" element={<BlogPost />} />
          <Route path="work/:slug" element={<WorkDetail />} />
        </Route>
        <Route path="style-guide" element={<StyleShowcase />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
