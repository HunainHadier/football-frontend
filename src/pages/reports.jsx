import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Reports from '@/components/Report/Report'
import ReportHeader from '@/components/Report/ReportHeader'

const Coach = () => {
    return (
        <>
            <PageHeader>
                    <ReportHeader/>
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <Reports />
                </div>
            </div>
        </>
    )
}

export default Coach