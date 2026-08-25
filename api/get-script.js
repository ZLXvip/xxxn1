export default async function handler(req, res) {
    const { id } = req.query;

    // Forzar a que la respuesta SIEMPRE sea texto plano (código Lua puro)
    res.setHeader('Content-Type', 'text/plain');

    if (!id) {
        return res.status(400).send('-- Error: Falta el parámetro ID');
    }

    try {
        const firebaseUrl = `https://loaderz1-default-rtdb.firebaseio.com/scripts/${id}.json`;
        const response = await fetch(firebaseUrl);
        const data = await response.json();

        if (!data || !data.code) {
            return res.status(404).send('-- Error: Script no encontrado en Firebase');
        }

        // Retorna exclusivamente el código Luau tal cual está guardado
        return res.status(200).send(data.code);

    } catch (error) {
        return res.status(500).send('-- Error interno al conectar con la base de datos');
    }
}
