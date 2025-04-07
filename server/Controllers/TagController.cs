using Everleaf.Model.Entities;
using Everleaf.Model.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace Everleaf.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TagController : ControllerBase
    {
        protected TagRepository Repository { get; }

        public TagController(TagRepository repository)
        {
            Repository = repository;
        }

        [HttpGet("{id}")]
        public ActionResult<Tag> GetTag([FromRoute] int id)
        {
            var tag = Repository.GetTagById(id);
            if (tag == null)
            {
                return NotFound();
            }

            return Ok(tag);
        }

        [HttpGet]
        public ActionResult<IEnumerable<Tag>> GetTag()
        {
            return Ok(Repository.GetAllTag());
        }

        [HttpPost]
        public ActionResult Post([FromBody] Tag tag)
        {
            if (tag == null)
            {
                return BadRequest("Tag info is missing or malformed.");
            }

            bool status = Repository.InsertTag(tag);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Insert failed.");
        }

        [HttpPut]
        public ActionResult Update([FromBody] Tag tag)
        {
            if (tag == null)
            {
                return BadRequest("Tag info is missing or malformed.");
            }

            var existing = Repository.GetTagById(tag.Id);
            if (existing == null)
            {
                return NotFound($"Tag with id {tag.Id} not found.");
            }

            bool status = Repository.UpdateTag(tag);
            if (status)
            {
                return Ok();
            }

            return BadRequest("Update failed.");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete([FromRoute] int id)
        {
            var existing = Repository.GetTagById(id);
            if (existing == null)
            {
                return NotFound($"Tag with id {id} not found.");
            }

            bool status = Repository.DeleteTag(id);
            if (status)
            {
                return NoContent();
            }

            return BadRequest("Delete failed.");
        }
    }
}
