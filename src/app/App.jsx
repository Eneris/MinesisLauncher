import React from 'react'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import Updater from './pages/Updater'
import Logo from './components/Logo'
import ControlBar from './components/ControlBar'
import { ipcRenderer } from 'electron'

import './App.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faCircle, faMinus, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faApple, faWindows, faLinux } from '@fortawesome/free-brands-svg-icons'

library.add(faCog, faCircle, faMinus, faTimes, faPlus, faApple, faWindows, faLinux)

export const UPDATER_URL = 'http://mcupdater.eneris.wtf'

export const PAGES = {
  DASHBOARD: 'dashboard',
  SETTINGS: 'settings',
  INGAME: 'ingame',
  UPDATER: 'updater'
}

export function setPage(page) {
  document.dispatchEvent(new CustomEvent('app:setpage', {detail: {page}}))
}

export default class App extends React.Component {
  state = {
    page: PAGES.DASHBOARD,
    availableVersion: false
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
    ipcRenderer.on('updater:progress', (e, args) => console.info('updater:progress', args))
    ipcRenderer.on('updater:error', (e, args) => console.info('updater:error', args))
    ipcRenderer.on('updater:done', (e, args) => console.info('updater:done', args))

    fetch(UPDATER_URL + '/launcher.json?rand=' + Math.random())
      .then(res => res.json())
      .then(data => {
        console.log('updater:versions', data)
        this.setState({
          availableVersion: data,
          page: data.version !== this.props.version ? PAGES.UPDATER : this.state.page
        })
      })
      .catch(e => {
        console.error(e)
        this.setState({availableVersion: false})
      })
  }

  componentWillUnmount() {
    document.removeEventListener('app:setpage', this.handleSetPage)
  }

  handleSetPage = ({detail: {page}}) => this.setState({page})

  getPage = () => {
    switch (this.state.page) {
      case PAGES.DASHBOARD: return <Dashboard username={this.state.username} />
      case PAGES.SETTINGS: return <Settings />
      case PAGES.UPDATER: return (
        <Updater
          currentVersion={this.props.version}
          availableVersion={this.state.availableVersion}
          baseUrl={UPDATER_URL}
        />
      )
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
