using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace visit_app.Models;

public partial class MytestContext : DbContext
{
    public MytestContext()
    {
    }

    public MytestContext(DbContextOptions<MytestContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Visitor> Visitors { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Server=.;DataBase=mytest;TrustServerCertificate=true;User Id=sa;Password=reallyStrongPwd123");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Visitor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__visitor__3214EC0781B09F1F");

            entity.ToTable("visitor");

            entity.Property(e => e.Adress)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.ArrivalTime).HasColumnType("datetime");
            entity.Property(e => e.CompanyName)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.DepartureTime).HasColumnType("datetime");
            entity.Property(e => e.NameSurname)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
