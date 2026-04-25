'use client'

import React from 'react'
import { useLocalStorage } from 'usehooks-ts'
import { Nav } from './nav'
import { File, InboxIcon, Send } from 'lucide-react'

type Props = {isCollapsed: boolean}

export const Sidebar = ({isCollapsed}: Props) => {
    const [accountId] = useLocalStorage('accountId', '')
    const [tab] = useLocalStorage<'inbox' | 'draft' | 'sent'>('normalhuman-tab', 'inbox')
  return (
    <Nav 
        isCollapsed={isCollapsed}
        links={
            [
                {
                    title: 'Inbox',
                    label: '1',
                    icon: InboxIcon,
                    variant: tab === 'inbox'? 'default': 'ghost',
                },
                {
                    title: 'Draft',
                    label: '2',
                    icon: File,
                    variant: tab === 'draft'? 'default': 'ghost',
                },
                {
                    title: 'Sent',
                    label: '3',
                    icon: Send,
                    variant: tab === 'sent'? 'default': 'ghost',
                },
            ]
        }
    />
  )
}