export default async function handler(req, res) {
    const { id, key } = req.query;

    if (!id || !key) {
        return res.status(400).send('-- Error: Faltan parametros (id o key)');
    }

    try {
        const firebaseUrl = `https://loaderz1-default-rtdb.firebaseio.com/scripts/${id}.json`;
        const response = await fetch(firebaseUrl);
        const data = await response.json();

        if (!data) {
            return res.status(404).send('-- Error: Script no encontrado');
        }

        if (data.password !== key) {
            return res.status(403).send('-- Error: Acceso denegado. Key incorrecta.');
        }

        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(data.code);

    } catch (error) {
        return res.status(500).send('-- Error interno al conectar con Firebase');
    }
}
