# PayIt - Distributed Ledger System

A scalable distributed ledger system built with Turborepo monorepo architecture, featuring event sourcing with EventStoreDB (Kurrent DB), CQRS pattern implementation, and microservices for handling financial transactions, projections, and real-time updates.

## 📁 Project Structure

This project uses **Turborepo** as a monorepo management tool with the following structure:

```
payit/
├── apps/
│   ├── http-server/               # Main HTTP API server
│   ├── projection-worker/         # Reads events and updates read models
│   ├── service-worker/            # Handles business logic and services
│   ├── transaction-worker/        # Processes financial transactions
│   └── web/                       # Frontend Next.js application
├── packages/
│   ├── eslint-config/             # Shared ESLint configuration
│   ├── postgre-db/                # PostgreSQL database client (read models)
│   ├── rabbitmq/                  # RabbitMQ client utilities
│   ├── redisclient/               # Redis client utilities
│   ├── types/                     # Shared TypeScript types
│   ├── typescript-config/         # Shared TypeScript configuration
│   └── ui/                        # Shared UI components
└── docker-compose.yml
```

## 🏗️ Architecture Overview

PayIt implements the **CQRS (Command Query Responsibility Segregation)** and **Event Sourcing** patterns:

- **EventStoreDB (Kurrent DB)**: Stores all events as the source of truth
- **Projection Worker**: Subscribes to event streams and builds read models in PostgreSQL
- **Transaction Worker**: Processes and validates financial transactions
- **Service Worker**: Handles business logic and orchestrates workflows
- **HTTP Server**: Provides REST API for commands and queries
- **PostgreSQL**: Stores read-optimized projections for queries
- **RabbitMQ**: Message broker for async communication between services
- **Redis**: Caching layer and session management

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **pnpm** (recommended) or npm/yarn

### 1. Fork and Clone the Repository

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/payit.git
cd payit
```

### 2. Install Dependencies

```bash
# Install pnpm globally if you haven't already
npm install -g pnpm

# Install all dependencies
pnpm install
```

## 🐳 Docker Setup

### Starting Services with Docker Compose

The project includes a `docker-compose.yml` file that sets up all required services:

- **EventStoreDB (Kurrent DB)** - Event store database
- **PostgreSQL** - Read model database
- **Redis** - Cache and session store
- **RabbitMQ** - Message broker

```bash
# Start all services in detached mode
docker-compose up -d

# Check if all services are running
docker-compose ps

# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f eventstoredb

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### Verifying EventStoreDB Setup

```bash
# Access EventStoreDB UI
# Open browser: http://localhost:2113
# Default credentials: admin / changeit
```

## 🔐 Setting Up External Services

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable required APIs:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3002/api/auth/callback/google`
   - Add authorized JavaScript origins:
     - `http://localhost:3000`
     - `http://localhost:3002`
   - Save and copy the **Client ID** and **Client Secret**

### 2. Redis Setup

#### Option A: Using Docker (Recommended for Development)

The Docker Compose file includes Redis. Connection details:
- **Host:** localhost
- **Port:** 6379
- **Username:** default
- **Password:** (set in docker-compose.yml)

#### Option B: Cloud Redis Instance

If you prefer a cloud Redis instance:

