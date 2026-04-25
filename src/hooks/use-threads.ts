'use client'

import { api } from '@/trpc/react'
import { useLocalStorage } from 'usehooks-ts'

const UseThreads = () => {
  const { data: account} = api.account.getAccounts.useQuery()
  const [accountId] = useLocalStorage('accountId', '')
  const [tab] = useLocalStorage('normalhuman-tab', 'inbox')
  const [done] = useLocalStorage('normalhuman-done', false)

  const {data: threads, refetch, isFetching} = api.account.getThreads.useQuery({accountId, tab, done}, {
    enabled: !!accountId && !!tab, placeholderData: e => e, refetchInterval: 5000
  })

  return {
    threads,
    refetch,
    isFetching,
    accountId,
    account: account?.find(a => a.id === accountId),
  }
}

export default UseThreads