 STAV – E-commerce Web Application

A responsive front-end e-commerce web application built using HTML, CSS, and JavaScript, powered by an external API. Users can browse products, register, log in, add items to cart, and complete a checkout flow.

This project was developed as Project Exam 1 in the FED1 program.



 Live Demo & Links

- Live Website:  
https://bjelland14.github.io/stav-ecommerce/

- GitHub Repository:  
https://github.com/Bjelland14/stav-ecommerce

- Figma Style Guide: 
https://www.figma.com/design/F5TUiz9v1mDqmux9YVLriu/LLOYD_EDWARD_BJELLAND_PE1_JAN25FT-?node-id=1-2&t=xInlVp1axSXSfLHr-1

- Project Planning Board:  
https://github.com/users/Bjelland14/projects/10



 Admin / Owner Test User

Use the following credentials to test the owner functionality:

Email:  

admin@stav.no

Password:
Admin1234


 This user can log in, add products to the cart, and complete checkout.

 Or create your own account.

 Features

- Product feed with interactive carousel
- Product detail page with:
  - Price & discounted price
  - Rating & reviews
  - Tags
  - Shareable product link
- User authentication:
  - Register
  - Login
  - Logout
- Cart system:
  - Add / remove products
  - Quantity control
  - Total price calculation
- Checkout system:
  - Delivery address form
  - Payment method selection
- Success page after checkout
- Fully responsive (mobile & desktop)
- Accessible & SEO-friendly



  Tech Stack

- HTML
- CSS
- JavaScript (ES Modules)
- External REST API
- GitHub Pages (deployment)

 No frameworks were used (as required).



 Project Structure
/index.html
/product.html
/cart.html
/checkout.html
/success.html

/account/
├── login.html
└── register.html

/css/
├── base.css
├── layout.css
├── components.css
└── pages.css

/js/
├── api.js
├── global.js
├── home.js
├── product.js
├── cart.js
├── checkout.js
