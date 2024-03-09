import React from "react";
import { useParams } from "react-router-dom";
import { Button, Form, Input, Select, message } from "antd";
import "../../css/Register.css";
import { MaskedInput } from "antd-mask-input";
import { PutRegister } from "../../services/user.ws";
export default function Register() {
  const { plan } = useParams();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const random = Math.floor(Math.random() * 1000);
    const data = {
      ...values,
      phone: Number(values.phone.replace(/\D/g, "")),
      id: random,
    };
    await PutRegister(data);
    form.resetFields();
    message.success("Cadastro realizado com sucesso!");
    window.location.href = "/";
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <Form form={form} name="register" onFinish={onFinish}>
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Enviar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
