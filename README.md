# University Management System Backend

<img src="https://graduation-project-beryl-seven.vercel.app/assets/images/login_logo.jpg" alt="logo Image" width="100">

## Table of Contents

1. [Project Description](#project-description)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [API Documentation](#api-documentation)
6. [Live Demo](#live-demo)
7. [Project Video](#project-video)
8. [Database Schema](#database-schema)
9. [UI Images](#ui-images)
10. [Contact](#contact)
11. [Project Links](#project-links)

## Project Description

The University Management System Backend is a Node.js-based application designed to handle the server-side operations of a university management system. It provides RESTful APIs for managing students, courses, instructors, and other university-related data.

## Installation

To install and run this project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/Mohamed-Hamed-20/university-backend.git

2. Navigate to the project directory:
   ```sh
   cd university-backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Add the configuration file as described in the next section.

## Configuration

Create a `config/config.env` file in the root directory and add the following configuration variables:

```env
PORT=5000
MOOD=DEV
DB_url="mongodb+srv://name:password@cluster0.4h5fpsc.mongodb.net/DBName"
salt_Round=8

# Access tokens
ACCESS_TOKEN_SECRET="your_access_token_secret"
accessExpireIn="1h"
ACCESS_TOKEN_startwith="Bearer "
ACCESS_TOKEN_ENCRPTION="your_access_token_encryption_key"

# Refresh tokens
REFRESH_TOKEN_SECRET="your_refresh_token_secret"
REFRESH_ExpireIn="5d"
REFRESH_TOKEN_ENCRPTION="your_refresh_token_encryption_key"

# Email Configuration
email="your_email@example.com"
password="your_email_password"
ConfirmEmailExpireIn="7m"
ConfirmEmailPassword="your_confirm_email_password"
universityEmail="university@example.com"

# Folder names
folder_name="university"
NODE_ENV="DEV"

# Cloudinary
api_secret="your_cloudinary_api_secret"
cloud_name="your_cloudinary_cloud_name"
api_key="your_cloudinary_api_key"

# Stripe
STRIPE_KEY="your_stripe_key"

# AWS S3
Bucket_name="backend-file-university"
Bucket_Region="eu-north-1"
AWS_Access_key="your_aws_access_key"
AWS_key_secret="your_aws_key_secret"

# Image Folders
Folder_stu="university/students"
Folder_Admin="university/admins"
Folder_Instructor="university/instructors"
Folder_course="university/courses"
Folder_Training="university/Trainings"
Folder_semster="university/semesters"

cryptoKeyConfirmEmails="your_crypto_key_for_confirm_emails"
```

## Usage

To start the server, run:

```sh
npm start
```

The server will be running at `http://localhost:5000`.

## API Documentation

The API documentation is available [here](https://documenter.getpostman.com/view/27782301/2s9YywdeYx).

## Live Demo

You can access the live demo of the project [here](https://graduation-project-beryl-seven.vercel.app/).

## Project Video

Watch the project video [here](https://www.youtube.com/watch?v=nr8-qxS8cLY).

## Database Schema

### Class Diagram

### Database Schem

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720431523/Genaral%20IMgs/fcamrvr8nmdp5stqmnry.jpg" alt="Database Schem" width="400">

## UI Images

### Admin Dashboard

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433230/Genaral%20IMgs/mp1dnskmajuejkp0fp1b.png" alt="Admin Dashboard" width="400">

### Instructor Dashboard

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433230/Genaral%20IMgs/nxqowvqnyahnuczdm8vs.png" alt="Instructor Dashboard" width="400">

### Login Page

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433230/Genaral%20IMgs/azftu1xhjpvjxhjayxlf.png" alt="Login Page" width="400">

### Admin Student Add

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433230/Genaral%20IMgs/lzlld8jdcsqkjjjaery8.png" alt="Admin Student Add" width="400">

### Newspaper Image for Student

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433231/Genaral%20IMgs/ga3f1e2abfetgv9ekec6.png" alt="Newspaper Image for Student" width="400">

### Student Main Front

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433231/Genaral%20IMgs/hj7xi40r57ujhddsd53j.png" alt="Student Main Front" width="400">

### Student Registration Front

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433233/Genaral%20IMgs/yjyf6m994bvhvj0bi8dw.png" alt="Student Registration Front" width="400">

### Training Registration

<img src="https://res.cloudinary.com/dxjng5bfy/image/upload/v1720433235/Genaral%20IMgs/kdbl7txlcmrikgqs5jqb.png" alt="Training Registration" width="400">

## Contact

For any inquiries or feedback, you can reach me at:

- Email: [mh674281@gmail.com](mailto:mh674281@gmail.com)
- GitHub: [Mohamed-Hamed-20](https://github.com/Mohamed-Hamed-20)
- LinkedIn: [Mohamed Hamed](https://www.linkedin.com/in/mohamed-hamed-9b2655225/)
- Location: Banha, Al Qalyubiyah, Egypt

## Project Links

- [GitHub Repository](https://github.com/Mohamed-Hamed-20/university-backend)
