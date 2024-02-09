import React, { useState } from 'react';

import Image from 'next/image'

const AvatarCard = ({info, activeMember, index}) => {
  console.log('AvatarCard', info)

  return (
    <div className="flex items-center justify-start text-center lg:text-left bg-white rounded-full dark:bg-gray-600 mr-6 max-w-md p-1">
      <div className="relative w-30 h-auto overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 m-1 mb-3">
        {/* <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg> */}
        <Image src={`/avataaars_${index}.png`} width={88} height={88}></Image>
      </div>
      <div className="font-medium dark:text-white w-full break-all">
          
          {activeMember? (<>
            <div className="text-2xl text-gray-900 dark:text-gray-400 w-full">{activeMember.power}W</div>
            <span className="text-sm text-gray-500 dark:text-gray-400 inline">Speed: { Math.round(activeMember.speed * 100) / 100} </span>
            {/* <span className="text-sm text-gray-500 dark:text-gray-400 inline">Cadence: {activeMember.cadence}</span> */}
          </>
          ) : null}
          <div className="text-sm text-gray-500 dark:text-gray-400">{info?.name} {/*info?.file?.name*/}</div>
      </div>
    </div>
  )
}


export default AvatarCard;