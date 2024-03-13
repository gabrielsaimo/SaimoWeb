import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import {
  PostUserPassword,
  sendUserEmail,
  validadaEmail,
} from "../../services/user.ws";
import { postEmail } from "../../services/email.ws";
import Email_senha from "../Templates/Emails/Senha/email_senha";

const Forgot = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);

  const onSendEmail = async (values) => {
    const data = {
      destinatario: values.email,
      assunto: "Recuperação de senha",
    };
    const resp = await validadaEmail(values.email);
    if (resp.length === 0) {
      message.error("Email não cadastrado", 5);
      return;
    } else {
      message.success("Email enviado com sucesso", 5);
    }
    sendUserEmail(data);
    setStep(2);
  };

  const onFinish = async (values) => {
    console.log("Received values of form: ", values);
    const EmailSenha = Email_senha(form.getFieldValue("email"));
    const data = {
      email: form.getFieldValue("email"),
      newPassword: values.password,
      cod: values.Code,
    };

    message.success("Senha alterada com sucesso", 5);
    await PostUserPassword(data);
    await postEmail({
      destinatario: data.email,
      assunto: "Senha alterada",
      corpo: EmailSenha,
    });
    window.location.href = "/Login";
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "linear-gradient(to right,#00ff00 , #0a4bff)",
      }}
    >
      <div
        style={{
          width: "400px",
          marginLeft: "auto",
          marginRight: "auto",
          border: "1px solid #ccc",
          padding: "20px",
          borderRadius: "5px",
          display: "grid",
          gridGap: "10px",
        }}
      >
        {step === 1 && (
          <div className="col-md-6">
            <h2>Esqueci minha senha</h2>
            <p>
              Digite seu email e enviaremos um link para você redefinir sua
              senha
            </p>
            <Form
              form={form}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onSendEmail}
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira seu email!",
                  },
                ]}
              >
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Enviar
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
        {step === 2 && (
          <div className="col-md-6">
            <h2>Nova senha</h2>
            <p>Digite sua nova senha</p>
            <Form
              form={form}
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="Code"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira o código!",
                    min: 8,
                  },
                ]}
              >
                <Input placeholder="Código" />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Por favor, insira sua senha!",
                    min: 8,
                  },
                ]}
              >
                <Input.Password placeholder="Senha" />
              </Form.Item>
              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Por favor, confirme sua senha!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject("As senhas não conferem!");
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirme sua senha" />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Enviar
                </Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Forgot;
