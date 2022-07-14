import { load } from "cheerio";
import fetch from "node-fetch";
import { wait } from "./helpers.js";

/**
 * @param {string} password the swag store password
 * @param {string} storeUrl the swag store url
 * @returns {Promise<string>} a swag store session cookie
 */
export const getCookie = async (password, storeUrl) => {
  console.info("Logging in...");
  const formData = new URLSearchParams();
  formData.append("form_type", "storefront_password");
  formData.append("utf8", "✓");
  formData.append("password", password);

  const res = await fetch(`${storeUrl}/password`, {
    method: "post",
    body: formData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    redirect: "manual",
  });

  if (res.status !== 302) {
    throw Error(
      `Could not authenticate to cleverswag store. Failed with status ${res.status}: ${res.statusText}`
    );
  }

  console.info("Logged in...");

  return res.headers.raw()["set-cookie"].join(";");
};

/**
 * @param {string} storeUrl the swag store url
 * @param {string} cookie the session cookie
 * @returns {Promise<Product[]>} list of all products available in the store
 */
export const getProducts = async (storeUrl, cookie) => {
  const products = [];

  for await (const swagProducts of getSwagProducts({ storeUrl, cookie })) {
    products.push(...swagProducts);
  }

  return products;
};

async function* getSwagProducts(options) {
  const { page = 1 } = options;
  const pageHtml = await fetchSwagPage(options);
  const $ = load(pageHtml);

  yield $(".grid-product__meta").toArray().map(mapElToProduct);

  const nextPage = $("span.next > a").attr("href");

  if (!nextPage) return [];

  wait(1000);

  yield* getSwagProducts({ ...options, page: page + 1 });
}

const fetchSwagPage = async (options) => {
  const { page, retry = 1, cookie, storeUrl } = options;
  const url = `${storeUrl}/collections/all?page=${page}&sort_by=created-descending`;

  console.info(`Fetching [${url}]`);

  const data = await fetch(url, {
    headers: {
      Cookie: cookie,
    },
  }).then((res) => (res.status !== 200 ? "" : res.text()));

  if (data === "" && retry <= 5) {
    console.clear();
    console.log(
      `Failed to fetch data from page ${page}. Retrying (${retry}/5) in 5 seconds.`
    );
    await wait(5000);
    return fetchSwagPage({ ...options, retry: retry + 1 });
  }

  return data;
};

const mapElToProduct = (e) => {
  const $ = load(e);
  $(".visually-hidden").remove();

  return {
    product: $(".grid-product__title").text(),
    price: $(".grid-product__price").text().trim(),
  };
};
