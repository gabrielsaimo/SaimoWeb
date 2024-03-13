const Email_senha = (value: string) => {
  return `<html>
    <head>
    <style>
    .container {
      width: 100%;
      background-color: #f2f2f2;
      padding: 10px;
    }
    .container h1 {
      text-align: center;
    }
    .container p {
      text-align: center;
    }
    </style>
    </head>
    <body>
    <div class='container'>
    <h1>Senha alterada</h1>
    <p>Sua senha para o email ${value} foi alterada com sucesso</p>
    </div>
    </body>
    </html>`;
};
export default Email_senha;
