'use client'

import UseThreads from '@/hooks/use-threads'
import React, { type ComponentProps } from 'react'
import DOMPurify from 'dompurify';
import {format, formatDistanceToNow} from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from 'lucide-react';

const ThreadList = () => {
    const {threads} = UseThreads()
    const groupedThreads = threads?.reduce((acc, thread) => {
        const date = format(thread.emails[0]?.sentAt ?? new Date(), 'dd-MM-yyyy')
        acc[date] ??= [];
        acc[date].push(thread)
        
         return acc
    }, {} as Record<string, typeof threads>)
    console.log(groupedThreads)
  return (
    <div className="max-w-full overflow-y-scroll max-h-[calc(100vh-120px)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {Object.entries(groupedThreads ?? {}).map(([date, threads]) => (
          <React.Fragment key={date}>
            <div className="text-xs font-medium text-muted-foreground mt-4 first:mt-0">
              {format(new Date(), 'dd-MM-yyyy')}
            </div>
            {threads.map((item) => (
              <button
                id={`thread-${item.id}`}
                key={item.id}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all relative"
                )}
              >
                <div className="flex flex-col w-full gap-1">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold">
                        {item.emails.at(-1)?.from?.name}
                      </div>
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs text-foreground"
                      )}
                    >
                      {formatDistanceToNow(item.emails.at(-1)?.sentAt ?? new Date(), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <div className="text-xs font-medium">{item.subject}</div>
                </div>
                <div
                  className="text-xs line-clamp-2 text-muted-foreground"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(item.emails.at(-1)?.bodySnippet ?? "", {
                      USE_PROFILES: { html: true },
                    }),
                  }}
                ></div>
                {item.emails[0]?.sysLabels.length ? (
                  <div className="flex items-center gap-2">
                    {item.emails.at(0)?.sysLabels.map((label) => (
                      <Badge
                        key={label}
                        fontVariant={getBadgeVariantFromLabel(label)}
                      >
                        {label}
                      </Badge>
                    ))}
                  </div>
                ) : null}
              </button>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
function getBadgeVariantFromLabel(
  label: string
): ComponentProps<typeof Badge>["fontVariant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}
export default ThreadList