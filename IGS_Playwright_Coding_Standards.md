# IGS Playwright Framework
## Coding Standards & Guidelines

**Version:** 1.0.0  
**Created:** August 2025  
**Team:** IGS Development Team  

---

## Table of Contents

1. [General Principles](#general-principles)
2. [TypeScript Standards](#typescript-standards)
3. [File Organization](#file-organization)
4. [Naming Conventions](#naming-conventions)
5. [Code Structure](#code-structure)
6. [Test Writing Guidelines](#test-writing-guidelines)
7. [Documentation Standards](#documentation-standards)
8. [Error Handling](#error-handling)
9. [Performance Guidelines](#performance-guidelines)
10. [Security Considerations](#security-considerations)
11. [Code Review Checklist](#code-review-checklist)

---

## 1. General Principles

These coding standards ensure consistency, maintainability, and quality across the IGS Playwright Framework.

### 1.1 Core Values

- **Readability** - Code should be self-documenting and easy to understand
- **Consistency** - Follow established patterns throughout the codebase
- **Maintainability** - Write code that is easy to modify and extend
- **Testability** - Design code to be easily testable
- **Performance** - Consider performance implications of code decisions

### 1.2 Code Quality Tools

- **ESLint** - For code quality and style enforcement
- **TypeScript** - For type safety and better IDE support
- **Prettier** - For consistent code formatting
- **Husky** - For pre-commit hooks

### 1.3 Development Environment

- **VS Code** - Recommended IDE with extensions
- **Node.js 18+** - Runtime environment
- **Git** - Version control with conventional commits

---

## 2. TypeScript Standards

### 2.1 Type Definitions

Always use explicit type definitions for better code clarity and IDE support.

**✅ GOOD:**
```typescript
interface ApiResponse<T> {
  status: number;
  statusText: string;
  data: T;
  headers: Record<string, string>;
}

async function getUsers(): Promise<ApiResponse<User[]>> {
  const response = await apiUtils.get('/api/users');
  return response;
}

function calculateTotal(prices: number[]): number {
  return prices.reduce((sum, price) => sum + price, 0);
}
```

**❌ BAD:**
```typescript
async function getUsers() {
  // No return type specified
  return await request.get('/users');
}

function calculateTotal(prices: any) {
  // Using 'any' type
  return prices.reduce((sum: any, price: any) => sum + price, 0);
}
```

### 2.2 Interface vs Type

Use interfaces for object shapes that might be extended, types for unions and computed types.

**Interfaces (for extensible objects):**
```typescript
interface BaseUser {
  id: string;
  name: string;
  email: string;
}

interface AdminUser extends BaseUser {
  permissions: string[];
  role: 'admin';
}
```

**Types (for unions and computed types):**
```typescript
type UserRole = 'admin' | 'user' | 'guest';
type UserWithRole = BaseUser & { role: UserRole };
```

---

## 3. File Organization

### 3.1 Directory Structure

Follow the established directory structure for consistency.

```
src/
├── utils/              # Utility classes and functions
├── pages/              # Page Object Models  
├── types/              # Type definitions
├── fixtures/           # Test fixtures
└── constants/          # Application constants
```

### 3.2 File Naming

- Use **kebab-case** for file names: `user-service.ts`, `api-utils.ts`
- Use **descriptive names** that indicate purpose
- Add **appropriate suffixes**: `.test.ts`, `.spec.ts`, `.types.ts`

---

## 4. Naming Conventions

### 4.1 Variables and Functions

- Use **camelCase**: `getUserData`, `isLoggedIn`, `totalAmount`
- Use **descriptive names**: `buttonElement` instead of `btn`
- Use **verbs for functions**: `validateUser`, `processData`
- Use **boolean prefixes**: `is`, `has`, `can`, `should`

### 4.2 Classes and Interfaces

- Use **PascalCase**: `ApiUtils`, `UserProfile`
- Use **descriptive names**: avoid abbreviations
- Use **suffixes for clarity**: `Page`, `Utils`, `Manager`

### 4.3 Constants and Enums

- Use **UPPER_SNAKE_CASE** for constants
- Use **PascalCase** for enum names

---

## 5. Code Structure

### 5.1 Class Organization

Organize class members in a consistent order:
1. Static properties
2. Instance properties (private first, then public)  
3. Constructor
4. Static methods
5. Public methods
6. Private methods

### 5.2 Function Structure

Keep functions focused and single-purpose with clear structure:
1. Input validation
2. Business logic preparation
3. External operations
4. Return result

---

## 6. Test Writing Guidelines

### 6.1 Test Structure

Follow the **AAA pattern**: Arrange, Act, Assert.

### 6.2 Test Descriptions

Write clear, descriptive test names that explain the scenario and expected behavior.

### 6.3 Test Data Management

Use data generators and avoid hardcoded test data.

---

## 7. Documentation Standards

### 7.1 JSDoc Comments

Use comprehensive JSDoc comments for all public methods and classes.

### 7.2 Code Comments

Add meaningful comments for complex logic and business rules.

---

## 8. Error Handling

### 8.1 Custom Error Classes

Create specific error classes for different error types with meaningful information.

### 8.2 Error Propagation

Handle errors at appropriate levels with meaningful context.

---

## 9. Performance Guidelines

### 9.1 Async/Await Best Practices

Optimize asynchronous operations for better performance using parallel execution where appropriate.

### 9.2 Resource Management

Properly manage resources to prevent memory leaks and performance issues.

---

## 10. Security Considerations

### 10.1 Sensitive Data Handling

Never expose sensitive information in code, logs, or test data. Use environment variables for configuration.

### 10.2 Input Validation

Always validate inputs, especially from external sources.

---

## 11. Code Review Checklist

### 11.1 Code Quality Checklist

- [ ] Are naming conventions followed consistently?
- [ ] Are functions and classes single-purpose and focused?
- [ ] Is error handling implemented appropriately?
- [ ] Are TypeScript types used effectively?
- [ ] Is the code well-documented?

### 11.2 Testing Checklist

- [ ] Do tests follow the AAA pattern?
- [ ] Are test descriptions clear and descriptive?
- [ ] Is test data properly managed with generators?

### 11.3 Performance Checklist

- [ ] Are async operations handled efficiently?
- [ ] Are resources properly managed and cleaned up?

### 11.4 Security Checklist

- [ ] Is sensitive data handled securely?
- [ ] Are inputs validated and sanitized?

---

## Contact & Support

For questions about these coding standards:

1. **Create an issue** in the GitHub repository
2. **Contact the IGS Development Team** for clarification
3. **Propose changes** via pull requests

**Repository:** [https://github.com/IGSRepo/igs-playwright-framework](https://github.com/IGSRepo/igs-playwright-framework)

---

*These coding standards are living documents that evolve with the framework.*
