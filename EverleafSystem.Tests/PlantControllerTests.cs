using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using AutoMapper;
using Everleaf.API.Controllers; 
using Everleaf.Model.Repositories;
using Everleaf.Model.Entities;
using Everleaf.Model.DTOs;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq; 

namespace EverleafSystem.Tests
{
    [TestClass]
    public class PlantControllerTests
    {
        // Mock the interface now
        private Mock<IPlantRepository>? _mockRepo;
        private Mock<IMapper>? _mockMapper;
        private PlantController? _controller;

        [TestInitialize] 
        public void Setup()
        {
            // Mock the interface
            _mockRepo = new Mock<IPlantRepository>();
            _mockMapper = new Mock<IMapper>();

            // Instantiate the controller with mocks
            _controller = new PlantController(_mockRepo.Object, _mockMapper.Object);
        }

        // Ensure all test methods are public void/Task and inside the class

        [TestMethod]
        public void GetPlant_ExistingId_ReturnsOkObjectResultWithPlantDTO()
        {
            // Arrange
            int testPlantId = 1;
            var plantEntity = new Plant { Id = testPlantId, Name = "Test Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };
            var plantDto = new PlantDTO { Id = testPlantId, Name = "Test Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };

            // Use null forgiving operator (!) for mocks initialized in Setup
            _mockRepo!.Setup(repo => repo.GetPlantById(testPlantId))
                     .Returns(plantEntity);
            _mockMapper!.Setup(mapper => mapper.Map<PlantDTO>(plantEntity))
                       .Returns(plantDto);

            // Act
            var result = _controller!.GetPlant(testPlantId); // Use ! for controller

            // Assert
            Assert.IsInstanceOfType(result, typeof(ActionResult<PlantDTO>));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);
            var returnedDto = okResult.Value as PlantDTO;
            Assert.IsNotNull(returnedDto);
            Assert.AreEqual(testPlantId, returnedDto.Id);
            Assert.AreEqual(plantDto.Name, returnedDto.Name);

            _mockRepo.Verify(repo => repo.GetPlantById(testPlantId), Times.Once);
            _mockMapper.Verify(mapper => mapper.Map<PlantDTO>(plantEntity), Times.Once);
        }

        [TestMethod]
        public void GetPlant_NonExistingId_ReturnsNotFoundResult()
        {
            // Arrange
            int testPlantId = 99;

            // Return default (null for reference types) when not found
            _mockRepo!.Setup(repo => repo.GetPlantById(testPlantId))
                     .Returns(default(Plant)); // Use default(Plant) instead of casting null

            // Act
            var result = _controller!.GetPlant(testPlantId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ActionResult<PlantDTO>));
            Assert.IsInstanceOfType(result.Result, typeof(NotFoundResult));

            _mockRepo.Verify(repo => repo.GetPlantById(testPlantId), Times.Once);
            _mockMapper!.Verify(mapper => mapper.Map<PlantDTO>(It.IsAny<Plant>()), Times.Never);
        }

