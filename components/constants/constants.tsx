import { pink } from "@mui/material/colors";

export const colorcodes = {
    red: "#FF0000",
    amber: "#FFA500",
    green: "#008000",
    dustysteal: "#6FAFB0",
    skyblue: "#8FD3F4",
    oceandrift: "#3AAED8",
    islandglow: "#38D6E8",
    smokytopaz: "#B05A5A",
    lilacdream: "#B48CFF",
    mintlagoon: "#2FE4B8",
    neonblue: "#1FF2F2",
    pinkrose: "#F06FB2",
}


export type ExistingFile = {
    id: number;
    file_name: string;
    file_size: number;
    mime_type: string;
    uploaded_at: string;
};

export interface Tool {
  id?: number;
  name: string;
  description: string;
  api_config: string;
  creator_name: string;
  status: "active" | "maintenance" | "deprecated";
}

export const ApiConfig = {
  type: "http",
  url: "",
  method: "",
  auth: {
    type: "",
    headerName: "",
    value: "",
  },
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
  body: {},
}


export const apiMethods = ["GET", "POST", "PUT", "DELETE"];

export const authTypes = ["none", "apiKey", "bearer"];
