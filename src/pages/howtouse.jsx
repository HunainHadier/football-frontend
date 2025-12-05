import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import HowToUse from '@/components/Help'

const Howtouse = () => {
    return (
        <>
            <PageHeader>
                    {/* <CoachesHeader/> */}
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <HowToUse />
                </div>
            </div>
        </>
    )
}

export default Howtouse