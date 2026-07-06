# Farhan AI Assistant

A full-stack AI portfolio assistant built with React, Node.js, Express, and the Groq API. The project is being upgraded from a basic chatbot into a polished assistant that can explain Farhan Bin Hossain's projects, skills, and experience.

## Current Features

- React chat interface
- Express API server
- Groq-powered AI responses
- Copy response action
- Typing indicator
- Responsive sidebar layout
- Environment-based API configuration
- Basic backend validation and production safe errors

## Tech Stack

- Frontend: React, Axios, CSS
- Backend: Node.js, Express
- AI: Groq API, LLaMA 3.3 70B
- Deployment: Vercel frontend, Render backend

## Project Structure

```txt
client/   React frontend
server/   Express API
```

## Environment Variables

Create a `server/.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
CLIENT_ORIGIN=http://localhost:3000
```

Create a `client/.env` file:

```env
REACT_APP_API_URL=http://localhost:3001
```

For production, set `REACT_APP_API_URL` to your deployed backend URL and set `CLIENT_ORIGIN` to your deployed frontend URL.

## Local Setup

Install and run the backend:

```bash
cd server
npm install
npm start
```

Install and run the frontend:

```bash
cd client
npm install
npm start
```

## Roadmap

- Redesign the UI to match Farhan's portfolio style
- Add conversation memory
- Add saved chats
- Add markdown and code rendering
- Add a portfolio knowledge base
- Add assistant modes for recruiters, developers, and project browsing
- Add rate limiting and stronger production hardening
- Add screenshots and architecture diagram

## Links

- Portfolio: https://www.farhanbin.dev
- GitHub: https://github.com/farhanbin65
