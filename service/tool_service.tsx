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

export const getAgentById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.get('/agents/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const createAgentApi = async (payload) => {
    try{
        const response =  await AXIOS_INSTANCE.post('/agents/create_agent', payload);
        if (response?.data) {
            return response.data
        }
        return null
    } catch(e) {
        return null;
    }
}

export const updateAgentById = async (id, payload) => {
    try{
        const response = await AXIOS_INSTANCE.post('/agents/update_agent/'+id, payload);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const deleteAgentById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.delete('/agents/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
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

export const getToolById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.get('/tools/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const updateToolById = async (id, payload) => {
    try{
        const response = await AXIOS_INSTANCE.post('/tools/update_tool/'+id, payload);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const deleteToolById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.delete('/tools/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}   


export const getAllRags = async () => {
    try{
        const response = await AXIOS_INSTANCE.get('/rags/');
        if (response?.data) {
            return response.data
        } 
        return []
    } catch(e) {
        return []
    }
}  

export const getRagById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.get('/rags/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const createRagApi = async (payload) => {
    try{
        const response =  await AXIOS_INSTANCE.post('/rags/create_rag', payload);
        if (response?.data) {
            return response.data
        }
        return null
    } catch(e) {
        return null;
    }
}

export const updateRagById = async (id, payload) => {
    try{
        const response = await AXIOS_INSTANCE.post('/rags/update_rag/'+id, payload);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}   

export const deleteRagById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.delete('/rags/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const getAllPrompts = async () => {
    try{
        const response = await AXIOS_INSTANCE.get('/prompts/');
        if (response?.data) {
            return response.data
        } 
        return []
    } catch(e) {
        return []
    }
}   

export const getPromptById = async (id) => {    
    try{
        const response = await AXIOS_INSTANCE.get('/prompts/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}   

export const createPromptApi = async (payload) => {
    try{
        const response =  await AXIOS_INSTANCE.post('/prompts/create_prompt', payload);
        if (response?.data) {
            return response.data
        }
        return null
    } catch(e) {
        return null;
    }
}   

export const updatePromptById = async (id, payload) => {
    try{
        const response = await AXIOS_INSTANCE.post('/prompts/update_prompt/'+id, payload);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}   

export const deletePromptById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.delete('/prompts/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    } catch(e) {
        return null
    }
}

export const getAllLLMProviders = async () => {
    try{
        const response = await AXIOS_INSTANCE.get('/llms/');
        if (response?.data) {
            return response.data
        } 
        return []
    } catch(e) {
        return []
    }
}  

export const getLLMProviderById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.get('/llms/'+id);
        if (response?.data) {
            return response.data
        } 
        return null
    }   catch(e) {
        return null 
    }
}


export const deleteLLMProviderById = async (id) => {
    try{
        const response = await AXIOS_INSTANCE.delete('/llms/'+id);
        if (response?.data) {
            return response.data
        }   return null
    } catch(e) {
        return null
    }
}
