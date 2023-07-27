using System;
using System.Collections.Generic;

namespace visit_app.Models;

public partial class Visitor
{
    public int Id { get; set; }

    public string CompanyName { get; set; } = null!;

    public string NameSurname { get; set; } = null!;

    public string? Adress { get; set; }

    public DateTime ArrivalTime { get; set; }

    public DateTime DepartureTime { get; set; }
}
