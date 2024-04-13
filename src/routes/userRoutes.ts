import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const router = Router();
const prisma = new PrismaClient();

// Create user
router.post("/", async (req, res) => {
  const { username, name, email } = req.body;

  try {
    const result = await prisma.user.create({
      data: {
        email,
        name,
        username,
        bio: "Hello, i'm new on Twitter !",
      },
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// get all users
router.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany();

  res.json(allUsers);
});

// Update user
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, bio, image } = req.body;

  try {
    const result = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        bio,
        image,
      },
    });

    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error });
  }
});

// get one user
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { tweets: true },
  });

  res.json(user);
});

// delete user
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({ where: { id: Number(id) } });

  res.sendStatus(200);
});

export default router;
