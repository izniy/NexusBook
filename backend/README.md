# 📡 NexusBook Contacts API (NestJS Backend)

This backend serves as the data provider for the NexusBook app. It fetches, caches, and serves contact data from the Random User API, supports favorite toggling, and paginated access — all in memory without a database.

## 🛠 Technology Stack

- **NestJS** - Modern Node.js framework
- **TypeScript** - Type safety and developer experience
- **Axios** - HTTP client for external API calls
- **Random User API** - Data source for contacts
- **In-memory Storage** - No database required

## 🎯 Design Decisions

### Architecture Choices
- **NestJS Modular Design**: Contacts module is isolated for better maintainability and potential future scaling
- **Controller-Service Pattern**: Clear separation between route handling and business logic
- **Dependency Injection**: Leverages NestJS's DI container for loose coupling and testability

### Storage Strategy
- **In-Memory Caching**: Chosen for simplicity and performance
  - No database setup required for demo purposes
  - Fast access to contact data
  - Favorite status tracked efficiently using Map
  - Trade-off: Data persistence not needed for demo scope

### External Communication
- **Axios for HTTP**: Selected for its:
  - Promise-based API
  - Request/response interceptors
  - Automatic JSON transformation
  - Robust error handling

### Error Management
- **Structured Error Handling**:
  - HTTP exceptions for client errors
  - Global exception filter for consistency
  - Detailed error messages in development
  - Sanitized errors in production

### Logging Strategy
- **Tiered Logging Levels**:
  - Debug logs for development
  - Error tracking in production
  - Performance metrics
  - API request/response logging

## ⚙️ Setup & Configuration

1. Create a `.env` file in the backend directory:
   ```env
   RANDOM_USER_API=https://randomuser.me/api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Get Paginated Contacts
```http
GET /contacts?page=1&limit=20
```
Returns a paginated list of contacts with metadata:
```typescript
{
  contacts: Contact[];
  totalPages: number;
  currentPage: number;
}
```

### Get Single Contact
```http
GET /contacts/:id
```
Returns a single contact by ID or 404 if not found.

### Toggle Favorite Status
```http
PATCH /contacts/:id/favorite
```
Toggles and returns the updated contact with new favorite status.

## 📂 Project Structure

```
src/
├── contacts/
│   ├── contacts.controller.ts  # Route handlers
│   ├── contacts.service.ts     # Business logic & caching
│   ├── contact.interface.ts    # Type definitions
│   └── contacts.module.ts      # Module configuration
├── app.module.ts              # Root module
└── main.ts                    # Application entry point
```

> **Note:** The default `app.controller.ts` and `app.service.ts` files are unused in favor of a modular `contacts/` feature structure.

## 🧪 Testing

Run the test suites:
```bash
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:cov    # Test coverage
```

## 📝 Implementation Notes

- **In-Memory Storage**: 
  - Contacts are fetched from Random User API
  - Cached in memory for fast access
  - Favorite status maintained in Map

- **Error Handling**:
  - Invalid contact IDs return 404
  - External API failures return 500
  - Validation errors return 400

- **Logging**:
  - Comprehensive debug logging
  - Request/response tracking
  - Error tracing

- **Performance**:
  - Contact caching reduces API calls
  - Efficient pagination
  - Quick favorite toggling

## 🔍 Debug Mode

Enable debug logs by setting the log level in `main.ts`:
```typescript
app.useLogger(['debug', 'verbose']);
```

Monitor the logs for:
- API requests and responses
- Cache hits/misses
- Error stack traces
- Performance metrics

---

Built with ❤️ to power the NexusBook frontend. Feel free to fork, extend, or contribute!
