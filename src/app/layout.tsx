import type { Metadata } from 'next';
import { Inter, Playfair_Display, Outfit, Roboto, Caveat } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import { ThemeProvider } from '@/core';

const inter = Inter({ subsets: ['latin'], variable: '--font-next-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-next-serif' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-next-sans' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-next-roboto' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-next-handwriting' });

export const metadata: Metadata = {
    title: 'DailyThoughts | Your Private Shared Sanctuary',
    description: 'A human-first sanctuary created for the mindful writer. No noise. No ads. Just heart. Build intimacy with a partner or reflect in deep solitude.',
    keywords: ['journaling', 'intimacy', 'private thoughts', 'couples journal', 'mindfulness', 'reflection'],
    authors: [{ name: 'DailyThoughts Sanctuary' }],
    metadataBase: new URL('https://dailythoughts.app'), // Placeholder production URL
    openGraph: {
        title: 'DailyThoughts | Your Private Shared Sanctuary',
        description: 'A private space for your truth. No likes, no noise, just presence.',
        type: 'website',
        url: 'https://dailythoughts.app',
        siteName: 'DailyThoughts',
        images: [
            {
                url: '/sanctuary-preview.jpg',
                width: 1200,
                height: 630,
                alt: 'DailyThoughts Sanctuary Preview',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'DailyThoughts | Your Private Shared Sanctuary',
        description: 'Quietly yours. A sacred space for your story.',
        images: ['/sanctuary-preview.jpg'],
    },
    themeColor: '#0A0F1E',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

import { Toaster } from 'sonner';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${outfit.variable} ${playfair.variable} ${inter.variable} ${roboto.variable} ${caveat.variable} antialiased`} style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                {/* Force global font application via direct style injection to bypass Tailwind layer specificity */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    :root {
                        --font-sans-fallback: 'Inter', sans-serif;
                    }
                    /* Force the dynamic font on EVERY element including Tailwind utility classes */
                    * {
                        font-family: var(--font-sans, var(--font-sans-fallback)) !important;
                    }
                `}} />
                <ThemeProvider>
                    {children}
                    <BottomNav />
                    <Toaster position="top-center" expand={false} richColors />
                </ThemeProvider>
            </body>
        </html>
    );
}
