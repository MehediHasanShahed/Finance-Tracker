import { getAccountWithTransactions } from '@/actions/accounts'
import { notFound } from 'next/navigation'

import React, { Suspense } from 'react'
import TransactionTable from '../_components/transaction-table'
import { BarLoader } from 'react-spinners'
import AccountChart from '../_components/account-chat'

const AccountsPage = async ({params}) => {
    
    const { id } = await params

    const accountData = await getAccountWithTransactions(id)

    if (!accountData) {
        notFound()
    }

    const {transactions, ...account} = accountData


    return (
        <div className='space-y-8 px-5 py-10'> 
            <div className='flex flex-col sm:flex-row gap-4 items-start sm:items-end justify-between'>
                <div>
                    <h1 className='text-5xl sm:text-6xl font-bold gradient-title capitalize'>{account.name}</h1>
                    <p className='text-muted-foreground'>{account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account</p>
                </div>

                <div className='text-left sm:text-right pb-2 sm:pb-10 w-full sm:w-auto'>
                    <div className='text-xl sm:text-2xl font-bold'>BDT {parseFloat(account.balance).toFixed(2)}</div>
                    <p className='text-sm text-muted-foreground'>{account._count.transactions} Transactions </p>
                </div>
            </div>

            {/* Chart Section */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='black' />}>
                <AccountChart transactions={transactions}/>
            </Suspense>

            {/* Transaction Table */}
            <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='black' />}>
                <TransactionTable transactions={transactions}/>
            </Suspense>
        </div>
    )
}

export default AccountsPage