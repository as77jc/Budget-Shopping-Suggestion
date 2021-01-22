let url = 'https://fakestoreapi.com/products/';

let productsDiv = document.querySelector('.products');
let input = document.querySelector('.input-budeget');
let categories = document.getElementById('categories');
let inputRange = document.getElementById('inputrage');

let currency = 'USD'

let minInput = '';
let maxInput = '';

let chooseCategory = 'ALL';

let min = 0;
let minInputValue = min;

let max = Number.MAX_VALUE;
let maxInputValue = max;

async function getProducts () {
    const productsPromise = await fetch(url);
    const products = await productsPromise.json();
    
    let categoriesHtml = '';
    let productsHtml = '';
    let pageCategories = ['ALL'];
    let priceRange = [];
    
    for (let product of products) {
        
        if (
            (chooseCategory == '' || chooseCategory == 'ALL') &&
            (product.price >= minInputValue && product.price <= maxInputValue)
            ) {
                makeHtml(product)
        } else if (
            (chooseCategory == product.category) &&
            (product.price >= minInputValue && product.price <= maxInputValue)
            ) {
                makeHtml(product)
        }
            
        pageCategories.push(product.category);   // make parices array
    
    }
    
    /////////////////////////////////////////////////////////////////////////
    ///// Fill the page by products
    /////////////////////////////////////////////////////////////////////////
    
    function makeHtml (product) {
        productsHtml += `
                    <div class="each-product card">
                        <div class="product">
                            <img class="product-image" src="${product.image}" alt="${product.title}" />
                            <h3 class="product-title">${product.title}</h3>
                            <div class="product-info">
                                <P class="product-price">Price: <strong>${product.price}</strong> ${currency}</p>
                                <p class="product-category">Category: <strong>${product.category}</strong></p>
                            </div>
                    </div>
                    <div class="description">
                            <div class="description-name">${product.title}</div>
                            <div class="description-category"><em>Category: <span>${product.category}</span></em></div>
                            <div class="description-product">${product.description}</div>
                    </div>
                    </div>
                    `;
        priceRange.push(product.price);  // make categories array
    }
    
    /////////////////////////////////////////////////////////////////////////
    ///// sort array (prices and categories)
    /////////////////////////////////////////////////////////////////////////
        
    pageCategories = pageCategories
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort();
    priceRange = priceRange
                    .filter((v, i, a) => a.indexOf(v) === i)
                    .sort(function(a, b){return a - b});

    if (min == 0) min = Math.floor(priceRange[0]);
    if (max == Number.MAX_VALUE) max = Math.floor(priceRange[priceRange.length - 1]) + 1;

    if (minInputValue < priceRange[0]) minInputValue = Math.floor(priceRange[0]);
    if (maxInputValue > priceRange[priceRange.length - 1]) {
        maxInputValue = Math.floor(priceRange[priceRange.length - 1]) + 1;
    }
    
    pageCategories.forEach(e => categoriesHtml += `<option>${e}</option>`)
    
    // console.log(productsHtml)
    
    productsDiv.innerHTML = productsHtml;
    categories.innerHTML = categoriesHtml;
    
    categories.value = chooseCategory;
    
    inputRange.innerHTML = `<span>Prices(${currency}) from: 
        <input 
            id="minInput" 
            type="number" 
            value="${minInputValue}" 
            min="${min}" 
            max="${max}"
        /> to: 
        <input 
            id="maxInput" 
            type="number" 
            value="${maxInputValue}" 
            min="${min}" 
            max="${max}"
        /></span>`;
        
    minInput = document.getElementById('minInput');
    maxInput = document.getElementById('maxInput');
    
    
    
    minInput.addEventListener('keyup', () => {
        if (minInput.value >= min && minInput.value <= max) {
            minInputValue = Number(minInput.value);
            getProducts()

        }else return
    })
    
    maxInput.addEventListener('keyup', () => {
        if (maxInput.value >= min && maxInput.value <= max) {
            maxInputValue = Number(maxInput.value);
            getProducts()

        }else return
    })
    
}

getProducts()

/////////////////////////////////////////////////////////////////////////
///// Chooooose Category 
/////////////////////////////////////////////////////////////////////////

categories.addEventListener('change', () => {
    
    chooseCategory = categories.value;
    getProducts();
})
