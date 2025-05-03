using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
        [ApiController]
    public class PlantTypeController : ControllerBase
    {
        protected PlantTypeRepository Repository { get; }

        public PlantTypeController(PlantTypeRepository repository)
        {
            Repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<PlantType> GetPlantType([FromRoute] int id)
        {
            var type = Repository.GetPlantTypeById(id);
            if (type == null)
            {
                return NotFound($"PlantType with id {id} not found");
            }
            return Ok(type);
        }

        [HttpGet]
        public ActionResult<IEnumerable<PlantType>> GetPlantType()
        {
            Console.WriteLine("GET /api/planttype called");
            var types = Repository.GetAllPlantType();
            if (types == null || !types.Any())
            {
                Console.WriteLine("No plant types found in database");
                return NotFound("No plant types found");
            }
            Console.WriteLine($"Returning {types.Count} plant types");
            return Ok(types);
        }

        [HttpPost]
        public ActionResult Post([FromBody] PlantType plantType)
        {
            if (plantType == null)
            {
                return BadRequest("PlantType info is missing or malformed.");
            }

            bool status = Repository.InsertPlantType(plantType);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpPut]
        public ActionResult Update([FromBody] PlantType plantType)
        {
            if (plantType == null)
            {
                return BadRequest("PlantType info is missing or malformed.");
            }

            var existing = Repository.GetPlantTypeById(plantType.Id);
            if (existing == null)
            {
                return NotFound($"PlantType with id {plantType.Id} not found");
            }

            bool status = Repository.UpdatePlantType(plantType);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed.");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = Repository.GetPlantTypeById(id);
            if (existing == null)
            {
                return NotFound($"PlantType with id {id} not found");
            }

            bool status = Repository.DeletePlantType(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest($"Unable to delete plant type with id {id}");
        }
    }
}