1. Sign up for [Redis Cloud](https://redis.com/try-free/) or [Upstash](https://upstash.com/)
2. Create a new Redis database
3. Copy the connection details:
   - Host
   - Port
   - Password
   - Username (usually 'default')

### 3. PostgreSQL Setup (Read Models)

The Docker Compose file includes PostgreSQL for read models. Connection details:

- **Host:** localhost
- **Port:** 5432
- **Database:** payit_db
- **Username:** payit_user
- **Password:** payit_password

**Database URL format:**
```
postgresql://payit_user:payit_password@localhost:5432/payit_db
```

### 4. EventStoreDB (Kurrent DB) Setup

EventStoreDB is included in Docker Compose and serves as the event store:

- **Host:** localhost
- **HTTP Port:** 2113
- **TCP Port:** 1113
- **Connection String:** `esdb://localhost:2113?tls=false`

**Kurrent DB URL format:**
```
esdb://admin:changeit@localhost:2113?tls=false
```

## ⚙️ Environment Variables Setup

Create `.env` files in the respective application directories:

### `/apps/web/.env`

```env
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3002"
GOOGLE_CLIENT_ID='your_google_client_id_here'
GOOGLE_CLIENT_SECRET='your_google_client_secret_here'
GOOGLE_REDIRECT_URI="http://localhost:3002/api/auth/callback/google"
```

### `/apps/http-server/.env`

```env
NEXT_PUBLIC_FRONTEND_URL="http://localhost:3000"
TRANSACTION_WORKER_URL='http://transaction-worker:3008'
SERVICE_WORKER_URL='http://service-worker:3007'
GOOGLE_CLIENT_ID='your_google_client_id_here'
GOOGLE_CLIENT_SECRET='your_google_client_secret_here'
GOOGLE_REDIRECT_URI="http://localhost:3002/api/auth/callback/google"
secret_key='your_jwt_secret_key_here'
access_key='your_access_key_here'

# Redis Configuration
REDIS_USERNAME='default'
REDIS_PASSWORD='your_redis_password_here'
REDIS_HOST='localhost'
REDIS_PORT='6379'

# PostgreSQL (Read Models)
DATABASE_URL="postgresql://payit_user:payit_password@localhost:5432/payit_db"

# EventStoreDB (Kurrent DB)
KURRENT_DB_URL="esdb://admin:changeit@localhost:2113?tls=false"

# RabbitMQ
RABBITMQ_CLUSTER_URL="amqp://payit_user:payit_password@localhost:5672/"
```

### `/apps/transaction-worker/.env`

```env
TRANSACTION_WORKER_URL='http://transaction-worker:3008'

# PostgreSQL (Read Models)
DATABASE_URL="postgresql://payit_user:payit_password@localhost:5432/payit_db"

# EventStoreDB (Kurrent DB)
KURRENT_DB_URL="esdb://admin:changeit@localhost:2113?tls=false"

# RabbitMQ
RABBITMQ_CLUSTER_URL="amqp://payit_user:payit_password@localhost:5672/"

# Redis
REDIS_USERNAME='default'
REDIS_PASSWORD='your_redis_password_here'
REDIS_HOST='localhost'
REDIS_PORT='6379'
```

### `/apps/projection-worker/.env`

```env
# PostgreSQL (Read Models)
DATABASE_URL="postgresql://payit_user:payit_password@localhost:5432/payit_db"

# EventStoreDB (Kurrent DB) - Source of events
KURRENT_DB_URL="esdb://admin:changeit@localhost:2113?tls=false"

# RabbitMQ
RABBITMQ_CLUSTER_URL="amqp://payit_user:payit_password@localhost:5672/"

# Redis
REDIS_USERNAME='default'
REDIS_PASSWORD='your_redis_password_here'
REDIS_HOST='localhost'
REDIS_PORT='6379'
```

### `/apps/service-worker/.env`

```env
SERVICE_WORKER_URL='http://service-worker:3007'

# PostgreSQL (Read Models)
DATABASE_URL="postgresql://payit_user:payit_password@localhost:5432/payit_db"

# EventStoreDB (Kurrent DB)
KURRENT_DB_URL="esdb://admin:changeit@localhost:2113?tls=false"

# RabbitMQ
RABBITMQ_CLUSTER_URL="amqp://payit_user:payit_password@localhost:5672/"

# Cloudinary (Optional)
CLOUDINARY_NAME='your_cloudinary_name'
API_KEY='your_cloudinary_api_key'
API_SECRET='your_cloudinary_api_secret'

# Redis
REDIS_USERNAME='default'
REDIS_PASSWORD='your_redis_password_here'
REDIS_HOST='localhost'
REDIS_PORT='6379'
```

## 🗄️ Database Setup with Prisma

### 1. Generate Prisma Client

```bash
# Navigate to the database package
cd packages/postgre-db

# Generate Prisma client
pnpm prisma generate

# Return to root
cd ../..
```

### 2. Run Database Migrations

```bash
# Navigate to the database package
cd packages/postgre-db

# Run migrations to create read model tables
pnpm prisma migrate dev --name init

# Or push schema without creating migration files
pnpm prisma db push

# Return to root
cd ../..
```

### 3. View Database Schema

```bash
# Open Prisma Studio (database GUI)
cd packages/postgre-db
pnpm prisma studio
```

This will open Prisma Studio at `http://localhost:5555` where you can view and edit your read models.

### 4. Seed Initial Data (Optional)

```bash
cd packages/postgre-db
pnpm prisma db seed
cd ../..
```

## 🏗️ Building and Running the Project

### Development Mode

```bash
# Run all applications in development mode
pnpm dev

# Run specific application
pnpm dev --filter=web
pnpm dev --filter=http-server
pnpm dev --filter=transaction-worker
pnpm dev --filter=projection-worker
pnpm dev --filter=service-worker
```

### Build for Production

```bash
# Build all applications
pnpm build

# Build specific application
pnpm build --filter=web
pnpm build --filter=http-server
```

### Start Production Build

```bash
# Start all applications
pnpm start

# Start specific application
pnpm start --filter=web
```

## 📦 Available Services and Ports

| Service | Port | Description |
|---------|------|-------------|
| Web (Frontend) | 3000 | Next.js web application |
| HTTP Server | 3002 | Main REST API server |
| Service Worker | 3007 | Business logic processor |
| Transaction Worker | 3008 | Transaction processor |
| Projection Worker | 3009 | Event projection builder |
| PostgreSQL | 5432 | Read model database |
| Redis | 6379 | Cache and session store |
| RabbitMQ | 5672 | Message broker |
| RabbitMQ Management | 15672 | RabbitMQ web UI |
| EventStoreDB HTTP | 2113 | Event store HTTP API |
| EventStoreDB TCP | 1113 | Event store TCP connection |

## 🔄 Understanding the Event Flow

### 1. Command Flow (Write Operations)

```
User Request → HTTP Server → Transaction Worker → EventStoreDB
                                                      ↓
                                            Event Persisted
                                                      ↓
                                            Event Published
```

### 2. Query Flow (Read Operations)

```
User Request → HTTP Server → PostgreSQL (Read Models)
```

### 3. Projection Flow (Background Process)

```
EventStoreDB → Projection Worker → Transform Event → Update PostgreSQL
     ↓                                                        ↓
Subscription                                          Read Models Updated
```

## 🧪 Testing

```bash
# Run tests for all packages
pnpm test

# Run tests for specific package
pnpm test --filter=transaction-worker

# Run tests in watch mode
pnpm test:watch

# Run integration tests
pnpm test:integration
```

## 🔍 Useful Commands

### General Commands

```bash
# Check for linting errors
pnpm lint

# Fix linting errors
pnpm lint:fix

# Format code
pnpm format

# Clean all node_modules and build artifacts
pnpm clean

# Type check all packages
pnpm typecheck
```

### Database Commands

```bash
# View Prisma Studio (database GUI)
cd packages/postgre-db && pnpm prisma studio

# Reset database (WARNING: Deletes all data)
cd packages/postgre-db && pnpm prisma migrate reset

# Create a new migration
cd packages/postgre-db && pnpm prisma migrate dev --name your_migration_name
```

### EventStoreDB Commands

```bash
# Access EventStoreDB CLI inside Docker
docker exec -it eventstoredb /bin/bash

# Check EventStoreDB status
curl http://localhost:2113/stats
```

### Docker Commands

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f transaction-worker

# Restart specific service
docker-compose restart postgres

# Check resource usage
docker stats
```

## 🐛 Troubleshooting

### Docker services not starting

```bash
# Check Docker logs
docker-compose logs

# Restart all services
docker-compose restart

# Rebuild specific service
docker-compose up -d --build transaction-worker
```

### Port already in use

```bash
# Find process using port (example: port 3000)
# On Mac/Linux:
lsof -i :3000

# On Windows:
netstat -ano | findstr :3000

# Kill the process
kill -9 <PID>
```

### EventStoreDB connection issues

1. Verify EventStoreDB is running:
   ```bash
   docker-compose ps eventstoredb
   ```

2. Check EventStoreDB logs:
   ```bash
   docker-compose logs eventstoredb
   ```

3. Access EventStoreDB UI:
   - URL: `http://localhost:2113`
   - Default credentials: `admin` / `changeit`

4. Test connection:
   ```bash
   curl http://localhost:2113/stats
   ```

### Prisma Client errors

```bash
# Regenerate Prisma Client
cd packages/postgre-db
pnpm prisma generate

# Reset database and re-run migrations
pnpm prisma migrate reset
```

### RabbitMQ connection issues

1. Ensure RabbitMQ is running:
   ```bash
   docker-compose ps rabbitmq
   ```

2. Check RabbitMQ management UI:
   - URL: `http://localhost:15672`
   - Username: `payit_user`
   - Password: `payit_password`

3. View RabbitMQ logs:
   ```bash
   docker-compose logs rabbitmq
   ```

### Redis connection issues

```bash
# Test Redis connection
docker exec -it redis redis-cli
> AUTH your_password
> PING
# Should return PONG

# Check Redis logs
docker-compose logs redis
```

### Projection Worker not updating read models

1. Check if Projection Worker is running:
   ```bash
   docker-compose ps projection-worker
   ```

2. Verify EventStoreDB subscription:
   - Open EventStoreDB UI at `http://localhost:2113`
   - Check "Persistent Subscriptions" section

3. Check worker logs:
   ```bash
   docker-compose logs projection-worker
   ```

4. Manually trigger projection rebuild (if needed):
   ```bash
   # This depends on your implementation
   curl -X POST http://localhost:3009/rebuild-projections
   ```

## 📊 Monitoring and Observability

### EventStoreDB Monitoring

- **UI Dashboard**: `http://localhost:2113`
- **Stats Endpoint**: `http://localhost:2113/stats`
- **Health Check**: `http://localhost:2113/health/live`

### RabbitMQ Monitoring

- **Management UI**: `http://localhost:15672`
- View queues, exchanges, and message rates
- Monitor consumer connections

### Application Logs

```bash
# View all application logs
pnpm logs

# View specific service logs
docker-compose logs -f http-server
docker-compose logs -f transaction-worker
docker-compose logs -f projection-worker
```

## 🔒 Security Best Practices

1. **Environment Variables**:
   - Never commit `.env` files to version control
   - Use strong, unique passwords for all services
   - Rotate secrets regularly

2. **EventStoreDB**:
   - Change default admin password
   - Enable TLS in production
   - Configure proper access control lists (ACLs)

3. **API Security**:
   - Implement rate limiting
   - Use JWT tokens with short expiration
   - Validate all inputs

4. **Database**:
   - Use read-only credentials where possible
   - Enable connection encryption
   - Regular backups of EventStoreDB and PostgreSQL

## 📚 Additional Resources

- [Turborepo Documentation](https://turbo.build/repo/docs)
- [EventStoreDB Documentation](https://developers.eventstore.com/)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [RabbitMQ Tutorials](https://www.rabbitmq.com/getstarted.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks
