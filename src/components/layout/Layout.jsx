import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Footer } from './Footer'
import { Header } from './Header'

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
