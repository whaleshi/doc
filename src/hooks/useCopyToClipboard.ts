import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useCopyToClipboard(resetDelay = 1000) {
    const [copiedText, setCopiedText] = useState<string | null>(null);

    const copyToClipboard = useCallback(
        async (text: string, showToast = true) => {
            if (!navigator?.clipboard) {
                console.warn("Clipboard API not supported");
                return false;
            }

            try {
                await navigator.clipboard.writeText(text);
                setCopiedText(text);

                if (showToast) toast.success("复制成功");

                setTimeout(() => setCopiedText(null), resetDelay);
                return true;
            } catch (err) {
                if (showToast) toast.error("复制失败");
                return false;
            }
        },
        [resetDelay]
    );

    return { copiedText, copyToClipboard };
}
