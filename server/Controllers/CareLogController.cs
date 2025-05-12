using AutoMapper;
using Everleaf.Model.DTOs;
using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CareLogController : ControllerBase
    {
        private readonly CareLogRepository _repository;
        private readonly IMapper _mapper;

        // Constructor to inject dependencies for the repository and AutoMapper
        public CareLogController(CareLogRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/carelog/{id}
        // Retrieves a specific CareLog by its ID
        [HttpGet("{id}")]
        public ActionResult<CareLog> GetCareLog([FromRoute] int id)
        {
            var careLog = _repository.GetCareLogById(id);
            if (careLog == null)
            {
                return NotFound(); // Returns 404 if the CareLog is not found
            }

            var dto = _mapper.Map<CareLog>(careLog); // Maps the entity to a DTO
            return Ok(dto); // Returns the CareLog as a response
        }

        // GET: api/carelog
        // Retrieves all CareLogs
        [HttpGet]
        public ActionResult<IEnumerable<CareLog>> GetCareLogs()
        {
            var logs = _repository.GetAllCareLogs();
            var dtos = _mapper.Map<IEnumerable<CareLog>>(logs); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of CareLogs
        }

        // GET: api/carelog/plant/{plantId}
        // Retrieves all CareLogs associated with a specific plant
        [HttpGet("plant/{plantId}")]
        public ActionResult<IEnumerable<CareLog>> GetByPlantId([FromRoute] int plantId)
        {
            var logs = _repository.GetLogsByPlantId(plantId);
            var dtos = _mapper.Map<IEnumerable<CareLog>>(logs); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of CareLogs for the specified plant
        }

        // GET: api/carelog/user/{userId}
        // Retrieves all CareLogs associated with a specific user
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<CareLog>> GetByUserId(int userId)
        {
            var logs = _repository.GetLogsByUserId(userId);
            var dtos = _mapper.Map<IEnumerable<CareLog>>(logs); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of CareLogs for the specified user
        }

        // POST: api/carelog
        // Creates a new CareLog
        [HttpPost]
        public ActionResult Post([FromBody] CareLog dto)
        {
            if (dto == null)
            {
                return BadRequest("CareLog info not correct"); // Returns 400 if the input is invalid
            }

            var log = _mapper.Map<CareLog>(dto); // Maps the DTO to an entity
            log.Date = dto.Date != default ? dto.Date : DateTime.Now; // Sets the date to now if not provided

            bool status = _repository.InsertCareLog(log); // Inserts the CareLog into the repository
            if (status)
            {
                return Ok(); // Returns 200 if the insertion is successful
            }

            return BadRequest("Insert failed"); // Returns 400 if the insertion fails
        }

        // PUT: api/carelog
        // Updates an existing CareLog
        [HttpPut]
        public ActionResult Update([FromBody] CareLog dto)
        {
            if (dto == null)
            {
                return BadRequest("CareLog info not correct"); // Returns 400 if the input is invalid
            }

            var existing = _repository.GetCareLogById(dto.Id); // Retrieves the existing CareLog
            if (existing == null)
            {
                return NotFound($"CareLog with id {dto.Id} not found"); // Returns 404 if the CareLog does not exist
            }

            var updated = _mapper.Map<CareLog>(dto); // Maps the DTO to an entity
            bool status = _repository.UpdateCareLog(updated); // Updates the CareLog in the repository

            return status ? Ok() : BadRequest("Update failed"); // Returns 200 if successful, 400 otherwise
        }

        // DELETE: api/carelog/{id}
        // Deletes a specific CareLog by its ID
        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = _repository.GetCareLogById(id); // Retrieves the existing CareLog
            if (existing == null)
            {
                return NotFound($"CareLog with id {id} not found"); // Returns 404 if the CareLog does not exist
            }

            bool status = _repository.DeleteCareLog(id); // Deletes the CareLog from the repository
            return status ? NoContent() : BadRequest("Delete failed"); // Returns 204 if successful, 400 otherwise
        }
    }
}
