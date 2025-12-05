import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import MeetingPhotos from '@/components/MeetingPhotos/MeetingPhotos'

const AddMeeting = () => {
    return (
        <>
            <PageHeader>

            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <MeetingPhotos />
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default AddMeeting