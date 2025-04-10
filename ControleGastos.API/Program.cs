using ControleGastos.API.Data;
using ControleGastos.API.Data.Interfaces;
using ControleGastos.API.Data.Repositories;
using ControleGastos.API.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Configurar logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

// Configuração do Kestrel para definir explicitamente a porta 5000 (somente HTTP)
builder.WebHost.ConfigureKestrel(options =>
{
    options.ListenAnyIP(5000); // Porta HTTP
});

// Adiciona serviços ao container
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
    });

// Necessário para servir arquivos estáticos
builder.Services.AddControllersWithViews();

// Configuração do CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});


// Configuração do Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "ControleGastos.API", Version = "v1" });
});

// Configuração do banco de dados PostgreSQL
builder.Services.AddDbContext<ControleGastosContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
           .EnableSensitiveDataLogging()
           .LogTo(Console.WriteLine, LogLevel.Information);
});

// Injeção de dependência dos repositórios
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<ITransacaoRepository, TransacaoRepository>();

// Injeção de dependência dos serviços
builder.Services.AddScoped<UsuarioService>();
builder.Services.AddScoped<TransacaoService>();

var app = builder.Build();

// Habilitar o logging de exceções não tratadas
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        var exceptionHandler = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>();
        if (exceptionHandler != null)
        {
            logger.LogError(exceptionHandler.Error, "Exceção não tratada");
        }
        
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { error = "Ocorreu um erro interno no servidor" });
    });
});

// Configuração dos middlewares
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "ControleGastos.API v1"));
}
else
{
    // Middleware para tratamento de exceções globais em produção
    app.UseExceptionHandler("/error");
    app.UseHsts();
}

// Middleware para tratamento de erros 404
app.Use(async (context, next) =>
{
    await next();
    
    if (context.Response.StatusCode == 404 && !context.Response.HasStarted)
    {
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message = "Recurso não encontrado" });
    }
});

// Remover o uso de HTTPS no desenvolvimento
// app.UseHttpsRedirection(); // Desabilitei esta linha durante o desenvolvimento

app.UseStaticFiles(); // Habilita arquivos estáticos
app.UseCors();
app.UseRouting();
app.UseAuthorization();
app.MapControllers();

// Criar o banco de dados e aplicar as migrações automaticamente
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ControleGastosContext>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
    
    try
    {
        logger.LogInformation("Aplicando migrações ao banco de dados...");
        dbContext.Database.Migrate();
        logger.LogInformation("Migrações aplicadas com sucesso!");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Ocorreu um erro ao aplicar as migrações");
    }
}

app.Run();