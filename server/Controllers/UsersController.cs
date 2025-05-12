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

        // Constructor to inject dependencies for the repository and AutoMapper
        public UsersController(UserRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        // GET: api/users/{id}
        // Retrieves a specific user by their ID
        [HttpGet("{id}")]
        public ActionResult<UserDTO> GetUser([FromRoute] int id)
        {
            var user = _repository.GetUserById(id); // Fetches the user by ID from the repository
            if (user == null)
            {
                return NotFound(); // Returns 404 if the user is not found
            }

            var dto = _mapper.Map<UserDTO>(user); // Maps the entity to a DTO
            return Ok(dto); // Returns the user as a response
        }

        // GET: api/users
        // Retrieves all users
        [HttpGet]
        public ActionResult<IEnumerable<UserDTO>> GetUsers()
        {
            var users = _repository.GetAllUsers(); // Fetches all users from the repository
            var dtos = _mapper.Map<IEnumerable<UserDTO>>(users); // Maps the list of entities to DTOs
            return Ok(dtos); // Returns the list of users
        }

        // POST: api/users
        // Creates a new user
        [HttpPost]
        public ActionResult Post([FromBody] CreateUserDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("User info is missing or malformed."); // Returns 400 if the input is invalid
            }

            var user = _mapper.Map<Users>(dto); // Maps the DTO to an entity

            bool status = _repository.InsertUser(user); // Inserts the user into the repository
            if (status)
            {
                return Ok(); // Returns 200 if the insertion is successful
            }

            return BadRequest("Insert failed."); // Returns 400 if the insertion fails
        }

        // PUT: api/users
        // Updates an existing user
        [HttpPut]
        public ActionResult Update([FromBody] UserDTO dto)
        {
            if (dto == null)
            {
                return BadRequest("User info is missing or malformed."); // Returns 400 if the input is invalid
            }

            var existing = _repository.GetUserById(dto.Id); // Fetches the existing user by ID
            if (existing == null)
            {
                return NotFound($"User with id {dto.Id} not found."); // Returns 404 if the user is not found
            }

            var updatedUser = _mapper.Map<Users>(dto); // Maps the DTO to an entity
            updatedUser.password = existing.password; // Keeps the old password (not sent in the DTO)

            bool status = _repository.UpdateUser(updatedUser); // Updates the user in the repository
            if (status)
            {
                return Ok(); // Returns 200 if the update is successful
            }

            return BadRequest("Update failed."); // Returns 400 if the update fails
        }

        // DELETE: api/users/{id}
        // Deletes a specific user by their ID
        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = _repository.GetUserById(id); // Fetches the existing user by ID
            if (existing == null)
            {
                return NotFound($"User with id {id} not found."); // Returns 404 if the user is not found
            }

            bool status = _repository.DeleteUser(id); // Deletes the user from the repository
            if (status)
            {
                return NoContent(); // Returns 204 if the deletion is successful
            }

            return BadRequest("Delete failed."); // Returns 400 if the deletion fails
        }

        // POST: api/users/register
        // Registers a new user
        [HttpPost("register")]
        [AllowAnonymous]
        public ActionResult<UserDTO> Register([FromBody] UserRegisterDTO dto)
        {
            // Validates that all required fields are provided
            if (string.IsNullOrWhiteSpace(dto.Username) ||
                string.IsNullOrWhiteSpace(dto.password) ||
                string.IsNullOrWhiteSpace(dto.Email))
            {
                return BadRequest("All fields are required."); // Returns 400 if any field is missing
            }

            // Checks if the username already exists
            var existingUser = _repository
                .GetAllUsers()
                .FirstOrDefault(u =>
                    string.Equals(u.Username, dto.Username, StringComparison.OrdinalIgnoreCase));
            if (existingUser != null)
            {
                return Conflict("Username already exists. Please choose a different one."); // Returns 409 if the username is taken
            }

            // Checks if the email already exists
            var existingEmail = _repository
                .GetAllUsers()
                .FirstOrDefault(u =>
                    string.Equals(u.Email, dto.Email, StringComparison.OrdinalIgnoreCase));
            if (existingEmail != null)
            {
                return Conflict("Email already exists. Please choose a different one."); // Returns 409 if the email is taken
            }

            // Creates a new user entity
            var userEntity = new Users(0)
            {
                Username = dto.Username,
                password = dto.password,
                Email = dto.Email
            };

            var success = _repository.InsertUser(userEntity); // Inserts the user into the repository
            if (!success)
            {
                return BadRequest("Failed to register."); // Returns 400 if the insertion fails
            }

            // Retrieves the newly created user
            var saved = _repository.GetUserByUsername(dto.Username);
            var userDto = _mapper.Map<UserDTO>(saved);

            // Returns 201 Created with the user DTO in the response body
            return CreatedAtAction(
                nameof(GetUser),
                new { id = userDto.Id },
                userDto
            );
        }

        // POST: api/users/login
        // Authenticates a user
        [HttpPost("login")]
        [AllowAnonymous]
        public ActionResult<UserDTO> Login([FromBody] UserLoginDTO dto)
        {
            // Fetches the user by username
            var user = _repository.GetUserByUsername(dto.Username);
            if (user == null || user.password != dto.password)
            {
                return Unauthorized("Invalid credentials."); // Returns 401 if the credentials are invalid
            }

            var userDto = _mapper.Map<UserDTO>(user); // Maps the entity to a DTO
            return Ok(userDto); // Returns the authenticated user as a response
        }
    }
}
