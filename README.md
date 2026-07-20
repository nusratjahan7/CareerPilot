# CareerPilot Server

A lightweight backend service for the CareerPilot platform, designed to support the frontend experience hosted at the live preview:

- Live Preview: https://career-pilot-pnjm.vercel.app
- Backend Repository: https://github.com/nusratjahan7/CareerPilot-Server

## Overview

CareerPilot is an AI-powered career discovery and job-preparation platform that helps users explore career paths, find opportunities, and improve their job search readiness. The backend server provides the API layer that supports the web application's authentication, application logic, and data-driven features.

This repository is intentionally small and deployment-focused, making it a clean backend entry point for a serverless Vercel deployment.

## What the Backend Does

The server is responsible for:

- Handling API requests from the CareerPilot frontend
- Supporting authentication and protected routes
- Exposing backend endpoints for the main app workflow
- Serving as the deployment-ready backend layer for the live website

## Tech Stack

- JavaScript
- Node.js
- Vercel deployment
- Serverless API hosting

## Project Structure

The repository is centered around a simple server entry point and deployment configuration:

- `index.js` – main server entry file
- `package.json` – project scripts and dependencies
- `vercel.json` – Vercel deployment configuration

## Local Development

Clone the repository:

```bash
git clone https://github.com/nusratjahan7/CareerPilot-Server.git
cd CareerPilot-Server
npm install
```

Run the server locally:

```bash
npm run dev
```

If the project uses a production start script, you can also run:

```bash
npm start
```

## Environment Variables

If your backend depends on external services or secrets, configure them in a `.env` file before deployment or local execution.

Example:

```env
PORT=3000
```

Add any required API keys, database credentials, or auth secrets according to your deployment setup.

## Deployment

This backend is designed for deployment on Vercel. The `vercel.json` file is included to support a smooth serverless deployment flow.

## Live Site

The frontend experience is available here:

https://career-pilot-pnjm.vercel.app

## Notes

This backend is a companion service for the CareerPilot frontend experience. If you are working on the full product, the frontend and backend should be kept aligned when adding endpoints, auth flows, or new data-driven features.

## License

This project does not currently declare a specific license in the repository metadata. Please check the GitHub repository for the latest licensing information.
