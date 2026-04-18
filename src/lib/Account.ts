import axios from "axios"

export class Account {
    private accessToken: string
    
    constructor(accessToken: string) {
        this.accessToken = accessToken
    }

    async waitForAccountReady(accessToken: string, timeoutMs = 120_000, intervalMs = 5000) {
            const start = Date.now()
            while (Date.now() - start < timeoutMs) {
                const resp = await axios.get('https://api.aurinko.io/v1/account', {
                    headers: { Authorization: `Bearer ${accessToken}` }
                })
                const { tokenStatus, active } = resp.data
                console.log('Token status:', tokenStatus, 'active:', active)
                if (active === true && tokenStatus === 'active') return true
                await new Promise(r => setTimeout(r, intervalMs))
            }
            return false
     }

    private async startSync() {
        const response = await axios.post('https://api.aurinko.io/v1/email/sync',{}, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            },
            params: {
                daysWithin: 2,
                bodyType: 'html'
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.data
    }

    async getUpdatedEmails ({deltaToken, pageToken}: {deltaToken?: string, pageToken?: string}) {
        const params: Record<string, string> = {}
        if(deltaToken) {
            params.deltaToken = deltaToken
        }
        if(pageToken) {
            params.pageToken = pageToken
        }

        const response = await axios.get('https://api.aurinko.io/v1/email/sync/updated', {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            },
            params
        })

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return response.data

    }

    async performInitialSync(timeoutMs = 120_000) {
        try {
            const start = Date.now()
            let attempt = 0
            const maxBackoff = 10_000
            let syncResponse: any = undefined

            // Tenta iniciar o sync até timeout, com backoff se a conta ainda não estiver inicializada
            while (Date.now() - start < timeoutMs) {
                try {
                    syncResponse = await this.startSync()
                } catch (err) {
                    attempt++
                    if (axios.isAxiosError(err)) {
                        const apiMsg = err.response?.data?.message ?? err.response?.data?.code ?? ''
                        if (typeof apiMsg === 'string' && apiMsg.toLowerCase().includes('not initialized')) {
                            const backoff = Math.min(2000 * attempt, maxBackoff)
                            console.warn(`Aurinko: account not initialized yet, retrying startSync in ${backoff}ms (attempt ${attempt})`)
                            await new Promise(r => setTimeout(r, backoff))
                            continue
                        }
                    }
                    console.error('Unexpected error from startSync:', err)
                    throw err
                }

                // se startSync retornou, aguarda até que o processo esteja "ready"
                if (!syncResponse?.ready) {
                    await new Promise(r => setTimeout(r, 3000))
                    continue
                }

                // ready === true -> saiu do loop
                break
            }
            console.log('sync respose received, fetching emails...', syncResponse)
            // get the bookmark deltaToken received
            let storedDeltaToken: string = syncResponse.syncUpdatedToken
            let updatedResponse = await this.getUpdatedEmails({deltaToken: storedDeltaToken})
            
            if(updatedResponse.nextDeltaToken) {
                // sync has completed
                storedDeltaToken = updatedResponse.nextDeltaToken
            }

            let allEmails = updatedResponse.records
            
            while(updatedResponse.nextPageToken) {
                updatedResponse = await this.getUpdatedEmails({pageToken: updatedResponse.nextPageToken})
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                allEmails = allEmails.concat(updatedResponse.records)
                if(updatedResponse.nextDeltaToken) {
                    storedDeltaToken = updatedResponse.nextDeltaToken
                }
            }

            console.log('initial sync completed, total emails fetched:', allEmails.length)

            return {
                emails: allEmails,
                deltaToken: storedDeltaToken
            }
        } catch (error) {
            if(axios.isAxiosError(error)) {
                console.error('Error response from Aurinko API:', error.response?.data)
            }
            console.error('Unexpected error during initial sync:', error)
        }
    }
}