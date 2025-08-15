import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function expandClassification(value, nomenclature) {
  const cleaned = value.trim();

  if (cleaned.includes(",")) {
    return cleaned.split(",").map((x) => x.trim());
  }

  const nomenclaturePossibilitiesToUseO = ["LUGAR", "COLOCADO"]

  const ordinalSign = nomenclaturePossibilitiesToUseO.includes(nomenclature.toUpperCase()) ? "º" : "ª";

  if (cleaned.includes("_")) {

    const [begin, end] = cleaned.split("_").map((x) => parseInt(x.trim()));
    const results = [];
    for (let i = begin; i <= end; i++) results.push(`${String(i)}${ordinalSign}`);
    return results;
  }

  if (isNaN(parseInt(cleaned[0]))) return [cleaned];

  return [cleaned];
}

const expandCategory = (category) => {
  if (!category) return [];

  if (!category.includes("|")) {
    return category.split("/").map((c) => c.trim());
  }

  const blocks = category
    .split("|")
    .map((block) => block.split("/").map((sub) => sub.trim()));

  return cartesianProduct(blocks).map((combination) => combination.join(" "));
};

function cartesianProduct(arrays) {
  return arrays.reduce(
    (acc, curr) => {
      const results = [];
      acc.forEach((a) => {
        curr.forEach((b) => {
          results.push([...a, b]);
        });
      });
      return results;
    },
    [[]]
  );
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  );
};

export { formatFileSize, cn, expandClassification, expandCategory, cartesianProduct };
