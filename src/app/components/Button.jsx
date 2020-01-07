import React from 'react'
import classNames from 'classnames'

import './Button.scss'

export default ({className, ...props}) => (
    <button
        className={classNames('custom-button', className)}
        {...props}
    />
)