'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState, useEffect } from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DATE_RANGES = {
    "7D": { label: "Last 7 Days", days: 7},
    "1M": { label: "Last Month", days: 30},
    "3M": { label: "Last 3 Months", days: 90},
    "6M": { label: "Last 6 Months", days: 180},
    ALL: { label: "All Time", days: null},
}

const AccountChart = ({transactions}) => {
    const [dateRange, setDateRange] = useState("1M")
    const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

    useEffect(() => {
        const handleResize = () => setScreenWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const filteredData = useMemo(() => {
        const range = DATE_RANGES[dateRange]
        const now = new Date()
        const startDate = range.days
            ? startOfDay(subDays(now, range.days))
            : startOfDay(new Date(0))
        
        const filtered = transactions.filter(
            (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
        )

        const grouped = filtered.reduce((acc,transaction) => {
            const date = format(new Date(transaction.date), "MMM dd")

            if (!acc[date]) {
                acc[date] = {date, income:0, expense:0}
            }

            if (transaction.type === 'INCOME') {
                acc[date].income += transaction.amount
            } else {
                acc[date].expense += transaction.amount
            }

            return acc
        }, {})

        return Object.values(grouped).sort(
            (a,b) => new Date(a.date) - new Date(b.date)
        )
    }, [transactions, dateRange])

    // Calculate responsive interval based on data length AND screen size
    const xAxisInterval = useMemo(() => {
        const isMobile = screenWidth < 640
        const isTablet = screenWidth < 1024
        
        if (isMobile) {
            if (filteredData.length <= 7) return 0
            if (filteredData.length <= 30) return 3
            return Math.floor(filteredData.length / 4)
        }
        
        if (isTablet) {
            if (filteredData.length <= 7) return 0
            if (filteredData.length <= 30) return 1
            if (filteredData.length <= 90) return 3
            return Math.floor(filteredData.length / 6)
        }
        
        // Desktop
        if (filteredData.length <= 7) return 0
        if (filteredData.length <= 30) return 1
        if (filteredData.length <= 90) return 3
        return Math.floor(filteredData.length / 7)
    }, [filteredData, screenWidth])

    // Responsive margins
    const chartMargins = useMemo(() => {
        if (screenWidth < 640) {
            return { top: 10, right: 5, left: 5, bottom: 0 }
        }
        if (screenWidth < 1024) {
            return { top: 15, right: 10, left: 10, bottom: 0 }
        }
        return { top: 15, right: 10, left: 10, bottom: 0 }
    }, [screenWidth])

    // Responsive height
    const chartHeight = screenWidth < 640 ? 250 : 300

    const totals = useMemo(() => {
        return filteredData.reduce(
            (acc, day) => ({
                income: acc.income + day.income,
                expense: acc.expense + day.expense,
            }),
            {income: 0, expense: 0}
        )
    }, [filteredData])

  return (
    <Card>
        <CardHeader className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0'>
            <CardTitle className='text-xl sm:text-2xl'>Transaction Overview</CardTitle>
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(DATE_RANGES).map(([key, {label}])=>{
                    return (<SelectItem key={key} value={key}>
                        {label}
                    </SelectItem>)
                })}
            </SelectContent>
            </Select>
        </CardHeader>
        <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm mb-6'>
                <div className='text-center'>
                    <p className='text-muted-foreground text-xs sm:text-sm'>Total Income</p>
                    <p className='text-base sm:text-lg font-bold text-green-500'>BDT {totals.income.toFixed(2)}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground text-xs sm:text-sm'>Total Expense</p>
                    <p className='text-base sm:text-lg font-bold text-red-500'>BDT {totals.expense.toFixed(2)}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground text-xs sm:text-sm'>Net</p>
                    <p className={`text-base sm:text-lg font-bold ${totals.income-totals.expense>0?'text-green-500':'text-red-500'}`}>BDT {(totals.income-totals.expense).toFixed(2)}</p>
                </div>
            </div>

            <div style={{height: `${chartHeight}px`}} className='w-full'>
                <ResponsiveContainer width='100%' height='100%'>
                    <BarChart
                        data={filteredData}
                        margin={chartMargins}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                            dataKey="date" 
                            interval={xAxisInterval} 
                            stroke='#000'
                            tick={{ fontSize: screenWidth < 640 ? 10 : 12 }}
                        />
                        <YAxis
                            fontSize={screenWidth < 640 ? 10 : 12}
                            tickLine={false}
                            axisLine={false}
                            stroke='#000'
                            tickFormatter={(value) => `BDT ${value}`}
                        />
                        <Tooltip 
                            formatter={(value) => `BDT ${value.toFixed(2)}`}
                            labelFormatter={(label) => label}
                        />
                        <Legend />
                        <Bar 
                            dataKey="income"
                            name='Income' 
                            fill="#22c55e" 
                            radius={[4,4,0,0]}
                        />
                        <Bar 
                            dataKey="expense"
                            name='Expense'
                            fill="#ef4444" 
                            radius={[4,4,0,0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </CardContent>
    </Card>
  )
}

export default AccountChart