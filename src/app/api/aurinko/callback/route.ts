import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { exchangeCodeForToken, getAccountInfo } from "@/lib/aurinko";
import { db } from "@/server/db";

export const GET = async (req: NextRequest) => {
    const {userId} = await auth()
    console.log(userId)
    if(!userId) throw new Error('Unauthorized')

    const {searchParams} = req.nextUrl
    const status = searchParams.get('status')
    const code = searchParams.get('code')

    if(status !== 'success') return NextResponse.json({error: 'Authentication failed'}, {status: 400})
    
    if(!code) return NextResponse.json({error: 'Missing code'}, {status: 400})
    
    const tokenResponse = await exchangeCodeForToken(code)
    if(!tokenResponse) return NextResponse.json({error: 'Failed to exchange code for token'}, {status: 500})
    
    const infoAccount = await getAccountInfo(tokenResponse.accessToken)
    if(!infoAccount) return NextResponse.json({error: 'Failed to fetch account info'}, {status:500})

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await db.account.upsert({
        where: {
            id: tokenResponse.accountId.toString()
        },
        update: {
            accessToken: tokenResponse.accessToken
        },
        create: {
            id: tokenResponse.accountId.toString(),
            userId,
            accessToken: tokenResponse.accessToken,
            emailAdress: infoAccount.email,
            name: infoAccount.name ?? infoAccount.email
        }
    })

    return NextResponse.redirect(new URL('/mail', req.url))

}