import React, { useEffect } from "react";
import { Table, Button, Select, Modal, Form, Input } from "antd";

import { DeleteOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";

const Emails = () => {
  const [emails, setEmails] = React.useState([]);
  const [visibleEmail, setVisibleEmail] = React.useState(false);
  const [email, setEmail] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [form] = Form.useForm();
  useEffect(() => {
    getEmails();
  }, []);

  const getEmails = async () => {
    /*const response = await getEmail();
    if (response.length === 0) {
    } else {
      setEmails(response);
    }*/
  };
  const postEmails = async (type, id) => {
    /* setLoadingEmail(true);
    const body = {
      id: id,
      type: type.join(","),
    };
    await postEmail(body);
    setLoadingEmail(false);
    message.success("Atualizado com sucesso");*/
  };

  const createEmail = async () => {
    // limpar formes

    window.location.reload();
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
      dataIndex: "mail",
      key: "mail",
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
          onChange={(e) => postEmails(e, record.id)}
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
      <Table columns={columnsEmail} dataSource={emails} />;
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
            <Form.Item label="Primeiro Nome" name="Nome">
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
              <Button
                htmlType="submit"
                type="primary"
                disabled={
                  !form.getFieldValue("Email") ||
                  !form.getFieldValue("Nome") ||
                  !form.getFieldValue("Systema")
                }
              >
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
