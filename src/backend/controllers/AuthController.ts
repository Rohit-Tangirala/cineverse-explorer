import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import { UserRepository } from "../repositories/UserRepository.ts";

export const authRouter = Router();
const userRepo = new UserRepository();
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-cineverse";

// Middleware to verify JWT
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Middleware to verify ADMIN role
export const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ error: "Forbidden: Admin access required" });
  }
};

authRouter.post("/register", [
  body("username").isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    const existingEmail = await userRepo.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const existingUsername = await userRepo.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create({
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      role: 'USER'
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error during registration" });
  }
});

authRouter.post("/register/admin", async (req, res) => {
  const { username, email, password, secret } = req.body;

  if (secret !== "super-secret-admin-key") {
    return res.status(403).json({ error: "Invalid secret" });
  }

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingEmail = await userRepo.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const existingUsername = await userRepo.findByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepo.create({
      username,
      email,
      passwordHash,
      createdAt: new Date().toISOString(),
      role: 'ADMIN'
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    res.status(500).json({ error: "Internal server error during admin registration" });
  }
});

authRouter.post("/login", [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password").exists().withMessage("Password is required")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await userRepo.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error during login" });
  }
});

authRouter.get("/me", authenticateToken, async (req: any, res) => {
  res.json({
    user: {
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// Favorite endpoints
authRouter.post("/favorites/add", authenticateToken, async (req: any, res) => {
  const { characterName } = req.body;
  if (!characterName) return res.status(400).json({ error: "Character name is required" });
  try {
    await userRepo.addFavorite(req.user.id, characterName);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to add favorite" });
  }
});

authRouter.delete("/favorites/remove", authenticateToken, async (req: any, res) => {
  const { characterName } = req.body;
  if (!characterName) return res.status(400).json({ error: "Character name is required" });
  try {
    await userRepo.removeFavorite(req.user.id, characterName);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove favorite" });
  }
});

authRouter.get("/favorites/check/:characterName", authenticateToken, async (req: any, res) => {
  const { characterName } = req.params;
  try {
    const isFav = await userRepo.isFavorite(req.user.id, characterName);
    res.json({ isFavorite: isFav });
  } catch (error) {
    res.status(500).json({ error: "Failed to check favorite status" });
  }
});

authRouter.get("/favorites", authenticateToken, async (req: any, res) => {
  try {
    const favorites = await userRepo.getFavorites(req.user.id);
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch favorites" });
  }
});

authRouter.get("/admin-exists", async (req, res) => {
  try {
    const exists = await userRepo.checkAdminExists();
    res.json({ exists });
  } catch (error) {
    res.status(500).json({ error: "Failed to check admin existence" });
  }
});
