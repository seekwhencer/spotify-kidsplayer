import mysql from 'mysql';

export default class AppSetupModel extends MODULECLASS {
    constructor(parent, options) {
        super(parent, options);

        this.pool = mysql.createPool({
            host: `${DB_HOST}`,
            user: `${DB_USER}`,
            password: `${DB_PASS}`,
            database: `${DB_NAME}`,
            waitForConnections: true,
            connectionLimit: 10,
            maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
            idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
            queueLimit: 0
        });

        this.mysql = mysql;
    }

    query(query, data) {
        return new Promise((resolve, reject) => {
            if (data) {
                this.pool.query(query, data, (error, result) => {
                    if (error) throw error;
                    resolve(result);
                });
            } else {
                this.pool.query(query, (error, result) => {
                    if (error) throw error;
                    resolve(result);
                });
            }
        });
    }

    getById(id) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE id = ${id}`;

        return this.query(query).then(result => Promise.resolve(result[0]));
    }

    getAllBy(field, value) {
        const query = `SELECT *
                       FROM ${this.table}
                       WHERE ${field} = '${value}'
                       ORDER BY property ASC`;

        return this.query(query);
    }

    create(data) {
        const query = `INSERT INTO ${this.table}
                       SET ?`;

        return this.query(query, data).then(result => {
            return this.getById(result.insertId);
        });
    }

    update(id, data) {
        const query = `UPDATE ${this.table}
                       SET ?
                       WHERE id = ${this.mysql.escape(id)}`;

        return this.query(query, data);
    }

    updateProperty(prop, value) {
        const data = {value: value.toString()};
        const query = `UPDATE ${this.table}
                       SET ?
                       WHERE property = '${prop}'`;

        return this.query(query, data);
    }

    getAll() {
        const query = `SELECT *
                       FROM ${this.table}
                       ORDER BY property ASC`;

        return this.query(query);
    }

    getProperty(property) {
        return this.getAllBy('property', property)
            .then(properties => {
                if (properties.length === 0)
                    return Promise.resolve(false);

                return Promise.resolve(properties[0].value);
            });
    }

}