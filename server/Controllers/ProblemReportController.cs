using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProblemReportController : ControllerBase
    {
        protected ProblemReportRepository Repository { get; }

        public ProblemReportController(ProblemReportRepository repository)
        {
            Repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<ProblemReport> GetById([FromRoute] int id)
        {
            var report = Repository.GetReportById(id);
            if (report == null)
            {
                return NotFound();
            }
            return Ok(report);
        }

        [HttpGet]
        public ActionResult<IEnumerable<ProblemReport>> GetAll()
        {
            return Ok(Repository.GetAllReports());
        }

        [HttpPost]
        public ActionResult Post([FromBody] ProblemReport report)
        {
            if (report == null)
            {
                return BadRequest("ProblemReport info is missing or malformed.");
            }

            bool status = Repository.InsertReport(report);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpPut]
        public ActionResult Update([FromBody] ProblemReport report)
        {
            if (report == null)
            {
                return BadRequest("ProblemReport info is missing or malformed.");
            }

            var existing = Repository.GetReportById(report.Id);
            if (existing == null)
            {
                return NotFound($"ProblemReport with id {report.Id} not found.");
            }

            bool status = Repository.UpdateReport(report);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed.");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = Repository.GetReportById(id);
            if (existing == null)
            {
                return NotFound($"ProblemReport with id {id} not found.");
            }

            bool status = Repository.DeleteReport(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest("Delete failed.");
        }
    }
}
