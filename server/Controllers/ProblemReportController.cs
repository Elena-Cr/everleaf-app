using AutoMapper;
using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Everleaf.Model.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemReportController : ControllerBase
    {
        private readonly ProblemReportRepository _repository;
        private readonly IMapper _mapper;

        // Constructor to inject dependencies for the repository and AutoMapper
        public ProblemReportController(ProblemReportRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/problemreport/{id}
        // Retrieves a specific ProblemReport by its ID
        [HttpGet("{id}")]
        public ActionResult<ProblemReportDTO> GetById([FromRoute] int id)
        {
            var report = _repository.GetReportById(id); // Fetches the ProblemReport by ID from the repository
            if (report == null)
            {
                return NotFound(); // Returns 404 if the ProblemReport is not found
            }

            var dto = _mapper.Map<ProblemReportDTO>(report); // Maps the entity to a DTO
            return Ok(dto); // Returns the report as a response
        }

        // GET: api/problemreport
        // Retrieves all ProblemReports
        [HttpGet]
        public ActionResult<IEnumerable<ProblemReportDTO>> GetAll()
        {
            var reports = _repository.GetAllReports(); // Fetches all reports from the repository
            var dtos = _mapper.Map<IEnumerable<ProblemReportDTO>>(reports); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of reports
        }

        // GET: api/problemreport/user/{userId}
        // Retrieves all ProblemReports associated with a specific user
        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<ProblemReportDTO>> GetByUserId([FromRoute] int userId)
        {
            var reports = _repository.GetReportsByUserId(userId); // Fetches reports by user ID
            var dtos = _mapper.Map<IEnumerable<ProblemReportDTO>>(reports); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of reports for the specified user
        }

        // GET: api/problemreport/plant/{plantId}
        // Retrieves all ProblemReports associated with a specific plant
        [HttpGet("plant/{plantId}")]
        public ActionResult<IEnumerable<ProblemReportDTO>> GetByPlantId([FromRoute] int plantId)
        {
            var reports = _repository.GetReportsByPlantId(plantId); // Fetches reports by plant ID
            var dtos = _mapper.Map<IEnumerable<ProblemReportDTO>>(reports); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of reports for the specified plant
        }

        // POST: api/problemreport
        // Creates a new ProblemReport
        [HttpPost]
        public ActionResult Post([FromBody] CreateProblemReportDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("ProblemReport info is missing or malformed."); // Returns 400 if the input is invalid
            }

            var report = _mapper.Map<ProblemReport>(dto); // Maps the DTO to an entity
            report.DateReported = dto.DateReported ?? DateTime.Today; // Sets the report date

            bool status = _repository.InsertReport(report); // Inserts the report into the repository
            if (status)
            {
                return Ok(); // Returns 200 if the insertion is successful
            }

            return BadRequest("Insert failed."); // Returns 400 if the insertion fails
        }

        // PUT: api/problemreport
        // Updates an existing ProblemReport
        [HttpPut]
        public ActionResult Update([FromBody] ProblemReportDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("ProblemReport info is missing or malformed."); // Returns 400 if the input is invalid
            }

            var existing = _repository.GetReportById(dto.Id); // Fetches the existing report by ID
            if (existing == null)
            {
                return NotFound($"ProblemReport with id {dto.Id} not found."); // Returns 404 if the report is not found
            }

            var report = _mapper.Map<ProblemReport>(dto); // Maps the DTO to an entity
            bool status = _repository.UpdateReport(report); // Updates the report in the repository

            if (status)
            {
                return Ok(); // Returns 200 if the update is successful
            }

            return BadRequest("Update failed."); // Returns 400 if the update fails
        }

        // DELETE: api/problemreport/{id}
        // Deletes a specific ProblemReport by its ID
        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = _repository.GetReportById(id); // Fetches the existing report by ID
            if (existing == null)
            {
                return NotFound($"ProblemReport with id {id} not found."); // Returns 404 if the report is not found
            }

            bool status = _repository.DeleteReport(id); // Deletes the report from the repository
            if (status)
            {
                return NoContent(); // Returns 204 if the deletion is successful
            }

            return BadRequest("Delete failed."); // Returns 400 if the deletion fails
        }
    }
}
