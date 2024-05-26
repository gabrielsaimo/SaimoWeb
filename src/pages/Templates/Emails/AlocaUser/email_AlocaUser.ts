const Email_AddUser = (values: any) => {
  return `<html lang="pt-br">
      <head>
        <meta charset="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>Acesso a ${values.company} Liberado</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
          }
          .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: var(--primary-color);
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          }
          .container h1 {
            font-size: 24px;
            margin-bottom: 20px;
            text-align: center;
          }
          .container p {
            font-size: 16px;
            margin-bottom: 20px;
          }
          .container a {
            display: block;
            width: 100%;
            max-width: 200px;
            margin: 0 auto;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            background-color: #f4f4f4;
            color: #333;
            border-radius: 5px;
            transition: background-color 0.3s;
          }
          .container a:hover {
            background-color: #e4e4e4;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1> Acesso a ${values.Company} Liberado! </h1>
          <p>
            Olá ${values.name}, 
            <br>
            <div>
            <H1>Agora você tem acesso ao sistema de cardápio digital da empresa ${values.Company}.</H1>
            <br>
            <br>
            <p style="text-align: center">
            <a style="color: aqua;font-weight: bold" href="https://menu-digital.vercel.app/Company">Acesse o sistema aqui</a>
            </p>
          </p>
        </div>
      </body>
      </html>`;
};

export default Email_AddUser;
