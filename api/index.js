export default async function handler (req, res) {
    console.log(req.body, 'body');
    
    const { method, url, headers, body, transformations } = req.body;

    let raw_response = '';
    try {
        raw_response = await fetch(url, {
            method,
            headers: headers || {},
            body: method?.toLowerCase() === 'get' ? undefined : body
        }).then(res => res.text());

        try {
            raw_response = JSON.parse(raw_response);
            console.log('JSON');
        } catch (err) {
            console.log('Not JSON');
        }

        console.log('Succeeded');
    } catch (err) {
        console.log('Failed', err);
    }

    let transformed = {};

    if (transformations) {
        const { run: { stdout } } = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: "node-js",
                version: "18.15.0",
                files: [
                    {
                        name: "index.js",
                        content: `
                            const response = decodeURIComponent("${encodeURIComponent(raw_response)}");

                            const transformFunctionA = ${transformations.a || 'data => data'};
                            const transformFunctionB = ${transformations.b || 'data => data'};
                            const transformFunctionC = ${transformations.c || 'data => data'};
                            const transformFunctionD = ${transformations.d || 'data => data'};
                            
                            let transformOutputA = '';
                            let transformOutputB = '';
                            let transformOutputC = '';
                            let transformOutputD = '';
                            
                            try {
                                transformOutputA = transformFunctionA(response);
                            } catch (err) {
                            
                            }
                            
                            try {
                                transformOutputB = transformFunctionB(response);
                            } catch (err) {
                            
                            }
                            
                            try {
                                transformOutputC = transformFunctionC(response);
                            } catch (err) {
                                
                            }
                            
                            try {
                                transformOutputD = transformFunctionD(response);
                            } catch (err) {
                                
                            }
                            
                            console.log(JSON.stringify({
                                custom_transformed_response_a: transformOutputA,
                                custom_transformed_response_b: transformOutputB,
                                custom_transformed_response_c: transformOutputC,
                                custom_transformed_response_d: transformOutputD
                            }));
                        `,
                        encoding: 'utf8'
                    }
                ]
            })
        }).then(res => res.json());

        transformed = JSON.parse(stdout);
    }

    res.json({ raw_response, ...transformed });
}