-- ================================================
-- Everleaf Seed Data 
-- ================================================

BEGIN;

-- Clean existing data (in dependency order)
TRUNCATE carelog, problemreport, plant, planttype, users RESTART IDENTITY;


-------------------------
-- USERS (4 records)
-------------------------

INSERT INTO Users (Id, Username, PasswordHash, Email) VALUES
(1, 'Alice', 'alice.pw', 'alice@example.com'),
(2, 'Bob', 'bob.pw', 'bob@example.com'),
(3, 'Charlie', 'charlie.pw', 'charlie@example.com'),
(4, 'Dave', 'dave.pw', 'dave@example.com');

-------------------------
-- PLANT TYPES (10 records)
-------------------------
INSERT INTO PlantType (Id, CommonName, ScientificName, WateringFrequencyDays, FertilizingFrequencyDays, SunlightNeeds) VALUES
(1, 'Snake Plant', 'Sansevieria trifasciata', 14, 60, 'Low to Moderate'),
(2, 'Spider Plant', 'Chlorophytum comosum', 7, 30, 'Bright Indirect'),
(3, 'Peace Lily', 'Spathiphyllum', 7, 45, 'Moderate'),
(4, 'Aloe Vera', 'Aloe barbadensis miller', 21, 90, 'Bright Indirect'),
(5, 'Fiddle Leaf Fig', 'Ficus lyrata', 10, 30, 'Bright, Indirect'),
(6, 'Pothos', 'Epipremnum aureum', 7, 60, 'Low to Bright Indirect'),
(7, 'ZZ Plant', 'Zamioculcas zamiifolia', 14, 90, 'Low Light'),
(8, 'Boston Fern', 'Nephrolepis exaltata', 3, 30, 'Indirect Light'),
(9, 'Rubber Plant', 'Ficus elastica', 14, 60, 'Bright, Indirect'),
(10, 'Orchid', 'Orchidaceae', 7, 30, 'Indirect');

-------------------------
-- PLANTS (18 records)
-- Distribution: User1: 3, User2: 4, User3: 6, User4: 5
-------------------------
INSERT INTO Plant (Id, Name, Nickname, Species, ImageUrl, DateAdded, UserId) VALUES
-- User 1's plants
(1, 'Snake Plant', 'Snakey', 1, 'https://example.com/snake1.jpg', NOW(), 1),
(2, 'Spider Plant', 'Webby', 2, 'https://example.com/spider1.jpg', NOW(), 1),
(3, 'Peace Lily', 'Lily', 3, 'https://example.com/peacelily1.jpg', NOW(), 1),

-- User 2's plants
(4, 'Aloe Vera', 'Aloe', 4, 'https://example.com/aloe1.jpg', NOW(), 2),
(5, 'Fiddle Leaf Fig', 'Fiddle', 5, 'https://example.com/fiddle1.jpg', NOW(), 2),
(6, 'Pothos', 'Pothosie', 6, 'https://example.com/pothos1.jpg', NOW(), 2),
(7, 'ZZ Plant', 'Zee', 7, 'https://example.com/zz1.jpg', NOW(), 2),

-- User 3's plants
(8, 'Boston Fern', 'Fernie', 8, 'https://example.com/bostonfern1.jpg', NOW(), 3),
(9, 'Rubber Plant', 'Rubby', 9, 'https://example.com/rubber1.jpg', NOW(), 3),
(10, 'Orchid', 'Orchy', 10, 'https://example.com/orchid1.jpg', NOW(), 3),
(11, 'Snake Plant', 'Slick', 1, 'https://example.com/snake2.jpg', NOW(), 3),
(12, 'Spider Plant', 'Spidey', 2, 'https://example.com/spider2.jpg', NOW(), 3),
(13, 'Peace Lily', 'Peaceful', 3, 'https://example.com/peacelily2.jpg', NOW(), 3),

-- User 4's plants
(14, 'Aloe Vera', 'Vera', 4, 'https://example.com/aloe2.jpg', NOW(), 4),
(15, 'Fiddle Leaf Fig', 'Figgy', 5, 'https://example.com/fiddle2.jpg', NOW(), 4),
(16, 'Pothos', 'Green', 6, 'https://example.com/pothos2.jpg', NOW(), 4),
(17, 'ZZ Plant', 'Zester', 7, 'https://example.com/zz2.jpg', NOW(), 4),
(18, 'Boston Fern', 'Ferna', 8, 'https://example.com/bostonfern2.jpg', NOW(), 4);

