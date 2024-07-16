import './globals.css'
import NavBar from './_components/NavBar'
import AuthProvider from './_components/AuthProvider'
import Footer from './_components/Footer'


export const metadata = {
  title: "Coder'media",
  description: 'A Coding and Development discussion app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="">
      <body className="dark bg-slate-100 text-gray-950 dark:bg-gray-950 dark:text-white">
        <AuthProvider>
          <NavBar />
          <div className='h-nav'>
            {children}
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
