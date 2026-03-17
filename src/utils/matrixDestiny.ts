export function reduceTo22(num: number): number {
  if (num <= 22 && num > 0) return num;
  const sum = String(num)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  return sum > 22 ? reduceTo22(sum) : sum;
}

export interface MatrixDestiny {
  A: number; // Birth Day (Left)
  B: number; // Birth Month (Top)
  C: number; // Birth Year (Right)
  D: number; // Bottom
  E: number; // Center
  F: number; // Top-Left
  G: number; // Top-Right
  H: number; // Bottom-Right
  I: number; // Bottom-Left
  Sky: number; // Trời (B + D)
  Earth: number; // Đất (A + C)
  Personal: number; // Cá nhân (Sky + Earth)
  Male: number; // Nam (F + H)
  Female: number; // Nữ (G + I)
  Social: number; // Xã hội (Male + Female)
  Spiritual: number; // Tâm linh (Personal + Social)
}

export function calculateMatrix(day: number, month: number, year: number): MatrixDestiny {
  const A = reduceTo22(day);
  const B = reduceTo22(month);
  
  const yearSum = String(year)
    .split('')
    .reduce((acc, digit) => acc + parseInt(digit, 10), 0);
  const C = reduceTo22(yearSum);
  
  const D = reduceTo22(A + B + C);
  const E = reduceTo22(A + B + C + D);

  const F = reduceTo22(A + B);
  const G = reduceTo22(B + C);
  const H = reduceTo22(C + D);
  const I = reduceTo22(D + A);

  const Sky = reduceTo22(B + D);
  const Earth = reduceTo22(A + C);
  const Personal = reduceTo22(Sky + Earth);
  
  const Male = reduceTo22(F + H);
  const Female = reduceTo22(G + I);
  const Social = reduceTo22(Male + Female);
  
  const Spiritual = reduceTo22(Personal + Social);

  return { A, B, C, D, E, F, G, H, I, Sky, Earth, Personal, Male, Female, Social, Spiritual };
}
