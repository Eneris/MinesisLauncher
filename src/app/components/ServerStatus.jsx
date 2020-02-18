import React from 'react'
import { ipcRenderer } from 'electron'
import classNames from 'classnames'

import Switch from './Switch'

import './ServerStatus.scss'

export default class ServerStatus extends React.Component {
    static defaultProps = {
        port: 25565
    }

    state = {
        server: {},
        autoConnect: localStorage.getItem('autoConnect') === "true"
    }

    constructor(props) {
        super(props)

        localStorage.setItem('server', null)
    }

    componentDidMount() {
        ipcRenderer.on('mc:pong', this.handleServerPong)
        this.timer = setInterval(this.handleServerPing, this.props.timer)
        this.handleServerPing()
    }

    componentWillUnmount() {
        clearInterval(this.timer)
        ipcRenderer.off('mc:pong', this.handleServerPong)
    }

    handleServerPing = () => {
        ipcRenderer.send('mc:ping', {
            host: this.props.host,
            port: this.props.port
        })
    }

    handleServerPong = (e, args) => {
        localStorage.setItem('serverOnline', !args.err)

        if (args.data) {
            const version = args.data.version.name.match(/[1-9](\.[0-9]+)+/)
            localStorage.setItem('serverVersion', version && version[0])
        }

        this.setState({ server: args.data || {} })
    }

    handleAutoConnect = (autoConnect) => {
        localStorage.setItem('autoConnect', autoConnect)
        this.setState({autoConnect})
    }

    render() {
        const {
            autoConnect,
            server: {
                players,
                version
            }
        } = this.state

        const {
            className
        } = this.props

        if (!players) {
            return (
                <div className={classNames("server-status", className)}>
                    <div className="status offline">Offline</div>
                </div>
            )
        }

        return (
            <div className={classNames("server-status", className)}>
                <div className="status online">Online</div>
                <div className="version">Minesis Survival</div>
                <div className="players">{`${players.online} / ${players.max}`}</div>
                <Switch onChange={this.handleAutoConnect} defaultChecked={autoConnect} title="Autoconnect" />
            </div>
        )
    }
}