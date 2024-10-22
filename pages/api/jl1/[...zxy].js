import got from "got";
import sharp from "sharp";

async function get_tile(z, x, y, mk, tk) {
  // 通过添加sch=wmts可返回正常XYZ顺序, 否则使用Math.pow(2, z) - 1 - y计算-y值
  const tile_url = `https://api.jl1mall.com/getMap/${z}/${x}/${y}?mk=${mk}&tk=${tk}&sch=wmts`;
  const tile_data = await got(tile_url).buffer();
  // webp to png
  const pngBuffer = await sharp(tile_data).png().toBuffer();
  return pngBuffer;
}

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const zxy = req.query["zxy"];
  const mk = req.query["mk"] || "73ad26c4aa6957eef051ecc5a15308b4";
  const tk = req.query["tk"];
  const [z, x, y] = zxy.map(Number);
  const tile_data = await get_tile(z, x, y, mk, tk);
  // 设置响应头，告诉浏览器这是图片
  res.setHeader("Content-Type", "image/png");
  res.setHeader("Content-Length", tile_data.length);
  res.status(200).send(tile_data);
};