        // --- Tests for Post ---
        [TestMethod]
        public void Post_ValidPlant_ReturnsOkResult()
        {
            // Arrange
            var createDto = new CreatePlantDTO { Name = "New Plant", Species = 2, UserId = 1, DateAdded = System.DateTime.UtcNow };
            var plantEntity = new Plant { Name = "New Plant", Species = 2, UserId = 1, DateAdded = System.DateTime.UtcNow };

            _mockMapper!.Setup(m => m.Map<Plant>(createDto)).Returns(plantEntity);
            _mockRepo!.Setup(r => r.InsertPlant(plantEntity)).Returns(true);

            // Act
            var result = _controller!.Post(createDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
            _mockRepo.Verify(r => r.InsertPlant(It.IsAny<Plant>()), Times.Once);
        }

        [TestMethod]
        public void Post_InsertFails_ReturnsBadRequestResult()
        {
            // Arrange
            var createDto = new CreatePlantDTO { Name = "New Plant", Species = 2, UserId = 1, DateAdded = System.DateTime.UtcNow };
            var plantEntity = new Plant { Name = "New Plant", Species = 2, UserId = 1, DateAdded = System.DateTime.UtcNow };

            _mockMapper!.Setup(m => m.Map<Plant>(createDto)).Returns(plantEntity);
            _mockRepo!.Setup(r => r.InsertPlant(plantEntity)).Returns(false);

            // Act
            var result = _controller!.Post(createDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            _mockRepo.Verify(r => r.InsertPlant(It.IsAny<Plant>()), Times.Once);
        }

        [TestMethod]
        public void Post_NullDto_ReturnsBadRequestResult()
        {
             // Arrange
            CreatePlantDTO? createDto = null; // Make DTO nullable

            // Act
            var result = _controller!.Post(createDto!); // Use ! to pass to non-nullable parameter (controller checks for null)

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            _mockRepo!.Verify(r => r.InsertPlant(It.IsAny<Plant>()), Times.Never);
        }


        // --- Tests for Delete ---
        [TestMethod]
        public void Delete_ExistingId_ReturnsNoContentResult()
        {
            // Arrange
            int testPlantId = 1;
            var plantEntity = new Plant { Id = testPlantId, Name = "Test Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };

            _mockRepo!.Setup(r => r.GetPlantById(testPlantId)).Returns(plantEntity);
            _mockRepo!.Setup(r => r.DeletePlant(testPlantId)).Returns(true);

            // Act
            var result = _controller!.Delete(testPlantId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NoContentResult));
            _mockRepo.Verify(r => r.DeletePlant(testPlantId), Times.Once);
        }

        [TestMethod]
        public void Delete_NonExistingId_ReturnsNotFoundResult()
        {
            // Arrange
            int testPlantId = 99;
            _mockRepo!.Setup(r => r.GetPlantById(testPlantId)).Returns(default(Plant)); // Use default

            // Act
            var result = _controller!.Delete(testPlantId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            _mockRepo.Verify(r => r.DeletePlant(testPlantId), Times.Never);
        }

        // --- Tests for Update ---
        [TestMethod]
        public void Update_ExistingPlant_ReturnsOkResult()
        {
            // Arrange
            var updateDto = new PlantDTO { Id = 1, Name = "Updated Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };
            var existingPlantEntity = new Plant { Id = 1, Name = "Old Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow.AddDays(-1) };
            var updatedPlantEntity = new Plant { Id = 1, Name = "Updated Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };

            _mockRepo!.Setup(r => r.GetPlantById(updateDto.Id)).Returns(existingPlantEntity);
            _mockMapper!.Setup(m => m.Map<Plant>(updateDto)).Returns(updatedPlantEntity);
            _mockRepo!.Setup(r => r.UpdatePlant(updatedPlantEntity)).Returns(true);

            // Act
            var result = _controller!.Update(updateDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(OkResult));
            _mockRepo.Verify(r => r.GetPlantById(updateDto.Id), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlant(It.Is<Plant>(p => p.Id == updateDto.Id && p.Name == updateDto.Name)), Times.Once);
        }

        [TestMethod]
        public void Update_NonExistingPlant_ReturnsNotFoundResult()
        {
            // Arrange
            var updateDto = new PlantDTO { Id = 99, Name = "Non Existent", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };

            _mockRepo!.Setup(r => r.GetPlantById(updateDto.Id)).Returns(default(Plant)); // Use default

            // Act
            var result = _controller!.Update(updateDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(NotFoundObjectResult));
            _mockRepo.Verify(r => r.GetPlantById(updateDto.Id), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlant(It.IsAny<Plant>()), Times.Never);
        }

         [TestMethod]
        public void Update_UpdateFails_ReturnsBadRequestResult()
        {
            // Arrange
            var updateDto = new PlantDTO { Id = 1, Name = "Updated Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };
            var existingPlantEntity = new Plant { Id = 1, Name = "Old Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow.AddDays(-1) };
            var updatedPlantEntity = new Plant { Id = 1, Name = "Updated Plant", Species = 1, UserId = 1, DateAdded = System.DateTime.UtcNow };

            _mockRepo!.Setup(r => r.GetPlantById(updateDto.Id)).Returns(existingPlantEntity);
            _mockMapper!.Setup(m => m.Map<Plant>(updateDto)).Returns(updatedPlantEntity);
            _mockRepo!.Setup(r => r.UpdatePlant(updatedPlantEntity)).Returns(false);

            // Act
            var result = _controller!.Update(updateDto);

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            _mockRepo.Verify(r => r.GetPlantById(updateDto.Id), Times.Once);
            _mockRepo.Verify(r => r.UpdatePlant(It.IsAny<Plant>()), Times.Once);
        }

        [TestMethod]
        public void Update_NullDto_ReturnsBadRequestResult()
        {
            // Arrange
            PlantDTO? updateDto = null; // Make DTO nullable

            // Act
            var result = _controller!.Update(updateDto!); // Use ! to pass to non-nullable parameter

            // Assert
            Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult));
            _mockRepo!.Verify(r => r.GetPlantById(It.IsAny<int>()), Times.Never);
            _mockRepo!.Verify(r => r.UpdatePlant(It.IsAny<Plant>()), Times.Never);
        }


        // --- Tests for GetPlants ---
        [TestMethod]
        public void GetPlants_ByUserId_ReturnsOkObjectResultWithPlantDTOs()
        {
            // Arrange
            int testUserId = 1;
            var plantEntities = new List<Plant>
            {
                new Plant { Id = 1, Name = "Plant A", Species = 1, UserId = testUserId, DateAdded = System.DateTime.UtcNow },
                new Plant { Id = 2, Name = "Plant B", Species = 2, UserId = testUserId, DateAdded = System.DateTime.UtcNow }
            };
            var plantDtos = new List<PlantDTO>
            {
                new PlantDTO { Id = 1, Name = "Plant A", Species = 1, UserId = testUserId, DateAdded = System.DateTime.UtcNow },
                new PlantDTO { Id = 2, Name = "Plant B", Species = 2, UserId = testUserId, DateAdded = System.DateTime.UtcNow }
            };

            _mockRepo!.Setup(r => r.GetPlantsByUserId(testUserId)).Returns(plantEntities);
            _mockMapper!.Setup(m => m.Map<IEnumerable<PlantDTO>>(plantEntities)).Returns(plantDtos);

            // Act
            var result = _controller!.GetPlants(testUserId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ActionResult<IEnumerable<PlantDTO>>));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var returnedDtos = okResult.Value as IEnumerable<PlantDTO>;
            Assert.IsNotNull(returnedDtos);
            Assert.AreEqual(2, returnedDtos.Count());
            _mockRepo.Verify(r => r.GetPlantsByUserId(testUserId), Times.Once);
            _mockMapper.Verify(m => m.Map<IEnumerable<PlantDTO>>(plantEntities), Times.Once);
        }

        [TestMethod]
        public void GetPlants_ByUserId_NoPlants_ReturnsOkObjectResultWithEmptyList()
        {
            // Arrange
            int testUserId = 2;
            var emptyPlantEntities = new List<Plant>();
            var emptyPlantDtos = new List<PlantDTO>();

            _mockRepo!.Setup(r => r.GetPlantsByUserId(testUserId)).Returns(emptyPlantEntities);
            _mockMapper!.Setup(m => m.Map<IEnumerable<PlantDTO>>(emptyPlantEntities)).Returns(emptyPlantDtos);

            // Act
            var result = _controller!.GetPlants(testUserId);

            // Assert
            Assert.IsInstanceOfType(result, typeof(ActionResult<IEnumerable<PlantDTO>>));
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            Assert.AreEqual(200, okResult.StatusCode);

            var returnedDtos = okResult.Value as IEnumerable<PlantDTO>;
            Assert.IsNotNull(returnedDtos);
            Assert.AreEqual(0, returnedDtos.Count());
            _mockRepo.Verify(r => r.GetPlantsByUserId(testUserId), Times.Once);
            _mockMapper.Verify(m => m.Map<IEnumerable<PlantDTO>>(emptyPlantEntities), Times.Once);
        }

        // Note: Testing ModelState requires a bit more setup if you rely on automatic validation.
        // If your controller explicitly checks ModelState.IsValid, you can add errors like this:
        // _controller.ModelState.AddModelError("Name", "Name is required");
        // var result = _controller.Post(invalidDto);
        // Assert.IsInstanceOfType(result, typeof(BadRequestObjectResult)); // Or BadRequestResult depending on implementation

    } // End of PlantControllerTests class
} // End of namespace