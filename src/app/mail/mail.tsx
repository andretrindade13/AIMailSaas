'use client'

import React from 'react'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable'
import {TooltipProvider} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AccountSwitcher from './account-switcher'
import { Sidebar } from './sidebar'

type Props = {
    defaultLayout: number[] | undefined
    navCollapsedSize?: number
    defaultColapsed?: boolean
}



function Mail({defaultLayout = [20,32,48], navCollapsedSize, defaultColapsed = false}: Props) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultColapsed)
  return (
    <TooltipProvider delayDuration={0}>
    <ResizablePanelGroup 
        orientation='horizontal' 
        className="itens-stretch h-full min-h-screen">
            <ResizablePanel 
                defaultSize={defaultLayout[0]}
                collapsedSize={navCollapsedSize}
                collapsible={true}
                minSize={15}
                maxSize={40}
                onResize={() => {
                    setIsCollapsed(false)
                    document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
                    false
                    )}`
                }}
                className={cn(
                    isCollapsed &&
                    "min-w-[50px] transition-all duration-300 ease-in-out"
                )}
            >
                <div className='flex flex-col h-full flex-1'>
                    <div className='flex h-[56px] items-center justify-between px-4 py-2'>
                        <AccountSwitcher isCollapsed={isCollapsed} />
                    </div>
                    <Separator/>
                    {/** Sidebar */}
                    <Sidebar isCollapsed={isCollapsed} />
                    <div className='flex-1'></div>
                    {/** Ai */}
                    Ask AI
                </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={defaultLayout[1]} minSize={30} maxSize={70} > 
                <Tabs defaultValue='inbox'>
                    <div className='flex items-center px-4 py-2'>
                        <h1 className='text-x1 font-bold'>Inbox</h1>
                        <TabsList className='ml-auto'>
                            <TabsTrigger value='inbox' className='text-xinc-600 dark:text-zinc-200'>Inbox</TabsTrigger>
                            <TabsTrigger value='done' className='text-xinc-600 dark:text-zinc-200'>Done</TabsTrigger>
                        </TabsList>
                    </div>
                    <Separator />
                    {/** Search bar*/}
                    Search Bar
                    <TabsContent value='inbox'>
                        Inbox
                    </TabsContent>
                    <TabsContent value='done'>
                        Done
                    </TabsContent>
                </Tabs>
            </ResizablePanel>
            <ResizableHandle withHandle /> 
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={30} maxSize={70}>
                thread display  
            </ResizablePanel>
    </ResizablePanelGroup> 
    </TooltipProvider>
  )
}

export default Mail