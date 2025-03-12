import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { difficulty } = req.query;
  let rows: number, cols: number;

  if (difficulty === "medium") {
    rows = Math.random() > 0.5 ? 3 : 4;
    cols = rows === 3 ? 4 : 3;
  } else if (difficulty === "hard") {
    rows = Math.random() > 0.5 ? 4 : 5;
    cols = rows === 4 ? 5 : 4;
  } else {
    rows = cols = 2; // Default: Easy
  }

  // Generate a random matrix
  const matrix: number[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => Math.floor(Math.random() * 10)),
  );

  return res.status(200).json({ matrix });
}
