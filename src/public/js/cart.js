const deleteFromCart = async (pid) => {
  try {
    const cid = "65259c66629d0fc68ead263e";
    if (!cid) {
      console.log("cart not found");
    }
    const response = await fetch(
      `http://localhost:8080/api/carts/${cid}/products/${pid}`,
      {
        method: "DELETE",
      }
    );
    if (response.status == 200) {
      const productElement = document.getElementById(`product-${pid}`);
      if (productElement) {
        productElement.remove();
      }
      Swal.fire({
        text: "product deleted successfully",
        toast: true,
        position: "top",
        showConfirmButton: false,
        timer: 1000,
      });
    }
  } catch (error) {
    console.log("error deleting product from cart: ", error);
  }
};
