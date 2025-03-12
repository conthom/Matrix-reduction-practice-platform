import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { matrix } = req.body;
    if (!matrix || !Array.isArray(matrix)) {
      return res.status(400).json({ error: "Matrix must be a 2D array" });
    }

    const rrefMatrix = rref(matrix);
    return res.status(200).json({ rref: rrefMatrix });
  } catch (error: unknown) {
    return res.status(500).json({ error: 'An unknown error occurred.' });
  }
}

function rref(matrix: number[][]): number[][] {
  let lead = 0;
  const rowCount = matrix.length;
  const colCount = matrix[0].length;

  for (let r = 0; r < rowCount; r++) {
    if (lead >= colCount) return matrix;
    let i = r;
    while (matrix[i][lead] === 0) {
      i++;
      if (i === rowCount) {
        i = r;
        lead++;
        if (lead === colCount) return matrix;
      }
    }

    [matrix[i], matrix[r]] = [matrix[r], matrix[i]]; // Swap rows
    const lv = matrix[r][lead];

    matrix[r] = matrix[r].map((val) => val / lv); // Normalize row

    for (let j = 0; j < rowCount; j++) {
      if (j !== r) {
        const lv2 = matrix[j][lead];
        matrix[j] = matrix[j].map((val, idx) => val - lv2 * matrix[r][idx]); // Subtract row
      }
    }
    lead++;
  }
  return matrix;
}
