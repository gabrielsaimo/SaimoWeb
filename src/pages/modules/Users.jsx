import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import {
  getUsers,
  postUserAdm,
  putUser,
  admProfile,
  deleteUser,
  GetAdmProfile,
  getListUser,
} from "../../services/user.ws";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";

export default function Users(atualizar) {
  const [data, setData] = useState([]);
  const [active, setActive] = useState(false);
  const [categoria, setCategoria] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [modalList, setModalList] = useState(false);
  const [listUserData, setListUserData] = useState([]);
  const [colaborador, setColaborador] = useState();
  const [Company] = useState(
    JSON.parse(localStorage.getItem("companySelectd")).company
  );
  const [Companys] = useState(
    JSON.parse(localStorage.getItem("dateUser")).user_profile_json
  );

  const [id] = useState(JSON.parse(localStorage.getItem("dateUser")).id);
  const [CompanyList, setCompanyList] = useState();
  const [idcompany] = useState(
    JSON.parse(localStorage.getItem("companySelectd")).idcompany
  );
  const [dataEdit, setDataEdit] = useState();

  useEffect(() => {
    gtUser();
    getProfilesList();
  }, [active, atualizar]);

  const gtUser = async () => {
    await getUsers(idcompany).then((users) => {
      if (users.length === 0) return message.error("Nenhum usuário encontrado");
      setData(users);
      getList(users);
    });
  };

  const getList = async (users) => {
    await getListUser(
      Companys.map((company) => `${company.idcompany}`).join("-"),
      users.map((company) => `${company.id}`).join("-")
    ).then((resp) => {
      setListUserData(resp);
    });
  };

  const confirmDelete = (data) => {
    onDelete(data);
  };

  const onDelete = async (data) => {
    await deleteUser(data.id, idcompany);
    setActive(!active);
    window.location.reload();
  };

  const getProfilesList = async () => {
    const companyProfile = await GetAdmProfile(id);
    setCompanyList(companyProfile);
  };

  const onChange = (value, data) => {
    const body = {
      id: data.id,
      categoria: data.categoria,
      active: value,
      idcompany: idcompany,
      company: Company,
    };
    postUserAdm(body);
    setActive(!active);
    window.location.reload();
  };
  const onChangeCategory = (value, data) => {
    data.user_profile_json.forEach((company) => {
      if (Company === company.company) {
        const body = {
          id: company.id,
          categoria: value,
        };

        postUserAdm(body);
      }
    });
    setActive(!active);
    gtUser();
  };

  const ModalShow = (_) => {
    setModalEdit(true);
    setDataEdit(_);
  };

  const onChangeCompany = (value) => {
    setSelectedCompanies([...selectedCompanies, value]);
  };
  const [form] = Form.useForm();
  const Novo = async () => {
    setShowModal(false);
    const body = {
      id: data.length + 1 + Math.floor(Math.random() * 100000000),
      name: name,
      email: email,
      password: Company + "@" + name,
      categoria: categoria,
      active: true,
      idcompany: idcompany,
    };
    const resp = await putUser(body);
    const userProfile = {
      id_user: resp[0].id,
      idcompany: idcompany,
      company: Company,
      category: categoria,
    };

    await admProfile(userProfile);
    setName("");
    setEmail("");
    setCategoria(null);
    setActive(!active);
    window.location.reload();
  };
  const cancelar = () => {
    setName("");
    setEmail("");
    setCategoria(null);
    setShowModal(false);
  };

  const alocar = async (data) => {
    const userProfile = {
      id_user: data.id,
      idcompany: idcompany,
      company: Company,
      category: data.categoria,
    };

    await admProfile(userProfile);
    setName("");
    setEmail("");
    setCategoria(null);
    setActive(!active);
    window.location.reload();
  };
  const [selectedCompanies, setSelectedCompanies] = useState([]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
      render: (_, categoria) => (
        <>
          <Select
            defaultValue={_}
            style={{ width: 120 }}
            onChange={(value) => onChangeCategory(value, categoria)}
          >
            <Select.Option value={"ADM"}>ADM</Select.Option>
            <Select.Option value={"Gerência"}>Gerente</Select.Option>
            <Select.Option value={"Garçom"}>Garçom</Select.Option>
            <Select.Option value={"Cozinha"}>Cozinherio</Select.Option>
          </Select>
        </>
      ),
    },
    {
      title: "Ativo/Inativo",
      dataIndex: "active",
      key: "active",
      render: (_, active) => (
        <>
          <Select
            defaultValue={_}
            onChange={(value) => onChange(value, active)}
          >
            <Select.Option value={true}>Ativo</Select.Option>
            <Select.Option value={false}>Inativo</Select.Option>
          </Select>
        </>
      ),
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      render: (_, data) => (
        <Popconfirm
          title="Tem certeza que deseja excluir esse Usuario?"
          onConfirm={() => confirmDelete(data)}
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
      ),
    },
  ];

  const columnsList = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Empresa",
      dataIndex: "idcompany",
      key: "idcompany",
      render: (_, data) =>
        CompanyList?.map((company) => {
          if (company.idcompany === _)
            return (
              <p key={company.idcompany} style={{ margin: 0 }}>
                {company.company}
              </p>
            );
        }),
    },
    {
      title: "Ações",
      dataIndex: "id",
      key: "id",
      render: (_, data) => (
        <Button
          type="primary"
          onClick={() => {
            alocar(data);
          }}
        >
          Alocar
        </Button>
      ),
    },
  ];
  return (
    <Card className="background-page" style={{ minHeight: "90vh" }}>
      <Button type="primary" onClick={() => setShowModal(true)}>
        Novo
      </Button>

      <Button
        type="primary"
        style={{ marginLeft: 30 }}
        onClick={() => setModalList(true)}
      >
        Alocar
      </Button>
      <Table columns={columns} dataSource={data} />
      <Modal
        open={showModal}
        onCancel={() => cancelar()}
        okText="Salvar"
        cancelText="Cancelar"
        onOk={() => Novo()}
      >
        <Space direction="vertical">
          <h2>Novo Usuário</h2>
          <Input
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            value={name}
            placeholder="Nome"
            onChange={(e) => setName(e.target.value)}
          />
          <Select
            style={{ width: 120 }}
            showSearch
            value={categoria}
            placeholder="Categoria"
            onChange={(value) => setCategoria(value)}
          >
            <Select.Option value={"ADM"}>ADM</Select.Option>
            <Select.Option value={"Gerência"}>Gerente</Select.Option>
            <Select.Option value={"Garçom"}>Garçom</Select.Option>
            <Select.Option value={"Cozinha"}>Cozinherio</Select.Option>
          </Select>
        </Space>
      </Modal>
      <Modal
        title="Alocar"
        open={modalList}
        onCancel={() => setModalList(false)}
        width={600}
      >
        <h1>Alocar Usuario</h1>
        <Table columns={columnsList} dataSource={listUserData} />
      </Modal>

      <Modal
        title="Basic Modal"
        open={modalEdit}
        onCancel={() => setModalEdit(false)}
      >
        <Button type="primary" onClick={() => setShowModal(true)}>
          Adicionar empresa
        </Button>

        <Form
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 18,
          }}
          form={form}
          name="dynamic_form_complex"
          style={{
            maxWidth: 600,
          }}
          autoComplete="off"
          initialValues={{
            items: [{}],
          }}
        >
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <div
                style={{
                  display: "flex",
                  rowGap: 16,
                  flexDirection: "column",
                }}
              >
                {fields.map((field) => (
                  <Card
                    size="small"
                    title={`Empresa ${field.name + 1}`}
                    key={field.key}
                    extra={
                      <CloseOutlined
                        onClick={() => {
                          remove(field.name);
                        }}
                      />
                    }
                  >
                    <Form.Item label="Empresa" name={[field.name, "Company"]}>
                      <Select
                        onChange={(value) => onChangeCompany(value)}
                        style={{ width: "100%" }}
                      >
                        {CompanyList?.filter(
                          (company) =>
                            !selectedCompanies.includes(company.company)
                        ).map((company) => (
                          <Select.Option
                            key={company.company}
                            value={company.company}
                          >
                            {company.company}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      label="Categoria"
                      name={[field.name, "Category"]}
                    >
                      <Select
                        style={{ width: 120 }}
                        showSearch
                        value={categoria}
                        placeholder="Categoria"
                        onChange={(value) => setCategoria(value)}
                      >
                        <Select.Option value={"ADM"}>ADM</Select.Option>
                        <Select.Option value={"Gerência"}>
                          Gerente
                        </Select.Option>
                        <Select.Option value={"Garçom"}>Garçom</Select.Option>
                        <Select.Option value={"Cozinha"}>
                          Cozinherio
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Card>
                ))}

                <Button type="dashed" onClick={() => add()} block>
                  + Add Item
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item noStyle shouldUpdate>
            {() => (
              <Typography>
                <pre>{JSON.stringify(form.getFieldsValue(), null, 2)}</pre>
              </Typography>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
