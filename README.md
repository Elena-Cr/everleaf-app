# Everleaf

Everleaf is a full-stack web application designed to help individuals manage their plants, track care routines, and report issues. The project is built using Angular for the frontend, ASP.NET Web API for the backend, and PostgreSQL for persistent storage.
    
# Version Control and Branching 
    This project was created by three students in the Applied Programming course at CBS. To ensure smooth collaboration and fair contribution, GitHub was utilised for version control and branching.

    The main branch contains stable, production-ready code. All child branches, used for development, have been merged into main and are no longer relevant.

# Functionality Overview

    User login and registration
    Plant creation and editing
    Logging of plant care activities (watering, fertilizing)
    Reporting plant problems with severity levels

# Project Structure

    everleaf-app/
    ├── client/               # Angular frontend
    ├── server/               # ASP.NET Web API backend
    ├── Everleaf.Model/       # Class Library with Entities and Repositories
    ├── EverleafSystem.Tests  # C# Web API Controller Tests
    ├── Postman               # Postman collection file of all available endpoints
    ├── PostreSQL             # SQL scripts required to create and populate the database
    ├── README.md
    └── everleaf-app.sln
    
# Folder Structure Guidelines

    Angular (client/):
    Components/ – UI components organized by feature or route
    Models/ – Interfaces representing data models
    Services/ – HTTP clients for API interaction
    
    .NET (server/, Everleaf.Model/):
    Controllers/ – API endpoints for each entity
    Entities/ – Data models matching the PostgreSQL schema
    Repositories/ – CRUD operations using raw SQL and Npgsql

# Prerequisites

    Node.js and npm
    Angular CLI (npm install -g @angular/cli)
    .NET SDK 7 or higher
    PostgreSQL (running locally or remotely)

## Backend Setup

# Create SQL tables and insert records using the scripts in the PostreSQL folder

    Make sure the server on PostgreSQL is running
    
# Verify that the connection string in appsettings.json is correctly set:

    "ConnectionStrings": {
    "EverleafDb": "Host=localhost:5432;Username=postgres;Password=yourpassword;Database=yourdatabase"
    }
    //"yourpassword" and "yourdatabase" will need to be replaced by the developer

# Navigate to the server/ folder and start the backend:

    cd server
    dotnet run

# The backend will be available at:

    http://localhost:5234/api/plant
    http://localhost:5234/api/users
    http://localhost:5234/api/problemreport
    http://localhost:5234/api/carelog
    http://localhost:5234/api/planttype

## Frontend Setup

# Navigate to the client/ folder and start the frontend:

    cd client
    npm install               # if npm packages are not installed on the machine        
    ng serve

# The Angular frontend will be accessible at:

    http://localhost:4200

## Testing

# Backend Testing

    Navigate to the TESTING tab in the side menu.
    Refresh tests.
    Run tests.

# Frontend Testing

    Once in the client/ folder, run the following command to perform the tests on the plant-form component:
    ng test --include '**/plant-form.component.spec.ts'

    Once in the client/ folder, run the following command to perform the tests on the plant service:
    ng test --include '**/plant.service.spec.ts'