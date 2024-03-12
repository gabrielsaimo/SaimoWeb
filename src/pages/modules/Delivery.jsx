import React from "react";
import { Button, Divider, Form, Input, message } from "antd";
import { useParams } from "react-router-dom";

const Delivery = () => {
  const { Company } = useParams();
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(form.getFieldValue("email"));
    console.log(form.getFieldValue("password"));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Delivery</h1>
      <Divider />
      <Form
        form={form}
        style={{ width: "300px" }}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: "Por favor, insira seu email!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Senha"
          name="password"
          rules={[{ required: true, message: "Por favor, insira sua senha!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" onClick={onFinish}>
            Acessar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default Delivery;
