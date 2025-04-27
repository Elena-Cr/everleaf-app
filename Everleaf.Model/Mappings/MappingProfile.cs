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

            // PlantType
            CreateMap<PlantType, PlantType>()
                .ConstructUsing(src => new PlantType(src.Id))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CommonName, opt => opt.MapFrom(src => src.CommonName))
                .ForMember(dest => dest.ScientificName, opt => opt.MapFrom(src => src.ScientificName))
                .ForMember(dest => dest.WateringFrequencyDays, opt => opt.MapFrom(src => src.WateringFrequencyDays))
                .ForMember(dest => dest.FertilizingFrequencyDays, opt => opt.MapFrom(src => src.FertilizingFrequencyDays))
                .ForMember(dest => dest.SunlightNeeds, opt => opt.MapFrom(src => src.SunlightNeeds));

            // ProblemReport
            CreateMap<ProblemReport, ProblemReportDTO>().ReverseMap();
            CreateMap<CreateProblemReportDTO, ProblemReport>();
        }
    }
}
