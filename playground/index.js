import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App2'

const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.body
  )
}

render(App)

if (module.hot) {
  module.hot.accept('./App2', () => render(App))
}
