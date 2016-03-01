﻿namespace QuizProjectMvc.Web.ViewModels.ProfileInformation
{
    using System.Linq;
    using AutoMapper;
    using Data.Models;
    using Infrastructure.Mapping;

    public class PublicProfileDetailed : PublicProfile, IMapFrom<User>, IHaveCustomMappings
    {
        public string Id { get; set; }

        public int QuizzesCreated { get; set; }

        public double Rating { get; set; }

        public void CreateMappings(IMapperConfiguration configuration)
        {
            configuration.CreateMap<User, PublicProfileDetailed>()
                .ForMember(
                    self => self.QuizzesCreated,
                    opt => opt.MapFrom(model => model.QuizzesCreated.Count))
                .ForMember(
                    self => self.Rating,
                    opt => opt.MapFrom(
                        model => model.QuizzesCreated.SelectMany(q => q.Ratings).Any()
                            ? model.QuizzesCreated.SelectMany(q => q.Ratings).Average(r => r.Value)
                            : 0));
        }
    }
}
