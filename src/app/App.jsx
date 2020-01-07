import React from 'react'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Logo from './components/Logo'
import ControlBar from './components/ControlBar'
import { ipcRenderer } from 'electron'

import './App.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faCircle, faMinus, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(faCog, faCircle, faMinus, faTimes, faPlus)

export const PAGES = {
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  INGAME: 'ingame'
}

export function setPage(page) {
  document.dispatchEvent(new CustomEvent('app:setpage', {detail: {page}}))
}

export default class App extends React.Component {
  state = {
    page: PAGES.SETTINGS
  }

  componentDidMount() {
    document.addEventListener('app:setpage', this.handleSetPage)

    ipcRenderer.on('mc:progress', (e, args) => console.log('mc:progress', args))
    ipcRenderer.on('mc:ingame', (e, args) => console.log('mc:ingame', args))
    ipcRenderer.on('mc:log', (e, args) => console.log('mc:log', args))
    ipcRenderer.on('mc:error', (e, args) => console.log('mc:error', args))
    ipcRenderer.on('mc:ingame', (e, args) => console.log('mc:ingame', args))
    ipcRenderer.on('mc:pong', (e, args) => console.log('mc:pong', args))
    ipcRenderer.on('mc:check', (e, args) => console.log('mc:check', args))
    ipcRenderer.on('mc:fatal', (e, args) => console.error('mc:fatal', args))
  }

  componentWillUnmount() {
    document.removeEventListener('app:setpage', this.handleSetPage)
  }

  handleSetPage = ({detail: {page}}) => this.setState({page})

  getPage = () => {
    switch (this.state.page) {
      case PAGES.DASHBOARD: return <Dashboard username={this.state.username} />
      case PAGES.SETTINGS: return <Settings />
      case PAGES.INGAME:
      default: return <Logo />
    }
  }

  render() {
    const page = this.state.page

    return (
      <div className="app">
        <ControlBar settingsButton={page === PAGES.DASHBOARD} />
        {this.getPage()}
      </div>
    )
  }
}
