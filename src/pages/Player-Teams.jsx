import React from 'react'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import TeamsTable from '@/components/Players/PlayerTeams'

const playerteams = () => {
    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <TeamsTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default playerteams