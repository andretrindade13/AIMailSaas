import { Account } from "@/lib/Account";
import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const {accountId, userId} = await req.json()
    if (!accountId || !userId) return NextResponse.json({error: 'Missing accountId or userId'}, {status: 400})

    const dbAccount = await db.account.findUnique({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            id: accountId.toString(),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            userId: userId.toString()
        }
    })

    if(!dbAccount) return NextResponse.json({error: 'Account not found'}, {status: 404})

    // start initial sync
    const account = new Account(dbAccount.accessToken)

    const ready = await account.waitForAccountReady(dbAccount.accessToken, 120_000, 5000)
    if (!ready) {
        console.error('Account not ready after waiting; aborting initial sync')
        return NextResponse.json({ error: 'Account not initialized' }, { status: 500 })
    }

    const response = await account.performInitialSync()
    if (!response) return NextResponse.json({error: 'Failed to perform initial sync'}, {status: 500})
    
    const {emails, deltaToken} = response

    //update deltaToken in database
    await db.account.update({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            id: accountId.toString()
        },
        data: {
            nextDeltaToken:deltaToken
        }
    })
    // await syncEmailsToDatabase(emails)
    
    console.log('sync completed', deltaToken)
    return NextResponse.json({success: true}, {status: 200})
}