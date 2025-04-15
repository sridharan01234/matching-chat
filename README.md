# Chat Application with Authentication

## Authentication Implementation

This application implements a simple authentication system using email/password credentials. The implementation includes:

1. User data with secure password storage
2. Authentication utility functions
3. Seeded test users for development

### Seeded Users

The following test users are automatically created when running the seed script:

```
1. Alice
   - Email: alice@example.com
   - Password: alice123

2. Bob
   - Email: bob@example.com
   - Password: bob123

3. Charlie
   - Email: charlie@example.com
   - Password: charlie123
```

### How to Use Authentication

1. First, import the authentication utility:
```typescript
import { authenticateUser } from '../lib/auth';
```

2. Use the authenticateUser function:
```typescript
const user = await authenticateUser('alice@example.com', 'alice123');
if (user) {
  // User is authenticated
  console.log('Logged in as:', user.name);
} else {
  // Authentication failed
  console.log('Invalid credentials');
}
```

### Running the Example

To see the authentication in action:

1. First, run the database migrations:
```bash
npx prisma migrate dev
```

2. Seed the database with test users:
```bash
npx prisma db seed
```

3. Run the authentication example:
```bash
ts-node examples/auth-example.ts
```

### Security Notes

- In production, use strong passwords and proper password policies
- Implement rate limiting for login attempts
- Use secure session management
- Consider adding two-factor authentication for enhanced security
- Store sensitive configuration in environment variables

### Database Schema

The user model includes:
- Unique ID (UUID)
- Name
- Email (unique)
- Hashed password
- Creation timestamp

The authentication system is integrated with the existing chat functionality, allowing users to:
- Authenticate before accessing chat features
- Maintain persistent identity across sessions
- Participate in chat threads securely