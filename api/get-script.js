export default async function handler(req, res) {
    const { id, key } = req.query;
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();

    // Detectar si la petición viene de un navegador web (Chrome, Edge, Firefox, etc.)
    const isBrowser = userAgent.includes('mozilla') || userAgent.includes('chrome') || userAgent.includes('safari') || userAgent.includes('edg');

    // 1. SI ABREN EL LINK EN EL NAVEGADOR WEB (Muestra pantalla de seguridad)
    if (isBrowser) {
        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Nexus Security System</title>
                <style>
                    body { background: #0f172a; color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .card { background: #1e293b; padding: 30px; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5); text-align: center; max-width: 400px; width: 90%; border: 1px solid #334155; }
                    h2 { margin-top: 0; color: #38bdf8; }
                    p { color: #94a3b8; font-size: 14px; }
                    input { width: 85%; padding: 12px; margin: 15px 0; border-radius: 6px; border: 1px solid #475569; background: #0f172a; color: #fff; text-align: center; font-size: 16px; outline: none; }
                    button { background: #0284c7; color: white; border: none; padding: 12px 24px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; width: 90%; transition: 0.2s; }
                    button:hover { background: #0369a1; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h2>🔒 Nexus Security</h2>
                    <p>El código directo está protegido contra accesos no autorizados. Ingresa la Key válida para consultar el contenido.</p>
                    <form method="GET" action="/api/get-script">
                        <input type="hidden" name="id" value="${id || ''}">
                        <input type="password" name="key" placeholder="Ingresa la Key aquí" required>
                        <br>
                        <button type="submit">Verificar y Mostrar</button>
                    </form>
                </div>
            </body>
            </html>
        `);
    }

    // 2. SI LA PETICIÓN VIENE DESDE ROBLOX (Ejecuta el loadstring normalmente)
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
        return res.status(500).send('-- Error interno al conectar con la base de datos');
    }
}
