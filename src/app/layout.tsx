import type { Metadata } from 'next';
import { Inter, Playfair_Display, Outfit, Roboto, Caveat } from 'next/font/google';
import './globals.css';
import BottomNav from '@/components/BottomNav';
import { ThemeProvider } from '@daily-journal/core';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-sans' });
const roboto = Roboto({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-roboto' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-handwriting' });

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
            <body className={`${outfit.variable} ${playfair.variable} ${inter.variable} ${roboto.variable} ${caveat.variable} font-sans antialiased`}>
                <ThemeProvider>
                    {children}
                    <BottomNav />
                </ThemeProvider>
            </body>
        </html>
    );
}
