export const confirmEmailTemplet = async (link) => {
  return `<!DOCTYPE html>
                <html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
                <style type="text/css">
                body{background-color: #88BDBF;margin: 0px;}
                </style>
                <body style="margin:0px;"> 
                <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
                <tr>
                <td>
                <table border="0" width="100%">
                <tr>
                <td>
                <h1>
                    <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
                </h1>
                </td>
                <td>
                <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
                <tr>
                <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
                <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
                </td>
                </tr>
                <tr>
                <td>
                <h1 style="padding-top:25px; color:#630E2B">Email Confirmation</h1>
                </td>
                </tr>
                <tr>
                <td>
                <p style="padding:0px 100px;">
                </p>
                </td>
                </tr>
                <tr>
                <td>
                <a href="${link}" style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">Verify Email address</a>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                <tr>
                <td>
                <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
                <tr>
                <td>
                <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
                </td>
                </tr>
                <tr>
                <td>
                <div style="margin-top:20px;">

                <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
                <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
                </a>
                
                <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
                <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
                </a>

                </div>
                </td>
                </tr>
                </table>
                </td>
                </tr>
                </table>
                </body>
                </html>`;
};

export const hellowpage = async () => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mohamed Hamed Portfolio</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #333;
            color: #fff;
        }
        .container {
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background-color: #444;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: row-reverse;
            align-items: flex-start;
        }
        .content {
            flex-grow: 1;
            padding: 0 20px;
        }
        .content h4 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: left;
        }
        .content p {
            font-size: 16px;
            margin-bottom: 10px;
            text-align: left;
        }
        .link-container {
            margin-bottom: 20px;
            text-align: left;
        }
        .link-container a {
            display: inline-block;
            margin-right: 10px;
            padding: 10px 20px;
            border-radius: 5px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            transition: background-color 0.3s, color 0.3s;
        }
        .link-container a:hover {
            background-color: #0056b3;
        }
.social-icons {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.social-icons a {
    display: inline-block;
    margin-right: 20px;
    font-size: 14px;
    color: #fff;
    background-color: #4CAF50; 
    width: auto; 
    height: 40px;
    line-height: 40px;
    text-align: center;
    text-decoration: none;
    transition: background-color 0.3s, color 0.3s;
    padding: 0 10px; 
    border-radius: 5px; 
}

.social-icons a:hover {
    background-color: #45a049;
}




        .social-icons a:hover {
            background-color: #0056b3;
        }
        img {
            max-width: 200px;
            border-radius: 10px;
            margin-right: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="content">
            <h4>Welcome to My API Services</h4>
            <div class="link-container">
                <a href="${process.env.Apidoc}"  target="_blank">View API project documentation</a>
                <a href="${process.env.ProjectOnGithub}" target="_blank">View full project on GitHub</a>
            </div>
            <h2><span>${process.env.Myname}</span></h2>
            <p>Title: Backend Node.js Developer</p>
            <p>Email: ${process.env.useremail} </p>
            <p>Location: ${process.env.location}</p>
            <div class="social-icons">
                <a href="${process.env.GitHub}" target="_blank">GitHub</a>
                <a href="${process.env.linkedIn}" target="_blank">LinkedIn</a>
            </div>
        </div>
        <img src="${process.env.profileImg}" alt="Mohamed Hamed">
    </div>
</body>
</html>

`;
};
