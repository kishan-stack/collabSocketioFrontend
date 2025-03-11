import { useUser } from '../../../../hooks/useUser'
import React from 'react'

const UserDetails = ({ name, email }) => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <p className="text-lg text-gray-600">{email}</p>

        </div>
    )
}

export default UserDetails