export default async function handler(req, res) {
    const { id } = req.query;
    const accept = (req.headers['accept'] || '').toLowerCase();
    const userAgent = (req.headers['user-agent'] || '').toLowerCase();

    // La respuesta SIEMPRE será texto plano para no afectar los FPS en Roblox
    res.setHeader('Content-Type', 'text/plain');

    // Si abren la URL desde Google Chrome, Safari u otro navegador web
    if (accept.includes('text/html')) {
        // Obtenemos la IP del usuario
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket?.remoteAddress || 'No detectada';
        
        // Vercel detecta el país y ciudad de forma automática en cada petición
        const country = req.headers['x-vercel-ip-country'] || 'Desconocido';
        const city = req.headers['x-vercel-ip-city'] || 'Desconocida';

        // Detectamos el sistema operativo / dispositivo
        let device = 'Dispositivo Desconocido';
        if (userAgent.includes('android')) device = 'Android';
        else if (userAgent.includes('iphone') || userAgent.includes('ipad')) device = 'iPhone / iOS';
        else if (userAgent.includes('windows')) device = 'PC Windows';
        else if (userAgent.includes('macintosh') || userAgent.includes('mac os')) device = 'Mac';
        else if (userAgent.includes('linux')) device = 'Linux';

        // Mensaje de advertencia en formato de comentarios de Lua (no guarda nada en base de datos)
        const alertMsg = `-- ====================================================
-- 🚫 ACCESO DENEGADO: EJECUCIÓN NO AUTORIZADA
-- Este script SOLO se puede ejecutar dentro de Roblox.
-- ====================================================
-- DIRECCIÓN IP  : ${ip}
-- DISPOSITIVO   : ${device}
-- UBICACIÓN     : ${city}, ${country}
-- ====================================================
-- ADVERTENCIA: Intento de extracción de código detectado.
-- Cierra esta pestaña inmediatamente.
-- ====================================================`;

        return res.status(403).send(alertMsg);
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
