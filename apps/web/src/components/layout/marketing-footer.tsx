import Link from "next/link";

import { marketingNavItems } from "@/components/navigation/nav-items";
import { appRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="font-mono text-lg font-semibold">{siteConfig.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">{siteConfig.description}</p>
          </div>
          <div>
            <p className="text-sm font-medium">Product</p>
            <ul className="mt-3 space-y-2">
              {marketingNavItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-sm font-medium">App</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href={appRoutes.dashboard} className="text-sm text-muted-foreground hover:text-foreground">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-border pt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
