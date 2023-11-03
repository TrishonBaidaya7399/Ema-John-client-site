import React, { useEffect, useState } from 'react';
import { addToDb, deleteShoppingCart, getShoppingCart } from '../../utilities/fakedb';
import Cart from '../Cart/Cart';
import Product from '../Product/Product';
import './Shop.css';
import { Link, useLoaderData } from 'react-router-dom';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [currentPage, setCurrentPage] = useState(0);
    const [count, setCount] = useState(0)
    // const { count } = useLoaderData();
    console.log(count);
    const numberOfPages = Math.ceil(count/itemsPerPage)
    console.log(numberOfPages);
    // const pages = []
    // for(let i=0 ; i<numberOfPages ; i++ ){
    //     pages.push(i)
    // }
    //another way
    const pages = [...Array(numberOfPages).keys()]

    console.log(pages);
    const cartData = useLoaderData();
    useEffect(()=>{
        setCart(cartData)
    },[])
    /**
     * Done: get the total number of products
     * Todo: define the total number of items in a page
     * Todo: calculate the total
     * todo: Display Page Controls
     * todo: Get the current page 
     */
  
    useEffect(()=>{
        fetch(`https://ema-john-pagination-server-starter-theta.vercel.app/productsCount`)
        .then(res => res.json())
        .then(data => setCount(data.count))
    },[])

    useEffect(() => {
        fetch(`https://ema-john-pagination-server-starter-theta.vercel.app/products?page=${currentPage}&size=${itemsPerPage}`)
            .then(res => res.json())
            .then(data => setProducts(data))
    }, [currentPage, itemsPerPage]);

    // useEffect(() => {
    //     const storedCart = getShoppingCart();
    //     const savedCart = [];
    //     // step 1: get id of the addedProduct
    //     for (const id in storedCart) {
    //         // step 2: get product from products state by using id
    //         // const addedProduct = products.find(product => product._id === id)
    //         const addedProduct = products.find(product => product._id === id)
    //         if (addedProduct) {
    //             // step 3: add quantity
    //             const quantity = storedCart[id];
    //             addedProduct.quantity = quantity;
    //             // step 4: add the added product to the saved cart
    //             savedCart.push(addedProduct);
    //         }
    //         // console.log('added Product', addedProduct)
    //     }
    //     // step 5: set the cart
    //     setCart(savedCart);
    // }, [products])

    const handleAddToCart = (product) => {
        // cart.push(product); '
        let newCart = [];
        // const newCart = [...cart, product];
        // if product doesn't exist in the cart, then set quantity = 1
        // if exist update quantity by 1
        const exists = cart.find(pd => pd._id === product._id);
        if (!exists) {
            product.quantity = 1;
            newCart = [...cart, product]
        }
        else {
            exists.quantity = exists.quantity + 1;
            const remaining = cart.filter(pd => pd._id !== product._id);
            newCart = [...remaining, exists];
        }

        setCart(newCart);
        addToDb(product._id)
    }

    const handleClearCart = () => {
        setCart([]);
        deleteShoppingCart();
    }

        const handleItemsPerPage = (e)=>{
            const val = parseInt(e.target.value);
            setItemsPerPage(val);
            setCurrentPage(0);
        }



    return (
        <div className='shop-container'>
            <div className="products-container">
                {
                    products.map(product => <Product
                        key={product._id}
                        product={product}
                        handleAddToCart={handleAddToCart}
                    ></Product>)
                }
            </div>
            <div className="cart-container">
                <Cart
                    cart={cart}
                    handleClearCart={handleClearCart}
                >
                    <Link className='proceed-link' to="/orders">
                        <button className='btn-proceed'>Review Order</button>
                    </Link>
                </Cart>
            </div>
            <div className="pagination text-center mb-12 " style={{marginInline: "auto"}}>
            {/* <div style={{marginRight: "20px"}}><p>current Page: {currentPage}</p></div>     */}
            <div className='itemsPerPage'>
                <p>Items Per Page</p>
                <select className='pageNumberSelect' name='' value={itemsPerPage} onChange={handleItemsPerPage} id=''>
                    <option value="9">9</option>
                    <option value="18">18</option>
                    <option value="27">27</option>
                </select>
            </div>
            <button onClick={()=>{if(currentPage > 0){
                setCurrentPage(currentPage - 1);
            }}} style={{marginRight: "20px"}}>{`<-`}</button>
                {
                    pages.map((page, idx) => <button 
                    className={currentPage === page ? 'pgeButtons selected' : 'pgeButtons'} 
                    onClick={()=> setCurrentPage(page)}
                    key={idx}>{page}</button>)
                }
            <button onClick={()=>{if(currentPage < pages.length -1){
                setCurrentPage(currentPage + 1);
            }}}>{`->`}</button>
                   
            </div>
        </div>
    );
};

export default Shop;