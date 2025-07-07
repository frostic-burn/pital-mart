import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { Header } from "@/components/layout/header" // ✅ Correct path
import { Footer } from "@/components/layout/footer" // ✅ Correct path
import { ToastContainer } from 'react-toastify';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PITAL MART - Premium Brass Products",
  description:
    "Discover exquisite handcrafted brass products at PITAL MART. From traditional utensils to modern decor, find authentic brass items for your home.",
  keywords:
    "brass products, brass utensils, brass decor, handcrafted brass, traditional brass, pital mart",
  authors: [{ name: "PITAL MART" }],
  creator: "PITAL MART",
  publisher: "PITAL MART",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://pitalmart.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PITAL MART - Premium Brass Products",
    description:
      "Discover exquisite handcrafted brass products at PITAL MART. From traditional utensils to modern decor, find authentic brass items for your home.",
    url: "https://pitalmart.com",
    siteName: "PITAL MART",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PITAL MART - Premium Brass Products",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PITAL MART - Premium Brass Products",
    description:
      "Discover exquisite handcrafted brass products at PITAL MART. From traditional utensils to modern decor, find authentic brass items for your home.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lancelot&display=swap"
          rel="stylesheet"
        />

        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {/* Razorpay */}
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
          <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
            <Header /> {/* 👑 Now visible */}
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
