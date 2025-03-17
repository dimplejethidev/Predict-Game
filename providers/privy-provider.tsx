"use client";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

import {PrivyProvider} from "@privy-io/react-auth";
// Make sure to import these from `@privy-io/wagmi`, not `wagmi`
import {WagmiProvider, createConfig} from "@privy-io/wagmi";

import {auroraTestnet, aurora, sepolia} from "viem/chains";
import {http} from "wagmi";

import type {PrivyClientConfig} from "@privy-io/react-auth";

export const privyConfig: PrivyClientConfig = {
  defaultChain: sepolia,
  supportedChains: [sepolia],
};
// Replace these with your app's chains

export const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});
const queryClient = new QueryClient();

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider appId="cm8cnhn2902k12trqxv9n4qzt" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
