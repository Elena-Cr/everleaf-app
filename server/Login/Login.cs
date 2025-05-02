using System;
using System.Text.Json.Serialization;
namespace Everleaf.Server.Login;
public class Login {
[JsonPropertyName("username")]
public string Username { get; set; }
[JsonPropertyName("password")]
public string Password { get; set; }
}