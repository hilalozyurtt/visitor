using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using visit_app.Models;

namespace visit_app.Controllers
{
	[Route("api/[Controller]")]
	[ApiController]
	public class VisitorController : ControllerBase
	{
		private readonly MytestContext _dbContext;

		public VisitorController(MytestContext dbContext)
		{
			_dbContext = dbContext;


        }

		[HttpGet]
		[Route("GetVisitors")]
		public IActionResult GetVisitors()
		{
			List<Visitor> list = _dbContext.Visitors.ToList();
			return StatusCode(StatusCodes.Status200OK, list);
        }

        [HttpPost]
        [Route("AddVisitor")]
        public async Task<Visitor> AddVisitor(Visitor visitor)
        {
			Console.Write("ssss");
            _dbContext.Visitors.Add(visitor);
            await _dbContext.SaveChangesAsync();
            return visitor;
        }

		[HttpDelete]
		[Route("DeleteVisitor/{id}")]
		public bool DeleteVisitor(int id)
		{
			bool deleted = false;
			var visitor = _dbContext.Visitors.Find(id);
			if(visitor != null)
			{
				deleted = true;
				_dbContext.Entry(visitor).State = EntityState.Deleted;
                _dbContext.SaveChanges();

            }
			else
			{
				deleted = false;
			}

			return deleted;
        }
    }
}

