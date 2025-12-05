import React from 'react'
import PageHeader from '@/components/shared/pageHeader/PageHeader'
import Footer from '@/components/shared/Footer'
import EvaluationResult from '@/components/Players/Evaluat'

const EvaluateResult = () => {
    return (
        <>
            <PageHeader>

            </PageHeader>
            <div className='main-content'>
                <div className='row'>
                    <EvaluationResult />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default EvaluateResult