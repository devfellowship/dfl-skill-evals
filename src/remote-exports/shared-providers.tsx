import React, { ReactNode, useState, createContext, useContext } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "@/components/providers/AuthProvider"

interface RemoteProps {
  hideHeader?: boolean
}

const RemotePropsContext = createContext<RemoteProps | null | undefined>(undefined)

export function useRemoteProps(): RemoteProps | null {
  return useContext(RemotePropsContext)
}

export function useModuleFederation(): boolean {
  const remoteProps = useContext(RemotePropsContext)
  return remoteProps !== undefined
}

interface RemoteProviderWrapperProps {
  children: ReactNode
  basePath?: string
  remoteProps?: RemoteProps
}

export const RemoteProviderWrapper: React.FC<RemoteProviderWrapperProps> = ({
  children,
  basePath = "/dashboard",
  remoteProps,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <RemotePropsContext.Provider value={remoteProps !== undefined ? remoteProps : {}}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </RemotePropsContext.Provider>
    </QueryClientProvider>
  )
}
