const express = require('express');
const server = express();
const projects = [];
let numberOfRequests = 0;

server.use(express.json());

/**
 * Middleware que realizar verificação se o projeto existe
 */
function CheckProjectExist(request, response, next) {
  const id = request.params;
  const project = projects.find(proj => proj.id == id);

  if (!project) {
    return response.status(400).json({ error: 'Project does not exist' });
  }

  return next();
}

/**
 * Middleware que realizar contagem de requisições de log
 */
server.use((request, response, next) => {
  numberOfRequests++;

  // console.log("Número de requisições: " + numberOfRequests); // Concatenar contagem (JS)
  console.log(`Número de requisições: ${numberOfRequests}`);

  next();
})

/**
 * Projects
 */
server.get('/projects', (request, response) => {
  return response.json(projects);
});
server.post('/projects', (request, response) => {
  const { id } = request.body;
  const { title } = request.body;

  projects.push({ id, title, tasks: [] });

  return response.json(projects);
});
server.put('/projects/:id', CheckProjectExist, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(proj => proj.id == id );

  project.title = title;

  return response.json(projects);
});
server.delete('/projects/:id', CheckProjectExist, (request, response) => {
  const { id } = request.params;

  const index = projects.findIndex(proj => proj.id == id);

  projects.splice(index, 1);

  return response.send();
});

/**
 * Tasks
 */
server.post('/projects/:id/tasks', CheckProjectExist, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(proj => proj.id == id);

  project.tasks.push(title);

  return response.json(projects);
});
server.listen(3000);
