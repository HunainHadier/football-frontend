import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import CoachTable from '@/components/coaches/Coaches'
import CoachesHeader from '@/components/coaches/CoachesHeader'

const Coach = () => {
    return (
        <>
            <PageHeader>
                    <CoachesHeader/>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <CoachTable />
                </div>
            </div>
        </>
    )
}

export default Coach