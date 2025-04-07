using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CareLogController : ControllerBase
    {
        protected CareLogRepository Repository { get; }

        public CareLogController(CareLogRepository repository)
        {
            Repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<CareLog> GetCareLog([FromRoute] int id)
        {
            var careLog = Repository.GetCareLogById(id);
            if (careLog == null)
            {
                return NotFound();
            }
            return Ok(careLog);
        }

        [HttpGet]
        public ActionResult<IEnumerable<CareLog>> GetCareLogs()
        {
            return Ok(Repository.GetAllCareLogs());
        }

        [HttpPost]
        public ActionResult Post([FromBody] CareLog log)
        {
            if (log == null)
            {
                return BadRequest("CareLog info not correct");
            }

            bool status = Repository.InsertCareLog(log);
            if (status)
            {
                return Ok();
            }
            return BadRequest("Insert failed");
        }

        [HttpPut]
        public ActionResult Update([FromBody] CareLog log)
        {
            if (log == null)
            {
                return BadRequest("CareLog info not correct");
            }

            var existingLog = Repository.GetCareLogById(log.Id);
            if (existingLog == null)
            {
                return NotFound($"CareLog with id {log.Id} not found");
            }

            bool status = Repository.UpdateCareLog(log);
            if (status)
            {
                return Ok();
            }
            return BadRequest("Update failed");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existingLog = Repository.GetCareLogById(id);
            if (existingLog == null)
            {
                return NotFound($"CareLog with id {id} not found");
            }

            bool status = Repository.DeleteCareLog(id);
            if (status)
            {
                return NoContent();
            }
            return BadRequest($"Unable to delete CareLog with id {id}");
        }
    }
}
