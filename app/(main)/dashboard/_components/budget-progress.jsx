'use client'

import { updateBudget } from '@/actions/budget'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import useFetch from '@/hooks/use-fetch'
import { cn } from '@/lib/utils'
import { Check, Pencil, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const BudgetProgress = ({initialBudget, currentExpenses}) => {
    const [isEditing, setIsEditing] = useState(false)
    const [newBudget, setNewBudget] = useState(
        initialBudget?.amount?.toString() || ""
    )

    const percentageUsed = initialBudget
        ? (currentExpenses / initialBudget.amount) * 100
        :0
    
    const {
        loading: isLoading,
        fn: updateBudgetFn,
        data: updatedBudget,
        error,
    } = useFetch(updateBudget)
    
    const handleUpdateBudget = async () => {
        const amount = parseFloat(newBudget)

        if(isNaN(amount) || amount <= 0) {
            toast.error("Please enter a valid amount")
            return
        }

        await updateBudgetFn(amount)
    }

    useEffect(() => {
      if (updatedBudget?.success) {
        queueMicrotask(() => setIsEditing(false))
        toast.success("Budget updated successfully")
      }
    }, [updatedBudget])

    useEffect(() => {
      if (error) {
        toast.error(error.message || "Failed to update budget")
      }
    }, [error])    

    const handleCancel = () => {
        setNewBudget(initialBudget?.amount?.toString() || '')
        setIsEditing(false)
    }

  return (
    <Card className='m-10'>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='flex-1'>
                <CardTitle>Monthly Budget (Default Account)</CardTitle>
                <div className='flex items-center gap-2 mt-1'>               
                    {isEditing ? (
                        <div className='flex items-center gap-2'>
                            <Input
                                type='number'
                                value={newBudget}
                                onChange={(e)=>setNewBudget(e.target.value)}
                                className='w-32'
                                placeholder='Enter amount'
                                autoFocus
                                disabled={isLoading}
                            />
                            <Button variant='ghost' size='icon' onClick={handleUpdateBudget} disabled={isLoading}>
                                <Check className='h-4 w-4 text-green-500'/>
                            </Button>
                            <Button variant='ghost' size='icon' onClick={handleCancel} disabled={isLoading}>
                                <X className='h-4 w-4 text-red-500'/>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <CardDescription>
                                {initialBudget
                                    ?`BDT ${currentExpenses.toFixed(2)}
                                    of BDT ${initialBudget.amount.toFixed(2)} spent`
                                    : 'No Budget Set'
                                }
                            </CardDescription>
                            <Button
                                variant='ghost'
                                size='icon'
                                onClick={()=>setIsEditing(true)}
                                className='h-6 w-6'
                            >
                                <Pencil className='h-3 w-3'/>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </CardHeader>
        <CardContent>
            {initialBudget && 
            <div className='space-y-2'>
                <Progress 
                    value={percentageUsed}
                    extraStyles={`${
                        percentageUsed >= 90
                            ? "bg-red-500"
                            : percentageUsed >= 75
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                />
                <p
                    className={cn(
                        "text-xs text-right",
                        percentageUsed >= 90
                        ? "text-red-500"
                        : percentageUsed >= 75
                        ? "text-yellow-500"
                        : "text-green-500"
                    )}
                >
                    {percentageUsed.toFixed(2)}% <span className='text-muted-foreground'>used</span>
                </p>
            </div>}
        </CardContent>
    </Card>
  )
}

export default BudgetProgress