import React from 'react'
import CustomersHeader from '@/components/Players/PlayersHeader'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import PastPlayerStats from '@/components/Players/PastPlayerStats'

const CustomersList = () => {
    return (
        <>
            <PageHeader>
                <CustomersHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <PastPlayerStats />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CustomersList