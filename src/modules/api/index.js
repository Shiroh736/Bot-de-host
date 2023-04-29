const axios = require("axios");
const { PteroApp } = require('@devnote-dev/pterojs');
const { key, url, app_key } = require('../../config/config.json');
const app = new PteroApp(url, key);

module.exports = class OctopiAPI {

    async getProfile() {
        const res = await axios.get(`${url}/api/client/account`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar o seu perfil.");

        return res.data;
    }

    async getservers() {
        const res = await axios.get(`${url}/api/application/servers`, {
            headers: { Authorization: `Bearer ${app_key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar os servidores.");

        return res.data;
    }

    async getserver(id) {
        const res = await axios.get(`${url}/api/client/servers/${id}`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar o servidor.");

        return res.data;
    }

    async getservera(id) {
        const res = await axios.get(`${url}/api/client/servers/${id}/resources`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar o servidor.");

        return res.data;
    }

    async listfiles(id) {
        const res = await axios.get(`${url}/api/client/servers/${id}/files/list`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar os arquivos.");

        return res.data;
    }

    async serverdel(id) {
        await axios.delete(`${url}/api/application/servers/${id}`, {
            headers: { Authorization: `Bearer ${app_key}` }
        });
    }

    async downloadfile(id, file) {
        const res = await axios.get(`${url}/api/client/servers/${id}/files/download?file=${file}`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar os arquivos.");

        return res.data;
    }

    async getbackup(id, url) {
        const res = await axios.get(`${url}/api/client/servers/${id}/backups`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao consultar os backups.");

        return res.data;
    }

    async serverstart(id) {
        await axios.post(`${url}/api/client/servers/${id}/power`, {
            "signal": "start"
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });
    }

    async serverstop(id) {
        await axios.post(`${url}/api/client/servers/${id}/power`, {

            "signal": "stop",
            "signal": "kill"

        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });
    }

    async serverrestart(id) {
        await axios.post(`${url}/api/client/servers/${id}/power`, {

            "signal": "restart"

        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });
    }

    async compressfile(id, files) {
        const res = await axios.post(`${url}/api/client/servers/${id}/files/compress`, {
            "root": "/",
            "files": files
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao colocar em zip os arquivos.");

        return res.data;
    }

    async serverbackup(id,) {
        const res = await axios.post(`${url}/api/client/servers/${id}/backups`, {
            headers: { Authorization: `Bearer ${key}` }
        });

        if (res.status !== 200)
            throw new Error("Ocorreu um erro ao fazer backup.");

        return res.data;
    }

    async uploadfile(id, file) {
        const res = await axios.post(`${url}/api/client/servers/${id}/files/pull`, {
            "url": file
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });

        if (res.status !== 204)
            throw new Error("Ocorreu um erro ao fazer upload.");

        return res.data;
    }

    async descompressfile(id, files) {
        const res = await axios.post(`${url}/api/client/servers/${id}/files/decompress`, {
            "root": "/",
            "file": files
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });

        if (res.status !== 204)
            throw new Error("Ocorreu um erro ao consultar os arquivos.");

        return res.data;
    }

    async deletefile(id, files) {
        const res = await axios.post(`${url}/api/client/servers/${id}/files/delete`, {
            "root": "/",
            "files": [
                files
            ]
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });

        if (res.status !== 204)
            throw new Error("Ocorreu um erro ao apagar os arquivos.");

        return res.data;
    }

    async change_name(id, name) {
        const res = await axios.post(`${url}/api/client/servers/${id}/files/delete`, {
            "root": "/",
            "files": [
                files
            ]
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });

        if (res.status !== 204)
            throw new Error("Ocorreu um erro ao apagar os arquivos.");

        return res.data;
    }

    async renameserver(id, name) {
        await axios.post(`${url}/api/client/servers/${id}/settings/rename`, {
            "name": name
        },
            {
                headers: { Authorization: `Bearer ${key}` }
            });
    }

    async discordjs(user, name, memory, disk, cpu) {
        const alloc = await app.allocations.fetchAvailable(3, true);
        if (!alloc) return console.log('error para pegar as allocations')

        const res = await app.servers.create({
            name: name,
            user: 1,
            egg: 21,
            description: user,
            dockerImage: 'ghcr.io/parkervcp/yolks:nodejs_18',
            startup: 'if [[ -d .git ]] && [[ {{AUTO_UPDATE}} == \"1\" ]]; then git pull; fi; if [[ ! -z ${NODE_PACKAGES} ]]; then \/usr\/local\/bin\/npm install ${NODE_PACKAGES}; fi; if [[ ! -z ${UNNODE_PACKAGES} ]]; then \/usr\/local\/bin\/npm uninstall ${UNNODE_PACKAGES}; fi; if [ -f \/home\/container\/package.json ]; then \/usr\/local\/bin\/npm install; fi; \/usr\/local\/bin\/node \/home\/container\/{{JS_FILE}}',
            environment: {
                USER_UPLOAD: false,
                AUTO_UPDATE: false,
                JS_FILE: 'index.js'
            },
            limits: {
                memory: memory,
                swap: 0,
                disk: disk,
                io: 500,
                cpu: cpu,
            },
            feature_limits: {
                databases: 0,
                allocations: 0,
                backups: 0
            },
            allocation: {
                default: alloc.id,
            }
        })
        return res;
    }
}