using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantTagController : ControllerBase
    {
        protected PlantTagRepository Repository { get; }

        public PlantTagController(PlantTagRepository repository)
        {
            Repository = repository;
        }

        [HttpGet]
        public ActionResult<IEnumerable<PlantTag>> GetAll()
        {
            return Ok(Repository.GetAllPlantTag());
        }

        [HttpPost]
        public ActionResult Post([FromBody] PlantTag tag)
        {
            if (tag == null)
            {
                return BadRequest("PlantTag info is missing or malformed.");
            }

            bool status = Repository.InsertPlantTag(tag);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpDelete]
        public ActionResult Delete([FromQuery] int plantId, [FromQuery] int tagId)
        {
            bool exists = Repository
                .GetAllPlantTag()
                .Any(pt => pt.PlantId == plantId && pt.TagId == tagId);

            if (!exists)
            {
                return NotFound($"No PlantTag with PlantId={plantId} and TagId={tagId}");
            }

            bool status = Repository.DeletePlantTag(plantId, tagId);
            if (status)
            {
                return NoContent();
            }

            return BadRequest("Delete failed.");
        }
    }
}
