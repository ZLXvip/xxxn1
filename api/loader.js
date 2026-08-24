export default async function handler(req, res) {
    const { id } = req.query;

    res.setHeader('Content-Type', 'text/plain');
    return res.status(200).send(`
if not _G.Key then
    return warn("[Nexus Security] Por favor define _G.Key antes de ejecutar.")
end

local success, result = pcall(function()
    return game:HttpGet("https://xxxn1.vercel.app/api/get-script?id=${id || ''}&key=" .. tostring(_G.Key))
end)

if not success or result:find("Error") or result:find("Acceso denegado") then
    return warn(result or "[Nexus Security] Error de autenticacion.")
end

loadstring(result)()
    `);
}
