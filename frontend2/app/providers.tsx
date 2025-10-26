"use client"

import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "@/lib/query-client"
import { useRef } from "react"
import { AppStore, makeStore } from "@/redux/store"
import { Provider } from "react-redux"

export function Providers({ children }: { children: React.ReactNode }) {

  const storeRef = useRef<AppStore | null>(null)
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  )
}

