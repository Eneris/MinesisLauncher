import React from 'react'
import classNames from 'classnames'
import Button from './Button'

import { ipcRenderer } from 'electron'

import './PlayButton.scss'

const MODES = {
    READY: 'ready',
    PROGRESS: 'progress',
    INGAME: 'ingame'
}

export default class PlayButton extends React.Component {
    static defaultProps = {
        port: 25565
    }

    state = {
        mode: 'ready',
        step: null,
        progress: null
    }

    play = () => {
        const {
            username,
            version,
            host,
            port
        } = this.props

        this.setState({mode: MODES.PROGRESS})

        ipcRenderer.send('mc:start', {
            username,
            version: version || localStorage.getItem('serverVersion') || '1.15.1',
            server: { host, port, name: "Minesis Survival" },
            autoConnect: false // localStorage.getItem('autoConnect') !== "false"
        })
    }

    close = () => ipcRenderer.send('mc:close')

    handleProgress = (e, {step, progress}) => this.setState({step, progress})

    handleIngame = (e, {ingame}) => {
        this.setState({
            mode: ingame ? MODES.INGAME : MODES.READY,
            step: null,
            progress: null
        })
    }

    handleFatal = (e, args) => this.setState({ mode: MODES.READY })

    componentDidMount() {
        ipcRenderer.on('mc:progress', this.handleProgress)
        ipcRenderer.on('mc:ingame', this.handleIngame)
        ipcRenderer.on('mc:fatal', this.handleFatal)
    }

    componentWillUnmount() {
        ipcRenderer.off('mc:progress', this.handleProgress)
        ipcRenderer.off('mc:ingame', this.handleIngame)
        ipcRenderer.off('mc:fatal', this.handleFatal)
    }

    render() {
        const {
            className,
            children,
            ...props
        } = this.props

        const {
            mode,
            step,
            progress
        } = this.state

        if (mode === MODES.READY) {
            return (
                <Button
                    className={className}
                    onClick={this.play}
                    {...props}
                >{children}</Button>
            )
        }

        if (mode === MODES.PROGRESS) {
            return (
                <Button
                    style={{backgroundSize: progress + '%'}}
                    className={classNames('is-loading', className)}
                    disabled
                    {...props}
                >
                    {step ? `${step} ${progress.toFixed(2)}%` : 'Installing...'}
                </Button>
            )
        }

        if (mode === MODES.INGAME) {
            return (
                <Button
                    className={className}
                    onClick={this.close}
                    {...props}
                >
                    Close
                </Button>
            )
        }

        return false
    }
}