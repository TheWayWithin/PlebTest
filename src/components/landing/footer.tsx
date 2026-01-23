import Link from "next/link"
import { Twitter, Linkedin } from "lucide-react"

const footerLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Contact", href: "mailto:hello@plebtest.com" },
]

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/plebtest", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/plebtest", icon: Linkedin },
]

export function Footer() {
  return (
    <footer className="bg-slate-900 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold text-white">
            PlebTest
          </Link>

          {/* Links */}
          <nav className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2" aria-label="Footer">
            {footerLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Social Links */}
          <div className="mt-6 flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={social.name}
              >
                <social.icon className="h-5 w-5" aria-hidden="true" />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="mt-8 text-sm text-slate-500">
            &copy; {new Date().getFullYear()} PlebTest. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
