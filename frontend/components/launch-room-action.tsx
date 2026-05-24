import type { PropsWithChildren } from "react";

import { siteConfig } from "@/lib/site";

type LaunchRoomActionProps = PropsWithChildren<{
  className: string;
  ariaLabel?: string;
  formClassName?: string;
}>;

export function LaunchRoomAction({
  children,
  className,
  ariaLabel,
  formClassName
}: LaunchRoomActionProps) {
  return (
    <form action={siteConfig.roomLaunchPath} className={formClassName}>
      <button type="submit" className={`button-reset ${className}`} aria-label={ariaLabel}>
        {children}
      </button>
    </form>
  );
}
