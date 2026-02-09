import express from "express";
import { db } from "../db.js";
import { getAIResponse } from "../services/aiService.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, mood_text, category } = req.body;

  if (!mood_text || mood_text.trim() === "") {
    return res.status(400).json({ error: "Mood text cannot be empty" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO mood_entries (user_id, mood_text, category) VALUES (?, ?, ?)",
      [user_id, mood_text, category || null]
    );

    const aiMessage = await getAIResponse(mood_text);

    await db.query(
      "INSERT INTO ai_responses (mood_entry_id, ai_message) VALUES (?, ?)",
      [result.insertId, aiMessage]
    );

    res.json({ message: "Mood saved", aiMessage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT u.full_name, m.mood_text, m.category, a.ai_message
      FROM users u
      JOIN mood_entries m ON u.id = m.user_id
      JOIN ai_responses a ON m.id = a.mood_entry_id
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM ai_responses WHERE mood_entry_id = ?", [id]);

    
    const [result] = await db.query("DELETE FROM mood_entries WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Mood entry not found" });
    }

    res.json({ message: "Mood entry deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

export default router;
