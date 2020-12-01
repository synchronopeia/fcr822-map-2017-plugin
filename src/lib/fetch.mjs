import axios from 'axios';

const fetch = (apiBaseUri, pathToJson) => axios.get(`${apiBaseUri}/${pathToJson}`);

export default fetch;
