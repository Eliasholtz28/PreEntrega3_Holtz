const modal = new bootstrap.Modal('#modalCarrito',{});
const btnModalCarrito = document.querySelector('#btnModalCarrito')
const cartCount = document.querySelector('#cartCount');
const cartSum = document.querySelector('#cartSum');
const inputSearch = document.querySelector('#inputSearch');
const listProducts = document.querySelector('#listProducts');
const modalListProducts = document.querySelector('#modalListProducts');
const btnClose = document.querySelector('#btnClose');
const btnSave = document.querySelector('#btnSave');
const btnOrder = document.querySelector('#btnOrder');

let products_list = [];

const listCart = JSON.parse( localStorage.getItem('cart') ) || [];


const cart = new Cart(listCart);

cartCount.innerText = cart.getCount()

btnModalCarrito.addEventListener('click', function(){
    const list = cart.getProducts()
    cartSum.innerText = cart.getSum();

    renderCart(list);

    modal.show();
})

btnSave.addEventListener('click', ()=> {
    console.log('Inicio')
    setTimeout( () => {

        
        Swal.fire({
            title: "Gracias por tu compra",
            text: "Compra finalizada",
            icon: "success",
            background: "#020202",
            color: "#ececea",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#30302e",
        });
    

    }, 2000)


    modal.hide();
   
    localStorage.removeItem('cart');
})

btnClose.addEventListener('click', ()=> {
    modal.hide();
})

inputSearch.addEventListener('input', (event) => {
    const search = event.target.value;
    const newList = products_list.filter( (product) => product.name.toLowerCase().includes(search.toLowerCase()))

    renderProducts(newList)
    
})


btnOrder.addEventListener('click', ()=> {

    Toastify({
        text: "SE ordeno de menor a mayor precio",
        duration: 2000,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #020202, #30302e)",
          borderRadius: "2rem",
          textTransform: "uppercase",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    
    products_list.sort(  (a, b ) => {
        if( a.price < b.price){
            return -1
        }
        if( a.price > b.price){
            return 1
        }

        return 0
    })

    renderProducts(products_list)
    
    btnOrder.setAttribute('disabled', true)
})

/* ------------------ traemos los productos del json local ------------------ */

const getProducts = async () => {

    try {
        const endPoint = 'data.json';
        const resp = await fetch(endPoint);
        const json = await resp.json();
        
        const products = json.products;
        products_list = products

        renderProducts(products);

    } catch (error) {
        Swal.fire({
            title: "Error",
            text: "Ocurrio un error al cargar los productos",
            icon: "error",
            background: "#020202",
            color: "#ececea",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#30302e",
          });
    }
    

}


/* ---------------- recibe la lista de productos y renderiza ---------------- */

const renderProducts = (list)=> {
    
    listProducts.innerHTML = '';
    
    list.forEach(product => {
        
        listProducts.innerHTML += //html
        `<div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <div class="card p-2 colorProducto">
                <h3 class="text-center">${product.name}</h3>
                <img class="img-fluid" src="${product.img}" alt="${product.name}">
                <h4 class="text-center">$${product.price}</h4>
                <button id="${product.id}" type="button" class="btn btn-primary btnAddCart btnColorProducto">
                    <i class="bi bi-bag-plus"></i> Agregar al carrito
                </button>
            </div>
        </div>`;
    });
    
     const btns = document.querySelectorAll('.btnAddCart');
     
     btns.forEach(btn => {
        btn.addEventListener('click', addToCart)
     });
}

const addToCart = ( e )=> {

    Toastify({
        text: "Se agregó al carrito",
        duration: 2000,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #020202, #30302e)",
          borderRadius: "2rem",
          textTransform: "uppercase",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    const id = e.target.id;
    const product = products_list.find( item => item.id == id);
    cart.addToCard( product);
    cartCount.innerText = cart.getCount();
}

const removeOneFromProduct = (event) => {


    Toastify({
        text: "Se eliminó un producto del carrito",
        duration: 2000,
        close: false,
        gravity: "top", // `top` or `bottom`
        position: "center", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #020202, #30302e)",
          borderRadius: "2rem",
          textTransform: "uppercase",
        },
        onClick: function(){} // Callback after click
      }).showToast();

    const index = event.currentTarget.dataset.bsIndex;
    if (index !== undefined) {
        cart.removeOneFromProduct(index);
        renderCart(cart.getProducts());
        cartCount.innerText = cart.getCount();
        cartSum.innerText = cart.getSum();
        localStorage.setItem('cart', JSON.stringify(cart.getProducts()));
    } else {
        console.error('No se pudo obtener el índice del producto a eliminar.');
    }
};





const renderCart = (list) => {
    modalListProducts.innerHTML = '';
    list.forEach( (product, index) => {
        modalListProducts.innerHTML += //html
        `
            <tr class="modalColorJs">
                <td>${product.name}</td>
                <td>${product.units}</td>
                <td>$${product.price}</td>
                <td>$${product.price * product.units}</td>
                <td>
                    <button class="btn btn-dark btnRemoveProduct" data-bs-index="${index}">
                        <i class="bi bi-trash"></i> Eliminar
                    </button>
                </td>

            </tr>`
    })

    const btnsRemoveProduct = document.querySelectorAll('.btnRemoveProduct');
    btnsRemoveProduct.forEach(btn => {
        btn.addEventListener('click', removeOneFromProduct);
});
}



getProducts();