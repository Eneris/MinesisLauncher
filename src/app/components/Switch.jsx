import React, { useState } from 'react'
import classnames from 'classnames'

import './Switch.scss'

export default ({defaultChecked, className, onChange, title, ...props}) => {
    const [ checked, setChecked ] = useState(defaultChecked)

    const handleAutoConnect = () => {
        setChecked(!checked)
        if (onChange) onChange(!checked)
    }

    return (
        <label className={classnames("switch", className)} title={title}>
            <input
                type="checkbox"
                defaultChecked={checked}
                onClick={handleAutoConnect}
                {...props}
            />
            <span className="slider"></span>
        </label>
    )
}