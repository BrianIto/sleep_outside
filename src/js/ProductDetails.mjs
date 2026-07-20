export default class ProductDetails {
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    this.product = await this.dataSource.findProductById(this.productId);
  }

  render() {
    let price = document.querySelector(".product-card__price");
    let color = document.querySelector(".product__color");
    let description = document.querySelector(".product__description");
    let title = document.querySelector("h2.divider");
    let brand = document.querySelector(".product-detail > h3");
    let image = document.querySelector("img.divider");
    let addToCart = document.querySelector("#addToCart");
    price.innerHTML = "$" + this.product.FinalPrice;
    color.innerHTML = this.product.Colors.map((e) => e.ColorName).join(" ");
    brand.innerHTML = this.product.Brand.Name;
    title.innerHTML = this.product.NameWithoutBrand;
    image.src = this.product.Images.PrimaryLarge;
    image.alt = this.product.Name;
    description.innerHTML = this.product.DescriptionHtmlSimple;
    addToCart.setAttribute("data-id", this.product.Id);
  }
}
