export default async function handler(req, res) {
    const { id } = req.query;
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();

    // Detectar si lo están abriendo desde un navegador (Chrome, Edge, Firefox, Safari, Mobile Chrome, etc.)
    const isBrowser = userAgent.includes('mozilla') || userAgent.includes('chrome') || userAgent.includes('safari') || userAgent.includes('edg');

    // 1. SI LO ABREN EN UN NAVEGADOR: Bloquea el código para que no lo copien
    if (isBrowser) {
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

    // 2. SI VIENE DESDE ROBLOX: Entrega el script limpio inmediatamente
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
