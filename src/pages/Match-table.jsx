import React from 'react'


import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import MatchTable from '@/components/matches/MatchTable'
import MatchHeader from '@/components/matches/MatchHeader'

const CustomersList = () => {
    return (
        <>
            <PageHeader>
                <MatchHeader />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <MatchTable />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CustomersList