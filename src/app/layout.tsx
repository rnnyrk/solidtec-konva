import './global.css';

import type * as i from 'types';
import { Inter } from 'next/font/google';

import { cn } from 'utils';
import { RootLayout } from 'modules/layouts/RootLayout';

const inter = Inter({ subsets: ['latin'] });

const siteName = 'Ronny Rook';

export const metadata = {
  title: {
    default: `Konva tryout | ${siteName}`,
    template: `%s | ${siteName}`,
  },
  description: 'Javascript developer from Amsterdam',
  icons: {
    icon: '/images/favicon/favicon-32x32.png',
    shortcut: '/images/favicon/favicon.ico',
    apple: '/images/favicon/apple-touch-icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/images/favicon/safari-pinned-tab.svg',
      },
    ],
  },
};

const Layout = ({ children }: Props) => {
  return (
    <html
      lang="en"
      className={cn('text-black bg-white dark:text-white dark:bg-[#111111]', inter.className)}
    >
      <head />
      <RootLayout>{children}</RootLayout>
    </html>
  );
};

type Props = i.NextPageProps<{
  children: React.ReactNode;
}>;

export default Layout;
