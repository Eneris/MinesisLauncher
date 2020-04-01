import React, { useState } from 'react'
import Button from '../components/Button'
import Switch from '../components/Switch'
import TextInput from '../components/TextInput'
import { PAGES, setPage } from '../App'

import './Settings.scss'

export default () => {
    return (
        <div className="settings-page tab">
            <div className="fields">
                {/* <div className="resolution">
                    <TextInput name="width" label="Width" type="number" min="0" max="9999" />
                    <TextInput name="height" label="Height" type="number" min="0" max="9999" />
                </div>
                <TextInput name="javaPath" label="JAVA executable path" type="file" />
                <TextInput name="javaArguments" label="JAVA arguments" type="text" /> */}
                <TextInput
                    name="memory"
                    label="Memory"
                    type="text"
                    onChange={(e) => localStorage.setItem('memory', e.target.value)}
                    defaultValue={localStorage.getItem('memory') || '2G'}
                    style={{maxWidth: '50%'}}
                />
            </div>
            {/* <div className="fields">
                <Switch name="optifine" />
            </div> */}
            <Button className="back" onClick={() => setPage(PAGES.DASHBOARD)}>Back</Button>
        </div>
    )
}