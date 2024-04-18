import { PrismaClient } from "@prisma/client";
import { Router } from "express";

const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;
const EMAIL_TOKEN_EXPIRATION_MINUTES = 10;

const router = Router();
const prisma = new PrismaClient();

function generateEmailToken() {
  return Math.floor(
    10000000 + Math.random() * 90000000
  ).toString();
}

// Create a user a user if it doesn't exist
// generate the email token and send it to the email
router.post("/login", async (req, res) => {
  const { email } = req.body;

  const emailToken = generateEmailToken();
  const expiration = new Date(
    new Date().getTime() +
      EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );

  try {
    const createdToken = await prisma.token.create({
      data: {
        type: "EMAIL",
        emailToken,
        expiration,
        user: {
          connectOrCreate: {
            where: { email },
            create: { email },
          },
        },
      },
    });

    console.log(createdToken);
    res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: "Couldn't start the authentification process",
    });
  }
});

// validate the token
// generate e long live JWT token
router.post("/authentificate", async (req, res) => {
  const { email, emailToken } = req.body;

  const dbEmailToken = await prisma.token.findUnique({
    where: { emailToken },
    include: { user: true },
  });

  console.log(dbEmailToken);

  if (!dbEmailToken || !dbEmailToken.valid) {
    return res.status(401);
  }

  if (dbEmailToken.expiration < new Date()) {
    return res
      .status(401)
      .json({ error: "Token exprired!" });
  }

  if (dbEmailToken?.user?.email !== email) {
    return res.sendStatus(401);
  }

  const expiration = new Date(
    new Date().getTime() +
      EMAIL_TOKEN_EXPIRATION_MINUTES * 60 * 1000
  );
  res.sendStatus(200);
});

export default router;
