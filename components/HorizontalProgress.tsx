import { CheckIcon } from '@heroicons/react/outline'
import React, { useState, useEffect } from 'react'

// step:
// 0    => image not uploaded
// 1    => image uploaded, metadata not entered
// 2    => image uploaded, metadata entered, ready to mint

const StepComplete = () => {
    return <>
        <div className="flex flex-1 items-center">
            <div className="w-full flex items-center justify-center">
                <span className="p-1 rounded-full bg-green-500 text-center"><CheckIcon className="text-white w-3 h-3" /></span>
            </div>
        </div>
    </>
}

const StepIncomplete = () => {
    return <>
        <div className="flex flex-1 items-center">
            <div className="w-full flex items-center justify-center">
                <span className="p-1 border-2 rounded-full border-gray-200 text-center"><span className="w-1 h-1 block bg-transparent"></span></span>
            </div>
        </div>
    </>
}

const BarComplete = () => {
    return <>
        <div className="w-1/4 align-center items-center align-middle content-center flex">
            <div className="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
                <div className="bg-green-200 text-xs leading-none py-0.5 text-center text-grey-darkest rounded w-full"></div>
            </div>
        </div>
    </>
}

const BarIncomplete = () => {
    return <>
        <div className="w-1/4 align-center items-center align-middle content-center flex">
            <div className="w-full bg-grey-light rounded items-center align-middle align-center flex-1">
                <div className="bg-gray-100 text-xs leading-none py-0.5 text-center text-grey-darkest rounded w-full"></div>
            </div>
        </div>
    </>
}

const HorizontalProgress = ({step}) => {
    const [stepState, setStepState] = useState<number>()

    useEffect(() => {
        setStepState(step)
    }, [step])

    return (
        <div className="max-w-xl mx-auto my-4 pb-4">	
            <div className="flex pb-3">
                <div className="flex-1">
                </div>

                { stepState == 0 ? <>
                        <StepIncomplete />
                        <BarIncomplete />
                        <StepIncomplete />
                        <BarIncomplete />
                        <StepIncomplete />
                    </>
                : stepState == 1 ? <>
                        <StepComplete />
                        <BarComplete />
                        <StepIncomplete />
                        <BarIncomplete />
                        <StepIncomplete />
                    </>
                : stepState == 2 ? <>
                        <StepComplete />
                        <BarComplete />
                        <StepComplete />
                        <BarComplete />
                        <StepIncomplete />
                    </>
                : <></>
                }

                <div className="flex-1">
                </div>
            </div>
            
            <div className="flex text-xs content-center text-center">
                <div className="w-1/3">
                    Upload image
                </div>
                
                <div className="w-1/3">
                    Set metadata
                </div>
                
                <div className="w-1/3">
                    Mint NFT
                </div>		
            </div>
        </div>
    )
}

export { HorizontalProgress }