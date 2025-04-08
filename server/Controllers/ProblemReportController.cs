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

        public ProblemReportController(ProblemReportRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public ActionResult<ProblemReportDTO> GetById([FromRoute] int id)
        {
            var report = _repository.GetReportById(id);
            if (report == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<ProblemReportDTO>(report);
            return Ok(dto);
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProblemReportDTO>> GetAll()
        {
            var reports = _repository.GetAllReports();
            var dtos = _mapper.Map<IEnumerable<ProblemReportDTO>>(reports);
            return Ok(dtos);
        }

        [HttpPost]
        public ActionResult Post([FromBody] CreateProblemReportDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("ProblemReport info is missing or malformed.");
            }

            var report = _mapper.Map<ProblemReport>(dto);
            report.DateReported = DateTime.Now;

            bool status = _repository.InsertReport(report);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpPut]
        public ActionResult Update([FromBody] ProblemReportDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("ProblemReport info is missing or malformed.");
            }

            var existing = _repository.GetReportById(dto.Id);
            if (existing == null)
            {
                return NotFound($"ProblemReport with id {dto.Id} not found.");
            }

            var report = _mapper.Map<ProblemReport>(dto);
            bool status = _repository.UpdateReport(report);

            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed.");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = _repository.GetReportById(id);
            if (existing == null)
            {
                return NotFound($"ProblemReport with id {id} not found.");
            }

            bool status = _repository.DeleteReport(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest("Delete failed.");
        }
    }
}
