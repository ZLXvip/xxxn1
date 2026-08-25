export default async function handler(req, res) {
    const { id } = req.query;
    const accept = (req.headers['accept'] || '').toLowerCase();

    // La respuesta SIEMPRE será texto plano para no congelar Roblox
    res.setHeader('Content-Type', 'text/plain');

    // Si la petición viene de un navegador web (pide text/html), bloquea con texto simple
    if (accept.includes('text/html')) {
        return res.status(403).send('-- Acceso Denegado: Este script solo se puede ejecutar dentro de Roblox.');
    }

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

        return res.status(200).send(data.code);

    } catch (error) {
        return res.status(500).send('-- Error interno al conectar con la base de datos');
    }
}
