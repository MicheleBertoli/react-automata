import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

const initialData = { gists: [] }

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component initialData={initialData} />
    </AppContainer>,
    document.body
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App', () => render(App))
}
