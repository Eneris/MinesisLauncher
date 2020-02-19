import React, { Component } from 'react'
import Logo from '../components/Logo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ipcRenderer } from 'electron'

import './Updater.scss'

export const STATES = {
    NONE: null,
    PROGRESS: 'Downloading',
    DONE: 'Done'
}

export default class Updater extends Component {
    state = {
        state: STATES.NONE,
        stateData: null
    }

    componentDidMount() {
        ipcRenderer.on('updater:progress', (e, args) => this.setState({
            state: STATES.PROGRESS,
            stateData: args
        }))

        ipcRenderer.on('updater:done', () => this.setState({
            state: STATES.DONE,
            stateData: null
        }))

        ipcRenderer.on('updater:error', (e, args) => this.setState({
            state: STATES.ERROR,
            stateData: args,
        }))
    }

    render() {
        const {
            availableVersion,
            currentVersion,
            baseUrl
        } = this.props

        const {
            state,
            stateData
        } = this.state

        return [
            <Logo key="logo" />,
            <div className="page-updater tab" key="page-updater">
                <div>New version is available</div>
                <div className="versions">
                    <span className="old">{currentVersion}</span>
                    <span> -> </span>
                    <span className="new">{availableVersion.version}</span>
                </div>
                <div className="links">
                    <a href={`${baseUrl}/${availableVersion.links.mac}?rand=${Math.random()}`}>
                        <FontAwesomeIcon icon={['fab', 'apple']} />
                    </a>
                    <a href={`${baseUrl}/${availableVersion.links.win}?rand=${Math.random()}`}>
                        <FontAwesomeIcon icon={['fab', 'windows']} />
                    </a>
                    <a href={`${baseUrl}/${availableVersion.links.linux}?rand=${Math.random()}`}>
                        <FontAwesomeIcon icon={['fab', 'linux']} />
                    </a>
                </div>
                {state && (
                    <div className="is-loading" style={state === STATES.PROGRESS ? {backgroundSize: stateData + '%'} : {}}>
                        {stateData ? `${state}: ${stateData}` : state}
                    </div>
                )}
            </div>
        ]
    }
}
