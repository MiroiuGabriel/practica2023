using System.ComponentModel.DataAnnotations;

namespace Stagiu.Models
{
    public class AddToCartModel
    {
        [Required]
        public int ProductId { get; set; }
    }
}
