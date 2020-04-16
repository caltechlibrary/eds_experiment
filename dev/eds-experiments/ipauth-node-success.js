const axios = require('axios');
let url = 'https://eds-api.ebscohost.com/authservice/rest/ipauth';
axios.post(url).then(response => { console.log(response.data.AuthToken); });
