
import { RouterProvider } from 'react-router-dom'
import './App.css'
import { myRouter } from './components/router'

function App() {

  return (
    < >
    <RouterProvider router={myRouter}/>
    </>
  )
}

export default App
