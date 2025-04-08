using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        protected UserRepository Repository { get; }

        public UsersController(UserRepository repository)
        {
            Repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<Users> GetUser([FromRoute] int id)
        {
            var user = Repository.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Users>> GetUsers()
        {
            return Ok(Repository.GetAllUsers());
        }

        [HttpPost]
        public ActionResult Post([FromBody] Users user)
        {
            if (user == null)
            {
                return BadRequest("User info is missing or malformed.");
            }

            bool status = Repository.InsertUser(user);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpPut]
        public ActionResult Update([FromBody] Users user)
        {
            if (user == null)
            {
                return BadRequest("User info is missing or malformed.");
            }

            var existing = Repository.GetUserById(user.Id);
            if (existing == null)
            {
                return NotFound($"User with id {user.Id} not found.");
            }

            bool status = Repository.UpdateUser(user);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed.");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = Repository.GetUserById(id);
            if (existing == null)
            {
                return NotFound($"User with id {id} not found.");
            }

            bool status = Repository.DeleteUser(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest("Delete failed.");
        }
    }
}
