# GraphQL Modules / Vite React Template

This repository provides a full-stack TypeScript template featuring end-to-end type safety with GraphQL. The project is structured into a client and a server, each with their own dependencies and configurations.

## Tech Stack

### Client

- Vite (React-based frontend development)
- HeroUI (Tailwind-based UI components)
- GraphQL Codegen (Generates TypedDocumentNodes for queries, mutations, and fragments)

### Server

- Hapi (Node.js backend framework)
- GraphQL Yoga (GraphQL server implementation)
- GraphQL Modules (Modular GraphQL architecture)
- TypeScript (Static typing)
- Supertokens (Authentication)
- Stripe (Payments)

## Features

- **End-to-End Type Safety**
  - GraphQL Codegen in the frontend to generate fully typed GraphQL queries, mutations, and fragments.
  - GraphQL server preset in the backend to generate resolver skeletons with types.
- **Modern Development Tooling**
  - Vite for a fast frontend build process.
  - ts-node-dev for hot-reloading the backend.
  - Tailwind-based UI components with HeroUI.

Getting Started

Clone the repository:

```sh
git clone https://github.com/Dan6erbond/graphql-modules-vite-react-template.git
cd graphql-modules-vite-react-template
```

Install dependencies for both client and server:

```sh
cd client && npm install
cd ../server && npm install
```

Refer to the respective `README` files for further details:

- [Client README](client/README.md)
- [Server README](server/README.md)

# License

This repository is licensed under the MIT License.

# Contributing

Contributions are welcome! Feel free to submit pull requests or open issues for bug reports, feature requests, or improvements. Please follow best practices and ensure type safety when contributing.