-------------------------
-- CARE LOGS
-- Each plant: at least 1 fertilization log + between 2-6 watering logs.
-- We'll follow a pattern (IDs are sequential across all care logs).
-------------------------
-- Plant 1: 3 Water, 1 Fertilizer (4 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(1, 1, NOW() - INTERVAL '3 days', 'Water'),
(2, 1, NOW() - INTERVAL '2 days', 'Water'),
(3, 1, NOW() - INTERVAL '1 day', 'Water'),
(4, 1, NOW() - INTERVAL '4 days', 'Fertilizer');

-- Plant 2: 2 Water, 1 Fertilizer (3 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(5, 2, NOW() - INTERVAL '5 days', 'Water'),
(6, 2, NOW() - INTERVAL '3 days', 'Water'),
(7, 2, NOW() - INTERVAL '6 days', 'Fertilizer');

-- Plant 3: 4 Water, 1 Fertilizer (5 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(8, 3, NOW() - INTERVAL '6 days', 'Water'),
(9, 3, NOW() - INTERVAL '5 days', 'Water'),
(10, 3, NOW() - INTERVAL '4 days', 'Water'),
(11, 3, NOW() - INTERVAL '3 days', 'Water'),
(12, 3, NOW() - INTERVAL '7 days', 'Fertilizer');

-- Plant 4: 3 Water, 1 Fertilizer (4 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(13, 4, NOW() - INTERVAL '3 days', 'Water'),
(14, 4, NOW() - INTERVAL '2 days', 'Water'),
(15, 4, NOW() - INTERVAL '1 day', 'Water'),
(16, 4, NOW() - INTERVAL '4 days', 'Fertilizer');

-- Plant 5: 2 Water, 1 Fertilizer (3 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(17, 5, NOW() - INTERVAL '5 days', 'Water'),
(18, 5, NOW() - INTERVAL '3 days', 'Water'),
(19, 5, NOW() - INTERVAL '6 days', 'Fertilizer');

-- Plant 6: 5 Water, 1 Fertilizer (6 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(20, 6, NOW() - INTERVAL '6 days', 'Water'),
(21, 6, NOW() - INTERVAL '5 days', 'Water'),
(22, 6, NOW() - INTERVAL '4 days', 'Water'),
(23, 6, NOW() - INTERVAL '3 days', 'Water'),
(24, 6, NOW() - INTERVAL '2 days', 'Water'),
(25, 6, NOW() - INTERVAL '7 days', 'Fertilizer');

-- Plant 7: 2 Water, 1 Fertilizer (3 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(26, 7, NOW() - INTERVAL '4 days', 'Water'),
(27, 7, NOW() - INTERVAL '2 days', 'Water'),
(28, 7, NOW() - INTERVAL '5 days', 'Fertilizer');

-- Plant 8: 4 Water, 1 Fertilizer (5 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(29, 8, NOW() - INTERVAL '5 days', 'Water'),
(30, 8, NOW() - INTERVAL '4 days', 'Water'),
(31, 8, NOW() - INTERVAL '3 days', 'Water'),
(32, 8, NOW() - INTERVAL '2 days', 'Water'),
(33, 8, NOW() - INTERVAL '6 days', 'Fertilizer');

-- Plant 9: 3 Water, 1 Fertilizer (4 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(34, 9, NOW() - INTERVAL '4 days', 'Water'),
(35, 9, NOW() - INTERVAL '3 days', 'Water'),
(36, 9, NOW() - INTERVAL '2 days', 'Water'),
(37, 9, NOW() - INTERVAL '5 days', 'Fertilizer');

-- Plant 10: 6 Water, 1 Fertilizer (7 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(38, 10, NOW() - INTERVAL '7 days', 'Water'),
(39, 10, NOW() - INTERVAL '6 days', 'Water'),
(40, 10, NOW() - INTERVAL '5 days', 'Water'),
(41, 10, NOW() - INTERVAL '4 days', 'Water'),
(42, 10, NOW() - INTERVAL '3 days', 'Water'),
(43, 10, NOW() - INTERVAL '2 days', 'Water'),
(44, 10, NOW() - INTERVAL '8 days', 'Fertilizer');

-- Plant 11: 2 Water, 1 Fertilizer (3 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(45, 11, NOW() - INTERVAL '3 days', 'Water'),
(46, 11, NOW() - INTERVAL '2 days', 'Water'),
(47, 11, NOW() - INTERVAL '4 days', 'Fertilizer');

-- Plant 12: 5 Water, 1 Fertilizer (6 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(48, 12, NOW() - INTERVAL '6 days', 'Water'),
(49, 12, NOW() - INTERVAL '5 days', 'Water'),
(50, 12, NOW() - INTERVAL '4 days', 'Water'),
(51, 12, NOW() - INTERVAL '3 days', 'Water'),
(52, 12, NOW() - INTERVAL '2 days', 'Water'),
(53, 12, NOW() - INTERVAL '7 days', 'Fertilizer');

-- Plant 13: 4 Water, 1 Fertilizer (5 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(54, 13, NOW() - INTERVAL '4 days', 'Water'),
(55, 13, NOW() - INTERVAL '3 days', 'Water'),
(56, 13, NOW() - INTERVAL '2 days', 'Water'),
(57, 13, NOW() - INTERVAL '1 day', 'Water'),
(58, 13, NOW() - INTERVAL '5 days', 'Fertilizer');

-- Plant 14: 3 Water, 1 Fertilizer (4 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(59, 14, NOW() - INTERVAL '3 days', 'Water'),
(60, 14, NOW() - INTERVAL '2 days', 'Water'),
(61, 14, NOW() - INTERVAL '1 day', 'Water'),
(62, 14, NOW() - INTERVAL '4 days', 'Fertilizer');

-- Plant 15: 2 Water, 1 Fertilizer (3 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(63, 15, NOW() - INTERVAL '4 days', 'Water'),
(64, 15, NOW() - INTERVAL '2 days', 'Water'),
(65, 15, NOW() - INTERVAL '5 days', 'Fertilizer');

-- Plant 16: 5 Water, 1 Fertilizer (6 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(66, 16, NOW() - INTERVAL '6 days', 'Water'),
(67, 16, NOW() - INTERVAL '5 days', 'Water'),
(68, 16, NOW() - INTERVAL '4 days', 'Water'),
(69, 16, NOW() - INTERVAL '3 days', 'Water'),
(70, 16, NOW() - INTERVAL '2 days', 'Water'),
(71, 16, NOW() - INTERVAL '7 days', 'Fertilizer');

-- Plant 17: 3 Water, 1 Fertilizer (4 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(72, 17, NOW() - INTERVAL '3 days', 'Water'),
(73, 17, NOW() - INTERVAL '2 days', 'Water'),
(74, 17, NOW() - INTERVAL '1 day', 'Water'),
(75, 17, NOW() - INTERVAL '4 days', 'Fertilizer');

-- Plant 18: 4 Water, 1 Fertilizer (5 logs)
INSERT INTO CareLog (Id, PlantId, Date, Type) VALUES
(76, 18, NOW() - INTERVAL '4 days', 'Water'),
(77, 18, NOW() - INTERVAL '3 days', 'Water'),
(78, 18, NOW() - INTERVAL '2 days', 'Water'),
(79, 18, NOW() - INTERVAL '1 day', 'Water'),
(80, 18, NOW() - INTERVAL '5 days', 'Fertilizer');

-------------------------
-- PROBLEM REPORTS
-- For variation: Odd-numbered Plant IDs get 3 reports, even-numbered get 2 reports.
-------------------------
-- Plant 1 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(1, 1, NOW() - INTERVAL '1 day', 'Yellowing leaves observed near base', 'Low'),
(2, 1, NOW() - INTERVAL '2 days', 'Minor discoloration on a few leaves', 'Low'),
(3, 1, NOW() - INTERVAL '3 days', 'Slight wilting in the afternoon', 'Medium');

-- Plant 2 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(4, 2, NOW() - INTERVAL '1 day', 'Brown spots on leaves detected', 'Medium'),
(5, 2, NOW() - INTERVAL '2 days', 'Some leaves appear dry', 'Low');

-- Plant 3 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(6, 3, NOW() - INTERVAL '1 day', 'Leaves showing signs of nutrient deficiency', 'High'),
(7, 3, NOW() - INTERVAL '2 days', 'Wilting observed in the morning', 'Medium'),
(8, 3, NOW() - INTERVAL '3 days', 'Edges of leaves turning brown', 'Medium');

-- Plant 4 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(9, 4, NOW() - INTERVAL '1 day', 'Slight overwatering symptoms', 'Low'),
(10, 4, NOW() - INTERVAL '2 days', 'Tip burn noticed on a few leaves', 'Medium');

-- Plant 5 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(11, 5, NOW() - INTERVAL '1 day', 'Drooping leaves despite watering', 'Medium'),
(12, 5, NOW() - INTERVAL '2 days', 'Excessive leaf drop observed', 'High'),
(13, 5, NOW() - INTERVAL '3 days', 'Discoloration affecting overall appearance', 'Medium');

-- Plant 6 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(14, 6, NOW() - INTERVAL '1 day', 'Leaves slightly crispy at edges', 'Low'),
(15, 6, NOW() - INTERVAL '2 days', 'Yellow patches on several leaves', 'Medium');

-- Plant 7 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(16, 7, NOW() - INTERVAL '1 day', 'Overall pale appearance observed', 'Low'),
(17, 7, NOW() - INTERVAL '2 days', 'Leaf tips are browning', 'Medium'),
(18, 7, NOW() - INTERVAL '3 days', 'Wilting during midday', 'Medium');

-- Plant 8 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(19, 8, NOW() - INTERVAL '1 day', 'Fungal spots on lower leaves', 'High'),
(20, 8, NOW() - INTERVAL '2 days', 'Leaves slightly drooping', 'Low');

-- Plant 9 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(21, 9, NOW() - INTERVAL '1 day', 'Sap exuding from a stem', 'High'),
(22, 9, NOW() - INTERVAL '2 days', 'Discoloration in the middle leaves', 'Medium'),
(23, 9, NOW() - INTERVAL '3 days', 'Crispy edges noted', 'Low');

-- Plant 10 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(24, 10, NOW() - INTERVAL '1 day', 'Overwatering signs on lower leaves', 'Medium'),
(25, 10, NOW() - INTERVAL '2 days', 'Brown tips observed', 'Low');

-- Plant 11 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(26, 11, NOW() - INTERVAL '1 day', 'Unusual spot pattern on leaves', 'Low'),
(27, 11, NOW() - INTERVAL '2 days', 'Leaf curling noticed', 'Medium'),
(28, 11, NOW() - INTERVAL '3 days', 'Slight drooping during afternoon', 'Medium');

-- Plant 12 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(29, 12, NOW() - INTERVAL '1 day', 'Brown patches developing on leaves', 'High'),
(30, 12, NOW() - INTERVAL '2 days', 'Mild discoloration observed', 'Low');

-- Plant 13 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(31, 13, NOW() - INTERVAL '1 day', 'Leaf margins turning brown', 'Medium'),
(32, 13, NOW() - INTERVAL '2 days', 'Slight wilting after midday', 'Low'),
(33, 13, NOW() - INTERVAL '3 days', 'Overall faded appearance', 'Medium');

-- Plant 14 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(34, 14, NOW() - INTERVAL '1 day', 'Light water stress signs', 'Low'),
(35, 14, NOW() - INTERVAL '2 days', 'Leaf discoloration observed', 'Medium');

-- Plant 15 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(36, 15, NOW() - INTERVAL '1 day', 'Some leaves are drooping', 'Medium'),
(37, 15, NOW() - INTERVAL '2 days', 'Edges of leaves appear dry', 'Low'),
(38, 15, NOW() - INTERVAL '3 days', 'Minor yellowing spotted', 'Medium');

-- Plant 16 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(39, 16, NOW() - INTERVAL '1 day', 'Leaves slightly crispy', 'Low'),
(40, 16, NOW() - INTERVAL '2 days', 'Light brown spots on leaves', 'Medium');

-- Plant 17 (odd): 3 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(41, 17, NOW() - INTERVAL '1 day', 'Fresh spots of discoloration', 'Low'),
(42, 17, NOW() - INTERVAL '2 days', 'Leaf curling at the edges', 'Medium'),
(43, 17, NOW() - INTERVAL '3 days', 'Slight overall drooping', 'Medium');

-- Plant 18 (even): 2 reports
INSERT INTO ProblemReport (Id, PlantId, DateReported, Description, Severity) VALUES
(44, 18, NOW() - INTERVAL '1 day', 'Minor fungal spot observed', 'Low'),
(45, 18, NOW() - INTERVAL '2 days', 'Leaf tips show early signs of browning', 'Medium');


-- Update Sequences (optional but good practice)
SELECT setval('users_id_seq', (SELECT MAX(Id) FROM Users));
SELECT setval('plant_id_seq', (SELECT MAX(Id) FROM Plant));
SELECT setval('planttype_id_seq', (SELECT MAX(Id) FROM PlantType));
SELECT setval('carelog_id_seq', (SELECT MAX(Id) FROM CareLog));
SELECT setval('problemreport_id_seq', (SELECT MAX(Id) FROM ProblemReport));

COMMIT;
-- ================================================
-- End of Seed Data
-- ================================================