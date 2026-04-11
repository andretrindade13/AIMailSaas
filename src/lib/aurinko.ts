'use server'

import { auth } from "@clerk/nextjs/server"
import axios from "axios"

export const getAurinkoAuthURL = async (serviceType: 'Google' | 'Office365' | 'IMAP') => {
    const { userId } = await auth()
    if (!userId) {
        throw new Error('Unauthorized')
    }

    const  params = new URLSearchParams({
        clientId: process.env.AURINKO_CLIENT_ID!,
        serviceType,
        scopes: ["Mail.Read", "Mail.ReadWrite", "Mail.Send"].join(" "),
        responseType: "code",
        returnUrl: `${process.env.NEXT_PUBLIC_URL}/api/aurinko/callback`
    })

    return `https://api.aurinko.io/v1/auth/authorize?${params.toString()}`
}

export const exchangeCodeForToken = async (code: string) => {
    try {
        const response = await axios.post(`https://api.aurinko.io/v1/auth/token/${code}`,{}, {
            auth: {
                username: process.env.AURINKO_CLIENT_ID!,
                password: process.env.AURINKO_CLIENT_SECRET!
            }
        })
        return response.data as {
            accountId: 0,
            accessToken: "string",
            userId: "string",
            userSession: "string"
        }
    } catch(error) {
        if(axios.isAxiosError(error)) {
            console.error(error.response?.data)
        }
        console.error('Unexpected error:', error)
        throw new Error('Failed to exchange code for token')
    }
}

export const getAccountInfo = async (accessToken: string) => {
    try {
        const response = await axios.get('https://api.aurinko.io/v1/account', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return response.data as {
            "id": 0,
            "parentId": 0,
            "serviceType": "Google",
            "serviceProvider": "Office365",
            "active": true,
            "tokenStatus": "active",
            "tokenError": "string",
            "type": "daemon",
            "daemon": true,
            "loginString": "string",
            "email": "string",
            "email2": "string",
            "mailboxAddress": "string",
            "name": "string",
            "name2": "string",
            "serverUrl": "string",
            "serverUrl2": "string",
            "clientOrgId": "string",
            "authUserId": "string",
            "authOrgId": "string",
            "timezone": "string",
            "tokenIssuedAt": "2019-08-24T14:15:22Z",
            "tokenLastActivity": "2019-08-24T14:15:22Z",
            }
    } catch (error) {
        if(axios.isAxiosError(error)) {
            console.error(error.response?.data)
            console.error('Failed to fetch account info:', error.message)
        }
        console.log('Unexpected error:', error)
    }
}