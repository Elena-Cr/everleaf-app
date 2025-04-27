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

        public CareLogController(CareLogRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public ActionResult<CareLog> GetCareLog([FromRoute] int id)
        {
            var careLog = _repository.GetCareLogById(id);
            if (careLog == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<CareLog>(careLog);
            return Ok(dto);
        }

        [HttpGet]
        public ActionResult<IEnumerable<CareLog>> GetCareLogs()
        {
            var logs = _repository.GetAllCareLogs();
            var dtos = _mapper.Map<IEnumerable<CareLog>>(logs);
            return Ok(dtos);
        }

        [HttpGet("plant/{plantId}")]
        public ActionResult<IEnumerable<CareLog>> GetByPlantId([FromRoute] int plantId)
        {
            var logs = _repository.GetLogsByPlantId(plantId);
            var dtos = _mapper.Map<IEnumerable<CareLog>>(logs);
            return Ok(dtos);
        }

        [HttpGet("user/{userId}")]
        public ActionResult<IEnumerable<CareLog>> GetByUserId(int userId)
        {
            var logs = _repository.GetLogsByUserId(userId);
            var dtos = _mapper.Map<IEnumerable<CareLog>>(logs);
            return Ok(dtos);
        }

        [HttpPost]
        public ActionResult Post([FromBody] CareLog dto)
        {
            if (dto == null)
            {
                return BadRequest("CareLog info not correct");
            }

            var log = _mapper.Map<CareLog>(dto);
            log.Date = dto.Date != default ? dto.Date : DateTime.Now;

            bool status = _repository.InsertCareLog(log);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed");
        }

        [HttpPut]
        public ActionResult Update([FromBody] CareLog dto)
        {
            if (dto == null)
            {
                return BadRequest("CareLog info not correct");
            }

            var existing = _repository.GetCareLogById(dto.Id);
            if (existing == null)
            {
                return NotFound($"CareLog with id {dto.Id} not found");
            }

            var updated = _mapper.Map<CareLog>(dto);
            bool status = _repository.UpdateCareLog(updated);

            return status ? Ok() : BadRequest("Update failed");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = _repository.GetCareLogById(id);
            if (existing == null)
            {
                return NotFound($"CareLog with id {id} not found");
            }

            bool status = _repository.DeleteCareLog(id);
            return status ? NoContent() : BadRequest("Delete failed");
        }
    }
}
