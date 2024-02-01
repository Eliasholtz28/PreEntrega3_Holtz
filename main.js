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

const listCart = JSON.parse( localStorage.getItem('cart') ) || [];


const cart = new Cart(listCart);

cartCount.innerText = cart.getCount()

btnModalCarrito.addEventListener('click', function(){
    const list = cart.getProducts()
    cartSum.innerText = cart.getSum();

    renderCart(list);

    modal.show();
})

btnClose.addEventListener('click', ()=> {
    modal.hide();
})

inputSearch.addEventListener('input', (event) => {
    const search = event.target.value;
    const newList = products.filter( (product) => product.name.toLowerCase().includes(search.toLowerCase()))

    renderProducts(newList)
    
})


btnOrder.addEventListener('click', ()=> {
    
    products.sort(  (a, b ) => {
        if( a.price < b.price){
            return -1
        }
        if( a.price > b.price){
            return 1
        }

        return 0
    })

    renderProducts(products)
    
    btnOrder.setAttribute('disabled', true)
})

/* ---------------- recibe la lista de productos y renderiza ---------------- */

const renderProducts = (list)=> {
    
    listProducts.innerHTML = '';
    
    list.forEach(product => {
        
        listProducts.innerHTML += //html
        `<div class="col-sm-4 col-md-3 mb-3">
            <div class="card p-2 colorProducto">
                <h3 class="text-center">${product.name}</h3>
                <img class="img-fluid" src="${product.img}" alt="${product.name}">
                <h4 class="text-center">$${product.price}</h4>
                <button id="${product.id}" type="button" class="btn btn-primary btnAddCart btnColorProducto">
                    <i class="bi bi-bag-plus"></i>Agregar al carrito
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
    const id = e.target.id;
    const product = products.find( item => item.id == id);
    cart.addToCard( product);
    cartCount.innerText = cart.getCount();
}

const removeOneFromProduct = (event) => {
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
        btn.addEventListener('click', removeOneFromProduct); // Cambiado a removeOneFromProduct
});
}




renderProducts(products)