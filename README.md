# Wedsy Admin

## Introduction

This repository contains the source code for a NextJS Admin Dashboard Website for Wedsy.

## Prerequisites

Before running the application, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node.js package manager)

## Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/nikhilagarwal204/wedsy-admin.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd wedsy-admin
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` or `.env.local` (for development) file in the root of the project and add the following environment variables:

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_WEBSITE_URL=
```

Make sure to replace the placeholder values with your actual configuration.

## Run

To start the server, use the following command:

```bash
npm run start
```

## Development

For development purposes, you can use the following command to run the server with hot-reloading:

```bash
npm run dev
```

This will start the server at http://localhost:3000.
