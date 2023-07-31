using System.ComponentModel.DataAnnotations;

namespace Stagiu.Models
{
    public class CategoryBody
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
    }
}
