"use client"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: {
                        client_id: string;
                        callback: (response: unknown) => void;
                        auto_select?: boolean;
                        cancel_on_tap_outside?: boolean;
                        context?: string;
                        itp_support?: boolean;
                    }) => void;
                    prompt: (callback?: (notification: {
                        isNotDisplayed: () => boolean;
                        getNotDisplayedReason: () => string;
                        isSkippedMoment: () => boolean;
                        getSkippedReason: () => string;
                    }) => void) => void;
                    cancel: () => void;
                }
            }
        }
    }
}

export default function GoogleOneTap() {
    const { status } = useSession()

    useEffect(() => {
        // Only show if not logged in
        if (status === "authenticated") return
        if (status === "loading") return

        const initializeOneTap = () => {
            if (!window.google) return

            window.google.accounts.id.initialize({
                client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
                callback: async () => {
                    await signIn("google", {
                        redirect: false,
                    })
                },
                auto_select: true,        // Auto selects if only 1 account
                cancel_on_tap_outside: true,
                context: "signin",
                itp_support: true,        // iOS support
            })

            window.google.accounts.id.prompt((notification) => {
                if (notification.isNotDisplayed()) {
                    console.log("One Tap not displayed:",
                        notification.getNotDisplayedReason())
                }
                if (notification.isSkippedMoment()) {
                    console.log("One Tap skipped:",
                        notification.getSkippedReason())
                }
            })
        }

        // Load Google script
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = initializeOneTap
        document.head.appendChild(script)

        return () => {
            // Cleanup
            if (window.google) {
                window.google.accounts.id.cancel()
            }
        }
    }, [status])

    return null // No visible UI, just script
}
