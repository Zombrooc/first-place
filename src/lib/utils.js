import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function expandClassification(value) {
  const cleaned = value.trim();

  if (cleaned.includes(",")) {
    return cleaned.split(",").map((x) => x.trim());
  }

  if (cleaned.includes("-")) {
    const [begin, end] = cleaned.split("-").map((x) => parseInt(x.trim()));
    const results = [];
    for (let i = begin; i <= end; i++) results.push(`${String(i)}º`);
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

export { cn, expandClassification, expandCategory, cartesianProduct };
