# Repo Resume

A web app that transforms your GitHub profile into a clean, visual portfolio. Built with **Next.js**,**Tailwind CSS**, **TypeScript**, and **shadcn/ui**.

Enter a GitHub username → instantly fetch profile + repositories → view a polished card-based layout with repo stats, language tags, and last updated dates → export the whole portfolio as a shareable image.

## Features

- **GitHub integration** – Fetches user profile + public repositories directly from the GitHub API.
- **UI/UX** – Styled with **shadcn/ui** components, responsive and minimal.
- **Card-based repo showcase** – Each repository is displayed with name, description, stars, forks, language, and updated date.
- **Loading states** – Custom skeleton loaders for smooth UX while data fetches.
- **Portfolio export** – Generate and download a polished resume-style image of your GitHub profile + repos.

## Tech Stack

- **Next.js 15** (App Router, Client Components)
- **TypeScript** for type safety
- **shadcn/ui** for accessible, modern UI components
- **Lucide Icons** (for stars, forks, links)
- **html-to-image** for client-side export/download functionality
