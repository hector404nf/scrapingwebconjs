/* const puppeteer = require("puppeteer");
const fs = require("fs");

const getProductos = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://www.superseis.com.py/category/1442-bebidas-20.aspx", {
    waitUntil: "domcontentloaded",
  });

  

  const productos = await page.evaluate(() => {
    const productosList = document.querySelectorAll(".product-item");

    return Array.from(productosList).map((produto) => {
      const titulo = produto.querySelector(".product-title-link").innerHTML;
      const precio = produto.querySelector(".price-label").innerHTML;
      return { titulo, precio };
    });
  });

  console.log(productos);

  const data = productos
    .map((producto) => `${producto.titulo} - ${producto.precio}`)
    .join("\n");

  fs.writeFile("productos.txt", data, (err) => {
    if (err) {
      console.error("Error al guardar el archivo:", err);
      return;
    }
    console.log("El archivo productos.txt ha sido guardado");
  });

  await browser.close();
};

getProductos(); */

const puppeteer = require("puppeteer");
const fs = require("fs");

const getProductos = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(
    "https://www.superseis.com.py/category/1442-bebidas-20.aspx",
    {
      waitUntil: "domcontentloaded",
    }
  );

  const productos = await extraerProductos(page);

  console.log(productos);

  const data = productos
    .map((producto) => `${producto.titulo} - ${producto.precio}`)
    .join("\n");

  fs.writeFile("productos.txt", data, (err) => {
    if (err) {
      console.error("Error al guardar el archivo:", err);
      return;
    }
    console.log("El archivo productos.txt ha sido guardado");
  });

  await browser.close();
};

const extraerProductos = async (page) => {
  let productos = [];

  while (true) {
    const nuevosProductos = await page.evaluate(() => {
      const productosList = document.querySelectorAll(".product-item");

      return Array.from(productosList).map((producto) => {
        const tituloElemento = producto.querySelector(".product-title-link");
        const precioElemento = producto.querySelector(".price-label");

        const titulo = tituloElemento ? tituloElemento.textContent.trim() : "";
        const precio = precioElemento ? precioElemento.textContent.trim() : "";

        return { titulo, precio };
      });
    });

    productos = productos.concat(nuevosProductos);

    const siguienteEnlaceHref = await page.evaluate(() => {
        const enlaces = Array.from(document.querySelectorAll("a"));
        const siguienteEnlace = enlaces.find((enlace) =>
          enlace.textContent.includes("Siguiente")
        );
        return siguienteEnlace ? siguienteEnlace.href : null;
      });
  
      if (!siguienteEnlaceHref) {
        break;
      }
  
      await page.goto(siguienteEnlaceHref, {
        waitUntil: "domcontentloaded",
      });
  }
  return productos;
};

getProductos();
