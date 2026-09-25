import fs from "fs";
import path from "path";

const dbFilePath = path.join(process.cwd(), "data", "db.json");

export function initDb() {
  if (!fs.existsSync(path.join(process.cwd(), "data"))) {
    fs.mkdirSync(path.join(process.cwd(), "data"));
  }
  if (!fs.existsSync(dbFilePath)) {
    fs.writeFileSync(dbFilePath, JSON.stringify({
      products: [
        { id: "1", name: "Gaming PC Pro v1", price: 12500000, category: "kompyuter", brand: "MSI", description: "Intel Core i7, RTX 4060, 16GB RAM, 1TB SSD", image: "" },
        { id: "2", name: "Gaming Laptop ASUS ROG", price: 15000000, category: "noutbuk", brand: "ASUS", description: "Ryzen 9, RTX 4070, 32GB RAM, 1TB SSD", image: "" },
        { id: "3", name: "Razer BlackWidow", price: 1500000, category: "aksessuar", brand: "Razer", description: "Mechanical Keyboard RGB", image: "" }
      ],
      orders: []
    }, null, 2));
  }
}

export function readDb() {
  initDb();
  const data = fs.readFileSync(dbFilePath, "utf8");
  return JSON.parse(data);
}

export function writeDb(data: any) {
  initDb();
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2));
}
