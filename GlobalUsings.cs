// System First
global using System;
global using System.Collections.Generic;
global using System.Linq;
global using System.Security.Claims;
global using System.Text;
global using System.Text.Encodings.Web;
global using System.Text.Json;
global using System.Threading;
global using System.Threading.Tasks;

// Microsoft
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Identity;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.WebUtilities;
global using Microsoft.Extensions.Hosting;
global using Microsoft.Extensions.Logging;
global using Microsoft.Extensions.Options;

// NuGet packages
global using FluentValidation;
global using FluentValidation.AspNetCore;
global using MediatR;
global using MongoFramework;
global using MongoFramework.AspNetCore.Identity;
global using Reinforced.Typings.Attributes;

// Internal
global using Features.Account;
global using Features.Base;
global using Vue3Net6Authentication.Data;
global using Vue3Net6Authentication.Extensions;
global using Vue3Net6Authentication.Models;
global using Vue3Net6Authentication.Services;


// Idea for a GlobalUsings.cs
// https://anthonygiretti.com/2021/07/18/introducing-c-10-global-usings-example-with-asp-net-core-6/
