import React from 'react';

const NewYorkStyleCard = ({ name, description, additionalDetails }) => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-xl p-6 space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">{name}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="text-gray-500 text-sm">
        {additionalDetails}
      </div>
    </div>
  );
};

export default NewYorkStyleCard;
