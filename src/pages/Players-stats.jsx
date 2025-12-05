import React from 'react'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'

import AddPlayerStats from '@/components/Players/PlayerStats'

const AddTeamStat = () => {
    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <AddPlayerStats />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default AddTeamStat