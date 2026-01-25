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
    title: 'DailyThoughts',
    description: 'A private journal to write your truth. Share it with a partner to build intimacy, or keep it solo for deep reflection. No likes. No comments. Just presence.',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

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
                </ThemeProvider>
            </body>
        </html>
    );
}
