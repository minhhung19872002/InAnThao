FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY InAnThao.sln ./
COPY InAnThao.Api/InAnThao.Api.csproj InAnThao.Api/
RUN dotnet restore InAnThao.Api/InAnThao.Api.csproj
COPY . .
RUN dotnet publish InAnThao.Api/InAnThao.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "InAnThao.Api.dll"]
