using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : ControllerBase
    {
        protected PlantRepository Repository { get; }

        public PlantController(PlantRepository repository)
        {
            Repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<Plant> GetPlant([FromRoute] int id)
        {
            var plant = Repository.GetPlantById(id);
            if (plant == null)
            {
                return NotFound();
            }
            return Ok(plant);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Plant>> GetPlants()
        {
            return Ok(Repository.GetAllPlants());
        }

        [HttpPost]
        public ActionResult Post([FromBody] Plant plant)
        {
            if (plant == null)
            {
                return BadRequest("Plant info not correct");
            }

            bool status = Repository.InsertPlant(plant);
            if (status)
            {
                return Ok();
            }
            return BadRequest("Insert failed");
        }

        [HttpPut]
        public ActionResult Update([FromBody] Plant plant)
        {
            if (plant == null)
            {
                return BadRequest("Plant info not correct");
            }

            var existingPlant = Repository.GetPlantById(plant.Id);
            if (existingPlant == null)
            {
                return NotFound($"Plant with id {plant.Id} not found");
            }

            bool status = Repository.UpdatePlant(plant);
            if (status)
            {
                return Ok();
            }
            return BadRequest("Update failed");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existingPlant = Repository.GetPlantById(id);
            if (existingPlant == null)
            {
                return NotFound($"Plant with id {id} not found");
            }

            bool status = Repository.DeletePlant(id);
            if (status)
            {
                return NoContent();
            }
            return BadRequest($"Unable to delete plant with id {id}");
        }
    }
}
