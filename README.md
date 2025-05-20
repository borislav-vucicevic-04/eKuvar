# 🍲 eKuvar – A Modern Electronic Cookbook

**eKuvar** is a modern web application designed for chefs, cooking enthusiasts, and anyone who enjoys preparing and sharing recipes. This app serves as a digital alternative to a traditional cookbook and is developed entirely in **Serbian**, tailored specifically for the local audience and culinary culture.

This project was developed as part of a university course called **Databases**, and while originally created for academic purposes, it goes far beyond a simple school assignment by offering a fully functional platform for recipe management, interaction, and personalization.

---

## ✨ Key Features

- 🔐 **User Authentication**
  - Account registration and login
  - Password change functionality
  - Temporarily disabling and reactivating accounts

- 📖 **Recipe Management**
  - Creating, editing, and deleting personal recipes
  - Rich text editing support for detailed formatting
  - Saving and printing recipes as PDF files

- 💬 **User Interaction**
  - Commenting and replying to comments (supports threaded discussions)
  - Deleting comments
  - Rating recipes from 1 to 5 stars

- ⭐ **Personalization**
  - Marking favorite recipes (archiving for later access)
  - Filtering and browsing recipes on the homepage

- 📊 **Analytics**
  - Generating reports for both recipes and user activity

---

## 🛠️ Technologies Used

### Frontend

- **React** with **TypeScript** – Component-based UI development
- **Vite** – Fast bundler and build tool
- **React Router** – Client-side routing
- **React Hook Form** – Handling form validation and submission
- **Tiptap** – Rich text editor for writing recipes with styling
- **pdf-react-renderer** – Exporting and printing recipes as PDFs
- **DOMPurify** – Sanitizing user-generated content to prevent malicious scripts
- **React Query (useQuery)** – Efficient data fetching and caching

### Backend

- **Express.js** with **TypeScript** – RESTful API development
- **Bcrypt** – Password hashing for secure user authentication
- **CryptoJS** – Encryption of sensitive data
- **CORS** – Cross-Origin Resource Sharing for development on separate ports
- **Nodemailer** – Sending email notifications (e.g., for password changes)
- **JSON Web Token (JWT)** – Secure authentication and session management
- **mssql** – Connecting to Microsoft SQL Server

### Database

- **Microsoft SQL Server 2014**  
  Required by the university course, used to store user accounts, recipes, comments, ratings, and other related data.

---

## 📌 Project Notes

- This application is **not currently deployed**, as hosting on GitHub Pages is not possible due to backend requirements.
- A short **demo video** will be provided to showcase the core features and user experience.
- All interface elements and content are written in **Serbian**, reflecting the intended local user base.
- Special attention has been paid to **security**, including password encryption, session expiration, input sanitization, and safe content rendering.

---

## 🎥 Demo

📽️ [Register, LogIn and change password](https://drive.google.com/file/d/1-B6r468y_pKScmYmehlrzQhyfRqqye6X/view?usp=sharing)
📽️ [Deactivate and Reactivate the account](https://drive.google.com/file/d/1-9QH6DZQBS6vCVSBj2secvJfot9s4_oM/view?usp=sharing)
📽️ [Create, edit and delete recepies](https://drive.google.com/file/d/1m5rOnxYJdn7wd1-5-EnxmXORMdQJxINT/view?usp=sharing)
📽️ [View, rate, acrhive and print recepies](https://drive.google.com/file/d/1-4oFs9FTlJNb7tvyD88aD8EgdT1zRn0c/view?usp=sharing)
📽️ [Write and delete comments on recepies](https://drive.google.com/file/d/1-76oZe2o48MOFZlMJGApW8A7keIAjcJC/view?usp=sharing)
📽️ [Filter recepies and view analytics](https://drive.google.com/file/d/1-A0lYVfEGZYq86H6DgCMT1gnnWZHRKzo/view?usp=sharing)
---

## 👤 Author

Created by **Borislav Vučičević**  
🔗 [GitHub Profile](https://github.com/borislav-vucicevic-04)

---

## 📄 License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)** license.  
You are free to view and use the source code for **personal and educational purposes only**. Commercial use and redistribution are not permitted.

---

*If you have any questions or feedback about the app or are interested in contributing, feel free to reach out or open an issue.*
