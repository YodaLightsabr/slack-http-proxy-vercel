export default async function handler (req, res) {
    const { method, url, headers, body } = req.body;

    let output = '';
    try {
        output = await fetch(url, {
            method,
            headers,
            body
        }).then(res => res.text());
    } catch (err) {}

    res.json({ output });
}