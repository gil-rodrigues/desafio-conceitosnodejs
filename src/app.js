const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRep = {
    id: uuid(),
    title: title,
    url: url,
    techs: techs,
    likes: 0
  }

  repositories.push(newRep);

  return response.json(newRep);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repIndex = repositories.findIndex(rep => rep.id == id);

  if(repIndex === -1)
    return response.status(400).json({error:"Rep not found"});

  repositories[repIndex].title = title;
  repositories[repIndex].url = url;
  repositories[repIndex].techs = techs;

  return response.json(repositories[repIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repIndex = repositories.findIndex(rep => rep.id == id);
  if(repIndex === -1)
    return response.status(400).json({error:"Rep not found"});

  repositories.splice(repIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const rep = repositories.find(rep => rep.id == id);
  if(typeof rep === "undefined")
    return response.status(400).json({error:"Rep not found"});
  rep.likes++;

  return response.json(rep);
});

module.exports = app;
