import './globals.css';
import Providers from './providers';

export const metadata = {
  title: 'Repair Capability Tracker',
  description: 'Employee device-repair certification tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
