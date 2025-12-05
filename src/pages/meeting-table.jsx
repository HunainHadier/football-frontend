import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import MeetingList from '@/components/meeting/MeetingTable'
import MeetingHeader from '@/components/meeting/MeetingHeader'

const MeetingTable = () => {
    return (
        <>
            <PageHeader>
                <MeetingHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <MeetingList />
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default MeetingTable