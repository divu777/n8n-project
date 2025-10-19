import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "@/components/Provider";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "AgentFlow - Visual AI Workflow Automation",
  description:
    "AgentFlow is a visual workflow automation platform built with Next.js, LangChain, LangGraph, and Prisma. Featuring a drag-and-drop interface powered by React Flow, it enables users to create, manage, and execute intelligent workflows with LLM and manual trigger nodes. Deployed on DigitalOcean with Docker and CI/CD for fast, reliable performance.",
  authors: [{ name: "Divakar Jaiswal" }],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
