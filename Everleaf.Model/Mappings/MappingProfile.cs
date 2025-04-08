using AutoMapper;
using Everleaf.Model.Entities;
using Everleaf.Model.DTOs;

namespace Everleaf.Model
{
    /// <summary>
    /// Defines AutoMapper mapping configurations for the Everleaf application.
    /// This profile handles the mapping between domain entities and DTOs.
    /// </summary>
    public class MappingProfile : Profile
    {
        /// <summary>
        /// Initializes a new instance of the MappingProfile class.
        /// Configures all entity to DTO mappings for the application.
        /// </summary>
        public MappingProfile()
        {
             // Plant ↔ PlantDTO (for GET and PUT)
            CreateMap<Plant, PlantDTO>().ReverseMap();

            // CreatePlantDTO → Plant (for POST)
            CreateMap<CreatePlantDTO, Plant>();
        }
    }
}
