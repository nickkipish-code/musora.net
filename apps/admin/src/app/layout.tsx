import './globals.css';
import Header from './Header';

export const metadata = {
  title: 'Museum Admin',
  description: 'Admin panel for Museum Delivery',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <script dangerouslySetInnerHTML={{ __html: `if (window.__SENTRY_DSN) { /* client Sentry will initialize via separate bundle */ }` }} />
      </body>
    </html>
  );
}


