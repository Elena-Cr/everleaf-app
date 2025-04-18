using AutoMapper;
using Everleaf.Model.Entities;
using Everleaf.Model.DTOs;

namespace Everleaf.Model
{
    public class MappingProfile : Profile
    {
     
        public MappingProfile()
        {
             // Plant ↔ PlantDTO (for GET and PUT)
            CreateMap<Plant, PlantDTO>().ReverseMap();

            // CreatePlantDTO → Plant (for POST)
            CreateMap<CreatePlantDTO, Plant>();

            // User
            CreateMap<Users, UserDTO>().ReverseMap();
            CreateMap<CreateUserDTO, Users>();

            // ProblemReport
            CreateMap<ProblemReport, ProblemReportDTO>().ReverseMap();
            CreateMap<CreateProblemReportDTO, ProblemReport>();
        }
    }
}
