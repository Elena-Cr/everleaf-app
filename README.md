# Everleaf

Everleaf is a full-stack web application designed to help individuals manage their plants, track care routines, and report issues. The project is built using Angular for the frontend, ASP.NET Web API for the backend, and PostgreSQL for persistent storage.

# Project Structure

    everleaf-app/
    ├── client/               # Angular frontend
    ├── server/               # ASP.NET Web API backend
    ├── Everleaf.Model/       # Class Library with Entities and Repositories
    ├── README.md
    └── everleaf-app.sln

# Prerequisites

    Node.js and npm
    Angular CLI (npm install -g @angular/cli)
    .NET SDK 7 or higher
    PostgreSQL (running locally or remotely)

## Backend Setup

# Navigate to the server/ folder:

    dotnet restore
    dotnet run

# Verify that the connection string in appsettings.Development.json is correctly set:

    "ConnectionStrings": {
    "EverleafDb": "Host=localhost;Port=5432;Database=everleaf_dev;Username=postgres;Password=yourpassword"
    }

# The backend will be available at:

    http://localhost:5234/api/<controller-name>

## Frontend Setup

# Navigate to the client/ folder:

    cd client
    npm install
    ng serve

# The Angular frontend will be accessible at:

    http://localhost:4200

# Functionality Overview

    User registration and management
    Plant creation and editing
    Logging of plant care activities (watering, fertilizing)
    Reporting plant problems with severity levels
   

# Folder Structure Guidelines

    Angular (client/):
    Models/ – Interfaces representing data models
    Services/ – HTTP clients for API interaction
    Pages/ – UI components organized by feature or route
    .NET (server/, Everleaf.Model/):
    Controllers/ – API endpoints for each entity
    Entities/ – Data models matching the PostgreSQL schema
    Repositories/ – CRUD operations using raw SQL and Npgsql

# Local Development

    Make sure PostgreSQL is running and a database called everleaf_dev is created

# Start the backend:

    dotnet run --project server/server.csproj

# Start the frontend:

    cd client
    ng serve

# Open a browser and visit http://localhost:4200

# Version Control and Branching

    main – Stable, production-ready code
    feature/<feature-name> – New features (e.g., feature/plant-list)
    bugfix/<issue-name> – Fixes or patches
