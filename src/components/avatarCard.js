import React, { useState } from 'react';

import Image from 'next/image'

const AvatarCard = ({info, activeMember, index}) => {
  console.log('AvatarCard', info)

  return (
    <div className="flex items-center justify-start text-center lg:text-left bg-white rounded dark:bg-gray-600 p-4 mt-4 mr-4 max-w-md">
      <div className="relative w-20 h-20 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 m-4">
        {/* <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg> */}
        <Image src={`/avataaars_${index}.png`} width={120} height={120}></Image>
      </div>
      <div className="font-medium dark:text-white w-full break-all">
          
          {activeMember? (<>
            <div className="text-2xl text-gray-900 dark:text-gray-400 w-full">{activeMember.power}W</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">Speed: { Math.round(activeMember.speed * 100) / 100}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 w-full">Cadence: {activeMember.cadence}</p>
          </>
          ) : null}
          <div className="text-sm text-gray-500 dark:text-gray-400">{info?.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{info?.file?.name}</div>
      </div>
    </div>
  )
}


export default AvatarCard;