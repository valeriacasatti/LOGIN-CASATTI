import fs from "fs";

class ProductsManagerFiles {
  constructor(path) {
    this.path = path;
  }
  //corroborar si el archivo existe
  fileExist() {
    return fs.existsSync(this.path);
  }
  //consultar productos
  async getProduct() {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);
        return contenidoJson;
      } else {
        throw new Error("error getting the products");
      }
    } catch (error) {
      throw new Error("get products error: ", error.message);
    }
  }

  //agregar productos
  async addProduct(productInfo) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //validar que todos los campos sean obligatorios
        const requiredFields = [
          "title",
          "description",
          "price",
          "status",
          "category",
          "code",
          "stock",
        ];
        const missingFields = requiredFields.filter(
          (field) => !productInfo.hasOwnProperty(field)
        );
        if (missingFields.length > 0) {
          console.log("all fields are required");
        } else {
          //validar unico code
          const codeExist = contenidoJson.some((product) => {
            return product.code === productInfo.code;
          });
          if (codeExist) {
            console.log(`code ${productInfo.code} already exists!`);
          } else {
            //id autoincrementable
            const id = contenidoJson.reduce((maxId, product) => {
              return product.id > maxId ? product.id : maxId;
            }, 0);
            const newId = id + 1;
            productInfo.id = newId;
            //agregar producto
            contenidoJson.push(productInfo);
            await fs.promises.writeFile(
              this.path,
              JSON.stringify(contenidoJson, null, "\t")
            );
            return `${productInfo.title} added successfully`;
          }
        }
      }
    } catch (error) {
      throw new Error(`add product error: ${error.message}`);
    }
  }

  //get product by id
  async getProductById(id) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //metodo find para encontrar id
        const product = contenidoJson.find((product) => product.id === id);

        if (product) {
          return product;
        } else {
          throw new Error("ID not found");
        }
      }
    } catch (error) {
      throw new Error("product id not found", error.message);
    }
  }

  //modificar productos
  async updateProduct(id, updatedContent) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //localizar el id
        const productIndex = contenidoJson.findIndex((product) => {
          return product.id === id;
        });
        if (productIndex !== -1) {
          contenidoJson[productIndex] = {
            ...contenidoJson[productIndex],
            ...updatedContent,
          };

          //actualiza
          await fs.promises.writeFile(
            this.path,
            JSON.stringify(contenidoJson, null, "\t")
          );
          return "product updated successfully";
        } else {
          throw new Error("can't update product, id not found");
        }
      }
    } catch (error) {
      throw new Error("update product error: ", error);
    }
  }

  //eliminar products
  async deleteProduct(id) {
    try {
      if (this.fileExist()) {
        const contenido = await fs.promises.readFile(this.path, "utf-8");
        const contenidoJson = JSON.parse(contenido);

        //metodo filter que crea un nuevo arreglo, excluyendo el producto seleccionado
        const newArray = contenidoJson.filter((product) => product.id !== id);
        //se sobreescribe en el archivo, el nuevo arreglo actualizado
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(newArray, null, "\t")
        );
        return "product successfully removed";
      }
    } catch (error) {
      throw new Error("delete products error: ", error);
    }
  }
}

export { ProductsManagerFiles };
