import { AxiosResponse } from "axios";
import { api } from "./api.ws";
interface config {
  id: number;
  name: string;
  company: number;
  style: string;
}

const handleResponse = (response: AxiosResponse) => {
  return response.data;
};

export const getConfig = async (Company: any): Promise<config[]> => {
  const response = await api.get<config[]>("/config/" + Company);
  return handleResponse(response);
};

export const postConfig = async (data: config): Promise<config> => {
  const response = await api.post<config>("/config", data);
  return handleResponse(response);
};

export const putConfig = async (data: config): Promise<config> => {
  const response = await api.put<config>("/config", data);
  return handleResponse(response);
};

export const deleteConfig = async (data: config): Promise<void> => {
  const response = await api.delete(`/config/${data.id}`);
  return handleResponse(response);
};

export const getImgLogo = async (idcomapany: number): Promise<any> => {
  const response = await api.get<any>("/cardapio/companylogo/" + idcomapany);

  return response.data;
};

export const getlogoName = async (comapany: any): Promise<any> => {
  const response = await api.get<any>("/cardapio/logoName/" + comapany);
  return response.data;
};

export const InsertImg = async (data: any): Promise<any> => {
  const response = await api.post<any>("/cardapio/InsertImg", data);
  return response.data;
};
