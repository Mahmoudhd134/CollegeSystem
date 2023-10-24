import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import {Provider} from 'react-redux'
import {store} from './App/store'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core'
import '@fortawesome/react-fontawesome'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    // <React.StrictMode>
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path={'/*'} element={<App/>}/>
            </Routes>
        </BrowserRouter>
    </Provider>
    // </React.StrictMode>
)
