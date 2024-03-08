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

export const getUsers = async (Company: string): Promise<User[]> => {
  try {
    const response = await api.get<User[]>("/user/adm/" + Company);
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

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete<User>(`/user/${id}`);
};

export const postStyles = async (data: any): Promise<any> => {
  const response = await api.post<User>("/user/styles", data);
  return response.data;
};

export const getStyles = async (company: string): Promise<any[]> => {
  const response = await api.get<User[]>(`/user/styles/${company}`);
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
