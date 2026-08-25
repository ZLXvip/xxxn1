export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();
    const accept = (req.headers['accept'] || '').toLowerCase();

    // Detectar si están abriendo la URL en un navegador web real (Chrome, Edge, Safari, etc.)
    const isBrowserRequest = accept.includes('text/html') || (userAgent.includes('mozilla') && !userAgent.includes('roblox') && !accept.includes('*/*'));

    // 1. SI LO ABREN EN UN NAVEGADOR WEB: Muestra la pantalla de Acceso Denegado
    if (isBrowserRequest) {
        return res.status(403).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <title>Nexus Security</title>
                <style>
                    body { background: #0f172a; color: #f8fafc; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .card { background: #1e293b; padding: 30px; border-radius: 12px; text-align: center; border: 1px solid #334155; max-width: 400px; }
                    h2 { color: #ef4444; margin-top: 0; }
                    p { color: #94a3b8; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>🚫 Acceso Denegado</h2>
                    <p>Este script solo se puede ejecutar directamente dentro de Roblox.</p>
                </div>
            </body>
            </html>
        `);
    }

    // 2. SI VIENE DE ROBLOX (PC o Android con Delta/cualquier ejecutor): Entrega el script
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

        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(data.code);

    } catch (error) {
        return res.status(500).send('-- Error interno al conectar con la base de datos');
    }
}
