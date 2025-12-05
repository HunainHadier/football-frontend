import React from 'react'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import PlayerProfile from '@/components/Players/PlayerProfile'

const CustomersList = () => {
    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <PlayerProfile />
                </div>
                
            </div>
        
        </>
        
    )
}

export default CustomersList