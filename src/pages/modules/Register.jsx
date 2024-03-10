import React from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Select, Spin, message } from "antd";
import "../../css/Register.css";
import { MaskedInput } from "antd-mask-input";
import { PutRegister } from "../../services/user.ws";
import { postEmail } from "../../services/email.ws";
import Email_cadastro from "../Templates/Emails/Cadastro/email_cadastro";
import EmailSaimo from "../Templates/Emails/Saimo/email_saimo";
export default function Register() {
  const { plan } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    const random = Math.floor(Math.random() * 100000000);
    const emailCadastro = Email_cadastro(values);
    const emailSaimo = EmailSaimo(random);
    const data = {
      ...values,
      phone: Number(values.phone.replace(/\D/g, "")),
      id: random,
    };

    const emailCliente = {
      destinatario: values.email,
      assunto: "Cadastro realizado com sucesso",
      corpo: emailCadastro,
    };

    const email_Saimo = {
      destinatario: "gabrielsaimo68@gmail.com",
      assunto: "Cliente cadastrado com sucesso!",
      corpo: emailSaimo,
    };
    await postEmail(email_Saimo);
    await postEmail(emailCliente);
    await PutRegister(data);
    form.resetFields();
    message.success("Cadastro realizado com sucesso!");
    message.info("Você será redirecionado para a página inicial!");
    message.info("Verifique seu email para mais informações!");

    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  };

  return loading ? (
    <Spin
      size="large"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    />
  ) : (
    <div className="register-container">
      <h1>Register</h1>
      <Form
        form={form}
        name="register"
        onFinish={onFinish}
        className="register-form"
      >
        <Form.Item
          name="fullname"
          label="Nome Completo:"
          rules={[
            {
              required: true,
              message: "Insira seu nome completo!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Como quer ser chamado:"
          rules={[
            {
              required: true,
              message: "Insira um nome de usuário!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email:"
          rules={[
            {
              required: true,
              message: "Insira um email!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Senha:"
          rules={[
            {
              required: true,
              message: "Insira uma senha!",
              min: 8,
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Telefone:"
          rules={[
            {
              required: true,
              message: "insira um telefone!",
            },
          ]}
        >
          <MaskedInput mask={"(00) 000000000"} />
        </Form.Item>
        <Form.Item
          name="company"
          label="Empresa:"
          rules={[
            {
              required: true,
              message: "Insira o nome da empresa!",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="plan"
          label="Plano:"
          rules={[
            {
              required: true,
            },
          ]}
          initialValue={plan}
        >
          <Select defaultValue={plan} style={{ width: 120 }}>
            <Select.Option value={"Básico"}>Prata</Select.Option>
            <Select.Option value={"Intermediário"}>Ouro</Select.Option>
            <Select.Option value={"Premium"}>Diamante</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="typePlan"
          label="Tipo de Plano:"
          rules={[
            {
              required: true,
              message: "Seleciona o tipo de plano!",
            },
          ]}
        >
          <Select style={{ width: 120 }}>
            <Select.Option value={"Mensal"}>Mensal</Select.Option>
            <Select.Option value={"Anual"}>Anual</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
