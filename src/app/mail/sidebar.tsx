'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import { File, InboxIcon, Send } from 'lucide-react'
import { api } from '@/trpc/react'

type Props = {isCollapsed: boolean}

export const Sidebar = ({isCollapsed}: Props) => {
    const [accountId] = useLocalStorage('accountId', '')
    const [tab] = useLocalStorage<'inbox' | 'draft' | 'sent'>('normalhuman-tab', 'inbox')
    const {data: inboxThreads} = api.account.getNumThreads.useQuery({accountId, tab: 'inbox'}, {
        enabled: !!accountId
    })
    const {data: sentThreads} = api.account.getNumThreads.useQuery({accountId, tab: 'sent'}, {
        enabled: !!accountId
    })
    const {data: draftsThreads} = api.account.getNumThreads.useQuery({accountId, tab: 'drafts'}, {
        enabled: !!accountId
    })
  return (
    <Nav 
        isCollapsed={isCollapsed}
        links={
            [
                {
                    title: 'Inbox',
                    label: inboxThreads? inboxThreads.toString() : undefined,
                    icon: InboxIcon,
                    variant: tab === 'inbox'? 'default': 'ghost',
                },
                {
                    title: 'Draft',
                    label: draftsThreads? draftsThreads.toString() : undefined,
                    icon: File,
                    variant: tab === 'draft'? 'default': 'ghost',
                },
                {
                    title: 'Sent',
                    label: sentThreads? sentThreads.toString() : undefined,
                    icon: Send,
                    variant: tab === 'sent'? 'default': 'ghost',
                },
            ]
        }
    />
  )
}