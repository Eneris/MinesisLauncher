import React from 'react'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './UpdateLinks.scss'

export default ({className, baseUrl, mac, win, linux, ...props}) => (
    <div className={classNames('links', className)} {...props}>
        <a href={`${baseUrl}/files/${mac}?rand=${Math.random()}`}>
            <FontAwesomeIcon icon={['fab', 'apple']} />
        </a>
        <a href={`${baseUrl}/files/${win}?rand=${Math.random()}`}>
            <FontAwesomeIcon icon={['fab', 'windows']} />
        </a>
        <a href={`${baseUrl}/files/${linux}?rand=${Math.random()}`}>
            <FontAwesomeIcon icon={['fab', 'linux']} />
        </a>
    </div>
)