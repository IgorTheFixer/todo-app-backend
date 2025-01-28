import express, { Express, Request, Response } from "express";
import { PrismaClient, Task } from '@prisma/client';

const app: Express = express();
const prisma = new PrismaClient();

app.use(express.json());

// Create a new task
app.post('/tasks', async (req: Request, res: Response) => {
  const { title, color } = req.body;

  try {
    const newTask:Task = await prisma.task.create({
      data: {
        title,
        color
      }
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Get all tasks
app.get('/tasks', async (req: Request, res: Response) => {
  try {
    const tasks:Task[] = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Update a task
app.put('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, color, completed } = req.body;

  try {
    const updatedTask: Task = await prisma.task.update({
      where: { id },
      data: {
        title,
        color,
        completed
      }
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/tasks/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({
      where: { id }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});