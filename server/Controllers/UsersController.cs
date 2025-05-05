using AutoMapper;
using Everleaf.Model.DTOs;
using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Authorization;
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
        [AllowAnonymous]
        public ActionResult<UserDTO> Register([FromBody] UserRegisterDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.PasswordHash) ||
                string.IsNullOrWhiteSpace(dto.Email)
                )
            {
                return BadRequest("All fields are required.");
            }

            // Check if the username already exists
            var existingUser = _repository
            .GetAllUsers()
            .FirstOrDefault(u =>
                string.Equals(u.Username, dto.Username,
                            StringComparison.OrdinalIgnoreCase)
            );

            if (existingUser != null)
            {
                return Conflict("Username already exists. Please choose a different one.");
            }

            // Check if the email already exists
            var existingEmail = _repository
            .GetAllUsers()
            .FirstOrDefault(u =>
                string.Equals(u.Email, dto.Email,
                            StringComparison.OrdinalIgnoreCase)
            );
            if (existingEmail != null)
            {
                return Conflict("Email already exists. Please choose a different one.");
            }

            var userEntity = new Users(0)
            {
                Username     = dto.Username,
                PasswordHash = dto.PasswordHash,
                Email        = dto.Email
            };

            var success = _repository.InsertUser(userEntity);
            if (!success)
                return BadRequest("Failed to register.");

            // freshly retrieve the saved user (now with its real Id)
            var saved = _repository.GetUserByUsername(dto.Username);
            var userDto = _mapper.Map<UserDTO>(saved);

            // Return 201 Created + the DTO in the body
            return CreatedAtAction(
            nameof(GetUser),
            new { id = userDto.Id },
            userDto
            );
        }

        [HttpPost("login")]
        [AllowAnonymous]
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
