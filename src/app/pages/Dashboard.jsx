import React, { Component, useState } from "react"
import Logo from '../components/Logo'
import ServerStatus from '../components/ServerStatus'
import PlayButton from '../components/PlayButton'
import TextInput from '../components/TextInput'

import './Dashboard.scss'

const MC_SERVER = {
    host: 'minecraft.project-nemesis.cz',
    port: 25565
}

export default class Login extends Component {
    state = {
        username: localStorage.getItem('username')
    }

    handleUsernameChange = (e) => {
        const username = e.target.value
        localStorage.setItem('username', username)
        this.setState({username})
    }

    render() {
        const username = this.state.username

        return [
          <Logo key="logo" />,
          <ServerStatus
            host={MC_SERVER.host}
            port={MC_SERVER.port}
            timer={30000}
            className="tab"
            key="server-status"
          />,
          <div className="page-dashboard tab" key="page-dashboard">
            <TextInput
                name="username"
                label="Username"
                onChange={this.handleUsernameChange}
                defaultValue={username}
            />
            <PlayButton host={MC_SERVER.host} username={username}>Play</PlayButton>
          </div>
        ];
    }
}
