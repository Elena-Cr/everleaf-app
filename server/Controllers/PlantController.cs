using AutoMapper;
using Everleaf.Model.DTOs;
using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PlantController : ControllerBase
    {
        // Depend on the interface
        private readonly IPlantRepository _repository;
        private readonly IMapper _mapper;

        // Inject the interface
        public PlantController(IPlantRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public ActionResult<PlantDTO> GetPlant([FromRoute] int id)
        {
            var plant = _repository.GetPlantById(id);
            if (plant == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<PlantDTO>(plant);
            dto.Id = plant.Id; // Ensure Id is explicitly mapped
            return Ok(dto);
        }

        [HttpGet]
        public ActionResult<IEnumerable<PlantDTO>> GetPlants([FromQuery] int userId)
        {
            var plants = _repository.GetPlantsByUserId(userId);
            var dtos = _mapper.Map<IEnumerable<PlantDTO>>(plants);
            return Ok(dtos);
        }

        [HttpPost]
        public ActionResult Post([FromBody] CreatePlantDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Plant info not correct");
            }

            var plant = _mapper.Map<Plant>(dto);
            bool status = _repository.InsertPlant(plant);

            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed");
        }

        [HttpPut]
        public ActionResult Update([FromBody] PlantDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("Plant info not correct");
            }

            var existingPlant = _repository.GetPlantById(dto.Id);
            if (existingPlant == null)
            {
                return NotFound($"Plant with id {dto.Id} not found");
            }

            var plant = _mapper.Map<Plant>(dto);
            bool status = _repository.UpdatePlant(plant);

            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existingPlant = _repository.GetPlantById(id);
            if (existingPlant == null)
            {
                return NotFound($"Plant with id {id} not found");
            }

            bool status = _repository.DeletePlant(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest($"Unable to delete plant with id {id}");
        }
    }
}
