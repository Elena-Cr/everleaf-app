using AutoMapper;
using Everleaf.Model.DTOs;
using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserRepository _repository;
        private readonly IMapper _mapper;

        public UsersController(UserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet("{id}")]
        public ActionResult<UserDTO> GetUser([FromRoute] int id)
        {
            var user = _repository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }

            var dto = _mapper.Map<UserDTO>(user);
            return Ok(dto);
        }

        [HttpGet]
        public ActionResult<IEnumerable<UserDTO>> GetUsers()
        {
            var users = _repository.GetAllUsers();
            var dtos = _mapper.Map<IEnumerable<UserDTO>>(users);
            return Ok(dtos);
        }

        [HttpPost]
        public ActionResult Post([FromBody] CreateUserDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("User info is missing or malformed.");
            }

            var user = _mapper.Map<Users>(dto);

            bool status = _repository.InsertUser(user);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpPut]
        public ActionResult Update([FromBody] UserDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("User info is missing or malformed.");
            }

            var existing = _repository.GetUserById(dto.Id);
            if (existing == null)
            {
                return NotFound($"User with id {dto.Id} not found.");
            }

            var updatedUser = _mapper.Map<Users>(dto);
            updatedUser.PasswordHash = existing.PasswordHash; // Keep the old password (not sent in DTO)

            bool status = _repository.UpdateUser(updatedUser);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed.");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = _repository.GetUserById(id);
            if (existing == null)
            {
                return NotFound($"User with id {id} not found.");
            }

            bool status = _repository.DeleteUser(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest("Delete failed.");
        }

        [HttpPost("register")]
        public ActionResult Register([FromBody] UserRegisterDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) || string.IsNullOrWhiteSpace(dto.PasswordHash))
                return BadRequest("Username and password are required.");

            var existing = _repository.GetUserByUsername(dto.Username);
            if (existing != null)
                return Conflict("Username already exists.");

            var user = new Users(0)
            {
                Username = dto.Username,
                PasswordHash = dto.PasswordHash, // optionally hash this later
                Email = dto.Email
            };

            var status = _repository.InsertUser(user);
            return status ? Ok("User registered") : BadRequest("Failed to register.");
        }

        [HttpPost("login")]
        public ActionResult<UserDTO> Login([FromBody] UserLoginDTO dto)
        {
            var user = _repository.GetUserByUsername(dto.Username);
            if (user == null || user.PasswordHash != dto.PasswordHash)
                return Unauthorized("Invalid credentials.");

            var userDto = _mapper.Map<UserDTO>(user);
            return Ok(userDto);
        }
    }
}
