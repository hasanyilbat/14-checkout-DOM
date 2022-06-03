//! büyük bir e-ticaret sayfası düşünüldüğünden her sayfada kullanıalcak bazı sabit değerler vardır( %18 vergi, kargo ücreti gibi) bunları her sayfanın başında tanımlamak yerine bir hafızada saklayıp oradan çağırmak gerekir.
const taxRate = 0.18;
const shippingPrice = 15.0;
window.addEventListener("load", () => {
  //!key value şeklinde localstorage kısmına set ettik. Silene kadar kaybolmaz.
  localStorage.setItem("taxRate", taxRate);
  localStorage.setItem("shippingPrice", shippingPrice);
  //!sessionStorageta kullanıcı oturumu yada browserı kapattığında kaybolur.
  sessionStorage.setItem("taxRate", taxRate);
  sessionStorage.setItem("shippingPrice", shippingPrice);
});

//!*****Capturing Method *****
//!büyük parenta eventlistener click özelliği verilir. Böylece içindeki bütün elemanlarda eventlistener özelliği kazanır. Burada click olayının gerçekleşeceği kısmı kapsayan class "product"

//!(e.target) tıklanan elemanı getirir.

let productsDiv = document.querySelector(".products");
productsDiv.addEventListener("click", (event) => {
  //   if(event.target.className =="minus")){
  //!burada classı minus olan elemente özellik vericez.
  //* tıklandığı anda "product-quantity" clasına ulaşıp sayıyı arttırmasını sağlarız.
  //* nextElementSibling() tıklanana elemandan sonraki elemanı alır.
  if (event.target.classList.contains("minus")) {
    let quantityP = event.target.nextElementSibling;
    if (quantityP.innerText > 1) {
      quantityP.innerText--;

      calculateProductAndCartTotal(event.target.parentElement.parentElement); //! silindiğinde hem product total hem de total değişecek. Eğer buraya fonksiyon eklersek bu fonksiyon yazıldığı bölümden parametre almalıdır.
    } else {
      if (confirm("Product wil be deleted")) {
        event.target.parentElement.parentElement.parentElement.remove();
        calculateCartTotal(); //!silindiğinde sadece total değişecek
      }
    }
  } else if (event.target.classList.contains("plus")) {
    event.target.previousElementSibling.innerText++;
    calculateProductAndCartTotal(event.target.parentElement.parentElement);
  } else if (event.target.classList.contains("remove-product")) {
    //!remove basınca productlardan 1 tanesini silecek. bundan dolayı kapsayan parenta gidip onu silmeliyiz.
    event.target.parentElement.parentElement.parentElement.remove();
    calculateCartTotal();
  }
});

const calculateProductAndCartTotal = (productInfoDiv) => {
  //!her ürün kendi özelinde işlem yapması için ürünleri kapsayan parentı parametre olarak aldık. Böylece her işlem parentın altındaki divler için farklı farklı çalışıyor.
  let price = productInfoDiv.querySelector("strong").innerText;
  let quantity = productInfoDiv.querySelector("#product-quantity").innerText;
  let productTotalDiv = productInfoDiv.querySelector(".product-line-price");
  productTotalDiv.innerText = (price * quantity).toFixed(2);
  calculateCartTotal();
};

const calculateCartTotal = () => {
  //nodeList Div
  let productsTotalPriceDivs = document.querySelectorAll(".product-line-price");
  // console.log(productsTotalPriceDivs);
  let subtotal = 0;
  productsTotalPriceDivs.forEach((eachProductTotalDiv) => {
    subtotal += parseFloat(eachProductTotalDiv.innerText);
  });
  console.log(subtotal);
  let taxPrice = subtotal * localStorage.getItem("taxRate");
  console.log(taxPrice);

  let shippingPrice =
    subtotal > 0 ? parseFloat(localStorage.getItem("shippingPrice")) : 0;

  let cartTotal = subtotal + taxPrice + shippingPrice;

  document.querySelector("#cart-subtotal p:nth-child(2)").innerText =
    subtotal.toFixed(2);

  document.querySelector("#cart-tax p:nth-child(2)").innerText =
    taxPrice.toFixed(2);

  document.querySelector("#cart-shipping p:nth-child(2)").innerText =
    shippingPrice.toFixed(2);

  document.querySelector("#cart-total").lastElementChild.innerText =
    cartTotal.toFixed(2);
};
