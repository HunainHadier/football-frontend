import React from 'react'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import ViewTeamPlayer from '@/components/Players/ViewTeamPlayer'

const ViewTeamP = () => {
    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <ViewTeamPlayer />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ViewTeamP