# Evalo

> A synchronized, ephemeral coding environment designed for precision technical interviews.

Evalo is a modern platform for conducting technical interviews with real-time collaborative coding, video communication, and code execution capabilities. Built for interviewers and candidates to collaborate seamlessly in a shared coding environment.

## ✨ Features

### 🎯 Real-Time Collaboration
- **Live Code Editing**: Multiple users can edit code simultaneously with instant synchronization
- **Live Cursor Tracking**: See where other participants are typing in real-time with color-coded cursors
- **Synchronized Sessions**: All changes are instantly reflected across all connected participants

### 💻 Code Execution
- **Multi-Language Support**: Execute code in multiple programming languages including:
  - JavaScript
  - Python
  - Java
  - And more...
- **Real-Time Output**: Get instant feedback on code execution
- **Syntax Highlighting**: Powered by Monaco Editor with full IDE-like features

### 📹 Video Communication
- **Integrated Video Calls**: Built-in video conferencing for face-to-face interviews
- **Chat Functionality**: Text chat alongside video calls for better communication
- **Screen Sharing Ready**: Compatible with browser screen sharing features

### 📊 Session Management
- **Dashboard**: Comprehensive dashboard to manage all your interview sessions
- **Active Sessions**: View and join active coding sessions
- **Session History**: Track your recent interview sessions
- **Problem Library**: Curated collection of coding problems for interviews

### 🔐 Authentication & Security
- **Secure Authentication**: Powered by Clerk for enterprise-grade security
- **User Profiles**: Automatic user profile management
- **Session Privacy**: Each session is isolated and secure

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB database
- Clerk account (for authentication)
- Stream.io account (for video calls)
- Piston API access (for code execution)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ph03iA/Evalo.git
   cd evalo
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**

   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   DB_URL=your_mongodb_connection_string
   CLIENT_URL=http://localhost:5173
   VITE_API_URL=http://localhost:3000
   
   # Clerk Configuration
   CLERK_SECRET_KEY=your_clerk_secret_key
   
   # Stream.io Configuration
   STREAM_API_KEY=your_stream_api_key
   STREAM_API_SECRET=your_stream_api_secret
   
   # Inngest Configuration (optional)
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   ```

   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:3000
   ```

4. **Start the development servers**

   **Backend:**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## 📁 Project Structure

```
evalo/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── lib/             # Utilities and configurations
│   │   ├── middleware/      # Express middleware
│   │   ├── models/          # MongoDB models
│   │   ├── routes/          # API routes
│   │   └── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/             # API client functions
│   │   ├── components/      # React components
│   │   ├── data/            # Static data (problems, etc.)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   └── package.json
└── package.json
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Monaco Editor** - Code editor (VS Code editor)
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **TanStack Query** - Data fetching and caching
- **Clerk** - Authentication
- **Stream.io** - Video calls and chat

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Clerk** - Authentication middleware
- **Stream.io** - Video and chat backend

## 🎮 Usage

### Creating a Session

1. Log in to your account
2. Navigate to the Dashboard
3. Click "Create Session"
4. Select a coding problem
5. Share the session link with the candidate

### Joining a Session

1. Click on an active session from the dashboard
2. Or use the session link provided by the host
3. The editor will automatically sync with other participants

### Running Code

1. Write your code in the editor
2. Select the programming language
3. Click the "Run" button
4. View the output in the output panel

## 🔧 Configuration

### Code Execution

The application uses Piston API for code execution. Make sure your Piston API endpoint is configured correctly in `frontend/src/lib/piston.js`.

### Video Calls

Stream.io is used for video communication. Configure your Stream.io credentials in the backend environment variables.

### Database

MongoDB is used for storing sessions and user data. Ensure your MongoDB connection string is correctly set in the backend `.env` file.

## 📝 API Endpoints

### Sessions
- `GET /api/sessions/active` - Get all active sessions
- `GET /api/sessions/my-recent` - Get user's recent sessions
- `GET /api/sessions/:id` - Get session by ID
- `POST /api/sessions` - Create a new session
- `POST /api/sessions/:id/join` - Join a session
- `POST /api/sessions/:id/end` - End a session

### Chat
- `GET /api/chat/token` - Get Stream.io token for chat

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This will:
1. Install all dependencies
2. Build the frontend for production
3. Prepare the backend for deployment

### Start Production Server

```bash
npm start
```

Make sure to set `NODE_ENV=production` in your environment variables.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Made with ❤️ for technical interviews

