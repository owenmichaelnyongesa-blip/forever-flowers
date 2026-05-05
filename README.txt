============================================================
  FOREVER FLOWERS — WEBSITE GUIDE
  For: The Business Owner
  No coding experience needed!
============================================================

📁 YOUR FILES
─────────────────────────────────────────────
  index.html   → The main website page
  style.css    → All colours and styling
  script.js    → Website logic (don't edit)
  products.js  → YOUR products & testimonials ← EDIT THIS ONE
  README.txt   → This guide


✏️  HOW TO ADD OR EDIT PRODUCTS
─────────────────────────────────────────────
1. Open "products.js" in any text editor
   (Notepad on Windows, TextEdit on Mac)

2. Find the list of products that starts with:
      const products = [

3. To CHANGE a product:
   Find the product name and change:
   • name        → the product name shown on site
   • price       → sale price (numbers only, no KSh)
   • originalPrice → old/crossed-out price (remove line if no sale)
   • image       → filename of your photo OR a web link
   • badge       → "Sale" / "New" / "Popular" / "" (empty = no badge)
   • description → the short description under the name

4. To ADD a new product:
   Copy this block and paste it before the last ];

   {
     id: 9,                          ← change to next number
     name: "My New Product",
     price: 1500.00,
     image: "myphoto.jpg",           ← put the photo in same folder
     badge: "New",
     description: "A beautiful arrangement."
   },

5. To REMOVE a product:
   Delete the whole { ... }, block for that product.

6. Save the file and refresh your website.


📸  HOW TO ADD YOUR OWN PRODUCT PHOTOS
─────────────────────────────────────────────
1. Put your photo file in the SAME folder as index.html
2. In products.js, set image to just the filename:
      image: "my-roses.jpg"
3. Best photo size: around 800x600 pixels
4. Supported formats: .jpg .jpeg .png .webp


💬  HOW TO CHANGE YOUR WHATSAPP NUMBER
─────────────────────────────────────────────
Open script.js and find this line near the top:
   const WA_NUMBER = "254790022080";
Change the number (keep the 254 country code, no spaces or +).


🎨  HOW TO CHANGE THE SEASONAL BANNER
─────────────────────────────────────────────
Open index.html, search for "seasonal-banner" and change the text
between the <div> tags. Example:
   <div class="seasonal-banner">
     🌹 Valentine's Special — Order 2 days in advance!
   </div>


⭐  HOW TO EDIT CUSTOMER REVIEWS
─────────────────────────────────────────────
In products.js, scroll down to find:
   const testimonials = [
Change the "name" and "text" values for each review.
Add more by copying a { name: ..., text: ... }, block.


🚀  HOW TO GO LIVE (DEPLOY)
─────────────────────────────────────────────
1. Upload ALL 5 files to a GitHub repository
2. Connect the repository to Vercel (vercel.com)
3. Vercel gives you a free live link instantly!
   e.g. forever-flowers.vercel.app

For a custom domain like foreverflowers.co.ke:
• Buy domain from Truehost Kenya (~KSh 900/year)
• Connect it in Vercel → Settings → Domains


📞  NEED HELP?
─────────────────────────────────────────────
Contact your web designer on WhatsApp: 0736 566 870
(Nyongesa Michael Owen — Get.Techy254)

============================================================
