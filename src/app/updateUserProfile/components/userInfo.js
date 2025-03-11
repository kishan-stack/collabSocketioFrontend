import { useUser } from '../../../hooks/useUser'

import React from 'react'

const UserInfo = ({firstName,lastName,email}) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{firstName} <span className="ml-2">{lastName}</span></h1>
            <p className="text-lg text-gray-600">{email}</p>

        </div>
    )
}

export default UserInfo