import React from 'react'
import classNames from 'classnames'

import './TextInput.scss'

export default ({label, name, type, className, ...props}) => (
    <div className={classNames('custom-input', className)}>
        {label && <label htmlFor={name}>{label}</label>}
        <input
            name={name}
            type={type || 'text'}
            {...props}
        />
    </div>
)