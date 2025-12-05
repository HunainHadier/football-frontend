import React from 'react'
import PlayerHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import AddTeamStats from '@/components/Players/TeamStats'

const CustomersList = () => {
    return (
        <>
            <PageHeader>
                <PlayerHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <AddTeamStats />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CustomersList