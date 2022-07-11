import * as Diff from "diff";
import Table from "easy-table";
import { compareArrays, wait } from "./helpers.js";
import { getCookie, getProducts } from "./swag.js";
import("colors");

export const run = async (args, onDiff) => {
  const cookie = await getCookie(args.password, args.url);

  let lastProducts;
  while (true) {
    const products = await getProducts(args.url, cookie);
    const one = lastProducts ? lastProducts : products;
    const another = products;

    const diff = Diff.diffArrays(one, another, { comparator: compareArrays });

    console.clear();
    printDiff(diff);

    if (hasDiff(diff)) {
      try {
        await onDiff(diff);
      } catch (e) {
        console.error(`Something got wrong in onDiff callback.`, e);
      }
    }

    console.log(`\nLast check: ${new Date().toLocaleTimeString()}\n`);

    lastProducts = products;
    const intervalInMillis = args.interval * 1000;
    await wait(intervalInMillis);
  }
};

const hasDiff = (diff) => diff.filter((p) => p.added || p.removed).length > 0;

const printDiff = async (diff) => {
  const t = new Table();

  diff.forEach((part) => {
    const color = part.added ? "green" : part.removed ? "red" : "grey";
    part.value.forEach((val) => {
      t.cell("Product", val.product, (cell) => Table.string(cell[color]));
      t.cell("Price", val.price, (cell) => Table.string(cell[color]));
      t.newRow();
    });
  });

  t.sort((a, b) => {
    const aPrice = parseInt(a.Price.substring(1));
    const bPrice = parseInt(b.Price.substring(1));
    return bPrice - aPrice;
  });

  console.log(t.toString());
};
