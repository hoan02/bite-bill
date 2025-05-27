import { createHash } from "crypto";

export function generateCodeFromSlug(slug: string): string {
  const hash = createHash("sha256").update(slug).digest("hex");
  const numericHash = BigInt("0x" + hash)
    .toString()
    .slice(0, 12); // giữ 12 số đầu
  const code = numericHash.slice(-8); // lấy 8 số cuối
  return code.padStart(8, "0"); // nếu thiếu thì pad 0
}
