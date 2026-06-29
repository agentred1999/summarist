import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './style.css';
import ClientProvider from '@/components/ClientProvider';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import AuthModal from '@/components/auth/AuthModal';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Summarist - Book Summaries at Your Fingertips',
  description: 'Get book summaries in minutes. Read or listen to the best books in a fraction of the time.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ClientProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <AuthModal />
        </ClientProvider>
      </body>
    </html>
  );
}
