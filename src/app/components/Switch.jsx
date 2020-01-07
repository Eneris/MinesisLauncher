import React, { useState } from 'react'
import classnames from 'classnames'

import './Switch.scss'

export default ({defaultChecked, className, onChange, ...props}) => {
    const [ checked, setChecked ] = useState(defaultChecked)

    const handleAutoConnect = () => {
        setChecked(!checked)
        if (onChange) onChange(!checked)
    }

    return (
        <label className={classnames("switch", className)}>
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