"use client"
import { useSession, signIn } from "next-auth/react"
import { useEffect } from "react"

declare global {
    interface Window {
        google: any
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
                callback: async (response: any) => {
                    await signIn("google", {
                        redirect: false,
                    })
                },
                auto_select: true,        // Auto selects if only 1 account
                cancel_on_tap_outside: true,
                context: "signin",
                itp_support: true,        // iOS support
            })

            window.google.accounts.id.prompt((notification: any) => {
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
