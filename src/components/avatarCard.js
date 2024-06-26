import React, { useState } from 'react';

import Image from 'next/image'

const AvatarCard = ({info, activeMember, index}) => {
  console.log('AvatarCard', info)
  const bgColor = {
    base : 'bg-white',
    green: 'bg-green-200',
    amber: 'bg-amber-200',
    red: 'bg-red-200',
    purple: 'bg-purple-400',
    full: 'bg-red-800',
  }
  const fontColor = {
    gary: 'text-gray-900',
    white: 'text-white-900',
  }
  let cardColor = bgColor.base;
  let textColor = fontColor.gary;

  if (activeMember?.power){
    let power = Number(activeMember.power)
    switch (true) {
      case power >= 0 && power < 100:
        cardColor = bgColor.base;
        break;
      case power >= 100 && power < 200:
        cardColor = bgColor.green;
        break;
      case power >= 200 && power < 300:
        cardColor = bgColor.amber;
        break;
      case power >= 300 && power < 400:
          cardColor = bgColor.red;
          break;
      case power >= 400 && power < 1000:
        cardColor = bgColor.purple;
        break;
      case power >= 1000 && power < 5000:
        textColor = fontColor.white;
        cardColor = bgColor.full;
        break;
      default:
        break;
    }

  }
  
  return (
    <div className={`flex items-center justify-start text-center lg:text-left  rounded-full  mr-2 max-w-md p-1 drop-shadow-md ${cardColor} sm:lg-6`}>
      <div className="relative w-30 h-auto overflow-hidden bg-gray-600 rounded-full dark:bg-gray-600 m-1 mb-3">
        {/* <svg className="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg> */}
        <Image src={`${info?.avatrurl}`} width={88} height={88}></Image>
      </div>
      <div className="font-medium dark:text-white w-full break-all">
          
          {activeMember? (<>
            <div className={`text-2xl ${textColor} w-full`}>{activeMember.power}w</div>
            <span className={`text-sm ${textColor} inline`}>{ Math.round((activeMember.speed|| activeMember.enhanced_speed) * 100) / 100} kph</span>
            {/* <span className="text-sm text-gray-500 dark:text-gray-400 inline">Cadence: {activeMember.cadence}</span> */}
          </>
          ) : null}
          <div className="text-sm text-gray-500 dark:text-gray-400">{info?.name} {/*info?.file?.name*/}</div>
      </div>
    </div>
  )
}


export default AvatarCard;