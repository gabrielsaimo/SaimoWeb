const EmailSaimo = (id: number) => {
  return `
   <html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cliente Cadastado com Sucesso</title>

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
      <h1>Novo Cliente</h1>
      <p>
        Cliente ${id} cadastrado com sucesso!
        Tem um novo cliente cadastrado no sistema, acesse o sistema para mais
        informações.
      </p>
    </div>
  </body>
</html>
    `;
};

export default EmailSaimo;
