import React, { Component } from 'react'
import UpdateLinks from './components/UpdateLinks'
import Logo from './components/Logo'

import './App.scss'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faCog, faCircle, faMinus, faTimes, faPlus } from '@fortawesome/free-solid-svg-icons'
import { faApple, faWindows, faLinux } from '@fortawesome/free-brands-svg-icons'

library.add(faCog, faCircle, faMinus, faTimes, faPlus, faApple, faWindows, faLinux)

export default class Static extends Component {
    state = {
        versions: false
    }

    componentDidMount() {
        fetch('files/launcher.json?rand=' + Math.random())
            .then(res => res.json())
            .then(data => {
                console.log('updater:versions', data)
                this.setState({ versions: data })
            })
            .catch(e => {
                console.error(e)
                this.setState({ versions: false})
            })
    }

    render() {
        const versions = this.state.versions

        return (
            <div className="app">
                <Logo />
                {versions && (
                    <div className="container">
                        <div className="tab minecraft text-center">Download Minesis Launcher</div>
                        <UpdateLinks
                            className="tab"
                            baseUrl=""
                            mac={versions.links.mac}
                            win={versions.links.win}
                            linux={versions.links.linux}
                        />
                    </div>
                )}
            </div>
        )
    }
}