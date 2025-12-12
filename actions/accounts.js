"use server"

import { db } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

const serializeTransaction = (obj) => {
    const serialized = { ...obj }

    if (obj.balance) {
        serialized.balance = obj.balance.toNumber()
    }

    if (obj.amount) {
        serialized.amount = obj.amount.toNumber()
    }

    return serialized
}

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error('Unauthorized')

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) throw new Error('User not found')

        //Set all other accounts to non-default
        await db.account.updateMany({
            where: { userId: user.id, isDefault: true },
            data: { isDefault: false },
        })

        //Set selected account to default
        const account = await db.account.update({
            where: { id: accountId, userId: user.id },
            data: { isDefault: true },
        })

        revalidatePath('/dashboard')
        return { success: true, data: serializeTransaction(account) }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function getAccountWithTransactions(accountId) {
    const { userId } = await auth()
    if (!userId) throw new Error('Unauthorized')

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
    })

    if (!user) throw new Error('User not found')

    const account = await db.account.findUnique({
        where: { id: accountId, userId: user.id },
        include: {
            transactions: {
                orderBy: { date: 'desc' },
            },
            _count: {
                select: {
                    transactions: true,
                }
            }
        },
    })

    if (!account) return null

    return {
        ...serializeTransaction(account),
        transactions: account.transactions.map(serializeTransaction),
    }
}


export async function bulkDeleteTransactions(transactionIds) {
    try {
        const { userId } = await auth()
        if (!userId) throw new Error('Unauthorized')

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        })

        if (!user) throw new Error('User not found')

        const transactions = await db.transaction.findMany({
            where: {
                id: { in: transactionIds },
                userId: user.id
            }
        })

        const accountBalanceChanges = transactions.reduce((acc, transaction) => {
            const change =
                transaction.type === 'EXPENSE'
                    ? transaction.amount.toNumber()
                    : -transaction.amount.toNumber()

            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change
            return acc
        }, {})

        //Delete transactions and update account balances in a transaction
        await db.$transaction(async (tx) => {
            //Delete transactions
            await tx.transaction.deleteMany({
                where: {
                    id: { in: transactionIds },
                    userId: user.id,
                }
            })

            for (const [accountId, balanceChange] of Object.entries(
                accountBalanceChanges
            )) {
                await tx.account.update({
                    where: { id: accountId },
                    data: {
                        balance: {
                            increment: balanceChange,
                        }
                    }
                })
            }
        })

        revalidatePath('/dashboard')
        revalidatePath('/account/[id]')
        return { success: true }
    } catch (error) {
        return { success: false, error: error.message }
    }
}

export async function updateAccount(id, data) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const account = await db.account.update({
            where: {
                id: id,
                userId: user.id,
            },
            data: data,
        });

        revalidatePath("/dashboard");
        revalidatePath("/account/" + id);
        return { success: true, data: serializeTransaction(account) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export async function deleteAccount(id) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: userId },
        });

        if (!user) throw new Error("User not found");

        const account = await db.account.findUnique({
            where: { id, userId: user.id },
            include: { _count: { select: { transactions: true } } }
        });

        if (!account) throw new Error("Account not found");

        const accountCount = await db.account.count({
            where: { userId: user.id }
        });

        if (account.isDefault && accountCount > 1) {
            throw new Error("Cannot delete default account. Please set another account as default first.");
        }

        await db.$transaction(async (tx) => {
            // Delete transactions first (though cascade might handle it, being explicit is safer per requirements)
            await tx.transaction.deleteMany({
                where: { accountId: id }
            });

            await tx.account.delete({
                where: { id: id }
            });
        });

        revalidatePath("/dashboard");
        return { success: true };

    } catch (error) {
        return { success: false, error: error.message };
    }
}