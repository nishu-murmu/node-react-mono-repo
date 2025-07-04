# Turborepo React, Node/Express, and Supabase Example

This is a boilerplate monorepo demonstrating an integration of a React frontend, a Node.js/Express backend API, and Supabase for the database, all managed with Turborepo.

## Project Structure

-   `apps/web`: A React application built with Vite. This is the frontend.
-   `apps/api`: A Node.js/Express application serving as the backend API. It connects to Supabase.
-   `packages/`: This directory is available for shared packages (e.g., UI components, utils), though none are implemented in this basic example. (This directory may have been removed if no shared packages were used from the starter).

## Prerequisites

-   Node.js (v18 or higher recommended)
-   npm (comes with Node.js)
-   A Supabase account and a project.

## Setup Instructions

1.  **Clone the Repository (or Unzip if downloaded):**
    If you are viewing this, you likely have the files already.

2.  **Install Dependencies:**
    Navigate to the root of the monorepo (`turbo-supabase-example`) and install all dependencies:
    ```bash
    npm install
    ```

3.  **Set up Supabase:**
    *   **Create a Supabase Project:** If you haven't already, create a new project on [Supabase](https://supabase.com/).
    *   **Create `items` Table:** In your Supabase project's SQL Editor (under "SQL Editor" > "New query"), run the following SQL to create an `items` table:
        ```sql
        CREATE TABLE items (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );
        ```
        *(Note: The `created_at` column is good practice but not strictly used by the current example UI.)*
    *   **Get Supabase Credentials:**
        1.  Go to your Supabase project dashboard.
        2.  Navigate to **Project Settings** (gear icon in the bottom left sidebar).
        3.  Click on **API** in the sidebar.
        4.  Under **Project API keys**, you'll find your `anon (public)` key.
        5.  Under **Configuration** > **URL**, you'll find your Project `URL`.

4.  **Configure Backend Environment Variables:**
    *   In the `apps/api/` directory, create a `.env` file. You can copy `apps/api/.env.example` if it exists, or create `apps/api/.env` manually.
    *   Add your Supabase credentials to `apps/api/.env`:
        ```env
        SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
        SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
        ```
        Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_PUBLIC_KEY` with your actual credentials.
        **Important:** The `.env` file is already in `.gitignore` to prevent committing your secrets.

## Development

To start both the React frontend and the Node/Express backend in development mode, run the following command from the **root** of the monorepo:

```bash
npm run dev
```

This uses Turborepo to start:
-   The React/Vite app (usually on `http://localhost:5173` or the next available port if 5173 is busy). The terminal output will show the correct address.
-   The Node/Express API server (on `http://localhost:3001`).

**Accessing the Application:**
-   Open your browser and go to the URL output by the Vite development server for the `web` app (e.g., `http://localhost:5173`).
-   You should see a simple interface to add items and view the list of items fetched from your Supabase database via the backend API. If the API or Supabase connection has issues, check the console in your browser and the terminal where `npm run dev` is running.

## Building for Production

To build all applications for production, run from the root:

```bash
npm run build
```
This will create optimized builds in:
-   `apps/web/dist` for the React app.
-   The `api` app does not have a separate build step in this example; it's run directly by Node in production environments (e.g. `npm run start` within `apps/api` after installing dependencies).

## Linting

To lint the code in all relevant packages (currently primarily the `web` app), run from the root:

```bash
npm run lint
```

## How the Example API Works

-   **Frontend (React - `apps/web`):**
    -   Located in `apps/web/src/App.jsx`.
    -   Makes a `GET` request to `/api/items` to fetch items. The `/api` prefix is proxied by Vite's dev server to `http://localhost:3001/api/items`.
    -   Makes a `POST` request to `/api/items` with a JSON body `{ "name": "New Item Name" }` to add an item.
-   **Backend (Node/Express - `apps/api`):**
    -   Main file is `apps/api/index.js`.
    -   Supabase client is configured in `apps/api/src/supabaseClient.js` using environment variables from `apps/api/.env`.
    -   Listens on port `3001` (configurable via `PORT` env var).
    -   Handles `GET /api/items`: Fetches all records from the `items` table in Supabase.
    -   Handles `POST /api/items`: Inserts a new record into the `items` table in Supabase.
-   **Supabase:**
    -   Provides the PostgreSQL database.
    -   The `items` table (which you created) stores the data.

This setup demonstrates a full-stack interaction within a Turborepo monorepo.
Remember to check your Supabase project's RLS (Row Level Security) policies if you encounter permission issues. For this example, public tables with default (or no) RLS might work, but for production, you should always configure appropriate RLS rules.
