export function normalizeUrl(url: string): string {
    try {
        const parsed = new URL(url);
        parsed.hostname = parsed.hostname.toLowerCase();

        let normalized = parsed.toString();

        // Remove trailing slash
        if (normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }

        return normalized;
    } catch {
        // Fallback if somehow not a valid URL
        let normalized = url.trim();
        // lower case domain roughly
        try {
            const match = normalized.match(/^(https?:\/\/)([^/]+)(.*)$/i);
            if (match) {
                normalized = match[1].toLowerCase() + match[2].toLowerCase() + match[3];
            }
        } catch {
            // ignore
        }
        if (normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized;
    }
}
