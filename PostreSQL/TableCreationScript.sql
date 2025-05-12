CREATE TABLE Users (
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE
);

CREATE TABLE Plant (
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Nickname VARCHAR(255),
    Species INT, -- Changed to INT for FK reference to PlantType
    DateAdded TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UserId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

CREATE TABLE CareLog (
    Id SERIAL PRIMARY KEY,
    PlantId INT NOT NULL,
    Date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Type VARCHAR(20) CHECK (Type IN ('Water', 'Fertilizer')),
    FOREIGN KEY (PlantId) REFERENCES Plant(Id) ON DELETE CASCADE
);

CREATE TABLE ProblemReport (
    Id SERIAL PRIMARY KEY,
    PlantId INT NOT NULL,
    DateReported TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    Description TEXT NOT NULL,
    Severity VARCHAR(10) CHECK (Severity IN ('Low', 'Medium', 'High')),
    FOREIGN KEY (PlantId) REFERENCES Plant(Id) ON DELETE CASCADE
);

CREATE TABLE PlantType (
    Id SERIAL PRIMARY KEY,
    CommonName VARCHAR(255) NOT NULL,
    ScientificName VARCHAR(255) NOT NULL,
    WateringFrequencyDays INT NOT NULL,
    FertilizingFrequencyDays INT NOT NULL,
    SunlightNeeds VARCHAR(255) NOT NULL
);

ALTER TABLE Plant ADD CONSTRAINT fk_plant_species FOREIGN KEY (Species) REFERENCES PlantType(Id) ON DELETE SET NULL;

