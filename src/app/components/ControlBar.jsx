import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { remote, ipcRenderer } from 'electron'

import {PAGES, setPage} from '../App'

import './ControlBar.scss'

export default ({settingsButton}) => (
    <div className="control-bar">
        <div className="window-buttons">
            <div className="close" onClick={() => ipcRenderer.send('app:exit')}>
                <FontAwesomeIcon icon="times" />
            </div>
            <div className="minimise" onClick={() => remote.getCurrentWindow().minimize()}>
                <FontAwesomeIcon icon="minus" />
            </div>
        </div>
        <div class="drag"></div>
        <FontAwesomeIcon
            icon="cog"
            onClick={() => setPage(PAGES.SETTINGS)}
            className="settings-link"
        />
    </div>
)