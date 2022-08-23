document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {
                axios
                    .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
                    .then((result) => {
                        this.pizzas = result.data.pizzas
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        this.cartId = result.data.cart_code
                    })
            },


            createCart() {
                return axios.get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)

            },

            showCart() {
                const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;

                axios
                    .get(url)
                    .then((result) => {
                        this.cart = result.data;
                    });
            },

            pizzaImage(pizza) {
                return `images/${pizza.size}.png`
            },

            message: '',
            username: '',
            pizzas: [],
            cartId: '',
            cart: { total: 0 },
            CartPayment: '',
            paymentMessage: '',


            add(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
                    .then(() => {

                        this.message = pizza.flavour + ' added to cart',
                            this.showCart();
                    })
                    .catch(err => alert(err));

                //alert(pizza.id)

            },

            remove(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
                    .then(() => {

                        this.showCart(),
                            this.message = pizza.flavour + ' removed from cart';
                    })
                    .catch(err => alert(err));

            },

            payment(cart) {
                const param = {
                    cart_code: this.cartId,
                }

                axios
                    .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay')
                    .then(() => {
                        if (cart.total <= this.CartPayment) {
                            this.paymentMessage = 'Payment successful'
                        }
                        else {
                            this.paymentMessage = 'Payment Failed!'
                        }
                    })

                setTimeout(() => {
                    this.paymentMessage = '';
                    this.init
                }, 4000)
            }

        }
    });
})