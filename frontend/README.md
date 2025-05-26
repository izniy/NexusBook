# 📘 NexusBook Frontend

This is the frontend interface of NexusBook, built using React, Redux Toolkit, and Tailwind CSS. It connects to a REST API backend to display and manage contact data in a responsive and user-friendly layout.

## ✨ Features

- 👥 Modern card-based contact display with grid layout
- ⭐ Interactive favorite toggling with visual feedback
- 🔍 Real-time contact search with name/email filtering
- 📊 Client-side sorting (name/email, ascending/descending)
- 📱 Responsive design with mobile-first approach
- 📄 Dynamic pagination with configurable page size
- ⚡ Loading states and error handling

## 🎯 Design Decisions

### State Management
- **Redux Toolkit**: Chosen for its:
  - Predictable state updates
  - DevTools integration for debugging
  - Built-in immutability handling
  - Simplified async operations with createAsyncThunk
  - Type safety with TypeScript

### UI Framework Choices
- **Tailwind CSS**: Selected for:
  - Utility-first approach speeds development
  - Built-in responsive design system
  - Consistent design language
  - Small production bundle size
  - Easy customization

### User Experience
- **Card-Based Layout**:
  - Visual hierarchy improves scanning
  - Natural grid system for responsive design
  - Modal view for detailed information
  - Smooth transitions between states

### Performance Optimizations
- **Client-Side Operations**:
  - Search and filtering handled locally
  - Pagination state managed in-browser
  - Minimized API calls
  - Debounced search input

### Accessibility
- **WCAG Compliance**:
  - Semantic HTML structure
  - ARIA labels and roles
  - Keyboard navigation support
  - High contrast ratios
  - Screen reader optimization

## 🛠 Technologies

- **React 18** - Modern UI development
- **TypeScript** - Type-safe code
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling and responsive design
- **Axios** - API communication
- **Vite** - Build tool and development server

## 🚀 Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

The development server will run at `http://localhost:5173`

## 📁 Component Structure

```
src/
├── components/          # Reusable UI components
│   ├── ContactCard.tsx   # Individual contact display
│   ├── ContactList.tsx   # Grid of contact cards
│   ├── ContactModal.tsx  # Detailed contact view
│   └── SearchBar.tsx     # Search input component
├── pages/              # Page components
│   └── ContactsPage.tsx  # Main contacts view
├── store/              # Redux state management
│   ├── store.ts         # Store configuration
│   └── contactsSlice.ts # Contacts state logic
├── services/           # External services
│   └── api.ts          # API client
└── App.tsx             # Root component
```

## 🔄 State Management

The application uses Redux Toolkit for efficient state management:

- **Global State**:
  - Contact list with pagination
  - Selected contact for modal view
  - Loading and error states
  - Search and sort preferences
  - Current page tracking

- **Redux Actions**:
  - Contact fetching with pagination
  - Favorite status updates
  - Contact selection
  - Page navigation

## 💅 UI/UX Features

- **Responsive Design**:
  - Fluid grid layout
  - Mobile-friendly navigation
  - Touch-optimized controls
  - Adaptive spacing

- **User Experience**:
  - Smooth loading transitions
  - Clear error messages
  - Empty state handling
  - Search feedback
  - Intuitive pagination

- **Accessibility**:
  - ARIA labels
  - Keyboard navigation
  - Focus management
  - Screen reader support

## 📸 Screenshots

[Coming Soon]

*Add screenshots or GIFs showcasing the frontend interface*

---

Made with ❤️ using React & Redux
