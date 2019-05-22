function authenticate(requestBody){
    return new Promise((resolve, reject) => {
        fetch(`${config.url}:90/security-web/json/security/login`, requestBody).then(function(response) {
            if (response.status !== 200) {
                reject(response);
                }
        
                // Examine the text in the response
                response.json().then(function(data) {
                resolve(data);
                });
            }
        )
        .catch(function(err) {
            reject(err);
        });
    });
}

function getOrder(accessioningId){
    return new Promise((resolve, reject) => {
        // Real API
        //fetch(`${config.url}:${config.api.order}${accessioningId}`, { credentials: 'include' }).then(function(response) {
        // Mock Json
        fetch("app/assets/mock_json/order1.json").then(function(response) {
            if (response.status !== 200) {
                reject(response);
                }
        
                // Examine the text in the response
                response.json().then(function(data) {
                resolve(data);
                });
            }
        )
        .catch(function(err) {
            reject(err);
        });
    });
}

function getProcessStepResults(accessioningId){
    return new Promise((resolve, reject) => {
        // Real API
        //fetch(`${config.url}:${config.api.processstepresults}${accessioningId}`, { credentials: 'include' }).then(function(response) {
        // Mock Json
        fetch("app/assets/mock_json/processstepresults0.json").then(function(response) {
            if (response.status !== 200) {
                reject(response);
                }
        
                // Examine the text in the response
                response.json().then(function(data) {
                resolve(data);
                });
            }
        )
        .catch(function(err) {
            reject(err);
        });
    });
}
