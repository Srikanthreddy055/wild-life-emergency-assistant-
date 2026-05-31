// Next.js Root Layout Configurator
import './globals.css';

export const metadata = {
  title: 'Wildlife Emergency Assistant',
  description: 'Protecting Wildlife Through Smart Emergency Response. AI-powered diagnostics, maps locator, and dispatch networks.',
  viewport: 'width=device-width, initial-scale=1'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body class="bg-navy-dark text-gray-100 min-h-screen flex flex-col font-body">
        <main class="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
