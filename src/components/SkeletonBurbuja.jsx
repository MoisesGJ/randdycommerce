'use router'

import BurbujaAdaptable from "./Burbujaadaptable"

export default function Skeleton() {
    return <>
        {Array.from({ length: 3 }).map((__, index) => <div key={index} className={`${index === 0 && 'hidden md:flex'}
            } ${index === 1 && 'h-[300px] w-[300px]'
            } hover:scale-105 h-[300px] w-[300px] rounded-2xl  transition-transform ease-in-out relative font-lucky p-3 ${index === 2 && 'hidden lg:flex'
            }`}>
            <BurbujaAdaptable className='w-full h-full' />
            <div className="w-full h-full flex flex-col gap-y-5 justify-center items-center [&>div]:animate-pulse">
                <div className="grow w-20 bg-gray-100/30"></div>
                <div className="size-36 bg-gray-100/30"></div>
                <div className="grow flex gap-x-5">
                    <div className="grow w-14 bg-gray-100/30"></div>
                    <div className="grow w-20 bg-gray-100/30"></div>
                </div>
            </div>
        </div >)
        }
    </>
}