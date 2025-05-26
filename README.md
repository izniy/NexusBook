# 📘 NexusBook – A Friendly Contacts Manager

NexusBook is a modern, full-stack contact management application that helps you organize and interact with your contacts through a beautiful, responsive interface.

## ✨ Features

- 👥 Browse contacts with a modern card-based layout
- ⭐ Mark important contacts as favorites
- 🔍 Search contacts by name or email
- 📊 Sort contacts by various criteria
- 📱 Fully responsive design
- ⚡ Real-time feedback and smooth transitions

## 🎯 Design Decisions

### Architecture
- **Frontend/Backend Split**: Separated for clear concerns, independent scaling, and easier maintenance. This allows the frontend to focus on UX while the backend handles data and business logic.
- **Stateless Design**: No persistent storage needed, demonstrating clean architecture without database complexity.

### Technology Choices
- **NestJS Backend**: Chosen for its robust architecture, TypeScript support, and excellent developer experience with decorators and dependency injection.
- **React + Redux Frontend**: Provides predictable state management and component reusability, essential for a responsive contact manager.
- **Vite**: Offers superior development experience with instant HMR and optimized production builds.
- **In-Memory Storage**: Simplifies deployment and demonstrates clean architecture without database complexity.

### Performance Considerations
- Client-side filtering and sorting reduce server load
- Efficient caching strategy minimizes external API calls
- Modular code structure enables code splitting

## 🛠 Technology Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **Tailwind CSS** for styling
- **Vite** for development

### Backend
- **NestJS** framework
- **TypeScript** for type safety
- **Random User API** integration
- **In-memory data storage**

## 🛠 Quick Start

1. **Backend Setup**
   - Go to [`/backend`](backend/README.md)
   - Follow the steps to install dependencies, configure the `.env`, and run the server.
   - The API will be available at `http://localhost:3000`

2. **Frontend Setup**
   - Go to [`/frontend`](frontend/README.md)
   - Follow the steps to install dependencies and launch the app.
   - The application will be available at `http://localhost:5173`

For detailed setup instructions, environment configuration, and development guidelines, please refer to the respective README files in each directory.

## 📚 Detailed Documentation

- [Frontend Documentation](frontend/README.md) - React application details
- [Backend Documentation](backend/README.md) - API and server details

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

Made with ❤️ by Yin Zi
