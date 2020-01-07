import React from 'react'
import Button from '../components/Button'
import Switch from '../components/Switch'
import TextInput from '../components/TextInput'
import { PAGES, setPage } from '../App'

import './Settings.scss'

export default () => (
    <div className="settings-page tab">
        <div className="fields">
            <div className="resolution">
                <TextInput name="width" label="Width" type="number" min="0" max="9999" />
                <TextInput name="height" label="Height" type="number" min="0" max="9999" />
            </div>
            <TextInput name="javaPath" label="JAVA executable path" type="file" />
            <TextInput name="javaArguments" label="JAVA arguments" type="text" />
        </div>
        <div className="fields">
            <Switch name="optifine" />
        </div>
        <Button className="back" onClick={() => setPage(PAGES.DASHBOARD)}>Back</Button>
    </div>
)