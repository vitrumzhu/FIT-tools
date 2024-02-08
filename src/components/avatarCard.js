import React, { useState } from 'react';


const AvatarCard = ({info, activeMember}) => {
  console.log('AvatarCard', info)

  return (
    <div className="flex items-center justify-start gap-4 bg-white rounded dark:bg-gray-600 p-4 mb-4">
      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
        <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
        
      </div>
      <div className="font-medium dark:text-white w-full break-all">
          <div className="text-lg text-gray-500 dark:text-gray-400">{info?.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{info?.file?.name}</div>
          {activeMember? (<>
            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">Power: {activeMember.power}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">Speed: { Math.round(activeMember.speed)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">Cadence: {activeMember.cadence}</p>
          </>
          ) : null}
      </div>
    </div>
  )
}


export default AvatarCard;