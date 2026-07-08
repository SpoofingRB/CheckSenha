using appointmentapi.Services;
using appointmentapi.Services.Interface;

var builder = WebApplication.CreateBuilder(args);

#region Services Configuration

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

#endregion

#region Dependency Injection

builder.Services.AddHttpClient<IBreachCheckService, PwnedPasswordsService>();
builder.Services.AddScoped<IPasswordService, PasswordService>();

#endregion

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost",
        policy =>
        {
            policy
                .WithOrigins("http://127.0.0.1:5500")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

#region Middleware Pipeline

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowLocalhost");
app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();

#endregion

app.Run();