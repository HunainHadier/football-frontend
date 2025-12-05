import React from 'react'
import PageHeaderDate from '@/components/shared/pageHeader/PageHeaderDate'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import SiteOverviewStatistics from '@/components/widgetsStatistics/SiteOverviewStatistics'
import Footer from '@/components/shared/Footer'


const Home = () => {
    return (
        <>
            <PageHeader >
                <PageHeaderDate />
            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                     <SiteOverviewStatistics />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Home