export default async function handler(req, res) {
    const { id, key } = req.query;

    // Validar que se envíen id y key
    if (!id || !key) {
        return res.status(400).send('-- Error: Faltan parametros (id o key)');
    }

    try {
        // Consultar Firebase en privado desde el servidor
        const firebaseUrl = `https://loaderz1-default-rtdb.firebaseio.com/scripts/${id}.json`;
        const response = await fetch(firebaseUrl);
        const data = await response.json();

        if (!data) {
            return res.status(404).send('-- Error: Script no encontrado');
        }

        // Validar contraseña
        if (data.password !== key) {
            return res.status(403).send('-- Error: Acceso denegado. Key incorrecta.');
        }

        // Si la clave coincide, entrega solo el código Luau limpio
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(data.code);

    } catch (error) {
        return res.status(500).send('-- Error interno al conectar con Firebase');
    }
}