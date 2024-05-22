import { api } from "./api.ws";

interface User {
  id: number;
  name: string;
  password: string;
  active: boolean;
  categoria: string;
}

export const getUser = async (data: User): Promise<User> => {
  try {
    const response = await api.post<User>("/user", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    throw error;
  }
};

export const getUsers = async (idCompany: number): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/user/adm/" + idCompany);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter usuários:", error);
    throw error;
  }
};

export const putUser = async (data: User): Promise<User> => {
  const response = await api.put<User>("/user", data);
  return response.data;
};
export const postUser = async (data: User): Promise<User> => {
  const response = await api.post<User>("/user", data);
  return response.data;
};

export const postUserAdm = async (data: User): Promise<User> => {
  const response = await api.post<User>("/user/adm", data);
  return response.data;
};

export const deleteUser = async (
  id: number,
  idcompany: number
): Promise<void> => {
  await api.delete<User>(`/user/${id}/${idcompany}`);
};

export const postStyles = async (data: any): Promise<any> => {
  const response = await api.post<User>("/user/styles", data);
  return response.data;
};

export const getStyles = async (
  company: string,
  idcompany: number
): Promise<any[]> => {
  const response = await api.get<User[]>(
    `/user/styles/${idcompany}/${company}`
  );
  return response.data;
};

export const validadaEmail = async (email: string): Promise<any> => {
  const response = await api.get<User>("/user/validadaEmail/" + email);
  return response.data;
};

export const sendUserEmail = async (data: any): Promise<any> => {
  const response = await api.post<User>("/user/email", data);
  return response.data;
};

export const PostUserPassword = async (data: any): Promise<any> => {
  const response = await api.post<User>("/user/newPassword", data);
  return response.data;
};

export const PutRegister = async (data: any): Promise<any> => {
  const response = await api.put<any>("/user/register", data);
  return response.data;
};

export const GetAdmProfile = async (id: number): Promise<any> => {
  const response = await api.get<any>("/user/admProfile/" + id);
  return response.data;
};

export const DeleteAdmProfile = async (id: number): Promise<any> => {
  const response = await api.delete<any>("/user/deleteAdmProfile/" + id);
  return response.data;
};

export const PutEmpresa = async (data: any): Promise<any> => {
  const response = await api.put<any>("/user/empresa", data);
  return response.data;
};

export const admProfile = async (data: any): Promise<any> => {
  const response = await api.put<any>("/user/admProfile", data);
  return response.data;
};

export const getEmails = async (idcompany: number): Promise<any> => {
  const response = await api.get<any>("/user/emails/" + idcompany);
  return response.data;
};

export const putEmail = async (data: any): Promise<any> => {
  const response = await api.put<any>("/user/email", data);
  return response.data;
};

export const postEmail = async (data: any): Promise<any> => {
  const response = await api.post<any>("/user/emails", data);
  return response.data;
};

export const deleteCompany = async (id: number): Promise<any> => {
  const response = await api.delete<any>("/user/company/" + id);
  return response.data;
};

export const getListUser = async (
  compnays: any,
  id_users: any
): Promise<any> => {
  const response = await api.get<any>(`/user/listUser/${compnays}/${id_users}`);
  return response.data;
};
