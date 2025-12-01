 STAV — Online Shop
A responsive e-commerce frontend built for the Noroff FED1 course.  
Users can browse products, view details, register, log in, add items to a cart, and complete a checkout flow.  
The design, planning, and development follow all requirements from the course assignment brief.


    Live Project Links
Website: (your GitHub Pages link)  
Repository: (https://github.com/Bjelland14/LLOYD_EDWARD_BJELLAND_PE1_JAN25FT-)  
Figma Style Guide & Prototypes: (your Figma link)  
Planning Board (Kanban): (https://github.com/users/Bjelland14/projects/10)


    Admin Test User
For examiner testing:

**Email:** stav-admin@stud.noroff.no  
**Password:** Admin123!

This user logs in using localStorage (client-side simulation for assignment purposes).


 Project Overview
This project includes:

- Full responsive e-commerce frontend  
- Carousel with latest products  
- Product detail pages (description, price, discount, rating, tags, reviews)  
- Add to Cart (localStorage)  
- Cart page (update, remove, total price)  
- Checkout with form validation  
- Success page with generated order ID  
- User login, logout, and register  
- “Welcome, {name}” message when logged in  
- Style guide + desktop & mobile UI in Figma  
- Complete project planning (Kanban + Gantt chart)

---

    Built With
- HTML5  
- CSS3 (custom, no frameworks)  
- JavaScript (ES Modules)  
- Noroff Online Shop API  
- Figma (design & style guide)  
- GitHub Pages (deployment)

---

  Pages in the Application

-Index
-Cart
-Checkout
-Product
-Success
-Login
-Register

 API Usage (Swagger)
This project uses the **Noroff Online Shop API** documented here:  
https://v2.api.noroff.dev/docs

Endpoints used:
- `GET /online-shop` – product list  
- `GET /online-shop/{id}` – single product details  

*(Authentication is local-only for this assignment.)*


 Figma Deliverables (Style Guide)
The style guide includes:

- Logo & brand colors  
- Primary & secondary palettes  
- Typography (H1, H2, H3, body, small)  
- Button components (primary, secondary, ghost, navigation)  
- Form components (default, focus, error states)  
- Product card components  
- Grid system & spacing tokens  
- Desktop & mobile high-fidelity prototypes  

---

  Validation & Testing
- Valid HTML (W3C)  
- CSS validated  
- Lighthouse tested (SEO, accessibility, performance)  
- JavaScript error-free  
- All user stories manually tested  
- Form validation for login, register, and checkout  
- Error messages displayed clearly  

---

 Planning & Management
Completed using GitHub Projects:

- Kanban board (To Do, In Progress, Done)  
- Detailed tasks with descriptions, priorities, and dates  
- Roadmap + Gantt chart  
- Frequent commits & version control  

---

 Folder Structure
 /
├── index.html
├── product.html
├── cart.html
├── checkout.html
├── success.html
├── account/
│   ├── login.html
│   ├── register.html
├── css/
│   ├── base.css
│   ├── layout.css
│   ├── pages.css
│   ├── components.css
├── js/
│   ├── api.js
│   ├── global.js
│   ├── index.js
│   ├── product.js
│   ├── cart.js
│   ├── checkout.js
│   ├── login.js
│   ├── register.js
├── assets/
│   ├── images
│   ├── icons
└── README.md

---

    Contact
Name: Lloyd Edward Bjelland  
GitHub: https://github.com/Bjelland14

