import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'MCQCyber - Platform Ujian & Simulasi Cyber Security',
  description:
    'Platform latihan dan simulasi ujian Cyber Security berbasis MCQ tanpa akun permanen. Mendukung Solo Practice dan Team Challenge multiplayer.',
  icons: {
    icon: '/assets/logo.jpg',
    apple: '/assets/logo.jpg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-cyber-bg text-cyber-text antialiased selection:bg-cyber-primary selection:text-white">
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
