import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://www.alphaprime.co.in'
    const now = new Date()

    return [
        // Static pages — trailing slashes to match trailingSlash: true in next.config
        { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
        { url: `${baseUrl}/about/`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
        { url: `${baseUrl}/contact/`, lastModified: now, changeFrequency: 'yearly', priority: 0.6 },
        { url: `${baseUrl}/roadmap/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/changelog/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/faq/`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
        { url: `${baseUrl}/privacy/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/terms/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/cookies/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
        { url: `${baseUrl}/disclaimer/`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },

        // Tool pages — trailing slashes, high priority
        { url: `${baseUrl}/tools/word-counter/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/password-generator/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/image-resizer/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/base64/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/case-converter/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/online-compiler/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/color-tools/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/diff-checker/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/primelink/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/tools/link-vault/`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },

        // Blog Index
        { url: `${baseUrl}/blog/`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },

        // Dynamic Blog Articles
        ...blogPosts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}/`,
            lastModified: now,
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        })),
    ]
}
