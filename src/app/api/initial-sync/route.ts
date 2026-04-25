import { Account } from "@/lib/Account";
import { syncEmailsToDatabase } from "@/lib/sync-to-db";
import type { EmailMessage } from "@/lib/types";
import { db } from "@/server/db";
import { NextResponse, type NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const {accountId, userId} = await req.json() as { accountId: string; userId: string }
    if (!accountId || !userId) return NextResponse.json({error: 'Missing accountId or userId'}, {status: 400})

    const dbAccount = await db.account.findUnique({
        where: {
            id: accountId.toString(),
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
            id: accountId.toString()
        },
        data: {
            nextDeltaToken:deltaToken
        }
    })
    const params =  {
        emails: emails as EmailMessage[],
        accountId: accountId.toString()
    }
    await syncEmailsToDatabase(params.emails, params.accountId)
    
    console.log('sync completed', deltaToken)
    return NextResponse.json({success: true}, {status: 200})
}