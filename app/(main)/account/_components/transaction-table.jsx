'use client'

import { bulkDeleteTransactions } from '@/actions/accounts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { categoryColors } from '@/data/categories'
import useFetch from '@/hooks/use-fetch'
import { format } from 'date-fns'
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, PencilLine, RefreshCcw, Search, Trash, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useMemo, useState } from 'react'
import { BarLoader } from 'react-spinners'
import { toast } from 'sonner'

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {

    const router = useRouter()

    const [selectedIds,setSelectedIds] = useState([])
    const [sortConfig,setSortConfig] = useState({
        field:'date',
        direction:'desc',
    })

    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [recurringFilter, setRecurringFilter] = useState('')
    const [page, setPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const {
        loading: deleteLoading,
        fn: deleteFn,
        data: deleted,
    } = useFetch(bulkDeleteTransactions)


    const filteredAndSortedTransactions = useMemo(() => {
        let result = [...transactions]

        //Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase()
            result = result.filter((transaction) => 
                transaction.description?.toLowerCase().includes(searchLower)
            )
        }

        //Apply type filter
        if (typeFilter) {
            result = result.filter((transaction) => 
                transaction.type?.includes(typeFilter)
            )
        }

        //Apply recurring filter
        if (recurringFilter) {
            const val = (recurringFilter==='non-recurring'? false : true)
            result = result.filter((transaction) => 
                transaction.isRecurring===val
            )
        }

        //Apply sorting
        result.sort((a,b)=>{
            let comparison = 0

            switch (sortConfig.field) {
                case "date":
                    comparison = new Date(a.date) - new Date(b.date)
                    break;
                case "amount":
                    comparison = a.amount - b.amount
                    break;
                case "category":
                    comparison = a.category.localeCompare(b.category)
                    break;
            
                default:
                    comparison = 0
            }

            return sortConfig.direction === 'asc' ? comparison: -comparison
        })

        return result
    },[transactions, searchTerm, typeFilter, recurringFilter, sortConfig])


    const handleSort = (field) => {
        setSortConfig(current=>({
            field,
            direction:
                current.field==field && current.direction === 'asc' ? 'desc':'asc'
        }))
    }

    const handleSelect = (id) => {
        setSelectedIds(current=>current.includes(id)?current.filter(item=>item!=id):[...current,id])
    }

    const handleSelectAll = () => {
        setSelectedIds(current=>current.length === filteredAndSortedTransactions.length ? []:filteredAndSortedTransactions.map((t) => t.id))
    }

    const handleBulkDelete = async ()=>{
        if (!window.confirm(
            `Are you sure you want to delete ${selectedIds.length} transactions?`
        )){
            return
        }
        deleteFn(selectedIds)
    }

    useEffect(() => {
        if (deleted && !deleteLoading) {
            toast.success('Transactions Deleted Successfully')
            setSelectedIds([])
        }
    }, [deleted, deleteLoading])

    const handleClearFilters = () => {
        setSearchTerm('')
        setTypeFilter('')
        setRecurringFilter('')
        setSelectedIds([])
    }

    const totalPages = Math.max(1, Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE))
    useEffect(() => {
        if (page > totalPages) setPage(totalPages)
    }, [totalPages, page])

    const handlePrev = (e) => {
        e?.preventDefault()
        setPage((p) => Math.max(1, p - 1))
    }
    const handleNext = (e) => {
        e?.preventDefault()
        setPage((p) => Math.min(totalPages, p + 1))
    }

    const getPageRange = () => {
        const range = []
        if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) range.push(i)
        return range
        }
        const start = Math.max(2, page - 2)
        const end = Math.min(totalPages - 1, page + 2)

        range.push(1)
        if (start > 2) range.push('left-ellipsis')
        for (let i = start; i <= end; i++) range.push(i)
        if (end < totalPages - 1) range.push('right-ellipsis')
        range.push(totalPages)
        return range
    }

    const pageRange = getPageRange()
        
    return (
    <Card className="pl-6 pr-6">
    <div className='space-y-4'>
        {deleteLoading && (<BarLoader className='mt-4' width={'100%'} color='black'/>)}

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-4'>
            <div className='relative flex-1'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground'/>
                <Input 
                    placeholder='Search transactions'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className='pl-8'/>
            </div>

            <div className='flex gap-2'>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={recurringFilter} onValueChange={setRecurringFilter}>
                    <SelectTrigger className='w-[155px]'>
                        <SelectValue placeholder="All Transactions" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recurring">Recurring Only</SelectItem>
                        <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
                    </SelectContent>
                </Select>

                {selectedIds.length>0 && (<div className='flex items-center gap-2'>
                    <Button variant='destructive' size='sm' onClick={handleBulkDelete}>
                        <Trash/>
                        Delete Selected ({selectedIds.length})
                    </Button>
                </div>)}

                {(selectedIds.length>0||searchTerm||typeFilter||recurringFilter)&&(
                    <Button variant='outline' size='icon' onClick={handleClearFilters} title='Clear Filters'>
                        <X/>
                    </Button>
                )}
            </div>
        </div>

        {/* Transactions */}
        <Card className="pl-6 pr-6">
            <div className='rounded-md boarder'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">
                                <Checkbox onCheckedChange={handleSelectAll}
                                checked={selectedIds.length === filteredAndSortedTransactions.length && filteredAndSortedTransactions.length > 0}/>
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={()=>handleSort('date')}>
                                <div className='flex items-center'>Date {sortConfig.field==='date'&&(
                                    sortConfig.direction==='asc'?(<ChevronUp className='ml-1  h-4 w-4' />):(<ChevronDown className='ml-1  h-4 w-4' />)
                                )}</div>
                            </TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="cursor-pointer" onClick={()=>handleSort('category')}>
                                <div className='flex items-center'>Category {sortConfig.field==='category'&&(
                                    sortConfig.direction==='asc'?(<ChevronUp className='ml-1  h-4 w-4' />):(<ChevronDown className='ml-1  h-4 w-4' />)
                                )}</div> 
                            </TableHead>
                            <TableHead className="cursor-pointer" onClick={()=>handleSort('amount')}>
                                <div className='flex items-center justify-end'>Amount {sortConfig.field==='amount'&&(
                                    sortConfig.direction==='asc'?(<ChevronUp className='ml-1  h-4 w-4' />):(<ChevronDown className='ml-1  h-4 w-4' />)
                                )}</div>
                            </TableHead>
                            <TableHead className='flex items-center justify-center'>Recurring</TableHead>
                            <TableHead className='w-[50px]'/>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedTransactions.length === 0?(
                            <TableRow>
                                <TableCell colSpan={7} className='text-center text-muted-foreground'>
                                    No Transactions Found
                                </TableCell>
                            </TableRow>
                        ): (
                            filteredAndSortedTransactions.slice(page*10-10,page*10).map((transaction)=>(
                                <TableRow key={transaction.id}>
                                    <TableCell >
                                        <Checkbox onCheckedChange={()=> handleSelect(transaction.id)} 
                                        checked={selectedIds.includes(transaction.id)}/>  
                                    </TableCell>
                                    <TableCell>{format(new Date(transaction.date),'PP')}</TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell className='capitalize'>
                                        <span style={{
                                            background: categoryColors[transaction.category],
                                        }} className='px-2 py-1 rounded text-white text-small'
                                        >{transaction.category}</span>
                                    </TableCell>
                                    <TableCell 
                                        className='text-right font-medium' 
                                        style={{
                                            color: transaction.type === "EXPENSE" ? "red" : "green"
                                        }}>
                                        {transaction.type==='EXPENSE'?"-":"+"}
                                        BDT {transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell className='flex items-center justify-center'>{transaction.isRecurring?(
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Badge variant='outline' className='gap-1 rounded bg-gray-500 text-white hover:bg-black'>
                                                        <RefreshCcw className='h-3 w-3'/>
                                                        {RECURRING_INTERVALS[transaction.recurringInterval]}
                                                    </Badge>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <div className='text-sm'>
                                                        <div className='font-medium'>Next Date:</div>
                                                        <div>{format(new Date(transaction.nextRecurringDate),'PP')}</div>
                                                    </div> 
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    ):(<Badge variant='outline' className='gap-1 rounded'>
                                        <Clock className='h-3 w-3'/>
                                        One-time
                                    </Badge>)}</TableCell>
                                    
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant='ghost' className='h-8 w-8 p-0'>
                                                    <MoreHorizontal className='h-4 w-4'/>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuLabel className='flex items-center justify-center'>Actions</DropdownMenuLabel>
                                                <DropdownMenuSeparator className='h-1 bg-gray-200'/>
                                                <DropdownMenuItem
                                                    onClick={()=>
                                                        router.push(`/transaction/create?edit=${transaction.id}`)
                                                    }
                                                ><div className='flex justify-between items-center w-full'>
                                                    Edit
                                                    <PencilLine className='h-4 w-4 text-green-600'/>
                                                </div>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem  
                                                onClick={()=>deleteFn([transaction.id])}
                                                >
                                                    <div className='flex justify-between items-center w-full'>
                                                        Delete
                                                        <Trash2 className='h-4 w-4 text-destructive'/>
                                                    </div>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {
                    filteredAndSortedTransactions.length > 0 && (
                        <div className='flex flex-row items-center justify-center mt-4'>
                        <Pagination>
                            <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                href="#"
                                onClick={handlePrev}
                                aria-disabled={page === 1}
                                />
                            </PaginationItem>

                            <PaginationItem>
                                {/* render page links */}
                                <div className="flex items-center gap-2 px-2">
                                {pageRange.map((p, idx) => {
                                    if (p === 'left-ellipsis' || p === 'right-ellipsis') {
                                    return <PaginationEllipsis key={p + idx} />
                                    }
                                    return (
                                    <PaginationLink
                                        key={p}
                                        href="#"
                                        onClick={(e) => { e.preventDefault(); setPage(p) }}
                                        className={p === page ? 'bg-muted text-gray-400 rounded px-3 py-1' : 'rounded px-3 py-1'}
                                    >
                                        {p}
                                    </PaginationLink>
                                    )
                                })}
                                </div>
                            </PaginationItem>

                            <PaginationItem>
                                <PaginationNext
                                href="#"
                                onClick={handleNext}
                                aria-disabled={page === totalPages}
                                />
                            </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                        </div>
                    )
                }
            </div>
        </Card>
        </div>
    </Card>
    )
}

export default TransactionTable