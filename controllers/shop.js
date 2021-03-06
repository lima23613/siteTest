const Product = require('../models/product');
const Order = require('../models/Order');
//const CartItem = require('../models/cart-item')

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products =>{
        res.render('shop/product-list',{
            prods: products,
            docTitle:'All Products',
            path:'/products'           
         });
    })
    .catch(err=>
        { 
            console.log(err);
        });   
};

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;

   /*  Product.findAll({where:{id : prodId}})
    .then(product=>{            
        res.render('shop/product-detail',{
            docTitle: product[0].title,
            path: '/products',
            prods: product[0]
        });
    })
    .catch(err => console.log(err)); */

    Product.findById(prodId)
        .then(product=>{            
                res.render('shop/product-detail',{
                    docTitle: product.title,
                    path: '/products',
                    prods: product
                });
            }
        )
        .catch(err => console.log(err));   
};

//list all product on shop
exports.getIndex = (req,res,next)=>{

    Product.findAll()
        .then(products =>{
            res.render('shop/index',{
                prods: products,
                docTitle:'shop',
                path:'/'           
             });
        })
        .catch(err=>{ console.log(err);});    
};

exports.getCart = (req,res,next)=>{

    req.user.getCart()
    .then(cart =>
         {return cart.getProducts()
            .then(products =>{
                res.render('shop/cart', {
                    docTitle: 'Your Cart',
                    path: '/cart',
                    products: products 
                });

            })
            .catch(err=>consile.log(err))
        })
    .catch(err=> {console.log(err)});
    /* Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products){
                const carProductData = cart.products.find(prod=>prod.id === product.id);
                if(carProductData){
                    cartProducts.push({productData: product, Qty: carProductData.qty});
                }
            }
            res.render('shop/cart', {
                docTitle: 'Your Cart',
                path: '/cart',
                products: cartProducts 
            });
        });
    });   */  
}

    exports.postCart = (req,res,next) =>{

    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;
    
    req.user.getCart().then(cart=>{   
            fetchedCart = cart;            
            return cart.getProducts({ where: { id : prodId } });                
        }).then(products =>{
            let product;            
            if(products.length > 0){
                product = products[0];                              
            }            
            if(product){
                const oldQty = product.cartItem.quantity;
                newQuantity = oldQty + 1;                
                return product;               
            }
            return Product.findById(prodId);              
        }).then(product =>{ 
            return fetchedCart.addProduct(product, 
                    {through: {quantity:newQuantity}});
        }).then(()=> {
            res.redirect('/cart')}).catch(err=>console.log(err))
     
   /*  const prodId = req.body.productId;
    Product.findById(prodId,product =>{
        Cart.addProduct(prodId,product.price);
    })
    res.redirect('/cart');*/ 
};
 
exports.postCartDeleteProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    let fetchedCart;
    let newQty;

    req.user.getCart()
    .then(cart =>{
        return cart.getProducts({where : { id: prodId }});
    })
    .then(products =>{
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(reuslt => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err))        
}
exports.postOrder = (req,res,next)=>{
    let fetchedCart;
    req.user.getCart()
    .then(cart=>{
        fetchedCart = cart;
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product=>{
                product.orderItem = {quantity : product.cartItem.quantity}
                return product;
            }));
        })
        .catch(err => console.log(err))        
    })
    .then(result => {
        return fetchedCart.setProducts(null);        
    })
    .then(result =>{
        res.redirect('/orders')
    })
    .catch(err => console.log(err))
}


exports.getOrder = (req,res,next) => {
    req.user.getOrders({include: ['products']})
    .then(orders=>{
        res.render('shop/orders',{
            docTitle: 'Your Orders',
            path:'/orders',
            orders: orders
        });
    })
    .catch(err => console.log(err))  
}


exports.getCheckout = (req,res,next)=>{
      
}

