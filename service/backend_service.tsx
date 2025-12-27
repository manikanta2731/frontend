import axios from 'axios';

const API_URL = "http://localhost:8000"

const AXIOS_INSTANCE = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});


export const getAllAgents = async () => {
    try{
        const response = await AXIOS_INSTANCE.get('/agents/');
        if (response?.data) {
            return response.data
        } 
        return []
    } catch(e) {
        return []
    }
}

export const callMCPClientAgent = async (agent, payload) => {
    try{
        let agent_id = agent && agent?.id ? agent.id : 1;
        const response =  await AXIOS_INSTANCE.post('/agents/'+agent_id+'/run', payload);
        if (response?.data) {
            return response.data
        }
        return null
    } catch(e) {
        return null;
    }
}

export const getAllTools = async () => {
    try{
        const response = await AXIOS_INSTANCE.get('/tools/');
        if (response?.data) {
            return response.data
        } 
        return []
    } catch(e) {
        return []
    }
}

export const createToolApi = async (payload) => {
    try{
        const response =  await AXIOS_INSTANCE.post('/tools/create_tool', payload);
        console.log("console ress", response)
        if (response?.data) {
            return response.data
        }
        return null
    } catch(e) {
        return null;
    }
}
