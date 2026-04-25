'use client'

import React from 'react'
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from '@/components/ui/resizable'
import {TooltipProvider} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AccountSwitcher from './account-switcher'

type Props = {
    defaultLayout: number[] | undefined
    navColapsedSize?: number
    defaultColapsed?: boolean
}



function Mail({defaultLayout = [20,32,48], navColapsedSize, defaultColapsed}: Props) {
    const [isColapsed, setIsCollapsed] = React.useState(defaultColapsed)
  return (
    <TooltipProvider delayDuration={0}>
    <ResizablePanelGroup  
        onLayoutChange={(sizes) => console.log('Panel sizes changed:', sizes)}
        className="itens-stretch h-full min-h-screen">
            <ResizablePanel 
                defaultSize={defaultLayout[0]} collapsedSize={navColapsedSize} 
                collapsible={true}
                minSize={15}
                maxSize={40}
                onResize={() => {
                    if(isColapsed) setIsCollapsed(false)
                }}
                className={cn('min-w-[52px] transition-all duration-300 ease-in-out')}
            >
                <div className='flex flex-col h-full flex-1'>
                    <div className='flex h-[56px] items-center justify-between px-4 py-2'>
                        <AccountSwitcher isCollapsed={isColapsed} />
                    </div>
                    <Separator/>
                    {/** Sidebar */}
                    Sidebar
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