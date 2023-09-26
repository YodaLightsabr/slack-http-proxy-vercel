export default async function handler (req, res) {
    const { method, url, headers, body } = req.body;

    let output = '';
    try {
        output = await fetch(url, {
            method,
            headers: headers || {},
            body: method?.toLowerCase() === 'get' ? undefined : body
        }).then(res => res.text());

        console.log('Succeeded');
    } catch (err) {
        console.log('Failed', err);
    }

    res.json({ output });
}