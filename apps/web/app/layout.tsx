import "@workspace/ui/globals.css";

import { geistMono, inter, satoshi } from "@/styles/fonts";
import { Providers } from "@/components/providers";
import { cn } from "@workspace/utils/functions/cn";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(satoshi.variable, inter.variable, geistMono.variable)}
      >
        {/* {children} */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
