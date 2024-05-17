import React, { useEffect } from "react";
import { Table, Button, Select, Modal, Form, Input, message } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import { getEmails, postEmail, putEmail } from "../../services/user.ws";
const Emails = () => {
  const [emails, setEmails] = React.useState([]);
  const [visibleEmail, setVisibleEmail] = React.useState(false);
  const [email, setEmail] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const idcompany = JSON.parse(
    localStorage.getItem("companySelectd")
  ).idcompany;
  const [form] = Form.useForm();
  useEffect(() => {
    getEmailsCompnay();
  }, []);

  const getEmailsCompnay = async () => {
    const response = await getEmails(idcompany);
    if (response.length === 0) {
      message.error("Nenhum Email encontrado");
    } else {
      setEmails(response);
    }
  };

  const createEmail = async () => {
    const body = {
      name: form.getFieldValue("Nome"),
      type: form.getFieldValue("Systema").join(","),
      email: form.getFieldValue("Email"),
      active: true,
      idcompany: idcompany,
    };
    await putEmail(body);
    setVisibleEmail(false);
    form.resetFields();
  };

  const updateEmail = async (id, value) => {
    const body = {
      id: id,
      type: value.join(","),
    };
    await postEmail(body);
    message.success("Sistema Atualizado");
  };

  const confirmDeleteEmail = async (record) => {
    const body = {
      id: record.id,
      active: false,
    };

    getEmailsCompnay();
    message.success("Email Excluido");
  };

  const columnsEmail = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Systema",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <Select
          mode="multiple"
          placeholder="Selecione"
          defaultValue={record.type.split(",") || []}
          onChange={(value) => {
            updateEmail(record.id, value);
          }}
        >
          <Select.Option value="Delivery">Delivery</Select.Option>
          <Select.Option value="Venda">Venda</Select.Option>
        </Select>
      ),
    },
    {
      title: "Ações",
      dataIndex: "acoes",
      key: "acoes",
      render: (text, record) => (
        <div>
          <Popconfirm
            title="Tem certeza que deseja excluir esse Email?"
            onConfirm={() => confirmDeleteEmail(record)}
            okText="Excluir"
            okButtonProps={{ danger: true }}
            cancelText="Cancelar"
          >
            <Button style={{ backgroundColor: "red" }}>
              <DeleteOutlined
                size={24}
                style={{
                  borderRadius: 5,
                  padding: 5,
                  color: "#fff",
                }}
              />
            </Button>
          </Popconfirm>
        </div>
      ),
      width: 200,
    },
  ];
  return (
    <>
      <h2>Emails</h2>
      <Button type="primary" onClick={() => setVisibleEmail(true)}>
        Novo
      </Button>
      <Table columns={columnsEmail} dataSource={emails} />
      <Modal
        title="Novo Email"
        open={visibleEmail}
        onCancel={() => setVisibleEmail(false)}
        footer={false}
      >
        <div
          style={{
            width: "95%",
            marginLeft: "auto",
            marginRight: "auto",
            display: "grid",
            gridGap: "10px",
          }}
        >
          <Form
            layout="vertical"
            form={form}
            initialValues={{ remember: true }}
            onFinish={() => createEmail()}
          >
            <Form.Item
              label="Nome"
              name="Nome"
              rules={[
                {
                  required: true,
                  message: "insira um nome",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="Email"
              rules={[
                {
                  required: true,
                  message: "insira um email Valido",
                  type: "email",
                  pattern: new RegExp(
                    "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$"
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Systema" name="Systema">
              <Select mode="multiple" placeholder="Selecione">
                <Select.Option value="Delivery">Delivery</Select.Option>
                <Select.Option value="Venda">Venda</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Salvar
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Emails;
